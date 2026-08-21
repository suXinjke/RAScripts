import { AchievementSet, define as $, RichPresence, andNext, orNext, resetIf, trigger, once } from '@cruncheevos/core'
import { mapNumberedObject } from '../common.ts'

function convertTime(a: string) {
  const [min, sec, csec] = a.split(/[:\.]/).map(Number)
  return (min * 60 + sec) * 100 + csec
}

const carDriverIds: Record<number, string> = {
  0x00: 'Peugeot 206, R. Burns',
  0x01: 'Peugeot 206, M. Gronholm',
  0x02: 'Peugeot 206, G. Panizzi',
  0x03: 'Peugeot 206, H. Rovanpera',
  0x04: 'Ford Focus, C. Sainz',
  0x05: 'Ford Focus, M. Martin',
  0x06: 'Ford Focus, F. Duval',
  0x07: 'Mitsubishi Lancer, F. Delecour',
  0x08: 'Mitsubishi Lancer, A. McRae',
  0x09: 'Subaru Impreza, T. Makinen',
  0x0A: 'Subaru Impreza, P. Solberg',
  0x0B: 'Subaru Impreza, T. Arai',
  0x0C: 'Skoda Octavia, K. Eriksson',
  0x0D: 'Skoda Octavia, T. Gardemeister',
  0x0E: 'Skoda Octavia, R. Kresta',
  0x0F: 'Skoda Octavia, S. Blomqvist',
  0x10: 'Hyundai Accent, A. Schwarz',
  0x11: 'Hyundai Accent, F. Loix',
  0x12: 'Citroen Xsara, T. Radstrom',
  0x13: 'Citroen Xsara, S. Loeb',
  0x14: 'Citroen Xsara, P. Bugalski',
  0x15: 'Peugeot 206 X, R. Burns',
  0x16: 'Peugeot 206 X, M. Gronholm',
  0x17: 'Peugeot 206 X, G. Panizzi',
  0x18: 'Peugeot 206 X, H. Rovanpera',
  0x19: 'Ford Focus X, C. Sainz',
  0x1A: 'Ford Focus X, M. Martin',
  0x1B: 'Ford Focus X, F. Duval',
  0x1C: 'Mitsubishi Lancer X, F. Delecour',
  0x1D: 'Mitsubishi Lancer X, A. McRae',
  0x1E: 'Subaru Impreza X, T. Makinen',
  0x1F: 'Subaru Impreza X, P. Solberg',
  0x20: 'Subaru Impreza X, T. Arai',
  0x21: 'Skoda Octavia X, K. Eriksson',
  0x22: 'Skoda Octavia X, T. Gardemeister',
  0x23: 'Skoda Octavia X, R. Kresta',
  0x24: 'Skoda Octavia X, S. Blomqvist',
  0x25: 'Hyundai Accent X, A. Schwarz',
  0x26: 'Hyundai Accent X, F. Loix',
}

const carIds = {
  'Peugeot 206': { shortName: 'P206', ids: [0x00, 0x01, 0x02, 0x03] },
  'Ford Focus': { shortName: 'Focus', ids: [0x04, 0x05, 0x06] },
  'Mitsubishi Lancer': { shortName: 'Lancer', ids: [0x07, 0x08] },
  'Subaru Impreza': { shortName: 'Impreza', ids: [0x09, 0x0A, 0x0B] },
  'Skoda Octavia': { shortName: 'Octavia', ids: [0x0C, 0x0D, 0x0E, 0x0F] },
  'Hyundai Accent': { shortName: 'Accent', ids: [0x10, 0x11] },
  'Citroen Xsara': { shortName: 'Xsara', ids: [0x12, 0x13, 0x14] },
}

const trackIds: Record<number, string> = {
  0x03: `Selonnet/Turriers`,
  0x04: `Puget-Theniers/Toudon`,
  0x05: `Pont de Clans/Villars-sur-Var`,
  0x06: `Turriers/Selonnet`,
  0x07: `Toudon/Puget-Theniers`,
  0x08: `Villars-sur-Var/Pont de Clans`,
  0x09: `Puget-Theniers/Toudon 2`,
  0x0a: `Turini/La Bollene`,
  0x0b: `La Bollene/Turini`,
  0x0e: `Fredriksberg`,
  0x0f: `Lejen`,
  0x10: `Vargasen`,
  0x11: `Fredriksberg R`,
  0x12: `Lejen R`,
  0x13: `Vargasen R`,
  0x14: `Lejen 2`,
  0x15: `Hagfors`,
  0x16: `Hagfors R`,
  0x19: `Ocana/Radicale`,
  0x1a: `Petreto/Ampaza`,
  0x1b: `Gare de Carbuccia/Gare d'Ucciani`,
  0x1c: `Radicale/Ocana`,
  0x1d: `Ampaza/Petreto`,
  0x1e: `Gare d'Ucciani/Gare de Carbuccia`,
  0x1f: `Petreto/Ampaza 2`,
  0x20: `Vero/Pont D'Azzana`,
  0x21: `Pont D'Azanna/Vero`,
  0x24: `Ruidecanyes`,
  0x25: `Viladrau`,
  0x26: `Escaladei`,
  0x27: `Ruidecanyes R`,
  0x28: `Viladrau R`,
  0x29: `Escaladei R`,
  0x2a: `Viladrau 2`,
  0x2b: `Vallfogona`,
  0x2c: `Vallfogona R`,
  0x2f: `Platres/Kato Amiantos`,
  0x30: `Lagoudera/Kapouras`,
  0x31: `Prastio/Pachna`,
  0x32: `Kato Amiantos/Platres`,
  0x33: `Kapouras/Lagoudera`,
  0x34: `Pachna/Prastio`,
  0x35: `Lagoudera/Kapouras 2`,
  0x36: `Kourdali/Spilia`,
  0x37: `Spilia/Kourdali`,
  0x3a: `Capilla del Monte`,
  0x3b: `San Marcos Sierra`,
  0x3c: `Cosquin`,
  0x3d: `Capilla del Monte R`,
  0x3e: `San Marcos Sierra R`,
  0x3f: `Cosquin R`,
  0x40: `San Marcos Sierra 2`,
  0x41: `Complejo Pro-Racing`,
  0x42: `Complejo Pro-Racing R`,
  0x45: `Karoutes`,
  0x46: `Amlissa`,
  0x47: `Rengini`,
  0x48: `Karoutes R`,
  0x49: `Amlissa R`,
  0x4a: `Rengini R`,
  0x4b: `Amlissa 2`,
  0x4c: `Inohori`,
  0x4d: `Inohori R`,
  0x50: `Orien`,
  0x51: `Maili Tisa`,
  0x52: `Nyaru`,
  0x53: `Orien R`,
  0x54: `Maili Tisa R`,
  0x55: `Nyaru R`,
  0x56: `Maili Tisa 2`,
  0x57: `Mogotio`,
  0x58: `Mogotio R`,
  0x5b: `Lankamaa`,
  0x5c: `Mokkipera`,
  0x5d: `Talviainen`,
  0x5e: `Lankamaa R`,
  0x5f: `Mokkipera R`,
  0x60: `Talviainen R`,
  0x61: `Mokkipera 2`,
  0x62: `Killeri`,
  0x63: `Killeri R`,
  0x66: `Trier`,
  0x67: `Dhrontal`,
  0x68: `Peterberg`,
  0x69: `Trier R`,
  0x6a: `Dhrontal R`,
  0x6b: `Peterberg R`,
  0x6c: `Dhrontal 2`,
  0x6d: `St. Wendel`,
  0x6e: `St. Wendel R`,
  0x71: `San Romolo`,
  0x72: `Molini`,
  0x73: `Langan`,
  0x74: `San Romolo R`,
  0x75: `Molini R`,
  0x76: `Langan R`,
  0x77: `Molini 2`,
  0x78: `San Bernardo`,
  0x79: `San Bernardo R`,
  0x7c: `Te Akau North`,
  0x7d: `Papatapu`,
  0x7e: `Te Hutewai`,
  0x7f: `Te Akau South`,
  0x80: `Papatapu R`,
  0x81: `Te Hutewai R`,
  0x82: `Papatapu 2`,
  0x83: `Manukau Super`,
  0x84: `Manukau Super R`,
  0x87: `Helena North`,
  0x88: `Beraking`,
  0x89: `Stirling West`,
  0x8a: `Helena South`,
  0x8b: `Beraking R`,
  0x8c: `Stirling East`,
  0x8d: `Beraking 2`,
  0x8e: `Langley Park`,
  0x8f: `Langley Park R`,
  0x92: `Crychan`,
  0x93: `Brechfa`,
  0x94: `Resolfen`,
  0x95: `Crychan R`,
  0x96: `Brechfa R`,
  0x97: `Resolfen R`,
  0x98: `Brechfa 2`,
  0x99: `Cardiff Docks`,
  0x9a: `Cardiff Docks R`,
  0x9b: `X-1`,
  0x9c: `X-2`,
  0x9d: `X-3`
}

const countryIds = {
  0: 'Monte Carlo',
  1: 'Sweden',
  2: 'France',
  3: 'Spain',
  4: 'Cyprus',
  5: 'Argentina',
  6: 'Greece',
  7: 'Kenya',
  8: 'Finland',
  9: 'Germany',
  10: 'Italy',
  11: 'New Zealand',
  12: 'Australia',
  13: 'United Kingdom',
  15: 'Bonus'
}

const rallies = {
  0: {
    pro: [0x06, 0x05, 0x07, 0x03, 0x04, 0x0a],
    ex: [0x0b, 0x04, 0x08, 0x03, 0x07, 0x09, 0x06, 0x05, 0x0a],
  },
  1: {
    pro: [0x11, 0x10, 0x12, 0x0e, 0x0f, 0x15],
    ex: [0x16, 0x0f, 0x13, 0x0e, 0x12, 0x14, 0x11, 0x10, 0x15],
  },
  2: {
    pro: [0x1c, 0x1b, 0x1d, 0x19, 0x1a, 0x20],
    ex: [0x21, 0x1a, 0x1e, 0x19, 0x1d, 0x1f, 0x1c, 0x1b, 0x20],
  },
  3: {
    pro: [0x27, 0x26, 0x28, 0x24, 0x25, 0x2b],
    ex: [0x2c, 0x25, 0x29, 0x24, 0x28, 0x2a, 0x27, 0x26, 0x2b],
  },
  4: {
    pro: [0x32, 0x31, 0x33, 0x2f, 0x30, 0x36],
    ex: [0x37, 0x30, 0x34, 0x2f, 0x33, 0x35, 0x32, 0x31, 0x36],
  },
  5: {
    pro: [0x3d, 0x3c, 0x3e, 0x3a, 0x3b, 0x41],
    ex: [0x42, 0x3b, 0x3f, 0x3a, 0x3e, 0x40, 0x3d, 0x3c, 0x41],
  },
  6: {
    pro: [0x48, 0x47, 0x49, 0x45, 0x46, 0x4c],
    ex: [0x4d, 0x46, 0x4a, 0x45, 0x49, 0x4b, 0x48, 0x47, 0x4c],
  },
  7: {
    pro: [0x53, 0x52, 0x54, 0x50, 0x51, 0x57],
    ex: [0x58, 0x51, 0x55, 0x50, 0x54, 0x56, 0x53, 0x52, 0x57],
  },
  8: {
    pro: [0x5e, 0x5d, 0x5f, 0x5b, 0x5c, 0x62],
    ex: [0x63, 0x5c, 0x60, 0x5b, 0x5f, 0x61, 0x5e, 0x5d, 0x62],
  },
  9: {
    pro: [0x69, 0x68, 0x6a, 0x66, 0x67, 0x6d],
    ex: [0x6e, 0x67, 0x6b, 0x66, 0x6a, 0x6c, 0x69, 0x68, 0x6d],
  },
  10: {
    pro: [0x74, 0x73, 0x75, 0x71, 0x72, 0x78],
    ex: [0x79, 0x72, 0x76, 0x71, 0x75, 0x77, 0x74, 0x73, 0x78],
  },
  11: {
    pro: [0x7f, 0x7e, 0x80, 0x7c, 0x7d, 0x83],
    ex: [0x84, 0x7d, 0x81, 0x7c, 0x80, 0x82, 0x7f, 0x7e, 0x83],
  },
  12: {
    pro: [0x8a, 0x89, 0x8b, 0x87, 0x88, 0x8e],
    ex: [0x8f, 0x88, 0x8c, 0x87, 0x8b, 0x8d, 0x8a, 0x89, 0x8e],
  },
  13: {
    pro: [0x95, 0x94, 0x96, 0x92, 0x93, 0x99],
    ex: [0x9a, 0x93, 0x97, 0x92, 0x96, 0x98, 0x95, 0x94, 0x99],
  },
  15: {
    pro: [0x9b, 0x9c, 0x9d],
    ex: [0x9b, 0x9c, 0x9d],
  },
}

function getTrackInfoById(trackId: number, expert: boolean) {
  for (const [rallyId, obj] of Object.entries(rallies)) {
    const tracks = expert ? obj.ex : obj.pro
    const trackIndex = tracks.findIndex(x => x === trackId)
    if (trackIndex !== -1) {
      return { rallyId: Number(rallyId), trackIndex }
    }
  }

  throw new Error(`failed to find info for ${trackId}`)
}

const c = (() => {
  const gameModeSelectedFromMainMenuIs = (x: number) => $(
    ['AddAddress', 'Mem', '32bit', 0x264a10],
    ['', 'Mem', '8bit', 0x180, '=', 'Value', '', x],
  )
  const measuredGameModeSelectedFromMainMenu = $(
    ['AddAddress', 'Mem', '32bit', 0x264a10],
    ['Measured', 'Mem', '8bit', 0x180],
  )

  const gameModeIs = (x: number) => $.one(['', 'Mem', '8bit', 0x28a7d6, '=', 'Value', '', x])

  const bailedFromInGame = $(
    ['AndNext', 'Mem', '32bit', 0x264c40, '!=', 'Delta', '32bit', 0x264c40],
    ['', 'Mem', '32bit', 0x264c40, '=', 'Value', '', 0],
  )

  const stage = (idx?: number) => {
    let base = $(
      ['AddAddress', 'Mem', '32bit', 0x28a7e0, '*', 'Value', '', 0x20],
      ['AddAddress', 'Mem', '32bit', 0x28a850]
    )

    if (typeof idx === 'number') {
      base = $(['AddAddress', 'Mem', '32bit', 0x28a850 + 0x20 * idx])
    }

    return {
      countryIdIs: (id: number) => $(
        base,
        ['', 'Mem', '8bit', 0x00, '=', 'Value', '', id]
      ),
      stageIdIs: (id: number) => $(
        base,
        ['', 'Mem', '8bit', 0x04, '=', 'Value', '', id]
      ),

      countryIdMeasured: $(
        base,
        ['Measured', 'Mem', '8bit', 0x00]
      ),
      stageIdMeasured: $(
        base,
        ['Measured', 'Mem', '8bit', 0x04]
      ),
    }
  }

  const player = (idx?: number) => {
    return {
      stat: (() => {
        let base = $(
          ['AddAddress', 'Mem', '8bit', 0x28ccd8, '*', 'Value', '', 0x418],
          ['AddAddress', 'Mem', '32bit', 0x28ccec]
        )

        if (typeof idx === 'number') {
          base = $(
            ['AddAddress', 'Mem', '32bit', 0x28ccec + idx * 0x418],
          )
        }

        return {
          crossedStart: $(
            base,
            ['', 'Mem', '32bit', 0x18, '>', 'Value', '', 0]
          ),
          didntCrossStartYet: $(
            base,
            ['', 'Mem', '32bit', 0x18, '=', 'Value', '', 0]
          ),
          rallyTimeIncreased: $(
            base,
            ['', 'Mem', '32bit', 0x38, '>', 'Delta', '32bit', 0x38],
          ),
          atFirstPlace: $(
            base,
            ['', 'Mem', '32bit', 0x3c, '=', 'Value', '', 0],
          ),

          stageFinishTimeMeasured: $(
            base,
            ['AddSource', 'Mem', '32bit', 0x14], // Penalty
            base,
            ['Measured', 'Mem', '32bit', 0x2C]
          ),
          rallyTimeMeasured: $(
            base,
            ['Measured', 'Mem', '32bit', 0x38]
          ),

          finishTimeIsLessOrEqualThan: (x: string) => $(
            base,
            ['AddSource', 'Mem', '32bit', 0x14], // Penalty
            base,
            ['', 'Mem', '32bit', 0x2C, '<=', 'Value', '', convertTime(x)]
          ),

          inGame: (() => {
            const base2 = $(
              base,
              ['AddAddress', 'Mem', '32bit', 0x8],
              ['AddAddress', 'Mem', '32bit', 0x14c]
            )

            return {
              startedStage: andNext(
                base2,
                ['', 'Mem', '8bit', 0x10, '=', 'Value', '', 0],
                base2,
                ['', 'Delta', '8bit', 0x1C, '=', 'Value', '', 1],
                base2,
                ['', 'Mem', '8bit', 0x1C, '=', 'Value', '', 2],
              ),

              restartedStage: andNext(
                base2,
                ['', 'Delta', '8bit', 0x1C, '=', 'Value', '', 2],
                base2,
                ['', 'Mem', '8bit', 0x1C, '=', 'Value', '', 1],
              ),

              finishedStage: andNext(
                base2,
                ['', 'Mem', '8bit', 0x10, '=', 'Value', '', 0],
                base2,
                ['', 'Mem', '8bit', 0x1C, '=', 'Value', '', 3],
                base2,
                ['', 'Delta', '8bit', 0x1C, '=', 'Value', '', 2],
              ),
            }
          })()
        }
      })(),

      car: (() => {
        let base = $(
          ['AddAddress', 'Mem', '8bit', 0x28ccd8, '*', 'Value', '', 0x418],
          ['Measured', 'Mem', '32bit', 0x28cd8c]
        )

        if (typeof idx === 'number') {
          base = $(
            ['Measured', 'Mem', '32bit', 0x28cd8c + idx * 0x418],
          )
        }

        return {
          isWRC: base.withLast({ flag: '', cmp: '<=', rvalue: ['Value', '', 0x14] }),
          isExtreme: base.withLast({ flag: '', cmp: '>', rvalue: ['Value', '', 0x14] }),
          is: (...ids: number[]) => orNext(
            ...ids.map(id =>
              base.withLast({ flag: '', cmp: '=', rvalue: ['Value', '', id] })
            )
          ),
          idMeasured: base
        }
      })()
    }
  }

  const rally = (() => {
    const rallyIdx = $.one(['AddAddress', 'Mem', '32bit', 0x28a788, '*', 'Value', '', 0x178])
    const offset = 0x28a7e0

    const currentTrackBase = $(
      rallyIdx,
      ['AddSource', 'Mem', '32bit', offset, '*', 'Value', '', 0x20],
      rallyIdx.with({ flag: 'Remember' }),
      ['AddAddress', 'Value', '', 0x28a850, '+', 'Recall'],
      ['AddAddress', 'Mem', '32bit', 0x0],
    )

    return {
      stageIdxIs: (x: number) => $(
        rallyIdx,
        ['', 'Mem', '32bit', offset, '=', 'Value', '', x]
      ),
      countryIdIs: (id: number) => $(
        rallyIdx,
        ['', 'Mem', '8bit', offset + 0x4, '=', 'Value', '', id]
      ),
      countryIdIsNot: (id: number) => $(
        rallyIdx,
        ['', 'Mem', '8bit', offset + 0x4, '!=', 'Value', '', id]
      ),
      isNotShakedown: $(
        rallyIdx,
        ['', 'Mem', '32bit', offset + 0x34, '=', 'Value', '', 0]
      ),
      isLastStage: $(
        rallyIdx,
        ['SubSource', 'Mem', '32bit', offset],
        rallyIdx,
        ['', 'Mem', '32bit', offset + 0x8, '=', 'Value', '', 1],
      ),

      trackIdIs: (id: number) => $(
        currentTrackBase,
        ['', 'Mem', '8bit', 0x04, '=', 'Value', '', id]
      ),

      countryIdMeasured: $(
        rallyIdx,
        ['Measured', 'Mem', '8bit', offset + 0x4]
      ),
      stageIdxMeasured: $(
        rallyIdx,
        ['Measured', 'Mem', '32bit', offset]
      ),
      trackIdMeasured: $(
        currentTrackBase,
        ['Measured', 'Mem', '8bit', 0x04]
      )
    }
  })()

  return {
    difficultyIs: (x: number) => $.one(
      ['', 'Mem', '8bit', 0x28ccd5, '=', 'Value', '', x]
    ),
    difficultyIsAtleast: (x: number) => $(
      x === 2 && ['', 'Mem', '8bit', 0x28ccd5, '=', 'Value', '', 2],
      x <= 1 && ['', 'Mem', '8bit', 0x28ccd5, '>=', 'Value', '', x],
    ),
    measuredGameModeSelectedFromMainMenu,

    gameModeSelectedFromMainMenuIs,
    bailedFromInGame,
    isInMainMenu: gameModeSelectedFromMainMenuIs(6),

    gameModeIs: {
      quickRace: andNext(
        gameModeSelectedFromMainMenuIs(6),
        gameModeIs(2),
      ),
      timeTrial: andNext(
        gameModeSelectedFromMainMenuIs(1),
        gameModeIs(2),
      ),
      timeTrialLike: andNext(
        gameModeSelectedFromMainMenuIs(4).withLast({ cmp: '!=' }),
        gameModeIs(2),
      ),
      headToHead: gameModeSelectedFromMainMenuIs(4),
      challengeWRC: gameModeIs(3),
      rallyLike: orNext(
        gameModeSelectedFromMainMenuIs(0), // custom rally
        gameModeSelectedFromMainMenuIs(2), // custom champ
      ).andNext(
        gameModeSelectedFromMainMenuIs(3), // WRC
        gameModeIs(1).with({ cmp: '<=' }), // WRC (0) AND Custom Rally / Champ (1)
      ),
      rallyLikeDefaultTracks: andNext(
        gameModeSelectedFromMainMenuIs(0).withLast({ cmp: '!=' }),
        gameModeIs(1).with({ cmp: '<=' }),
      ),

      isNotHeadToHead: gameModeSelectedFromMainMenuIs(4).withLast({ cmp: '!=' }),

      replayPrior: gameModeSelectedFromMainMenuIs(5).withLast({ lvalue: { type: 'Prior' } })
    },

    rally,

    timeTrial: (() => {
      const base = $.one(['AddAddress', 'Mem', '32bit', 0x28a850])

      return {
        countryIdIs: (id: number) => $(
          base,
          ['', 'Mem', '8bit', 0x00, '=', 'Value', '', id]
        ),
        stageIdIs: (id: number) => $(
          base,
          ['', 'Mem', '8bit', 0x04, '=', 'Value', '', id]
        ),
        countryIdMeasured: $(
          base,
          ['Measured', 'Mem', '8bit', 0x00]
        ),
        stageIdMeasured: $(
          base,
          ['Measured', 'Mem', '8bit', 0x04]
        ),
      }
    })(),

    isGettingReady: andNext(
      ['', 'Mem', '32bit', 0x28ccec, '!=', 'Value', '', 0],
      ['', 'Mem', '32bit', 0x264c40, '=', 'Value', '', 0],
    ),
    isInGame: $.one(['', 'Mem', '32bit', 0x264c40, '!=', 'Value', '', 0]),

    playerCurrent: player(),
    player1: player(0),
    playerIdxMeasured: $.one(['Measured', 'Mem', '32bit', 0x28ccd8]),

    difficultyMeasured: $.one(['Measured', 'Mem', '8bit', 0x28ccd5]),

    isSinglePlayer: orNext(
      ['', 'Mem', '32bit', 0x28ccd0, '=', 'Value', '', 1],
      ['', 'Mem', '32bit', 0x28ccdc, '=', 'Value', '', 1]
    ),

    // does not account for head-to-head
    isMultiPlayer: andNext(
      ['', 'Mem', '32bit', 0x28ccd0, '!=', 'Value', '', 1],
      ['', 'Mem', '32bit', 0x28ccdc, '!=', 'Value', '', 1]
    ),

    noKangarooCheat: $.one(['', 'Mem', '8bit', 0x28f670, '=', 'Value', '', 0]),
    noSataliteCheat: $.one(['', 'Mem', '8bit', 0x28f672, '=', 'Value', '', 0]),
    noNitroCheat: $.one(['', 'Mem', '8bit', 0x28f673, '=', 'Value', '', 0]),
    noGravityCheat: $.one(['', 'Mem', '8bit', 0x28f674, '=', 'Value', '', 0]),
    noFFCheat: $.one(['', 'Mem', '8bit', 0x28f676, '=', 'Value', '', 0]),
    noFRCheat: $.one(['', 'Mem', '8bit', 0x28f677, '=', 'Value', '', 0]),

    noIllegalCheatsActive: orNext(
      gameModeIs(2).with({ cmp: '!=' }),
      ['AddSource', 'Mem', '8bit', 0x28f670], // Kangaroo
      ['AddSource', 'Mem', '8bit', 0x28f672], // Satalite
      ['AddSource', 'Mem', '8bit', 0x28f673], // Car boost
      ['AddSource', 'Mem', '8bit', 0x28f674], // Low Gravity
      ['AddSource', 'Mem', '8bit', 0x28f676], // FF car
      ['AddSource', 'Mem', '8bit', 0x28f677], // FR car
      ['', 'Value', '', 0, '=', 'Value', '', 0],
    ),

    player1FinishedRally: andNext(
      bailedFromInGame,
      player(0).stat.rallyTimeIncreased,
      rally.isLastStage
    ),

    player1WonRally: andNext(
      bailedFromInGame,
      player(0).stat.rallyTimeIncreased,
      player(0).stat.atFirstPlace,
      rally.isLastStage
    ),
  }
})()

const set = new AchievementSet({ gameId: 26629, title: 'WRC II Extreme' })

const startedRallyOnExpert = (countryId: number) => andNext(
  c.isSinglePlayer,
  c.difficultyIsAtleast(2),
  c.gameModeIs.rallyLikeDefaultTracks,
  c.rally.countryIdIs(countryId),
  c.rally.stageIdxIs(0),
  c.isInGame,
  c.player1.stat.inGame.startedStage
)

for (let id = 0; id <= 13; id++) {
  const countryName = countryIds[id]

  set.addAchievement({
    title: `Rally ${countryName}`,
    description: `Win Rally ${countryName} in WRC or Custom Championship mode on Professional difficulty or higher`,
    points: 10,
    type: 'progression',
    conditions: $(
      c.isSinglePlayer,
      c.difficultyIsAtleast(1),
      c.gameModeIs.rallyLikeDefaultTracks,
      c.rally.countryIdIs(id),

      c.player1WonRally,
    )
  })

  set.addAchievement({
    title: `Rally ${countryName} - Expert`,
    description: `Win Rally ${countryName} in WRC or Custom Championship mode on Expert difficulty, in one sitting from start to finish`,
    points: 25,
    conditions: $(
      once(
        startedRallyOnExpert(id)
      ),

      trigger(c.player1WonRally),

      resetIf(
        c.rally.countryIdIsNot(id),
        c.isInMainMenu
      )
    )
  })

  for (const expert of [false, true]) {
    const difficultyAbbr = expert ? 'EX' : 'Pro'
    const difficulty = expert ? 'Expert' : 'Professional'

    const tracks = rallies[id][expert ? 'ex' : 'pro']
    for (let i = 0; i < tracks.length; i++) {
      const trackId = tracks[i]
      const trackName = trackIds[trackId]
      const ss = `SS${i + 1}`

      set.addLeaderboard({
        title: `${countryName} ${difficultyAbbr} ${ss} - ${trackName}`,
        description: `Finish ${countryName} ${ss} in least time with regular WRC car, on ${difficulty} difficulty`,
        lowerIsBetter: true,
        type: 'MILLISECS',
        conditions: {
          start: $(
            c.gameModeIs.isNotHeadToHead,
            c.difficultyIs(expert ? 2 : 1),
            c.rally.trackIdIs(trackId),
            c.rally.isNotShakedown,
            c.isInGame,
            c.playerCurrent.car.isWRC,
            c.noIllegalCheatsActive,

            c.playerCurrent.stat.inGame.finishedStage,
          ),
          cancel: '0=1',
          submit: '1=1',
          value: c.playerCurrent.stat.stageFinishTimeMeasured,
        },
      })
    }
  }

  set.addLeaderboard({
    title: `Rally ${countryName} EX`,
    description: `Finish Rally ${countryName} in least time on Expert difficulty in one sitting from start to finish`,
    lowerIsBetter: true,
    type: 'MILLISECS',
    conditions: {
      start: $(
        once(
          startedRallyOnExpert(id)
        ),

        c.player1FinishedRally,

        resetIf(
          c.rally.countryIdIsNot(id),
          c.isInMainMenu
        )
      ),
      cancel: '0=1',
      submit: '1=1',
      value: c.playerCurrent.stat.rallyTimeMeasured,
    },
  })
}

interface TimeTrial {
  title: string
  stage: number
  difficulty: number,
  time: string
  points?: number
  fr?: boolean
  ff?: boolean
  extreme?: boolean
}

const timeTrials: TimeTrial[] = [
  {
    title: 'Grippy',
    stage: 0x69, // germany trier R
    difficulty: 1,
    time: '01:44.00',
    ff: true
  },
  {
    title: 'Untitled Rally Achievement',
    stage: 0x51, // kenya maili tisa
    difficulty: 1,
    time: '03:34.00',
    ff: true
  },
  {
    title: 'Hairpin Art',
    stage: 0x06, // monaco Turriers/Selonnet
    difficulty: 1,
    time: '02:45.00',
    fr: true
  },
  {
    title: 'Fight Against the Inertia',
    stage: 0x48, // greece Karoutes R
    difficulty: 1,
    time: '03:22.50',
    points: 10,
    fr: true
  },

  {
    title: 'Permanent Spine Damage',
    stage: 0x9b, // X-1
    difficulty: 2,
    time: '02:27.00',
    extreme: true
  },
  {
    title: 'Extremely Boring Bonus',
    stage: 0x9c, // X-2
    difficulty: 2,
    time: '01:04.00'
  },
  {
    title: 'WRC Tricky',
    stage: 0x9d, // X-3
    difficulty: 2,
    time: '01:28.30',
    points: 5,
    extreme: true
  },

  {
    title: 'Epic Sweden',
    stage: 0x10, // sweden vargasen
    difficulty: 2,
    time: '04:56.00',
    extreme: true
  },
  {
    title: 'Extreme France',
    stage: 0x21, // france Pont D'Azanna/Vero
    difficulty: 2,
    time: '01:54.50',
    points: 5,
    extreme: true
  },
  {
    title: 'Epic Finland',
    stage: 0x5f, // finland mokkiperra R
    difficulty: 2,
    time: '03:37.00',
    extreme: true
  },
  {
    title: 'Epic Germany',
    stage: 0x68, // germany peterberg
    difficulty: 2,
    time: '03:58.00',
    extreme: true
  },
  {
    title: 'Extreme New Zealand',
    stage: 0x7c, // new zealand Te Akau North
    difficulty: 2,
    time: '01:56.80',
    points: 5,
    extreme: true
  },
  {
    title: 'Epic Australia',
    stage: 0x8c, // australia stirling east
    difficulty: 2,
    time: '05:05.00',
    extreme: true
  },
  {
    title: 'Epic UK',
    stage: 0x98, // UK brechfa 2
    difficulty: 2,
    time: '03:33.33',
    extreme: true
  },
]

for (const t of timeTrials) {
  const trackName = trackIds[t.stage]

  const { rallyId, trackIndex } = getTrackInfoById(t.stage, t.extreme)
  const countryName = countryIds[rallyId]
  const difficulty = t.difficulty === 2 ? 'Expert' : 'Professional'
  const carTitle = t.extreme ? 'any Extreme WRC car' : 'any regular WRC car'

  const points = t.points || (t.extreme ? 10 : 5)

  let track = `SS${trackIndex + 1} - ${trackName}`
  if (rallyId === 15) track = trackName

  function makeDescription(leaderboard: boolean) {
    const time = leaderboard ? 'least time' : `${t.time} or less`

    let description =
      `Finish ${countryName} ${track} ` +
      `on ${difficulty} difficulty in ${time} with ${carTitle}`

    if (t.ff) description += ' and NOREAR cheat active'
    if (t.fr) description += ' and PUSHME cheat active'

    return description
  }

  const preConditions = $(
    c.gameModeIs.timeTrialLike,
    c.difficultyIs(t.difficulty),
    c.timeTrial.stageIdIs(t.stage),
    c.isInGame,
    t.extreme && c.playerCurrent.car.isExtreme,
    !t.extreme && c.playerCurrent.car.isWRC,

    c.noKangarooCheat,
    c.noSataliteCheat,
    c.noNitroCheat,
    c.noGravityCheat,
    !t.ff ? c.noFFCheat : c.noFFCheat.with({ cmp: '!=' }),
    !t.fr ? c.noFRCheat : c.noFRCheat.with({ cmp: '!=' }),
  )

  set.addAchievement({
    title: t.title,
    description: makeDescription(false),
    points,
    conditions: $(
      preConditions,

      trigger(c.playerCurrent.stat.inGame.finishedStage),
      c.playerCurrent.stat.finishTimeIsLessOrEqualThan(t.time),
    )
  }).addLeaderboard({
    title: t.title,
    description: makeDescription(true),
    lowerIsBetter: true,
    type: 'MILLISECS',
    conditions: {
      start: $(
        preConditions,
        c.playerCurrent.stat.inGame.finishedStage
      ),
      cancel: '0=1',
      submit: '1=1',
      value: c.playerCurrent.stat.stageFinishTimeMeasured,
    },
  })
}

for (const [carName, { shortName, ids }] of Object.entries(carIds)) {
  set.addAchievement({
    title: `${shortName} Tryouts`,
    description: `Win any Rally in WRC or Custom Championship mode on any difficulty with ${carName}`,
    points: 3,
    conditions: $(
      c.isSinglePlayer,
      c.gameModeIs.rallyLikeDefaultTracks,
      c.player1WonRally,
      c.player1.car.is(...ids)
    )
  })
}

set.addAchievement({
  title: 'Does This Remind You of Anything?',
  description: 'Finish a stage in Quick Rally or Time Trial mode with SATALITE camera cheat enabled, OSD (HUD) disabled and Co-Driver muted',
  points: 1,
  conditions: $(
    c.gameModeIs.timeTrialLike,
    c.isInGame,

    andNext(
      'once',
      c.playerCurrent.stat.inGame.startedStage,
      ['', 'Mem', '8bit', 0x28f672, '!=', 'Value', '', 0], // top down camera cheat
    ),

    trigger(c.playerCurrent.stat.inGame.finishedStage),
    resetIf(
      c.bailedFromInGame,
      andNext(
        c.playerCurrent.stat.crossedStart,
        ['AddAddress', 'Mem', '32bit', 0x00264d0c],
        ['', 'Mem', '32bit', 0x5e25c, '!=', 'Value', '', 2], // is not top down camera after start
      ),
      ['', 'Mem', '8bit', 0x28f61f, '<', 'Value', '', 2], // OSD is on
      ['', 'Mem', '32bit', 0x28f640, '>', 'Value', '', 0], // co driver is not muted
    )
  )
})

set.addAchievement({
  title: 'Star Guitar',
  description: 'Finish a stage in Quick Rally or Time Trial mode with at least two of these cheats enabled: DISCO, MOBLUR, SWAY',
  points: 1,
  conditions: $(
    c.gameModeIs.timeTrialLike,
    c.isInGame,

    trigger(c.playerCurrent.stat.inGame.finishedStage),

    ['AddSource', 'Mem', '8bit', 0x28f679], // disco
    ['AddSource', 'Mem', '8bit', 0x28f67a], // moblur
    ['AddSource', 'Mem', '8bit', 0x28f67c], // sway
    ['', 'Value', '', 0, '>=', 'Value', '', 2],
  )
})


export const rich = RichPresence({
  lookup: {
    CarId: { values: mapNumberedObject(carDriverIds, v => v.split(',')[0]) },
    DriverId: { values: mapNumberedObject(carDriverIds, v => v.split(',')[1].trim()) },
    TrackId: { values: trackIds },
    CountryId: { values: countryIds },
    Difficulty: { values: { 0: 'Novice', 1: 'Pro', 2: 'Expert' } },
    Gamemode: { values: { 0: 'Custom Rally', 2: 'Custom Championship', 3: 'WRC' } }
  },
  displays: ({ lookup, tag, macro }) => {
    const atCurrentCountry = lookup.CountryId.at(c.rally.countryIdMeasured)
    const atCurrentStageIndex = `SS` + macro.Number.at(
      c.rally.stageIdxMeasured.withLast({ cmp: '+', rvalue: ['Value', '', 1] })
    )
    const atCurrentStage = lookup.TrackId.at(c.rally.trackIdMeasured)

    const atQuickCountry = lookup.CountryId.at(c.timeTrial.countryIdMeasured)
    const atQuickStage = lookup.TrackId.at(c.timeTrial.stageIdMeasured)

    const atCar = lookup.CarId.at(c.player1.car.idMeasured)
    const atCarMP = lookup.CarId.at(c.playerCurrent.car.idMeasured)

    const atDriver = lookup.DriverId.at(c.player1.car.idMeasured)
    const atDriverMP = lookup.DriverId.at(c.playerCurrent.car.idMeasured)

    const atDifficulty = lookup.Difficulty.at(c.difficultyMeasured)
    const atCurrentPlayer = 'P' + macro.Number.at(
      c.playerIdxMeasured.with({ cmp: '+', rvalue: ['Value', '', 1] })
    )

    const atRallyLikeGamemode = lookup.Gamemode.at(c.measuredGameModeSelectedFromMainMenu)

    return [
      // Watching replay
      // Didn't figure out how to track car, usual value is not updated
      [
        $(
          c.isInGame,
          c.gameModeIs.replayPrior,
        ),
        tag`Watching Replay 📍 ${atQuickCountry} - ${atQuickStage}`
      ],

      // Quick race (because it's weird case with 2 player count)
      [
        $(
          c.isInGame,
          c.gameModeIs.quickRace
        ),
        tag`Quick Race 📍 ${atQuickCountry} - ${atQuickStage} 🚗 ${atCar}`
      ],
      // Head to Head
      [
        $(
          c.isInGame,
          c.gameModeIs.headToHead
        ),
        tag`Head to Head 📍 ${atQuickCountry} - ${atQuickStage}`
      ],

      // >= 2 player count cases
      // Time Trial
      [
        $(
          c.isInGame,
          c.isMultiPlayer,
          c.gameModeIs.timeTrial
        ),
        tag`Time Trial ${atDifficulty} ${atCurrentPlayer} 📍 ${atQuickCountry} - ${atQuickStage} 🚗 ${atCarMP}, ${atDriverMP}`
      ],

      // WRC
      // Custom Rally
      // Custom Championship
      [
        $(
          c.isInGame,
          c.isMultiPlayer,
          c.gameModeIs.rallyLike
        ),
        tag`${atRallyLikeGamemode} ${atDifficulty} ${atCurrentPlayer} 📍 ${atCurrentCountry} - ${atCurrentStageIndex} ${atCurrentStage} 🚗 ${atCarMP}, ${atDriverMP}`
      ],

      // 1 player count cases
      // Time Trial
      [
        $(
          c.isInGame,
          c.gameModeIs.timeTrial
        ),
        tag`Time Trial ${atDifficulty} 📍 ${atQuickCountry} - ${atQuickStage} 🚗 ${atCar}`
      ],
      // WRC Challenge
      [
        $(
          c.isInGame,
          c.gameModeIs.challengeWRC
        ),
        tag`WRC Challenge 📍 ${atCurrentCountry} - ${atCurrentStageIndex} ${atCurrentStage} 🚗 ${atCar}, ${atDriver}`
      ],

      // WRC
      // Custom Rally
      // Custom Championship

      // Didn't do Getting Ready for multiplayer due to "Current player" count being reset to -1 midway
      [
        $(
          c.isGettingReady,
          c.gameModeIs.rallyLike
        ),
        tag`${atRallyLikeGamemode} ${atDifficulty} 📍 ${atCurrentCountry} - Getting Ready`
      ],
      [
        $(
          c.isInGame,
          c.gameModeIs.rallyLike
        ),
        tag`${atRallyLikeGamemode} ${atDifficulty} 📍 ${atCurrentCountry} - ${atCurrentStageIndex} ${atCurrentStage} 🚗 ${atCar}, ${atDriver}`
      ],

      'Playing WRC II Extreme'
    ]
  }
})

export default set