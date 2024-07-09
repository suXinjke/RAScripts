// @ts-check
import { AchievementSet, define as $, orNext } from '@cruncheevos/core'

const set = new AchievementSet({ gameId: 11278, title: 'Gran Turismo 2' })

const main = (() => {
  return {
    notInReplayMode: $.one(['', 'Mem', '8bit', 0x0A951C, '!=', 'Value', '', 1]),
    licenseTestIs: (license, testId) => $(
      ['', 'Mem', '16bit', 0x1D5866, '=', 'Value', '', license],
      ['', 'Mem', '8bit', 0x1D5868, '=', 'Value', '', testId],
    ),
    /** @param {number[]} ids */
    carIdIs: (...ids) => orNext(
      ...ids.map(id => $.one(['', 'Mem', '32bit', 0x1D58B8, '=', 'Value', '', id])),
    ),
    licenseFinished: $(
      ['', 'Delta', '8bit', 0x0a9e05, '=', 'Value', '', 0],
      ['', 'Mem', '8bit', 0x0a9e05, '=', 'Value', '', 1],
    )
  }
})()

const licenseNames = {
  1283: "B",
  1027: "A",
  771: "IC",
  515: "IB",
  259: "IA",
  3: "S"
}

const licenseTests = /** @type const */ ([
  [1283, 0, [504236312]],
  [1283, 1, [323803032]],
  [1283, 2, [403462168]],
  [1283, 3, [403534552]],
  [1283, 4, [487403928]],
  [1283, 5, [185406872]],
  [1283, 6, [302855960]],
  [1283, 7, [302855960]],
  [1283, 8, [255907416]],
  [1283, 9, [255907416]],
  [1027, 0, [411050200]],
  [1027, 1, [487416920]],
  [1027, 2, [302855960]],
  [1027, 3, [504144024]],
  [1027, 4, [302855960]],
  [1027, 5, [504144024]],
  [1027, 6, [386758424]],
  [1027, 7, [504223576]],
  [1027, 8, [386758424]],
  [1027, 9, [504223576]],
  [771, 0, [185451416]],
  [771, 1, [403559320]],
  [771, 2, [221558232]],
  [771, 3, [221558232]],
  [771, 4, [504223576]],
  [771, 5, [504223576]],
  [771, 6, [504158424]],
  [771, 7, [302895320]],
  [771, 8, [321675608]],
  [771, 9, [221628440]],
  [515, 0, [487405340]],
  [515, 1, [386707868]],
  [515, 2, [390195352]],
  [515, 3, [308401688]],
  [515, 4, [524343064]],
  [515, 5, [275261208]],
  [515, 6, [411058520]],
  [515, 7, [302895320]],
  [515, 8, [185374552]],
  [515, 9, [243377240]],
  [259, 0, [243377240]],
  [259, 1, [541442456]],
  [259, 2, [308401688]],
  [259, 3, [255915868]],
  [259, 4, [571275100]],
  [259, 5, [275268060]],
  [259, 6, [321676188]],
  [259, 7, [206581976]],
  [259, 8, [403460188]],
  [259, 9, [504177244, 0x1e0d125c]],
  [3, 0, [208760988]],
  [3, 1, [524308568]],
  [3, 2, [487405340]],
  [3, 3, [403510940]],
  [3, 4, [325384156]],
  [3, 5, [275273692, 0x1068579c]],
  [3, 6, [243376732]],
  [3, 7, [386798044]],
  [3, 8, [321676188]],
  [3, 9, [504177308, 0x1e0d129c]]
])

for (const [license, testId, carIds] of licenseTests) {
  const licenseName = licenseNames[license]

  set.addLeaderboard({
    title: `License ${licenseName}-${testId + 1}`,
    description: `Pass License test ${licenseName}-${testId + 1} in least time`,
    lowerIsBetter: true,
    type: 'MILLISECS',
    conditions: {
      start: $(
        main.licenseTestIs(license, testId),
        main.carIdIs(...carIds),
        main.notInReplayMode,
        main.licenseFinished,
      ),
      cancel: '1=0',
      submit: '1=1',
      value: $(['Measured', 'Mem', '32bit', 0x1D5E90, '*', 'Float', '', 0.1])
    }
  })
}

export default set