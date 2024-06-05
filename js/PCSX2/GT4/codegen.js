import '../../common.js'
import * as fs from 'fs'
import * as path from 'path'

/**
 * @template T
 * @typedef {T extends (infer U)[] ? Record<string, U> : T} ArrayToObject
 * **/

const links = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './links.json')).toString())
const tmpDir = path.join(import.meta.dirname, 'tmp')
const forceRefetch = process.argv.includes('refetch')

async function fetchTSV(id) {
  const shouldRefetch = forceRefetch &&
    (process.argv.includes(id) || process.argv.includes('all'))

  const filePath = path.join(tmpDir, `${id}.tsv`)
  if (fs.existsSync(filePath) && shouldRefetch === false) {
    return fs.readFileSync(filePath).toString()
  }

  const link = links[id]
  if (!link) {
    throw new ReferenceError(`no link ${id} defined`)
  }

  console.log(`fetching and caching ${id}`)
  const res = await fetch(link).then(x => x.text())

  fs.writeFileSync(filePath, res)
  return res
}

async function getParsedSheet(id) {
  const tsv = await fetchTSV(id)
  return tsv.split('\r\n').map(x => x.split('\t')).slice(1)
}

/** @returns {Promise<Record<number, string>} */
async function makeCars() {
  const rows = await getParsedSheet('cars')

  return rows.reduce((prev, row) => {
    const id = row[0]
    const name = row[3].replace(/\s+/g, ' ')

    prev[id] = name
    return prev
  }, {})
}

/** @returns {Promise<Record<number, string>} */
async function makeTracks() {
  const rows = await getParsedSheet('tracks')

  return rows.reduce((prev, row) => {
    const id = row[0]
    const name = row[2]

    if (name) {
      prev[id] = name
    }
    return prev
  }, {})
}

function arrayToObject(prev, cur) {
  prev[cur.id] = cur
  return prev
}

async function makeEvents() {
  const [eventRows, subEventRows] = await Promise.all([
    getParsedSheet('events'),
    getParsedSheet('subEvents')
  ])

  const eventArray = eventRows
    .filter((col) => {
      const isLicense = col[1].startsWith('l')
      const shouldNotExclude = col[13].includes('exclude|') === false
      return isLicense === false && shouldNotExclude
    })
    .map((col) => {
      const id = col[1]

      const hasForbiddenCars = Boolean(col[11])
      const carIdsForbidden = hasForbiddenCars ? col[11].split('|').slice(0, -1).map(Number) : []
      const descriptionSuffix = hasForbiddenCars ? col[11].split('|').slice(-1)[0] : ''

      const name = col[2]

      return {
        id,
        name,
        nameWithSuffix: col[12] ? name + ' ' + col[12] : name,

        descriptionSuffix,
        // eventNameSuffix: col[12],
        points: Number(col[3]),
        pointsChallenge: Number(col[4]),
        aSpecAnyEvent: Number(col[5]),
        aSpecAllEvents: Number(col[6]),
        inOneSitting: Boolean(col[7]),
        isChampionship: Boolean(col[8]),
        nitrousAllowed: Boolean(col[9]),

        /** @type {[number, string]} */
        carIdAnyEvent: col[10] ? col[10].split('|').map((x, i) => i === 0 ? Number(x) : x) : [],
        carIdsForbidden,
        noCheese: col[13].includes('noCheese'),
        noPenalty: col[13].includes('noPenalty'),

        /** @type {Array<{ trackId: number, raceId: number}>} */
        races: [],
        get raceIds() {
          return this.races.map(r => r.raceId)
        }
      }
    })

  /** @type ArrayToObject<typeof eventArray> */
  const events = eventArray.reduce(arrayToObject, {})

  /** @type {Record<string, number> */
  const licenseMissionPoints = eventRows
    .filter((col) => {
      const isLicense = col[1].startsWith('l')
      return isLicense
    })
    .reduce((prev, col) => {
      const id = col[1]
      prev[id] = Number(col[3])
      return prev
    }, {})

  subEventRows
    .filter((col) => {
      const isLicense = col[2].startsWith('l')
      const readableName = col[3]
      const isDefinedEvent = Boolean(events[col[2]])

      return readableName != '#N/A' && isLicense === false && isDefinedEvent
    })
    .forEach((col) => {
      const eventId = col[2] // pr_tuning
      const raceId = col[1] // pr_tuning_0500

      const subEventIsNotChampionship = raceId.endsWith('00') === false

      if (subEventIsNotChampionship) {
        events[eventId].races.push({
          trackId: Number(col[6]),
          raceId: Number(col[0])
        })
      }
    })

  const licenseRegex = /^l[0i][abs]/
  const coffeeRegex = /^l0c/

  const licensesAndCoffee = subEventRows
    .filter((col) => col[2].match(licenseRegex) || col[2].match(coffeeRegex))
    .map((col) => {
      const id = col[2] // coffee: l0c0001 , license: lib0016
      const licenses = { 1: 'b', 2: 'a', 3: 'ib', 4: 'ia', 5: 's' }
      const isCoffee = col[2].match(coffeeRegex) !== null

      /** @type {string} */
      const license = isCoffee ? licenses[id.slice(-1)] : id.slice(1, 3).replace('0', '')

      const [pal, ntsc] = col[0].split(', ').map(Number)

      return {
        id,
        name: col[3],
        palFlagAddress: Number(col[4]),
        ntscFlagOffset: Number(col[5]),
        license: license.toUpperCase(),
        index: Number(id.slice(-2)),
        isCoffee,
        points: licenseMissionPoints[id],
        eventId: { pal, ntsc },
      }
    })

  const missionArray = subEventRows
    .filter((col) => col[2].match(/^l0m/))
    .map((col) => {
      const id = col[2] // l0m0017
      const [pal, ntsc] = col[0].split(', ').map(Number)

      return {
        id,
        name: col[3].replace(/ old and new!$/, '!'),
        nameFull: col[3],
        index: Number(id.slice(-2)),
        points: licenseMissionPoints[id],
        eventId: { pal, ntsc },
      }
    })

  /** @type {Record<number, string> */
  const eventLookup = subEventRows
    .filter((col) => col[3] != '#N/A')
    .reduce((prev, col) => {
      const name = col[3]
      const eventIds = col[0].split(', ').map(Number)
      for (const id of eventIds) {
        prev[id] = name
      }

      return prev
    }, {})

  return {
    events,

    /** @type {ArrayToObject<typeof licensesAndCoffee} */
    licenses: licensesAndCoffee.reduce(arrayToObject, {}),

    /** @type {ArrayToObject<typeof missionArray} */
    missions: missionArray.reduce(arrayToObject, {}),

    eventLookup
  }
}

async function makeCarChallenges() {
  const rows = await getParsedSheet('carChallenges')

  return rows.map((col) => {
    let description = col[10]
    let fullDescription = ''
    if (description.startsWith('!')) {
      fullDescription = description.slice(1)
      description = ''
    }

    const target = Number(col[7])

    const eventStringIds = col[4] ? col[4].split(', ') : []
    const raceIndex = col[5] ? Number(col[5]) : -1

    if (eventStringIds.some(trackId => trackId.startsWith('rh_'))) {
      fullDescription = `In any Dirt or Snow rally event of Special Conditions hall, earn ${target} A-Spec points or more in ${description || col[1]}.`
      description = ''
    }

    /** @returns {number} */
    function fallback(str, def) {
      return str.length > 0 ? Number(str) : def
    }

    return {
      /**
       * @type { 'arcadeTimeTrial' | 'aSpecHunt' | 'aSpecHuntPrius' |
       * 'autoUnionTimeTrial' | 'eventWin' | 'oneLap' }
       * */
      type: col[6],
      target,
      name: col[8],
      description,
      fullDescription,
      points: Number(col[9]),
      carIds: col[0] ? col[0].split(', ').map(Number) : [],
      trackIds: col[2] ? col[2].split(', ').map(Number) : [],
      eventStringIds,
      raceIndex,

      /** @type { '' | 'sh' | 'sm' | 'ss' | 'rh' | 'rs' | 'n2' | 'n3' } */
      tires: col[11],
      /** @type { '' | 'manual' } */
      gearbox: col[12],
      /** @type { '' | 'none' } */
      aid: col[13],

      topSpeedTune: fallback(col[14], 0),
      powerTune: fallback(col[15], 0),
      laps: fallback(col[16], -1),
      colorId: fallback(col[17], -1),
    }
  })
}

async function makeAnySubEvents() {
  const rows = await getParsedSheet('anySubEvent')

  return rows.map(col => {
    const eventIds = col[0] ? col[0].split('|') : []

    return {
      eventId: eventIds.length === 1 ? eventIds[0] : '',
      multiEventId: eventIds,
      achievementNameOverride: col[1].startsWith('!') ? col[1].slice(1) : '',
      points: Number(col[2]),
      aSpecPoints: Number(col[3]),
      nitrousAllowed: Boolean(col[4]),
      specificRaceIds: col[5] ? col[5].split('|').map(Number) : [],
      eventDescriptionOverride: col[6],
      carIdsRequired: col[7] ? col[7].split('|').map(Number) : [],
      descriptionSuffix: col[8]
    }
  })
}

async function makeCarEventWin() {
  const rows = await getParsedSheet('carEventWin')

  return rows.map(col => ({
    achName: col[0],
    points: Number(col[1]),
    carIdsRequired: col[2].split(',').map(Number),
    eventId: col[4],
    raceIndex: col[5] ? Number(col[5]) : -1,
    achDescription: col[6]
  }))
}

async function makeArcadeTimeTrial() {
  const rows = await getParsedSheet('arcadeTimeTrial')

  // example input: 8:05'123
  // expected output in msec: 485123
  function extractTime(str = '') {
    const timeString = str.match(/(\d+):(\d{2})'(\d{3})/)
    return (
      Number(timeString[1]) * 60 * 1000 +
      Number(timeString[2]) * 1000 +
      Number(timeString[3])
    )
  }

  function extractTires(str = '') {
    if (str.includes('Normal Comfort')) return 'n2'
    if (str.includes('Normal Road')) return 'n3'
    if (str.includes('Sports Hard')) return 'sh'
    if (str.includes('Sports Soft')) return 'ss'
    if (str.includes('Sports Medium')) return 'sm'
    if (str.includes('Racing Hard')) return 'rh'

    throw new Error('expected tires, got nothing: ' + str)
  }

  return rows.map(col => {
    const description = col[6]
    const powerWeightTuneMatch = description.match(/power.+?(\d+)%/)
    if (!powerWeightTuneMatch) {
      throw new Error('expected power/weight tune, got nothing: ' + description)
    }

    return {
      achName: col[5],
      description: col[6],
      points: Number(col[4]),
      target: extractTime(description),
      carId: Number(col[0]),
      trackId: Number(col[2]),
      tires: extractTires(description),

      /** @type {'' | 'manual'} */
      gearbox: description.includes('manual transmission') ? 'manual' : '',
      /** @type {'' | 'none'} */
      aid: description.includes('no driving aids') ? 'none' : '',
      powerTune: Number(powerWeightTuneMatch[1]),
      topSpeedTune: Number(col[7]),
    }
  })
}

export default async function main() {
  if (fs.existsSync(tmpDir) === false) {
    fs.mkdirSync(tmpDir)
  }

  const [
    carLookup,
    trackLookup,
    carChallenges,
    events,
    anySubEvent,
    carEventWin,
    arcadeTimeTrial
  ] = await Promise.all([
    makeCars(),
    makeTracks(),
    makeCarChallenges(),
    makeEvents(),
    makeAnySubEvents(),
    makeCarEventWin(),
    makeArcadeTimeTrial(),
  ])

  return { carLookup, trackLookup, carChallenges, ...events, anySubEvent, carEventWin, arcadeTimeTrial }
}