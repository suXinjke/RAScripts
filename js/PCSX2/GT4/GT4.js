// @ts-check
import '../../common.js'
import {
  AchievementSet, Condition, ConditionBuilder, define as $,
  addHits, andNext, orNext, resetIf, trigger, pauseIf
} from '@cruncheevos/core'
import codegen from './codegen.js'
import { makeRichPresenceDisplay, makeRichPresenceLookup } from '../../common.js'
import { asciiToNumberLE } from '../../common.js'

/**
 * @template T
 * @typedef {T extends (Record <string, infer U>) ? U : never} ObjectValue
 * **/

/**
 * @template T
 * @typedef {T extends (infer U)[] ? U : never} ArrayValue
 * **/

const set = new AchievementSet({ gameId: 20580, title: 'Gran Turismo 4' })

/** @param {ConditionBuilder | Condition} c */
function pointerNullCheck(c) {
  return $(c).withLast({ flag: '', cmp: '!=', rvalue: { type: 'Value', value: 0 } })
}

const stat = (() => {
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

const main = (() => {
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

  const inGameRace = (() => {
    const finished = $(
      p.root84,
      ['AddAddress', 'Mem', '32bit', 0xe41c],
      ['', 'Mem', '32bit', 0x0, '=', 'Value', '', 1]
    )

    const currentLapTimeMsec = $(
      p.root84,
      ['AddAddress', 'Mem', '32bit', 0xE420],
      ['', 'Delta', '32bit', 0x1664, '<=', 'Value', '', 0x3F]
    )

    return {
      finished,
      currentLapTimeMsec,
      lapBegan: andNext(
        currentLapTimeMsec,
        currentLapTimeMsec.withLast({ lvalue: { type: 'Mem' }, cmp: '>' })
      ),
      inBSpecMode: $(
        p.root84,
        ['', 'Mem', '32bit', 0xCCC, '=', 'Value', '', 1]
      )
    }
  })()

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
      inGameRace.currentLapTimeMsec.withLast({ cmp: '>', rvalue: { value: 0 } }),
      inGameRace.lapBegan
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
    inGameRace,

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
        inGameRace.finished
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

    hud: (() => {
      const base = $(
        p.root84,
        ['AddAddress', 'Mem', '32bit', 0xe420],
      )
      const speedBase = $(
        base,
        ['AddAddress', 'Mem', '32bit', 0x14],
      )

      return {
        positionIs: position => $(
          base,
          ['', 'Mem', '32bit', 0x13b0, '=', 'Value', '', position]
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
  }
})()

const generalProtections = {
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

  pauseIfHasNitrous: pauseIf(stat.forEachSetupSlot(s => s.hasNitrous))
}

const meta = await codegen()

/** @param {ObjectValue<typeof meta["events"]>} e */
function defineChampionship(e) {
  set.addAchievement({
    title: e.name,
    description: `Win ${e.name} in A-Spec championship mode in one sitting.` + e.descriptionSuffix,
    points: e.points,
    type: e.achType,
    conditions: $(
      andNext(
        'once',
        main.inFirstChampionshipRace(e.raceIds[0]),
        generalProtections.forbiddenCarIds(...e.carIdsForbidden),
        main.inGameRace.lapBegan
      ),

      resetIf(
        stat.abandonedChampionship,
        main.inGameRace.inBSpecMode
      ),

      main.earnedChampionshipMoney
    )
  })
}

/** @param {ObjectValue<typeof meta["events"]>} e */
function defineAllRacesInOneSitting(e) {
  let description = `Win all events of ${e.nameWithSuffix} in A-Spec mode in one sitting.`
  if (e.aSpecPoints) {
    const nitrousSuffix = e.nitrousAllowed ? '' : ' Nitrous is not allowed.'
    description =
      `Win all ${e.name} events in one sitting in A-Spec mode, earning ` +
      `atleast ${e.aSpecPoints} A-Spec points in each.` + nitrousSuffix
  }

  set.addAchievement({
    title: e.name,
    description: description + e.descriptionSuffix,
    points: e.points,
    type: e.achType,
    conditions: $(
      ...e.raceIds.map(id => addHits(
        'once',
        andNext(
          main.wonRace({ aSpecPoints: e.aSpecPoints }),
          main.eventIdIs(id),
          stat.gameFlagIs.eventRace,
          generalProtections.forbiddenCarIds(...e.carIdsForbidden),
          e.aSpecPoints > 0 && $(
            e.noCheese && generalProtections.noCheese,
          )
        )
      )),
      `M:0=1.${e.raceIds.length}.`,
      e.aSpecPoints > 0 && generalProtections.pauseIfHasNitrous
    )
  })
}

/**
 * @param {ObjectValue<typeof meta["events"]>} e
 * @param {Object} params
 * @param {string} [params.title]
 * @param {string} [params.description]
 * @param {number[]} [params.raceIds]
 * @param {number} [params.points]
 * */
function defineIndividualRace(e, params = {}) {
  let {
    title = e.name,
    description = `Win the ${e.name} event in A-Spec mode`,
    raceIds = e.raceIds,
    points = e.points
  } = params

  const nitrousSuffix = !e.aSpecPoints || e.nitrousAllowed ? '' : ' Nitrous is not allowed.'
  const aSpecSuffix = e.aSpecPoints ?
    ` and earn atleast ${e.aSpecPoints} A-Spec points.` : '.'

  description += aSpecSuffix

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
      e.aSpecPoints > 0 && e.noCheese && generalProtections.noCheese,
      e.aSpecPoints > 0 && !e.nitrousAllowed && generalProtections.pauseIfHasNitrous,
    )
  })
}

/** @param {ArrayValue<typeof meta["anySubEvent"]>} c */
function defineAnySubEventWin(c) {
  const events = c.multiEventId.map(eventId => meta.events[eventId])
  const raceIds = c.specificRaceIds.length > 0 ? c.specificRaceIds : events[0].raceIds
  const eventName = events[0]?.name || ''
  const eventNameWithSuffix = events[0]?.nameWithSuffix || ''

  const noCheese = events.some(e => e.noCheese)
  const championshipPossible = events.some(e => e.isChampionship)

  const nitrousSuffix = c.nitrousAllowed ? '' : ` Nitrous is not allowed.`
  let subTitle = 'Challenge'
  let description = ''

  if (c.carIdsRequired.length > 0) {
    subTitle = 'Car ' + subTitle
    description = [
      'Win ',
      c.eventDescriptionOverride || ('any ' + eventNameWithSuffix + ' event'),
      (c.aSpecPoints <= 0 ? '' : ` and earn atleast ${c.aSpecPoints} A-Spec points`),
      ` while driving ${c.descriptionSuffix}`
    ].join('')
  } else if (c.specificRaceIds.length > 0) {
    description = `Win ${c.eventDescriptionOverride} in A-Spec mode and earn atleast ${c.aSpecPoints} A-Spec points.`
  } else {
    description = `Earn ${c.aSpecPoints} A-Spec points or more in any of the ${eventNameWithSuffix} events.`
  }

  if (c.aSpecPoints > 0) {
    subTitle = `A-Spec ` + subTitle
  }

  set.addAchievement({
    title: c.achievementNameOverride || (eventName + ` - ` + subTitle),
    description: description + nitrousSuffix,
    points: c.points,
    conditions: $(
      main.wonRace({ aSpecPoints: c.aSpecPoints }),
      main.eventIdIs(...raceIds),
      orNext(
        stat.gameFlagIs.eventRace,
        championshipPossible && stat.gameFlagIs.eventChampionship,
      ),
      stat.gtModeCarIs(...c.carIdsRequired),
      noCheese && generalProtections.noCheese,
      !c.nitrousAllowed && generalProtections.pauseIfHasNitrous
    )
  })
}

/** @param {ArrayValue<typeof meta["carEventWin"]>} c */
function defineCarEventWin(c) {
  const { raceIds, isChampionship } = meta.events[c.eventId]
  set.addAchievement({
    title: c.achName,
    description: c.achDescription,
    points: c.points,
    conditions: $(
      main.inGamePlayerCar.idIs(...c.carIdsRequired),
      c.raceIndex === -1 && main.eventIdIs(...raceIds),
      main.wonRace(),
      c.raceIndex >= 0 && main.eventIdIs(raceIds[c.raceIndex]),
      orNext(
        stat.gameFlagIs.eventRace,
        isChampionship && stat.gameFlagIs.eventChampionship,
      ),
      stat.gtModeCarIs(...c.carIdsRequired)
    )
  })
}

/** @param {ArrayValue<typeof meta["arcadeTimeTrial"]>} c */
function defineArcadeTimeTrial(c) {
  set.addAchievement({
    title: c.achName,
    description: c.description,
    points: c.points,
    conditions: main.passedTimeTrial({
      ...c,
      additionalConditions: main.arcadeTimeTrialConditions(c),
      lapTimeTargetMsec: c.lapTimeTargetMsec,
    })
  }).addLeaderboard({
    title: c.achName,
    description: 'Fastest time in msec to complete this achievement',
    lowerIsBetter: true,
    type: 'FIXED3',
    conditions: {
      start: main.playerBeganLap({
        ...c,
        additionalConditions: main.arcadeTimeTrialConditions(c)
      }),
      cancel: {
        core: '1=1',
        ...([
          ...main.playerWentOut.arrayOfAlts,
          orNext(main.notInASpecMode)
        ]).reduce((prev, cur, idx) => {
          prev[`alt${idx + 1}`] = cur
          return prev
        }, {})
      },
      submit: main.inGamePlayerCar.completedLap,
      value: main.inGamePlayerCar.measuredLastLapTime
    }
  })
}

const coffeeNames = {
  "B": ["Caffè Latte", "Coffee Break"],
  "A": ["Mocha", "Coffee Break"],
  "IB": ["Flat White", "Coffee Broken"],
  "IA": ["Cappuccino", "Coffee Break (the car)"],
  "S": ["Americano", "Coffee Break (your day)"],
}
/** @param {ObjectValue<typeof meta["licenses"]>} l */
function defineLicenseAchievements(l) {
  const leaderboardConditions = {
    start: $(
      main.license.finished(l.eventId),
      main.license.timeSubmitted
    ),
    cancel: '0=1',
    submit: '1=1',
    value: $(main.license.measuredTime)
  }

  const [coffeeTitle, funnyCoffee] = coffeeNames[l.license]
  const shortName = `${l.license}-${l.index}`
  set.addAchievement({
    title: l.isCoffee ? coffeeTitle : `License ${shortName} - Gold`,
    description: l.isCoffee ?
      `Earn the golden coffee in ${funnyCoffee} for ${l.license} License.` :
      `Earn the gold reward in license test ${shortName} - ${l.name}`,
    points: l.points,
    conditions: main.license.finished(l.eventId, 2)
  }).addLeaderboard({
    title: l.isCoffee ?
      `Coffee Break ${l.license}: ${l.name}` :
      `License ${shortName}: ${l.name}`,
    description: `Fastest time to complete in msec`,
    type: 'FIXED3',
    lowerIsBetter: true,
    conditions: leaderboardConditions
  })
}

/** @param {ArrayValue<typeof meta["carChallenges"]>} c */
function defineCarChallenge(c) {
  const { aSpecPoints } = c
  const carName = meta.carLookup[c.carIds[0]]

  const carDescription = c.description || carName
  const description = `Earn ${aSpecPoints} A-Spec points or more in ${carDescription}.`
  const arcadeOnly = c.fullDescription.includes('Arcade')

  const raceIds = c.eventStringIds.flatMap(stringId => meta.events[stringId].raceIds)

  const specificParts = c.forbiddenGearboxId.length > 0

  set.addAchievement({
    title: c.name,
    description: c.fullDescription || description,

    points: c.points,
    conditions: {
      core: $(
        main.inGamePlayerCar.idIs(...c.carIds),
        main.trackIdIs(...c.trackIds),
        c.colorId !== -1 && main.inGamePlayerCar.colorIdIs(c.colorId),
        main.eventIdIs(...raceIds),
        main.wonRace({ aSpecPoints }),
        specificParts === false && orNext(
          stat.gameFlagIs.arcadeRace,
          arcadeOnly === false && stat.gameFlagIs.eventRace,
          arcadeOnly === false && stat.gameFlagIs.eventChampionship,
        ),
        c.laps > 0 && main.lapCountIsGte(c.laps)
      ),
      ...(specificParts ? {
        alt1: stat.gameFlagIs.arcadeRace,
        alt2: $(
          orNext(
            stat.gameFlagIs.eventRace,
            stat.gameFlagIs.eventChampionship,
          ),
          pauseIf(
            stat.forEachSetupSlot(s => s.gearboxIdIsNotOneOf(c.forbiddenGearboxId))
          )
        )
      } : {})
    }
  })
}

/**
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.description
 * @param {number} params.points
 * @param {number} params.speedKPH
 * @param {number} params.speedMPH
 */
function defineSpeedAchievement(params) {
  const { speedKPH, speedMPH, ...rest } = params
  set.addAchievement({
    ...rest,
    conditions: {
      core: $(
        main.inASpecMode,
        main.inGamePlayerCar.isNotControlledByAI,
        main.inGamePlayerCar.isNotControlledByAIRollingStart,
        main.hud.speed.isRendered
      ),
      alt1: main.hud.speed.wentPastSpeed('kph', true, speedKPH),
      alt2: main.hud.speed.wentPastSpeed('kph', false, speedKPH),
      alt3: main.hud.speed.wentPastSpeed('mph', true, speedMPH),
      alt4: main.hud.speed.wentPastSpeed('mph', false, speedMPH),
    }
  })
}

export default function () {
  const events = Object.values(meta.events).filter(x => x.subsetOnly === false)

  const championshipsInOneSitting = events.filter(e => e.inOneSitting && e.isChampionship)
  const oneSittingRaces = events.filter(e => !e.isChampionship && e.inOneSitting && e.races.length > 1)
  const individualRaces = events.filter(e => !e.inOneSitting || e.races.length === 1)

  for (const e of championshipsInOneSitting) {
    defineChampionship(e)
  }
  for (const e of oneSittingRaces) {
    defineAllRacesInOneSitting(e)
  }
  for (const e of individualRaces) {
    if (e.races.length > 1) {
      e.races.forEach(({ raceId, trackId }, i) => {
        const trackName = meta.trackLookup[trackId]

        defineIndividualRace(e, {
          title: `${e.name} - Race #${i + 1}`,
          description: `Win race #${i + 1} of ${e.name} on ${trackName} in A-Spec mode`,
          raceIds: [raceId],
          points: e.points / e.races.length
        })
      })
    } else {
      defineIndividualRace(e)
    }
  }

  for (const c of meta.anySubEvent) {
    defineAnySubEventWin(c)
  }

  for (const c of meta.carEventWin) {
    defineCarEventWin(c)
  }

  for (const c of meta.arcadeTimeTrial) {
    defineArcadeTimeTrial(c)
  }

  for (const c of meta.carChallenges) {
    defineCarChallenge(c)
  }

  for (const m of Object.values(meta.missions)) {
    set.addAchievement({
      title: m.name,
      description: `Complete mission #${m.index} - ${m.nameFull}`,
      points: m.points,
      conditions: {
        core: $(
          main.earnedASpecPoints,
          main.inASpecMode,
          main.inGameRace.finished,
          stat.gameFlagIs.mission
        ),
        alt1: main.eventIdIs(m.eventId.pal),
        alt2: main.eventIdIs(m.eventId.ntsc),
      }
    })
  }

  for (const l of Object.values(meta.licenses)) {
    defineLicenseAchievements(l)
  }

  for (const [letter, points, title] of /** @type const */ ([
    ['B', 5, 'National B License'],
    ['A', 5, 'National A License'],
    ['IB', 10, 'International IB License'],
    ['IA', 10, 'International IA License'],
    ['S', 25, 'Superlicense'],
  ])) {
    const tests = Object.values(meta.licenses)
      .filter(license => license.license === letter && license.isCoffee === false)

    set.addAchievement({
      title: title + ' Graduate',
      description:
        `Earn bronze reward or better in all ${title} tests, ` +
        `or pass all tests in one sitting if you already have the license. ` +
        `Coffee break is not required.`,
      points,
      type: letter === 'S' ? '' : 'progression',
      conditions: {
        core: '1=1',

        // You finished all licenses in one session
        alt1: $(
          addHits(
            ...tests
              .map(x =>
                andNext(
                  'once',
                  main.license.finished(x.eventId, 4)
                )
              )
          ),
          `M:0=1.${tests.length}.'`
        ),

        // PAL version - checking final license flag flip
        alt2: $(
          stat.gameFlagIs.license,
          pointerNullCheck(main.p.root),
          main.regionIs.pal,
          ...tests.map((test, idx) => $(
            ['', 'Mem', 'Upper4', test.palFlagAddress, '<=', 'Value', '', 0xB],
            idx === tests.length - 1 && (
              ['', 'Delta', 'Upper4', test.palFlagAddress, '>', 'Value', '', 0xB]
            )
          ))
        ),

        // NTSC version - checking final license flag flip
        // Version 2.00 has flags positioned different, so a pointer dereference is done
        alt3: $(
          stat.gameFlagIs.license,
          pointerNullCheck(main.p.root),
          main.regionIs.ntsc,
          ...tests.map((test, idx) => $(
            ['AddAddress', 'Mem', '32bit', 0x622f4c],
            ['', 'Mem', 'Upper4', test.ntscFlagOffset, '<=', 'Value', '', 0xB],
            idx === tests.length - 1 && $(
              ['AddAddress', 'Mem', '32bit', 0x622f4c],
              ['', 'Delta', 'Upper4', test.ntscFlagOffset, '>', 'Value', '', 0xB],
            )
          ))
        ),
      }
    })
  }

  set.addAchievement({
    title: 'Hold Your Horses',
    description: 'Overtake the Pace Car in any License test.',
    points: 2,
    conditions: $(
      stat.gameFlagIs.license,
      main.inASpecMode,
      main.hud.positionIs(2).withLast({ lvalue: { type: 'Delta' } }),
      main.hud.positionIs(1),
      main.inGameCar(1).idIs(0x1ED)
    )
  })

  set.addAchievement({
    title: 'Adverse Camber Reigns',
    description: 'Win any Tuning Car Grand Prix event with all of your wheels camber tuned to 10 deg or more.',
    points: 5,
    conditions: $(
      trigger(main.wonRace()),
      main.eventIdIs(...meta.events.pr_tuning.raceIds),
      orNext(
        stat.gameFlagIs.eventRace,
        stat.gameFlagIs.eventChampionship,
      ),
      pauseIf(
        stat.forEachSetupSlot(s => s.wrongAdverseCamberReigns)
      )
    )
  })

  defineSpeedAchievement({
    title: "Fast Made Mundane",
    description: "Drive fast enough and go above 300 km/h (186 mp/h).",
    points: 2, speedKPH: 300, speedMPH: 186
  })
  defineSpeedAchievement({
    title: "Serious Business Speed",
    description: "Drive an insanely fast car and send it above 400 km/h (249 mp/h).",
    points: 3, speedKPH: 400, speedMPH: 249
  })
  defineSpeedAchievement({
    title: "It's Time to Stop",
    description: "Devilishly tune an insanely fast car and send it extremely hard above 500 km/h (311 mp/h).",
    points: 5, speedKPH: 500, speedMPH: 311
  })

  set.addAchievement({
    title: 'Bob the Driver',
    description: 'Win any race in B-Spec mode.',
    points: 1,
    conditions: {
      core: $(
        main.inBSpecMode,
        main.inGameRace.finished.withLast({
          // TODO: remove size property - you get very confusing error message
          cmp: '>', rvalue: { type: 'Delta', size: '32bit', value: 0 }
        }),

        ...Array.from({ length: 6 }, (_, i) =>
          main
            .inGameCar(i)
            .lapsRemainingAre(0)
            .withLast({ cmp: i === 0 ? '=' : '>' })
        )
      ),
      alt1: stat.gameFlagIs.arcadeRace,
      alt2: stat.gameFlagIs.eventChampionship,
      alt3: stat.gameFlagIs.eventRace,
    }
  })

  set.addAchievement({
    title: 'Whoosh!',
    description: 'Do a less than 8 seconds run on a Las Vegas Drag Strip while using manual transmission.',
    points: 5,
    conditions: $(
      stat.gameFlagIs.powerAndSpeed,
      main.eventIdIs(0xCEC),
      main.inGameCar(0).lastLapTimeWasLt(8000),
      stat.gearboxSettingIs('manual'),
      main.inASpecMode,
      main.inGameRace.finished
    )
  })

  set.addAchievement({
    title: 'Underdog Racing',
    description: 'Earn 200 A-Spec points in any race except for Speedster Trophy and 206 Cup. Family Cup and Arcade mode are allowed. Driving Dodge RAM, Chaparal 2J, or having nitrous is not allowed.',
    points: 25,
    conditions: {
      core: $(
        main.wonRace({
          aSpecPoints: 200,
        }),
        main.inGamePlayerCar.idIs(0x3BB).withLast({ cmp: '!=' }), // RAM
        main.inGamePlayerCar.idIs(0x42D).withLast({ cmp: '!=' }), // Chapparal
      ),
      alt1: stat.gameFlagIs.arcadeRace,
      alt2: $(
        orNext(
          stat.gameFlagIs.eventRace,
          stat.gameFlagIs.eventChampionship,
        ),
        ...[
          ...meta.events.de_opel_speed.raceIds,
          ...meta.events.fr_peugeot_206.raceIds,
        ].map(id => main.eventIdIs(id).withLast({ cmp: '!=' })),
        generalProtections.pauseIfHasNitrous
      )
    }
  })

  set.addAchievement({
    title: 'Bully',
    description: 'Lap all of your opponents on any Sunday Cup event and finish first.',
    points: 5,
    conditions: $(
      main.wonRace(),
      main.eventIdIs(...meta.events.am_sunday.raceIds),
      stat.gameFlagIs.eventRace,

      ...Array.from({ length: 5 }, (_, i) =>
        main
          .inGameCar(i + 1)
          .lapsRemainingAre(2)
          .withLast({ cmp: '>=' })
      )
    )
  })

  {
    set.addAchievement({
      title: 'Have You Heard Of: Type C Streamline?',
      description: `Gran Turismo mode, Free Run, Auto Union V16 Type C Streamline \`37, Racing Soft tires, no turbo kit and weight ballast, body rigidity upgrade optional. Do a clean lap on Nurburgring Nordschleife and beat the time of 6:40'000.`,
      points: 25,
      conditions: main.passedTimeTrial({
        carId: 0x431,
        trackId: 0x41,
        lapTimeTargetMsec: 400000,
        additionalConditions: $(
          stat.gameFlagIs.freeRun,
          pauseIf(stat.forEachSetupSlot(s => s.wrongAutoUnionParts))
        )
      })
    }).addLeaderboard({
      title: 'Have You Heard Of: Type C Streamline?',
      description: 'Fastest time in msec to complete this achievement',
      lowerIsBetter: true,
      type: 'FIXED3',
      conditions: {
        start: main.playerBeganLap({
          carId: 0x431,
          trackId: 0x41,
          additionalConditions: $(
            stat.gameFlagIs.freeRun,
            pauseIf(stat.forEachSetupSlot(s => s.wrongAutoUnionParts))
          )
        }),
        cancel: {
          core: '1=1',
          ...([
            ...main.playerWentOut.arrayOfAlts,
            orNext(main.notInASpecMode)
          ]).reduce((prev, cur, idx) => {
            prev[`alt${idx + 1}`] = cur
            return prev
          }, {})
        },
        submit: main.inGamePlayerCar.completedLap,
        value: main.inGamePlayerCar.measuredLastLapTime
      }
    })
  }

  set.addAchievement({
    title: 'One Horsepower Wonder',
    description: 'Take any of Mercedes-Benz ONE HORSEPOWER carriages and have enough patience to complete one lap on any track. Did you like it???',
    points: 1,
    conditions: {
      core: $(
        main.inGamePlayerCar.idIs(0x3D2, 0x3D3),
        main.inASpecMode,
        main.inGamePlayerCar.completedLap
      ),
      alt1: stat.gameFlagIs.arcadeTimeTrial,
      alt2: stat.gameFlagIs.freeRun,
      alt3: stat.gameFlagIs.photoDrive,
    }
  })

  console.log('Achievement Count: ', [...set.achievements].length)
  console.log('Leaderboard Count: ', [...set.leaderboards].length)
  return set
}

if (process.argv.includes('rich')) {
  const carLookup = makeRichPresenceLookup({
    name: 'Car', keyFormat: 'dec',
    defaultAddress: stat.gtModeCarValue, values: {
      ...meta.carLookup,
      '*': '- -'
    }
  })

  const eventLookup = makeRichPresenceLookup({
    name: 'Event', keyFormat: 'dec',
    defaultAddress: main.eventIdValue, values: meta.eventLookup
  })

  const trackLookup = makeRichPresenceLookup({
    name: 'Track', keyFormat: 'dec',
    defaultAddress: main.trackIdValue, values: {
      ...meta.trackLookup,
      174: 'Gymkhana Course'
    },
  })

  function makeLicenseCheck(letter = '', emoji = '', id = '', whitespace = '') {
    return {
      lookup: makeRichPresenceLookup({
        name: `License_${letter}`, keyFormat: 'dec', values: {
          16: whitespace + emoji
        }
      }),
      letter,
      emoji,
      idKey: asciiToNumberLE(id)
    }
  }

  const substringEventString = $(
    ['AddAddress', 'Mem', '32bit', 0x6187a8],
    ['Measured', 'Mem', '8bit', 0x3c8]
  )

  const letters = [
    substringEventString.withLast({ lvalue: { value: 0x3cd } }),
    substringEventString.withLast({ lvalue: { value: 0x3ce } }),
  ].map(x => `@ASCIIChar(${x})`).join('')

  const licenses = {
    B: makeLicenseCheck('B', '🟩', 'l0b0', ' '),
    A: makeLicenseCheck('A', '🟨', 'l0a0'),
    IB: makeLicenseCheck('IB', '🟦', 'lib0'),
    IA: makeLicenseCheck('IA', '🟥', 'lia0'),
    S: makeLicenseCheck('S', '🟪', 'l0s0'),
  }

  const licenseColor = makeRichPresenceLookup({
    name: 'LicenseColor', keyFormat: 'dec',
    defaultAddress: substringEventString.withLast({ lvalue: { size: '32bit' } }),
    values: Object.values(licenses).reduce((prev, cur) => {
      prev[cur.idKey] = cur.emoji
      return prev
    }, {})
  })

  const licenseLetter = makeRichPresenceLookup({
    name: 'LicenseLetter', keyFormat: 'dec',
    defaultAddress: substringEventString.withLast({ lvalue: { size: '32bit' } }),
    values: Object.values(licenses).reduce((prev, cur) => {
      prev[cur.idKey] = cur.letter
      return prev
    }, {})
  })

  const lookups = [
    carLookup,
    eventLookup,

    ...Object.values(licenses).map(l => l.lookup),
    licenseColor,
    licenseLetter,

    trackLookup
  ].join('\n\n')

  function displayValue(strings, ...args) {
    return strings.map((str, i) => {
      let val = i === strings.length - 1 ? '' : args[i]
      if (val.defaultPoint) {
        val = `@${val.name}(${val.defaultPoint()})`
      }
      return `${str}${val}`;
    }).join('');
  }

  const displays = [
    makeRichPresenceDisplay(
      stat.gameFlagIs.arcadeRace,
      displayValue`[🏁 Arcade Race] 📍 ${trackLookup} 🚗 ${carLookup}`
    ),
    makeRichPresenceDisplay(
      stat.gameFlagIs.raceMeeting,
      displayValue`[🏁 Race Meeting] 📍 ${trackLookup} 🚗 ${carLookup}`
    ),
    makeRichPresenceDisplay(
      stat.gameFlagIs.arcadeTimeTrial,
      displayValue`[🏁 Arcade Time Trial] 📍 ${trackLookup} 🚗 ${carLookup}`
    ),
    makeRichPresenceDisplay(
      $(
        stat.gameFlagIs.license,
        substringEventString.withLast({ flag: '', lvalue: { size: '32bit' }, cmp: '=', rvalue: { type: 'Value', value: asciiToNumberLE('l0c0') } }),
      ),
      displayValue`[☕ Coffee Break] ${letters} ${eventLookup} 🚗 ${carLookup.point(main.inGamePlayerCar.idValue)}`
    ),
    makeRichPresenceDisplay(
      stat.gameFlagIs.license,
      displayValue`[🔰 License Center] ${licenseColor} ${licenseLetter}-${letters} ${eventLookup} 🚗 ${carLookup.point(main.inGamePlayerCar.idValue)}`
    ),
    makeRichPresenceDisplay(
      stat.gameFlagIs.mission,
      displayValue`[🎯 ${eventLookup}] 🚗 ${carLookup.point(main.inGamePlayerCar.idValue)}`
    ),
    makeRichPresenceDisplay(
      stat.gameFlagIs.freeRun,
      displayValue`[⏱ Free Run] 📍 ${trackLookup} 🚗 ${carLookup}`
    ),
    makeRichPresenceDisplay(
      stat.gameFlagIs.powerAndSpeed,
      displayValue`[⏱ ${eventLookup}] 🚗 ${carLookup}`
    ),
    makeRichPresenceDisplay(
      stat.gameFlagIs.photoDrive,
      displayValue`[📸 ${trackLookup}] 🚗 ${carLookup}`
    ),
    makeRichPresenceDisplay(
      stat.gameFlagIs.photoScene,
      displayValue`[📸 Photo Travel] 🚗 ${carLookup}`
    ),
    makeRichPresenceDisplay(
      orNext(stat.gameFlagIs.eventRace, stat.gameFlagIs.eventChampionship),
      displayValue`[🏁 ${eventLookup}] 📍 ${trackLookup} 🚗 ${carLookup}`
    ),

    ...['pal', 'ntsc'].map(region => {
      const licenseBadges = Object.values(licenses).map(l => {
        const tests = Object.values(meta.licenses)
          .filter(license => license.license === l.letter && license.isCoffee === false)

        const amountOfTestsPassed = $(...tests.map(test => region === 'pal' ?
          $(['AddSource', 'Mem', 'Bit0', test.palFlagAddress]) :
          $(
            ['AddAddress', 'Mem', '32bit', 0x622f4c],
            ['AddSource', 'Mem', 'Bit0', test.ntscFlagOffset]
          )
        ))

        return l.lookup.point($(amountOfTestsPassed, ['Measured', 'Value', '', 0]))
      }).join('')

      const date = $(
        ['SubSource', 'Value', '', 2453461],
        stat.root,
        ['Measured', 'Mem', '32bit', 0xBC28]
      )

      const mileage = $(
        stat.root,
        ['Measured', 'Mem', '32bit', 0x3b8, '*', 'Float', '', 0.001]
      )

      return makeRichPresenceDisplay($(
        main.regionIs[region],
        stat.gameFlagIs.inGameMenus,
        stat.inGTModeProject
      ), displayValue`[🏠 Home${licenseBadges}] 🚗 ${carLookup.point(stat.gtModeCarValue)} 📅 Day @Number(${date}) | @Number(${mileage}) km`)
    }),
    'Playing Gran Turismo 4'
  ].join('\n')

  console.log(lookups + '\n\nDisplay:\n' + displays)
}