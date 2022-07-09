const fs = require('fs')
const { createCanvas, Image } = require('canvas')
const path = require('path')

const canvas = createCanvas(64, 64)
const ctx = canvas.getContext('2d')

async function makeBadge({ car, country, medal, plate, background = 'black' }) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (background) {
        ctx.fillStyle = background
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    if (country) {
        const img = new Image()
        img.src = country

        ctx.drawImage(img, 0, 0, 64, 64)
    }

    if (plate) {
        const img = new Image()
        img.src = plate

        ctx.drawImage(img, 0, 0, 64, 64)
    }

    if (car) {
        const img = new Image()
        img.src = car
        ctx.drawImage(img, 0, 0)
    }

    if (medal) {
        const img = new Image()
        img.src = medal

        ctx.save()
        ctx.globalAlpha = 0.88
        ctx.drawImage(img, 64 - 22 - 1, 64 - 32 - 1)
        ctx.restore()
    }

    return canvas.toBuffer()
}

async function writeBadge(params) {
    const { path, ...restOfParams } = params
    const buf = await makeBadge(restOfParams)

    fs.writeFileSync(path, buf)
}

async function main() {
    const inputDirectory = path.join(__dirname, 'input', 'wrc')
    const outputDirectory = path.join(__dirname, 'output', 'wrc')
    if (fs.existsSync(outputDirectory) === false) {
        fs.mkdirSync(outputDirectory, { recursive: true })
    }

    const filenames = fs.readdirSync(inputDirectory)

    const [medalBronze, medalSilver, medalGold] = [
        'Medal-Bronze.png',
        'Medal-Silver.png',
        'Medal-Gold.png',
    ].map(filename => fs.readFileSync(path.join(inputDirectory, filename)))

    for (const filename of filenames) {
        const namePieces = path.parse(filename).name.split('-')
        const type = namePieces[0]

        const file = fs.readFileSync(path.join(inputDirectory, filename))

        if (type === 'Car') {
            const className = namePieces[1]
            const carName = namePieces[2]

            const car = file

            if (className === 'Historic') {
                await writeBadge({
                    path: path.join(outputDirectory, `Car-${className}-${carName}-Bronze.png`),
                    medal: medalBronze,
                    car
                })
                await writeBadge({
                    path: path.join(outputDirectory, `Car-${className}-${carName}-Silver.png`),
                    medal: medalSilver,
                    car
                })
                await writeBadge({
                    path: path.join(outputDirectory, `Car-${className}-${carName}-Gold.png`),
                    medal: medalGold,
                    car
                })
            }

            await writeBadge({
                path: path.join(outputDirectory, filename),
                car,
            })
        } else if (type === 'Plate') {
            await writeBadge({
                path: path.join(outputDirectory, filename),
                plate: file,
                background: '#003366'
            })
        }
    }
}

main()
