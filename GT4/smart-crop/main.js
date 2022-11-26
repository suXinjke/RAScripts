const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const smartcrop = require('smartcrop-sharp')

async function doTheJob(inputPath, outputPath) {
    const image = await fs.promises.readFile(inputPath)

    const { height, width, x, y } = await smartcrop.crop(image, {
        width: 64,
        height: 64,
        ruleOfThirds: true,
        minScale: 0.5,
        boost: [
            { x: 500, y: 530, width: 64, height: 64, weight: 1 }
        ]
    }).then(x => x.topCrop)

    await sharp(image)
    .extract({ left: x, top: y, width, height, })
    .resize(64, 64)
    .modulate({
        saturation: 1.2,
        brightness: 1.2,
        lightness: 10,
    })
    .toFile(outputPath)
}

async function main() {
    const inputDir = process.argv[2]
    const outputDir = process.argv[3]

    const paths = fs.readdirSync(inputDir).filter(name => name.endsWith('.png'))

    for (let i = 0 ; i < paths.length ; i += 4) {
        const pack = paths.slice(i, i + 4)

        await Promise.all(pack.map(imageName => doTheJob(
            path.join(inputDir, imageName),
            path.join(outputDir, imageName.replace(/(\.)([^.]+)$/, '_processed.$2'))
        )))
    }
}

main()