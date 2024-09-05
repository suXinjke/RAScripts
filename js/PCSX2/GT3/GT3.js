// @ts-check
import codegen, { getHash } from './codegen.js'
import {
  AchievementSet, define as $, ConditionBuilder,
  addHits, andNext, orNext, resetIf, trigger, pauseIf, measuredIf,
  RichPresence
} from '@cruncheevos/core'

/**
 * @template T
 * @typedef {T extends (Record <string, infer U>) ? U : never} ObjectValue
 * **/

/**
 * @template T
 * @typedef {T extends (infer U)[] ? U : never} ArrayValue
 * **/

function overflow(num = 0) {
  num = Number(num)

  while (num > 0xFFFFFFFF) {
    num -= (0xFFFFFFFF + 1)
  }

  return num
}

function getHashSum(str = '') {
  const [half1, half2] = getHash(str)
  return overflow(half1 + half2)
}

const set = new AchievementSet({ gameId: 2830, title: 'Gran Turismo 3: A-Spec' })

export const meta = await codegen()

/** @typedef {'ntsc' | 'pal' | 'ntsc_j'} Region */
/** @typedef {['none' | 'are' | 'not', string[]]} CarRestriction */

/** @type Record<string, CarRestriction> */
const carRestrictions = {}
function getCarRestrictions(eventName = '') {
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

/** @param {Region} region */
const codeFor = (region) => {
  const offset = (a = 0) => {
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

      const base_c888_offset = (a = 0) => {
        if (region === 'ntsc_j' && a > 0xA400) return a - 0x3014
        if (region === 'ntsc_j' && a > 0xA000) return a - 0x3010

        return a
      }

      const car = (index = 0) => {
        const offset = index * 0x16DC

        return {
          wentOut() {
            const tireCombos = [
              [0x10D0, 0x1174, 0x1218],
              [0x10D0, 0x1174, 0x12BC],
              [0x10D0, 0x1218, 0x12BC],
              [0x1174, 0x1218, 0x12BC],
            ]

            /** @type {ConditionBuilder[]} */
            const offTrackLimits = []

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

          lapsRemainingAreAtleast: laps => $(
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

        lastLapTimeIsLt: (msec = 0) => $(
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
            $.str('@fin', (s, v,) => $(
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

      const car = (index = 0) => {
        const offset = index * 0x2160

        return {
          // For the cars, half of the hash are all distinct except for collisions:
          // R32 '91 , R32 '98
          // Altezza AS200, Altezza RS200
          hashIs: (str = '') => $(
            base,
            ['', 'Mem', '32bit', offset + 0x900, '=', 'Value', '', getHash(str)[1]]
          ),
          hashIsNot: (str = '') => $(
            base,
            ['', 'Mem', '32bit', offset + 0x900, '!=', 'Value', '', getHash(str)[1]]
          ),
          hashSumMeasured: $(
            base,
            ['AddSource', 'Mem', '32bit', offset + 0x900],
            base,
            ['Measured', 'Mem', '32bit', offset + 0x900 + 0x4],
          ),
          colorIdIs: (id = 0) => $(
            base,
            ['', 'Mem', '32bit', offset + 0x908, '=', 'Value', '', id]
          ),

          frontTireHashIs(str = '') {
            const [left, right] = getHash(str)
            return $(
              base,
              ['AndNext', 'Mem', '32bit', offset + 0x958, '=', 'Value', '', right],
              base,
              ['', 'Mem', '32bit', offset + 0x958 + 0x4, '=', 'Value', '', left],
            )
          },

          rearTireHashIs(str = '') {
            const [left, right] = getHash(str)
            return $(
              base,
              ['AndNext', 'Mem', '32bit', offset + 0x960, '=', 'Value', '', right],
              base,
              ['', 'Mem', '32bit', offset + 0x960 + 0x4, '=', 'Value', '', left],
            )
          },

          turbineHashIs(str = '') {
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
        eventHashIs(str = '') {
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
        eventHashSumIs(str = '') {
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
        trackHashIs: (str = '') => $(
          base,
          ['', 'Mem', '32bit', 0x30, '=', 'Value', '', getHash(str)[1]]
        ),
        trackHashMeasured: $(
          base,
          ['Measured', 'Mem', '32bit', 0x30]
        ),

        car,
        playerCar: car(0),
        /** @param {CarRestriction} re */
        applyCarRestrictons(re, inverted = false) {
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

        eventStringFirstLettersAre(letter = '') {
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
        arcadeRaceClassIs: (carClass = '') => $.str(carClass, (s, v) => $(
          base,
          ['', 'Mem', s, 0x3080C + 2, '=', ...v],
        ))
      }
    })(),

    licenseFlagUp(idx = 0) {
      const addr = offset(0x978430) + 0x154 * idx
      return $(
        ['AndNext', 'Delta', '32bit', addr, '=', 'Value', '', -1],
        ['', 'Mem', '32bit', addr, '<=', 'Value', '', 2]
      )
    },
    licenseIsPassed(idx = 0) {
      const addr = offset(0x978430) + 0x154 * idx
      return $.one(['', 'Mem', '32bit', addr, '<=', 'Value', '', 2])
    }
  }
}

const code = {
  ntsc: codeFor('ntsc'),
  pal: codeFor('pal'),
  ntsc_j: codeFor('ntsc_j'),
}

/** @param {(code: ReturnType<typeof codeFor>, region: Region) => any} cb */
function multiRegionalConditions(cb) {
  const res = [cb(code.ntsc, 'ntsc'), cb(code.pal, 'pal'), cb(code.ntsc_j, 'pal')]

  if (res[0].core) {
    let count = 1
    const ret = {
      core: res[0].core
    }

    for (const bunch of res) {
      for (const group of Object.values(bunch).slice(1)) {
        ret[`alt${count}`] = group
        count++
      }
    }

    return ret
  }

  if (Array.isArray(res[0]) && res[0].length === 1) {
    return {
      core: res[0],
      alt1: res[1],
      alt2: res[2],
      alt3: res[3],
    }
  }

  return {
    core: 'hcafe=hcafe',
    alt1: res[0],
    alt2: res[1],
    alt3: res[2],
  }
}

/** @param {(code: ReturnType<typeof codeFor>, region: Region) => any} cb */
function multiRegionalConditionsArray(cb) {
  return [cb(code.ntsc, 'ntsc'), cb(code.pal, 'pal'), cb(code.ntsc_j, 'pal')]
}

/** @param {ArrayValue<typeof meta["licenses"]>} l */
function defineLicenseTestGold(l) {
  set.addAchievement({
    title: `License ${l.letter}-${l.index} - Gold`,
    description: `Earn the gold reward in license test ${l.letter}-${l.index} - ${l.name}`,
    points: l.points,
    badge: b(`license_${l.letter}_${l.index}`, {
      task: 'licenseGold',
      text: `${l.letter}-${l.index}`
    }),
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

function defineLicenseEarn({ idx = 0, letter = '', points = 0 }) {
  const earnedLicense = multiRegionalConditions(cb => $(
    cb.regionCheckPause,
    cb.event.nullCheck, // TODO: remove
    cb.event.inGame,
    cb.licenseFlagUp(7 + idx * 8)
  ))

  const licenseTitle = letter === 'R' ? 'Rally' : letter

  set.addAchievement({
    title: `${licenseTitle} License Graduate`,
    description: `Earn bronze reward or better in all ${licenseTitle} License tests, ` +
      `or pass all tests in one sitting if you already have the license.`,
    points,
    type: (letter !== 'R' && letter !== 'S') ? 'progression' : undefined,
    conditions: {
      ...multiRegionalConditions(c => {
        const licenses = meta.licenseLookupByLetter[letter]

        return $(
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
        )
      }),
      alt4: earnedLicense.alt1,
      alt5: earnedLicense.alt2,
      alt6: earnedLicense.alt3,
    }
  })
}

/** @param {ArrayValue<typeof meta["events"]>} e */
function defineChampionshipWin(e) {
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
    badge: b(e.id, e.inMultipleLeagues ? {
      task: 'eventRegular',
      event: e
    } : {
      task: 'copy',
      inputFileName: e.idWithoutDifficulty
    }),
    type: e.id.match(/_[en]$/) ? 'progression' : undefined,
    conditions: multiRegionalConditions(c => $(
      c.regionCheckPause,

      andNext(
        'once',
        c.event.eventHashIs(e.races[0].id),
        c.event.inGame,
        c.stat.inChampionship
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
    ))
  })
}

/** @param {ArrayValue<typeof meta["events"]>} e */
function defineEventInOneSession(e) {
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
    badge: b(e.id, e.inMultipleLeagues ? {
      task: 'eventRegular',
      event: e
    } : {
      task: 'copy',
      inputFileName: e.idWithoutDifficulty
    }),
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

/**
 * @param {ArrayValue<typeof meta["events"]>} e
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.description
 * @param {number} params.points
 * @param {number[]} [params.raceIndexes]
 * @param {string} [params.badge]
 * @param {boolean} [params.isProgression]
 * @param {CarRestriction} [params.carRestrictions]
 * @param {number[]} [params.colorRestrictions]
 * @param {string} [params.expectedOpponents]
 * @param {string} [params.frontTiresExcludeId]
 * @param {string} [params.rearTiresExcludeId]
 * */
function defineIndividualEventWin(e, {
  title,
  description,
  points,
  raceIndexes = [],
  badge,
  carRestrictions,
  colorRestrictions = [],
  isProgression,
  expectedOpponents = '',
  frontTiresExcludeId,
  rearTiresExcludeId
}) {
  const opponentCarIds = expectedOpponents.split(',').filter(Boolean)

  set.addAchievement({
    title,
    description,
    points,
    badge,
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

function defineRallyEventWin(id = '') {
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
      badge: b(regular.idWithoutDifficulty + difficultiesShort[i], {
        task: 'eventRegular',
        event: {
          ...regular,
          id: idWithDifficultySuffix,
          inMultipleLeagues: true
        },
      }),
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

  /** @type Record<string, string[]> */
  const areaTracks = {
    A: ['super', 'midfield', 'smtnorth', 'smtsouth', 'trialmt', 'r_midfield'],
    B: ['r_smtnorth', 'akasaka', 'grandvalley', 'laguna', 'rome', 'tahitidirt'],
    C: ['r_smtsouth', 'r_trialmt', 'deepforest', 'route5_dry', 'seattle', 'testcourse'],
    D: ['r_akasaka', 'r_grandvalley', 'r_rome', 'r_tahitidirt', 'tahitimaze', 'apricot'],
    E: ['route11', 'r_deepforest', 'r_route5_dry', 'r_seattle', 'montecarlo'],
    F: ['route5', 'r_apricot', 'r_route11', 'r_tahitimaze', 'r_route5'],
  }

  for (const area of areas) {
    const tracks = areaTracks[area]
    const difficulty = [false, true]

    for (const isHard of difficulty) {
      const difficultyComment = isHard ? 'Hard' : 'Normal or higher'
      set.addAchievement({
        title: `Arcade Area ${area}` + (isHard ? ' (Spicy)' : ''),
        description: `Win every Arcade Race in Area ${area} whilst also` +
          ` scoring a win in each Car Class on ${difficultyComment} difficulty, in one sitting.` +
          ` Using cars from your Garage is not allowed.`,
        points: 10,
        type: isHard ? '' : 'progression',
        conditions: multiRegionalConditions(c => {
          const carClasses = ['CT', 'BT', 'AT', 'ST']
            .concat(area !== 'E' ? ['AD'] : [])
          return $(
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
          )
        })
      })
    }
  }
}

/** @param {ArrayValue<typeof meta["polyphony"]>} e */
function definePolyphonyTimeTrial(e) {
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

/** @param {ArrayValue<typeof meta["timeTrials"]>} e */
function defineTimeTrial(e) {
  const trackName = meta.trackLookup[e.trackId].name
  const carName = meta.carLookup[e.carId].name

  /** @param {ReturnType<typeof codeFor>} c */
  const startingConditions = (c) => {

    return $(
      c.event.eventHashIs('ATAF0001'),
      c.event.trackHashIs(e.trackId),
      c.event.applyCarRestrictons(['are', [e.carId]]),
      e.frontTiresId && c.event.playerCar.frontTireHashIs(e.frontTiresId),
      e.rearTiresId && c.event.playerCar.rearTireHashIs(e.rearTiresId),
      e.turbineId && c.event.playerCar.turbineHashIs(e.turbineId),
      c.main1.newLap,
      c.main1.noReplay
    )
  }

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
    badge: b(`car_${e.carId}`, {
      task: 'copy',
      inputFileName: `car_${e.carId}`
    }),
    conditions: multiRegionalConditions((c) => {
      return $(
        c.regionCheckPause,
        c.main1.c888_pauseIfNull,
        c.main1.c888_pauseIfChange,
        c.main1._8_pauseIfNull,

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
      )
    }),
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

        startingConditions(c)
      )),
      cancel: (() => {
        const handsShakingFromHowBadThisIs = []
        handsShakingFromHowBadThisIs.push(
          ...multiRegionalConditionsArray(c => $(
            c.regionCheck,
            c.main1.playerCar.crashed(e.crashSensitivity)
          )),
          ...multiRegionalConditionsArray(c => $(
            c.regionCheck,
            c.main1.inReplayMode
          ))
        )

        if (e.isRally === false) {
          handsShakingFromHowBadThisIs.push(
            ...code.ntsc.main1.playerCar.wentOut().arrayOfAlts.map(x => $(code.ntsc.regionCheck, x)),
            ...code.pal.main1.playerCar.wentOut().arrayOfAlts.map(x => $(code.pal.regionCheck, x)),
            ...code.ntsc_j.main1.playerCar.wentOut().arrayOfAlts.map(x => $(code.ntsc_j.regionCheck, x))
          )
        }

        return {
          core: '1=1',
          ...handsShakingFromHowBadThisIs.reduce((prev, cur, i) => {
            prev[`alt${i + 1}`] = cur
            return prev
          }, {})
        }
      })(),
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

function makeSet() {
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
          isProgression: e.id.startsWith('G') && e.id.match(/_[en]$/) !== null,
          badge: b(e.id + `_${index + 1}`, e.races.length > 1 ? {
            task: 'eventRegular',
            index: index + 1,
            event: e
          } : {
            task: 'copy',
            inputFileName: e.idWithoutDifficulty
          })
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
    description: 'With help from the Wheelie Glitch, win any Professional League event on Test Course while lapping all of your opponents at least three times.',
    points: 5,
    conditions: multiRegionalConditions(c => {
      return $(
        c.regionCheckPause,
        c.main1.c888_pauseIfNull,

        orNext(
          c.event.eventHashSumIs('Ggtworld_h_1006'),
          c.event.eventHashSumIs('Gturbo_h_0002'),
          c.event.eventHashSumIs('Ggtallstar_h_1004'),
          c.event.eventHashSumIs('Gjgtc_h_1003'),
          c.event.eventHashSumIs('Gdream_h_0701'),
          c.event.eventHashSumIs('Gwind_h_0001'),
          c.event.eventHashSumIs('Gf1_h_1006'),
        ),

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

export default makeSet

export const rich = (() => {
  return RichPresence({
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
        }, {})
      },
      Track: {
        values: Object.values(meta.trackLookup).reduce((prev, cur) => {
          prev[getHash(cur.id)[1]] = cur.name
          return prev
        }, {})
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
        }, {})
      },
      License: {
        values: meta.licenses.reduce((prev, cur) => {
          const sum32bit = getHashSum(cur.id)

          if (prev[sum32bit]) {
            throw new Error('collision: ' + cur.name)
          }
          prev[sum32bit] = `${cur.letter}-${cur.index} ${cur.name}`

          return prev
        }, {})
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
    displays: ({ lookup, macro }) => {
      /** @param {Region} region */
      function displayForRegion(region) {
        const c = code[region]

        const regionFormatted = region.toUpperCase().replace('_', '-')

        // TODO: add league difficulty
        const ev = lookup.Event.at($(c.event.eventHashSumMeasured))
        const car = lookup.Car.at($(c.event.playerCar.hashSumMeasured))
        const track = lookup.Track.at($(c.event.trackHashMeasured))

        const laps = macro.Number.at(c.main1.lapCountMeasured)
        const lapCount = macro.Number.at(c.main1.totalLapsMeasured)

        const mileage = macro.Float1.at(c.stat.mileageMeasured) + (region === 'ntsc' ? ' mi' : ' km')
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
              lvalue: { size: '8bit', },
              cmp: '',
              rvalue: { type: '', size: '', value: 0 }
            }))
            .withLast({ flag: 'Measured' })
        ) + lookup.License_R.at($(
          c.licenseIsPassed(7 + 8 * 5).with({
            flag: 'Measured',
            lvalue: { size: '8bit', },
            cmp: '',
            rvalue: { type: '', size: '', value: 0 }
          }),
        ))

        return /** @type Array<[ConditionBuilder, string]> */ ([
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
        ])
      }

      return [
        ...displayForRegion('ntsc'),
        ...displayForRegion('pal'),
        ...displayForRegion('ntsc_j'),
        'Playing Gran Turismo 3 A-Spec'
      ]
    }
  })
})()

/**
 * @typedef {Object} IconCopyTask
 * @property {'copy'} task
 * @property {string} inputFileName
 */

/**
 * @typedef {Object} IconEventRegularTask
 * @property {'eventRegular'} task
 * @property {ArrayValue<typeof meta["events"]>} event
 * @property {number} [index]
 */

/**
 * @typedef {Object} IconLicenseGoldTask
 * @property {'licenseGold'} task
 * @property {string} text
 */

/** @typedef {IconCopyTask | IconEventRegularTask | IconLicenseGoldTask} IconTask */

/** @type Record<string, IconTask> */
const iconTasks = {}

/**
 * @param {string} str
 * @param {IconTask} [task]
 */
function b(str = '', task) {
  if (process.argv.includes('icongen') === false) {
    return undefined
  }

  str = `local\\\\${str}.png`

  if (iconTasks[str]) {
    throw new Error('icon collision: ' + str)
  }

  iconTasks[str] = task

  return str
}

if (process.argv.includes('icongen')) {
  const fs = await import('fs')
  const path = await import('path')
  const { createCanvas, registerFont, Image } = await import('canvas')


  const iconDirPath = path.join(import.meta.dirname, 'icons')
  registerFont(path.join(iconDirPath, 'font.otf'), { family: 'SecretFont' })

  if (!process.env.RACACHE) {
    process.env.RACACHE = fs.readFileSync('./.env').toString().replace('RACACHE=', '')
  }

  const imgCache = {

    /** @returns {import('canvas').Image} */
    read(filePath = '') {
      if (this[filePath]) {
        return this[filePath]
      }
      const img = new Image()
      img.src = fs.readFileSync(path.join(iconDirPath, filePath))

      return this[filePath] = img
    }
  }

  const outputPath = path.join(process.env.RACACHE, 'RACache/Badge')
  const canvas = createCanvas(64, 64)
  const ctx = canvas.getContext('2d')

  /** @param {IconEventRegularTask} task  */
  function drawEventRegular(task) {
    const img = imgCache.read(task.event.idWithoutDifficulty + '.png')
    ctx.drawImage(img, 0, 0, 64, 64)

    if (task.index) {
      ctx.save()

      ctx.globalAlpha = 0.9
      ctx.font = 'italic bold 16px Arial'
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowColor = 'rgba(0, 0, 0, 1)'
      ctx.shadowBlur = 1.5
      ctx.fillStyle = 'white'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'alphabetic'

      const pad = -2
      ctx.fillText(task.index.toString(), 64 + pad, 64 + pad)

      ctx.restore()
    }

    if (task.event.inMultipleLeagues) {
      ctx.globalAlpha = 1
      const difficultyColors = {
        '_e': 'rgba(0, 128, 0,    0.7)',
        '_n': 'rgba(30, 144, 255, 0.7)',
        '_h': 'rgba(255, 0, 0,    0.7)',
      }

      const color = difficultyColors[task.event.id.slice(-2)]
      const gradient = ctx.createLinearGradient(0, 0, 48, 0);
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 4)
    }

    return canvas.toBuffer()
  }

  function drawLicenseGold(text = '') {
    const goldCup = imgCache.read('license-gold.png')

    ctx.fillStyle = '#0031cf'
    ctx.fillRect(0, 0, 64, 64)

    ctx.font = `32px "SecretFont"`
    ctx.fillStyle = '#f0fea2'
    ctx.strokeStyle = '#f0fea2'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'

    const b = ctx.measureText(text)
    const textWidth = b.actualBoundingBoxRight - b.actualBoundingBoxLeft
    ctx.fillText(text, 32 - textWidth / 2, 22)

    const circleCoords = /** @type {const} */ ([32, 46])
    const cupCoords = /** @type {const} */ ([circleCoords[0] - 12, circleCoords[1] - 12])

    ctx.beginPath();
    ctx.arc(...circleCoords, 14, 0, 2 * Math.PI);
    ctx.fillStyle = 'black'
    ctx.fill();

    ctx.drawImage(goldCup, ...cupCoords)

    return canvas.toBuffer()
  }

  for (const [outputFileName, task] of Object.entries(iconTasks)) {
    if (task.task === 'copy') {
      fs.copyFileSync(
        path.join(iconDirPath, task.inputFileName + '.png'),
        path.join(outputPath, outputFileName)
      )
      continue
    }

    ctx.clearRect(0, 0, 64, 64)
    ctx.save()
    const buf = (() => {
      if (task.task === 'eventRegular') return drawEventRegular(task)
      if (task.task === 'licenseGold') return drawLicenseGold(task.text)
    })()
    ctx.restore()

    fs.writeFileSync(path.join(outputPath, outputFileName), buf)
  }
}