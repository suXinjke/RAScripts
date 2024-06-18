// @ts-check

import '../../common.js'
import {
  AchievementSet, Condition, ConditionBuilder, define as $,
  andNext, orNext, resetIf, trigger, pauseIf
} from '@cruncheevos/core'
import { asciiToNumberLE } from '../../common.js'
import codegen from './codegen.js'

/**
 * @template T
 * @typedef {T extends (Record <string, infer U>) ? U : never} ObjectValue
 * **/

export const meta = await codegen()

/** @param {ConditionBuilder | Condition} c */
export function pointerNullCheck(c) {
  return $(c).withLast({ flag: '', cmp: '!=', rvalue: { type: 'Value', value: 0 } })
}

export const stat = (() => {
  const root = $.one(['AddAddress', 'Mem', '32bit', 0x622f4c])

  const gameFlagIs = (() => {
    const gameFlagIs = (flag) => $(
      root,
      ['', 'Mem', '32bit', 0x3a370, '=', 'Value', '', flag]
    )
    return {
      inGameMenus: gameFlagIs(1),
      eventRace: gameFlagIs(2),
      eventChampionship: gameFlagIs(3),
      powerAndSpeed: gameFlagIs(4),
      freeRun: gameFlagIs(5),
      raceMeeting: gameFlagIs(6),
      license: gameFlagIs(7),
      mission: gameFlagIs(8),
      photoDrive: gameFlagIs(9),
      arcadeRace: gameFlagIs(0xA),
      arcadeTimeTrial: gameFlagIs(0xB),
      photoScene: gameFlagIs(0x15),
    }
  })()

  const gtModeCarValue = $(
    root,
    ['Measured', 'Mem', '32bit', 0x13940]
  )

  const gtModeCarIsNot = id => gtModeCarValue.withLast({
    flag: '', cmp: '!=', rvalue: { type: 'Value', value: id }
  })

  const selectedSetupSlotIs = slot => $(
    root,
    ['', 'Mem', '8bit', 0x13dc8, '=', 'Value', '', slot]
  )

  const forSetupSlot = slot => {
    const base = selectedSetupSlotIs(slot)

    const partOffset = slot * 0x178

    return {
      /** @param {number[]} ids */
      gearboxIdIsNotOneOf: ids => andNext(
        base,
        andNext(
          ...ids.map(id => $(
            root,
            ['', 'Mem', '32bit', 0x13988 + partOffset, '!=', 'Value', '', id]
          ))
        )
      ),
      wrongAdverseCamberReigns: orNext(
        root,
        ['', 'Mem', '8bit', 0x13a79 + partOffset, '<', 'Value', '', 100],
      ).andNext(
        root,
        ['', 'Mem', '8bit', 0x13a7a + partOffset, '<', 'Value', '', 100],
        base
      ),
      wrongAutoUnionParts: orNext(
        root,
        ['', 'Mem', '32bit', 0x139f0 + partOffset, '!=', 'Value', '', 0x91d],
        root,
        ['', 'Mem', '32bit', 0x139a0 + partOffset, '!=', 'Value', '', 0xde1b],
        root,
        ['', 'Mem', '32bit', 0x139a8 + partOffset, '!=', 'Value', '', 0xde15],
      ).andNext(
        root,
        ['', 'Mem', '8bit', 0x13a9b + partOffset, '!=', 'Value', '', 0],
        base
      ),

      hasNitrous: andNext(
        base,
        root,
        ['', 'Mem', '32bit', 0x13a38 + partOffset, '!=', 'Value', '', -1]
      )
    }
  }

  return {
    root,

    inGTModeProject: $(
      root,
      ['', 'Mem', '32bit', 0x3A3BC, '=', 'Value', '', asciiToNumberLE('gtmo')]
    ),

    gameFlagIs,
    abandonedChampionship: andNext(
      gameFlagIs.inGameMenus,

      root,
      ['', 'Mem', '8bit', 0x38c20, '=', 'Value', '', 0]
    ),

    gtModeCarValue,
    gtModeCarIsNot,

    /** @param {number[]} ids */
    gtModeCarIs: (...ids) => orNext(
      ...ids.map(id => gtModeCarIsNot(id).withLast({ cmp: '=' }))
    ),

    gearboxSettingIs: gearbox => $(
      root,
      ['', 'Mem', '32bit', 0x39d78, '=', 'Value', '', gearbox === 'manual' ? 0 : 1]
    ),

    /** @param {(setupSlot: ReturnType<typeof forSetupSlot>) => ConditionBuilder} cb */
    forEachSetupSlot: cb => {
      return $(
        cb(forSetupSlot(0)),
        cb(forSetupSlot(1)),
        cb(forSetupSlot(2)),
      )
    }
  }
})()

export const main = (() => {
  const p = (() => {
    const root = $.one(['AddAddress', 'Mem', '32bit', 0x621cb4])
    const root60 = $(
      root,
      ['AddAddress', 'Mem', '32bit', 0x60]
    )
    const root84 = $(
      root,
      ['AddAddress', 'Mem', '32bit', 0x84]
    )

    return {
      root,
      root60,
      root84,
      aSpecMode: $(
        root84,
        ['AddAddress', 'Mem', '32bit', 0x58],
        ['AddAddress', 'Mem', '32bit', 0x30],
      )
    }
  })()

  const eventIdValue = $(
    p.root,
    ['Measured', 'Mem', '32bit', 0x68]
  )

  /** @param {number[]} ids */
  const eventIdIs = (...ids) => orNext(
    ...ids.map(id => $(
      eventIdValue.withLast({ flag: '', cmp: '=', rvalue: { type: 'Value', value: id } })
    ))
  )

  const trackIdValue = $(
    p.root,
    ['Measured', 'Mem', '32bit', 0x78]
  )

  /** @param {number[]} ids */
  const trackIdIs = (...ids) => orNext(
    ...ids.map(id => $(
      trackIdValue.withLast({ flag: '', cmp: '=', rvalue: { type: 'Value', value: id } })
    ))
  )

  const earnedASpecPoints = $(
    p.root,
    ['', 'Mem', '8bit', 0x96c, '>', 'Delta', '8bit', 0x96c]
  )

  const earnedAtleastASpecPoints = aSpecPoints => $(
    p.root,
    ['', 'Mem', '8bit', 0x96c, '>=', 'Value', '', aSpecPoints],
    p.root,
    ['', 'Delta', '8bit', 0x96c, '=', 'Value', '', 0]
  )

  const inASpecMode = $(
    pointerNullCheck(p.aSpecMode),

    p.aSpecMode,
    ['', 'Mem', '32bit', 0x1bc, '=', 'Value', '', 0]
  )

  const inBSpecMode = $(
    p.root84,
    ['', 'Mem', '32bit', 0xCCC, '=', 'Value', '', 1]
  )

  const notInASpecMode = $(
    pointerNullCheck(p.aSpecMode).withLast({ cmp: '=' }),

    p.aSpecMode,
    ['', 'Mem', '32bit', 0x1bc, '!=', 'Value', '', 0]
  )

  const lapCountIsGte = count => $(
    p.root,
    ['', 'Mem', '32bit', 0, '>=', 'Value', '', count]
  )

  const inGameCar = index => {
    const base = $(
      p.root60,
      ['AddAddress', 'Mem', '32bit', 0x8],
    )

    const carBase = $(
      base,
      ['AddAddress', 'Mem', '32bit', index * 4],
    )

    const idValue = $(
      carBase,
      ['Measured', 'Mem', '32bit', 0x20]
    )

    const completedLap = $(
      carBase,
      ['', 'Mem', '32bit', 0x1AC, '>', 'Delta', '32bit', 0x1AC]
    )

    return {
      idValue,

      /** @param {number[]} ids */
      idIs: (...ids) => orNext(
        ...ids.map(id => idValue.withLast({
          flag: '', cmp: '=', rvalue: { type: 'Value', value: id }
        }))
      ),
      colorIdIs: (id) => $(
        carBase,
        ['', 'Mem', '8bit', 0x38, '=', 'Value', '', id]
      ),

      completedLap,

      lapsCompletedAre: laps => completedLap.withLast({
        cmp: '=', rvalue: { type: 'Value', size: '', value: laps }
      }),

      lapsRemainingAre: laps => $(
        completedLap.withLast({
          flag: 'SubSource', cmp: '', rvalue: { type: '', size: '', value: 0 }
        }),
        lapCountIsGte(0).withLast({ cmp: '=', rvalue: { value: laps } })
      ),

      measuredLastLapTime: $(
        carBase,
        ['Measured', 'Mem', '32bit', 0x11dc]
      ),

      lastLapTimeWasLte: target => $(
        carBase,
        ['', 'Mem', '32bit', 0x11dc, '<=', 'Value', '', target]
      ),

      lastLapTimeWasLt: target => $(
        carBase,
        ['', 'Mem', '32bit', 0x11dc, '<', 'Value', '', target]
      ),

      isNotControlledByAI: $(
        carBase,
        ['AddAddress', 'Mem', '32bit', 0x18],
        ['', 'Mem', '8bit', 0x56a, '=', 'Value', '', 0]
      ),
      isNotControlledByAIRollingStart: $(
        carBase,
        ['AddAddress', 'Mem', '32bit', 0x18],
        ['', 'Mem', '8bit', 0x56b, '=', 'Value', '', 0]
      ),
    }
  }

  const inGamePlayerCar = inGameCar(0)

  const playerWentOut = (() => {
    const tireCombos = [
      [0x6E81, 0x6EB5, 0x6EE9],
      [0x6E81, 0x6EB5, 0x6F1D],
      [0x6E81, 0x6EE9, 0x6F1D],
      [0x6EB5, 0x6EE9, 0x6F1D],
    ]

    /** @type {ConditionBuilder[]} */
    const offTrackLimits = []

    // having headache from trying to do it declaratively
    for (const combo of tireCombos) {
      for (let surface = 2; surface <= 4; surface++) {
        offTrackLimits.push($(
          ...combo.map(offset => $(
            p.root84,
            ['AddAddress', 'Mem', '32bit', 0x70],
            ['', 'Mem', '8bit', offset, '=', 'Value', '', surface],
          )),
        ))
      }
    }

    const bigBump = $(
      p.root84,
      ['AddAddress', 'Mem', '32bit', 0x70],
      ['', 'Mem', 'Float', 0x6dac, '>', 'Float', '', 0.05],
    )
    const bumped = bigBump.withLast({
      rvalue: { type: 'Delta', size: 'Float', value: 0x6dac }
    })

    return {
      singleChainOfConditions: $(
        ...offTrackLimits.map(c => andNext(c)),
        andNext(
          bigBump,
          bumped
        )
      ),

      arrayOfAlts: [
        ...offTrackLimits,
        $(
          bigBump,
          bumped
        )
      ]
    }
  })()

  const hud = (() => {
    const base = $(
      p.root84,
      ['AddAddress', 'Mem', '32bit', 0xe420],
    )
    const speedBase = $(
      base,
      ['AddAddress', 'Mem', '32bit', 0x14],
    )

    const lapTime = {
      current: $(
        base,
        ['', 'Delta', '32bit', 0x1664, '<=', 'Value', '', 0x3F]
      )
    }

    return {
      positionIs: position => $(
        base,
        ['', 'Mem', '32bit', 0x13b0, '=', 'Value', '', position]
      ),
      lapTime: {
        ...lapTime,
        newLap: andNext(
          lapTime.current.withLast({
            lvalue: { type: 'Mem' }, cmp: '!=',
            rvalue: { value: -1 }
          }),
          lapTime.current,
          lapTime.current.withLast({ lvalue: { type: 'Mem' }, cmp: '>' })
        ),
      },
      inBSpecMode: $(
        p.root84,
        ['', 'Mem', '32bit', 0xCCC, '=', 'Value', '', 1]
      ),
      showingRaceResults: $(
        p.root84,
        ['AddAddress', 'Mem', '32bit', 0xe41c],
        ['', 'Mem', '32bit', 0x0, '=', 'Value', '', 1]
      ),
      speed: {
        isRendered: $(
          speedBase,
          ['', 'Mem', '8bit', 0, '=', 'Value', '', 1],
        ),
        wentPastSpeed: (units, hudIsMini, speed) => {
          const unitValue = units === 'kph' ? 0 : 1

          const valueCheck = $(
            speedBase,
            ['', 'Delta', '16bit', hudIsMini ? 0x7A : 0xA1A, '<', 'Value', '', speed],
            speedBase,
            ['', 'Mem', '16bit', hudIsMini ? 0x7A : 0xA1A, '>=', 'Value', '', speed],
          )

          return $(
            ['AddAddress', 'Mem', '32bit', 0x622f4c],
            ['', 'Mem', '8bit', 0x38cc0, '=', 'Value', '', unitValue],

            speedBase,
            ['', 'Mem', '32bit', 0x60, hudIsMini ? '=' : '!=', 'Value', '', asciiToNumberLE('GT4m')],

            valueCheck
          )
        }
      }
    }
  })()

  /**
   * @param {Object} params
   * @param {number} params.trackId
   * @param {number} params.carId
   * @param {ConditionBuilder} params.additionalConditions
   */
  const playerBeganLap = params => $(
    inGamePlayerCar.idIs(params.carId),
    trackIdIs(params.trackId),

    params.additionalConditions,
    inASpecMode,

    andNext(
      hud.lapTime.current.withLast({ cmp: '>', rvalue: { value: 0 } }),
      hud.lapTime.newLap
    )
  )

  /**
    * @param {Object} params
    * @param {string} params.tires
    * @param {'' | 'manual'} params.gearbox
    * @param {'' | 'none'} params.aid
    * @param {number} params.topSpeedTune
    * @param {number} params.powerTune
  */
  const arcadeTimeTrialConditions = params => {
    const root = $(
      ['AddAddress', 'Mem', '32bit', 0x6187a8]
    )

    const tireTypes = {
      'n1': 0x0,
      'n2': 0x1,
      'n3': 0x2,
      'sh': 0x3,
      'sm': 0x4,
      'ss': 0x5,
      'rsh': 0x6,
      'rh': 0x7,
      'rm': 0x8,
      'rs': 0x9,
      'rss': 0xA,
    }

    const usingCorrectTires = $(
      root,
      ['', 'Mem', '32bit', 0x3b8, '=', 'Value', '', tireTypes[params.tires]],
      root,
      ['', 'Mem', '32bit', 0x3bc, '=', 'Value', '', tireTypes[params.tires]]
    )

    const correctPowerTune = $(
      root,
      ['', 'Mem', '32bit', 0x3b0, '=', 'Value', '', params.powerTune]
    )

    const weightAdjustZero = $(
      root,
      ['', 'Mem', '32bit', 0x3ac, '=', 'Value', '', 0]
    )

    const correctTopSpeedAdjust = $(
      root,
      ['', 'Mem', '8bit', 0x3b4, '=', 'Value', '', params.topSpeedTune]
    )

    return $(
      params.gearbox === 'manual' && $(
        root,
        ['', 'Mem', '32bit', 0x3c0, '=', 'Value', '', 1]
      ),
      params.aid === 'none' && $(
        root,
        ['', 'Mem', '32bit', 0x3c4, '=', 'Value', '', 0]
      ),
      stat.gameFlagIs.arcadeTimeTrial,
      usingCorrectTires,
      correctPowerTune,
      weightAdjustZero,
      correctTopSpeedAdjust
    )
  }

  return {
    p,

    lapCountIsGte,

    regionIs: {
      pal: $(
        ['', 'Mem', '32bit', 0x68bb00, '=', 'Value', '', 0x53454353],
        ['', 'Mem', '32bit', 0x68bb04, '=', 'Value', '', 0x3731352d],
      ),
      ntsc: $(
        ['', 'Mem', '32bit', 0x68bb00, '=', 'Value', '', 0x53554353],
        ['', 'Mem', '32bit', 0x68bb04, '=', 'Value', '', 0x3337392d],
      ),
    },

    eventIdValue,
    eventIdIs,
    trackIdValue,
    trackIdIs,

    playerBeganLap,
    inASpecMode,
    inBSpecMode,
    notInASpecMode,

    license: (() => {
      const state = $(
        p.root,
        ['', 'Delta', '32bit', 0x88, '=', 'Value', '', -2]
      )

      const time = $(
        p.root,
        ['', 'Mem', '32bit', 0x8c, '!=', 'Value', '', 0x157529ff]
      )

      return {
        /** @param {ObjectValue<meta["licenses"]>["eventId"]} eventIds */
        finished(eventIds, expectedReward = 0) {
          return $(
            orNext(
              eventIdIs(eventIds.pal),
              eventIdIs(eventIds.ntsc),
            ),
            state,
            expectedReward === 0 && state.withLast(
              { lvalue: { type: 'Mem' }, cmp: '<=', rvalue: { value: 4 } }
            ),
            expectedReward === 2 && state.withLast(
              { lvalue: { type: 'Mem' }, rvalue: { value: expectedReward } }
            ),
            expectedReward > 2 && expectedReward <= 4 && $(
              state.withLast(
                { lvalue: { type: 'Mem' }, cmp: '>=', rvalue: { value: 2 } }
              ),
              state.withLast(
                { lvalue: { type: 'Mem' }, cmp: '<=', rvalue: { value: expectedReward } }
              ),
            ),
            stat.gameFlagIs.license
          )
        },
        timeSubmitted: $(
          time,
          time.withLast({ cmp: '>', rvalue: { value: 0 } })
        ),
        measuredTime: $(
          p.root,
          ['Measured', 'Mem', '32bit', 0x8c]
        )
      }
    })(),

    earnedASpecPoints,
    earnedAtleastASpecPoints,

    inGameCar,
    inGamePlayerCar,
    playerWentOut,

    arcadeTimeTrialConditions,

    /**
     * @param {Object} params
     * @param {number} params.lapTimeTargetMsec
     * @param {number} params.trackId
     * @param {number} params.carId
     * @param {ConditionBuilder} params.additionalConditions
     */
    passedTimeTrial: params => $(
      andNext(
        'once',
        playerBeganLap(params)
      ),

      resetIf(
        playerWentOut.singleChainOfConditions,
        notInASpecMode
      ),

      trigger(
        inGamePlayerCar.completedLap,
        inGamePlayerCar.lastLapTimeWasLte(params.lapTimeTargetMsec)
      )
    ),

    /**
     * @param {Object} params
     * @param {number} [params.aSpecPoints]
     */
    wonRace(params = {}) {
      const { aSpecPoints = 0 } = params
      return $(
        aSpecPoints === 0 && earnedASpecPoints,
        aSpecPoints > 0 && earnedAtleastASpecPoints(aSpecPoints),
        inASpecMode,
        hud.showingRaceResults
      )
    },

    inFirstChampionshipRace: raceId => $(
      inASpecMode,
      stat.gameFlagIs.eventChampionship,
      eventIdIs(raceId)
    ),

    earnedChampionshipMoney: $(
      ['AddAddress', 'Mem', '32bit', 0x6187a8],
      ['', 'Mem', '32bit', 0x4a8, '>', 'Delta', '32bit', 0x4a8]
    ),

    hud
  }
})()

export const generalProtections = {
  /** @param {number[]} ids */
  forbiddenCarIds(...ids) {
    return $(
      ...ids.map(id => stat.gtModeCarIsNot(id)),
    )
  },

  noCheese: $(
    stat.gtModeCarIsNot(0x3BB), // Dodge RAM
    stat.gtModeCarIsNot(0x42D), // Chapparal
  ),
  noCheese200: $(
    stat.gtModeCarIsNot(0x1C0), // Suzuki GSX-R/4
    stat.gtModeCarIsNot(0x3BB), // Dodge RAM
    stat.gtModeCarIsNot(0x42D), // Chapparal
  ),

  pauseIfHasNitrous: pauseIf(stat.forEachSetupSlot(s => s.hasNitrous))
}


/**
 * @param {AchievementSet} set
 * @param {ObjectValue<typeof meta["events"]>} e
 * @param {Object} params
 * @param {string} [params.title]
 * @param {string} [params.description]
 * @param {number[]} [params.raceIds]
 * @param {number} [params.points]
 * @param {boolean} [params.trigger]
 * */
export function defineIndividualRace(set, e, params = {}) {
  let {
    title = e.name,
    description = `Win the ${e.name} event in A-Spec mode`,
    raceIds = e.raceIds,
    points = e.points,
    trigger = false
  } = params

  const nitrousSuffix = !e.aSpecPoints || e.nitrousAllowed ? '' : ' Nitrous is not allowed.'
  const aSpecSuffix = e.aSpecPoints ?
    ` and earn atleast ${e.aSpecPoints} A-Spec points.` : '.'

  description += aSpecSuffix

  const [carIdRequired, carRequirementSuffix] = e.carIdAnyEvent
  if (carIdRequired) {
    description += ' ' + carRequirementSuffix
  }

  set.addAchievement({
    title,
    description: description + nitrousSuffix + e.descriptionSuffix,
    points,
    type: e.achType,
    conditions: $(
      main.wonRace({ aSpecPoints: e.aSpecPoints }),
      main.eventIdIs(...raceIds),
      orNext(
        stat.gameFlagIs.eventRace,
        e.isChampionship && stat.gameFlagIs.eventChampionship,
      ),

      generalProtections.forbiddenCarIds(...e.carIdsForbidden),
      carIdRequired > 0 && stat.gtModeCarIs(carIdRequired),
      e.aSpecPoints > 0 && e.noCheese && generalProtections.noCheese,
      e.aSpecPoints > 0 && !e.nitrousAllowed && generalProtections.pauseIfHasNitrous
    )
  })
}