// @ts-check
import '../../common.js'
import {
  AchievementSet, define as $,
  orNext, andNext, resetIf, trigger, once, addHits, measuredIf,
  resetNextIf
} from '@cruncheevos/core'
import { code, pointerNullCheck } from './CommonGT4.js'
const {
  meta, stat, main, rich: makeRichPresence,
  defineIndividualRace, defineAllRacesInOneSitting, defineAnySubEventWin,
  defineArcadeTimeTrial, defineCarEventWin, defineChampionship,
  defineLicenseAchievements, defineArcadeRace,

  generalProtections
} = await code('online')

const set = new AchievementSet({ gameId: 30930, title: 'Gran Turismo 4: Spec II' })

export default function () {
  const events = Object.values(meta.events).filter(x => x.subsetOnly === false)

  const championshipsInOneSitting = events.filter(e => e.inOneSitting && e.isChampionship)
  const oneSittingRaces = events.filter(e => !e.isChampionship && e.inOneSitting && e.races.length > 1)
  const individualRaces = events.filter(e => !e.inOneSitting || e.races.length === 1)

  for (const e of championshipsInOneSitting) {
    defineChampionship({ set, e, spec2: true })
  }
  for (const e of oneSittingRaces) {
    defineAllRacesInOneSitting({ set, e, spec2: true })
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
          points: e.multiPoints ? e.multiPoints[i] : (e.points / e.races.length),
          spec2: true
        })
      })
    } else {
      defineIndividualRace({ set, e, spec2: true })
    }
  }

  for (const c of meta.anySubEvent) {
    defineAnySubEventWin({ set, c, spec2: true })
  }

  for (const c of meta.carEventWin) {
    defineCarEventWin({ set, c, spec2: true })
  }

  for (const r of meta.arcadeRace) {
    defineArcadeRace({ set, r, spec2: true })
  }

  for (const c of meta.arcadeTimeTrial) {
    defineArcadeTimeTrial({ set, c, spec2: true })
  }

  for (const m of Object.values(meta.missions)) {
    // If you go backwards from the start - mission can end for some reason
    const notExploited = $(
      main.p.root84,
      ['AddAddress', 'Mem', '32bit', 0x70],
      ['', 'Mem', '32bit', 0x7054, '>', 'Value', '', 5000],
    )

    let description = `Complete mission #${m.index} - ${m.nameFull}`
    let conditions = $(
      main.eventIdIs(m.eventId.ntsc),
      main.earnedASpecPoints,
      main.inASpecMode,
      main.hud.showingRaceResults,
      notExploited,
      stat.gameFlagIs.mission
    )

    if (m.index <= 10) {
      description += ', without colliding with other car or going out.'

      conditions = $(
        stat.gameFlagIs.mission,
        main.eventIdIs(m.eventId.ntsc),
        trigger(
          main.earnedASpecPoints,
          main.hud.showingRaceResults,
          notExploited,
        ),

        once(main.hud.lapTime.beganFirstLap),

        resetIf(
          main.playerWentOut(0.01).singleChainOfConditions,
          main.notInASpecMode
        ),
      )
    }

    set.addAchievement({
      title: m.name,
      description: description,
      points: m.points,
      conditions: $(
        generalProtections.spec2PauseIfBadVersion,
        conditions
      )
    })
  }

  for (const l of Object.values(meta.licenses)) {
    defineLicenseAchievements({ set, l, spec2: true })
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
      type: letter.match(/^(B|A|IB|IA)$/) ? 'progression' : '',
      conditions: {
        core: '1=1',

        // You finished all licenses in one session
        alt1: $(
          generalProtections.spec2PauseIfBadVersion,
          // Don't show measured indicator if
          // you didn't earn the license
          measuredIf(
            andNext(
              ...tests.map(test => $(
                stat.root,
                ['', 'Mem', 'Upper4', test.ntscFlagOffset, '<=', 'Value', '', 0xB]
              ))
            )
          ),

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

        alt2: $(
          generalProtections.spec2PauseIfBadVersion,
          stat.gameFlagIs.license,
          pointerNullCheck(main.p.root),
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
    title: 'Random Car Generator',
    description: 'Earn a prize car with Prize Car Randomizer option enabled',
    points: 1,
    conditions: $(
      generalProtections.spec2PauseIfBadVersion,
      stat.gameFlagIs.inGameMenus,
      stat.inGTModeProject,
      stat.prizeCarCountIncreased,
      stat.spec2RandomCars
    )
  })

  set.addAchievement({
    title: 'Quick Race',
    description: 'Win a random Event Synthesizer race and earn at least 80 A-Spec points',
    points: 1,
    conditions: $(
      generalProtections.spec2PauseIfBadVersion,
      generalProtections.pauseIfLockIfNotFromTopRoot,

      stat.gameFlagIs.eventRace,
      main.eventIdIs(4131, 3441),
      main.wonRace({ aSpecPoints: 80 }),
    )
  }).addAchievement({
    title: 'Exhibition',
    description: 'Win a random Event Synthesizer race while driving Auto Union V16 Type C Streamline `37 and earn at least 10 A-Spec points',
    points: 3,
    conditions: $(
      generalProtections.spec2PauseIfBadVersion,
      generalProtections.pauseIfLockIfNotFromTopRoot,

      main.eventIdIs(0xD71),
      stat.gameFlagIs.eventRace,
      main.inGamePlayerCar.idIs(0x431),
      andNext(
        'once',
        main.hud.lapTime.newLap
      ),
      resetIf(main.notInASpecMode),
      trigger(main.wonRace({ aSpecPoints: 10 }))
    )
  })

  set.addAchievement({
    title: 'Spilling Gears',
    description: 'Win any race of Supercar Festival while only driving on 1st gear and earn at least 4 A-Spec points. Nitrous is not allowed.',
    points: 3,
    conditions: $(
      generalProtections.spec2PauseIfBadVersion,
      generalProtections.spec2PauseIfLockIfBypassRegulations,
      main.eventIdIs(...meta.events.pr_supercar.raceIds),
      stat.gameFlagIs.eventRace,
      generalProtections.spec2NoRandomTracks,
      generalProtections.pauseIfHasNitrous,

      trigger(
        main.wonRace({ aSpecPoints: 4 })
      ),

      once(
        main.hud.lapTime.beganFirstLap
      ),

      resetIf(
        main.notInASpecMode,
        andNext(
          main.inGamePlayerCar.isNotControlledByAIAlt,
          main.currentGearIs(1).withLast({ cmp: '>' }),
        )
      )
    )
  })

  set.addAchievement({
    title: 'New Services',
    description: 'Repaint your car at GT Auto',
    points: 1,
    conditions: $(
      generalProtections.spec2PauseIfBadVersion,
      stat.gameFlagIs.inGameMenus,
      stat.inGTModeProject,
      main.enteredGTAutoRepaint,
      stat.gtModeCarColorIdChanged,
      stat.gtModeCarIdStaysSame
    )
  })

  set.addAchievement({
    title: 'B-Spec II',
    description: 'Win any race of Gran Turismo World Championship in B-Spec mode.',
    points: 2,
    conditions: {
      core: $(
        generalProtections.spec2PauseIfBadVersion,
        orNext(
          stat.gameFlagIs.eventChampionship,
          stat.gameFlagIs.eventRace
        ),
        main.eventIdIs(...meta.events.pr_gtworld.raceIds),
        main.inBSpecMode,
        main.hud.showingRaceResults.withLast({
          cmp: '>', rvalue: { type: 'Delta', size: '32bit', value: 0 }
        }),
        ...Array.from({ length: 6 }, (_, i) =>
          main
            .inGameCar(i)
            .lapsRemainingAre(0)
            .withLast({ cmp: i === 0 ? '=' : '>' })
        )
      )
    }
  })

  return set
}

export const rich = makeRichPresence()