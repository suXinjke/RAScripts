const fs = require('fs')
const https = require('https')
const path = require( 'path' )

const links = require('./links.json')

Number.prototype.toHexString = function() {
    return '0x' + this.toString(16)
}

String.prototype.removeQuotesFromHex = function() {
    return this.replace(/"(0x[\dABCDEF]+)"/gi, "$1")
}

String.prototype.toHexString = function() {
    return Number(this).toHexString()
}

function parseTSV(tsv) {
    return tsv.split('\r\n').map(x => x.split('\t'))
}

function fetch(url) {
    return new Promise((resolve, reject) => {
        let data = ''

        https.get(url, (res) => {
            res.on('data', (chunk) => {
                data += chunk
            }).on('end', () => resolve({ res, data }))
        }).on('error', (err) => reject(err))
    })
}

const helpMessage =
`GT4 RATools CodeGen helper
refetch - force refetch of google sheets
makeEvents - make info about events
makeCars - make info about cars
makeCarChallenges - make info about car challenges
makeTracks - make info about tracks
`

const tmpDir = path.join(__dirname, 'tmp')

let forceRefetch = false

async function fetchTSV(id) {
    const filePath = path.join(tmpDir, `${id}.tsv`)
    if (fs.existsSync(filePath) && forceRefetch === false) {
        return fs.readFileSync(filePath).toString()
    }

    const link = links[id]
    if (!link) {
        throw new ReferenceError(`no link ${id} defined`)
    }

    console.log(`fetching and caching ${id}`)
    let res = await fetch(link)

    // google sheets give me redirect
    if (res.res.statusCode >= 300 && res.res.statusCode < 400) {
        res = await fetch(res.res.headers['location'])
    }

    fs.writeFileSync(filePath, res.data)
    return res.data
}

const functions = {
    refetch() {
        forceRefetch = true
    },
    makeCars() {
        fetchTSV('cars')
        .then((tsv) => parseTSV(tsv).slice(1))
        .then((rows) => {
            const cars = rows.reduce((prev, row) => {
                const id = row[0]
                const name = row[3].replace(/\s+/g, ' ')

                prev[Number(id).toHexString()] = name
                return prev
            }, {})

            fs.writeFileSync(
                path.join(tmpDir, 'cars.txt'),
                'carIdToString = ' +
                    JSON.stringify(cars, null, 4).removeQuotesFromHex()
            )
        })
    },
    makeTracks() {
        fetchTSV('tracks')
        .then((tsv) => parseTSV(tsv).slice(1))
        .then((rows) => {
            const tracks = rows.reduce((prev, row) => {
                const id = row[0]
                const name = row[2]

                if (name) {
                    prev[Number(id).toHexString()] = name
                }
                return prev
            }, {})

            fs.writeFileSync(
                path.join(tmpDir, 'tracks.txt'),
                'trackIdToString = ' +
                    JSON.stringify(tracks, null, 4).removeQuotesFromHex()
            )
        })
    },
    makeEvents() {
        Promise.all([fetchTSV('events'), fetchTSV('subEvents')])
        .then((tsv) => tsv.map((x) => parseTSV(x).slice(1)))
        .then(([eventsRange, subEventsRange]) => {
            const eventResult = eventsRange
                .filter((col) => {
                    return (
                        col[1].startsWith('l') === false && col[14] != '1'
                    )
                })
                .reduce((prev, col) => {
                    const id = col[1]

                    prev[id] = {
                        name: col[2],
                        descriptionSuffix: col[15],
                        eventNameSuffix: col[16],
                        points: Number(col[3]),
                        pointsChallenge: Number(col[4]),
                        aSpecAnyEvent: Number(col[5]),
                        aSpecAllEvents: Number(col[6]),
                        inOneSitting: Boolean(col[7]),
                        isChampionship: Boolean(col[8]),
                        nitrousAllowed: Boolean(col[9]),
                        carIdAnyEvent: col[10] ? col[10].split('|') : [],
                        carIdsForbidden: col[11] ? col[11].split('|') : [],
                        noBrokenASpecCars: col[12] == '1',
                        noPenalty: col[13] == '1',
                        events: [],
                    }

                    return prev
                }, {})

            const licenseMissionPoints = eventsRange
                .filter((col) => {
                    return col[1].startsWith('l')
                })
                .reduce((prev, col) => {
                    const id = col[1]

                    prev[id] = Number(col[3])

                    return prev
                }, {})

            subEventsRange
                .filter(
                    (col) =>
                        col[3] != '#N/A' &&
                        col[2].startsWith('l') === false &&
                        Boolean(eventResult[col[2]])
                )
                .forEach((col) => {
                    const id = col[2]
                    const subId = col[1]

                    const raceIndex = Number(subId.slice(-2))

                    if (raceIndex > 0) {
                        eventResult[id].events.push(
                            `$events[${col[6].toHexString()}, ${col[0].toHexString()}]`
                        )
                    }
                })

            function makeLicenseMeta(isCoffee) {
                return function (prev, col) {
                    const id = col[2]

                    let license = ''
                    if (isCoffee) {
                        const licenses = {
                            1: 'b',
                            2: 'a',
                            3: 'ib',
                            4: 'ia',
                            5: 's',
                        }
                        license = licenses[id[id.length - 1]]
                    } else {
                        license = id.slice(1, 3)
                        if (license[0] == '0') {
                            license = license.slice(1)
                        }
                    }

                    const eventId = col[0].split(', ')

                    const obj = {
                        name: col[3],
                        license: license.toUpperCase(),
                        index: Number(id.slice(-2)),
                        isCoffee,
                        points: licenseMissionPoints[id],
                        flags: {
                            pal: col[4],
                            ntscOffset: col[5],
                        },
                        eventId: {
                            pal: eventId[0].toHexString(),
                            ntsc: eventId[1].toHexString(),
                        },
                    }

                    prev[id] = obj
                    return prev
                }
            }

            const licenseResult = subEventsRange
                .filter((col) => col[2].match(/^l[0i][abs]/))
                .reduce(makeLicenseMeta(false), {})

            const coffeeResult = subEventsRange
                .filter((col) => col[2].match(/^l0c/))
                .reduce(makeLicenseMeta(true), {})

            const missionResult = subEventsRange
                .filter((col) => col[2].match(/^l0m/))
                .reduce((prev, col) => {
                    const id = col[2]

                    const eventId = col[0].split(', ')

                    prev[id] = {
                        name: col[3].replace(/ old and new!$/, '!'),
                        nameFull: col[3],
                        index: Number(id.slice(-2)),
                        points: licenseMissionPoints[id],
                        eventId: {
                            pal: eventId[0].toHexString(),
                            ntsc: eventId[1].toHexString(),
                        },
                    }
                    return prev
                }, {})

            const eventLookup = subEventsRange
                .filter((col) => col[3] != '#N/A')
                .reduce((prev, col) => {
                    const name = col[3]
                    const eventId = col[0].split(', ')

                    prev[eventId[0].toHexString()] = name

                    if (eventId.length > 1) {
                        prev[eventId[1].toHexString()] = name
                    }

                    return prev
                }, {})

            const finalResult = [
                ['eventMeta', eventResult],
                ['licenseMeta', { ...licenseResult, ...coffeeResult }],
                ['missionMeta', missionResult],
                ['eventIdToString', eventLookup],
            ].map(([varName, data]) => varName + ' = ' + JSON.stringify(data, null, 4))
            .join('\n\n')
            .replace(/"\$events(.+)"/g, '$1')
            .removeQuotesFromHex()

            fs.writeFileSync(path.join(tmpDir, 'events.txt'), finalResult)
        })
    },

    makeCarChallenges() {
        fetchTSV('carChallenges')
        .then((tsv) => parseTSV(tsv).slice(1))
        .then((rows) => {
            const challenges =  rows.reduce((prev, col) => {
                let description = col[10]
                let fullDescription = ''
                if (description.startsWith('!')) {
                    fullDescription = description.slice(1)
                    description = ''
                }

                const target = Number(col[7])

                const eventStringIds = col[4] ? col[4].split(', ') : []
                const raceIndex = (eventStringIds.length > 0 && col[5].length > 0) ? Number(col[5]) : -1

                if (eventStringIds.some(trackId => trackId.startsWith('rh_'))) {
                    fullDescription = `In any Dirt or Snow rally event of Special Conditions hall, earn ${target} A-Spec points or more in ${description || col[1]}.`
                    description = ''
                }

                function fallback(str, def) {
                    return str.length > 0 ? Number(str) : def
                }

                prev.push({
                    type: col[6],
                    target,
                    name: col[8],
                    description,
                    fullDescription,
                    points: Number(col[9]),
                    carIds: col[0].split(', '),
                    trackIds: col[2] ? col[2].split(', ').map(x => x.toHexString()) : [],
                    eventStringIds,
                    raceIndex,

                    tires: col[11],
                    gearbox: col[12],
                    aid: col[13],
                    topSpeedTune: fallback(col[14], 0),
                    powerTune: fallback(col[15], 0),
                    laps: fallback(col[16], -1),
                    colorId: fallback(col[17], -1),
                })

                return prev
            }, [])

            fs.writeFileSync(
                path.join(tmpDir, 'carChallenges.txt'),
                'carChallenges = ' +
                    JSON.stringify(challenges, null, 4).removeQuotesFromHex()
            )
        })
    }
}

function main() {
    const args = process.argv
        .slice(2)
        .filter(arg => Object.keys(functions).includes(arg))
        .sort().reverse() // so refetch is always first arg

    if (args.length === 0) {
        console.log(helpMessage)
        return
    }

    if (fs.existsSync(tmpDir) === false) {
        fs.mkdirSync(tmpDir)
    }

    for (const arg of args) {
        functions[arg]()
    }
}

main()
