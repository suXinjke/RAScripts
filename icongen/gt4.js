const fs = require('fs')
const path = require('path')
const randomSeed = require('random-seed')
const inputDirectory = path.join(__dirname, 'input', 'gt4')
const outputDirectory = path.join(__dirname, 'output', 'gt4')

const { createCanvas, registerFont, Image } = require('canvas')
registerFont(path.join(inputDirectory, '_font.ttf'), { family: 'GT4CodeGenFont' })

const canvas = createCanvas(64, 64)
const ctx = canvas.getContext('2d')

ctx.font = '16px GT4CodeGenFont'
ctx.shadowOffsetX = 1.5;
ctx.shadowOffsetY = 1.5;
ctx.shadowColor = 'rgba(0, 0, 0, 0.60)'

const chili = fs.readFileSync(path.join(inputDirectory, `_chili.png`))

function makeBadge({
    badgeFile,
    licenseCone,
    icon,
    text
}) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (badgeFile) {
        const img = new Image()
        img.src = badgeFile

        ctx.drawImage(img, 0, 0, 64, 64)
    }

    if (icon) {
        let { file, x, y, w, h, alpha = 0.9, times = 1 } = icon

        let totalWidth = w * times

        const img = new Image()
        img.src = file

        ctx.save()
        ctx.globalAlpha = alpha

        for (let i = 0 ; i < times ; i++ ) {
            ctx.drawImage(img, x - totalWidth / 2 + w * i, y - h / 2, w, h)
        }

        ctx.restore()
    }

    if (licenseCone) {
        const { coneFile, background, index } = licenseCone

        const img = new Image()
        img.src = background.file

        ctx.drawImage(img, background.x, background.y, 64, 64, 0, 0, 64, 64)

        ctx.save()
        ctx.fillStyle = '#000'
        ctx.globalAlpha = 0.1
        ctx.fillRect(-2, -2, 66, 66)
        ctx.restore()

        img.src = coneFile
        ctx.drawImage(img, 0, 0, 64, 64)

        ctx.textAlign = 'center'

        ctx.fillStyle = 'white'
        ctx.fillText(index, canvas.width / 2, 48)
    }

    if (text) {
        const {
            value,
            align = 'center', size = 16,
            x = canvas.width / 2, y = 48
        } = text

        let fontString = `${size}px GT4CodeGenFont`

        ctx.textAlign = align
        ctx.fillStyle = 'white'

        ctx.save()
        ctx.font = fontString
        value.split('\n').forEach((piece, index) => {
            ctx.fillText(piece, x, y + index * (size + 1))
        })
        ctx.restore()
    }

    return canvas.toBuffer()
}

function writeBadge(params) {
    const { path, ...restOfParams } = params
    const buf = makeBadge(restOfParams)

    fs.writeFileSync(path, buf)
}

const licenses = [
    { letter: 'b', seed: 1 },
    { letter: 'a', seed: 33 },
    { letter: 'ib', seed: 2 },
    { letter: 'ia', seed: 8 },
    { letter: 's', seed: 22 },
].map(({ letter, seed }) => ({
    letter,
    coneFile: fs.readFileSync(path.join(inputDirectory, `lic-cone-${letter}.png`)),
    backgroundFile: fs.readFileSync(path.join(inputDirectory, `lic-back-${letter}.png`)),
    seed
}))

const eventMeta = {
    pr_supercar:     { range: 5, x: 4, y: 60, align: 'left' },
    pr_gtworld:      { range: 10, x: 60, y: 60, align: 'right' },
    ex_gtallstar:    { range: 10, x: 60, y: 60, align: 'right' },
    ex_dream:        { range: 10, y: 54 },
    ex_polyphony:    { range: 10, y: 54 },
    ex_formula:      { range: ['1-5', '6-10', '11-15'], y: 54 },
    ex_real_circuit: { range: 8, x: 60, y: 14, align: 'right' },
    ex_premium:      { range: 5, x: 60, y: 16, align: 'right' },
    jp_nissan_gtr:   { range: 5, x: 4, y: 58, align: 'left' },
    de_opel_speed:   { range: 5, x: 4, y: 58, align: 'left' },
    fr_peugeot_206:  { range: 5, x: 60, y: 60, align: 'right' },
}

const chiliMeta = {
    am_sunday:            { y: 30 },
    am_ff:                { y: 46 },
    am_fr:                { y: 36 },
    am_4wd:               { y: 52 },
    am_mr:                { y: 52 },
    am_kcar:              { y: 26 },
    am_spider:            { times: 1, alpha: 1, x: 28, y: 33 },
    pr_clubman:           { y: 54 },
    pr_tuning:            {  },
    pr_na:                { y: 50 },
    pr_turbo:             { y: 48 },
    pr_boxer:             { y: 50 },
    pr_compact:           { y: 16 },
    pr_supercar:          { y: 52 }
}

const nationMeta = {
    eu: {
        eureurope:            { text: { value: 'Pan\nEuro', }, chili: { offset: 14 } },
        eurbritish_gt:        { text: { value: 'British\nGT', }, chili: { offset: 14 } },
        eurbritish_light:     { text: { value: 'British\nLight', } },
        eurdeu_touring:       { text: { value: 'DTM', y: 38 }, chili: { offset: 9 } },
        euritaly:             { text: { value: 'La\nFesta\nItaliano', y: 22, size: 12 }, chili: { y: 12 } },
        eurfrench:            { text: { value: 'Tous\nFrance', }, chili: { offset: 14 } },
        eureuro_classic:      { text: { value: 'EU\nClassic', size: 15 } },
        eureuro_hatch:        { text: { value: 'EU\nHot\nHatch', y: 22 }, chili: { textOverride: 'EU\n\nHatch' } },
        eur1000mile:          { text: { value: '1000\nmiglia!' } },
        eurschvartz_a:        { text: { value: 'Liga A', y: 38 }, chili: { offset: 9 } },
        eurschvartz_b:        { text: { value: 'Liga B', y: 38 }, chili: { offset: 9 } },
    },

    us: {
        usrusa:               { text: { value: 'US Cup', size: 15, y: 38 }, chili: { offset: 9 } },
        usrstar:              { text: { value: 'Stars\n&\nStripes', size: 15, y: 22 }, chili: { textOverride: 'Stars\n\nStripes'} },
        usrmuscle:            { text: { value: 'US\nMuscle', size: 15 }, chili: { offset: 12 } },
        usrmuscle_old:        { text: { value: 'US Old\nMuscle', size: 15 }, chili: { offset: 12 } },
    },

    jp: {
        jprjapan:             { text: { value: 'JP Cup', y: 38, size: 15 }, chili: { offset: 9 } },
        jprjgtc:              { text: { value: 'JGTC', y: 38 }, range: 10 },
        jprjp_70:             { text: { value: 'JP 70s', y: 38 }, chili: { offset: 9 } },
        jprjp_80:             { text: { value: 'JP 80s', y: 38 }, chili: { offset: 9 } },
        jprjp_90:             { text: { value: 'JP 90s', y: 38 }, chili: { offset: 9 } },
        jprjp_compact:        { text: { value: 'JP\nLight', size: 15 }, chili: { offset: 14 } },
    }
}

function makeChili(chiliOverrides) {
    return {
        x: 32,
        y: 32,
        times: 3,
        ...chiliOverrides,

        file: chili,
        w: 18,
        h: 18
    }
}

function makeRallyChilli() {
    const fileNames = fs.readdirSync(path.join(inputDirectory, '_events'))
    for (const fileName of fileNames) {
        const eventId = path.parse(fileName).name

        if (eventId.startsWith('rh_') === false) {
            continue
        }

        const badgeFile = fs.readFileSync(path.join(inputDirectory, '_events', `${eventId}.png`))
        for (let index = 0 ; index <= 2 ; index++) {
            writeBadge({
                path: path.join(outputDirectory, `${eventId}-${index}.png`),
                badgeFile,
                icon: makeChili({
                    y: 24,
                    times: index
                })
            })
        }
    }
}

function makeLicenseBadges() {
    for ( const license of licenses ) {
        const backgroundTiles = []
        for ( let x = 0; x < ( license.letter === 'a' ? ( 640 - 64 * 3 ) : 640 ); x += 64 ) {
            for ( let y = 0 + 20; y < 448 + 20; y += 64 ) {
                backgroundTiles.push( { x, y } )
            }
        }

        const gen = randomSeed.create( license.seed )

        for ( let index = 1; index <= 16; index++ ) {
            const randomTileIndex = gen( backgroundTiles.length )
            const randomTile = backgroundTiles[ randomTileIndex ]

            writeBadge( {
                path: path.join( outputDirectory, `license-${license.letter}-${index}.png` ),
                licenseCone: {
                    coneFile: license.coneFile,
                    background: {
                        file: license.backgroundFile,
                        x: randomTile.x,
                        y: randomTile.y
                    },
                    index
                }
            } )

            backgroundTiles.splice( randomTileIndex, 1 )
        }
    }
}

function makeEventBadges() {
    for ( const eventId in eventMeta ) {
        let { range, ...rest } = eventMeta[ eventId ]

        const badgeFile = fs.readFileSync( path.join( inputDirectory, '_events', `${eventId}.png` ) )

        if ( typeof range === 'number' ) {
            range = Array.from( { length: range }, ( v, i ) => ( i + 1 ).toString() )
        }

        range.forEach( ( value, index ) => {
            writeBadge( {
                path: path.join( outputDirectory, `${eventId}-race-${index + 1}.png` ),
                badgeFile,
                text: {
                    value,
                    ...rest
                }
            } )
        } )
    }
}

function makeChilli() {
    for ( const eventId in chiliMeta ) {
        const badgeFile = fs.readFileSync( path.join( inputDirectory, '_events', `${eventId}.png` ) )

        writeBadge( {
            path: path.join( outputDirectory, `${eventId}-chili.png` ),
            badgeFile,
            icon: makeChili( chiliMeta[ eventId ] || {} )
        } )
    }
}

function makeNationBadges() {
    for ( const nationId in nationMeta ) {
        const badgeFile = fs.readFileSync( path.join( inputDirectory, '_events', `${nationId}.png` ) )

        for ( const eventId in nationMeta[ nationId ] ) {
            const { text, chili, range } = nationMeta[ nationId ][ eventId ]

            const badgeText = {
                y: 30,
                ...text,
            }

            let values = [ badgeText ]
            if ( typeof range === 'number' ) {
                values = Array.from( { length: range }, ( v, index ) => ( {
                    ...badgeText,
                    value: `${badgeText.value}\n${index + 1}`,
                    y: badgeText.y - ( badgeText.size || 16 ) / 2
                } ) )
            }

            values.forEach( ( value, index ) => {
                writeBadge( {
                    path: path.join( outputDirectory, `${eventId}-${index}.png` ),
                    badgeFile,
                    text: value
                } )
            } )

            if ( chili ) {
                const chiliIcon = makeChili( chili )
                if ( chili.offset ) {
                    badgeText.y -= chili.offset
                    chiliIcon.y += chili.offset + 2
                }

                if ( chili.textOverride ) {
                    badgeText.value = chili.textOverride
                }

                writeBadge( {
                    path: path.join( outputDirectory, `${eventId}-chili.png` ),
                    badgeFile,
                    text: badgeText,
                    icon: chiliIcon
                } )
            }
        }
    }
}

function main() {
    if (fs.existsSync(outputDirectory) === false) {
        fs.mkdirSync(outputDirectory, { recursive: true })
    }

    makeRallyChilli()
    makeNationBadges()
    makeChilli()
    makeEventBadges()
    makeLicenseBadges()
}

main()
