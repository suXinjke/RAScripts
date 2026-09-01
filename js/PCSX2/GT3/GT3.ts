import { altsFromArray, makeMultiRegionalConditionsFunction, type ArrayValue } from '../../common.ts'
import codegen, { getHash } from './codegen.ts'
import { AchievementSet, define as $, ConditionBuilder, addHits, andNext, orNext, resetIf, trigger, pauseIf, measuredIf, RichPresence } from '@cruncheevos/core'

function overflow(num: number) {
  num = Number(num)

  while (num > 0xFFFFFFFF) {
    num -= (0xFFFFFFFF + 1)
  }

  return num
}

function getHashSum(str: string) {
  const [half1, half2] = getHash(str)
  return overflow(half1 + half2)
}

const set = new AchievementSet({ gameId: 2830, title: 'Gran Turismo 3: A-Spec' })

export const meta = await codegen()

type Region = 'ntsc' | 'pal' | 'ntsc_j'
const regions: Region[] = ['ntsc', 'pal', 'ntsc_j']

type CarRestriction = ['none' | 'are' | 'not', string[]]

const carRestrictions: Record<string, CarRestriction> = {}
function getCarRestrictions(eventName: string) {
  if (carRestrictions[eventName]) {
    return carRestrictions[eventName]
  }

  const event = meta.eventLookup[eventName]
  if (Object.values(event.carRestrict).every(str => !str)) {
    return carRestrictions[eventName] = ['none', []]
  }

  const re = event.carRestrict
  if (
    (re.id && re.excludeId) ||
    (re.type && re.excludeType)
  ) {
    console.log(re)
    throw new Error(`should never happen, check ${eventName}`)
  }

  const cars = Object.values(meta.carLookup).filter(c => !c.hidden)

  if (re.country) {
    const filteredCars = cars.filter(c => {
      const countryMatch = !re.country || re.country.split(',').some(co => co === c.country)
      const excludeCarNoMatch = !re.excludeId || re.excludeId.split(',').every(id => id !== c.id)
      const excludeTypeNoMatch = !re.excludeType || re.excludeType.split(',').every(t => t !== c.type)

      return countryMatch && excludeCarNoMatch && excludeTypeNoMatch
    }).map(c => c.id)

    return carRestrictions[eventName] = ['are', filteredCars]
  } else if (re.excludeId || re.excludeType) {
    const filteredCars = cars.filter(c => {
      const excludeCarMatch = !re.excludeId || re.excludeId.split(',').some(id => id === c.id)
      const excludeTypeMatch = !re.excludeType || re.excludeType.split(',').some(t => t === c.type)

      return excludeCarMatch && excludeTypeMatch
    }).map(c => c.id)

    return carRestrictions[eventName] = ['not', filteredCars]
  } else {
    const filteredCars = cars.filter(c => {
      const carMatch = !re.id || re.id.split(',').some(id => id === c.id)
      const typeMatch = !re.type || re.type.split(',').some(t => t === c.type)

      return carMatch && typeMatch
    }).map(c => c.id)

    return carRestrictions[eventName] = ['are', filteredCars]
  }
}

const universalReset = $.one(['ResetIf', 'Mem', '32bit', 0x10000c, '=', 'Value', '', 0])

const codeFor = (region: Region) => {
  const offset = (a: number) => {
    const addresses = {
      0x350b10: {
        pal: 0x352490,
        ntsc_j: 0x34ad10
      },

      0x351f50: {
        pal: 0x3538e8,
        ntsc_j: 0x34c178
      },

      0x352b70: {
        pal: 0x354508,
        ntsc_j: 0x34cce8
      },

      0x352a94: {
        pal: 0x35442c,
        ntsc_j: 0x34cc0c
      },

      0x978430: {
        pal: 0x972f30,
        ntsc_j: 0x960330
      },

      0x01fcbf90: {
        pal: 0x01fcbf90,
        ntsc_j: 0x1fcef90
      }
    }

    return addresses[a]?.[region] || a
  }

  const regionCheck = $(
    region === 'ntsc' && $.str('9710', (s, v) => $(['', 'Mem', s, 0x2a2167, '=', ...v])),
    region === 'pal' && $.str('5029', (s, v) => $(['', 'Mem', s, 0x2a3667, '=', ...v])),
    region === 'ntsc_j' && $.str('1500', (s, v) => $(['', 'Mem', s, 0x29f82f, '=', ...v])),
  )

  return {
    regionCheck,
    regionCheckPause: regionCheck.map(c => c.with({ flag: 'PauseIf', cmp: '!=' })),

    main1: (() => {
      const base = $.one(['AddAddress', 'Mem', '32bit', offset(0x350b10)])
      const base_c888 = $(
        base,
        ['AddAddress', 'Mem', '32bit', 0xC888]
      )

      const base_8 = $(
        base,
        ['AddAddress', 'Mem', '32bit', 0x8]
      )

      const base_c888_offset = (a: number) => {
        if (region === 'ntsc_j' && a > 0xA400) return a - 0x3014
        if (region === 'ntsc_j' && a > 0xA000) return a - 0x3010

        return a
      }

      const car = (index: number) => {
        const offset = index * 0x16DC

        return {
          wentOut() {
            const tireCombos = [
              [0x10D0, 0x1174, 0x1218],
              [0x10D0, 0x1174, 0x12BC],
              [0x10D0, 0x1218, 0x12BC],
              [0x1174, 0x1218, 0x12BC],
            ]

            const offTrackLimits: ConditionBuilder[] = []

            for (const combo of tireCombos) {
              for (let surface = 2; surface <= 4; surface++) {
                offTrackLimits.push($(
                  ...combo.map(tireOffset => $(
                    base_8,
                    ['', 'Mem', '8bit', offset + tireOffset, '=', 'Value', '', surface],
                  )),
                ))
              }
            }

            offTrackLimits.push($(
              base_8,
              ['', 'Mem', 'Bit0', offset + 0x15B7, '=', 'Value', '', 1],
            ))

            return {
              singleChainOfConditions: $(
                ...offTrackLimits.map(c => andNext(c))
              ),
              arrayOfAlts: offTrackLimits
            }
          },

          crashed: (crashSensitivity = 0.08) => {
            const bigBump = $(
              base_8,
              ['', 'Mem', 'Float', 0x153C, '>=', 'Float', '', crashSensitivity],
            )
            const bumped = bigBump.withLast({
              rvalue: { type: 'Delta', size: 'Float', value: 0x153C }
            })

            return andNext(
              bigBump,
              bumped
            )
          },

          lapsRemainingAreAtleast: (laps: number) => $(
            base_8,
            ['SubSource', 'Mem', '16bit', offset + 0x1480],
            base_c888,
            ['', 'Mem', '16bit', base_c888_offset(0x7C), '>=', 'Value', '', laps]
          ),
        }
      }

      return {
        inGTModeMenu: $.str('gt_m', (s, v) => $(
          base,
          ['', 'Mem', s, 0x6D, '=', ...v]
        )),

        _8_pauseIfNull: base_8.withLast({ flag: 'PauseIf', cmp: '=', rvalue: { type: 'Value', value: 0 } }),

        c888_pauseIfNull: base_c888.withLast({ flag: 'PauseIf', cmp: '=', rvalue: { type: 'Value', value: 0 } }),
        c888_pauseIfChange: base_c888.withLast({ flag: 'PauseIf', cmp: '!=', rvalue: { type: 'Delta', size: '32bit', value: 0xC888 } }),
        c888_nullCheck: base_c888.withLast({ flag: '', cmp: '!=', rvalue: { type: 'Value', value: 0 } }),

        car,
        playerCar: car(0),

        noReplay: $(
          base_8,
          ['AddAddress', 'Mem', '32bit', 0xD4],
          ['', 'Mem', '32bit', 0x130, '=', 'Value', '', 0]
        ),
        inReplayMode: $(
          base_8,
          ['AddAddress', 'Mem', '32bit', 0xD4],
          ['', 'Mem', '32bit', 0x130, '!=', 'Value', '', 0]
        ),

        totalTimeMeasured: $(
          base_8,
          ['Measured', 'Mem', '32bit', 0xE380, '/', 'Value', '', 3000]
        ),

        lapCountMeasured: $(
          base_c888,
          ['Measured', 'Mem', '32bit', base_c888_offset(0x78)]
        ),
        totalLapsMeasured: $(
          base_c888,
          ['Measured', 'Mem', '32bit', base_c888_offset(0x7c)]
        ),
        noLapsToComplete: $(
          base_c888,
          ['', 'Mem', '32bit', base_c888_offset(0x7c), '=', 'Value', '', 0]
        ),

        completedLap: $(
          base_c888,
          ['', 'Mem', '32bit', base_c888_offset(0x78), '>', 'Delta', '32bit', base_c888_offset(0x78)],
        ),

        finishedPolyphonyTimeTrial: $(
          base_c888,
          ['', 'Mem', '32bit', base_c888_offset(0xC0), '=', 'Value', '', 1],
          base_c888,
          ['AndNext', 'Delta', '32bit', base_c888_offset(0x208), '=', 'Value', '', -1],
          base_c888,
          ['', 'Mem', '32bit', base_c888_offset(0x208), '>', 'Value', '', 0]
        ),

        newLap: $(
          base_c888,
          ['AndNext', 'Mem', '32bit', base_c888_offset(0x250), '>', 'Delta', '32bit', base_c888_offset(0x250)],
          base_c888,
          ['AndNext', 'Mem', '32bit', base_c888_offset(0x250), '>', 'Value', '', 0x3C],
          base_c888,
          ['', 'Delta', '32bit', base_c888_offset(0x250), '<=', 'Value', '', 0x3C],
        ),

        lastLapTimeIsLt: (msec: number) => $(
          base_c888,
          ['', 'Mem', '32bit', base_c888_offset(0x208), '<', 'Value', '', msec]
        ),
        lastLapTimeMeasured: $(
          base_c888,
          ['Measured', 'Mem', '32bit', base_c888_offset(0x208)]
        ),

        license: {
          timeMeasured: $(
            base_c888,
            ['Measured', 'Mem', '32bit', base_c888_offset(0xA4A4)]
          ),

          finished: $(
            base_c888,
            ['AndNext', 'Delta', '8bit', base_c888_offset(0xA691), '=', 'Value', '', 1],
            base_c888,
            ['', 'Mem', '8bit', base_c888_offset(0xA691), '=', 'Value', '', 2]
          ),

          isGold: $(
            base_c888,
            ['', 'Mem', '32bit', base_c888_offset(0xA498), '=', 'Value', '', 2]
          ),
          isBronzeOrBetter: $(
            base_c888,
            ['AndNext', 'Mem', '32bit', base_c888_offset(0xA498), '>=', 'Value', '', 2],
            base_c888,
            ['', 'Mem', '32bit', base_c888_offset(0xA498), '<=', 'Value', '', 4]
          ),
        },

        race: {
          finished: andNext(
            $.str('@fin', (s, v) => $(
              base_c888,
              ['', 'Mem', s, base_c888_offset(0xA334), '=', ...v]
            )),
            base_c888,
            ['', 'Mem', 'Float', base_c888_offset(0xA304), '<', 'Float', '', 0.3],
          ),
          firstPlace: $(
            base_c888,
            ['', 'Mem', '32bit', base_c888_offset(0x9c), '=', 'Value', '', 1],
          )
        }
      }
    })(),

    event: (() => {
      const base = $.one(['AddAddress', 'Mem', '32bit', offset(0x351f50)])
      const nullCheck = base.with({ flag: '', cmp: '!=', rvalue: { type: 'Value', value: 0 } })

      const car = (index: number) => {
        const offset = index * 0x2160

        return {
          // For the cars, half of the hash are all distinct except for collisions:
          // R32 '91 , R32 '98
          // Altezza AS200, Altezza RS200
          hashIs: (str: string) => $(
            base,
            ['', 'Mem', '32bit', offset + 0x900, '=', 'Value', '', getHash(str)[1]]
          ),
          hashIsNot: (str: string) => $(
            base,
            ['', 'Mem', '32bit', offset + 0x900, '!=', 'Value', '', getHash(str)[1]]
          ),
          hashSumMeasured: $(
            base,
            ['AddSource', 'Mem', '32bit', offset + 0x900],
            base,
            ['Measured', 'Mem', '32bit', offset + 0x900 + 0x4],
          ),
          colorIdIs: (id: number) => $(
            base,
            ['', 'Mem', '32bit', offset + 0x908, '=', 'Value', '', id]
          ),

          frontTireHashIs(str: string) {
            const [left, right] = getHash(str)
            return $(
              base,
              ['AndNext', 'Mem', '32bit', offset + 0x958, '=', 'Value', '', right],
              base,
              ['', 'Mem', '32bit', offset + 0x958 + 0x4, '=', 'Value', '', left],
            )
          },

          rearTireHashIs(str: string) {
            const [left, right] = getHash(str)
            return $(
              base,
              ['AndNext', 'Mem', '32bit', offset + 0x960, '=', 'Value', '', right],
              base,
              ['', 'Mem', '32bit', offset + 0x960 + 0x4, '=', 'Value', '', left],
            )
          },

          turbineHashIs(str: string) {
            const [left, right] = getHash(str)
            return $(
              base,
              ['AndNext', 'Mem', '32bit', offset + 0x9A8, '=', 'Value', '', right],
              base,
              ['', 'Mem', '32bit', offset + 0x9A8 + 0x4, '=', 'Value', '', left],
            )
          },
        }
      }

      return {
        nullCheck,
        eventHashIs(str: string) {
          const [left, right] = getHash(str)

          return $(
            base,
            ['AndNext', 'Mem', '32bit', 0x20, '=', 'Value', '', right],
            base,
            ['', 'Mem', '32bit', 0x20 + 0x4, '=', 'Value', '', left],
          )
        },
        eventHashSumMeasured: $(
          base,
          ['AddSource', 'Mem', '32bit', 0x20],
          base,
          ['Measured', 'Mem', '32bit', 0x20 + 0x4],
        ),
        eventHashSumIs(str: string) {
          const sum32bit = getHashSum(str)

          return $(
            base,
            ['AddSource', 'Mem', '32bit', 0x20],
            base,
            ['', 'Mem', '32bit', 0x20 + 0x4, '=', 'Value', '', sum32bit],
          )
        },
        eventHashHalfMeasured: $(
          base,
          ['Measured', 'Mem', '32bit', 0x20]
        ),
        // For the tracks, half of the hash are all distinct
        trackHashIs: (str: string) => $(
          base,
          ['', 'Mem', '32bit', 0x30, '=', 'Value', '', getHash(str)[1]]
        ),
        trackHashMeasured: $(
          base,
          ['Measured', 'Mem', '32bit', 0x30]
        ),

        car,
        playerCar: car(0),
        applyCarRestrictons(re: CarRestriction, inverted = false) {
          let [type, cars] = re
          if (type === 'none') {
            return undefined
          }

          if (inverted) {
            type = type === 'are' ? 'not' : 'are'
          }

          const carChecks = cars.map(id =>
            type === 'are' ? this.playerCar.hashIs(id) : this.playerCar.hashIsNot(id)
          )

          return type === 'are' ? orNext(...carChecks) : andNext(...carChecks)
        },
        inGame: andNext(
          base,
          ['', 'Mem', '32bit', 0x18, '!=', 'Value', '', 0],
        ),
        isQualifying: $(
          base,
          ['', 'Mem', '32bit', 0x54, '=', 'Value', '', -1],
        )
      }
    })(),

    stat: (() => {
      const base = $.one(['AddAddress', 'Mem', '32bit', offset(0x352a94)])

      return {
        dayCountMeasured: $(
          base,
          ['Measured', 'Mem', '32bit', 0x08]
        ),
        mileageMeasured: $(
          base,
          ['Measured', 'Mem', '32bit', 0x28, '/', 'Float', '', 500]
        ),

        inChampionship: $(
          base,
          ['', 'Mem', '32bit', 0x30890, '=', 'Value', '', 2]
        ),

        gotPrizeCar: $(
          base,
          ['', 'Mem', '32bit', 0xC4, '>', 'Delta', '32bit', 0xC4]
        ),

        arcadeGaragePause: $(
          base,
          ['PauseIf', 'Mem', '32bit', 0x34, '!=', 'Value', '', -1]
        ),

        eventStringFirstLettersAre(letter: string) {
          return $.str(letter, (s, v) => $(
            base,
            ['', 'Mem', s, 0x3080C, '=', ...v]
          ))
        },
        pauseIfNotAtleastArcadeHard: pauseIf(
          andNext(
            ...['AH', 'AP'].map(letters => $.str(letters, (s, v) => $(
              base,
              ['', 'Mem', s, 0x3080C, '!=', ...v],
            )))
          )
        ),
        pauseIfNotAtleastArcadeNormal: pauseIf(
          andNext(
            ...['AN', 'AH', 'AP'].map(letters => $.str(letters, (s, v) => $(
              base,
              ['', 'Mem', s, 0x3080C, '!=', ...v],
            )))
          )
        ),
        arcadeRaceClassIs: (carClass: string) => $.str(carClass, (s, v) => $(
          base,
          ['', 'Mem', s, 0x3080C + 2, '=', ...v],
        ))
      }
    })(),

    licenseFlagUp(idx: number) {
      const addr = offset(0x978430) + 0x154 * idx
      return $(
        ['AndNext', 'Delta', '32bit', addr, '=', 'Value', '', -1],
        ['', 'Mem', '32bit', addr, '<=', 'Value', '', 2]
      )
    },
    licenseIsPassed(idx: number) {
      const addr = offset(0x978430) + 0x154 * idx
      return $.one(['', 'Mem', '32bit', addr, '<=', 'Value', '', 2])
    },

    // check substring 'menu/qm_gt_event_champ.mbl'
    inChampionshipRaceStartScreen: $.str('t_ch', (s, v) => $(
      ['AddAddress', 'Mem', '32bit', offset(0x01fcbf90)],
      ['', 'Mem', s, 0xF, '=', ...v]
    )),
  }
}

const code = {
  ntsc: codeFor('ntsc'),
  pal: codeFor('pal'),
  ntsc_j: codeFor('ntsc_j'),
}

const multiRegionalConditions = makeMultiRegionalConditionsFunction(code)

function defineLicenseTestGold(l: ArrayValue<typeof meta.licenses>) {
  set.addAchievement({
    title: `License ${l.letter}-${l.index} - Gold`,
    description: `Earn the gold reward in license test ${l.letter}-${l.index} - ${l.name}`,
    points: l.points,
    conditions: multiRegionalConditions(c => $(
      c.regionCheckPause,
      c.main1.c888_pauseIfNull,
      c.event.eventHashIs(l.id),

      c.main1.license.finished,
      c.main1.license.isGold
    ))
  })

  set.addLeaderboard({
    title: `License ${l.letter}-${l.index}: ${l.name}`,
    description: `Fastest time to complete in msec.`,
    lowerIsBetter: true,
    type: 'FIXED3',
    conditions: {
      start: multiRegionalConditions(c => $(
        c.regionCheckPause,
        c.main1.c888_pauseIfNull,
        c.event.eventHashIs(l.id),
        c.main1.license.finished,
        c.main1.license.timeMeasured.withLast({
          flag: '', cmp: '>', rvalue: { type: 'Value', value: 0 }
        }),
      )),
      cancel: '0=1',
      submit: '1=1',
      value: multiRegionalConditions(c => $(
        measuredIf(c.regionCheck),
        c.main1.license.timeMeasured
      ))
    }
  })
}

function defineLicenseEarn(o: { idx: number, letter: string, points: number }) {
  const { idx, letter, points } = o
  const licenseTitle = letter === 'R' ? 'Rally' : letter
  const licenses = meta.licenseLookupByLetter[letter]

  set.addAchievement({
    title: `${licenseTitle} License Graduate`,
    description: `Earn bronze reward or better in all ${licenseTitle} License tests, ` +
      `or pass all tests in one sitting if you already have the license.`,
    points,
    type: (letter !== 'R' && letter !== 'S') ? 'progression' : undefined,
    conditions: altsFromArray(
      'hcafe=hcafe',
      ...multiRegionalConditions.toArray(c => $(
        c.regionCheckPause,

        // Don't show measured indicator if
        // you didn't earn the license
        measuredIf(
          andNext(
            ...licenses.map((_, i) => c.licenseIsPassed(i + idx * 8))
          )
        ),

        addHits(
          ...licenses.map(l => andNext(
            'once',
            // If this is treated as pause - it causes
            // measured indicator to appear repeatedly for some reason
            c.main1.c888_nullCheck,

            c.event.eventHashIs(l.id),
            c.main1.license.finished,
            c.main1.license.isBronzeOrBetter
          ))
        ),

        `M:0=1.8.`,
      )),

      ...multiRegionalConditions.toArray(c => $(
        c.regionCheckPause,
        c.event.nullCheck, // TODO: remove
        c.event.inGame,
        c.licenseFlagUp(7 + idx * 8)
      ))
    )
  })
}

function defineChampionshipWin(e: ArrayValue<typeof meta.events>) {
  const eventTitle = e.name + (e.inMultipleLeagues ? ` (${e.league.replace(' League', '')})` : '')
  const eventDescriptionTitle = e.name + (e.inMultipleLeagues ? ` (${e.league})` : '')

  let description = `Win ${eventDescriptionTitle} in championship mode, in one sitting.`
  if (e.carRestrict.comment) {
    description = e.carRestrict.comment + '! ' + description
  }

  set.addAchievement({
    title: eventTitle,
    description,
    points: e.points,
    type: e.id.match(/_[en]$/) ? 'progression' : undefined,
    conditions: {
      ...multiRegionalConditions(c => $(
        c.regionCheckPause,

        andNext(
          'once',
          c.event.eventHashIs(e.races[0].id),
          c.event.inGame,
          c.stat.inChampionship,
          c.inChampionshipRaceStartScreen
        ),

        trigger(
          c.stat.gotPrizeCar,
        ),

        resetIf(
          c.main1.inGTModeMenu
        ),

        pauseIf(
          c.event.applyCarRestrictons(getCarRestrictions(e.id), true)
        )
      )),
      core: [universalReset]
    },
  })
}

function defineEventInOneSession(e: ArrayValue<typeof meta.events>) {
  const eventTitle = e.name + (e.inMultipleLeagues ? ` (${e.league.replace(' League', '')})` : '')
  const eventDescriptionTitle = e.name + (e.inMultipleLeagues ? ` (${e.league})` : '')

  let description = `Win all events of ${eventDescriptionTitle} in one sitting.`
  if (e.carRestrict.comment) {
    description = e.carRestrict.comment + '! ' + description
  }

  set.addAchievement({
    title: eventTitle,
    description,
    points: e.points,
    type: e.id.match(/_[en]$/) ? 'progression' : undefined,
    conditions: multiRegionalConditions(c => $(
      c.regionCheckPause,
      c.main1.c888_pauseIfNull,

      addHits(
        ...e.races.map(s => andNext(
          'once',
          c.event.eventHashIs(s.id),
          c.main1.race.firstPlace,
          c.main1.race.finished,
        ))
      ),
      `M:0=1.${e.races.length}.`,

      pauseIf(
        c.event.applyCarRestrictons(getCarRestrictions(e.id), true)
      ),
    ))
  })
}

function defineIndividualEventWin(e: ArrayValue<typeof meta.events>, o: {
  title: string;
  description: string;
  points: number;
  raceIndexes?: number[];
  isProgression?: boolean;
  carRestrictions: CarRestriction;
  colorRestrictions?: number[];
  expectedOpponents?: string;
  frontTiresExcludeId?: string;
  rearTiresExcludeId?: string;
}) {
  const {
    title,
    description,
    points,
    raceIndexes = [],
    carRestrictions,
    colorRestrictions = [],
    isProgression,
    expectedOpponents = '',
    frontTiresExcludeId,
    rearTiresExcludeId
  } = o
  const opponentCarIds = expectedOpponents.split(',').filter(Boolean)

  set.addAchievement({
    title,
    description,
    points,
    type: isProgression ? 'progression' : undefined,
    conditions: multiRegionalConditions(c => {
      let triggerConditions = $(
        c.main1.race.firstPlace,
        c.main1.race.finished,
      )
      if (carRestrictions[0] !== 'none') {
        triggerConditions = trigger(triggerConditions)
      }

      return $(
        c.regionCheckPause,
        c.main1.c888_pauseIfNull,

        orNext(
          ...raceIndexes.map(i => c.event.eventHashIs(e.races[i].id))
        ),
        triggerConditions,

        c.event.applyCarRestrictons(carRestrictions),
        orNext(
          ...colorRestrictions.map(id => c.event.playerCar.colorIdIs(id))
        ),

        ...opponentCarIds.map(id => orNext(
          c.event.car(1).hashIs(id),
          c.event.car(2).hashIs(id),
          c.event.car(3).hashIs(id),
          c.event.car(4).hashIs(id),
          c.event.car(5).hashIs(id),
        )),

        pauseIf(
          frontTiresExcludeId && c.event.playerCar.frontTireHashIs(frontTiresExcludeId),
          rearTiresExcludeId && c.event.playerCar.rearTireHashIs(rearTiresExcludeId)
        )
      )
    })
  })
}

function defineRallyEventWin(id: string) {
  const regular = meta.eventLookup[id]
  const reverse = meta.eventLookup[id.replace(/^D/, 'Dr_')]

  const difficulties = ['Easy', 'Normal', 'Hard']
  const difficultiesShort = ['_e', '_n', '_h']
  difficulties.forEach((d, i) => {
    const { points } = regular.races[i]

    const races = [regular.races[i], reverse.races[i]]

    const idWithDifficultySuffix = regular.idWithoutDifficulty + difficultiesShort[i]

    set.addAchievement({
      title: `${regular.name} (${d})`,
      description: `${regular.carRestrict.comment}! Win both regular and reverse race #${i + 1} of ${regular.name} in one sitting.`,
      points,
      conditions: multiRegionalConditions(c => $(
        c.regionCheckPause,
        c.main1.c888_pauseIfNull,

        addHits(
          ...races.map(s => andNext(
            'once',
            c.event.eventHashIs(s.id),
            c.main1.race.firstPlace,
            c.main1.race.finished,
          ))
        ),
        `M:0=1.${races.length}.`,

        pauseIf(
          c.event.applyCarRestrictons(getCarRestrictions(id), true)
        ),
      ))
    })
  })

}

function defineArcadeRaceWin() {
  const areas = ['A', 'B', 'C', 'D', 'E', 'F']

  const areaTracks: Record<string, string[]> = {
    A: ['super', 'midfield', 'smtnorth', 'smtsouth', 'trialmt', 'r_midfield'],
    B: ['r_smtnorth', 'akasaka', 'grandvalley', 'laguna', 'rome', 'tahitidirt'],
    C: ['r_smtsouth', 'r_trialmt', 'deepforest', 'route5_dry', 'seattle', 'testcourse'],
    D: ['r_akasaka', 'r_grandvalley', 'r_rome', 'r_tahitidirt', 'tahitimaze', 'apricot'],
    E: ['route11', 'r_deepforest', 'r_route5_dry', 'r_seattle', 'montecarlo'],
    F: ['route5', 'r_apricot', 'r_route11', 'r_tahitimaze', 'r_route5'],
  }

  for (const area of areas) {
    const tracks = areaTracks[area]
    const carClasses = ['CT', 'BT', 'AT', 'ST'].concat(area !== 'E' ? ['AD'] : [])

    for (const isHard of [false, true]) {
      const difficultyComment = isHard ? 'Hard' : 'Normal or higher'
      set.addAchievement({
        title: `Arcade Area ${area}` + (isHard ? ' (Spicy)' : ''),
        description: `Win every Arcade Race in Area ${area} whilst also` +
          ` scoring a win in each Car Class on ${difficultyComment} difficulty, in one sitting.` +
          ` Using cars from your Garage is not allowed.`,
        points: 10,
        type: isHard ? '' : 'progression',
        conditions: multiRegionalConditions(c => $(
          c.regionCheckPause,
          c.stat.arcadeGaragePause,
          !isHard && c.stat.pauseIfNotAtleastArcadeNormal,
          isHard && c.stat.pauseIfNotAtleastArcadeHard,
          pauseIf(
            andNext(
              ...tracks.map(trackName => c.event.trackHashIs(trackName).withLast({ cmp: '!=' })),
            )
          ),
          c.main1.c888_pauseIfNull,

          addHits(
            ...carClasses
              .map(l => andNext(
                'once',
                c.stat.arcadeRaceClassIs(l),
                c.main1.race.firstPlace,
                c.main1.race.finished,
              ))
          ),

          addHits(
            ...tracks.map(trackName => andNext(
              'once',
              c.event.trackHashIs(trackName),
              c.main1.race.firstPlace,
              c.main1.race.finished,
            ))
          ),
          `M:0=1.${tracks.length + carClasses.length}.`
        ))
      })
    }
  }
}

function definePolyphonyTimeTrial(e: ArrayValue<typeof meta.polyphony>) {
  const trackName = meta.trackLookup[e.trackId].name
  const carName = meta.carLookup[e.carId].name

  set.addAchievement({
    title: `Arcade Time Trial #${e.index + 1} - ${trackName}`,
    description: `Beat Arcade Time Trial time of ` +
      `${e.timeFormatted.ntsc} (NTSC) or ${e.timeFormatted.pal} (PAL) ` +
      `at ${trackName}, while driving ${carName}.`,
    points: e.points,
    conditions: multiRegionalConditions((c, re) => $(
      c.regionCheckPause,
      c.main1.c888_pauseIfNull,
      c.main1.c888_pauseIfChange,
      c.main1._8_pauseIfNull,

      c.event.eventHashIs(e.id),
      c.main1.noReplay,
      c.main1.finishedPolyphonyTimeTrial,
      c.main1.lastLapTimeIsLt(e.time[re])
    )),
  }).addLeaderboard({
    title: `Arcade Time Trial #${e.index + 1}`,
    description: `Fastest time to complete in msec. ${trackName}.`,
    lowerIsBetter: true,
    type: 'FIXED3',
    conditions: {
      start: multiRegionalConditions((c) => $(
        c.regionCheckPause,
        c.main1.c888_pauseIfNull,
        c.main1.c888_pauseIfChange,
        c.main1._8_pauseIfNull,

        c.event.eventHashIs(e.id),
        c.main1.noReplay,
        c.main1.finishedPolyphonyTimeTrial,
      )),
      cancel: '0=1',
      submit: '1=1',
      value: multiRegionalConditions(c => $(
        measuredIf(c.regionCheck),
        c.main1.lastLapTimeMeasured
      ))
    }
  })
}

function defineTimeTrial(e: ArrayValue<typeof meta.timeTrials>) {
  const trackName = meta.trackLookup[e.trackId].name
  const carName = meta.carLookup[e.carId].name

  const startingConditions = (c: ReturnType<typeof codeFor>) => $(
    c.event.eventHashIs('ATAF0001'),
    c.event.trackHashIs(e.trackId),
    c.event.applyCarRestrictons(['are', [e.carId]]),
    e.frontTiresId && c.event.playerCar.frontTireHashIs(e.frontTiresId),
    e.rearTiresId && c.event.playerCar.rearTireHashIs(e.rearTiresId),
    e.turbineId && c.event.playerCar.turbineHashIs(e.turbineId),
    c.main1.newLap,
    c.main1.noReplay
  )

  let restrictions = [
    e.noGarage ? 'Stock Arcade car only' : '',
    ...e.description.split(', ')
  ].filter(Boolean).join(', ')
  if (restrictions) {
    restrictions = '. ' + restrictions
  }

  set.addAchievement({
    title: e.title,
    description: `Arcade Free Run, ${carName}${restrictions}. ` +
      `Do a clean lap on ${trackName} and beat the time of ${e.timeFormatted}.`,
    points: e.points,
    conditions: {
      ...multiRegionalConditions((c) => $(
        c.regionCheckPause,
        c.main1.c888_pauseIfNull,
        c.main1.c888_pauseIfChange,
        c.main1._8_pauseIfNull,
        e.noGarage && c.stat.arcadeGaragePause,

        andNext(
          'once',
          startingConditions(c)
        ),

        resetIf(
          !e.isRally && c.main1.playerCar.wentOut().singleChainOfConditions,
          c.main1.playerCar.crashed(e.crashSensitivity),
          c.main1.inReplayMode,
        ),

        trigger(
          c.main1.completedLap,
          c.main1.lastLapTimeIsLt(e.time)
        ),
      )),
      core: [universalReset]
    },
  }).addLeaderboard({
    title: e.title,
    description: `Arcade Free Run, ${carName}, ${trackName}${restrictions}.`,
    lowerIsBetter: true,
    type: 'FIXED3',
    conditions: {
      start: multiRegionalConditions((c) => $(
        c.regionCheckPause,
        c.main1.c888_pauseIfNull,
        c.main1.c888_pauseIfChange,
        c.main1._8_pauseIfNull,
        e.noGarage && c.stat.arcadeGaragePause,

        startingConditions(c)
      )),
      cancel: altsFromArray(
        '1=1',
        ...multiRegionalConditions.toArray(c => $(
          c.regionCheck,
          c.main1.playerCar.crashed(e.crashSensitivity)
        )),
        ...multiRegionalConditions.toArray(c => $(
          c.regionCheck,
          c.main1.inReplayMode
        )),
        ...(e.isRally ? [] : multiRegionalConditions.toArray(c =>
          c.main1.playerCar.wentOut().arrayOfAlts.map(x => $(c.regionCheck, x))
        )),
        $(
          universalReset.with({ flag: '' })
        )
      ),
      submit: multiRegionalConditions(c => $(
        c.regionCheckPause,
        c.main1.completedLap
      )),
      value: multiRegionalConditions(c => $(
        measuredIf(c.regionCheck),
        c.main1.lastLapTimeMeasured
      ))
    }
  })
}

export default function makeSet() {
  for (const e of meta.events.filter(e => e.id.startsWith('D') === false)) {
    if (e.oneSession) {
      if (e.hasChampionship) {
        defineChampionshipWin(e)
      } else {
        defineEventInOneSession(e)
      }
    } else {
      e.races.forEach((s, index) => {
        const trackName = meta.trackLookup[e.races[index].trackId].name

        const eventTitle = e.name + (e.inMultipleLeagues ? ` (${e.league.replace(' League', '')})` : '')
        const eventDescriptionTitle = e.name + (e.inMultipleLeagues ? ` (${e.league})` : '')

        let description = e.races.length > 1 ?
          `Win race #${index + 1} of ${eventDescriptionTitle}, on ${trackName}.` :
          `Win the ${eventDescriptionTitle} event.`

        if (e.carRestrict.comment) {
          description = e.carRestrict.comment + '! ' + description
        }

        defineIndividualEventWin(e, {
          title: eventTitle + (e.races.length > 1 ? ` - Race #${index + 1}` : ''),
          description,
          points: s.points,
          raceIndexes: [index],
          carRestrictions: getCarRestrictions(e.id),
          isProgression: e.id.startsWith('G') && e.id.match(/_[en]$/) !== null
        })
      })
    }
  }

  for (const test of meta.licenses) {
    defineLicenseTestGold(test)
  }

  defineLicenseEarn({ idx: 0, letter: 'B', points: 5 })
  defineLicenseEarn({ idx: 1, letter: 'A', points: 5 })
  defineLicenseEarn({ idx: 2, letter: 'IB', points: 10 })
  defineLicenseEarn({ idx: 3, letter: 'IA', points: 10 })
  defineLicenseEarn({ idx: 4, letter: 'S', points: 25 })
  defineLicenseEarn({ idx: 5, letter: 'R', points: 10 })

  defineArcadeRaceWin()

  const rallyEventIds = meta.events
    .filter(e => /^D(?!r_)/.test(e.id))
    .map(e => e.id)

  for (const id of rallyEventIds) {
    defineRallyEventWin(id)
  }

  for (const timeTrial of meta.polyphony) {
    definePolyphonyTimeTrial(timeTrial)
  }

  for (const ch of meta.eventChallenges) {
    const e = meta.eventLookup[ch.eventId]
    const eventTitle = e.name + (e.inMultipleLeagues ? ` (${e.league.replace(' League', '')})` : '')
    const race = e.races[ch.raceIndexes - 1]
    const car = meta.carLookup[ch.carIds[0]]
    const r = race ? `race #${ch.raceIndexes}` : `any race`
    const t = race ? `, on ${meta.trackLookup[race.trackId].name}` : ``
    const description = `Win ${r} of ${eventTitle}${t}, while driving ${car.name}${ch.description}.`

    defineIndividualEventWin(e, {
      title: ch.title,
      description,
      points: ch.points,
      raceIndexes: ch.raceIndexes ? [ch.raceIndexes - 1] : e.races.map((_, i) => i),
      carRestrictions: ['are', ch.carIds],
      colorRestrictions: ch.colorRestriction ? [ch.colorRestriction] : [],
      expectedOpponents: ch.expectedOpponents,
      frontTiresExcludeId: ch.frontTiresExcludeId,
      rearTiresExcludeId: ch.rearTiresExcludeId,
    })
  }

  for (const ch of meta.timeTrials) {
    defineTimeTrial(ch)
  }

  set.addAchievement({
    title: 'Downforce Violations',
    description: 'With help from the Wheelie Glitch, win race #2 of Race of Turbo Sports (Professional League), on Test Course, while lapping all of your opponents at least three times.',
    points: 5,
    conditions: multiRegionalConditions(c => {
      return $(
        c.regionCheckPause,
        c.main1.c888_pauseIfNull,

        c.event.eventHashSumIs('Gturbo_h_0002'),

        c.main1.race.firstPlace,
        c.main1.race.finished,

        ...Array.from({ length: 5 }, (_, i) =>
          c.main1.car(i + 1)
            .lapsRemainingAreAtleast(3)
        )
      )
    })
  })

  return set
}

export const rich = RichPresence({
  lookupDefaultParameters: { keyFormat: 'hex' },
  lookup: {
    Car: {
      values: Object.values(meta.carLookup).reduce((prev, car) => {
        const sum32bit = getHashSum(car.id)

        if (prev[sum32bit]) {
          throw new Error('collision: ' + car.name)
        }
        prev[sum32bit] = car.name

        return prev
      }, {} as Record<number, string>)
    },
    Track: {
      values: Object.values(meta.trackLookup).reduce((prev, cur) => {
        prev[getHash(cur.id)[1]] = cur.name
        return prev
      }, {} as Record<number, string>)
    },
    Event: {
      values: meta.events.reduce((prev, cur) => {
        cur.races.forEach((s) => {
          const sum32bit = getHashSum(s.id)

          if (prev[sum32bit]) {
            throw new Error('collision: ' + s.id)
          }
          prev[sum32bit] = cur.name +
            (cur.inMultipleLeagues ? ` (${cur.league.replace(' League', '')})` : '')
        })

        return prev
      }, {} as Record<number, string>)
    },
    License: {
      values: meta.licenses.reduce((prev, cur) => {
        const sum32bit = getHashSum(cur.id)

        if (prev[sum32bit]) {
          throw new Error('collision: ' + cur.name)
        }
        prev[sum32bit] = `${cur.letter}-${cur.index} ${cur.name}`

        return prev
      }, {} as Record<number, string>)
    },
    MachineTest: {
      values: {
        0x19ad1830: '0 - 400m',
        0xd62c1830: '0 - 1000m',
        0x39b360d8: 'Max Speed',
      }
    },
    BestLicense: {
      keyFormat: 'hex',
      values: {
        [0xFF * 4]: ' [B]',
        [0xFF * 3]: ' [A]',
        [0xFF * 2]: ' [IB]',
        [0xFF * 1]: ' [IA]',
        0: ' [S]',
      }
    },
    License_R: { values: { 0: ' (R)' } },
  },
  displays: ({ lookup, macro }) => regions.flatMap(r => {
    const c = code[r]
    const regionFormatted = r.toUpperCase().replace('_', '-')

    // TODO: add league difficulty
    const ev = lookup.Event.at($(c.event.eventHashSumMeasured))
    const car = lookup.Car.at($(c.event.playerCar.hashSumMeasured))
    const track = lookup.Track.at($(c.event.trackHashMeasured))

    const laps = macro.Number.at(c.main1.lapCountMeasured)
    const lapCount = macro.Number.at(c.main1.totalLapsMeasured)

    const mileage = macro.Float1.at(c.stat.mileageMeasured) + (r === 'ntsc' ? ' mi' : ' km')
    const dayCount = macro.Number.at(c.stat.dayCountMeasured)

    // License Flags are 32-bit, 0xFFFFFFFF indicates it's not passed.
    // If you ignore least byte and sum most significant bytes -
    // you get the values specified in the BestLicense lookup
    const licenses = lookup.BestLicense.at(
      $(
        c.licenseIsPassed(7 + 8 * 0),
        c.licenseIsPassed(7 + 8 * 1),
        c.licenseIsPassed(7 + 8 * 2),
        c.licenseIsPassed(7 + 8 * 3),
        c.licenseIsPassed(7 + 8 * 4),
      )
        .map(c => c.with({
          flag: 'AddSource',
          lvalue: { size: '8bit', value: c.lvalue.value + 3 },
          cmp: '',
          rvalue: { type: '', size: '', value: 0 }
        }))
        .withLast({ flag: 'Measured' })
    ) + lookup.License_R.at($(
      c.licenseIsPassed(7 + 8 * 5).with({
        flag: 'Measured',
        lvalue: { size: '8bit', value: c.licenseIsPassed(7 + 8 * 5).lvalue.value + 3 },
        cmp: '',
        rvalue: { type: '', size: '', value: 0 }
      }),
    ))

    return [
      [
        $(
          c.regionCheck,
          orNext(
            c.event.nullCheck.with({ cmp: '=' }),
            c.event.inGame.withLast({ cmp: '=' })
          )
        ),
        `[🏠 ${regionFormatted} Home]${licenses} 📅 Day ${dayCount} | ${mileage}`
      ],
      [
        $(
          c.regionCheck,
          c.main1.c888_nullCheck,
          orNext(
            c.stat.eventStringFirstLettersAre('AE'),
            c.stat.eventStringFirstLettersAre('AN'),
            c.stat.eventStringFirstLettersAre('AH'),
            c.stat.eventStringFirstLettersAre('AP'),
          )
        ),
        `[🏁 Arcade Race] 📍 ${track} 🚗 ${car} | Lap ${laps}/${lapCount}`
      ],
      [
        $(
          c.regionCheck,
          orNext(
            c.stat.eventStringFirstLettersAre('AE'),
            c.stat.eventStringFirstLettersAre('AN'),
            c.stat.eventStringFirstLettersAre('AH'),
            c.stat.eventStringFirstLettersAre('AP'),
          )
        ),
        `[🏁 Arcade Race] 📍 ${track} 🚗 ${car}`
      ],
      [
        $(
          c.regionCheck,
          orNext(
            c.stat.eventStringFirstLettersAre('ATAF'),
          )
        ),
        `[⏱ Free Run] 📍 ${track} 🚗 ${car}`
      ],
      [
        $(
          c.regionCheck,
          orNext(
            c.stat.eventStringFirstLettersAre('AT'),
          )
        ),
        `[⏱ ${regionFormatted} Arcade Time Trial] 📍 ${track} 🚗 ${car}`
      ],
      [
        $(
          c.regionCheck,
          orNext(
            c.stat.eventStringFirstLettersAre('L'),
          )
        ),
        `[🔰 ${regionFormatted} License Center] ${lookup.License.at(c.event.eventHashSumMeasured)} 🚗 ${car}`
      ],
      [
        $(
          c.regionCheck,
          c.main1.c888_nullCheck,
          c.event.isQualifying,
          orNext(
            c.stat.eventStringFirstLettersAre('G'),
            c.stat.eventStringFirstLettersAre('E'),
          )
        ),
        `[🏁 ${ev}] 📍 ${track} 🚗 ${car} | Qualifying`
      ],
      [
        $(
          c.regionCheck,
          c.main1.c888_nullCheck,
          c.stat.eventStringFirstLettersAre('E'),
          c.main1.noLapsToComplete
        ),
        `[🏁 ${ev}] 📍 ${track} 🚗 ${car} | ⏱ ${macro.Seconds.at(c.main1.totalTimeMeasured)}`
      ],
      [
        $(
          c.regionCheck,
          c.main1.c888_nullCheck,
          orNext(
            c.stat.eventStringFirstLettersAre('G'),
            c.stat.eventStringFirstLettersAre('D'),
            c.stat.eventStringFirstLettersAre('E'),
          )
        ),
        `[🏁 ${ev}] 📍 ${track} 🚗 ${car} | Lap ${laps}/${lapCount}`
      ],
      [
        $(
          c.regionCheck,
          orNext(
            c.stat.eventStringFirstLettersAre('G'),
            c.stat.eventStringFirstLettersAre('D'),
            c.stat.eventStringFirstLettersAre('E'),
          )
        ),
        `[🏁 ${ev}] 📍 ${track} 🚗 ${car}`
      ],
      [
        $(
          c.regionCheck,
          orNext(
            c.stat.eventStringFirstLettersAre('M'),
          )
        ),
        `[⏱ Machine Test] ${lookup.MachineTest.at(c.event.eventHashHalfMeasured)} 🚗 ${car}`
      ],
    ] as Array<string | [ConditionBuilder, string]>
  }).concat('Playing Gran Turismo 3 A-Spec')
})
