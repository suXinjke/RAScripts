// @ts-check
import { AchievementSet, define as $, trigger, andNext, resetIf, measured, resetNextIf, pauseIf } from '@cruncheevos/core'

const inGame = $.one(['', 'Mem', '16bit', 0x2a0fc4, '=', 'Value', '', 2])
const notInGame = inGame.with({ cmp: '!=' })

const bailedIntoMainMenu = $(
  inGame.with({ flag: 'AndNext', lvalue: { type: 'Delta' } }),
  notInGame
)

const carColorIdIs = id => $.one(['', 'Mem', '8bit', 0x269830, '=', 'Value', '', id])
const carIdIs = id => $.one(['', 'Mem', '8bit', 0x26982C, '=', 'Value', '', id])

const player = (() => {
  const base = $.one(['AddAddress', 'Mem', '8bit', 0x26982C, '*', 'Value', '', 0xB78])

  const first = $(
    base,
    ['', 'Mem', '16bit', 0xb71194, '=', 'Value', '', 1]
  )

  const controllingTheCar = $.one(['', 'Mem', '32bit', 0x01fffc4c, '=', 'Value', '', 0])

  return {
    controllingTheCar,
    watchingReplay: controllingTheCar.with({ rvalue: { value: 1 } }),

    first,
    notFirst: first.withLast({ cmp: '>' }),

    applying: {
      throttle: $(
        base,
        ['', 'Mem', '16bit', 0xb710dc, '>', 'Value', '', 0]
      ),
      brakes: $(
        base,
        ['', 'Mem', '16bit', 0xb710de, '>', 'Value', '', 0]
      ),
      handbrake: $(
        base,
        ['', 'Mem', '16bit', 0xb710e0, '>', 'Value', '', 0]
      ),
      reverseGear: $(
        base,
        ['', 'Mem', '8bit', 0xb710e4, '=', 'Value', '', 0]
      ),
    },

    notApplyingEnoughThrottle: andNext(
      base,
      ['', 'Mem', '16bit', 0xb710dc, '<', 'Value', '', 1024],
      base,
      ['', 'Mem', '16bit', 0xb710dc, '<', 'Delta', '16bit', 0xb710dc]
    ),

    measuredTime: $(
      base,
      ['Measured', 'Mem', '32bit', 0xb711c4]
    ),

    didntLap: $(
      base,
      ['', 'Mem', '32bit', 0xb711c4, '=', 'Value', '', 0]
    ),

    finishedLap: andNext(
      controllingTheCar,
      base,
      ['', 'Mem', '32bit', 0xb711c4, '>', 'Value', '', 0],
      base,
      ['', 'Delta', '32bit', 0xb711c4, '=', 'Value', '', 0]
    )
  }
})()

const drivingStyleIs = {
  racing: $.one(['', 'Mem', '32bit', 0x1fffcf4, '=', 'Value', '', 0]),
  drift: $.one(['', 'Mem', '32bit', 0x1fffcf4, '=', 'Value', '', 1]),
}

const gearboxIs = {
  auto: $.one(['', 'Mem', '32bit', 0x1fffcf8, '=', 'Value', '', 0]),
  manual: $.one(['', 'Mem', '32bit', 0x1fffcf8, '=', 'Value', '', 1]),
}

const playerWon = $(
  player.first,
  player.finishedLap
)

const firstFramesOfRaceStart = $(
  ['AndNext', 'Mem', '32bit', 0x6cd564, '>=', 'Value', '', 0x30],
  ['', 'Delta', '32bit', 0x6cd564, '<', 'Value', '', 0x30]
)

const set = new AchievementSet({ gameId: 22999, title: '~Demo~ Gran Turismo 2000' })

set.addAchievement({
  title: "Race On!",
  description: 'Win the race with Racing driving style',
  points: 1,
  type: 'win_condition',
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
  type: 'win_condition',
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
  type: 'win_condition',
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
      player.controllingTheCar,
      carIdIs(0),
      carColorIdIs(4),
      player.applying.throttle,
      firstFramesOfRaceStart,
    ),

    trigger(playerWon),
    resetIf(
      player.notApplyingEnoughThrottle,
      player.applying.brakes,
      player.applying.handbrake,
      player.applying.reverseGear,
      player.watchingReplay,
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
          player.controllingTheCar,
          player.didntLap,
          andNext(
            ['', 'Mem', '32bit', 0xb68ac8, '>', 'Value', '', 0],
            ['', 'Mem', '32bit', 0xb68acc, '<=', 'Value', '', 60]
          )
        )
      )
    ],

    // didn't finish first
    alt2: [
      resetIf(
        andNext(
          inGame,
          player.finishedLap,
          player.notFirst
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
          player.controllingTheCar
        )
      )
    ]
  }
})

set.addAchievement({
  title: "Congratulations, You've Won!",
  description: 'Win the race with Automatic gearbox',
  points: 1,
  type: 'win_condition',
  conditions: [
    pauseIf(notInGame),
    playerWon,
    gearboxIs.auto
  ]
})

for (const [title, carId] of /** @type {const} */ ([
  ['Fastest Evo on Seattle 2000', 0],
  ['Toyota ALTEZZA RS200', 1],
  ['Subaru LEGACY B4 RSK', 2],
  ['Mazda RX-7 Type RS (FD)', 3],
  ['Nissan SKYLINE GT-R V-spec (R34)', 4],
  ['Honda NSX Type S Zero', 5],
])) {
  set.addLeaderboard({
    title,
    description: carId === 0 ?
      'Lap time in msec' :
      'Lap time in msec, car available by applying patch in PCSX2',
    lowerIsBetter: true,
    type: 'FIXED3',
    conditions: {
      start: [
        carIdIs(carId),
        inGame,
        player.finishedLap
      ],
      cancel: '0xfeed=0xcafe',
      submit: '0xcafe=0xcafe',
      value: player.measuredTime
    }
  })
}

export default set