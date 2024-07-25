// @ts-check

import { AchievementSet, ConditionBuilder, RichPresence, define as $, pauseIf, trigger, andNext, orNext, resetNextIf, resetIf, once, measuredIf } from '@cruncheevos/core'

import * as lists from './lists.js'

const gameType = {
  mission: 0,
  takeADrive: 1,
  pursuit: 3,
  getaway: 4,
  gateRace: 5,
  checkpoint: 6,
  trailblazer: 7,
  survival: 8,
  secret: 13
}

const gameState = {
  quittingTheGame: 1,
  replay: 3,
  director: 4,
  nextMission: 5,
  demo: 6
}

const pauseMode = {
  regular: 0,
  gameOver: 3,
  missionComplete: 4
}

const missionTitles = {
  0x01: "Surveillance Tip Off",
  0x02: "Chase the Witness",
  0x03: "Train Pursuit",
  0x04: "Tailing the Drop",
  0x05: "Escape to the Safe House",
  0x06: "Chase the Intruder",
  0x07: "Caine's Compound",
  0x09: "Leaving Chicago",

  0x0a: "Follow up the Lead",
  0x0b: "Hijack the Truck",
  0x0d: "Stop the Truck",
  0x0e: "Find the Clue",
  0x0f: "Escape to Ferry",
  0x10: "To the Docks",
  0x11: "Back to Jones",
  0x12: "Tail Jericho",
  0x13: "Pursue Jericho",
  0x14: "Escape the Brazilians",

  0x15: "Casino Getaway",
  0x16: "Beat the Train",
  0x17: "Car Bomb",
  0x18: "Car Bomb Getaway",
  0x19: "Bank Job",
  0x1a: "Steal the Ambulance",
  0x1b: "Stake Out",
  0x1c: "Steal the Keys",
  0x1d: "C4 Deal",
  0x1e: "Destroy the Yard",

  0x1f: "Bus Crush",
  0x20: "Steal the Cop Car",
  0x21: "Caine's Cash",
  0x22: "Save Jones",
  0x23: "Boat Jump",
  0x25: "Jones in Trouble",
  0x26: "Chase the Gun Man",
  0x27: "Lenny Escaping",
  0x28: "Lenny Gets Caught",

  0x32: 'Chicago (Day)',
  0x33: 'Chicago (Night)',
  0x34: 'Havana (Day)',
  0x35: 'Havana (Night)',
  0x36: 'Las Vegas (Day)',
  0x37: 'Las Vegas (Night)',
  0x38: 'Rio (Day)',
  0x39: 'Rio (Night)',

  // hacky dumb normalization
  ...[
    ...lists.pursuits,
    ...lists.getaways,
    ...lists.gateRaces,
    ...lists.trailblzers,
    ...lists.checkpointRaces.map(x => [x[0], x[2]]),
    ...lists.survivalRaces.map(x => [x[0], x[2]]),
  ].reduce((prev, array) => {
    prev[array[0]] = array[1]
    return prev
  }, {}),

  0x1e0: 'Secret Mountain Pass (Day)',
  0x1e1: 'Secret Mountain Pass (Night)',
  0x1e2: 'Secret Race Track (Day)',
  0x1e3: 'Secret Race Track (Night)',
}

function stringTimeToDriverTime(str = '') {
  const [minutes, seconds, milliseconds] = str.split(/[:.]/).map(Number)
  const totalMilliseconds = ((minutes * 60 + seconds) * 1000 + milliseconds * 10)
  return totalMilliseconds * 3
}

const asciiTo32Bit = (ascii = '') => {
  if (ascii.length !== 4) {
    throw new Error('length must be 4')
  }

  const res = ascii.split('').map(x => x.charCodeAt(0).toString(16)).reverse().join('')
  return parseInt(res, 16)
}

const b = (fileName = '') => process.argv.includes('badge') ? `local\\\\driver\\\\${fileName}.png` : undefined

/** @typedef {'us' | 'eu' | 'fr' | 'de' | 'it' | 'sp'} Region */
/** @param {(region: Region) => any} cb */
function multiRegionalConditions(cb) {
  const res = [cb('us'), cb('eu'), cb('fr'), cb('de'), cb('it'), cb('sp')]
  if (res[0].core) {
    let count = 1
    const ret = {
      core: res[0].core
    }

    for (const bunch of res) {
      for (const group of Object.values(bunch).slice(1)) {
        ret[`alt${count}`] = group
        count++
      }
    }

    return ret
  }

  if (Array.isArray(res[0]) && res[0].length === 1) {
    return {
      core: res[0],
      alt1: res[1],
      alt2: res[2],
      alt3: res[3],
      alt4: res[4],
      alt5: res[5],
    }
  }

  return {
    core: 'hcafe=hcafe',
    alt1: res[0],
    alt2: res[1],
    alt3: res[2],
    alt4: res[3],
    alt5: res[4],
    alt6: res[5],
  }
}

/** @param {Region} region */
const codeFor = (region) => {

  const offset = (value) => {
    if (region === 'eu') {
      if (value > 0xaa6f0) {
        return value - 0x78
      }

      return value - 0x74
    }

    if (region === 'fr') {
      if (value < 0xaa5f0) {
        return value + 0x170
      }

      if (value > 0xaa6f0) {
        return value + 0x130
      }

      return value + 0x148
    }

    if (region == 'de') {
      if (value < 0xaa5f0) {
        return value + 0x124
      }

      if (value > 0xaa6f0) {
        return value + 0xF0
      }

      return value + 0xFC
    }

    if (region == 'it') {
      if (value > 0xaa6f0) {
        return value + 0x120
      }

      return value + 0x15C
    }

    if (region == 'sp') {
      if (value < 0xaa5f0) {
        return value + 0x1C4
      }

      if (value > 0xaa6f0) {
        return value + 0x1A0
      }

      return value + 0x1BC
    }

    return value
  }

  const address = {
    chased: offset(0x0aa5f0),
    city: offset(0x0aa6b0),
    eventStuff: offset(0x0d7c20),
    gameOverRecently: offset(0x0ab04c),
    gameState: offset(0x0aa618),
    gameType: offset(0x0aa69c),
    lapTime1: offset(0x0d7d60),
    mission: offset(0x0aa6a0),
    missionTimer: offset(0xd7d3c),
    playerCarId: offset(0xd9880),
    score: offset(0x0daa20),
    targetedCarId: offset(0x0d987b),
    targetsArray: offset(0x0ab10c)
  }

  const regionIs = {
    us: $.one(['', 'Mem', '32bit', 0x10848, '=', 'Value', '', asciiTo32Bit('1.61')]),
    eu: $.one(['', 'Mem', '32bit', 0x10848, '=', 'Value', '', asciiTo32Bit('9.93')]),
    fr: $.one(['', 'Mem', '32bit', 0x108fc, '=', 'Value', '', asciiTo32Bit('9.94')]),
    de: $.one(['', 'Mem', '32bit', 0x108f8, '=', 'Value', '', asciiTo32Bit('9.95')]),
    it: $.one(['', 'Mem', '32bit', 0x10884, '=', 'Value', '', asciiTo32Bit('9.96')]),
    sp: $.one(['', 'Mem', '32bit', 0x108c4, '=', 'Value', '', asciiTo32Bit('9.97')]),
  }

  const regionCheck = $(
    region === 'us' && regionIs.us,
    region === 'eu' && regionIs.eu,
    region === 'fr' && regionIs.fr,
    region === 'de' && regionIs.de,
    region === 'it' && regionIs.it,
    region === 'sp' && regionIs.sp,
  )

  const missionIdIs = (missionId) => {
    missionId = Array.isArray(missionId) ? missionId : [missionId]

    return orNext(
      ...missionId.map(id => $.one(['', 'Mem', '32bit', address.mission, '=', 'Value', '', id]))
    )
  }
  const gameTypeIdIs = (gameTypeId) => $.one(['', 'Mem', '8bit', address.gameType, '=', 'Value', '', gameTypeId])

  const score = {
    address: address.score,
    equalsOrGreaterThan: (scoreTarget) => $.one(['', 'Mem', '16bit', address.score, '>=', 'Value', '', scoreTarget]),
    increased: $.one(['', 'Mem', '16bit', address.score, '>', 'Delta', '16bit', address.score])
  }

  const missionTimer = {
    equalsOrLessThan: (timeTarget) => $.one(['', 'Mem', '32bit', address.missionTimer, '<=', 'Value', '', stringTimeToDriverTime(timeTarget)]),
    wentAboveTarget: (timeTarget) => $(
      ['', 'Delta', '32bit', address.missionTimer, '<', 'Value', '', stringTimeToDriverTime(timeTarget)],
      ['', 'Mem', '32bit', address.missionTimer, '>=', 'Value', '', stringTimeToDriverTime(timeTarget)],
    ),
    measured: $(
      measuredIf(regionIs[region]),
      ['Measured', 'Mem', '32bit', address.missionTimer, '/', 'Value', '', 30]
    )
  }

  const makeDamageBarCode = (address) => {
    const damageAddress = offset(address)
    const maxDamageAddress = damageAddress + 0x2
    const appearanceAddress = damageAddress + 0xc

    return {
      isNotFull: $.one(['', 'Mem', '16bit', damageAddress, '<', 'Mem', '16bit', maxDamageAddress]),
      gotFull: $(
        ['', 'Delta', '16bit', damageAddress, '<', 'Mem', '16bit', maxDamageAddress],
        ['', 'Mem', '16bit', damageAddress, '>=', 'Mem', '16bit', maxDamageAddress]
      ),
      hasNoDamage: $.one(['', 'Mem', '16bit', damageAddress, '=', 'Value', '', 0]),
      hasDamageGreaterThan: value => $.one(['', 'Mem', '16bit', damageAddress, '>', 'Value', '', value]),
      surpassedDamage: value => $(
        ['AndNext', 'Mem', '16bit', damageAddress, '>=', 'Value', '', value],
        ['', 'Delta', '16bit', damageAddress, '<', 'Value', '', value],
      ),

      appeared: $.one(['', 'Mem', '32bit', appearanceAddress, '>', 'Delta', '32bit', appearanceAddress]),
      disappeared: $.one(['', 'Mem', '32bit', appearanceAddress, '<', 'Delta', '32bit', appearanceAddress]),
    }
  }

  const makeCarDataCode = (baseCondition) => {
    return {
      get hasNoDamage() {
        return $(
          baseCondition,
          ['', 'Mem', '16bit', offset(0x0d160e), '<=', 'Value', '', 1]
        )
      },

      get gotDamage() {
        return $(
          baseCondition,
          ['', 'Mem', '16bit', offset(0x0d160e), '>', 'Delta', '16bit', offset(0x0d160e)]
        )
      },

      get gotSeriousDamage() {
        return $(
          baseCondition,
          ['AddSource', 'Mem', '16bit', offset(0x0d160e)],
          baseCondition,
          ['SubSource', 'Delta', '16bit', offset(0x0d160e)],
          ['', 'Value', '', 0, '>', 'Value', '', 10]
        )
      },

      carPos: (coords) => $(
        andNext(
          baseCondition,
          ['', 'Mem', '32bit', offset(0x0d1394), '<=', 'Value', '', coords.top],
        ).andNext(
          baseCondition,

          ['', 'Mem', '32bit', offset(0x0d1394), '>=', 'Value', '', coords.bottom]
        ).andNext(
          baseCondition,
          ['', 'Mem', '32bit', offset(0x0d138c), '>=', 'Value', '', coords.left],
        ).also(
          baseCondition,
          ['', 'Mem', '32bit', offset(0x0d138c), '<=', 'Value', '', coords.right],
        )
      ),

      hasSpecificStats(stats) {
        const checkStat = (valueOffset, type, value) => $(
          baseCondition,
          ['AddAddress', 'Mem', '32bit', offset(0xd14dc)],
          ['', 'Mem', type, 0x6a + valueOffset, '=', 'Value', '', value],
        )

        return $(
          checkStat(0, '32bit', stats[0]),
          checkStat(4, '32bit', stats[1]),
          // stupid hack for las vegas truck
          checkStat(8, stats.length > 3 ? '32bit' : '16bit', stats[2]),
          stats.length > 3 && checkStat(12, '16bit', stats[3]),
        )
      }
    }
  }

  return {
    address,
    calculateRegionOffset: offset,
    regionCheck,
    protections({
      resetInsteadOfPause = false,
      godModeAllowed = false,
      noCopAllowed = false
    } = {}) {
      const notPlayingTheGame = $(
        ['AndNext', 'Mem', '8bit', address.gameState, '>', 'Value', '', gameState.quittingTheGame],
        ['', 'Mem', '8bit', address.gameState, '!=', 'Value', '', gameState.nextMission]
      )

      const pauseIfGodModeCheat = $.one(['PauseIf', 'Mem', '32bit', offset(0x0aa6ec), '!=', 'Value', '', 0])
      const pauseIfNoCopCheat = $.one(['PauseIf', 'Mem', '32bit', offset(0x0aa6f0), '!=', 'Value', '', 0])

      return $(
        pauseIf(regionCheck.map(c => c.with({ cmp: '!=' }))),

        (resetInsteadOfPause ? resetIf : pauseIf)(notPlayingTheGame),

        !godModeAllowed && pauseIfGodModeCheat,
        !noCopAllowed && pauseIfNoCopCheat,
      )
    },

    playingTheGame: $(
      ['', 'Mem', '8bit', address.gameOverRecently, '=', 'Value', '', 0],
      ['OrNext', 'Mem', '8bit', address.gameState, '<=', 'Value', '', gameState.quittingTheGame],
      ['', 'Mem', '8bit', address.gameState, '=', 'Value', '', gameState.nextMission]
    ),
    gameStateIs: (gameState) => $.one(['', 'Mem', '8bit', address.gameState, '=', 'Value', '', gameState]),

    frameCountLessThan: (frameCount) => $.one(['', 'Mem', '32bit', offset(0xab3b0), '<', 'Value', '', frameCount]),
    frameCountGreaterThan: (frameCount) => $.one(['', 'Mem', '32bit', offset(0xab3b0), '>', 'Value', '', frameCount]),

    cityIdIs: (id) => $.one(['', 'Mem', '32bit', address.city, '=', 'Value', '', id]),

    missionIdIs,
    missionTimer,
    gameTypeIdIs,

    playerSatDown: $(
      ['', 'Mem', '32bit', offset(0xd98a4), '!=', 'Value', '', 0],
      ['AddAddress', 'Mem', '32bit', offset(0xd98a4)],
      ['AndNext', 'Delta', '8bit', 0x59, '!=', 'Value', '', 7],
      ['AddAddress', 'Mem', '32bit', offset(0xd98a4)],
      ['', 'Mem', '8bit', 0x59, '=', 'Value', '', 7]
    ),

    carData: {
      forPlayer: makeCarDataCode($(
        ['AndNext', 'Mem', '8bit', address.playerCarId, '!=', 'Value', '', 0xFF],
        ['AddAddress', 'Mem', '8bit', address.playerCarId, '*', 'Value', '', 0x29c]
      )),
      forTarget: makeCarDataCode($(
        ['AndNext', 'Mem', '8bit', address.targetedCarId, '!=', 'Value', '', 0xFF],
        ['AddAddress', 'Mem', '8bit', address.targetedCarId, '*', 'Value', '', 0x29c]
      )),
      byIndex: idx => makeCarDataCode($.one(['AddAddress', 'Value', '', idx, '*', 'Value', '', 0x29c]))
    },

    score,
    measuredLastLapTime: $(
      measuredIf(regionIs[region]),
      ['AddAddress', 'Mem', '32bit', address.score, '*', 'Value', '', 4],
      ['Measured', 'Mem', '32bit', address.lapTime1 - 4, '/', 'Value', '', 30]
    ),

    gameOverRecently: $.one(['', 'Mem', '32bit', address.gameOverRecently, '>', 'Delta', '32bit', address.gameOverRecently]),

    playerCarIdChanged: $.one(['', 'Mem', '8bit', address.playerCarId, '!=', 'Delta', '8bit', address.playerCarId]),
    playerIsNotChased: $.one(['', 'Mem', '32bit', address.chased, '=', 'Value', '', 0]),

    lapTimeLessOrEqualThan: (lapIndex, time) => $.one(['', 'Mem', '32bit', address.lapTime1 + lapIndex * 4, '<=', 'Value', '', stringTimeToDriverTime(time)]),


    damageBar: makeDamageBarCode(0x0ab93c),
    targetDamageBar: makeDamageBarCode(0x0ab8fc),

    proximityBar: {
      isLessThan: value => $.one(['', 'Mem', '16bit', offset(0x0ab8dc), '<', 'Value', '', value]),
      isGreaterThan: value => $.one(['', 'Mem', '16bit', offset(0x0ab8dc), '>', 'Value', '', value]),
    },

    target: {
      flagsChanged: (targeIndex, from, to) => {
        const flagOffset = 0x40 * targeIndex + 0x4
        return $(
          ['AddAddress', 'Mem', '32bit', address.targetsArray],
          ['AndNext', 'Delta', '32bit', flagOffset, '=', 'Value', '', from],
          ['AddAddress', 'Mem', '32bit', address.targetsArray],
          ['', 'Mem', '32bit', flagOffset, '=', 'Value', '', to],
        )
      }
    },

    playerCarId: {
      changedTo: (to) => $(
        ['AndNext', 'Mem', '8bit', address.playerCarId, '!=', 'Delta', '8bit', address.playerCarId],
        ['', 'Mem', '8bit', address.playerCarId, '=', 'Value', '', to]
      ),
    },

    targetCarId: {
      changedExact: (from, to) => $(
        ['AndNext', 'Delta', '8bit', address.targetedCarId, '=', 'Value', '', from],
        ['', 'Mem', '8bit', address.targetedCarId, '=', 'Value', '', to]
      ),
    },

    isHardCopDifficulty: $.one(['', 'Mem', '32bit', offset(0x0aa6bc), '=', 'Value', '', 2]),
    hasAlertedCops: $.one(['', 'Mem', '32bit', address.chased, '>', 'Delta', '32bit', address.chased]),

    hasCompletedMissionInGame: ({
      missionId,
      gameTypeId = -1,
      triggerDecor = false,
      hardCops = false,
      scoreTarget = 0,
      timeTarget = '',
      deltaFix = true
    }) => {
      const restOfConditions = $(
        ['', 'Mem', '16bit', offset(0x0d7d20), '=', 'Value', '', pauseMode.missionComplete],
        deltaFix && ['', 'Mem', '16bit', offset(0x0d7d22), '<', 'Delta', '16bit', offset(0x0d7d22)],
        !deltaFix && ['', 'Mem', '16bit', offset(0x0d7d22), '>', 'Value', '', 0],

        scoreTarget > 0 && score.equalsOrGreaterThan(scoreTarget),
        timeTarget !== '' && missionTimer.equalsOrLessThan(timeTarget),
      )

      return $(
        gameTypeId >= 0 && pauseIf(gameTypeIdIs(gameTypeId).with({ cmp: '!=' })),
        missionIdIs(missionId),
        hardCops && ['', 'Mem', '16bit', offset(0x0aa6bc), '=', 'Value', '', 2],
        triggerDecor ? trigger(restOfConditions) : restOfConditions
      )
    },

    hasCompletedMissionInPause: ({
      missionId,
      gameTypeId = -1,
      triggerDecor = false
    }) => {
      const isPaused = $.one(['', 'Mem', '32bit', offset(0x0aa6c0), '!=', 'Value', '', 0])
      const missionCompletedAndPaused = $.one(['', 'Mem', '32bit', offset(0x0aafa8), '=', 'Value', '', pauseMode.missionComplete])

      const restOfConditions = $(
        isPaused,
        missionCompletedAndPaused
      )

      return $(
        gameTypeId >= 0 && pauseIf(gameTypeIdIs(gameTypeId).with({ cmp: '!=' })),
        missionId && missionIdIs(missionId),
        triggerDecor ? trigger(restOfConditions) : restOfConditions
      )
    },
  }
}

/**
 * @template T
 * @typedef {(c: typeof codeFor extends (...args: any[]) => infer U ? U : any) => T} CodeForCallbackTemplate
*/
/** @typedef {CodeForCallbackTemplate<import('@cruncheevos/core').ConditionBuilder>} CodeForCallback */

/** @param {{
 title?: string
 type?: import('@cruncheevos/core').Achievement.Type
 description?: string
 triggerDecor?: boolean
 additionalConditions?: CodeForCallback
 startConditions?: CodeForCallback
 resetConditions?: CodeForCallback
 customConditions?: CodeForCallback
}} opts */
function missionAchievement(
  missionId,
  points,
  opts = {}
) {
  const {
    title,
    type,
    description,
    startConditions,
    resetConditions,
    additionalConditions,
    triggerDecor,
    customConditions
  } = opts

  const city =
    missionId >= 0x1f ? 'Rio' :
      missionId >= 0x15 ? 'Las Vegas' :
        missionId >= 0x0a ? 'Havana' :
          'Chicago'

  const missionIdString = `0x${missionId.toString(16).padStart(2, '0')}`

  set.addAchievement({
    title: title,
    description: `${city}, ${missionTitles[missionId]}: ` + (description || 'complete the mission'),
    points,
    type,
    badge: b(missionIdString),
    conditions: multiRegionalConditions(region => {
      const c = codeFor(region)
      if (customConditions) {
        return customConditions(c)
      }

      const resetInsteadOfPause = Boolean(startConditions)

      let winConditions = $(
        c.hasCompletedMissionInPause({
          missionId: resetInsteadOfPause ? undefined : missionId,
          gameTypeId: gameType.mission,
          triggerDecor
        }),
        additionalConditions && additionalConditions(c)
      )
      if (resetInsteadOfPause) {
        winConditions = trigger(winConditions)
      }

      return $(
        c.protections({
          resetInsteadOfPause
        }),

        startConditions && andNext(
          'once',
          c.missionIdIs(missionId),
          startConditions(c)
        ),
        startConditions && resetIf(
          c.gameOverRecently
        ),
        resetConditions && resetIf(resetConditions(c)),

        winConditions,
      )
    })
  })
}


const set = new AchievementSet({ gameId: 11588, title: 'Driver 2: The Wheelman Is Back' })

// TODO: Does time need correction for other region?
missionAchievement(0x01, 5, {
  title: "The Wheelman is Back",
  description: "drive through Chicago traffic without crashing into anything, and get into Jones' car with 1 minute 20 seconds to spare",
  startConditions: c => $(c.target.flagsChanged(0, 0x40000201, 0x2)),
  resetConditions: c => $(
    c.damageBar.hasDamageGreaterThan(0),
    c.missionTimer.equalsOrLessThan('01:20.00')
  ),
})
missionAchievement(0x02, 2, {
  title: 'Bump',
  description: 'Jones told you to "punch it"? OK, punch the witness',
  customConditions: c => $(
    c.protections(),
    c.gameTypeIdIs(gameType.mission),
    c.missionIdIs(0x02),

    c.carData.forPlayer.gotSeriousDamage,
    c.carData.forTarget.gotSeriousDamage
  )
})
missionAchievement(0x03, 3, { title: "Follow That Train, Tanner!", type: 'progression' })
missionAchievement(0x04, 3, {
  title: 'Totally Not Suspicious',
  description: 'keep the reasonable distance to the target at all times',
  startConditions: c => $(
    c.targetCarId.changedExact(0xFF, 0x01)
  ),
  resetConditions: c => $(
    c.proximityBar.isLessThan(10000 - 3500),
    c.proximityBar.isGreaterThan(10000 + 3500),
  )
})
missionAchievement(0x05, 10, {
  title: 'Warehouse Retreat',
  description: 'on Hard cop difficulty, get to your apartment without leaving your car',
  startConditions: c => $(
    c.isHardCopDifficulty,
    c.target.flagsChanged(2, 0, 0x201)
  ),
  resetConditions: c => $(c.playerCarId.changedTo(0xFF))
})
missionAchievement(0x06, 10, {
  title: 'Swift Chaser',
  description: 'complete the mission without damaging your car',
  startConditions: c => $(
    c.targetCarId.changedExact(0xFF, 0x01)
  ),
  resetConditions: c => $(
    c.damageBar.surpassedDamage(0x100)
  )
})
missionAchievement(0x07, 5, { title: 'Break Out', type: 'progression' })
set.addLeaderboard({
  title: missionTitles[0x07],
  description: 'The more time left after finishing the mission, the better',
  lowerIsBetter: false,
  type: 'MILLISECS',
  conditions: {
    start: multiRegionalConditions(region => {
      const c = codeFor(region)

      return c.hasCompletedMissionInGame({
        missionId: 0x07,
        gameTypeId: gameType.mission
      })
    }),
    submit: '1=1',
    cancel: '0=1',
    value: multiRegionalConditions(region => [codeFor(region).missionTimer.measured])
  },
})
missionAchievement(0x09, 5, { title: 'Left for Cuba', type: 'progression' })

missionAchievement(0x0a, 3, {
  title: 'Nice and Easy',
  description: 'tail the brazilian without damaging your car',
  startConditions: c => $(
    c.targetCarId.changedExact(0xFF, 0x01)
  ),
  resetConditions: c => $(c.damageBar.surpassedDamage(0x100))
})
missionAchievement(0x0b, 10, { title: "Hard Truck", type: 'progression' })
missionAchievement(0x0d, 10, { title: "Bombing Run", type: 'progression' })
missionAchievement(0x0e, 10, { title: "Quantum Clue", type: 'progression' })
missionAchievement(0x0f, 5, { title: 'Ferry Impressive Jump', type: 'progression' })
missionAchievement(0x10, 5, {
  title: 'To the Docks',
  description: 'on Hard cop difficulty, get to the docks without leaving your car',
  startConditions: c => $(
    c.isHardCopDifficulty,
    c.target.flagsChanged(8, 0x0, 0x201)
  ),
  resetConditions: c => $(c.playerCarId.changedTo(0xFF))
})
missionAchievement(0x11, 5, {
  title: 'Off Radar',
  description: 'complete the mission without alerting any cops',
  startConditions: c => $(c.target.flagsChanged(2, 0x0, 0x201)),
  resetConditions: c => $(c.hasAlertedCops)
})
missionAchievement(0x12, 10, {
  title: 'Stay Back From Alcohol',
  description: "Tanner, you're breaking the car. Tail Jericho while leaving a trail of accidents and getting your car damaged. Trigger icon will appear when you've damaged your car enough.",
  startConditions: c => $(
    c.damageBar.surpassedDamage(11000)
  )
})
missionAchievement(0x13, 5, { title: 'Me and My "Friend" Jericho', type: 'progression' })
missionAchievement(0x14, 10, { title: 'We Leave Again', type: 'progression' })

missionAchievement(0x15, 5, { title: 'Caine Chores', type: 'progression' })
missionAchievement(0x16, 3, {
  title: 'Pickup',
  description: "save one of Caine's guys without damaging the car he's dumped at",
  startConditions: c => $(
    c.frameCountLessThan(2)
  ),
  resetConditions: c => $(c.carData.byIndex(1).gotDamage)
})
missionAchievement(0x17, 5, { title: 'Boomerang', type: 'progression' })
missionAchievement(0x18, 3, {
  title: 'Limo Getaway',
  description: "escape to safehouse in style: on a Limo!",
  triggerDecor: true,
  additionalConditions: c => $(
    c.carData.forPlayer.hasSpecificStats([
      0xF3C,
      0xDAC1000,
      0x38
    ])
  )
})
missionAchievement(0x19, 5, { title: 'Jericho Did It Again', type: 'progression' })
missionAchievement(0x1a, 3, {
  title: 'Flatline',
  description: 'make the ambulance stop within 10 seconds after starting the mission',
  customConditions: c => $(
    c.protections(),
    c.gameTypeIdIs(gameType.mission),
    c.missionIdIs(0x1a),

    once(c.targetDamageBar.appeared),
    andNext('once', c.targetDamageBar.appeared)
      .resetIf(
        ['', 'Mem', '32bit', c.calculateRegionOffset(0x0aa300), '>', 'Delta', '32bit', c.calculateRegionOffset(0x0aa300), 30 * 10]
      ),
    trigger(c.targetDamageBar.disappeared),
    resetIf(c.gameOverRecently),
  )
})
missionAchievement(0x1b, 25, {
  title: 'Nowhere to Drive, Nowhere to Hide',
  description: 'complete the mission on Hard Cop difficulty',
  additionalConditions: c => $(c.isHardCopDifficulty),
  triggerDecor: true
})
missionAchievement(0x1c, 5, { title: 'Was This Necessary?', type: 'progression' })
missionAchievement(0x1d, 5, { title: 'Ready to Blow', type: 'progression' })
missionAchievement(0x1e, 5, {
  title: 'Stealth Bomber',
  description: 'complete the mission without alerting any cops',
  startConditions: c => $(c.target.flagsChanged(11, 0x0, 0x201)),
  resetConditions: c => $(c.hasAlertedCops)
})

missionAchievement(0x1f, 3, {
  title: 'Crazy Bus',
  description: 'Finish the mission in exact same bus you used to crash the cars with',
  additionalConditions: c => $(
    c.carData.forPlayer.hasSpecificStats([
      0xCB2,
      0xDAC1000,
      0x4D
    ])
  )
})
missionAchievement(0x20, 3, { title: 'Underundercover', type: 'progression' })
missionAchievement(0x21, 3, {
  title: 'Slippery Business',
  description: 'Bring the limo to the mansion undamaged',
  customConditions: c => $(
    c.protections(),
    c.gameTypeIdIs(gameType.mission),
    c.missionIdIs(0x21),

    andNext(
      'once',
      c.target.flagsChanged(0, 0x40000201, 0x2),
      c.carData.forPlayer.hasNoDamage
    ),
    resetIf(
      c.damageBar.surpassedDamage(0x100),
      c.gameOverRecently
    ),

    trigger(c.playerCarId.changedTo(0xFF))
  ),
})
missionAchievement(0x22, 5, {
  title: 'Well Done You Stopped the Hitman',
  description: 'Well done you stopped the hitman',
  type: 'progression'
})
missionAchievement(0x23, 5, { title: 'Drive, Bomb, Jump', type: 'progression' })
missionAchievement(0x25, 25, { title: "Worst Day for Jones", type: 'progression' })
missionAchievement(0x26, 25, { title: 'Deadly Camber', type: 'progression' })
missionAchievement(0x27, 5, {
  title: 'Take Some Backup',
  description: 'complete the mission on Hard Cop difficulty',
  additionalConditions: c => $(c.isHardCopDifficulty),
  triggerDecor: true
})
missionAchievement(0x28, 10, { title: 'In Which Lenny Finally Gets Caught', type: 'win_condition' })

lists.pursuits.forEach((x, i) => {
  const [missionId, title] = x

  set.addAchievement({
    title: `Quick Chase: ${title}`,
    description: `Takedown the escaping car in Quick Chase - ${title} driving game`,
    points: 5,
    badge: b(`Chase${i + 1}`),
    conditions: multiRegionalConditions(region => {
      const c = codeFor(region)

      return $(
        c.protections({ noCopAllowed: true }),
        c.hasCompletedMissionInGame({
          missionId,
          gameTypeId: gameType.pursuit,
        }),
      )
    })
  })
})

lists.getaways.forEach((x, i) => {
  const [missionId, title] = x
  const noDamage = Boolean(x[2]) === false

  let description = `Complete ${title} Getaway driving game on Hard Cop Difficulty`
  if (noDamage) {
    description += ` and without taking damage`
  }

  set.addAchievement({
    title: `Getaway: ${title}`,
    description,
    points: 2,
    badge: b(`Getaway${i + 1}`),
    conditions: multiRegionalConditions(region => {

      const c = codeFor(region)

      return $(
        c.protections(),
        noDamage && c.damageBar.hasNoDamage,

        c.hasCompletedMissionInGame({
          missionId,
          gameTypeId: gameType.getaway,
          hardCops: true,
          triggerDecor: true
        }),
      )
    })
  })
})

lists.gateRaces.forEach((x, i) => {
  const [missionId, title] = x

  const conditions = deltaFix => multiRegionalConditions(region => {
    const c = codeFor(region)

    return $(
      c.protections(),

      c.hasCompletedMissionInGame({
        missionId,
        gameTypeId: gameType.gateRace,
        deltaFix
      }),
    )
  })

  set.addAchievement({
    title: `Gate Race: ${title}`,
    description: `Get through the final gate in ${title} Gate Race driving game`,
    points: 5,
    badge: b(`Gate${i + 1}`),
    conditions: conditions(true)
  })

  set.addLeaderboard({
    title: `Gate Race: ${title}`,
    description: `Most amount of time left on finish`,
    lowerIsBetter: false,
    type: 'MILLISECS',
    conditions: {
      start: conditions(false),
      submit: '1=1',
      cancel: '0=1',
      value: multiRegionalConditions(region => [codeFor(region).missionTimer.measured])
    }
  })
})

set.addAchievement({
  title: `The Perfect Gate`,
  description: `Get through all 100 gates clean in any of Gate Race driving games`,
  points: 10,
  badge: b('Gate100'),
  conditions: multiRegionalConditions(region => {
    const c = codeFor(region)

    return $(
      c.protections(),

      c.hasCompletedMissionInGame({
        missionId: lists.gateRaces.map(([missionId]) => missionId),
        scoreTarget: 100,
        gameTypeId: gameType.gateRace
      }),
    )
  })
})

lists.trailblzers.forEach((x, i) => {
  const [missionId, title] = x

  const conditions = deltaFix => multiRegionalConditions(region => {
    const c = codeFor(region)

    return $(
      c.protections(),

      c.hasCompletedMissionInGame({
        missionId,
        gameTypeId: gameType.trailblazer,
        deltaFix,
      }),
    )
  })

  set.addAchievement({
    title: `Trailblazer: ${title}`,
    description: `Smash the final cone in ${title} Trailblazer driving game`,
    points: 5,
    badge: b(`Trail${i + 1}`),
    conditions: conditions(true)
  })

  set.addLeaderboard({
    title: `Trailblazer: ${title}`,
    description: `Most amount of time left on finish`,
    lowerIsBetter: false,
    type: 'MILLISECS',
    conditions: {
      start: conditions(false),
      submit: '1=1',
      cancel: '0=1',
      value: multiRegionalConditions(region => [codeFor(region).missionTimer.measured])
    }
  })
})

set.addAchievement({
  title: `Blazed It`,
  description: `Smash all 100 cones in any of Trailblazer driving games`,
  points: 10,
  badge: b('Trail100'),
  conditions: multiRegionalConditions(region => {
    const c = codeFor(region)

    return $(
      c.protections(),

      c.hasCompletedMissionInGame({
        missionId: lists.trailblzers.map(([missionId]) => missionId),
        scoreTarget: 100,
        gameTypeId: gameType.trailblazer
      }),
    )
  })
})

lists.checkpointRaces.forEach((x, i) => {
  const [missionId, timeTarget, title] = x


  set.addAchievement({
    title: `Checkpoint Race: ${title}`,
    description: `Finish ${title} Checkpoint Race driving game in ${timeTarget} or less`,
    points: 5,
    badge: b(`Check${i + 1}`),
    conditions: multiRegionalConditions(region => {
      const c = codeFor(region)

      return $(
        c.protections(),

        c.hasCompletedMissionInGame({
          missionId,
          gameTypeId: gameType.checkpoint,
          timeTarget
        }),
      )
    })
  })

  set.addLeaderboard({
    title: `Checkpoint Race: ${title}`,
    description: `Fastest time on finish`,
    lowerIsBetter: true,
    type: 'MILLISECS',
    conditions: {
      start: multiRegionalConditions(region => {
        const c = codeFor(region)

        return $(
          c.protections(),

          c.hasCompletedMissionInGame({
            missionId,
            gameTypeId: gameType.checkpoint,
            deltaFix: false,
          }),
        )
      }),
      submit: '1=1',
      cancel: '0=1',
      value: multiRegionalConditions(region => [codeFor(region).missionTimer.measured])
    }
  })
})

lists.survivalRaces.forEach((x, i) => {
  const [missionId, secondsTarget, title, noLeaderboard] = x

  set.addAchievement({
    title: `Survival: ${title}`,
    description: `Last for ${secondsTarget} seconds or more in Survival: ${title} Driving game`,
    points: 5,
    badge: b(`Survival${i + 1}`),
    conditions: multiRegionalConditions(region => {
      const c = codeFor(region)

      return $(
        c.protections(),
        pauseIf(c.gameTypeIdIs(gameType.survival).with({ cmp: '!=' })),

        c.missionIdIs(missionId),
        c.damageBar.isNotFull,
        c.missionTimer.wentAboveTarget(`00:${secondsTarget}.00`)
      )
    })
  })

  if (noLeaderboard === undefined) {
    set.addLeaderboard({
      title: `Survival: ${title}`,
      description: `Longest time to survive`,
      lowerIsBetter: false,
      type: 'MILLISECS',
      conditions: {
        start: multiRegionalConditions(region => {
          const c = codeFor(region)

          return $(
            c.protections(),
            pauseIf(c.gameTypeIdIs(gameType.survival).with({ cmp: '!=' })),

            c.missionIdIs(missionId),
            c.damageBar.gotFull
          )
        }),
        submit: '1=1',
        cancel: '0=1',
        value: multiRegionalConditions(region => [codeFor(region).missionTimer.measured])
      }
    })
  }
})

lists.secretRaces.forEach((x, i) => {
  const [missionId, targetTime, title, checkLapTime] = x

  const checkingLapTime = Boolean(checkLapTime)
  const checkingTotalTime = !checkingLapTime

  set.addAchievement({
    title,
    description: checkLapTime ?
      `Set a lap time of ${targetTime} or less on ${title}` :
      `Set a total time time of ${targetTime} or less on ${title}`,
    points: 5,
    badge: b(`Secret${i + 1}`),
    conditions: multiRegionalConditions(region => {
      const c = codeFor(region)

      return $(
        c.protections({ noCopAllowed: true }),
        pauseIf(c.gameTypeIdIs(gameType.secret).with({ cmp: '!=' })),

        c.missionIdIs(missionId),

        checkingLapTime && andNext(
          c.score.increased
        ).orNext(
          c.lapTimeLessOrEqualThan(0, targetTime),
          c.lapTimeLessOrEqualThan(1, targetTime),
          c.lapTimeLessOrEqualThan(2, targetTime),
        ),

        checkingTotalTime && andNext(
          c.score.increased,
          c.score.equalsOrGreaterThan(3),
          c.missionTimer.equalsOrLessThan(targetTime),
        )
      )
    })
  })

  set.addLeaderboard({
    title,
    description: `Best total time on ${title}`,
    lowerIsBetter: true,
    type: 'MILLISECS',
    conditions: {
      start: multiRegionalConditions(region => {
        const c = codeFor(region)
        return $(
          c.protections({ noCopAllowed: true }),
          pauseIf(c.gameTypeIdIs(gameType.secret).with({ cmp: '!=' })),
          c.missionIdIs(missionId),
          ['', 'Delta', '16bit', c.score.address, '=', 'Value', '', 2],
          ['', 'Mem', '16bit', c.score.address, '=', 'Value', '', 3],
        )
      }),
      submit: '1=1',
      cancel: '0=1',
      value: multiRegionalConditions(region => [codeFor(region).missionTimer.measured])
    }
  })

  set.addLeaderboard({
    title: `${title} Lap Time`,
    description: `Best lap time on ${title}`,
    lowerIsBetter: true,
    type: 'MILLISECS',
    conditions: {
      start: multiRegionalConditions(region => {
        const c = codeFor(region)
        const commonConditions = $(
          c.protections({ noCopAllowed: true }),
          pauseIf(c.gameTypeIdIs(gameType.secret).with({ cmp: '!=' })),
          c.missionIdIs(missionId),
        )

        const lapChangedFromTo = (from, to) => $(
          ['', 'Delta', '16bit', c.score.address, '=', 'Value', '', from],
          ['', 'Mem', '16bit', c.score.address, '=', 'Value', '', to],
        )

        return {
          core: 'hcafe=hcafe',
          alt1: $(
            commonConditions,
            lapChangedFromTo(0, 1)
          ),
          alt2: $(
            commonConditions,
            lapChangedFromTo(1, 2),
            ['', 'Mem', '32bit', c.address.lapTime1 + 4, '<', 'Mem', '32bit', c.address.lapTime1],
          ),
          alt3: $(
            commonConditions,
            lapChangedFromTo(2, 3),
            ['', 'Mem', '32bit', c.address.lapTime1 + 8, '<', 'Mem', '32bit', c.address.lapTime1 + 4],
            ['', 'Mem', '32bit', c.address.lapTime1 + 8, '<', 'Mem', '32bit', c.address.lapTime1],
          ),
        }
      }),
      submit: '1=1',
      cancel: '0=1',
      value: multiRegionalConditions(region => [codeFor(region).measuredLastLapTime])
    }
  })
})

for (const x of lists.secretCars) {
  const [missionId, statData, title, cityName, description, deliveryChallenge] = x

  set.addAchievement({
    title,
    description,
    points: 3,
    badge: b('Secret-' + cityName),
    conditions: multiRegionalConditions(region => {
      const c = codeFor(region)

      return $(
        c.protections(),
        pauseIf(c.gameTypeIdIs(gameType.takeADrive).with({ cmp: '!=' })),

        c.missionIdIs(missionId),

        c.frameCountGreaterThan(2),
        c.playerCarIdChanged,
        c.carData.forPlayer.hasSpecificStats(statData),

        resetNextIf(c.frameCountLessThan(2)),
        pauseIf(
          andNext(
            'hits 2',
            c.carData.forPlayer.hasSpecificStats(statData)
          )
        )
      )
    })
  })

  if (deliveryChallenge) {
    const { title, description, coords } = deliveryChallenge

    set.addAchievement({
      title,
      description,
      points: 5,
      badge: b('Secret-' + cityName + 'Dest'),
      conditions: multiRegionalConditions(region => {
        const c = codeFor(region)

        return $(
          c.protections(),
          pauseIf(c.gameTypeIdIs(gameType.takeADrive).with({ cmp: '!=' })),
          c.missionIdIs(missionId),

          c.playerIsNotChased,
          c.carData.forPlayer.hasSpecificStats(statData),
          trigger(c.carData.forPlayer.carPos(coords)),

          resetNextIf(c.frameCountLessThan(2)),
          pauseIf(
            andNext(
              'once',
              c.frameCountLessThan(3),
              c.carData.forPlayer.hasSpecificStats(statData)
            )
          )
        )
      })
    })
  }
}

set.addAchievement({
  title: 'Nothing to See Here',
  description: 'Visit the Fortaleza de San Carlos in Havana',
  points: 2,
  badge: b('HavanaFortress'),
  conditions: multiRegionalConditions(region => {
    const c = codeFor(region)

    return $(
      c.protections(),
      c.cityIdIs(1),
      orNext(
        c.gameTypeIdIs(gameType.mission),
        c.gameTypeIdIs(gameType.takeADrive)
      ),
      c.carData.forPlayer.carPos({
        top: 0x026400,
        bottom: 0x026200,
        left: 0x066900,
        right: 0x067600
      })
    )
  })
})

set.addAchievement({
  title: 'Immersion',
  description: "Not only you can walk around, but also sit - revolutionary",
  points: 1,
  badge: b('DriverSit'),
  conditions: multiRegionalConditions(region => {
    const c = codeFor(region)

    return $(
      c.protections(),
      c.playerSatDown
    )
  })
})

/** @type {Region[]} */
const regions = ['us', 'eu', 'fr', 'de', 'it', 'sp']
export const rich = RichPresence({
  lookupDefaultParameters: {
    compressRanges: false,
    keyFormat: 'hex'
  },
  lookup: {
    City: {
      values: {
        0: 'Chicago',
        1: 'Havana',
        2: 'Las Vegas',
        3: 'Rio'
      }
    },
    Mission: {
      values: missionTitles
    },
    DrivingGame: {
      values: {
        0x03: 'Quick Chase',
        0x04: 'Quick Getaway',
        0x05: 'Gate Race',
        0x06: 'Checkpoint',
        0x07: 'Trailblazer',
        0x08: 'Survival',
        0x0D: 'Secret Track',
      }
    },
    PoliceEmoji: {
      values: { 1: '🚨' }
    }
  },

  displays: ({ lookup }) => regions.flatMap(region => {
    const c = codeFor(region)
    const atCity = lookup.City.at(`0xX` + c.address.city.toString(16).toUpperCase())
    const atDrivingGame = lookup.DrivingGame.at(`0xH` + c.address.gameType.toString(16).toUpperCase())
    const atMission = lookup.Mission.at(`0xX` + c.address.mission.toString(16).toUpperCase())
    const atPoliceEmoji = lookup.PoliceEmoji.at(`0xX` + c.address.chased.toString(16).toUpperCase())

    return /** @type Array<string | [ConditionBuilder, string]> */ ([
      [
        $(
          c.regionCheck,
          c.gameStateIs(gameState.director)
        ),
        `Directing a movie in ${atCity}`
      ],

      [
        $(
          c.regionCheck,
          c.gameStateIs(gameState.replay)
        ),
        `Watching replay in ${atCity}`
      ],

      [
        $(
          c.regionCheck,
          c.playingTheGame,
          c.frameCountGreaterThan(2),
          c.gameTypeIdIs(gameType.takeADrive)
        ),
        atPoliceEmoji +
        `Cruising in ${atMission}`
        + atPoliceEmoji
      ],

      [
        $(
          c.regionCheck,
          c.playingTheGame,
          c.frameCountGreaterThan(2),
          orNext(
            c.gameTypeIdIs(gameType.pursuit),
            c.gameTypeIdIs(gameType.getaway),
            c.gameTypeIdIs(gameType.gateRace),
            c.gameTypeIdIs(gameType.checkpoint),
            c.gameTypeIdIs(gameType.trailblazer),
            c.gameTypeIdIs(gameType.survival),
            c.gameTypeIdIs(gameType.secret),
          ),
        ),
        `Playing Driving Games: ${atDrivingGame} - ${atMission}`
      ],

      [
        $(
          c.regionCheck,
          c.playingTheGame,
          c.gameTypeIdIs(gameType.mission)
        ),
        atPoliceEmoji +
        `Undercover in ${atCity} and dealing with... ${atMission}`
        + atPoliceEmoji
      ]
    ])
  }).concat(`Playing Driver 2`)
})

export default set