// @ts-check
import { AchievementSet, define as $, orNext, ConditionBuilder, RichPresence, pauseIf, measuredIf, andNext, resetIf, trigger } from '@cruncheevos/core'

function inGameTimeFromStr(input) {
  const [minutes, seconds, msec] = input.split(/[:.]/).map(Number)
  const totalSec = minutes * 60 + seconds + (msec / 100)
  return Math.floor(totalSec * 300)
}

const trackMeta = {
  'Monte Carlo': {
    id: 0,
    tracks: [
      'St. Pierre-Entrevaux',
      'Thurriers',
      'Roquesteron',
      'Sisteron-Thoard',
      'Loda-Luceram',
      '',
      '',
    ],
    timeTrial: {
      Roquesteron: { time: '01:01.50', points: 5, evo: true }
    }
  },
  Sweden: {
    id: 1,
    tracks: ['Rammen', 'Sagen', 'Iz', 'Skogz', 'Mangen', 'Lugnet', ''],
    timeTrial: {
      Iz: { time: '04:10.00', points: 10, evo: true }
    }
  },
  Portugal: {
    id: 2,
    tracks: [
      'Piodao',
      'Cabreira',
      'Ponte de Lima - South',
      'Ponte de Lima - East',
      'Fafe',
      'Baltar',
      '',
    ],
    timeTrial: {
      'Ponte de Lima - South': { time: '01:43.00', points: 5, evo: true }
    }
  },
  Spain: {
    id: 3,
    tracks: [
      'Coll de Bracons',
      'La Trona',
      'Coll de Santigosa',
      'St. Julia-Arbucies',
      'La Riba',
      '',
      'Coll Roig',
    ],
    timeTrial: {
      'La Trona': { time: '02:20.00', points: 5, evo: true },
      'Coll Roig': { time: '03:00.00', points: 5, bonus: true }
    }
  },
  Argentina: {
    id: 4,
    tracks: [
      'Tanti',
      'San Augustin',
      'El Condor',
      'San Marcos Sierra',
      'Cura Brochero',
      '',
      'Las Bajadas',
    ],
    timeTrial: {
      'Tanti': { time: '01:13.00', points: 5, evo: true },
      'Las Bajadas': { time: '01:40.00', points: 5, bonus: true }
    }
  },
  Cyprus: {
    id: 5,
    tracks: [
      'Alassa-Agios Therapon',
      'Prastio-Pachina',
      'Platres-Katos Amiantos',
      'Machairas-Agioi Vavatsini',
      'Agios Nikalos-Foini',
      '',
      'Lageia-Kalavasos',
    ],
    timeTrial: {
      'Machairas-Agioi Vavatsini': { time: '01:58.30', points: 5, evo: true },
      'Lageia-Kalavasos': { time: '01:51.00', points: 5, bonus: true }
    }
  },
  Greece: {
    id: 6,
    tracks: [
      'Paleohori-Eleftherohori',
      'Palvliani',
      'Elastos',
      'Klidi',
      'Keneta',
      '',
      'Stromi-Inohori',
    ],
    timeTrial: {
      'Paleohori-Eleftherohori': { time: '01:25.20', points: 5, evo: true },
      'Stromi-Inohori': { time: '02:30.00', points: 5, bonus: true }
    }
  },
  Kenya: {
    id: 7,
    tracks: [
      'Marigat-Mogotio',
      'Kajiado-Olooloitikosh',
      'Olooloitikosh',
      'Morendat-Mbaruk',
      'Oltepsi-Olepolos',
      '',
      '',
    ],
    timeTrial: {
      Olooloitikosh: { time: '02:03.70', points: 5, evo: true },
    }
  },
  Finland: {
    id: 8,
    tracks: ['Ehikki', 'Moksi', 'Paijala', 'Valkola', 'Kuoltu', '', 'Vastila'],
    timeTrial: {
      Moksi: { time: '02:26.50', points: 5, evo: true },
      Vastila: { time: '03:23.00', points: 5, bonus: true }
    }
  },
  'New Zealand': {
    id: 9,
    tracks: [
      'Maungatawhiri',
      'Waipu Gorge',
      'Fyfe',
      'Campbell',
      'Paparoa Station',
      'Manukan',
      '',
    ],
    timeTrial: {
      Fyfe: { time: '03:42.50', points: 10, evo: true },
    }
  },
  Italy: {
    id: 10,
    tracks: [
      'Perinaldo',
      'Pantasina',
      'Apricale',
      'Rezzo',
      'Monte Ceppo',
      '',
      "Colle d'Oggia",
    ],
    timeTrial: {
      Apricale: { time: '03:45.00', points: 10, evo: true },
      "Colle d'Oggia": { time: '02:00.50', points: 5, bonus: true }
    }
  },
  France: {
    id: 11,
    tracks: [
      'Cuttoli-Peri',
      'Taverna - Pont de Ca',
      "Verro - Pont d'Azzana",
      'Filitosa-Bicchisan',
      'Noceta-Muracciole',
      '',
      '',
    ],
    timeTrial: {
      'Noceta-Muracciole': { time: '02:43.50', points: 5, evo: true },
    }
  },
  Australia: {
    id: 12,
    tracks: [
      'Newharvey Weir',
      'Newkevs',
      'Flynns Short',
      'Atkins',
      'Brunswick',
      'Langley Parks',
      '',
    ],
    timeTrial: {
      'Flynns Short': { time: '05:05.55', points: 10, evo: true },
    }
  },
  'Great Britain': {
    id: 13,
    tracks: [
      'Rhondda',
      'St. Gwynno',
      'Margam',
      'Trawscoed',
      'Tyle',
      'Cardiff',
      '',
    ],
    timeTrial: {
      'Tyle': {
        time: '03:34.70', points: 5, car: (r) => r === 'pal' ? 4 : 6,
        title: 'Mysterious Ford Driver at Dawn',
        description: 'Finish Great Britain SS5, Tyle in 03:34.70 or less as Ford Driver'
      },
    }
  },
}

/** @typedef {'pal' | 'ntsc'} Region */

/** @param {Region} r */
const codeFor = (r) => {
  const regionCheck = $(
    r === 'ntsc' && $.str('2041', (s, v) => $(['', 'Mem', s, 0x2247a6, '=', ...v])),
    r === 'pal' && $.str('5013', (s, v) => $(['', 'Mem', s, 0x230d66, '=', ...v])),
  )

  return {
    regionCheck,
    pauseIfRegionCheck: pauseIf(regionCheck.withLast({ cmp: '!=' })),

    main: (() => {
      const ptr = $.one(['AddAddress', 'Mem', '32bit', r === 'ntsc' ? 0x22dd84 : 0x23ba04])

      /** @param {'championship' | 'singleRally' | 'timeTrial'} mode */
      const gameModeIs = (mode) => {
        const modes = {
          championship: 0,
          singleRally: 1,
          timeTrial: 2
        }

        return $(
          ptr,
          ['', 'Mem', '32bit', 0xB4, '=', 'Value', '', modes[mode]]
        )
      }

      const isInGame = $(
        ptr,
        ['', 'Mem', '32bit', 0xC58, '=', 'Value', '', 0x77]
      )
      const isWatchingReplay = $(
        ptr,
        ['', 'Mem', '32bit', 0xC58, '=', 'Value', '', 0x75]
      )

      const cheat = {
        upsideDown: $(
          ptr,
          ['', 'Mem', '8bit', 0xC2C, '!=', 'Value', '', 0]
        ),
        evoPower: $(
          ptr,
          ['', 'Mem', '8bit', 0xC2D, '!=', 'Value', '', 0]
        ),
        highPitch: $(
          ptr,
          ['', 'Mem', '8bit', 0xC2E, '!=', 'Value', '', 0]
        ),
        underwater: $(
          ptr,
          ['', 'Mem', '8bit', 0xC2F, '!=', 'Value', '', 0]
        ),
        microMachines: $(
          ptr,
          ['', 'Mem', '8bit', 0xC30, '!=', 'Value', '', 0]
        ),
        stupid: $(
          ptr,
          ['', 'Mem', '8bit', 0xC31, '!=', 'Value', '', 0]
        ),
        ufoReplay: $(
          ptr,
          ['', 'Mem', '8bit', 0xC32, '!=', 'Value', '', 0]
        ),
        acid: $(
          ptr,
          ['', 'Mem', '8bit', 0xC33, '!=', 'Value', '', 0]
        ),
      }

      return {
        ptr,
        measured: {
          car: $(
            ptr,
            ['Measured', 'Mem', '32bit', 0xAC]
          ),
          gameMode: $(
            ptr,
            ['Measured', 'Mem', '32bit', 0xB4]
          ),
          country: $(
            ptr,
            ['Measured', 'Mem', '32bit', 0xB8]
          ),
          stageIndex: $(
            ptr,
            ['Measured', 'Mem', '32bit', 0xBC]
          ),
          calculatedStage: $(
            ptr,
            ['AddSource', 'Mem', '32bit', 0xB8, '*', 'Value', '', 7],
            ptr,
            ['Measured', 'Mem', '32bit', 0xBC]
          ),
          difficulty: $(
            ptr,
            ['Measured', 'Mem', '32bit', 0xCC]
          ),
          time: $(
            ptr,
            ['Measured', 'Mem', '32bit', 0x74, '/', 'Value', '', 3],
          )
        },

        cheat,

        gameModeIs,

        /** @param {'novice' | 'normal' | 'pro'} diff */
        difficultyIsAtleast: (diff) => {
          const difficulties = {
            normal: 1,
            pro: 2,
          }

          return $(
            ptr,
            ['', 'Mem', '32bit', 0xCC, diff === 'pro' ? '=' : '>=', 'Value', '', difficulties[diff]]
          )
        },

        pauseIfCheats: pauseIf(
          andNext(
            cheat.evoPower,
            gameModeIs('timeTrial')
          )
        ),

        cameraIs: i => $(
          ptr,
          ['', 'Mem', '32bit', 0x78, '=', 'Value', '', i]
        ),

        carIs: i => $(
          ptr,
          ['', 'Mem', '32bit', 0xAC, '=', 'Value', '', i]
        ),

        countryIdIs: i => $(
          ptr,
          ['', 'Mem', '32bit', 0xB8, '=', 'Value', '', i]
        ),
        stageIndexIs: i => $(
          ptr,
          ['', 'Mem', '32bit', 0xBC, '=', 'Value', '', i]
        ),

        isOnePlayer: $(
          ptr,
          ['', 'Mem', '32bit', 0x430, '=', 'Value', '', 1]
        ),
        areTwoPlayers: $(
          ptr,
          ['', 'Mem', '32bit', 0x430, '=', 'Value', '', 2]
        ),

        isInGame,
        isWatchingReplay,

        bailedIntoResultsPriorInGame: $(
          ptr,
          ['AndNext', 'Prior', '32bit', 0xC58, '=', 'Value', '', 0x75],
          ptr,
          ['', 'Mem', '32bit', 0xC58, '=', 'Value', '', 0x78]
        ),
        bailedFromRally: $(
          ptr,
          ['AndNext', 'Delta', '32bit', 0xC0, '!=', 'Value', '', 2],
          ptr,
          ['', 'Mem', '32bit', 0xC0, '=', 'Value', '', 2],
        ),
        movedIntoNextRallyFrom: id => $(
          ptr,
          ['AndNext', 'Delta', '32bit', 0xB8, '=', 'Value', '', id],
          ptr,
          ['AndNext', 'Mem', '32bit', 0xB8, '=', 'Value', '', id + 1],
          ptr,
          ['AndNext', 'Delta', '32bit', 0xBC, '=', 'Value', '', 4],
          ptr,
          ['', 'Mem', '32bit', 0xBC, '=', 'Value', '', 0],
        ),
        playerStartedStage: $(
          ptr,
          ['AndNext', 'Delta', '32bit', 0xD30, '=', 'Value', '', 5],
          ptr,
          ['', 'Mem', '32bit', 0xD30, '=', 'Value', '', 6],
        ),
        playerRestartedStageInGame: andNext(
          isInGame,

          // HACK: rely on alternate stage index, it's changed when stage loads,
          // if this flag didn't change, then 0xD30 below were reset in-game
          ptr,
          ['AddAddress', 'Mem', '32bit', 0x42C],
          ['AndNext', 'Delta', '32bit', 0xC, '=', 'Mem', '32bit', 0xC],

          ptr,
          ['AndNext', 'Delta', '32bit', 0xD30, '>=', 'Value', '', 6],
          ptr,
          ['', 'Mem', '32bit', 0xD30, '=', 'Value', '', 1],
        ),
        playerRestartedStageOnFinish: andNext(
          isWatchingReplay.withLast({ lvalue: { type: 'Delta' } }),
          isInGame
        ),
        playerWonRally: $(
          ptr,
          ['', 'Mem', '32bit', 0xAC, '=', 'Mem', '32bit', 0x1E4],
        ),
        playerLostRally: $(
          ptr,
          ['', 'Mem', '32bit', 0xAC, '!=', 'Mem', '32bit', 0x1E4],
        ),
        playerWonChampionship: $(
          ptr,
          ['', 'Mem', '32bit', 0xAC, '=', 'Mem', '32bit', 0x2E0],
        ),
        playerFinishedStage: $(
          ptr,
          ['AndNext', 'Delta', '32bit', 0xD30, '=', 'Value', '', 6],
          ptr,
          ['', 'Mem', '32bit', 0xD30, '=', 'Value', '', 7],
        ),
        playerFinishedStageWithTimeLte: time => $(
          ptr,
          ['', 'Mem', '32bit', 0x74, '<=', 'Value', '', time],
        ),
        shakedownIs: active => $(
          ptr,
          ['', 'Mem', '32bit', 0xC0, '=', 'Value', '', active],
        ),
        timerWentPast: time => $(
          ptr,
          ['AndNext', 'Delta', '32bit', 0xD34, '<=', 'Value', '', time],
          ptr,
          ['AndNext', 'Mem', '32bit', 0xD34, '>', 'Value', '', time],
          ptr,
          ['', 'Mem', '32bit', 0xD34, '<', 'Value', '', -8 * 300],
        ),

        isTransmission: transmission => $(
          ptr,
          ['AddAddress', 'Mem', '32bit', 0xC44],
          ['AddAddress', 'Mem', '32bit', 0x34],
          ['AddAddress', 'Mem', '32bit', 0x44],
          ['AddAddress', 'Mem', '32bit', 0x201C],
          ['', 'Mem', '8bit', 0x24, '=', 'Value', '', transmission],
        )
      }
    })()
  }
}

const c = {
  pal: codeFor('pal'),
  ntsc: codeFor('ntsc')
}

/** @param {(code: ReturnType<typeof codeFor>, region: Region) => any} cb */
function multiRegionalConditions(cb) {
  const res = [cb(c.ntsc, 'ntsc'), cb(c.pal, 'pal')]

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
    }
  }

  return {
    core: 'hcafe=hcafe',
    alt1: res[0],
    alt2: res[1],
  }
}

const set = new AchievementSet({ gameId: 19275, title: 'World Rally Championship' })

for (const [country, { id: countryId, tracks, timeTrial = {} }] of Object.entries(trackMeta)) {
  for (const difficulty of ['novice', 'pro']) {
    let title = `Rally ${country}` + (difficulty === 'novice' ? '' : ' - Pro')

    const difficultyDescription =
      difficulty === 'novice' ?
        `on Novice difficulty or higher` :
        'on Professional difficulty'
    const description = `Win Rally ${country} ` + difficultyDescription + ', in one sitting and with no restarts'

    set.addAchievement({
      title,
      description,
      points: 5,
      type: difficulty === 'novice' ? 'progression' : '',
      conditions: multiRegionalConditions(c => $(
        c.pauseIfRegionCheck,
        andNext(
          'once',
          orNext(
            c.main.gameModeIs('championship'),
            c.main.gameModeIs('singleRally'),
          ),
          difficulty === 'pro' && c.main.difficultyIsAtleast('pro'),
          c.main.countryIdIs(countryId),
          c.main.stageIndexIs(0),
          c.main.shakedownIs(0),
          c.main.isInGame,
          c.main.playerStartedStage
        ),
        resetIf(
          c.main.playerRestartedStageInGame,
          c.main.playerRestartedStageOnFinish,
          c.main.bailedFromRally
        ),

        resetIf(
          andNext(
            c.main.bailedIntoResultsPriorInGame,
            c.main.movedIntoNextRallyFrom(Number(countryId)),
            c.main.playerLostRally
          )
        ),

        trigger(
          c.main.bailedIntoResultsPriorInGame,
          c.main.movedIntoNextRallyFrom(Number(countryId)),
          c.main.playerWonRally
        )
      ))
    })
  }

  tracks.forEach((name, i) => {
    if (!name || i === 5) {
      return // no blanks or SSS
    }

    const iStr = i === 6 ? 'Bonus Stage' : `SS${i + 1}`

    set.addLeaderboard({
      title: `${country} ${iStr} - ${name}`,
      description: `Finish ${country} ${iStr} in least time`,
      lowerIsBetter: true,
      type: 'MILLISECS',
      conditions: {
        submit: '1=1',
        cancel: '0=1',
        start: multiRegionalConditions(c => $(
          c.pauseIfRegionCheck,
          c.main.pauseIfCheats,
          c.main.isOnePlayer,
          c.main.countryIdIs(countryId),
          c.main.shakedownIs(0),
          c.main.stageIndexIs(i),
          c.main.isInGame,
          c.main.playerFinishedStage,
        )),
        value: {
          core: $(
            measuredIf(c.ntsc.regionCheck),
            c.ntsc.main.measured.time
          ),
          alt1: $(
            measuredIf(c.pal.regionCheck),
            c.pal.main.measured.time
          ),
        },
      }
    })

    for (const e of Object.entries(timeTrial)) {
      if (name !== e[0]) {
        continue
      }

      const { time, points, evo, title, description, bonus, car } = e[1]
      const targetTime = inGameTimeFromStr(time)

      if (!evo) {
        set.addAchievement({
          title: title ? title : `${name}, ${country} Time Trial`,
          description:
            description ? description :
              bonus ? `Finish ${name} Bonus Stage in ${time} or less` :
                `Finish ${country} SS${i + 1}, ${name} in ${time} or less`,

          points,
          conditions: multiRegionalConditions((c, r) => $(
            c.pauseIfRegionCheck,
            c.main.pauseIfCheats,
            c.main.countryIdIs(countryId),
            c.main.stageIndexIs(i),
            car && c.main.carIs(car(r)),
            c.main.isInGame,
            c.main.playerFinishedStage,
            c.main.playerFinishedStageWithTimeLte(targetTime)
          ))
        })
      }

      if (evo) {
        set.addAchievement({
          title: `${country} EvoPower`,
          description:
            `Finish ${country} SS${i + 1}, ${name} in ${time} or less, ` +
            `with 'evopower' cheat enabled and automatic transmission`,
          points,
          conditions: multiRegionalConditions(c => $(
            c.pauseIfRegionCheck,
            andNext(
              'once',
              c.main.gameModeIs('timeTrial'),
              c.main.isOnePlayer,
              c.main.cheat.evoPower,
              c.main.isTransmission(0),
              c.main.countryIdIs(countryId),
              c.main.stageIndexIs(i),
              c.main.isInGame,
              c.main.playerStartedStage
            ),
            resetIf(
              c.main.isTransmission(0).withLast({ cmp: '!=' }),
              c.main.playerRestartedStageInGame,
              c.main.playerRestartedStageOnFinish,
              c.main.bailedFromRally,
              c.main.timerWentPast(targetTime)
            ),
            trigger(
              c.main.playerFinishedStage,
              c.main.playerFinishedStageWithTimeLte(targetTime)
            )
          ))
        })

        for (const gear of ['auto', 'man']) {
          const transmissionId = gear === 'auto' ? 0 : 2

          set.addLeaderboard({
            title: `[evo ${gear}] ${country} ${iStr} - ${name}`,
            description:
              `Finish ${country} ${iStr} in least time, with 'evopower' cheat ` +
              `and ${gear === 'auto' ? 'auto' : 'manual'} transmission`,
            lowerIsBetter: true,
            type: 'MILLISECS',
            conditions: {
              submit: '1=1',
              cancel: '0=1',
              start: multiRegionalConditions(c => $(
                c.pauseIfRegionCheck,
                andNext(
                  'once',
                  c.main.gameModeIs('timeTrial'),
                  c.main.isOnePlayer,
                  c.main.cheat.evoPower,
                  c.main.isTransmission(transmissionId),
                  c.main.countryIdIs(countryId),
                  c.main.stageIndexIs(i),
                  c.main.isInGame,
                  c.main.playerStartedStage
                ),
                resetIf(
                  c.main.isTransmission(transmissionId).withLast({ cmp: '!=' }),
                  c.main.playerRestartedStageInGame,
                  c.main.playerRestartedStageOnFinish,
                  c.main.bailedFromRally,
                ),
                c.main.playerFinishedStage,
              )),
              value: {
                core: $(
                  measuredIf(c.ntsc.regionCheck),
                  c.ntsc.main.measured.time
                ),
                alt1: $(
                  measuredIf(c.pal.regionCheck),
                  c.pal.main.measured.time
                ),
              },
            }
          })
        }
      }
    }
  })

  set.addLeaderboard({
    title: `Rally ${country}`,
    description: `Finish Rally ${country} in least time, in single session`,
    lowerIsBetter: true,
    type: 'MILLISECS',
    conditions: {
      submit: '1=1',
      cancel: '0=1',
      start: multiRegionalConditions(c => $(
        c.pauseIfRegionCheck,
        andNext(
          'once',
          orNext(
            c.main.gameModeIs('championship'),
            c.main.gameModeIs('singleRally'),
          ),
          c.main.countryIdIs(countryId),
          c.main.stageIndexIs(0),
          c.main.shakedownIs(0),
          c.main.isInGame,
          c.main.playerStartedStage
        ),
        resetIf(
          c.main.playerRestartedStageInGame,
          c.main.playerRestartedStageOnFinish,
          c.main.bailedFromRally
        ),

        c.main.bailedIntoResultsPriorInGame,
        c.main.movedIntoNextRallyFrom(Number(countryId))
      )),
      value: /** @type const */ (['ntsc', 'pal']).flatMap(region => {
        const c = codeFor(region)
        return Array.from({ length: 21 }, (_, i) => $(
          measuredIf(
            andNext(
              c.regionCheck,
              c.main.ptr,
              ['', 'Mem', '32bit', 0x1E4 + i * 0xC, '=', 'Mem', '32bit', 0xAC],
            )
          ),
          c.main.ptr,
          ['Measured', 'Mem', '32bit', 0x1E0 + i * 0xC, '/', 'Value', '', 3],
        ))
      }).reduce((prev, cur, i) => {
        prev[i === 0 ? 'core' : `alt${i}`] = cur
        return prev
      }, { core: '' })
    }
  })
}

set.addAchievement({
  title: 'Upside Down',
  description: `Finish any stage in Time Trial mode with 'ontheceiling' cheat enabled and 'downbelow' cheat disabled`,
  points: 1,
  conditions: multiRegionalConditions(c => $(
    c.pauseIfRegionCheck,
    c.main.gameModeIs('timeTrial'),
    c.main.isOnePlayer,
    c.main.isInGame,
    c.main.playerFinishedStage,
    c.main.cheat.upsideDown,
    c.main.cheat.microMachines.withLast({ cmp: '=' }),
  ))
})

set.addAchievement({
  title: 'Helium Aid',
  description: `Finish any stage in Time Trial mode with 'heliumaid' cheat enabled`,
  points: 1,
  conditions: multiRegionalConditions(c => $(
    c.pauseIfRegionCheck,
    c.main.gameModeIs('timeTrial'),
    c.main.isOnePlayer,
    c.main.isInGame,
    c.main.playerFinishedStage,
    c.main.cheat.highPitch
  ))
})

set.addAchievement({
  title: 'Underwater',
  description: `Finish any stage in Time Trial mode with 'wibblywobbly' cheat enabled`,
  points: 1,
  conditions: multiRegionalConditions(c => $(
    c.pauseIfRegionCheck,
    c.main.gameModeIs('timeTrial'),
    c.main.isOnePlayer,
    c.main.isInGame,
    c.main.playerFinishedStage,
    c.main.cheat.underwater
  ))
})

set.addAchievement({
  title: 'Micro WRC',
  description: `Finish any stage in Time Trial mode with 'downbelow' cheat enabled`,
  points: 1,
  conditions: multiRegionalConditions(c => $(
    c.pauseIfRegionCheck,
    c.main.gameModeIs('timeTrial'),
    c.main.isOnePlayer,
    c.main.isInGame,
    c.main.playerFinishedStage,
    c.main.cheat.microMachines
  ))
})

set.addAchievement({
  title: 'Weight Reduction',
  description: `Finish any stage in Time Trial mode with external camera and 'thatsstupid' cheat enabled`,
  points: 1,
  conditions: multiRegionalConditions(c => $(
    c.pauseIfRegionCheck,
    andNext(
      'once',
      c.main.gameModeIs('timeTrial'),
      c.main.isOnePlayer,
      c.main.isInGame,
      c.main.cheat.stupid,
      c.main.cameraIs(0),
      c.main.playerStartedStage
    ),
    resetIf(
      c.main.playerRestartedStageInGame,
      c.main.bailedFromRally,
      c.main.cameraIs(0).withLast({ cmp: '!=' }),
    ),
    trigger(
      c.main.playerFinishedStage
    )
  ))
})

set.addAchievement({
  title: 'Eye Test Bypass',
  description: `Finish any stage in Time Trial mode with 'imgoingcrazy' cheat enabled and 'wibblywobbly' cheat disabled`,
  points: 1,
  conditions: multiRegionalConditions(c => $(
    c.pauseIfRegionCheck,
    c.main.gameModeIs('timeTrial'),
    c.main.isOnePlayer,
    c.main.isInGame,
    c.main.playerFinishedStage,
    c.main.cheat.acid,
    c.main.cheat.underwater.withLast({ cmp: '=' }),
  ))
})

set.addAchievement({
  title: 'Unidentified Rally Car',
  description: `Watch the replay for some time after finishing any stage in Time Trial mode with 'floatylight' cheat enabled`,
  points: 1,
  conditions: multiRegionalConditions(c => $(
    c.pauseIfRegionCheck,
    c.main.gameModeIs('timeTrial'),
    c.main.isOnePlayer,
    c.main.isWatchingReplay,
    c.main.cheat.ufoReplay,
    c.main.timerWentPast(10 * 300)
  ))
})

export const rich = (() => {
  /** @type Region[] */
  const regions = ['ntsc', 'pal']

  return RichPresence({
    lookup: {
      GameMode: {
        values: {
          0: 'Championship',
          1: 'Single Rally',
          2: 'Time Trial'
        }
      },
      Car: {
        values: {
          0x00: 'Peugeot 206',
          0x01: 'Peugeot 206',
          0x02: 'Peugeot 206',
          0x03: 'Peugeot 206',
          0x04: 'Ford Focus',
          0x05: 'Ford Focus',
          0x06: 'Ford Focus',
          0x07: 'Subaru Impreza',
          0x08: 'Subaru Impreza',
          0x09: 'Subaru Impreza',
          0x0A: 'Subaru Impreza',
          0x0B: 'Mitsubishi Lancer',
          0x0C: 'Mitsubishi Lancer',
          0x0D: 'Hyundai Accent',
          0x0E: 'Hyundai Accent',
          0x0F: 'Hyundai Accent',
          0x10: 'Skoda Octavia',
          0x11: 'Skoda Octavia',
          0x12: 'Citroen Xsara',
          0x13: 'Citroen Xsara',
          0x14: 'Citroen Xsara',
        },
      },
      Country: {
        values: Object.fromEntries(
          Object.entries(trackMeta).map(([name, { id }]) => [id, name])
        )
      },
      Difficulty: {
        values: {
          0: 'Novice',
          1: 'Normal',
          2: 'Professional'
        }
      },
      CalculatedStage: {
        values: Object.fromEntries(
          Object.values(trackMeta).reduce((prev, cur) => {
            const countryOffset = cur.id * 7
            prev.push(
              ...cur.tracks
                .map((name, i) => [countryOffset + i, name])
                .filter(([_, name]) => name)
            )

            return prev
          }, []).concat([['*', '???']])
        )
      },
      Stage: {
        values: {
          0: 'SS1',
          1: 'SS2',
          2: 'SS3',
          3: 'SS4',
          4: 'SS5',
          5: 'SSS',
          6: 'Bonus Stage',
        }
      }
    },
    displays: ({ lookup, tag }) => regions.flatMap(r => {
      const c = codeFor(r)
      const atCar = lookup.Car.at(c.main.measured.car)
      const atGameMode = lookup.GameMode.at(c.main.measured.gameMode)
      const atCountry = lookup.Country.at(c.main.measured.country)
      const atStageIndex = lookup.Stage.at(c.main.measured.stageIndex)
      const atStageName = lookup.CalculatedStage.at(c.main.measured.calculatedStage)
      const atDifficulty = lookup.Difficulty.at(c.main.measured.difficulty)

      return /** @type Array<string | [ConditionBuilder, string]> */ ([
        [
          $(
            c.regionCheck,
            c.main.areTwoPlayers,
            c.main.gameModeIs('timeTrial')
          ),
          tag`Two Player Mode 📍 ${atCountry} ${atStageIndex} - ${atStageName}`
        ],
        [
          $(
            c.regionCheck,
            orNext(
              c.main.gameModeIs('championship'),
              c.main.gameModeIs('singleRally'),
            ),
            c.main.shakedownIs(1),
            orNext(
              c.main.isWatchingReplay,
              c.main.isInGame
            ),
          ),
          tag`${atGameMode} (${atDifficulty}) 📍 ${atCountry} Shakedown 🚗 ${atCar}`
        ],
        [
          $(
            c.regionCheck,
            orNext(
              c.main.gameModeIs('championship'),
              c.main.gameModeIs('singleRally'),
            ),
          ),
          tag`${atGameMode} (${atDifficulty}) 📍 ${atCountry} ${atStageIndex} - ${atStageName} 🚗 ${atCar}`
        ],
        [
          $(
            c.regionCheck,
            orNext(
              c.main.isWatchingReplay,
              c.main.isInGame
            ),
          ),
          tag`${atGameMode} 📍 ${atCountry} ${atStageIndex} - ${atStageName} 🚗 ${atCar}`
        ],
      ])
    }).concat('Playing World Rally Championship')
  })
})()

export default set

