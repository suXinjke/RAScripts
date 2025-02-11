// @ts-check
import '../../common.js'
import {
  AchievementSet, define as $,
  addHits, andNext, orNext, resetIf, trigger, pauseIf
} from '@cruncheevos/core'
import { code, pointerNullCheck } from './CommonGT4.js'
const {
  meta, stat, main, generalProtections, rich: makeRichPresence,
  defineIndividualRace, defineAllRacesInOneSitting, defineAnySubEventWin,
  defineArcadeTimeTrial, defineCarEventWin, defineChampionship,
  defineLicenseAchievements, defineCarChallenge
} = await code('retail')
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
        main.inGamePlayerCar.isNotControlledByAIAlt,
        main.hud.dashboard.isRendered
      ),
      alt1: main.hud.dashboard.wentPastSpeed('kph', true, speedKPH),
      alt2: main.hud.dashboard.wentPastSpeed('kph', false, speedKPH),
      alt3: main.hud.dashboard.wentPastSpeed('mph', true, speedMPH),
      alt4: main.hud.dashboard.wentPastSpeed('mph', false, speedMPH),
    }
  })
}

export default function () {
  const events = Object.values(meta.events).filter(x => x.subsetOnly === false)

  const championshipsInOneSitting = events.filter(e => e.inOneSitting && e.isChampionship)
  const oneSittingRaces = events.filter(e => !e.isChampionship && e.inOneSitting && e.races.length > 1)
  const individualRaces = events.filter(e => !e.inOneSitting || e.races.length === 1)

  for (const e of championshipsInOneSitting) {
    defineChampionship({ set, e })
  }
  for (const e of oneSittingRaces) {
    defineAllRacesInOneSitting({ set, e })
  }
  for (const e of individualRaces) {
    if (e.races.length > 1) {
      e.races.forEach(({ raceId, trackId }, i) => {
        const trackName = meta.trackLookup[trackId]

        defineIndividualRace({
          set,
          e,
          title: `${e.name} - Race #${i + 1}`,
          description: `Win race #${i + 1} of ${e.name} on ${trackName} in A-Spec mode`,
          raceIds: [raceId],
          points: e.points / e.races.length
        })
      })
    } else {
      defineIndividualRace({ set, e })
    }
  }

  for (const c of meta.anySubEvent) {
    defineAnySubEventWin({ set, c })
  }

  for (const c of meta.carEventWin) {
    defineCarEventWin({ set, c })
  }

  for (const c of meta.arcadeTimeTrial) {
    defineArcadeTimeTrial({ set, c })
  }

  for (const c of meta.carChallenges) {
    defineCarChallenge({ set, c })
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
    defineLicenseAchievements({ set, l })
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
            stat.root,
            ['', 'Mem', 'Upper4', test.ntscFlagOffset, '<=', 'Value', '', 0xB],
            idx === tests.length - 1 && $(
              stat.root,
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
        start: $(
          startConditions,
          pauseIf(stat.forEachSetupSlot(s => s.wrongAutoUnionParts)),
        ),
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

export const rich = makeRichPresence()

if (process.argv.includes('icons')) {
  dumpAll()
}