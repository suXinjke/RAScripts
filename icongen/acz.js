const fs = require('fs')
const path = require('path')
const inputDirectory = path.join(__dirname, 'input', 'acz')
const outputDirectory = path.join(__dirname, 'output', 'acz')

const { createCanvas, registerFont, Image } = require('canvas')
registerFont(path.join(inputDirectory, '_makisupa.ttf'), { family: 'Makisupa' })

const fontSize = 8

const canvas = createCanvas(64, 64)
const ctx = canvas.getContext('2d')
ctx.font = `${fontSize}px "Makisupa"`

const TopLeft = 0
const TopRight = 1
const BottomRight = 2
const BottomLeft = 3

const badges = {
  'AIRCRAFT_A10_CHALLENGE_01': { text: 'A-10\u2009A', pos: BottomLeft },
  'AIRCRAFT_A10_CHALLENGE_02': { text: 'FAEB', pos: BottomLeft },
  'AIRCRAFT_DRAKEN_CHALLENGE': { text: 'J35J' },
  'AIRCRAFT_EA-18G_CHALLENGE': { text: 'EA-18G', pos: BottomLeft },
  'AIRCRAFT_EA6B_CHALLENGE': { text: 'EA-6B', pos: BottomLeft },
  'AIRCRAFT_F117_CHALLENGE': { text: 'F-117A', pos: BottomLeft },
  'AIRCRAFT_F14D_CHALLENGE': { text: 'F-14D', pos: TopRight },
  'AIRCRAFT_F15C_CHALLENGE': { text: 'F-15C', pos: TopRight },
  'AIRCRAFT_F15E_CHALLENGE': { text: 'F-15E', pos: TopRight },
  'AIRCRAFT_F15SMTD_CHALLENGE': { text: 'F-15S/MTD', pos: BottomLeft },
  'AIRCRAFT_F16XL_CHALLENGE': { text: 'F-16XL', pos: BottomLeft },
  'AIRCRAFT_F16_CHALLENGE': { text: 'F-16C', pos: BottomLeft },
  'AIRCRAFT_F18_CHALLENGE': { text: 'F/A-18C', pos: BottomLeft },
  'AIRCRAFT_F1_CHALLENGE': { text: 'F-1' },
  'AIRCRAFT_F20_CHALLENGE': { text: 'F-20A' },
  'AIRCRAFT_F22_CHALLENGE': { text: 'F/A-22A', pos: BottomLeft },
  'AIRCRAFT_F2_CHALLENGE': { text: 'F-2A', pos: TopRight },
  'AIRCRAFT_F35C_CHALLENGE': { text: 'F-35C', pos: BottomLeft },
  'AIRCRAFT_F4_CHALLENGE': { text: 'F-4E', pos: TopRight },
  'AIRCRAFT_F5E_CHALLENGE': { text: 'F-5E' },
  'AIRCRAFT_FALKEN_CHALLENGE': { text: 'ADF-01', pos: BottomLeft },
  'AIRCRAFT_GRIPEN_CHALLENGE': { text: 'GRIPEN' },
  'AIRCRAFT_MIG21_CHALLENGE': { text: 'MIG-21' },
  'AIRCRAFT_MIG29_CHALLENGE': { text: 'MIG-29A', pos: BottomLeft },
  'AIRCRAFT_MIG31_CHALLENGE': { text: 'MIG-31', pos: BottomLeft },
  'AIRCRAFT_MIRAGE_CHALLENGE': { text: 'MIR-2000D' },
  'AIRCRAFT_MORGAN_CHALLENGE_01': { text: 'ADFX-01', pos: BottomLeft },
  'AIRCRAFT_RAFALE_CHALLENGE': { text: 'RAFALE', pos: BottomRight },
  'AIRCRAFT_SU27_CHALLENGE': { text: 'SU-27', pos: TopRight },
  'AIRCRAFT_SU32_CHALLENGE': { text: 'SU-32', pos: BottomLeft },
  'AIRCRAFT_SU37_CHALLENGE': { text: 'SU-37', pos: TopRight },
  'AIRCRAFT_SU47_CHALLENGE': { text: 'SU-47', pos: TopRight },
  'AIRCRAFT_TORNADO_CHALLENGE': { text: 'TORNADO', pos: BottomLeft },
  'AIRCRAFT_TYPHOON_CHALLENGE': { text: 'TYPHOON', pos: BottomRight },
  'AIRCRAFT_X02_CHALLENGE': { text: 'X-02', pos: BottomLeft },
  'AIRCRAFT_X29A_CHALLENGE': { text: 'X-29A' },
  'AIRCRAFT_YF23A_CHALLENGE': { text: 'YF-23A', pos: BottomLeft },

  'MISSION_01_COMPLETE': { pos: BottomLeft },
  'MISSION_02_COMPLETE': {},
  'MISSION_03_COMPLETE': { pos: BottomLeft },
  'MISSION_04_COMPLETE': { pos: TopRight },
  'MISSION_04A_COMPLETE': { pos: TopRight },
  'MISSION_04B_COMPLETE': { pos: BottomRight },
  'MISSION_04C_COMPLETE': { pos: BottomLeft },
  'MISSION_05_COMPLETE': [
    { pos: BottomLeft },
    { text: 'LANDING', pos: BottomLeft, styleText: 'REGULAR', fileSuffix: 'LANDING_PERFECT' }
  ],
  'MISSION_06_COMPLETE': { pos: TopLeft },
  'MISSION_07_COMPLETE': [
    { pos: BottomLeft },
    { text: 'ONE SHOT', pos: TopLeft, styleText: 'COLD', fileSuffix: 'NO_REFUEL' }
  ],
  'MISSION_08_COMPLETE': [
    {},
    { pos: TopLeft, text: '\u2009!\u2009', styleText: 'REGULAR', fileSuffix: 'EXCALIBUR_NO_DAMAGE' }
  ],
  'MISSION_08A_COMPLETE': { pos: TopLeft },
  'MISSION_08B_COMPLETE': { pos: TopLeft },
  'MISSION_08C_COMPLETE': { pos: TopLeft },
  'MISSION_09_COMPLETE': { pos: BottomLeft },
  'MISSION_10_COMPLETE': {},
  'MISSION_11_COMPLETE': {},
  'MISSION_12_COMPLETE': {},
  'MISSION_13_COMPLETE': [
    { pos: TopLeft },
    { text: 'ONE SHOT', pos: TopLeft, styleText: 'COLD', fileSuffix: 'NO_REFUEL' }
  ],
  'MISSION_14_COMPLETE': {},
  'MISSION_14A_COMPLETE': { pos: BottomLeft },
  'MISSION_14B_COMPLETE': { pos: BottomLeft },
  'MISSION_14C_COMPLETE': { pos: TopLeft },
  'MISSION_15_COMPLETE': { pos: TopLeft },
  'MISSION_16_COMPLETE': { pos: TopLeft },
  'MISSION_17_COMPLETE': [
    {},
    { text: 'REFUEL', pos: TopRight, styleText: 'REGULAR', fileSuffix: 'REFUEL_PERFECT' }
  ],
  'MISSION_18_COMPLETE': {},
  'GAUNTLET_CLEAR': {}
}

function makeBadge({
  imgFile,
  text,
  pos = TopLeft,
  styleText = 'REGULAR',
  border = false
}) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const img = new Image()
  img.src = imgFile
  ctx.drawImage(img, 0, 0)

  const width = Math.ceil(ctx.measureText(text).width)

  let posRay = [0, 0]
  if (pos === TopLeft) {
    posRay = [2, 2]
  } else if (pos === TopRight) {
    posRay = [64 - width - 8, 3]
  } else if (pos === BottomLeft) {
    posRay = [2, 64 - fontSize - 9]
  } else if (pos === BottomRight) {
    posRay = [64 - width - 7, 64 - fontSize - 9]
  }

  const args = [
    posRay[0],
    posRay[1],
    width + 6,
    fontSize + 7
  ]

  if (border) {
    ctx.globalAlpha = styleText === 'CMD' ? 0.9 : 0.5
    ctx.strokeStyle = styleText === 'CMD' ? 'gold' : 'black'
    ctx.lineWidth = 2
    ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1)
    ctx.globalAlpha = 1
    ctx.lineWidth = 1
  }

  if (text) {

    if (styleText === 'AIRCRAFT') {
      args[2] -= 1
      args[3] -= 1

      ctx.fillStyle = '#441100'
      ctx.globalAlpha = 0.55
      ctx.fillRect(...args)

      args[0] += 1
      args[1] += 1
      args[2] -= 2
      args[3] -= 2
      ctx.fillStyle = '#ffff33'
      ctx.fillRect(...args)

    } else if (styleText === 'REGULAR') {
      ctx.fillStyle = '#441100'
      ctx.globalAlpha = 0.6
      ctx.fillRect(...args)

      args[0] += 1.5
      args[1] += 1.5
      args[2] -= 3
      args[3] -= 3

      ctx.strokeStyle = '#cc6600'
      ctx.strokeRect(...args)
    } else if (styleText === 'COLD') {
      ctx.fillStyle = '#0066cc'
      ctx.globalAlpha = 0.6
      ctx.fillRect(...args)

      args[0] += 1.5
      args[1] += 1.5
      args[2] -= 3
      args[3] -= 3

      ctx.strokeStyle = '#00ccff'
      ctx.strokeRect(...args)
    } else if (styleText === 'S_STYLE') {
      args[2] += 1
      args[3] -= 3

      if (pos === TopLeft) {
        args[0] += 1
        args[1] += 1
      } else if (pos === TopRight) {
        args[0] -= 3
      } else if (pos === BottomLeft) {
        args[0] += 1
        args[1] += 1
      } else if (pos === BottomRight) {
        args[0] -= 4
        args[1] += 1
      }

      ctx.globalAlpha = 0.66
      ctx.fillStyle = '#441100'
      ctx.fillRect(...args)

      ctx.globalAlpha = 1
      args[0] += 0.5
      args[1] += 0.5

      ctx.strokeStyle = '#ffcc00'
      ctx.strokeRect(...args)
    }

    ctx.globalAlpha = 1

    args[0] += 2.5
    args[1] += 0.5

    if (styleText === 'AIRCRAFT') {
      ctx.fillStyle = '#221100'
    } else if (styleText === 'COLD') {
      ctx.fillStyle = '#00ccff'
    } else if (styleText === 'REGULAR' || styleText === 'S_STYLE') {
      const color = styleText === 'REGULAR' ? '#cc6600' : '#ffcc00'
      ctx.fillStyle = color

      if (styleText === 'S_STYLE') {
        args[0] += 2
      }
    } else if (styleText === 'CMD') {
      args[1] = 64 - fontSize - 7
      ctx.fillStyle = '#ffcc00'

      ctx.save()
      ctx.shadowColor = '#ffcc00'
      ctx.shadowBlur = 2
    }

    ctx.textBaseline = 'top'
    ctx.fillText(text, args[0], args[1])

    if (styleText === 'CMD') {
      ctx.restore()
    }
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


  for (let filename of filenames) {
    const filenameWithExtension = filename
    filename = path.parse(filename).name

    if (filename.startsWith('RED_CANVAS')) {
      const imgFile = fs.readFileSync(path.join(inputDirectory, filenameWithExtension))

      for (let i = 1; i <= 17; i++) {
        const paddedNumber = i.toString().padStart(2, '0')
        writeBadge({
          path: path.join(outputDirectory, `MISSION_${paddedNumber}_ASSAULT_RECORDS.png`),
          imgFile,
          text: `> LOAD REC ${i}`,
          styleText: 'CMD',
          border: true
        })
      }

    }

    if (filename.endsWith('MEDAL')) {
      const imgFile = fs.readFileSync(path.join(inputDirectory, filenameWithExtension))

      writeBadge({
        path: path.join(outputDirectory, filenameWithExtension),
        imgFile,
        border: true
      })
    }

    const meta = badges[filename]
    if (!meta) {
      continue
    }

    const imgFile = fs.readFileSync(path.join(inputDirectory, filenameWithExtension))

    if (filename.startsWith('MISSION')) {
      writeBadge({
        path: path.join(outputDirectory, filenameWithExtension),
        imgFile,
        border: true
      })

      const metas = Array.isArray(meta) ? meta : [meta]
      for (const meta of metas) {
        writeBadge({
          path: path.join(
            outputDirectory,
            filenameWithExtension.replace('COMPLETE', meta.fileSuffix || meta.text || 'ACE')
          ),
          imgFile,
          text: 'S',
          styleText: 'S_STYLE',
          border: true,
          pos: TopRight,
          ...meta
        })
      }
    } else if (filename.startsWith('AIRCRAFT')) {
      writeBadge({
        path: path.join(outputDirectory, filenameWithExtension),
        imgFile,
        styleText: 'AIRCRAFT',
        border: true,
        ...meta
      })
    }
  }

  // const mis1 = fs.readFileSync(path.join(inputDirectory, 'MISSION_01_COMPLETE.png'))
  // writeBadge({
  //   path: path.join(outputDirectory, 'TEST3.png'),
  //   imgFile: mis1,
  //   text: 'LANDING',
  //   pos: [2, 2]
  // })
  // writeBadge({
  //   path: path.join(outputDirectory, 'TEST.png'),
  //   imgFile: mis1,
  //   text: 'S',
  //   styleText: 'S_STYLE',
  //   pos: [4, 4]
  // })

  // const falken = fs.readFileSync(path.join(inputDirectory, 'AIRCRAFT_FALKEN_CHALLENGE.png'))
  // writeBadge({
  //   path: path.join(outputDirectory, 'TEST2.png'),
  //   imgFile: falken,
  //   text: 'FALKEN',
  //   styleText: 'AIRCRAFT',
  //   pos: [2, 48]
  // })

  // const filenames = fs.readdirSync(inputDirectory)

  // for ( const filename of filenames ) {

  // }
}

main()