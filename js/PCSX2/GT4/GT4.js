// @ts-check
import '../../common.js'
import {
  AchievementSet, ConditionBuilder, define as $,
  addHits, andNext, orNext, resetIf, trigger
} from '@cruncheevos/core'
import codegen from './codegen.js'
const set = new AchievementSet({ gameId: 20580, title: 'Gran Turismo 4' })

/** @param {ConditionBuilder} c */
function pointerNullCheck(c) {
  return c.withLast({ flag: '', cmp: '!=', rvalue: { type: 'Value', value: 0 } })
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
      license: gameFlagIs(7),
      mission: gameFlagIs(8),
      photoDrive: gameFlagIs(9),
      arcadeRace: gameFlagIs(0xA),
      arcadeTimeTrial: gameFlagIs(0xB),
    }
  })()

  const gtModeCarIsNot = id => $(
    root,
    ['', 'Mem', '32bit', 0x13940, '!=', 'Value', '', id]
  )

  // TODO: add this to code notes!!
  const selectedSetupSlotIs = slot => $(
    root,
    ['', 'Mem', '8bit', 0x13dc8, '=', 'Value', '', slot]
  )

  return {
    gameFlagIs,
    abandonedChampionship: andNext(
      gameFlagIs.inGameMenus,

      root,
      ['', 'Mem', '8bit', 0x38c20, '=', 'Value', '', 0]
    ),

    gtModeCarIsNot,
    gtModeCarIs: id => gtModeCarIsNot(id).withLast({ cmp: '=' }),

    // TODO: hack delete this, exploit is on Underdog Racing
    noNitrous: $(
      root,
      ['', 'Mem', '32bit', 0x13a38, '=', 'Value', '', -1]
    ),

    noNitrousSlot0: $(
      selectedSetupSlotIs(0),
      root,
      ['', 'Mem', '32bit', 0x13a38, '=', 'Value', '', -1]
    ),

    gearboxIdIs: id => $(
      selectedSetupSlotIs(0),
      root,
      ['', 'Mem', '32bit', 0x13988, '=', 'Value', '', id]
    ),

    correctAutoUnionParts: $(
      selectedSetupSlotIs(0),
      root,
      ['', 'Mem', '32bit', 0x139f0, '=', 'Value', '', 0x91d],
      root,
      ['', 'Mem', '32bit', 0x139a0, '=', 'Value', '', 0xde1b],
      root,
      ['', 'Mem', '32bit', 0x139a8, '=', 'Value', '', 0xde15],
      root,
      ['', 'Mem', '8bit', 0x13a9b, '=', 'Value', '', 0],
    ),

    adverseCamberReigns: $(
      selectedSetupSlotIs(0),
      root,
      ['', 'Mem', '8bit', 0x13a79, '>=', 'Value', '', 100],
      root,
      ['', 'Mem', '8bit', 0x13a7a, '>=', 'Value', '', 100],
    )
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

  const eventIdIs = (id = 0) => $(
    p.root,
    ['', 'Mem', '32bit', 0x68, '=', 'Value', '', id]
  )

  const trackIdIs = (id = 0) => $(
    p.root,
    ['', 'Mem', '32bit', 0x78, '=', 'Value', '', id]
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

  const race = (() => {
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

  const event = (() => {
    return {
      /**
       * @param {Object} params
       * @param {number[]} [params.raceIds]
       * @param {number} [params.aSpecPoints]
       * @param {ConditionBuilder} [params.protections]
       */
      wonRacesInOneSession(params = {}) {
        const { raceIds = [], aSpecPoints = 0, protections = false } = params

        return $(
          ...raceIds.map(id => addHits(
            'once',
            andNext(
              aSpecPoints === 0 && earnedASpecPoints,
              aSpecPoints > 0 && earnedAtleastASpecPoints(aSpecPoints),
              inASpecMode,
              race.finished,
              eventIdIs(id),
              stat.gameFlagIs.eventRace,
              protections
            )
          )),

          // TODO: should it stay here?
          `M:0=1.${raceIds.length}.`
        )
      },

      /**
       * @param {Object} params
       * @param {number[]} [params.raceIds]
       * @param {number} [params.aSpecPoints]
       * @param {boolean} [params.championshipPossible]
       * @param {boolean} [params.arcadeRacePossible]
       * @param {boolean} [params.arcadeOnly]
       * @param {boolean} [params.doFlagChecks]
       * @param {boolean} [params.applyTrigger]
       * @param {ConditionBuilder} [params.protections]
       */
      wonAnyRace(params) {
        const {
          raceIds = [],
          championshipPossible = false,
          arcadeRacePossible = false,
          arcadeOnly = false,
          doFlagChecks = true,
          aSpecPoints = 0,
          protections = $()
        } = params

        let triggerConditions = $(
          aSpecPoints === 0 && earnedASpecPoints,
          aSpecPoints > 0 && earnedAtleastASpecPoints(aSpecPoints),
          inASpecMode,
          race.finished
        )

        triggerConditions = params.applyTrigger ? trigger(triggerConditions) : triggerConditions

        return $(
          triggerConditions,
          orNext(
            ...raceIds.map(id => eventIdIs(id))
          ),
          doFlagChecks && orNext(
            (arcadeRacePossible || arcadeOnly) && stat.gameFlagIs.arcadeRace,
            !arcadeOnly && stat.gameFlagIs.eventRace,
            championshipPossible && !arcadeOnly && stat.gameFlagIs.eventChampionship
          ),
          protections
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
      )
    }
  })()

  const inGameRaceState = (() => {
    const base = $(
      p.root60,
      ['AddAddress', 'Mem', '32bit', 0x8],
    )

    return {
      car(index) {
        const carBase = $(
          base,
          ['AddAddress', 'Mem', '32bit', index * 4],
        )
        return {
          idIs: (id) => $(
            carBase,
            ['', 'Mem', '32bit', 0x20, '=', 'Value', '', id]
          ),
          colorIdIs: (id) => $(
            carBase,
            ['', 'Mem', '8bit', 0x38, '=', 'Value', '', id]
          ),

          // TODO: validate meaning of this, code note might be incorrect
          lapTimeIsGt: target => $(
            carBase,
            ['', 'Mem', '32bit', 0x1AC, '>', 'Value', '', target]
          ),

          completedLap: $(
            carBase,
            ['', 'Mem', '32bit', 0x1AC, '>', 'Delta', '32bit', 0x1AC]
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
    }
  })()

  const inGamePlayerCar = inGameRaceState.car(0)
  const inGameGearboxIs = gearbox => $(
    ['AddAddress', 'Mem', '32bit', 0x622f4c],
    ['', 'Mem', '32bit', 0x39d78, '=', 'Value', '', gearbox === 'manual' ? 0 : 1]
  )

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
   * @param {ConditionBuilder} params.protections
   */
  const beganLap = params => $(
    inGamePlayerCar.idIs(params.carId),

    // TODO: get rid of track condition, plutonium caused this
    params.trackId > 0 && trackIdIs(params.trackId),

    params.protections,
    inASpecMode,

    andNext(
      race.currentLapTimeMsec.withLast({ cmp: '>', rvalue: { value: 0 } }),
      race.lapBegan
    )
  )

  /**
   * @param {Object} params
   * @param {number} [params.target]
   * @param {number} params.trackId
   * @param {number} params.carId
   * @param {ConditionBuilder} params.protections
   */
  const passedTimeTrial = params => {
    const { target = 0 } = params

    return $(
      andNext(
        'once',
        beganLap(params)
      ),

      resetIf(
        playerWentOut.singleChainOfConditions,
        notInASpecMode,
        target > 0 && inGamePlayerCar.lapTimeIsGt(params.target)
      ),

      trigger(
        inGamePlayerCar.completedLap,
        target > 0 && inGamePlayerCar.lastLapTimeWasLte(params.target)
      )
    )
  }

  /**
    * @param {Object} params
    * @param {string} params.tires
    * @param {'' | 'manual'} params.gearbox
    * @param {'' | 'none'} params.aid
    * @param {number} params.topSpeedTune
    * @param {number} params.powerTune
  */
  const arcadeTimeTrialProtections = params => {
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
    lapCountIsGte: count => $(
      p.root,
      ['', 'Mem', '32bit', 0, '>=', 'Value', '', count]
    ),

    eventIdIs,
    trackIdIs,
    inGameGearboxIs,


    beganLap,
    inASpecMode,
    inBSpecMode,
    notInASpecMode,
    race,

    event,

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
        finished(expectedReward = 0) {
          return $(
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

    mission: (() => {
      return {
        finished: $(
          earnedASpecPoints,
          inASpecMode,
          race.finished,
          stat.gameFlagIs.mission
        )
      }
    })(),

    inGameRaceState,
    inGamePlayerCar,
    playerWentOut,

    passedTimeTrial,
    arcadeTimeTrialProtections,

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
            const GT4m = 0x6d345447

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
              ['', 'Mem', '32bit', 0x60, hudIsMini ? '=' : '!=', 'Value', '', GT4m],

              valueCheck
            )
          }
        }
      }
    })()
  }
})()

/**
 * @param {Object} params
 * @param {boolean} [params.nitrous]
 * @param {boolean} [params.dodgeRAM]
 * @param {boolean} [params.chapparal]
 * @param {number[]} [params.forbiddenCarIds]
 */
const generalProtections = (params = {}) => {
  const {
    nitrous = true,
    chapparal = true,
    dodgeRAM = true,
    forbiddenCarIds = []
  } = params
  return $(
    ...forbiddenCarIds.map(id => stat.gtModeCarIsNot(id)),
    dodgeRAM && stat.gtModeCarIsNot(0x3BB),
    chapparal && stat.gtModeCarIsNot(0x42D),
    nitrous && stat.noNitrousSlot0,
  )
}

const meta = await codegen()

/**
 * @template T
 * @typedef {T extends (Record <string, infer U>) ? U : never} ObjectValue
 * **/

/**
 * @template T
 * @typedef {T extends (infer U)[] ? U : never} ArrayValue
 * **/

/** @param {ObjectValue<typeof meta["events"]>} e */
function defineAchievementsForEvent(e) {
  const eventNameSuffix = e.eventNameSuffix ? ' ' + e.eventNameSuffix : ''
  const descriptionSuffix = e.descriptionSuffix ? ' ' + e.descriptionSuffix : ''
  const progressionTypeMaybe =
    (e.id.startsWith('am_') || e.id.startsWith('pr_')) ?
      'progression' : ''

  const nitrousSuffix = e.nitrousAllowed ? '' : ' Nitrous is not allowed.'

  if (e.id === 'ex_formula') {
    const allRaceIds = meta.events.ex_formula.raceIds
    const conditions = /** @type const */ ([
      [1, "1st to 5th", allRaceIds.slice(0, 5)],
      [2, "6th to 10th", allRaceIds.slice(5, 10)],
      [3, "11th to 15th", allRaceIds.slice(10, 15)]
    ])

    for (const [i, subTitle, raceIds] of conditions) {
      set.addAchievement({
        title: `${e.name} - Series #${i}`,
        description:
          `Win in one of ${e.name} ${subTitle} race events, in A-Spec mode ` +
          `while driving Formula Gran Turismo, which you can win from Nurburgring 24h Endurance ` +
          `(but you'd rather borrow a save file).`,
        points: e.points / conditions.length,
        type: progressionTypeMaybe,
        conditions: {
          core: $(
            main.event.wonAnyRace({
              aSpecPoints: e.aSpecAnyEvent,
              championshipPossible: e.isChampionship
            }),
            stat.gtModeCarIs(e.carIdAnyEvent[0])
          ),
          ...(raceIds.reduce((prev, id, idx) => {
            prev[`alt${idx + 1}`] = main.eventIdIs(id)
            return prev
          }, {}))
        }
      })
    }
  } else if (e.id === 'eur1000mile') {
    set.addAchievement({
      title: e.name,
      description: `Win any ${e.name} event in A-Spec mode and earn atleast ${e.aSpecAnyEvent} A-Spec points.` + nitrousSuffix,
      points: e.points,
      type: progressionTypeMaybe,
      conditions: $(
        main.event.wonAnyRace({
          raceIds: e.raceIds,
          aSpecPoints: e.aSpecAnyEvent,
          championshipPossible: e.isChampionship
        }),
        ...generalProtections({
          chapparal: e.noBrokenASpecCars,
          dodgeRAM: e.noBrokenASpecCars,
          nitrous: !e.nitrousAllowed
        }),
      )
    })
  } else if (e.inOneSitting) {
    if (e.isChampionship) {
      set.addAchievement({
        title: e.name,
        description: `Win ${e.name} in A-Spec championship mode in one sitting.` + descriptionSuffix,
        points: e.points,
        type: progressionTypeMaybe,
        conditions: $(
          andNext(
            'once',
            main.event.inFirstChampionshipRace(e.raceIds[0]),
            generalProtections({
              chapparal: e.noBrokenASpecCars,
              dodgeRAM: e.noBrokenASpecCars,
              nitrous: false,
              forbiddenCarIds: e.carIdsForbidden
            }),
            main.race.lapBegan
          ),

          resetIf(
            stat.abandonedChampionship,
            main.race.inBSpecMode
          ),

          main.event.earnedChampionshipMoney
        )
      })
    } else if (e.aSpecAllEvents) {
      let conditions = main.event.wonRacesInOneSession({
        raceIds: e.raceIds,
        aSpecPoints: e.aSpecAllEvents,
        protections: generalProtections({
          chapparal: e.noBrokenASpecCars,
          dodgeRAM: e.noBrokenASpecCars,
          nitrous: !e.nitrousAllowed,
          forbiddenCarIds: e.carIdsForbidden
        })
      })

      let description =
        `Win all ${e.name} events in one sitting in A-Spec mode, earning ` +
        `atleast ${e.aSpecAllEvents} A-Spec points in each.`

      if (e.races.length === 1) {
        description =
          `Win the ${e.name} event in A-Spec mode and earn ` +
          `atleast ${e.aSpecAllEvents} A-Spec points.`

        conditions = main.event.wonAnyRace({
          raceIds: e.raceIds,
          aSpecPoints: e.aSpecAllEvents,
          protections: generalProtections({
            chapparal: e.noBrokenASpecCars,
            dodgeRAM: e.noBrokenASpecCars,
            nitrous: !e.nitrousAllowed,
            forbiddenCarIds: e.carIdsForbidden
          })
        })
      }

      set.addAchievement({
        title: e.name,
        description: description + nitrousSuffix + descriptionSuffix,
        points: e.points,
        conditions
      })
    } else {
      set.addAchievement({
        title: e.name,
        description:
          e.races.length > 1 ?
            `Win all events of ${e.name}${eventNameSuffix} in A-Spec mode in one sitting.` :
            `Win the ${e.name} event in A-Spec mode.`,
        points: e.points,
        type: progressionTypeMaybe,
        conditions:
          e.races.length > 1 ?
            main.event.wonRacesInOneSession({ raceIds: e.raceIds }) :
            main.event.wonAnyRace({ raceIds: e.raceIds })
      })
    }
  } else if (!e.inOneSitting) {
    const aSpecSuffix = e.aSpecAllEvents ?
      ` and earn atleast ${e.aSpecAllEvents} A-Spec points.${nitrousSuffix}` : '.'

    e.races.forEach(({ raceId, trackId }, i) => {
      const trackName = meta.trackLookup[trackId]

      set.addAchievement({
        title: `${e.name} - Race #${i + 1}`,
        description:
          `Win race #${i + 1} of ${e.name} on ${trackName} in A-Spec mode${aSpecSuffix}`
          + descriptionSuffix,
        points: e.points / e.races.length,
        type: progressionTypeMaybe,

        // TODO: unnecessary protections when there's no A-Spec point requirement?
        conditions: $(
          main.event.wonAnyRace({
            raceIds: [raceId],
            aSpecPoints: e.aSpecAllEvents,
            championshipPossible: e.isChampionship
          }),
          ...generalProtections({
            chapparal: e.noBrokenASpecCars,
            dodgeRAM: e.noBrokenASpecCars,
            nitrous: e.aSpecAllEvents > 0 && !e.nitrousAllowed,
            forbiddenCarIds: e.carIdsForbidden
          })
        )
      })
    })
  }


  if (e.id !== 'ex_formula' && e.id !== 'de_mercedes_sl' && e.carIdAnyEvent.length > 0) {
    let [carId, challengeDescription] = e.carIdAnyEvent
    let nitrousProtection = false
    let name = e.name

    const stupidMercedes = e.id === 'de_mercedes_arrow'
    if (stupidMercedes) {
      challengeDescription = `Mercedes-Benz 300 SL Coupe '54, which you can win from SL Challenge.`
      name += ' or SL Challenge'
    }

    let description = `Win any ${name} event while driving ` + challengeDescription
    if (e.aSpecAnyEvent > 0) {
      description = `Win any ${name} event and earn atleast ${e.aSpecAnyEvent} A-Spec points ` +
        `while driving ${challengeDescription}` + descriptionSuffix

      nitrousProtection = !e.nitrousAllowed
    }

    const stupidMercedesAlts = stupidMercedes ? [
      ...meta.events.de_mercedes_arrow.raceIds,
      ...meta.events.de_mercedes_sl.raceIds
    ].reduce((prev, id, idx) => {
      prev[`alt${idx + 1}`] = main.eventIdIs(id)
      return prev
    }, {}) : {}

    set.addAchievement({
      title: e.name + (e.aSpecAnyEvent > 0 ? ' - A-Spec ' : ' - ') + 'Car Challenge',

      // TODO: Add Nitrous warning
      description,
      points: e.points,
      conditions: {
        core: $(
          main.event.wonAnyRace({
            raceIds: Object.values(stupidMercedesAlts).length ? [] : e.raceIds,
            aSpecPoints: e.aSpecAnyEvent,
            championshipPossible: e.isChampionship,
          }),
          stat.gtModeCarIs(carId),
          ...generalProtections({
            chapparal: e.noBrokenASpecCars,
            dodgeRAM: e.noBrokenASpecCars,
            nitrous: nitrousProtection
          })
        ),
        ...stupidMercedesAlts
      }
    })
  } else if (e.aSpecAnyEvent && e.id !== 'eur1000mile') {
    set.addAchievement({
      title: e.name + ` - A-Spec Challenge`,
      description:
        `Earn ${e.aSpecAnyEvent} A-Spec points or more in any of the ${e.name}${eventNameSuffix} events.`
        + nitrousSuffix,
      points: e.points,
      conditions: $(
        main.event.wonAnyRace({
          raceIds: e.raceIds,
          aSpecPoints: e.aSpecAnyEvent,
          championshipPossible: e.isChampionship
        }),
        ...generalProtections({
          chapparal: e.noBrokenASpecCars,
          dodgeRAM: e.noBrokenASpecCars,
          nitrous: !e.nitrousAllowed
        })
      )
    })
  }
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
  const gotGold = {
    core: main.license.finished(2),
    alt1: main.eventIdIs(l.eventId.pal),
    alt2: main.eventIdIs(l.eventId.ntsc),
  }

  const leaderboardConditions = {
    start: {
      core: $(
        main.license.finished(),
        main.license.timeSubmitted
      ),
      alt1: main.eventIdIs(l.eventId.pal),
      alt2: main.eventIdIs(l.eventId.ntsc),
    },
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
    conditions: gotGold
  }).addLeaderboard({
    title: l.isCoffee ?
      `Coffee Break ${l.license}: ${l.name}` :
      `License ${shortName}: ${l.name}`,
    description: `Fastest time to complete in msec`,
    type: 'VALUE',
    lowerIsBetter: true,
    conditions: leaderboardConditions
  })
}

/** @param {ArrayValue<typeof meta["carChallenges"]>} c */
function defineCarChallenge(c) {
  const carName = meta.carLookup[c.carIds[0]]

  if (c.type === 'aSpecHunt') {
    const carDescription = c.description || carName
    const description = `Earn ${c.target} A-Spec points or more in ${carDescription}.`
    const arcadeOnly = c.fullDescription.includes('Arcade')

    const raceIds = c.eventStringIds.flatMap(stringId => meta.events[stringId].raceIds)

    set.addAchievement({
      title: c.name,
      description: c.fullDescription || description,

      points: c.points,
      conditions: $(
        orNext(
          ...c.carIds.map(id => main.inGamePlayerCar.idIs(id))
        ),
        orNext(
          ...c.trackIds.map(id => main.trackIdIs(id))
        ),
        c.colorId !== -1 && main.inGamePlayerCar.colorIdIs(c.colorId),
        orNext(
          ...raceIds.map(id => main.eventIdIs(id))
        ),
        main.event.wonAnyRace({
          arcadeRacePossible: true,
          championshipPossible: true,
          arcadeOnly,
          aSpecPoints: c.target
        }),
        c.laps > 0 && main.lapCountIsGte(c.laps)
      )
    })
  }

  if (c.type === 'aSpecHuntPrius') {
    const carParts = /** @type const */ ([
      [3624, stat.gameFlagIs.eventRace],
      [3624, stat.gameFlagIs.eventChampionship],
      [3625, stat.gameFlagIs.eventRace],
      [3625, stat.gameFlagIs.eventChampionship],
    ])

    set.addAchievement({
      title: c.name,
      description: `Earn ${c.target} A-Spec points or more in ${c.description}.`,
      points: c.points,
      conditions: {
        core: $(
          orNext(
            ...c.carIds.map(id => main.inGamePlayerCar.idIs(id))
          ),

          // TODO: stupid flag hack get rid of it
          main.event.wonAnyRace({
            doFlagChecks: false,
            aSpecPoints: c.target
          }),
        ),
        alt1: stat.gameFlagIs.arcadeRace,

        ...carParts.reduce((prev, [gearboxId, flagCheck], idx) => {
          prev[`alt${idx + 2}`] = $(
            stat.gearboxIdIs(gearboxId),
            flagCheck
          )
          return prev
        }, {})
      }
    })
  }

  if (c.type === 'eventWin') {
    const event = meta.events[c.eventStringIds[0]]
    const { raceIds } = event
    set.addAchievement({
      title: c.name,
      description: c.fullDescription,
      points: c.points,
      conditions: $(
        orNext(...c.carIds.map(id => main.inGamePlayerCar.idIs(id))),
        c.raceIndex === -1 && orNext(...raceIds.map(id => main.eventIdIs(id))),
        main.event.wonAnyRace({
          raceIds: c.raceIndex >= 0 ? [raceIds[c.raceIndex]] : undefined,
          championshipPossible: event.isChampionship
        }),
        orNext(...c.carIds.map(id => stat.gtModeCarIs(id))),
      )
    })
  }

  if (c.type === 'arcadeTimeTrial') {
    // HACK TODO: original achievement didnt have check for some reason
    const trackId = c.name.includes('Plutonium') ? 0 : c.trackIds[0]

    const params = {
      carId: c.carIds[0],
      trackId,
      tires: c.tires,
      gearbox: c.gearbox,
      aid: c.aid,
      topSpeedTune: c.topSpeedTune,
      powerTune: c.powerTune,
    }

    set.addAchievement({
      title: c.name,
      description: c.fullDescription,
      points: c.points,
      conditions: main.passedTimeTrial({
        ...params,
        protections: main.arcadeTimeTrialProtections(params),
        target: c.target,
      })
    }).addLeaderboard({
      title: c.name,
      description: 'Fastest time in msec to complete this achievement',
      lowerIsBetter: true,
      type: 'VALUE',
      conditions: {
        // TODO: stupid map get rid of it
        start: main.beganLap({
          ...params,
          protections: main.arcadeTimeTrialProtections(params)
        }).map(x => x.flag === 'AndNext' ? x.with({ flag: '' }) : x),
        cancel: {
          core: '1=1',
          ...([
            ...main.playerWentOut.arrayOfAlts,

            // TODO: stupid slice hack that can be rewritten into OrNext
            [...main.notInASpecMode.conditions.slice(0, 4)],
            [...main.notInASpecMode.conditions.slice(4)],
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

  if (c.type === 'autoUnionTimeTrial') {
    set.addAchievement({
      title: c.name,
      description: c.fullDescription,
      points: c.points,
      conditions: main.passedTimeTrial({
        carId: c.carIds[0],
        trackId: c.trackIds[0],
        target: c.target,
        protections: $(
          stat.gameFlagIs.freeRun,
          stat.correctAutoUnionParts
        )
      })
    })
  }

  if (c.type === 'oneLap') {
    set.addAchievement({
      title: c.name,
      description: c.fullDescription,
      points: c.points,
      conditions: {
        core: $(
          orNext(...c.carIds.map(id => main.inGamePlayerCar.idIs(id))),
          main.inASpecMode,
          main.inGamePlayerCar.completedLap
        ),
        alt1: stat.gameFlagIs.arcadeTimeTrial,
        alt2: stat.gameFlagIs.freeRun,
        alt3: stat.gameFlagIs.photoDrive,
      }
    })
  }
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

export default async function () {
  for (const c of meta.carChallenges) {
    defineCarChallenge(c)
  }

  for (const e of Object.values(meta.events)) {
    defineAchievementsForEvent(e)
  }

  for (const m of Object.values(meta.missions)) {
    set.addAchievement({
      title: m.name,
      description: `Complete mission #${m.index} - ${m.nameFull}`,
      points: m.points,
      conditions: {
        core: main.mission.finished,
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
        alt1: $(
          addHits(
            ...tests
              .map(x =>
                andNext(
                  'once',
                  orNext(
                    main.eventIdIs(x.eventId.pal),
                    main.eventIdIs(x.eventId.ntsc),
                  ),
                  main.license.finished(4)
                )
              )
          ),
          `M:0=1.${tests.length}.'`
        ),
        alt2: $(
          stat.gameFlagIs.license,
          ['', 'Mem', '32bit', 0x621cb4, '!=', 'Value', '', 0],
          ['', 'Mem', '32bit', 0x68bb00, '=', 'Value', '', 0x53454353],
          ['', 'Mem', '32bit', 0x68bb04, '=', 'Value', '', 0x3731352d],
          ...tests.map((test, idx) => $(
            ['', 'Mem', 'Upper4', test.palFlagAddress, '<=', 'Value', '', 0xB],
            idx === tests.length - 1 && (
              ['', 'Delta', 'Upper4', test.palFlagAddress, '>', 'Value', '', 0xB]
            )
          ))
        ),
        alt3: $(
          stat.gameFlagIs.license,
          ['', 'Mem', '32bit', 0x621cb4, '!=', 'Value', '', 0],
          ['', 'Mem', '32bit', 0x68bb00, '=', 'Value', '', 0x53554353],
          ['', 'Mem', '32bit', 0x68bb04, '=', 'Value', '', 0x3337392d],
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
      main.inGameRaceState.car(1).idIs(0x1ED)
    )
  })

  set.addAchievement({
    title: 'Adverse Camber Reigns',
    description: 'Win any Tuning Car Grand Prix event with all of your wheels camber tuned to 10 deg or more.',
    points: 5,
    conditions: $(
      main.event.wonAnyRace({
        applyTrigger: true,
        raceIds: meta.events.pr_tuning.raceIds,
        championshipPossible: true
      }),
      stat.adverseCamberReigns
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
        main.race.finished.withLast({
          // TODO: remove size property - you get very confusing error message
          cmp: '>', rvalue: { type: 'Delta', size: '32bit', value: 0 }
        }),

        // TODO: move out in it's own function, this
        // gets you remaining laps for car to complete
        ...Array.from({ length: 6 }, (_, i) => $(
          main.inGameRaceState.car(i).completedLap.withLast({
            flag: 'SubSource', cmp: '', rvalue: { type: '', size: '', value: 0 }
          }),
          main.lapCountIsGte(0).withLast({
            cmp: i === 0 ? '=' : '>'
          })
        ))
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
      main.inGameRaceState.car(0).lastLapTimeWasLt(8000),
      main.inGameGearboxIs('manual'),
      main.inASpecMode,
      main.race.finished
    )
  })

  set.addAchievement({
    title: 'Underdog Racing',
    description: 'Earn 200 A-Spec points in any race except for Speedster Trophy and 206 Cup. Family Cup and Arcade mode are allowed. Driving Dodge RAM, Chaparal 2J, or having nitrous is not allowed.',
    points: 25,
    conditions: {
      core: $(
        main.event.wonAnyRace({
          doFlagChecks: false,
          aSpecPoints: 200,
          protections: $(
            main.inGamePlayerCar.idIs(0x3BB).withLast({ cmp: '!=' }), // RAM
            main.inGamePlayerCar.idIs(0x42D).withLast({ cmp: '!=' }), // Chapparal
          )
        })
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
        stat.noNitrous
      )
    }
  })

  set.addAchievement({
    title: 'Bully',
    description: 'Lap all of your opponents on any Sunday Cup event and finish first.',
    points: 5,
    conditions: $(
      main.event.wonAnyRace({
        raceIds: meta.events.am_sunday.raceIds
      }),

      // TODO: just wtf did RATools generate previously?
      ...Array.from({ length: 5 }, (_, i) => $(
        ['AddSource', 'Value', '', 0xFFFFFF],
        main.inGameRaceState.car(i + 1).completedLap.withLast({
          flag: 'SubSource', cmp: '',
          lvalue: { size: '24bit' }, rvalue: { type: '', size: '', value: 0 }
        }),
        main.inGamePlayerCar.completedLap.withLast({
          flag: '', cmp: '>=',
          lvalue: { size: '24bit' },
          rvalue: { type: 'Value', size: '', value: 0x1000001 }
        }),
      ))
    )
  })

  // for (const l of set.leaderboards) {
  //   console.log(l.title)
  // }
  // [...set.leaderboards]
  //   .filter(c => !c.title.includes('License'))
  //   .map(c => c.title)
  //   .forEach(c => console.log(c))

  // console.log([...set.achievements].map(c => c.title).sort().join('\n'))
  console.log('Achievement Count: ', [...set.achievements].length)
  return set
}
