// @ts-check
import '../../common.js'
import {
  AchievementSet, define as $,
  orNext, andNext, resetIf, trigger, once
} from '@cruncheevos/core'
import { code } from './CommonGT4.js'
const { meta, stat, main, generalProtections, defineIndividualRace, defineArcadeRace } = await code('retail')

import * as path from 'path'
import { makeBadge } from './icongen.js'
const badgeOutputDirectory = path.join(import.meta.dirname, 'tmp', 'icon_output')

/**
 * @param filePath {string}
 * @param {(badge: ReturnType<typeof makeBadge>) => ReturnType<typeof makeBadge>} cb
 */
function b(filePath, cb) {
  filePath = `local\\\\` + filePath

  if (process.argv.includes('icons')) {
    cb(makeBadge(filePath)).finish().dump(badgeOutputDirectory)
  }

  return filePath
}

/**
 * @template T
 * @typedef {T extends (Record <string, infer U>) ? U : never} ObjectValue
 * **/

const set = new AchievementSet({ gameId: 29854, title: 'Gran Turismo 4 [Subset - Bonus]' })

const events = Object.values(meta.events)
const subsetOnlyEvents = events.filter(e => e.subsetOnly)

/**
 * @param {ObjectValue<typeof meta["events"]>} e
 * */
function define24HourEvent(e) {
  // Must destructure, TypeScript check does not understand null check otherwise
  const { multiPoints } = e
  if (!multiPoints) {
    throw new Error(`${e.name} does not have multiPoints defined`)
  }

  const hourSet = [8, 16, 24]
  hourSet.forEach((hours, i) => {
    const subtitle = hours === 24 ? 'Finish!' : `${hours} hour mark!`
    let description = `Win the ${e.name} event in A-Spec mode and earn atleast ${e.aSpecPoints} A-Spec points.`
    if (hours !== 24) {
      description =
        `In ${e.name} event in A-Spec mode, cross the finish line in the 1st place, after ${hours} hours have passed. ` +
        `Remember to earn atleast ${e.aSpecPoints} A-Spec points on finish!`
    }

    const timeInMsec = hours * 60 * 60 * 3000

    set.addAchievement({
      title: e.name + ' - ' + subtitle,
      description,
      points: multiPoints[i],
      badge: b(`${e.id}_${hours}.png`, b => b
        .bg({ input: `_events/${e.id}.png` })
        .text({
          value: hours !== 24 ? `${hours}hr` : '',
          align: 'left',
          x: 4, y: 16
        })
      ),
      conditions: $(
        main.eventIdIs(e.raceIds[0]),
        stat.gameFlagIs.eventRace,
        generalProtections.noCheese,

        trigger(
          hours === 24 && main.wonRace({ aSpecPoints: e.aSpecPoints }),
          hours !== 24 && $(
            main.totalTimeInMsec.isGteThan(timeInMsec),
            main.hud.positionIs(1),
            main.inGamePlayerCar.completedLap
          )
        ),

        once(main.hud.lapTime.beganFirstLap),

        resetIf(
          main.hud.inBSpecMode,
          stat.gameFlagIs.inGameMenus,
          hours !== 24 && andNext(
            main.totalTimeInMsec.isGteThan(timeInMsec),
            main.hud.positionIs(1).withLast({ cmp: '!=' }),
            main.inGamePlayerCar.completedLap
          )
        )
      )
    })
  })
}

for (const e of subsetOnlyEvents) {
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
        badge: b(`${e.id}_${i}.png`, b => {
          if (e.id === 'eur1000mile') {
            return b
              .bg({ input: `_events/eu.png` })
              .textOverlay({ value: '1000' })
              .text({
                value: (i + 1).toString(),
                align: 'right',
                x: 60, y: 60
              })
          } else {
            return b
              .bg({ input: `_events/${e.id}.png` })
              .text({
                value: (i + 1).toString(),
                y: 54
              })
          }
        })
      })
    })
  } else if (e.multiPoints) {
    define24HourEvent(e)
  } else {
    defineIndividualRace({
      set,
      e,
      triggerIcon: true,
      badge: b(`${e.id}.png`, b => b
        .bg({ input: `_events/${e.id}.png` })
      )
    })
  }
}

for (const e of events) {
  e.races.forEach(({ raceId, trackId, aSpec200 }, i) => {
    if (!aSpec200) {
      return
    }

    const aSpecRequirementText =
      aSpec200.requirement < 200 ?
        `${aSpec200.requirement} A-Spec points or more` :
        `200 A-Spec points`

    let descriptionSuffix = ''
    if (e.isChampionship) {
      descriptionSuffix += ', in single race mode'
    }
    descriptionSuffix += '.'
    if (aSpec200.descriptionSuffix) {
      descriptionSuffix += ' ' + aSpec200.descriptionSuffix
    }

    const trackName = meta.trackLookup[trackId]
    set.addAchievement({
      title: `${e.name} - Bonus Challenge #${i + 1}`,
      description: `Earn ${aSpecRequirementText} in race #${i + 1} of ${e.name} on ${trackName}${descriptionSuffix}`,
      points: aSpec200.achPoints,
      conditions: $(
        stat.gameFlagIs.eventRace,
        main.eventIdIs(raceId),
        main.wonRace({ aSpecPoints: aSpec200.requirement }),
        generalProtections.noCheese200,
      ),
      badge: b(`${e.id}_${i}_200.png`,
        b => b
          .bg({ input: `_events/${e.id}.png` })
          .textOverlay({ value: '200' })
          .text({
            value: (i + 1).toString(),
            align: 'right',
            x: 60, y: 60
          })
      )
    })
  })
}

{
  const carriages = [
    // { id: 0x389, name: 'Opera S2000 TEST CAR' },
    { id: 0x3D2, name: 'Patent Motor Wagen \'86' },
    { id: 0x3D3, name: 'Daimler Motor Carriage \'86' }
  ]

  const commonConditions = $(
    orNext(
      stat.gameFlagIs.arcadeTimeTrial,
      stat.gameFlagIs.freeRun,
      stat.gameFlagIs.photoDrive,
    ),
    main.inASpecMode,
  )

  set.addAchievement({
    title: 'Sisyphus Reference',
    description: 'Take any of Mercedes-Benz ONE HORSEPOWER carriages and complete a lap on Nurburgring Nordschleife. Arcade Time Trial recommended.',
    points: 100,
    conditions: $(
      commonConditions,
      main.inGamePlayerCar.idIs(
        ...carriages.map(x => x.id)
      ),

      trigger(main.inGamePlayerCar.completedLap)
    )
  })

  for (const { id, name } of carriages) {
    set.addLeaderboard({
      title: 'Sisyphus Reference - ' + name,
      description: `Fastest time to earn this achievement using this carriage`,
      lowerIsBetter: true,
      type: 'FIXED3',
      conditions: {
        start: $(
          commonConditions,
          main.inGamePlayerCar.idIs(id),
          main.hud.lapTime.newLap
        ),
        cancel: orNext(main.notInASpecMode),
        submit: main.inGamePlayerCar.completedLap,
        value: main.inGamePlayerCar.measuredLastLapTime
      }
    })
  }
}

for (const m of Object.values(meta.missions).slice(0, 10)) {
  const nameMatch = m.name.match(/(?:The )?(.+?)( \d)?:/)
  if (!nameMatch) {
    throw new Error('should never happen: ' + m.name)
  }

  set.addAchievement({
    title: `Extra ${nameMatch[1]} #${m.index}`,
    description: `Complete mission #${m.index} - ${m.nameFull}, without colliding with other car or going out.`,
    points: m.points,
    conditions: {
      core: $(
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
      ),
    }
  })
}

const mediumRallyEvents = Object.values(meta.events)
  .filter(e => e.id.match(/rh_.+?(?<!wet)_n$/))
for (const r of mediumRallyEvents) {
  set.addAchievement({
    title: `${r.name} - Clean Challenge`,
    description: `Win any ${r.name} event in A-Spec mode and earn atleast ${r.aSpecPoints} A-Spec points, without getting any penalties. Nitrous is not allowed.`,
    points: r.points,
    conditions: $(
      stat.gameFlagIs.eventRace,
      main.eventIdIs(...r.raceIds),
      trigger(
        main.wonRace({ aSpecPoints: r.aSpecPoints }),
      ),
      generalProtections.noCheese,
      generalProtections.pauseIfHasNitrous,

      once(main.hud.lapTime.beganFirstLap),

      resetIf(
        main.gotPenalty,
        main.notInASpecMode
      ),
    )
  })
}

for (const r of meta.arcadeRace) {
  defineArcadeRace({ set, r })
}

export default set