const fs = require('fs')
const path = require('path')
const inputDirectory = path.join(__dirname, 'input', 'ac3')
const outputDirectory = path.join(__dirname, 'output', 'ac3')

const blackbird = fs.readFileSync(path.join(inputDirectory, '_blackbird.png'))
const heart = fs.readFileSync(path.join(inputDirectory, '_heart.png'))
const pacman = fs.readFileSync(path.join(inputDirectory, '_pacman.png'))

const { createCanvas, registerFont, Image } = require('canvas')
registerFont(path.join(inputDirectory, '_pixeled.ttf'), { family: 'Pixeled'} )

const canvas = createCanvas(64, 64)
const ctx = canvas.getContext('2d')
ctx.font = '5px "Pixeled"'

const TopLeft = 0
const TopRight = 1
const BottomRight = 2
const BottomLeft = 3

const pinkColor = '#ff90a3'

function injectArrays(obj) {
    obj = { ...obj }

    for ( const key in obj ) {
        if ( Array.isArray( obj[key] ) ) {
            continue
        }

        obj[key] = [ obj[key] ]
    }

    return obj
}

function addARanks(obj) {
    obj = { ...obj }

    for ( const key in obj ) {
        obj[key] = obj[key].concat({
            pos: obj[key][0].pos, text: 'A', textColor: 'white', borderColor: '#bd3029'
        })
    }

    return obj
}

const auroraStyle = { borderColor: '#044684', text: 'AURORA' }
const beamStyle = (text = 'Beaming') => ({ borderColor: '#5afb3a', textColor: 'black', text })
const blackbirdStyle = { imgFile2: blackbird }
const craftStyle = { textColor: '#EDEDED', borderColor: '#5d89b3' }
const decideStyle = { borderColor: 'yellow', textColor: 'black', text: 'DECIDE' }
const kiaStyle = { pos: BottomLeft, text: 'KIA', textColor: 'black', borderColor: '#ff7e00' }
const landingStyle = { textColor: '#EDEDED', borderColor: '#5d89b3', text: 'Landing' }
const lowTierStyle = { borderColor: '#a0522d', text: 'Low Tier' }

const missionMetas = addARanks(injectArrays({
    'Mission-0x01': [
        { pos: BottomLeft },
        blackbirdStyle,
        { pos: BottomLeft, ...beamStyle() },
    ],
    'Mission-0x02': { pos: BottomLeft },
    'Mission-0x03': { pos: BottomLeft },
    'Mission-0x04': [
        { pos: TopLeft },
        { pos: TopLeft, ...landingStyle },
        { pos: TopLeft, ...decideStyle },
        { pos: TopLeft, ...auroraStyle },
    ],
    'Mission-0x05': [
        { pos: TopRight },
        blackbirdStyle
    ],
    'Mission-0x06': [
        { pos: BottomRight },
        { pos: TopLeft, icon: pacman, iconX: 6, iconY: 41, ...beamStyle() },
    ],
    'Mission-0x07': [
        { pos: BottomRight },
        { pos: BottomRight, ...landingStyle },
    ],
    'Mission-0x08': { pos: BottomLeft },
    'Mission-0x09': [
        { pos: BottomLeft },
        { pos: BottomLeft, ...decideStyle },
    ],
    'Mission-0x0A': [
        { pos: TopLeft },
        blackbirdStyle
    ],
    'Mission-0x0B': [
        { pos: BottomLeft },
        { pos: BottomLeft, ...beamStyle() },
    ],
    'Mission-0x0C': [
        { pos: BottomLeft },
        blackbirdStyle
    ],
    'Mission-0x0D': { pos: BottomLeft },
    'Mission-0x0E': [
        { pos: BottomRight },
        { pos: TopLeft, ...landingStyle },
        blackbirdStyle,
    ],
    'Mission-0x0F': [
        { pos: BottomRight },
        { pos: BottomRight, ...lowTierStyle },
    ],
    'Mission-0x10': [
        { pos: BottomRight },
        { pos: BottomRight, ...lowTierStyle },
    ],
    'Mission-0x11': { pos: BottomRight },
    'Mission-0x12': { pos: BottomRight },
    'Mission-0x14': { pos: BottomLeft },
    'Mission-0x15': [
        { pos: BottomRight },
        { pos: BottomRight, ...auroraStyle },
    ],
    'Mission-0x16': { pos: BottomRight },
    'Mission-0x17': [
        { pos: BottomLeft },
        blackbirdStyle
    ],
    'Mission-0x18': { pos: TopLeft },
    'Mission-0x19': [
        { pos: TopRight },
        { pos: TopRight, ...landingStyle },
    ],
    'Mission-0x1A': { pos: BottomLeft },
    'Mission-0x1B': { pos: BottomLeft },
    'Mission-0x1C': [
        { pos: BottomLeft },
        { pos: BottomLeft, ...auroraStyle },
    ],
    'Mission-0x1D': [
        { pos: BottomLeft },
        { pos: BottomLeft, ...landingStyle },
        { pos: BottomLeft, ...landingStyle, text: 'Docking' },
        { pos: BottomLeft, ...decideStyle },
    ],
    'Mission-0x1E': { pos: BottomLeft },
    'Mission-0x1F': { pos: BottomLeft },
    'Mission-0x20': [
        { pos: BottomLeft },
        blackbirdStyle
    ],
    'Mission-0x21': [
        { pos: BottomRight },
        { pos: BottomRight, ...landingStyle },
        { pos: BottomRight, ...beamStyle('BEAM SHOW') },
    ],
    'Mission-0x22': { pos: BottomLeft },
    'Mission-0x23': [
        { pos: BottomLeft },
        { pos: BottomLeft, ...auroraStyle },
    ],
    'Mission-0x24': [
        { pos: BottomLeft },
        { pos: TopRight, ...beamStyle('LIQUIBEAMING') },
    ],
    'Mission-0x25': { pos: BottomLeft },
    'Mission-0x26': [
        { pos: BottomRight },
        { pos: BottomRight, ...lowTierStyle },
    ],
    'Mission-0x27': { pos: BottomLeft },
    'Mission-0x28': { pos: BottomRight },
    'Mission-0x29': [
        { pos: BottomLeft },
        { pos: BottomLeft, ...landingStyle },
    ],
    'Mission-0x2A': [
        { pos: TopRight },
        { pos: TopRight, ...landingStyle },
    ],
    'Mission-0x2B': { pos: BottomLeft },
    'Mission-0x2C': [
        { pos: BottomLeft },
        { pos: BottomLeft, ...landingStyle },
        { pos: BottomLeft, ...landingStyle, text: 'Docking' },
        { pos: BottomLeft, ...decideStyle }
    ],
    'Mission-0x2D': [
        { pos: BottomRight },
        { pos: BottomRight, ...lowTierStyle },
    ],
    'Mission-0x2E': { pos: BottomRight },
    'Mission-0x2F': { pos: BottomRight },
    'Mission-0x30': [
        { pos: BottomLeft, },
        blackbirdStyle,
    ],
    'Mission-0x32': { pos: TopLeft, },
    'Mission-0x33': { pos: BottomRight, },
    'Mission-0x34': { pos: BottomRight, },
    'Mission-0x35': { pos: BottomLeft,  },
    'Mission-0x37': [
        { pos: BottomRight },
    ]
}))

const metas = injectArrays({
    ...missionMetas,

    'Aircraft-0x03': { ...craftStyle, pos: BottomRight,   text: 'F-16XA' },
    'Aircraft-0x04': { ...craftStyle, pos: TopLeft,       text: 'F-15S/MT' },
    'Aircraft-0x06': { ...craftStyle, pos: BottomLeft,    text: 'F-22C' },
    'Aircraft-0x07': { ...craftStyle, pos: BottomRight,   text: 'F/A-32C' },
    'Aircraft-0x0A': { ...craftStyle, pos: BottomLeft,    text: 'EF-2000E' },
    'Aircraft-0x0A-Sweat': lowTierStyle,
    'Aircraft-0x0B': { ...craftStyle, pos: BottomRight,   text: 'MiG-33' },
    'Aircraft-0x0C': { ...craftStyle, pos: BottomLeft,    text: 'F/A-18' },
    'Aircraft-0x0D': { ...craftStyle, pos: TopLeft,       text: 'F-16XF' },
    'Aircraft-0x0F': { ...craftStyle, pos: BottomRight, text: 'R-201' },
    'Aircraft-0x10': { ...craftStyle, pos: TopLeft,       text: 'Su-37' },
    'Aircraft-0x12': { ...craftStyle, pos: BottomRight,   text: 'R-101' },
    'Aircraft-0x13': { ...kiaStyle,   pos: BottomRight, text: 'x8', uppercase: false },
    'Aircraft-0x14': { ...craftStyle, pos: TopRight,      text: 'R-102' },
    'Aircraft-0x17': { ...craftStyle, pos: BottomLeft,    text: 'R-311' },
    'Aircraft-0x18': { ...craftStyle, pos: TopRight,    text: 'R-352' },
    'Aircraft-0x19': { ...craftStyle, pos: BottomRight, ...beamStyle('XR-900') },
    'Aircraft-R501': { ...kiaStyle,   pos: BottomLeft, text: 'x2', uppercase: false },
    'Aircraft-GRRefuel': { ...craftStyle, pos: TopRight, text: 'REFUEL' },
    'Aircraft-UPEORefuel': { ...craftStyle, pos: TopLeft, text: 'REFUEL' },
    'Aircraft-Roll': { },
    'Aircraft-Yaw': { },

    'Craft-Antlion': [
        { ...kiaStyle, pos: BottomRight, text: 'x10', uppercase: false },
        { ...craftStyle, borderColor: pinkColor, icon: heart, iconX: 44, iconY: 45 },
    ],
    'Craft-Hydrofoil': { ...craftStyle, borderColor: pinkColor, icon: heart, iconX: 44, iconY: 45 },

    'Face-Cynthia-HairFidget': [kiaStyle],
    'Face-Dision-Salute': {},
    'Face-Dision-Side': blackbirdStyle,
    'Face-Dision-Weird': {},
    'Face-Erich-SideHappy': [kiaStyle],
    'Face-Keith-Angry': { pos: TopLeft, ...beamStyle('OUTBEAMED') },
    'Face-Keith-Grin': [kiaStyle],
    'Face-Keith-SaluteSad': {},
    'Face-Rena-Angry': { borderColor: '#bd3029' },
    'Face-Rena-Side': { borderColor: pinkColor, icon: heart, iconX: 4, iconY: 45 },

    'Misc-Kiwi': { borderColor: pinkColor },
    'Misc-TunnelShortcut': {},

    'AeonGen': { ...kiaStyle,   pos: TopRight, text: 'x10', uppercase: false },
    'Bomb': { pos: BottomRight, text: 'TRICK' },
    'BulletBelt': {},
    'Cutscene-CynthiaGun': {},
    'Cutscene-FionaEnding': {},
    'Eyes': lowTierStyle,
    'GeopeliaLanding': {},
    'Hand': lowTierStyle,
    'Cutscene-RenaNight': {},
    'Cutscene-RenaSmile': {},
    'Cutscene-SimonGlassOff': {},
    'Cutscene-SimonTeeth': lowTierStyle,
    'Cutscene-Sphyrna': { pos: BottomRight, ...beamStyle('BEAMED!') },
    'OuroborosLogoDestroyed': {},
})

function makeBadge({
    imgFile,
    imgFile2,
    text,
    borderColor = 'black',
    borderWidth = 2,
    pos,
    icon,
    iconX,
    iconY,
    textColor = 'white',
    uppercase = true
}) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const img = new Image()
    img.src = imgFile
    ctx.drawImage(img, 0, 0)

    if (imgFile2) {
        img.src = imgFile2
        ctx.drawImage(img, 0, 0)
    }

    ctx.fillStyle = borderColor
    if (borderWidth === 2) {
        ctx.fillRect(0, 0, 2, 64)
        ctx.fillRect(0, 0, 64, 2)
        ctx.fillRect(62, 0, 2, 64)
        ctx.fillRect(0, 62, 64, 2)
    } else if (borderWidth === 1) {
        ctx.fillRect(1, 1, 1, 62)
        ctx.fillRect(1, 1, 62, 1)
        ctx.fillRect(62, 1, 1, 62)
        ctx.fillRect(1, 62, 62, 1)
    }

    if (icon) {
        const img = new Image()
        img.src = icon
        ctx.drawImage(img, iconX, iconY)

        if (icon === pacman) {
            ctx.fillStyle = 'white'
            ctx.textAlign = 'left'
            ctx.fillText('. . . . . .', iconX + 18, iconY + 5)
        }
    }

    if (text) {
        ctx.fillStyle = borderColor

        if (uppercase) {
            text = text.toUpperCase()
        }

        let textPos = [0,0]
        ctx.beginPath()
        const { width } = ctx.measureText(text)

        if (pos === 0) {
            ctx.moveTo(2, 2)
            ctx.lineTo(width + 6, 2)
            ctx.bezierCurveTo(width + 4, 10, width + 5, 10, width, 10)
            ctx.lineTo(2, 10)
            ctx.fill()

            ctx.textAlign = 'left'
            ctx.textBaseline = 'middle' // wtf
            textPos = [ 3, 4 ]
        } else if (pos === 1) {
            ctx.moveTo(62, 2)
            ctx.lineTo(62 - width - 4, 2)
            ctx.bezierCurveTo(62 - width - 3, 10, 62 - width - 2, 10, 62 - width, 10)
            ctx.lineTo(62, 10)
            ctx.fill()

            ctx.textAlign = 'right'
            ctx.textBaseline = 'middle' // wtf
            textPos = [ 62, 4 ]
        } else if (pos === 2) {
            ctx.moveTo(62, 54)
            ctx.lineTo(62 - width, 54)
            ctx.bezierCurveTo(62 - width - 3, 54, 62 - width - 4, 59, 62 - width - 4, 62)
            ctx.lineTo(62, 62)
            ctx.fill()

            ctx.textAlign = 'right'
            ctx.textBaseline = 'alphabetic'
            textPos = [ 62, 62 ]
        } else if (pos === 3) {
            ctx.moveTo(2, 54)
            ctx.lineTo(width, 54)
            ctx.bezierCurveTo(width + 4, 54, width + 5, 55, width + 6, 62)
            ctx.lineTo(2, 62)
            ctx.fill()

            ctx.textAlign = 'left'
            ctx.textBaseline = 'alphabetic'
            textPos = [ 3, 62 ]
        }

        ctx.fillStyle = textColor
        ctx.fillText(text, ...textPos)
    }

    return canvas.toBuffer()
}

function writeBadge(params) {
    const { path, ...restOfParams } = params
    const buf = makeBadge(restOfParams)

    fs.writeFileSync(path, buf)
}

function main() {
    if (fs.existsSync(outputDirectory) === false) {
        fs.mkdirSync(outputDirectory, { recursive: true })
    }

    const filenames = fs.readdirSync(inputDirectory)

    for ( const filename of filenames ) {
        const inputFilenameWithoutExtension = path.parse(filename).name

        const styles = metas[inputFilenameWithoutExtension]
        if (!styles) {
            continue
        }

        styles.forEach((style, i) => {
            const imgFile = fs.readFileSync(path.join(inputDirectory, filename))

            const outputFileName = styles.length > 1 ? `${inputFilenameWithoutExtension}-${i+1}.png` : filename

            writeBadge({
                path: path.join(outputDirectory, outputFileName),
                imgFile,
                ...style
            })
        })
    }
}

main()