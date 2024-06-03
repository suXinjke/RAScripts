// this utility watches a directory with screenshots
// and automatically gives new file a name of currently selected car

const fs = require('fs')
const path = require('path')
const memoryjs = require('memoryjs')

const processObject = memoryjs.openProcess('pcsx2-qtx64-avx2.exe')

const eemem = Number(memoryjs.readMemory(
  processObject.handle,
  processObject.modBaseAddr + 0xFDB040, // offset to eemem symbol, may cease working?
  memoryjs.UINT64
))

const readCarString = () => memoryjs.readMemory(
  processObject.handle,
  eemem + 0xffba50,
  memoryjs.STRING
)

const files = {}

const screenshotDir = process.argv[2]

if (screenshotDir) {
  console.log('watching over', screenshotDir)
  fs.watch(screenshotDir, (e, filename) => {
    if (e == 'rename') {
      files[filename] = true
    }

    if (e == 'change' && files[filename]) {
      const newFilename = readCarString() + '.png'

      fs.rename(
        path.join(screenshotDir, filename),
        path.join(screenshotDir, newFilename),

        (err) => {
          if (err) {
            console.log(err)
          } else {
            console.log('dumped', newFilename)
          }
        }
      )

      delete files[filename]
    }
  })
} else {
  console.log('pass the screenshot directory')
}