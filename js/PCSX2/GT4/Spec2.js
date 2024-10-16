// @ts-check
import '../../common.js'
import {
  AchievementSet, define as $,
  orNext, andNext, resetIf, trigger, once, addHits, measuredIf
} from '@cruncheevos/core'
import { code, pointerNullCheck } from './CommonGT4.js'
const {
  meta, stat, main, rich: makeRichPresence,
  defineIndividualRace, defineAllRacesInOneSitting, defineAnySubEventWin,
  defineArcadeTimeTrial, defineCarEventWin, defineChampionship,
  defineLicenseAchievements, defineCarChallenge
} = await code('online')

const set = new AchievementSet({ gameId: 30930, title: 'Gran Turismo 4: Spec II' })

export default function () {
  const events = Object.values(meta.events).filter(x => x.subsetOnly === false)

  const championshipsInOneSitting = events.filter(e => e.inOneSitting && e.isChampionship)
  const oneSittingRaces = events.filter(e => !e.isChampionship && e.inOneSitting && e.races.length > 1)
  const individualRaces = events.filter(e => !e.inOneSitting || e.races.length === 1)

  for (const e of championshipsInOneSitting) {
    defineChampionship(set, e)
  }
  for (const e of oneSittingRaces) {
    defineAllRacesInOneSitting(set, e)
  }
  for (const e of individualRaces) {
    if (e.races.length > 1) {
      e.races.forEach(({ raceId, trackId }, i) => {
        const trackName = meta.trackLookup[trackId]

        defineIndividualRace(set, e, {
          title: `${e.name} - Race #${i + 1}`,
          description: `Win race #${i + 1} of ${e.name} on ${trackName} in A-Spec mode`,
          raceIds: [raceId],
          points: e.multiPoints ? e.multiPoints[i] : (e.points / e.races.length)
        })
      })
    } else {
      defineIndividualRace(set, e)
    }
  }

  for (const c of meta.anySubEvent) {
    defineAnySubEventWin(set, c)
  }

  // for (const c of meta.carEventWin) {
  //   defineCarEventWin(set, c)
  // }

  for (const c of meta.arcadeTimeTrial) {
    defineArcadeTimeTrial(set, c)
  }

  // for (const c of meta.carChallenges) {
  //   defineCarChallenge(set, c)
  // }

  for (const m of Object.values(meta.missions)) {
    let description = `Complete mission #${m.index} - ${m.nameFull}`
    let conditions = $(
      main.eventIdIs(m.eventId.ntsc),
      main.earnedASpecPoints,
      main.inASpecMode,
      main.hud.showingRaceResults,
      stat.gameFlagIs.mission
    )

    if (m.index <= 10) {
      description += ', without colliding with other car or going out.'

      conditions = $(
        stat.gameFlagIs.mission,
        orNext(
          main.eventIdIs(m.eventId.pal),
          main.eventIdIs(m.eventId.ntsc),
        ),
        trigger(
          main.earnedASpecPoints,
          main.hud.showingRaceResults
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
      conditions
    })
  }

  for (const l of Object.values(meta.licenses)) {
    defineLicenseAchievements(set, l)
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
      type: letter.match(/^(B|A|IB)$/) ? 'progression' : '',
      conditions: {
        core: '1=1',

        // You finished all licenses in one session
        alt1: $(
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
    title: 'RANDOM_CAR',
    description: 'Earn a prize car with Prize Car Randomizer option enabled',
    points: 1,
    conditions: $(
      stat.gameFlagIs.inGameMenus,
      stat.inGTModeProject,
      stat.prizeCarCountIncreased,
      stat.spec2RandomCars
    )
  })

  return set
}

export const rich = makeRichPresence()