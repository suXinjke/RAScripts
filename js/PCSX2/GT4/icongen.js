import * as fs from 'fs'
import * as path from 'path'
import randomSeed from 'random-seed'
const inputDirectory = path.join(import.meta.dirname, 'icons')
const outputDirectory = path.join(import.meta.dirname, 'tmp', 'icon_output')

import { createCanvas, registerFont, Image } from 'canvas'
registerFont(path.join(inputDirectory, '_font.ttf'), { family: 'GT4CodeGenFont' })

const canvas = createCanvas(64, 64)
const ctx = canvas.getContext('2d')

ctx.font = '16px GT4CodeGenFont'
ctx.shadowOffsetX = 1.5;
ctx.shadowOffsetY = 1.5;
ctx.shadowColor = 'rgba(0, 0, 0, 0.60)'

const iconCache = {
  read(filePath) {
    if (this[filePath]) {
      return this[filePath]
    }

    this[filePath] = fs.readFileSync(path.join(inputDirectory, filePath))
    return this[filePath]
  }
}

export function makeBadge(fileName = '') {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  return {
    /**
     * @param {Object} params
     * @param {string|Buffer} params.input
     * @param {number} [params.x]
     * @param {number} [params.y]
     * @param {number} [params.w]
     * @param {number} [params.h]
     */
    bg(params) {
      /** @type Buffer */
      let buf
      if (typeof params.input === 'string') {
        buf = iconCache.read(params.input)
      } else {
        buf = params.input
      }

      const img = new Image()
      img.src = buf

      if (typeof params.x === 'number' && typeof params.y === 'number') {
        ctx.drawImage(img, params.x, params.y, 64, 64, 0, 0, 64, 64)
      } else {
        ctx.drawImage(img, 0, 0, 64, 64)
      }

      return this
    },

    /**
     * @param {Object} params
     * @param {string} params.filePath
     * @param {number} params.x
     * @param {number} params.y
     * @param {number} params.w
     * @param {number} params.h
     * @param {number} [params.alpha]
     * @param {number} [params.times]
     */
    icon(params) {
      const { filePath, x, y, w, h, alpha = 0.9, times = 1 } = params

      let totalWidth = w * times

      const img = new Image()
      img.src = iconCache.read(filePath)

      ctx.save()
      ctx.globalAlpha = alpha

      for (let i = 0; i < times; i++) {
        ctx.drawImage(img, x - totalWidth / 2 + w * i, y - h / 2, w, h)
      }

      ctx.restore()

      return this
    },

    /**
     * @param {Object} params
     * @param {string} params.value
     * @param {string} [params.align]
     * @param {number} [params.size]
     * @param {number} [params.x]
     * @param {number} [params.y]
     */
    text(params) {
      const {
        value,
        align = 'center', size = 16,
        x = canvas.width / 2, y = 48
      } = params

      ctx.textAlign = align
      ctx.fillStyle = 'white'

      ctx.save()
      ctx.font = `${size}px GT4CodeGenFont`
      value.split('\n').forEach((piece, index) => {
        ctx.fillText(piece, x, y + index * (size + 1))
      })
      ctx.restore()

      return this
    },

    /**
     * @param {Object} params
     * @param {string} params.value
     */
    textOverlay(params) {
      const outputText = (params.value + ' ').repeat(10)

      ctx.fillStyle = 'white'
      ctx.textAlign = 'left'

      ctx.save()
      ctx.font = `16px GT4CodeGenFont`
      ctx.globalAlpha = 0.15
      for (let i = 0; i < 6; i++) {
        ctx.fillText(outputText, -i * 18, -2 + i * 14)
      }
      ctx.restore()

      return this
    },

    tint() {
      ctx.save()
      ctx.fillStyle = '#000'
      ctx.globalAlpha = 0.1
      ctx.fillRect(-2, -2, 66, 66)
      ctx.restore()
      return this
    },

    finish() {
      const buf = canvas.toBuffer()
      return {
        dump(outputDir = '') {
          fs.writeFileSync(path.join(outputDir, fileName), buf)
        }
      }
    }
  }
}

const licenses = [
  { letter: 'b', seed: 1 },
  { letter: 'a', seed: 33 },
  { letter: 'ib', seed: 2 },
  { letter: 'ia', seed: 8 },
  { letter: 's', seed: 22 },
].map(({ letter, seed }) => ({
  letter,
  seed
}))

const eventMeta = {
  pr_supercar: { range: 5, x: 4, y: 60, align: 'left' },
  pr_gtworld: { range: 10, x: 60, y: 60, align: 'right' },
  ex_gtallstar: { range: 10, x: 60, y: 14, align: 'right' },
  ex_dream: { range: 10, x: 2, y: 16, align: 'left' },
  ex_polyphony: { range: 10, x: 60, y: 60, align: 'right' },
  ex_formula: { range: ['1-5', '6-10', '11-15'], y: 54 },
  ex_real_circuit: { range: 8, x: 60, y: 14, align: 'right' },
  ex_premium: { range: 5, x: 60, y: 16, align: 'right' },
  jp_nissan_gtr: { range: 5, x: 4, y: 58, align: 'left' },
  de_opel_speed: { range: 5, x: 4, y: 58, align: 'left' },
  fr_peugeot_206: { range: 5, x: 60, y: 60, align: 'right' },
}

const chiliMeta = {
  am_sunday: { y: 30 },
  am_ff: { y: 46 },
  am_fr: { y: 36 },
  am_4wd: { y: 52 },
  am_mr: { y: 52 },
  am_kcar: { y: 26 },
  am_spider: { times: 1, alpha: 1, x: 28, y: 33 },
  am_sixcyl: { times: 1, x: 14, y: 14 },
  pr_clubman: { y: 54 },
  pr_clubman_race: { y: 54 },
  pr_tuning: {},
  pr_na: { y: 50 },
  pr_turbo: { y: 48 },
  pr_boxer: { y: 50 },
  pr_compact: { y: 16 },
  pr_supercar: { y: 52 },
  pr_city: { y: 52 },
  pr_homologation: { times: 1, y: 34 },
  pr_concept: { times: 1, x: 50, y: 40 },
}

const nationMeta = {
  eu: {
    eureurope: { text: { value: 'Pan\nEuro', }, chili: { offset: 14 } },
    eurbritish_gt: { text: { value: 'British\nGT', }, chili: { offset: 14 } },
    eurbritish_light: { text: { value: 'British\nLight', } },
    eurdeu_touring: { text: { value: 'DTM', y: 38 }, chili: { offset: 9 } },
    euritaly: { text: { value: 'La\nFesta\nItaliano', y: 22, size: 12 }, chili: { y: 12 } },
    eurfrench: { text: { value: 'Tous\nFrance', }, chili: { offset: 14 } },
    eureuro_classic: { text: { value: 'EU\nClassic', size: 15 } },
    eureuro_hatch: { text: { value: 'EU\nHot\nHatch', y: 22 }, chili: { textOverride: 'EU\n\nHatch' } },
    eur1000mile: { text: { value: '1000\nmiglia!' } },
    eurschvartz_a: { text: { value: 'Liga A', y: 38 }, chili: { offset: 9 } },
    eurschvartz_b: { text: { value: 'Liga B', y: 38 }, chili: { offset: 9 } },
    grandtour: { text: { value: 'Grand\nTour', y: 26 }, chili: { y: 40, offset: 8 } },
  },

  us: {
    usrusa: { text: { value: 'US Cup', size: 15, y: 38 }, chili: { offset: 9 } },
    usrstar: { text: { value: 'Stars\n&\nStripes', size: 15, y: 22 }, chili: { textOverride: 'Stars\n\nStripes' } },
    usrmuscle: { text: { value: 'US\nMuscle', size: 15 }, chili: { offset: 12 } },
    usrmuscle_hotrod: { text: { value: 'Hot\nRod', size: 15, y: 28 }, chili: { textOverride: 'Hot\n\nRod', y: 22, offset: 7 } },
    usrmuscle_old: { text: { value: 'US Old\nMuscle', size: 15 }, chili: { offset: 12 } },
  },

  jp: {
    jprjapan: { text: { value: 'JP Cup', y: 38, size: 15 }, chili: { offset: 9 } },
    jprjgtc: { text: { value: 'JGTC', y: 38 }, range: 10 },
    jprjgtc_300: { text: { value: 'GT300', y: 38 }, range: 5 },
    jprjgtc_500: { text: { value: 'GT500', y: 38 }, range: 8 },
    jprjp_70: { text: { value: 'JP 70s', y: 38 }, chili: { offset: 9 } },
    jprjp_80: { text: { value: 'JP 80s', y: 38 }, chili: { offset: 9 } },
    jprjp_90: { text: { value: 'JP 90s', y: 38 }, chili: { offset: 9 } },
    jprjp_compact: { text: { value: 'JP\nLight', size: 15 }, chili: { offset: 14 } },
  }
}

const defaultChiliParams = {
  filePath: `_chili.png`,
  x: 32,
  y: 32,
  w: 18,
  h: 18,
  times: 3,
}

function makeRallyChilli() {
  const badges = []
  const fileNames = fs.readdirSync(path.join(inputDirectory, '_events'))
  for (const fileName of fileNames) {
    const eventId = path.parse(fileName).name

    if (eventId.startsWith('rh_') === false) {
      continue
    }

    for (let index = 0; index <= 2; index++) {
      badges.push(makeBadge(`${eventId}-${index}.png`)
        .bg({ input: `_events/${eventId}.png` })
        .icon({
          ...defaultChiliParams,
          y: 24,
          times: index
        })
        .finish()
      )
    }
  }

  return badges
}

function makeLicenseBadges() {
  const badges = []

  for (const license of licenses) {
    const backgroundTiles = []
    for (let x = 0; x < (license.letter === 'a' ? (640 - 64 * 3) : 640); x += 64) {
      for (let y = 0 + 20; y < 448 + 20; y += 64) {
        backgroundTiles.push({ x, y })
      }
    }

    const gen = randomSeed.create(license.seed)

    for (let index = 1; index <= 16; index++) {
      const randomTileIndex = gen(backgroundTiles.length)
      const randomTile = backgroundTiles[randomTileIndex]

      badges.push(
        makeBadge(`license-${license.letter}-${index}.png`)
          .bg({
            input: `lic-back-${license.letter}.png`,
            x: randomTile.x,
            y: randomTile.y
          })
          .tint()
          .icon({
            filePath: `lic-cone-${license.letter}.png`,
            x: 32, y: 32,
            w: 64, h: 64,
            alpha: 1
          })
          .text({
            value: index.toString(),
            x: canvas.width / 2,
            y: 48
          })
          .finish()
      )

      backgroundTiles.splice(randomTileIndex, 1)
    }
  }

  return badges
}

function makeEventBadges() {
  const badges = []
  for (const eventId in eventMeta) {
    let { range, ...textParams } = eventMeta[eventId]
    if (typeof range === 'number') {
      range = Array.from({ length: range }, (v, i) => (i + 1).toString())
    }

    for (let index = 0; index < range.length; index++) {
      const value = range[index]
      badges.push(makeBadge(`${eventId}-race-${index + 1}.png`)
        .bg({ input: `_events/${eventId}.png` })
        .text({
          value,
          ...textParams
        })
        .finish()
      )
    }
  }

  return badges
}

function makeChilli() {
  const badges = []
  for (const eventId in chiliMeta) {
    badges.push(makeBadge(`${eventId}-chili.png`)
      .bg({ input: `_events/${eventId}.png` })
      .icon({
        ...defaultChiliParams,
        ...(chiliMeta[eventId] || {})
      })
      .finish()
    )
  }

  return badges
}

function makeNationBadges() {
  const badges = []

  for (const nationId in nationMeta) {
    for (const eventId in nationMeta[nationId]) {
      const { text, chili, range } = nationMeta[nationId][eventId]

      const badgeText = {
        y: 30,
        ...text,
      }

      let values = [badgeText]
      if (typeof range === 'number') {
        values = Array.from({ length: range }, (v, index) => ({
          ...badgeText,
          value: `${badgeText.value}\n${index + 1}`,
          y: badgeText.y - (badgeText.size || 16) / 2
        }))
      }

      values.forEach((value, index) => {
        badges.push(makeBadge(`${eventId}-${index}.png`)
          .bg({ input: `_events/${nationId}.png` })
          .text(value)
          .finish()
        )
      })

      if (chili) {
        const chiliIconParams = {
          ...defaultChiliParams,
          ...chili
        }
        if (chili.offset) {
          badgeText.y -= chili.offset
          chiliIconParams.y += chili.offset + 2
        }

        if (chili.textOverride) {
          badgeText.value = chili.textOverride
        }

        badges.push(makeBadge(`${eventId}-chili.png`)
          .bg({ input: `_events/${nationId}.png` })
          .text(badgeText)
          .icon(chiliIconParams)
          .finish()
        )
      }
    }
  }

  return badges
}

export function dumpAll() {
  if (fs.existsSync(outputDirectory) === false) {
    fs.mkdirSync(outputDirectory, { recursive: true })
  }

  const icons = [
    ...makeRallyChilli(),
    ...makeNationBadges(),
    ...makeChilli(),
    ...makeEventBadges(),
    ...makeLicenseBadges(),
  ]

  for (const icon of icons) {
    icon.dump(outputDirectory)
  }
}