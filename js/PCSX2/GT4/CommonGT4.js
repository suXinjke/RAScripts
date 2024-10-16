// @ts-check

import '../../common.js'
import {
  AchievementSet, Condition, ConditionBuilder, define as $,
  andNext, orNext, resetIf, trigger, pauseIf, addHits,
  RichPresence, stringToNumberLE
} from '@cruncheevos/core'
import codegen from './codegen.js'

/**
 * @template T
 * @typedef {T extends (Record <string, infer U>) ? U : never} ObjectValue
 * **/

/**
 * @template T
 * @typedef {T extends (infer U)[] ? U : never} ArrayValue
 * **/

/** @param {ConditionBuilder | Condition} c */
export function pointerNullCheck(c) {
  return $(c).withLast({ flag: '', cmp: '!=', rvalue: { type: 'Value', value: 0 } })
}

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

export async function code(r = 'retail') {
  const meta = await codegen(r)
  const o = r === 'online'

  const stat = (() => {
    const root = $.one(['AddAddress', 'Mem', '32bit', o ? 0x664edc : 0x622f4c])

    const gameFlagIs = (() => {
      const gameFlagIs = (flag) => $(
        root,
        ['', 'Mem', '32bit', o ? 0x1DA8 : 0x3a370, '=', 'Value', '', flag]
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
        arcadeRace: gameFlagIs(o ? 0xB : 0xA),
        arcadeTimeTrial: gameFlagIs(o ? 0xC : 0xB),
        photoScene: gameFlagIs(o ? 0x18 : 0x15),
      }
    })()

    const gtModeCarValue = $(
      root,
      ['Measured', 'Mem', '32bit', o ? 0xAAF8 : 0x13940]
    )

    const gtModeCarIsNot = id => gtModeCarValue.withLast({
      flag: '', cmp: '!=', rvalue: { type: 'Value', value: id }
    })

    const selectedSetupSlotIs = slot => $(
      root,
      ['', 'Mem', '8bit', o ? 0xAFC8 : 0x13dc8, '=', 'Value', '', slot]
    )

    const forSetupSlot = slot => {
      const base = selectedSetupSlotIs(slot)

      const partOffset = slot * (o ? 0x190 : 0x178)

      return {
        /** @param {number[]} ids */
        gearboxIdIsNotOneOf: ids => andNext(
          base,
          andNext(
            ...ids.map(id => $(
              root,
              ['', 'Mem', '32bit', (o ? 0xAB40 : 0x13988) + partOffset, '!=', 'Value', '', id]
            ))
          )
        ),
        wrongAdverseCamberReigns: orNext(
          root,
          ['', 'Mem', '8bit', (o ? 0xAC31 : 0x13a79) + partOffset, '<', 'Value', '', 100],
        ).andNext(
          root,
          ['', 'Mem', '8bit', (o ? 0xAC32 : 0x13a7a) + partOffset, '<', 'Value', '', 100],
          base
        ),
        wrongAutoUnionParts: orNext(
          root,
          ['', 'Mem', '32bit', (o ? 0xABA8 : 0x139f0) + partOffset, '!=', 'Value', '', 0x91d],
          root,
          ['', 'Mem', '32bit', (o ? 0xAB58 : 0x139a0) + partOffset, '!=', 'Value', '', 0xde1b],
          root,
          ['', 'Mem', '32bit', (o ? 0xAB60 : 0x139a8) + partOffset, '!=', 'Value', '', 0xde15],
        ).andNext(
          root,
          ['', 'Mem', '8bit', (o ? 0xAC53 : 0x13a9b) + partOffset, '!=', 'Value', '', 0],
          base
        ),

        hasNitrous: andNext(
          base,
          root,
          ['', 'Mem', '32bit', (o ? 0xABF0 : 0x13a38) + partOffset, '!=', 'Value', '', -1]
        )
      }
    }

    return {
      root,

      inGTModeProject: $.str('gtmo', (s, v) => $(
        root,
        ['', 'Mem', s, o ? 0x1E1C : 0x3A3BC, '=', ...v]
      )),

      gameFlagIs,
      abandonedChampionship: andNext(
        gameFlagIs.inGameMenus,

        root,
        ['', 'Mem', '8bit', o ? 0x20800 : 0x38c20, '=', 'Value', '', 0]
      ),

      gtModeCarValue,
      gtModeCarIsNot,

      /** @param {number[]} ids */
      gtModeCarIs: (...ids) => orNext(
        ...ids.map(id => gtModeCarIsNot(id).withLast({ cmp: '=' }))
      ),

      gearboxSettingIs: gearbox => $(
        root,
        ['', 'Mem', '32bit', o ? 0x1748 : 0x39d78, '=', 'Value', '', gearbox === 'manual' ? 0 : 1]
      ),

      spec2RandomCars: $.str('r=1;', (s, v) => $(
        root,
        ['', 'Mem', s, 0x182C, '=', ...v]
      )),

      prizeCarCountIncreased: $(
        root,
        ['', 'Mem', '32bit', o ? 0x2BD8 : 0x398, '>', 'Delta', '32bit', o ? 0x2BD8 : 0x398]
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
      const root = $.one(['AddAddress', 'Mem', '32bit', o ? 0x66335c : 0x621cb4])
      const root60 = $(
        root,
        ['AddAddress', 'Mem', '32bit', 0x60]
      )
      const root84 = $(
        root,
        ['AddAddress', 'Mem', '32bit', 0x84]
      )

      const rootAux = $.one(['AddAddress', 'Mem', '32bit', o ? 0x660624 : 0x6187a8])

      return {
        root,
        root60,
        root84,
        rootAux,
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
      ['', 'Mem', '32bit', o ? 0xD90 : 0xCCC, '=', 'Value', '', 1]
    )

    const notInASpecMode = $(
      pointerNullCheck(p.aSpecMode).withLast({ cmp: '=' }),

      p.aSpecMode,
      ['', 'Mem', '32bit', 0x1bc, '!=', 'Value', '', 0]
    )

    const lapCountMeasured = $(
      p.root,
      ['Measured', 'Mem', '32bit', 0]
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

      const carBase18 = $(
        base,
        ['AddAddress', 'Mem', '32bit', index * 4],
        ['AddAddress', 'Mem', '32bit', 0x18],
      )

      const idValue = $(
        carBase,
        ['Measured', 'Mem', '32bit', o ? 0xFD8 : 0x20]
      )

      const completedLap = $(
        carBase,
        ['', 'Mem', '32bit', o ? 0x2C : 0x1AC, '>', 'Delta', '32bit', o ? 0x2C : 0x1AC]
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
          ['', 'Mem', '8bit', o ? 0xFF0 : 0x38, '=', 'Value', '', id]
        ),
        tiresAre: (tires) => andNext(
          carBase,
          ['', 'Mem', '8bit', o ? 0x1138 : 0x180, '=', 'Value', '', tireTypes[tires]],
          carBase,
          ['', 'Mem', '8bit', o ? 0x1139 : 0x181, '=', 'Value', '', tireTypes[tires]]
        ),

        completedLap,
        lapsCompletedMeasured: completedLap.withLast({
          flag: 'Measured',
          cmp: '',
          rvalue: { size: '', type: '', value: 0 }
        }),

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
          ['Measured', 'Mem', '32bit', o ? 0x12A4 : 0x11dc]
        ),

        lastLapTimeWasLte: target => $(
          carBase,
          ['', 'Mem', '32bit', o ? 0x12A4 : 0x11dc, '<=', 'Value', '', target]
        ),

        lastLapTimeWasLt: target => $(
          carBase,
          ['', 'Mem', '32bit', o ? 0x12A4 : 0x11dc, '<', 'Value', '', target]
        ),

        isNotControlledByAI: $(
          carBase18,
          ['', 'Mem', '8bit', o ? 0x58A : 0x56A, '=', 'Value', '', 0]
        ),
        isNotControlledByAIRollingStart: $(
          carBase18,
          ['', 'Mem', '8bit', o ? 0x58B : 0x56B, '=', 'Value', '', 0]
        ),

        isWithinCoordinates: (x1, y1, x2, y2) => andNext(
          carBase18,
          ['', 'Mem', 'Float', 0x104, '>=', 'Float', '', x1],
          carBase18,
          ['', 'Mem', 'Float', 0x104, '<=', 'Float', '', x2],
          carBase18,
          ['', 'Mem', 'Float', 0x108, '>=', 'Float', '', y1],
          carBase18,
          ['', 'Mem', 'Float', 0x108, '<=', 'Float', '', y2],
        )
      }
    }

    const inGamePlayerCar = inGameCar(0)

    const playerWentOut = (crashSensitivity = 0.05) => {
      const tireCombos = o ?
        [
          [0x6B0D, 0x6C01, 0x6CF5],
          [0x6B0D, 0x6C01, 0x6DE9],
          [0x6B0D, 0x6CF5, 0x6DE9],
          [0x6C01, 0x6CF5, 0x6DE9],
        ] :
        [
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
        ['', 'Mem', 'Float', o ? 0x7050 : 0x6dac, '>', 'Float', '', crashSensitivity],
      )
      const bumped = bigBump.withLast({
        rvalue: { type: 'Delta', size: 'Float', value: o ? 0x7050 : 0x6dac }
      })

      return {
        singleChainOfConditions: $(
          ...offTrackLimits.map(c => andNext(c)),
          crashSensitivity > 0 && andNext(
            bigBump,
            bumped
          )
        ),

        arrayOfAlts: [
          ...offTrackLimits,
          crashSensitivity > 0 && $(
            bigBump,
            bumped
          )
        ]
      }
    }

    const hud = (() => {
      const base = $(
        p.root84,
        ['AddAddress', 'Mem', '32bit', o ? 0xE4E0 : 0xE420],
      )
      const speedBase = $(
        base,
        ['AddAddress', 'Mem', '32bit', 0x14],
      )

      const lapTimeCurrent = $(
        base,
        ['', 'Delta', '32bit', o ? 0x1624 : 0x1664, '<=', 'Value', '', 0x3F]
      )
      const lapTimeNewLap = andNext(
        lapTimeCurrent.withLast({
          lvalue: { type: 'Mem' }, cmp: '!=',
          rvalue: { value: -1 }
        }),
        lapTimeCurrent,
        lapTimeCurrent.withLast({ lvalue: { type: 'Mem' }, cmp: '>' })
      )

      return {
        positionIs: position => $(
          base,
          ['', 'Mem', '32bit', o ? 0x1370 : 0x13b0, '=', 'Value', '', position]
        ),
        lapTime: {
          current: lapTimeCurrent,
          newLap: lapTimeNewLap,
          beganFirstLap: andNext(
            lapTimeNewLap,
            inGamePlayerCar.lapsCompletedAre(0)
          )
        },
        inBSpecMode,
        showingRaceResults: $(
          p.root84,
          ['AddAddress', 'Mem', '32bit', o ? 0xE4DC : 0xE41C],
          ['', 'Mem', '32bit', 0x0, '=', 'Value', '', 1]
        ),
        speed: {
          isRendered: $(
            speedBase,
            ['', 'Mem', '8bit', 0, '=', 'Value', '', 1],
          ),
          wentPastSpeed: (units, hudIsMini, speed) => {
            if (o) {
              throw new Error('wentPastSpeed not implemented for online')
            }

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

              $.str('GT4m', (s, v) => $(
                speedBase,
                ['', 'Mem', s, 0x60, hudIsMini ? '=' : '!=', ...v]
              )),

              valueCheck
            )
          }
        }
      }
    })()



    const arcade = (() => {
      return {
        tiresAre: tires => $(
          p.rootAux,
          ['', 'Mem', '32bit', 0x3b8, '=', 'Value', '', tireTypes[tires]],
          p.rootAux,
          ['', 'Mem', '32bit', 0x3bc, '=', 'Value', '', tireTypes[tires]]
        ),

        powerTuneIs: tune => $(
          p.rootAux,
          ['', 'Mem', '32bit', 0x3b0, '=', 'Value', '', tune]
        ),
        weightAdjustIs: adjust => $(
          p.rootAux,
          ['', 'Mem', '32bit', 0x3ac, '=', 'Value', '', adjust]
        ),
        topSpeedAdjustIs: adjust => $(
          p.rootAux,
          ['', 'Mem', '8bit', 0x3b4, '=', 'Value', '', adjust]
        )

      }
    })()

    const totalTimeInMsec = (() => {
      const isGteThanZero = $(
        p.root84,
        ['AddAddress', 'Mem', '32bit', 0x70],
        ['', 'Mem', '32bit', o ? 0x23960 : 0xF898, '>=', 'Value', '', 0],
      )

      return {
        isGteThanZero,
        isGteThan: time => isGteThanZero.withLast({
          rvalue: { value: time }
        }),
        measured: isGteThanZero.withLast({
          flag: 'Measured', cmp: '',
          rvalue: { type: '', size: '', value: 0 }
        })
      }
    })()

    return {
      p,

      lapCountMeasured,
      lapCountIsGte,
      lapCountIs: count => lapCountIsGte(count).withLast({ cmp: '=' }),
      totalTimeInMsec,

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

      inASpecMode,
      inBSpecMode,
      notInASpecMode,

      gotPenalty: $(
        p.root84,
        ['AddAddress', 'Mem', '32bit', 0x70],
        ['', 'Mem', '16bit', o ? 0x704E : 0x6DAA, '>', 'Delta', '16bit', o ? 0x704E : 0x6DAA],
      ),

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
        p.rootAux,
        ['', 'Mem', '32bit', o ? 0x4AC : 0x4a8, '>', 'Delta', '32bit', o ? 0x4AC : 0x4a8]
      ),

      hud,
      arcade,

      cuttingOnTrack: {
        // laguna_seca
        22: inGamePlayerCar.isWithinCoordinates(
          -71, -414,
          -43, -410
        )
      }
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
   * @param {string} [params.badge]
   * @param {number[]} [params.raceIds]
   * @param {number} [params.points]
   * @param {boolean} [params.triggerIcon]
   * */
  function defineIndividualRace(set, e, params = {}) {
    let {
      title = e.name,
      description = `Win the ${e.name} event in A-Spec mode`,
      raceIds = e.raceIds,
      points = e.points,
      triggerIcon = false,
      badge = undefined
    } = params

    const nitrousSuffix = !e.aSpecPoints || e.nitrousAllowed ? '' : ' Nitrous is not allowed.'
    const aSpecSuffix = e.aSpecPoints ?
      ` and earn atleast ${e.aSpecPoints} A-Spec points.` : '.'

    description += aSpecSuffix

    const [carIdRequired, carRequirementSuffix] = e.carIdAnyEvent
    if (carIdRequired) {
      description += ' ' + carRequirementSuffix
    }

    let triggerConditions = main.wonRace({ aSpecPoints: e.aSpecPoints })
    if (triggerIcon) {
      triggerConditions = trigger(triggerConditions)
    }

    set.addAchievement({
      title,
      description: description + nitrousSuffix + e.descriptionSuffix,
      points,
      type: e.achType,
      badge,
      conditions: $(
        triggerConditions,
        main.eventIdIs(...raceIds),
        orNext(
          stat.gameFlagIs.eventRace,
          e.isChampionship && stat.gameFlagIs.eventChampionship,
        ),

        generalProtections.forbiddenCarIds(...e.carIdsForbidden),
        carIdRequired > 0 && stat.gtModeCarIs(carIdRequired),
        e.aSpecPoints > 0 && e.noCheese && generalProtections.noCheese,
        e.aSpecPoints > 0 && !e.nitrousAllowed && generalProtections.pauseIfHasNitrous,

        triggerIcon && $(
          andNext(
            'once',
            main.hud.lapTime.newLap,
            main.inGamePlayerCar.lapsCompletedAre(0)
          ),
          resetIf(
            main.hud.inBSpecMode,
            stat.gameFlagIs.inGameMenus
          )
        )
      )
    })
  }

  /**
   * @param {AchievementSet} set
   * @param {ObjectValue<typeof meta["events"]>} e
   */
  function defineChampionship(set, e) {
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
          main.hud.lapTime.newLap,
          main.inGamePlayerCar.lapsCompletedAre(0)
        ),

        resetIf(
          stat.abandonedChampionship,
          main.hud.inBSpecMode
        ),

        trigger(main.earnedChampionshipMoney)
      )
    })
  }

  /**
   * @param {AchievementSet} set
   * @param {ObjectValue<typeof meta["events"]>} e
   */
  function defineAllRacesInOneSitting(set, e) {
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
   * @param {AchievementSet} set
   * @param {ArrayValue<typeof meta["anySubEvent"]>} c
   */
  function defineAnySubEventWin(set, c) {
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

  /**
   * @param {AchievementSet} set
   * @param {ArrayValue<typeof meta["carEventWin"]>} c
   */
  function defineCarEventWin(set, c) {
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

  /**
   * @param {AchievementSet} set
   * @param {ArrayValue<typeof meta["arcadeTimeTrial"]>} c
   */
  function defineArcadeTimeTrial(set, c) {
    const arcadeRoot = $(
      ['AddAddress', 'Mem', '32bit', 0x6187a8]
    )

    const arcadeTimeTrialConditions = $(
      c.gearbox === 'manual' && $(
        arcadeRoot,
        ['', 'Mem', '32bit', 0x3c0, '=', 'Value', '', 1]
      ),
      c.aid === 'none' && $(
        arcadeRoot,
        ['', 'Mem', '32bit', 0x3c4, '=', 'Value', '', 0]
      ),
      stat.gameFlagIs.arcadeTimeTrial,
      main.arcade.tiresAre(c.tires),
      main.arcade.powerTuneIs(c.powerTune),
      main.arcade.weightAdjustIs(0),
      main.arcade.topSpeedAdjustIs(c.topSpeedTune)
    )

    const startConditions = $(
      main.inGamePlayerCar.idIs(c.carId),
      main.trackIdIs(c.trackId),

      arcadeTimeTrialConditions,
      main.inASpecMode,

      main.hud.lapTime.newLap
    )

    const conditions = $(
      andNext(
        'once',
        startConditions
      ),

      resetIf(
        main.playerWentOut().singleChainOfConditions,
        main.notInASpecMode
      ),

      trigger(
        main.inGamePlayerCar.completedLap,
        main.inGamePlayerCar.lastLapTimeWasLte(c.lapTimeTargetMsec)
      )
    )

    set.addAchievement({
      title: c.achName,
      description: c.description,
      points: c.points,
      conditions
    }).addLeaderboard({
      title: c.achName,
      description: 'Fastest time in msec to complete this achievement',
      lowerIsBetter: true,
      type: 'FIXED3',
      conditions: {
        start: startConditions,
        cancel: {
          core: '1=1',
          ...([
            ...main.playerWentOut().arrayOfAlts,
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
  /**
   * @param {AchievementSet} set
   * @param {ObjectValue<typeof meta["licenses"]>} l
   */
  function defineLicenseAchievements(set, l) {
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

  /**
   * @param {AchievementSet} set
   * @param {ArrayValue<typeof meta["carChallenges"]>} c
   */
  function defineCarChallenge(set, c) {
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

  function rich() {
    const substringEventString = $(
      main.p.rootAux,
      ['Measured', 'Mem', '8bit', o ? 0x3CC : 0x3c8]
    )

    const licenses = {
      B: { emoji: '🟩', idKey: stringToNumberLE('l0b0')[0], },
      A: { emoji: '🟨', idKey: stringToNumberLE('l0a0')[0], },
      IB: { emoji: '🟦', idKey: stringToNumberLE('lib0')[0], },
      IA: { emoji: '🟥', idKey: stringToNumberLE('lia0')[0], },
      S: { emoji: '🟪', idKey: stringToNumberLE('l0s0')[0], },
    }

    const lapTracker = $(
      ['AddSource', 'Value', '', 1],
      main.inGamePlayerCar.lapsCompletedMeasured
    )

    const totalTimeTracker = main.totalTimeInMsec.measured.withLast({
      cmp: '/',
      rvalue: { type: 'Value', value: 3000 }
    })

    return RichPresence({
      lookupDefaultParameters: { keyFormat: 'hex' },
      lookup: {
        Car: {
          defaultAt: stat.gtModeCarValue,
          values: {
            ...meta.carLookup,
            '*': '- -'
          }
        },
        Event: {
          defaultAt: main.eventIdValue,
          values: meta.eventLookup
        },
        License_B: { values: { 16: ' ' + licenses.B.emoji } },
        License_A: { values: { 16: licenses.A.emoji } },
        License_IB: { values: { 16: licenses.IB.emoji } },
        License_IA: { values: { 16: licenses.IA.emoji } },
        License_S: { values: { 16: licenses.S.emoji } },

        LicenseColor: {
          defaultAt: substringEventString.withLast({ lvalue: { size: '32bit' } }),
          values: Object.values(licenses).reduce((prev, cur) => {
            prev[cur.idKey] = cur.emoji
            return prev
          }, {})
        },
        LicenseLetter: {
          defaultAt: substringEventString.withLast({ lvalue: { size: '32bit' } }),
          values: Object.entries(licenses).reduce((prev, [letter, cur]) => {
            prev[cur.idKey] = letter
            return prev
          }, {})
        },

        Track: {
          defaultAt: main.trackIdValue,
          values: {
            ...meta.trackLookup,
            174: 'Gymkhana Course'
          }
        },
      },

      displays: ({ lookup, macro, tag }) => {
        const carLookupInGame = lookup.Car.at(main.inGamePlayerCar.idValue)
        const licenseLetters = [
          substringEventString.withLast({ lvalue: { value: o ? 0x3D1 : 0x3CD } }),
          substringEventString.withLast({ lvalue: { value: o ? 0x3D2 : 0x3CE } }),
        ].map(x => macro.ASCIIChar.at(x)).join('')

        return [
          [
            andNext(
              stat.gameFlagIs.arcadeRace,
              main.totalTimeInMsec.isGtThanZero,
              main.hud.showingRaceResults.withLast({ rvalue: { value: 0 } })
            ),
            tag`[🏁 Arcade Race] 📍 ${lookup.Track} 🚗 ${carLookupInGame} | Lap ${macro.Number.at(lapTracker)}/${macro.Number.at(main.lapCountMeasured)}`
          ],
          [
            stat.gameFlagIs.arcadeRace,
            tag`[🏁 Arcade Race] 📍 ${lookup.Track} 🚗 ${carLookupInGame}`
          ],
          [
            stat.gameFlagIs.raceMeeting,
            tag`[🏁 ${o ? 'Track Meet' : 'Race Meeting'}] 📍 ${lookup.Track} 🚗 ${lookup.Car}`
          ],
          [
            stat.gameFlagIs.arcadeTimeTrial,
            tag`[🏁 Arcade Time Trial] 📍 ${lookup.Track} 🚗 ${carLookupInGame}`
          ],
          [
            $(
              stat.gameFlagIs.license,
              substringEventString.withLast({ flag: '', lvalue: { size: '32bit' }, cmp: '=', rvalue: { type: 'Value', value: stringToNumberLE('l0c0')[0] } }),
            ),
            tag`[☕ Coffee Break] ${licenseLetters} ${lookup.Event} 🚗 ${carLookupInGame}`
          ],
          [
            stat.gameFlagIs.license,
            tag`[🔰 License Center] ${lookup.LicenseColor} ${lookup.LicenseLetter}-${licenseLetters} ${lookup.Event} 🚗 ${carLookupInGame}`
          ],
          [
            stat.gameFlagIs.mission,
            tag`[🎯 ${lookup.Event}] 🚗 ${carLookupInGame}`
          ],
          [
            stat.gameFlagIs.freeRun,
            tag`[⏱ ${o ? 'Practice' : 'Free Run'}] 📍 ${lookup.Track} 🚗 ${lookup.Car}`
          ],
          [
            stat.gameFlagIs.powerAndSpeed,
            tag`[⏱ ${lookup.Event}] 🚗 ${lookup.Car}`
          ],
          [
            stat.gameFlagIs.photoDrive,
            tag`[📸 ${lookup.Track}] 🚗 ${lookup.Car}`
          ],
          [
            stat.gameFlagIs.photoScene,
            tag`[📸 Photo Travel] 🚗 ${lookup.Car}`
          ],

          [
            orNext(
              stat.gameFlagIs.eventRace,
            ).andNext(
              stat.gameFlagIs.eventChampionship,
              main.totalTimeInMsec.isGtThanZero,
              main.lapCountIsGte(0).withLast({ cmp: '=' }),
              main.hud.showingRaceResults.withLast({ rvalue: { value: 0 } })
            ),
            tag`[🏁 ${lookup.Event}] 📍 ${lookup.Track} 🚗 ${lookup.Car} ⏱ ${macro.Seconds.at(totalTimeTracker)}`
          ],
          [
            orNext(
              stat.gameFlagIs.eventRace,
            ).andNext(
              stat.gameFlagIs.eventChampionship,
              main.totalTimeInMsec.isGtThanZero,
              main.lapCountIsGte(0),
              main.hud.showingRaceResults.withLast({ rvalue: { value: 0 } })
            ),
            tag`[🏁 ${lookup.Event}] 📍 ${lookup.Track} 🚗 ${lookup.Car} | Lap ${macro.Number.at(lapTracker)}/${macro.Number.at(main.lapCountMeasured)}`
          ],
          [
            orNext(stat.gameFlagIs.eventRace, stat.gameFlagIs.eventChampionship),
            tag`[🏁 ${lookup.Event}] 📍 ${lookup.Track} 🚗 ${lookup.Car}`
          ],

          ...(
            o ? ['ntsc'] : ['pal', 'ntsc']
          ).map(region => {
            const licenseBadges = Object.entries(licenses).map(([key, l]) => {
              const tests = Object.values(meta.licenses)
                .filter(license => license.license === key && license.isCoffee === false)

              const amountOfTestsPassed = $(...tests.map(test => region === 'pal' ?
                $(['AddSource', 'Mem', 'Bit0', test.palFlagAddress]) :
                $(
                  stat.root,
                  ['AddSource', 'Mem', 'Bit0', test.ntscFlagOffset]
                )
              ))

              return lookup['License_' + key].at($(amountOfTestsPassed, ['Measured', 'Value', '', 0]))
            }).join('')

            const date = $(
              ['SubSource', 'Value', '', 2453461],
              stat.root,
              ['Measured', 'Mem', '32bit', o ? 0x20894 : 0xBC28]
            )

            const mileage = $(
              stat.root,
              ['Measured', 'Mem', '32bit', o ? 0x2BF8 : 0x3b8, '*', 'Float', '', 0.001]
            )


            return /** @type [ConditionBuilder, string] */ ([
              $(
                !o && main.regionIs[region],
                stat.gameFlagIs.inGameMenus,
                stat.inGTModeProject
              ),
              tag`[🏠 Home${licenseBadges}] 🚗 ${lookup.Car.at(stat.gtModeCarValue)} 📅 Day ${macro.Number.at(date)} | ${macro.Number.at(mileage)} km`
            ])
          }),
          'Playing Gran Turismo 4' + (o ? ': Spec II' : '')
        ]
      }
    })
  }

  return {
    meta,
    stat,
    main,
    generalProtections,
    rich,

    defineIndividualRace,
    defineChampionship,
    defineAllRacesInOneSitting,
    defineAnySubEventWin,
    defineCarEventWin,
    defineArcadeTimeTrial,
    defineLicenseAchievements,
    defineCarChallenge
  }

}