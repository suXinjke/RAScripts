import { getParsedSheet as _getSheet } from '../../common.js'
import * as fs from 'fs'
import * as path from 'path'

/**
 * @template T
 * @typedef {T extends (infer U)[] ? Record<string, U> : T} ArrayToObject
 * **/

const tmpDir = path.join(import.meta.dirname, 'tmp')

let linksFileName = 'links'
let gameType = 'retail'

const getParsedSheet = (id) => _getSheet(import.meta.dirname, id, linksFileName, gameType)

/** @returns {Promise<Record<number, string>} */
async function makeCars() {
  const rows = await getParsedSheet('cars')

  return rows.reduce((prev, row) => {
    const id = row[0]
    const name = row[3].replace(/\s+/g, ' ')

    prev[id] = name
    return prev
  }, {})
}

/** @returns {Promise<Record<number, string>} */
async function makeTracks() {
  const rows = await getParsedSheet('tracks')

  return rows.reduce((prev, row) => {
    const id = row[0]
    const name = row[2]

    if (name) {
      prev[id] = name
    }
    return prev
  }, {})
}

function arrayToObject(prev, cur) {
  prev[cur.id] = cur
  return prev
}

async function makeEvents() {
  let [eventRows, subEventRows] = await Promise.all([
    getParsedSheet('events'),
    getParsedSheet('subEvents')
  ])

  const eventArray = eventRows
    .filter((col) => {
      const isLicense = col[1].startsWith('l')
      const shouldNotExclude = col[11].includes('exclude|') === false
      return isLicense === false && shouldNotExclude
    })
    .map((col) => {
      const id = col[1]

      const hasForbiddenCars = Boolean(col[9])
      const carIdsForbidden = hasForbiddenCars ? col[9].split('|').slice(0, -1).map(Number) : []
      const descriptionSuffix = hasForbiddenCars ? col[9].split('|').slice(-1)[0] : ''

      const name = col[2]
      const eventNameSuffix = col[10]

      const specialFlags = col[11].split('|')

      const multiPoints = col[3].split('|').map(Number)

      return {
        id,
        name,
        nameWithSuffix: eventNameSuffix ? name + ' ' + eventNameSuffix : name,

        /** @type {'progression' || ''} */
        achType: id.startsWith('am_') || id.startsWith('pr_') ? 'progression' : '',

        descriptionSuffix: descriptionSuffix ? ' ' + descriptionSuffix : '',
        points: multiPoints[0],
        /** @type {number[] | null} */
        multiPoints: multiPoints.length > 1 ? multiPoints : null,

        aSpecPoints: Number(col[4]),

        inOneSitting: Boolean(col[5]),
        isChampionship: Boolean(col[6]),
        nitrousAllowed: Boolean(col[7]),

        /** @type {[number, string]} */
        carIdAnyEvent: col[8] ? col[8].split('|').map((x, i) => i === 0 ? Number(x) : x) : [],
        carIdsForbidden,
        noCheese: specialFlags.includes('noCheese'),
        noPenalty: specialFlags.includes('noPenalty'),
        subsetOnly: specialFlags.includes('subsetOnly'),

        /** @type {Array<{
         * trackId: number,
         * raceId: number,
         * aSpec200?: {
         *  requirement: number,
         *  achPoints: number
         *  descriptionSuffix: string,
         * }
         * }>} */
        races: [],
        get raceIds() {
          return this.races.map(r => r.raceId)
        }
      }
    })

  /** @type ArrayToObject<typeof eventArray> */
  const events = eventArray.reduce(arrayToObject, {})

  /** @type {Record<string, number> */
  const licenseMissionPoints = eventRows
    .filter((col) => {
      const isLicense = col[1].startsWith('l')
      return isLicense
    })
    .reduce((prev, col) => {
      const id = col[1]
      prev[id] = Number(col[3])
      return prev
    }, {})


  const subEventCount = {}

  subEventRows = subEventRows.filter(col => {
    const readableName = col[4]
    return readableName != '#N/A'
  })

  subEventRows.forEach(col => {
    const eventId = col[3]

    subEventCount[eventId] ??= 0
    subEventCount[eventId]++;
  })

  subEventRows
    .filter((col) => {
      const isLicense = col[3].startsWith('l')
      const isDefinedEvent = Boolean(events[col[3]])

      return isLicense === false && isDefinedEvent
    })
    .forEach((col) => {
      const eventId = col[3] // pr_tuning
      const raceId = col[2] // pr_tuning_0500

      const subEventIsNotChampionship =
        raceId.endsWith('00') === false ||
        subEventCount[eventId] === 1

      if (subEventIsNotChampionship) {
        events[eventId].races.push({
          trackId: Number(col[5]),
          raceId: Number(col[0]),
          aSpec200: col[9] ? {
            requirement: col[10] ? Number(col[10]) : 200,
            achPoints: Number(col[9]),
            descriptionSuffix: col[11]
          } : null
        })
      }
    })

  const licenseRegex = /^l[0i][abs]/
  const coffeeRegex = /^l0c/

  const licensesAndCoffee = subEventRows
    .filter((col) => col[3].match(licenseRegex) || col[3].match(coffeeRegex))
    .map((col) => {
      const id = col[3] // coffee: l0c0001 , license: lib0016
      const licenses = { 1: 'b', 2: 'a', 3: 'ib', 4: 'ia', 5: 's' }
      const isCoffee = col[3].match(coffeeRegex) !== null

      /** @type {string} */
      const license = isCoffee ? licenses[id.slice(-1)] : id.slice(1, 3).replace('0', '')

      const [pal, ntsc] = [col[0], col[1]].map(Number)

      return {
        id,
        name: col[4],
        palFlagAddress: Number(col[6]),
        ntscFlagOffset: Number(col[7]),
        license: license.toUpperCase(),
        index: Number(id.slice(-2)),
        isCoffee,
        points: licenseMissionPoints[id],
        eventId: { pal, ntsc },
      }
    })

  const missionArray = subEventRows
    .filter((col) => col[3].match(/^l0m/))
    .map((col) => {
      const id = col[3] // l0m0017
      const [pal, ntsc] = [col[0], col[1]].map(Number)

      return {
        id,
        name: col[4].replace(/ old and new!$/, '!'),
        nameFull: col[4],
        index: Number(id.slice(-2)),
        points: licenseMissionPoints[id],
        eventId: { pal, ntsc },
      }
    })

  /** @type {Record<number, string> */
  const eventLookup = subEventRows
    .reduce((prev, col) => {
      const name = col[4]
      const eventIds = [col[0], col[1]].map(Number)
      for (const id of eventIds) {
        prev[id] = name
      }

      return prev
    }, {})

  return {
    events,

    /** @type {ArrayToObject<typeof licensesAndCoffee} */
    licenses: licensesAndCoffee.reduce(arrayToObject, {}),

    /** @type {ArrayToObject<typeof missionArray} */
    missions: missionArray.reduce(arrayToObject, {}),

    eventLookup
  }
}

async function makeCarChallenges() {
  const rows = await getParsedSheet('carChallenges')

  return rows.map((col) => {
    let description = col[9]
    let fullDescription = ''
    if (description.startsWith('!')) {
      fullDescription = description.slice(1)
      description = ''
    }

    const aSpecPoints = Number(col[6])

    const eventStringIds = col[4] ? col[4].split(', ') : []
    const raceIndex = col[5] ? Number(col[5]) : -1

    if (eventStringIds.some(trackId => trackId.startsWith('rh_'))) {
      fullDescription = `In any Dirt or Snow rally event of Special Conditions hall, earn ${aSpecPoints} A-Spec points or more in ${description || col[1]}.`
      description = ''
    }

    const {
      laps = -1,
      colorId = -1,
      forbiddenGearboxId = []
    } = col[10] ? JSON.parse(col[10]) : {}

    return {
      aSpecPoints,
      name: col[7],
      description,
      fullDescription,
      points: Number(col[8]),
      carIds: col[0] ? col[0].split(', ').map(Number) : [],
      trackIds: col[2] ? col[2].split(', ').map(Number) : [],
      eventStringIds,
      raceIndex,

      laps,
      colorId,

      /** @type {number[]} */
      forbiddenGearboxId
    }
  })
}

async function makeAnySubEvents() {
  const rows = await getParsedSheet('anySubEvent')

  return rows.map(col => {
    const eventIds = col[0] ? col[0].split('|') : []

    return {
      eventId: eventIds.length === 1 ? eventIds[0] : '',
      multiEventId: eventIds,
      achievementNameOverride: col[1].startsWith('!') ? col[1].slice(1) : '',
      points: Number(col[2]),
      aSpecPoints: Number(col[3]),
      nitrousAllowed: Boolean(col[4]),
      specificRaceIds: col[5] ? col[5].split('|').map(Number) : [],
      eventDescriptionOverride: col[6],
      carIdsRequired: col[7] ? col[7].split('|').map(Number) : [],
      descriptionSuffix: col[8]
    }
  })
}

async function makeCarEventWin() {
  const rows = await getParsedSheet('carEventWin')

  return rows.map(col => {
    const achDescription = col[6]
    let crashSensitivity
    if (achDescription.includes('stay on the road')) {
      crashSensitivity = 0.0
    }

    return {
      achName: col[0],
      points: Number(col[1]),
      carIdsRequired: col[2].split(',').map(Number),
      eventId: col[4],
      raceIndex: col[5] ? Number(col[5]) : -1,
      achDescription,
      tiresId: col[8] ? [Number(col[8]), Number(col[9])] : [],
      gearbox: achDescription.includes('manual transmission') ? 'manual' : '',
      gearboxId: Number(col[10]),
      suspensionId: Number(col[11]),
      aid: achDescription.includes('no driving aids') ? 'none' : '',
      crashSensitivity,
      aSpecPoints: col[7] ? Number(col[7]) : 0,
      noNitrous:
        achDescription.includes('itrous is not allowed') ||
        achDescription.includes('o nitrous'),

      singleRace: achDescription.includes('ingle race')
    }
  })
}

function extractTires(str = '') {
  if (str.includes('Normal Comfort')) return 'n2'
  if (str.includes('Normal Road')) return 'n3'
  if (str.includes('Sports Hard')) return 'sh'
  if (str.includes('Sports Soft')) return 'ss'
  if (str.includes('Sports Medium')) return 'sm'
  if (str.includes('Racing Hard')) return 'rh'
  if (str.includes('Racing Medium')) return 'rm'
  if (str.includes('Racing Soft')) return 'rs'
  if (str.includes('Racing Super Soft')) return 'rss'
  if (str.includes('Racing Super Hard')) return 'rsh'

  throw new Error('expected tires, got nothing: ' + str)
}

async function makeArcadeTimeTrial() {
  const rows = await getParsedSheet('arcadeTimeTrial')

  // example input: 8:05'123
  // expected output in msec: 485123
  function extractTime(str = '') {
    const timeString = str.match(/(\d+):(\d{2})'(\d{3})/)

    return (
      Number(timeString[1]) * 60 * 1000 +
      Number(timeString[2]) * 1000 +
      Number(timeString[3])
    )
  }

  return rows.map(col => {
    const description = col[6]
    const powerTuneMatch = description.match(/power.+?(\d+)%/)
    if (!powerTuneMatch) {
      throw new Error('expected power/weight tune, got nothing: ' + description)
    }

    return {
      achName: col[5],
      description,
      points: Number(col[4]),
      lapTimeTargetMsec: extractTime(description),
      carIds: col[0].split(',').map(Number),
      trackId: Number(col[2]),

      /** @type { ReturnType<typeof extractTires> | 'dr' | 'sn' } */
      tires: col[10] || extractTires(description),

      /** @type {'' | 'manual'} */
      gearbox: description.includes('manual transmission') ? 'manual' : '',
      /** @type {'' | 'none'} */
      aid: description.includes('no driving aids') ? 'none' : '',
      powerTune: Number(powerTuneMatch[1]),
      topSpeedTune: Number(col[7]),
      crashSensitivity: col[8] ? Number(col[8]) : 0.05,
      laps: Number(col[9]),
      interiorCamera: description.includes('interior camera')
    }
  })
}

async function makeArcadeRace() {
  const rows = await getParsedSheet('arcadeRace')

  return rows.map(col => {
    const description = col[8]
    const powerTuneMatch = description.match(/power.+?(\d+)%/)

    const lapsMatch = description.match(/(\d+) Laps?/)
    if (!lapsMatch) {
      throw new Error('expected laps, got nothing: ' + description)
    }

    const opponentCarIds = col[2] ? col[2].split(', ').map(Number) : []
    const playerCarIds = col[0] ? col[0].split(', ').map(Number) : opponentCarIds

    return {
      achName: col[7],
      description,
      points: Number(col[6]),
      trackId: Number(col[4]),

      laps: Number(lapsMatch[1]),

      playerCarIds,
      opponentCarIds,

      /** @type { ReturnType<typeof extractTires> } */
      tires: extractTires(description),

      powerTune: powerTuneMatch ? Number(powerTuneMatch[1]) : null,
      topSpeedTune: col[9] ? Number(col[9]) : null,
      stayOnTheRoad: description.includes('stay on the road'),
      crashSensitivity:
        col[11] ? Number(col[11]) :
          description.includes('not crash') ? 0.05 :
            0,
      maxCars: col[10] ? Number(col[10]) : null,
      distinctOpponents: Boolean(col[12]),
      penalties: description.includes('Speed Limiter'),
      forceRandomOpponents: description.includes('opponents random'),
      aSpecPoints: Number(col[13]),
    }
  })
}

export default async function main(r = 'retail') {
  if (r === 'online') {
    linksFileName = 'links2'
    gameType = 'online'
  }

  if (fs.existsSync(tmpDir) === false) {
    fs.mkdirSync(tmpDir)
  }

  const [
    carLookup,
    trackLookup,
    carChallenges,
    events,
    anySubEvent,
    carEventWin,
    arcadeTimeTrial,
    arcadeRace
  ] = await Promise.all([
    makeCars(),
    makeTracks(),
    r === 'online' ? [] : makeCarChallenges(),
    makeEvents(),
    makeAnySubEvents(),
    makeCarEventWin(),
    makeArcadeTimeTrial(),
    makeArcadeRace(),
  ])

  return { carLookup, trackLookup, carChallenges, ...events, anySubEvent, carEventWin, arcadeTimeTrial, arcadeRace }
}
