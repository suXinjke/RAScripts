import { getParsedSheet as _getSheet, arrayToObject } from '../../common.ts'
import type { ArrayValue } from '../../common.ts'
import * as fs from 'fs'
import * as path from 'path'

const tmpDir = path.join(import.meta.dirname, 'tmp')

const getParsedSheet = (id: string) => _getSheet(import.meta.dirname, id)

// example input: 8:05.123
// expected output in msec: 485123
function extractTime(str: string) {
  const timeString = str.match(/(\d+):(\d{2})\.(\d{3})/)
  return (
    Number(timeString[1]) * 60 * 1000 +
    Number(timeString[2]) * 1000 +
    Number(timeString[3])
  )
}

function generateHash(name: string) {
  let hash = BigInt(0)
  const nameChars = name.split('').map(x => BigInt(x.charCodeAt(0)))

  for (const char of nameChars) {
    hash += char
  }

  for (const char of nameChars) {
    let temp1 = BigInt(hash) << BigInt(7)
    let temp2 = BigInt(hash) >> BigInt(57)

    hash = BigInt.asUintN(64, temp1 | temp2)
    hash += char
  }

  return BigInt.asUintN(64, hash)
}

export function getHash(str: string) {
  const hash = generateHash(str).toString(16).padStart(16, '0')
  return [
    parseInt(hash.slice(0, 8), 16),
    parseInt(hash.slice(8), 16),
    hash
  ] as const
}

async function makeCars() {
  const rows = await getParsedSheet('cars')

  const cars = rows.map((row) => ({
    id: row[3],
    name: row[2],
    year: row[4] ? Number(row[4]) : '',
    country: row[5],
    type: row[6],
    hidden: row[14]
  }))

  type Car = ArrayValue<typeof cars>

  return {
    carLookup: arrayToObject(cars, x => x.id),

    carLookupByCountry: cars.reduce((prev, cur) => {
      if (!cur.country) {
        return prev
      }

      if (!prev[cur.country]) {
        prev[cur.country] = []
      }

      prev[cur.country].push(cur)
      return prev
    }, {} as Record<string, Car[]>)
  }
}

async function makeTracks() {
  const rows = await getParsedSheet('tracks')

  const tracks = rows.map((row) => ({
    id: row[2],
    name: row[3],
  }))

  return arrayToObject(tracks, x => x.id)
}

async function makeLicenses() {
  const rows = await getParsedSheet('license')

  const licenses = rows.map((row) => ({
    id: row[1],
    name: row[2],
    points: Number(row[4]),
    get letter() {
      return this.id.match(/L\d?([A-Z]{1,2})/)[1]
    },
    get index() {
      return this.id[this.id.length - 1]
    },
  }))

  return {
    licenses,

    licenseLookupByLetter: {
      B: licenses.filter(x => x.id.startsWith('L0B')),
      A: licenses.filter(x => x.id.startsWith('L0A')),
      IB: licenses.filter(x => x.id.startsWith('LIB')),
      IA: licenses.filter(x => x.id.startsWith('LIA')),
      S: licenses.filter(x => x.id.startsWith('L0S')),
      R: licenses.filter(x => x.id.startsWith('L0R')),
    } as Record<string, typeof licenses>
  }
}

async function makeEvents() {
  const [_events, subEvents] = await Promise.all([
    getParsedSheet('events'),
    getParsedSheet('subEvents'),
  ])

  const eventCount: Record<string, number> = {}

  const events = _events.map(e => {
    const id = e[0]
    const idWithoutDifficulty = id.replace(/_\w$/, '')
    if (!eventCount[idWithoutDifficulty]) {
      eventCount[idWithoutDifficulty] = 0
    }
    eventCount[idWithoutDifficulty]++

    return {
      id,
      idWithoutDifficulty,
      name: e[1],
      points: 0,
      hasChampionship: false,
      oneSession: false,
      races: [{
        id: '',
        trackId: '',
        points: 0,
      }].slice(0, 0),
      carRestrict: {
        country: e[2],
        id: e[3],
        type: e[4],
        excludeId: e[5],
        excludeType: e[6],
        comment: e[7]
      },

      get league() {
        if (this.id.startsWith('G') === false) {
          return ''
        }

        if (this.id.endsWith('_e')) {
          return 'Beginner League'
        }
        if (this.id.endsWith('_n')) {
          return 'Amateur League'
        }
        if (this.id.endsWith('_h')) {
          return 'Professional League'
        }

        throw new Error('?')
      },

      get inMultipleLeagues() {
        return eventCount[idWithoutDifficulty] > 1
      }
    }
  })

  const eventLookup = arrayToObject(events, x => x.id)

  subEvents.forEach((s) => {
    const id = s[3]
    const eventId = s[2]
    const event = eventLookup[eventId]

    if (id.slice(-3, -2) === '5') {
      event.hasChampionship = true
    }

    event.races.push({
      id,
      trackId: s[4],
      points: s[5] ? Number(s[5]) : undefined
    })
  })

  Object.values(eventLookup).forEach(e => {
    if (e.races.some(s => s.points === undefined)) {
      e.points = e.races[0].points
      e.races[0].points = 0
      e.oneSession = true
    }
  })

  return { eventLookup, events }
}

async function makePolyphony() {
  const polyphony = await getParsedSheet('polyphony')

  return polyphony.map((e, index) => ({
    index,
    id: e[1],
    trackId: e[2],
    carId: e[0],
    points: Number(e[3]),
    time: {
      ntsc: extractTime(e[4]),
      ntsc_j: extractTime(e[4]),
      pal: extractTime(e[5]),
    },
    timeFormatted: {
      ntsc: e[4],
      pal: e[5],
    }
  }))
}

async function makeTimeTrials() {
  const timeTrials = await getParsedSheet('timeTrial')

  return timeTrials
    .filter(e => e[10].includes('ignore') === false)
    .map(e => {
      const flags = e[6]
      return {
        carId: e[0],
        trackId: e[1],
        title: e[2],
        description: e[3],
        points: Number(e[4]),
        time: extractTime(e[5]),
        timeFormatted: e[5],
        noGarage: flags.includes('garage') === false,
        isRally: flags.includes('rally'),
        crashSensitivity: e[7] ? Number(e[7]) : undefined,
        frontTiresId: e[8],
        rearTiresId: e[9],
        turbineId: e[10],
      }
    })
}

async function makeEventChallenges() {
  const eventChallenges = await getParsedSheet('eventWin')

  return eventChallenges.map(e => ({
    carIds: e[0].split(','),
    eventId: e[1],
    raceIndexes: e[2] ? Number(e[2]) : undefined,
    title: e[3],
    description: e[4],
    points: Number(e[5]),
    colorRestriction: e[7] ? Number(e[7]) : undefined,
    expectedOpponents: e[8],
    frontTiresExcludeId: e[9],
    rearTiresExcludeId: e[10],
  }))
}

export default async function main() {
  if (fs.existsSync(tmpDir) === false) {
    fs.mkdirSync(tmpDir)
  }

  const [
    cars,
    trackLookup,
    events,
    licenses,
    polyphony,
    timeTrials,
    eventChallenges
  ] = await Promise.all([
    makeCars(),
    makeTracks(),
    makeEvents(),
    makeLicenses(),
    makePolyphony(),
    makeTimeTrials(),
    makeEventChallenges()
  ])

  return {
    ...cars, trackLookup, ...events, ...licenses,
    polyphony, timeTrials, eventChallenges
  }
}
