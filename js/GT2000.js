// @ts-check
import { AchievementSet, define as $, trigger, andNext, resetIf, measured, resetNextIf, pauseIf } from '@cruncheevos/core'

const inGame = $.one(['', 'Mem', '16bit', 0x2a0fc4, '=', 'Value', '', 2])
const notInGame = inGame.with({ cmp: '!=' })

const bailedIntoMainMenu = $(
  inGame.with({ flag: 'AndNext', lvalue: { type: 'Delta' } }),
  notInGame
)

const playerIs = (() => {
  const first = $.one(['', 'Mem', '16bit', 0xb71194, '=', 'Value', '', 1])
  const controllingTheCar = $.one(['', 'Mem', '32bit', 0x01fffc4c, '=', 'Value', '', 0])

  const throttle = $.one(['', 'Mem', '16bit', 0xb710dc, '>', 'Value', '', 0])

  return {
    drivingYellowEvo: $.one(['', 'Mem', '8bit', 0x269830, '=', 'Value', '', 4]),

    controllingTheCar,
    watchingReplay: controllingTheCar.with({ rvalue: { value: 1 } }),

    first,
    notFirst: first.with({ cmp: '>' }),

    applying: {
      throttle,
      brakes: $.one(['', 'Mem', '16bit', 0xb710de, '>', 'Value', '', 0]),
      handbrake: $.one(['', 'Mem', '16bit', 0xb710e0, '>', 'Value', '', 0]),
      reverseGear: $.one(['', 'Mem', '8bit', 0xb710e4, '=', 'Value', '', 0]),
    },
    notApplyingEnoughThrottle: $(
      throttle.with({ flag: 'AndNext', cmp: '<', rvalue: { value: 1024 } }),
      throttle.with({ flag: '', cmp: '<', rvalue: { ...throttle.lvalue, type: 'Delta' } })
    )
  }
})()

const playerDidntLap = $.one(['', 'Mem', '32bit', 0xb711c4, '=', 'Value', '', 0])

const playerFinishedLap = $(
  playerIs.controllingTheCar,
  playerDidntLap.with({ flag: 'AndNext', cmp: '>' }),
  playerDidntLap.with({ lvalue: { ...playerDidntLap.lvalue, type: 'Delta' } })
)

const drivingStyleIs = {
  racing: $.one(['', 'Mem', '32bit', 0x1fffcf4, '=', 'Value', '', 0]),
  drift: $.one(['', 'Mem', '32bit', 0x1fffcf4, '=', 'Value', '', 1]),
}

const gearboxIs = {
  auto: $.one(['', 'Mem', '32bit', 0x1fffcf8, '=', 'Value', '', 0]),
  manual: $.one(['', 'Mem', '32bit', 0x1fffcf8, '=', 'Value', '', 1]),
}

const playerWon = $(
  playerIs.first,
  playerFinishedLap
)

const firstFramesOfRaceStart = $(
  ['AndNext', 'Mem', '32bit', 0x00b68acc, '<', 'Value', '', 0x1c10],
  ['', 'Delta', '32bit', 0x00b68acc, '>=', 'Value', '', 0x1c10]
)

const set = new AchievementSet({ gameId: 22999, title: '~Demo~ Gran Turismo 2000' })

set.addAchievement({
  title: "Race On!",
  description: 'Win the race with Racing driving style',
  points: 1,
  conditions: [
    pauseIf(notInGame),
    playerWon,
    drivingStyleIs.racing
  ]
})

set.addAchievement({
  title: "Wow! You've Actually Drifted It!",
  description: 'Win the race with Drift driving style',
  points: 2,
  conditions: [
    pauseIf(notInGame),
    playerWon,
    drivingStyleIs.drift
  ]
})

set.addAchievement({
  title: "I Didn't Know You Could Drive Manual!",
  description: 'Win the race with Manual gearbox',
  points: 3,
  conditions: [
    pauseIf(notInGame),
    playerWon,
    gearboxIs.manual
  ]
})

set.addAchievement({
  title: 'The Final Meme',
  description: 'Win the race while driving Dandelion Yellow EVO V, always stepping on gas and never applying brakes',
  points: 3,
  conditions: [
    andNext(
      'once',
      inGame,
      playerIs.controllingTheCar,
      playerIs.drivingYellowEvo,
      playerIs.applying.throttle,
      firstFramesOfRaceStart,
    ),

    trigger(playerWon),
    resetIf(
      playerIs.notApplyingEnoughThrottle,
      playerIs.applying.brakes,
      playerIs.applying.handbrake,
      playerIs.applying.reverseGear,
      playerIs.watchingReplay,
      notInGame
    )
  ]
})

set.addAchievement({
  title: 'Congratulations! Congratulations! Congratulations!',
  description: 'Win the race three times in a row! Time Out or bailing into main menu without finish will reset the streak.',
  points: 5,
  conditions: {
    core: [
      measured(
        andNext(
          'hits 3',
          inGame,
          playerWon
        )
      )
    ],
    // if player timed out
    alt1: [
      resetIf(
        andNext(
          inGame,
          playerIs.controllingTheCar,
          playerDidntLap,
          $.one(['', 'Mem', '32bit', 0xb68acc, '<=', 'Value', '', 60])
        )
      )
    ],

    // didn't finish first
    alt2: [
      resetIf(
        andNext(
          inGame,
          playerFinishedLap,
          playerIs.notFirst
        )
      )
    ],

    // bailed into menu, but allow it if player won
    alt3: [
      resetNextIf(firstFramesOfRaceStart),
      pauseIf(
        'once',
        andNext(
          inGame,
          playerWon
        )
      ),
      resetIf(
        andNext(
          bailedIntoMainMenu,
          playerIs.controllingTheCar
        )
      )
    ]
  }
})

set.addAchievement({
  title: "Congratulations, You've Won!",
  description: 'Win the race with Automatic gearbox',
  points: 1,
  conditions: [
    pauseIf(notInGame),
    playerWon,
    gearboxIs.auto
  ]
})

set.addLeaderboard({
  title: 'Fastest Evo on Seattle 2000',
  description: 'Lap time in msec',
  lowerIsBetter: true,
  type: 'SCORE',
  conditions: {
    start: [
      inGame,
      playerFinishedLap
    ],
    cancel: '0xfeed=0xcafe',
    submit: '0xcafe=0xcafe',
    value: [
      ['Measured', 'Mem', '32bit', 0xb711c4]
    ]
  }
})

export default set