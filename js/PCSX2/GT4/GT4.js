// @ts-check
import '../../common.js'
import {
  AchievementSet, define as $, ConditionBuilder,
  addHits, andNext, orNext, resetIf, trigger, pauseIf,
  RichPresence, stringToNumberLE
} from '@cruncheevos/core'
import { stat, main, generalProtections, pointerNullCheck, meta, defineIndividualRace } from './CommonGT4.js'
import { dumpAll } from './icongen.js'

/**
 * @template T
 * @typedef {T extends (Record <string, infer U>) ? U : never} ObjectValue
 * **/

/**
 * @template T
 * @typedef {T extends (infer U)[] ? U : never} ArrayValue
 * **/

const set = new AchievementSet({ gameId: 20580, title: 'Gran Turismo 4' })

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

        defineIndividualRace(set, e, {
          title: `${e.name} - Race #${i + 1}`,
          description: `Win race #${i + 1} of ${e.name} on ${trackName} in A-Spec mode`,
          raceIds: [raceId],
          points: e.points / e.races.length
        })
      })
    } else {
      defineIndividualRace(set, e)
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
          main.hud.showingRaceResults,
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
        main.hud.showingRaceResults.withLast({
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
      main.hud.showingRaceResults
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
    const startConditions = $(
      main.inGamePlayerCar.idIs(0x431),
      main.trackIdIs(0x41),

      stat.gameFlagIs.freeRun,
      main.inASpecMode,

      main.hud.lapTime.newLap
    )
    set.addAchievement({
      title: 'Have You Heard Of: Type C Streamline?',
      description: `Gran Turismo mode, Free Run, Auto Union V16 Type C Streamline \`37, Racing Soft tires, no turbo kit and weight ballast, body rigidity upgrade optional. Do a clean lap on Nurburgring Nordschleife and beat the time of 6:40'000.`,
      points: 25,
      conditions: $(
        andNext(
          'once',
          startConditions
        ),

        pauseIf(stat.forEachSetupSlot(s => s.wrongAutoUnionParts)),

        resetIf(
          main.playerWentOut().singleChainOfConditions,
          main.notInASpecMode
        ),

        trigger(
          main.inGamePlayerCar.completedLap,
          main.inGamePlayerCar.lastLapTimeWasLte(400000)
        )
      )
    }).addLeaderboard({
      title: 'Have You Heard Of: Type C Streamline?',
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

export const rich = (() => {
  const substringEventString = $(
    ['AddAddress', 'Mem', '32bit', 0x6187a8],
    ['Measured', 'Mem', '8bit', 0x3c8]
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
    lookupDefaultParameters: { compressRanges: false },
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
        substringEventString.withLast({ lvalue: { value: 0x3cd } }),
        substringEventString.withLast({ lvalue: { value: 0x3ce } }),
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
          tag`[🏁 Race Meeting] 📍 ${lookup.Track} 🚗 ${lookup.Car}`
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
          tag`[⏱ Free Run] 📍 ${lookup.Track} 🚗 ${lookup.Car}`
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

        ...['pal', 'ntsc'].map(region => {
          const licenseBadges = Object.entries(licenses).map(([key, l]) => {
            const tests = Object.values(meta.licenses)
              .filter(license => license.license === key && license.isCoffee === false)

            const amountOfTestsPassed = $(...tests.map(test => region === 'pal' ?
              $(['AddSource', 'Mem', 'Bit0', test.palFlagAddress]) :
              $(
                ['AddAddress', 'Mem', '32bit', 0x622f4c],
                ['AddSource', 'Mem', 'Bit0', test.ntscFlagOffset]
              )
            ))

            return lookup['License_' + key].at($(amountOfTestsPassed, ['Measured', 'Value', '', 0]))
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


          return /** @type [ConditionBuilder, string] */ ([
            $(
              main.regionIs[region],
              stat.gameFlagIs.inGameMenus,
              stat.inGTModeProject
            ),
            tag`[🏠 Home${licenseBadges}] 🚗 ${lookup.Car.at(stat.gtModeCarValue)} 📅 Day ${macro.Number.at(date)} | ${macro.Number.at(mileage)} km`
          ])
        }),
        'Playing Gran Turismo 4'
      ]
    }
  })
})()

if (process.argv.includes('icons')) {
  dumpAll()
}