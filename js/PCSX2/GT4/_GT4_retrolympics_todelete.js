import { AchievementSet, define as $ } from '@cruncheevos/core'
const set = new AchievementSet({ gameId: 20580, title: 'Gran Turismo 4' })

const c = (() => {
  const ptr1 = $.one(['AddAddress', 'Mem', '32bit', 0x621cb4])
  const playerCarPtr = $(
    ptr1,
    ['AddAddress', 'Mem', '32bit', 0x60],
    ['AddAddress', 'Mem', '32bit', 0x8],
    ['AddAddress', 'Mem', '32bit', 0x0],
  )

  const trackIs = (trackId) => $(
    ptr1,
    ['', 'Mem', '32bit', 0x78, '=', 'Value', '', trackId],
  )

  const _gameFlagIs = (flag) => $(
    ['AddAddress', 'Mem', '32bit', 0x622f4c],
    ['', 'Mem', '32bit', 0x3a370, '=', 'Value', '', flag],
  )

  const arcadeQuickTune = (() => {
    const base = $.one(['AddAddress', 'Mem', '32bit', 0x6187a8])
    const powerAdjustIs = (adjust) => $(
      base,
      ['', 'Mem', '32bit', 0x3b0, '=', 'Value', '', adjust],
    )
    const weightAdjustIs = (adjust) => $(
      base,
      ['', 'Mem', '32bit', 0x3ac, '=', 'Value', '', adjust],
    )
    const topSpeedAdjustIs = (adjust) => $(
      base,
      ['', 'Mem', '8bit', 0x3b4, '=', 'Value', '', adjust],
    )

    return {
      tiresAre: (front, rear) => $(
        base,
        ['', 'Mem', '32bit', 0x3b8, '=', 'Value', '', front],
        base,
        ['', 'Mem', '32bit', 0x3bc, '=', 'Value', '', rear],
      ),

      powerAdjustIs,
      weightAdjustIs,
      noPowerAdjust: $(
        powerAdjustIs(0),
        weightAdjustIs(0),
        topSpeedAdjustIs(0)
      )
    }
  })()

  return {
    gameFlagIs: {
      arcadeTimeTrial: _gameFlagIs(0xB)
    },
    arcadeQuickTune,

    carIs: (carId) => $(
      playerCarPtr,
      ['', 'Mem', '32bit', 0x20, '=', 'Value', '', carId],
    ),
    trackIs,

    trackIsNordschleife: trackIs(0x41),

    inASpec: $(
      // check pointer validity
      ptr1,
      ['AddAddress', 'Mem', '32bit', 0x84],
      ['AddAddress', 'Mem', '32bit', 0x58],
      ['', 'Mem', '32bit', 0x30, '!=', 'Value', '', 0],

      ptr1,
      ['AddAddress', 'Mem', '32bit', 0x84],
      ['AddAddress', 'Mem', '32bit', 0x58],
      ['AddAddress', 'Mem', '32bit', 0x30],
      ['', 'Mem', '32bit', 0x1bc, '=', 'Value', '', 0],
    ),

    startedTimeTrial: $(
      ['AddAddress', 'Mem', '32bit', 0x621cb4],
      ['AddAddress', 'Mem', '32bit', 0x84],
      ['AddAddress', 'Mem', '32bit', 0xe420],
      ['', 'Delta', '32bit', 0x1664, '>', 'Value', '', 0],
      ['AddAddress', 'Mem', '32bit', 0x621cb4],
      ['AddAddress', 'Mem', '32bit', 0x84],
      ['AddAddress', 'Mem', '32bit', 0xe420],
      ['', 'Delta', '32bit', 0x1664, '<=', 'Value', '', 63],
      ['AddAddress', 'Mem', '32bit', 0x621cb4],
      ['AddAddress', 'Mem', '32bit', 0x84],
      ['AddAddress', 'Mem', '32bit', 0xe420],
      ['', 'Mem', '32bit', 0x1664, '>', 'Value', '', 63],
    )
  }
})()

set.addLeaderboard({
  title: `RetroOlympics!`,
  description: 'NTSC Arcade Time Trial, BMW M3 `04, Sports Hard tires, power/weight tune at 0%. Do a lap on Nurburgring Nordschleife. Driving aids, cutting the track and crashing is permitted.',
  lowerIsBetter: true,
  type: 'VALUE',
  conditions: {
    start: [
      // NTSC check
      ['AndNext', 'Mem', '32bit', 0x68BB00, '=', 'Value', '', 0x53554353],
      ['', 'Mem', '32bit', 0x68BB04, '=', 'Value', '', 0x3337392D],

      c.carIs(0x28D),
      c.trackIsNordschleife,
      c.gameFlagIs.arcadeTimeTrial,

      c.arcadeQuickTune.tiresAre(3, 3),
      c.arcadeQuickTune.noPowerAdjust,

      c.inASpec,

      c.startedTimeTrial
    ],
    cancel: {
      core: [
        ['AddAddress', 'Mem', '32bit', 0x621cb4],
        ['AddAddress', 'Mem', '32bit', 0x84],
        ['AddAddress', 'Mem', '32bit', 0x58],
        ['OrNext', 'Mem', '32bit', 0x30, '=', 'Value', '', 0],
        ['AddAddress', 'Mem', '32bit', 0x621cb4],
        ['AddAddress', 'Mem', '32bit', 0x84],
        ['AddAddress', 'Mem', '32bit', 0x58],
        ['AddAddress', 'Mem', '32bit', 0x30],
        ['', 'Mem', '32bit', 0x1bc, '!=', 'Value', '', 0],
      ]
    },
    submit: [
      ['AddAddress', 'Mem', '32bit', 0x621cb4],
      ['AddAddress', 'Mem', '32bit', 0x60],
      ['AddAddress', 'Mem', '32bit', 0x8],
      ['AddAddress', 'Mem', '32bit', 0x0],
      ['', 'Mem', '32bit', 0x1ac, '>', 'Delta', '32bit', 0x1ac],
    ],
    value: [
      ['AddAddress', 'Mem', '32bit', 0x621cb4],
      ['AddAddress', 'Mem', '32bit', 0x60],
      ['AddAddress', 'Mem', '32bit', 0x8],
      ['AddAddress', 'Mem', '32bit', 0x0],
      ['Measured', 'Mem', '32bit', 0x11dc],
    ],
  }
})

export default set
