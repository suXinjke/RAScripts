
/**
 * @typedef {Object} IconCopyTask
 * @property {'copy'} task
 * @property {string} inputFileName
 */

/**
 * @typedef {Object} IconEventRegularTask
 * @property {'eventRegular'} task
 * @property {ArrayValue<typeof meta["events"]>} event
 * @property {number} [index]
 */

/**
 * @typedef {Object} IconLicenseGoldTask
 * @property {'licenseGold'} task
 * @property {string} text
 */

/** @typedef {IconCopyTask | IconEventRegularTask | IconLicenseGoldTask} IconTask */

/** @type Record<string, IconTask> */
const iconTasks = {}

/**
 * @param {string} str
 * @param {IconTask} [task]
 */
function b(str = '', task) {
  if (process.argv.includes('icongen') === false) {
    return undefined
  }

  str = `local\\\\${str}.png`

  if (iconTasks[str]) {
    throw new Error('icon collision: ' + str)
  }

  iconTasks[str] = task

  return str
}

if (process.argv.includes('icongen')) {
  const fs = await import('fs')
  const path = await import('path')
  const { createCanvas, registerFont, Image } = await import('canvas')


  const iconDirPath = path.join(import.meta.dirname, 'icons')
  registerFont(path.join(iconDirPath, 'font.otf'), { family: 'SecretFont' })

  if (!process.env.RACACHE) {
    process.env.RACACHE = fs.readFileSync('./.env').toString().replace('RACACHE=', '')
  }

  const imgCache = {

    /** @returns {import('canvas').Image} */
    read(filePath = '') {
      if (this[filePath]) {
        return this[filePath]
      }
      const img = new Image()
      img.src = fs.readFileSync(path.join(iconDirPath, filePath))

      return this[filePath] = img
    }
  }

  const outputPath = path.join(process.env.RACACHE, 'RACache/Badge')
  const canvas = createCanvas(64, 64)
  const ctx = canvas.getContext('2d')

  /** @param {IconEventRegularTask} task  */
  function drawEventRegular(task) {
    const img = imgCache.read(task.event.idWithoutDifficulty + '.png')
    ctx.drawImage(img, 0, 0, 64, 64)

    if (task.index) {
      ctx.save()

      ctx.globalAlpha = 0.9
      ctx.font = 'italic bold 16px Arial'
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowColor = 'rgba(0, 0, 0, 1)'
      ctx.shadowBlur = 1.5
      ctx.fillStyle = 'white'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'alphabetic'

      const pad = -2
      ctx.fillText(task.index.toString(), 64 + pad, 64 + pad)

      ctx.restore()
    }

    if (task.event.inMultipleLeagues) {
      ctx.globalAlpha = 1
      const difficultyColors = {
        '_e': 'rgba(0, 128, 0,    0.7)',
        '_n': 'rgba(30, 144, 255, 0.7)',
        '_h': 'rgba(255, 0, 0,    0.7)',
      }

      const color = difficultyColors[task.event.id.slice(-2)]
      const gradient = ctx.createLinearGradient(0, 0, 48, 0);
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 4)
    }

    return canvas.toBuffer()
  }

  function drawLicenseGold(text = '') {
    const goldCup = imgCache.read('license-gold.png')

    ctx.fillStyle = '#0031cf'
    ctx.fillRect(0, 0, 64, 64)

    ctx.font = `32px "SecretFont"`
    ctx.fillStyle = '#f0fea2'
    ctx.strokeStyle = '#f0fea2'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'

    const b = ctx.measureText(text)
    const textWidth = b.actualBoundingBoxRight - b.actualBoundingBoxLeft
    ctx.fillText(text, 32 - textWidth / 2, 22)

    const circleCoords = /** @type {const} */ ([32, 46])
    const cupCoords = /** @type {const} */ ([circleCoords[0] - 12, circleCoords[1] - 12])

    ctx.beginPath();
    ctx.arc(...circleCoords, 14, 0, 2 * Math.PI);
    ctx.fillStyle = 'black'
    ctx.fill();

    ctx.drawImage(goldCup, ...cupCoords)

    return canvas.toBuffer()
  }

  for (const [outputFileName, task] of Object.entries(iconTasks)) {
    if (task.task === 'copy') {
      fs.copyFileSync(
        path.join(iconDirPath, task.inputFileName + '.png'),
        path.join(outputPath, outputFileName)
      )
      continue
    }

    ctx.clearRect(0, 0, 64, 64)
    ctx.save()
    const buf = (() => {
      if (task.task === 'eventRegular') return drawEventRegular(task)
      if (task.task === 'licenseGold') return drawLicenseGold(task.text)
    })()
    ctx.restore()

    fs.writeFileSync(path.join(outputPath, outputFileName), buf)
  }
}