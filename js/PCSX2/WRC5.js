// @ts-check
import { AchievementSet, define as $, trigger, andNext, resetIf, pauseIf, orNext, once, stringToNumberLE, ConditionBuilder, RichPresence } from '@cruncheevos/core'

const gamemode = {
  singleRally: 3,
  championship: 4,
  rallycross: 6,
  testCourse: 7,
  historicChallenge: 0xA,
}

const difficulty = {
  novice: 1,
  professional: 2,
  expert: 3
}

const rallyClass = {
  s1600: 1,
  wrc: 2,
  extreme: 3,
  historic: 5,
  independents: 6,
}

const countryIds = {
  AR: "Argentina",
  AU: "Australia",
  CY: "Cyprus",
  DE: "Germany",
  ES: "Spain",
  FI: "Finland",
  FR: "France",
  GB: "Great Britain",
  GR: "Greece",
  IT: "Italy",
  JA: "Japan",
  MC: "Monte Carlo",
  ME: "Mexico",
  NZ: "New Zealand",
  SE: "Sweden",
  TR: "Turkey",
}

const trackIds = {
  MC1: "SS1 - Prunieres",
  MC2: "SS2 - Sigale",
  MC3: "SS3 - Turini",
  SE1: "SS1 - Sagen",
  SE2: "SS2 - Vargasen",
  SE3: "SS3 - Hagfors",
  ME1: "SS1 - El Cubilete",
  ME2: "SS2 - Otates",
  ME3: "SS3 - La Esperanza",
  NZ1: "SS1 - Te Akau North",
  NZ2: "SS2 - Parahi",
  NZ3: "SS3 - Waipu Gorge",
  IT1: "SS1 - Berchidda",
  IT2: "SS2 - Pattada",
  IT3: "SS3 - Punta Balistreri",
  CY1: "SS1 - Foini",
  CY2: "SS2 - Galatareia",
  CY3: "SS3 - Kellaki",
  TR1: "SS1 - Simena",
  TR2: "SS2 - Silyon",
  TR3: "SS3 - Phaselis",
  GR1: "SS1 - Amfissa",
  GR2: "SS2 - Drosohori",
  GR3: "SS3 - Elatia",
  AR1: "SS1 - Villa Albertina",
  AR2: "SS2 - Capilla del Monte",
  AR3: "SS3 - La Cumbre",
  FI1: "SS1 - Parkkola",
  FI2: "SS2 - Moksi",
  FI3: "SS3 - Ouninpohja",
  DE1: "SS1 - Bosenberg",
  DE2: "SS2 - Moselland",
  DE3: "SS3 - Panzerplatte Ost",
  GB1: "SS1 - Resolfen",
  GB2: "SS2 - Rheola",
  GB3: "SS3 - Margam",
  JA1: "SS1 - Obihiro",
  JA2: "SS2 - Hidaka",
  JA3: "SS3 - Rikubetsu",
  FR1: "SS1 - Pont du Liamone",
  FR2: "SS2 - Coti-Chiavari",
  FR3: "SS3 - Col de Carazzi",
  ES1: "SS1 - La Roca",
  ES2: "SS2 - Viladrau",
  ES3: "SS3 - La Pobla",
  AU1: "SS1 - Bannister North",
  AU2: "SS2 - Helena South",
  AU3: "SS3 - Stirling West"
}

const trophyIds = {
  AR__: "Rally Argentina",
  AU__: "Rally Australia",
  CY__: "Rally Cyprus",
  DE__: "Rally Germany",
  ES__: "Rally Spain",
  FI__: "Rally Finland",
  FR__: "Rally France",
  GB__: "Rally Great Britain",
  GR__: "Rally Greece",
  IT__: "Rally Italy",
  JA__: "Rally Japan",
  MC__: "Rally Monte Carlo",
  ME__: "Rally Mexico",
  NZ__: "Rally New Zealand",
  SE__: "Rally Sweden",
  TR__: "Rally Turkey",
  RX__: "Rallycross",
  HIST: "Historic Challenge",
  JCHA: "Championship Junior",
  NCHA: "Championship Novice",
  PCHA: "Championship Professional",
  ECHA: "Championship Expert",
}

const carIds = {
  FPS_: "Fiat Punto Abarth Rally S1600",
  P2S_: "Peugeot 206 S1600",
  FFS_: "Ford Fiesta S1600",
  RCS_: "Renault Clio S1600",
  SIS_: "Suzuki Ignis S1600",
  SSS_: "Suzuki Swift S1600",
  CXW_: "Citroen Xsara WRC",
  FCW_: "Ford Focus WRC",
  FBW_: "Ford Focus WRC",
  SIW_: "Subaru Impreza WRC 2005",
  P3W_: "Peugeot 307 WRC",
  MLW_: "Mitsubishi Lancer WRC05",
  SFW_: "Skoda Fabia WRC",
  CXP_: "Citroen Xsara WRC",
  FFP_: "Ford Focus WRC",
  FSP_: "Ford Focus WRC",
  P2P_: "Peugeot 206 WRC",
  SFP_: "Skoda Fabia WRC",
  SIP_: "Subaru Impreza WRC",
  FFC_: "Ford Focus RS Concept",
  SBC_: "Subaru B95C",
  P3C_: "Peugeot 307 Berline",
  MCE_: "Mitsubishi Colt Rally Extreme",
  CXE_: "Citroen Xsara Extreme 05",
  FFE_: "Ford Focus Extreme 05",
  SIE_: "Subaru Impreza Extreme 05",
  P3E_: "Peugeot 307 Extreme 05",
  MLE_: "Mitsubishi Lancer Evolution Extreme Max II",
  SFE_: "Skoda Fabia Extreme 05",
  AQH_: "Audi Sport Quattro S1",
  LDH_: "Lancia Delta S4",
  FRH_: "Ford RS200",
  LRH_: "Lancia Rally 037",
  P2H_: "Peugeot 205 T16",
  RMH_: "Renault 5 Maxi Turbo",
}

const c = (() => {
  const playerAmountIs = x => $.one(['', 'Mem', '16bit', 0x1ffa408, '=', 'Value', '', x])

  /** @param {keyof typeof difficulty} x */
  const difficultyIs = (x) => $.one(['', 'Mem', '8bit', 0x1ffa403, '=', 'Value', '', difficulty[x]])
  /** @param {keyof typeof difficulty} x */
  const difficultyIsNot = x => difficultyIs(x).with({ cmp: '!=' })

  /** @param {keyof typeof gamemode} x */
  const gameModeIs = x => $.one(['', 'Mem', '8bit', 0x1ffa404, '=', 'Value', '', gamemode[x]])
  /** @param {keyof typeof gamemode} x */
  const gameModeIsNot = x => gameModeIs(x).with({ cmp: '!=' })

  const isInPodiumMenu = $.str('.podium.', (s, v) => $(
    ['', 'Mem', s, 0x1AAFF34, '=', ...v],
  ))

  const debugModeTampered = $(
    ['', 'Mem', '32bit', 0x241174, '!=', 'Value', '', 0x90420000],
    ['', 'Mem', '32bit', 0x4d069c, '!=', 'Value', '', 0x104710],
  )

  const activeCheatStrIs = x => $.str(x, (s, v) => $(
    ['', 'Mem', s, 0x005794e8, '=', ...v],
  ))

  const cheatActive = $.one(['', 'Mem', '8bit', 0x004d94e4, '!=', 'Value', '', 0])

  const carIs = x => $.str(x, (s, v) => $(
    ['AddAddress', 'Mem', '32bit', 0x1ff4b3c],
    ['', 'Mem', s, 0, '=', ...v],
  ))

  const countryIs = x => $.str(x, (s, v) => $(
    ['AddAddress', 'Mem', '32bit', 0x01fe4cec],
    ['', 'Mem', s, 0, '=', ...v],
  ))

  const trackIs = x => $.str(x, (s, v) => $(
    ['AddAddress', 'Mem', '32bit', 0x01fe4cf4],
    ['', 'Mem', s, 0, '=', ...v],
  ))

  const isOnStageByIndex = x => $.str(x.toString(), (s, v) => $(
    ['AddAddress', 'Mem', '32bit', 0x01fe4cf4],
    ['', 'Mem', s, 0x2, '=', ...v]
  ))

  const rxInGame = (() => {
    const base = $(['AddAddress', 'Mem', '32bit', 0x005797a0])
    return {
      isNull: base.withLast({ flag: '', cmp: '=', rvalue: ['Value', '', 0] }),
      started: $(
        base,
        ['', 'Mem', '32bit', 0x38, '=', 'Value', '', 0x7fffffff]
      ),
      finished: $(
        base,
        ['AndNext', 'Delta', '8bit', 0x36, '=', 'Value', '', 1],
        base,
        ['', 'Mem', '8bit', 0x36, '=', 'Value', '', 0],
      ),
      lapsToCompleteAre: x => $(
        base,
        ['', 'Mem', '32bit', 0x44, '=', 'Value', '', x],
      )
    }
  })()

  const generalInGame = (() => {
    const base = $(['AddAddress', 'Mem', '32bit', 0x005797e0])

    return {
      positionIs: x => $(
        base,
        ['', 'Mem', '32bit', 0xC, '=', 'Value', '', x],
      )
    }
  })()

  const generalInGame2 = (() => {
    const base = $(['AddAddress', 'Mem', '32bit', 0x4dbbb0])

    return {
      crashedOrReset: $(
        base,
        ['', 'Mem', 'Float', 0xe80, '>', 'Delta', 'Float', 0xe80],
      ),
      currentCameraIs: x => $(
        base,
        ['AddAddress', 'Mem', '32bit', 0xFB4],
        ['AddAddress', 'Mem', '32bit', 0],
        ['', 'Mem', '32bit', 0x8, '=', 'Value', '', x],
      )
    }
  })()

  const rallyStageInGame = (() => {
    const base = $(['AddAddress', 'Mem', '32bit', 0x00579268])

    return {
      started: $(
        base,
        ['AndNext', 'Delta', '32bit', 0x1600, '=', 'Value', '', 0],
        base,
        ['', 'Mem', '32bit', 0x1600, '>', 'Value', '', 0],
      ),
      reset: $(
        base,
        ['AndNext', 'Delta', '32bit', 0x1600, '>', 'Value', '', 0],
        base,
        ['', 'Mem', '32bit', 0x1600, '=', 'Value', '', 0],
      ),

      finished: $(
        base,
        ['AndNext', 'Delta', '8bit', 0x1615, '=', 'Value', '', 0],
        base,
        ['', 'Mem', '8bit', 0x1615, '=', 'Value', '', 1],
      ),
      timeIsLeq: x => $(
        base,
        ['', 'Mem', '32bit', 0x1600, '<=', 'Value', '', x],
      ),
      timeMeasured: $(
        base,
        ['Measured', 'Mem', '32bit', 0x1600, '/', 'Value', '', 10],
      )
    }
  })()

  const isInMainMenu = $.str('.P_menuB', (s, v) => $(
    ['', 'Mem', s, 0x1AAFF34, '=', ...v]
  ))

  return {
    isIngame: $.one(['', 'Mem', '32bit', 0x579248, '!=', 'Value', '', 0]),
    debugModeTampered,

    gameModeIs,
    gameModeIsNot,
    /** @param {keyof typeof rallyClass} x */
    rallyClassIs: (x) => $.one(['', 'Mem', '8bit', 0x1ffa402, '=', 'Value', '', rallyClass[x]]),
    /** @param {keyof typeof rallyClass} x */
    rallycrossClassIs: (x) => $.one(['', 'Mem', '8bit', 0x1ffa405, '=', 'Value', '', rallyClass[x]]),
    difficultyIs,
    difficultyIsNot,

    countryIs,
    carIs,
    trackIs,

    isInMainMenu,

    hasDamagedCar: (() => {
      const base = $(['AddAddress', 'Mem', '32bit', 0x5796e4])
      const offsets = [0x3F0, 0x40C, 0x454, 0x48C, 0x4A8, 0x4C4]
      return andNext(
        orNext(
          ...offsets.map(x => $(
            base,
            ['', 'Mem', '8bit', x, '>', 'Delta', '8bit', x]
          ))
        ),
        base.withLast({ flag: '', cmp: '!=', rvalue: ['Value', '', 0] })
      )
    })(),

    hasWonChampionship: $(
      playerAmountIs(1),
      gameModeIs('championship'),
      isInPodiumMenu,
      orNext(
        ['', 'Mem', '8bit', 0x1fea94c, '=', 'Value', '', 0], // champ win scene
        ['', 'Mem', '8bit', 0x1fea94c, '=', 'Value', '', 2]  // early champ win scene
      )
    ),

    hasWonRally: andNext(
      playerAmountIs(1),
      isInPodiumMenu,

      ['', 'Mem', '8bit', 0x1fea94c, '=', 'Value', '', 1], // rally win podium scene
      ['', 'Mem', '32bit', 0x01fea948, '=', 'Value', '', 1] // rally pos
    ),

    playerAmountIs,
    beganRally: andNext(
      isOnStageByIndex(1),
      rallyStageInGame.started
    ),

    hasWonRallycrossEvent: $(
      gameModeIs('rallycross'),
      once(rxInGame.finished),
      generalInGame.positionIs(1),
      resetIf(
        rxInGame.isNull,
        rxInGame.started,
      )
    ),

    cheatActive,
    activeCheatStrIs,

    pauseIfCheatingInRally: $(
      pauseIf(debugModeTampered),
      orNext(
        activeCheatStrIs('MOON'),
        activeCheatStrIs('NODA'),
      ).andNext(
        activeCheatStrIs('REVE'),
      ).pauseIf(
        cheatActive
      )
    ),

    pauseIfCheatingInRallycross: pauseIf(
      debugModeTampered,
      andNext(
        activeCheatStrIs('MOON'),
        cheatActive,
      )
    ),

    aids: {
      braking: {
        active: $(['', 'Mem', '8bit', 0x01fdff67, '!=', 'Value', '', 0]),
        disabled: $(['', 'Mem', '8bit', 0x01fdff67, '=', 'Value', '', 0]),
      },
      steering: {
        active: $(['', 'Mem', '8bit', 0x01fdff65, '!=', 'Value', '', 0]),
        disabled: $(['', 'Mem', '8bit', 0x01fdff65, '=', 'Value', '', 0]),
      },
      tcs: {
        active: $(['', 'Mem', '8bit', 0x01fdff66, '!=', 'Value', '', 0]),
        disabled: $(['', 'Mem', '8bit', 0x01fdff66, '=', 'Value', '', 0]),
      },
      autoGearbox: {
        active: $(['', 'Mem', '8bit', 0x01fdff64, '=', 'Value', '', 0]),
        disabled: $(['', 'Mem', '8bit', 0x01fdff64, '=', 'Value', '', 1]),
      },
      pacenotes: {
        active: $(['', 'Mem', 'Bit6', 0x01fdff60, '=', 'Value', '', 1]),
        disabled: $(['', 'Mem', 'Bit6', 0x01fdff60, '=', 'Value', '', 0]),
      }
    },

    generalInGame,
    generalInGame2,
    rallyStageInGame,
    rxInGame,
  }
})()

/**
 * @param {string} title
 * @param {string} expectedTrackId
 * @param {string[]} expectedCarIds
 */
function defineLeaderboard(title, expectedTrackId, expectedCarIds = []) {
  set.addLeaderboard({
    title,
    description: 'Finish in least time',
    type: 'MILLISECS',
    lowerIsBetter: true,
    conditions: {
      start: {
        core: $(
          c.trackIs(expectedTrackId),
          c.rallyStageInGame.started,
          orNext(
            ...(expectedCarIds.map(id => c.carIs(id)))
          ),
          c.pauseIfCheatingInRally
        )
      },
      cancel: {
        core: '1=1',
        alt1: c.rallyStageInGame.reset,
        alt2: c.generalInGame2.crashedOrReset,
        alt3: c.isInMainMenu
      },
      submit: c.rallyStageInGame.finished,
      value: c.rallyStageInGame.timeMeasured
    }
  })
}

const set = new AchievementSet({ gameId: 19283, title: 'WRC Rally Evolved' })

for (const [points, carClass, difficultyValue, title, championshipDescription] of /** @type const */ ([
  [10, 's1600', difficulty.novice, "Junior Champion", "Super 1600 Championship"],
  [10, 'wrc', difficulty.novice, "WRC Novice Champion", "World Rally Championship on Novice difficulty or higher"],
  [25, 'wrc', difficulty.professional, "WRC Professional Champion", "World Rally Championship on Professional difficulty or higher"],
  [50, 'wrc', difficulty.expert, "WRC Expert Champion", "World Rally Championship on Expert difficulty"],
])) {
  set.addAchievement({
    title,
    description: `Win the ` + championshipDescription,
    points,
    type: carClass === 'wrc' ? 'win_condition' : 'progression',
    conditions: $(
      c.rallyClassIs(carClass),
      carClass === 'wrc' && orNext(
        c.difficultyIs('expert'),
        difficultyValue <= difficulty.professional && c.difficultyIs('professional'),
        difficultyValue <= difficulty.novice && c.difficultyIs('novice'),
      ),
      c.hasWonChampionship,
      c.pauseIfCheatingInRally
    )
  })
}

for (const [countryId, title] of /** @type const */ ([
  ['MC__', "Monte Carlo Rally Champion"],
  ['SE__', "Swedish Rally Champion"],
  ['ME__', "Rally Mexico Champion"],
  ['NZ__', "Rally New Zealand Champion"],
  ['IT__', "Rally d'Italia Sardegna Champion"],
  ['CY__', "Cyprus Rally Champion"],
  ['TR__', "Rally of Turkey Champion"],
  ['GR__', "Acropolis Rally Champion"],
  ['AR__', "Rally Argentina Champion"],
  ['FI__', "Rally Finland Champion"],
  ['DE__', "Rallye Deutschland Champion"],
  ['GB__', "Wales Rally GB Champion"],
  ['JA__', "Rally Japan Champion"],
  ['FR__', "Tour de Corse Champion"],
  ['ES__', "Rally Catalunya Champion"],
  ['AU__', "Rally Australia Champion"],
])) {
  set.addAchievement({
    title,
    description: `Win the ${trophyIds[countryId]} on WRC Professional or Expert difficulty`,
    type: 'progression',
    points: 5,
    conditions: $(
      orNext(
        c.gameModeIs('singleRally'),
        c.gameModeIs('championship'),
      ),
      orNext(
        c.difficultyIs('professional'),
        c.difficultyIs('expert'),
      ),
      c.rallyClassIs('wrc'),
      c.countryIs(countryId),
      c.hasWonRally,
      c.pauseIfCheatingInRally
    )
  })
}

for (const [points, expectedCarIds] of /** @type const */ ([
  [2, ['FPS_']],
  [2, ['P2S_']],
  [2, ['FFS_']],
  [2, ['RCS_']],
  [2, ['SIS_']],
  [2, ['SSS_']],
  [3, ['CXW_']],
  [3, ['FCW_', 'FBW_']],
  [3, ['SIW_']],
  [3, ['P3W_']],
  [3, ['MLW_']],
  [3, ['SFW_']],
])) {
  const carName = carIds[expectedCarIds[0]]

  set.addAchievement({
    title: carName + ' Enthusiast',
    description: 'Win any rally event in ' + carName,
    points,
    conditions: $(
      orNext(
        c.gameModeIs('singleRally'),
        c.gameModeIs('championship'),
      ),
      orNext(
        ...(expectedCarIds.map(id => c.carIs(id)))
      ),
      c.hasWonRally,
      c.pauseIfCheatingInRally
    )
  })
}

for (const expectedCarId of [
  'CXE_',
  'FFE_',
  'SIE_',
  'P3E_',
  'MLE_',
  'SFE_',
  'AQH_',
  'LDH_',
  'FRH_',
  'P2H_',
]) {
  const carName = carIds[expectedCarId]

  set.addAchievement({
    title: carName + ' Enthusiast',
    description: 'Win any rallycross event in ' + carName,
    points: 2,
    conditions: $(
      c.carIs(expectedCarId),
      c.hasWonRallycrossEvent,
      c.pauseIfCheatingInRallycross
    )
  })
}

set.addAchievement({
  title: 'RX 2005',
  description: 'Win any rallycross event set to 10 laps',
  points: 5,
  conditions: $(
    c.rxInGame.lapsToCompleteAre(10),
    c.hasWonRallycrossEvent,
    c.pauseIfCheatingInRallycross
  )
})

for (const [goldString, points, carClassFormatted, carClass] of /** @type const */ ([
  ['SG', 10, "S1600", 's1600'],
  ['WG', 10, "WRC", 'wrc'],
  ['PG', 10, "Independents", 'independents'],
  ['EG', 25, "Extreme", 'extreme'],
  ['HG', 25, "Historic", 'historic'],
])) {
  const addresses = []
  for (let i = 0x1fe45c6; i <= 0x1fe45c6 + 0x4 * 273; i += 4) {
    addresses.push(i)
  }

  set.addAchievement({
    title: `Rallycross Champion - ` + carClassFormatted,
    description: `Win all rallycross events in ${carClassFormatted} category`,
    points,
    type: 'progression',
    conditions: $(
      c.rallycrossClassIs(carClass),
      resetIf(c.rxInGame.isNull),
      resetIf(
        andNext(
          ...addresses.map(x => $.one(['', 'Mem', '16bit', x, '=', 'Delta', '16bit', x]))
        )
      ),
      ...addresses.map(x => once(
        $.str(goldString, (s, v) => $(['AddHits', 'Mem', s, x, '=', ...v])))
      ),
      '0=1.16.',
      c.pauseIfCheatingInRallycross
    )
  })
}

for (const [expectedTrackId, carId, timeLimit, medalName] of /** @type const */ ([
  ['HAQ1', 'AQH_', 39000, "Bronze"],
  ['HAQ2', 'AQH_', 53750, "Silver"],
  ['HAQ3', 'AQH_', 62000, "Gold"],
  ['HLD1', 'LDH_', 42000, "Bronze"],
  ['HLD2', 'LDH_', 48750, "Silver"],
  ['HLD3', 'LDH_', 56500, "Gold"],
  ['HFR1', 'FRH_', 65000, "Bronze"],
  ['HFR2', 'FRH_', 49000, "Silver"],
  ['HFR3', 'FRH_', 44000, "Gold"],
  ['HL01', 'LRH_', 51000, "Bronze"],
  ['HL02', 'LRH_', 43000, "Silver"],
  ['HL03', 'LRH_', 45250, "Gold"],
  ['HPT1', 'P2H_', 48000, "Bronze"],
  ['HPT2', 'P2H_', 46250, "Silver"],
  ['HPT3', 'P2H_', 53250, "Gold"],
  ['HR51', 'RMH_', 39000, "Bronze"],
  ['HR52', 'RMH_', 43250, "Silver"],
  ['HR53', 'RMH_', 60000, "Gold"]
])) {
  const carName = carIds[carId]

  set.addAchievement({
    title: `${carName} Historic Challenge ${medalName}`,
    description: `Complete ${medalName} Historic Challenge for ${carName}`,
    points: 3,
    type: 'progression',
    conditions: $(
      c.trackIs(expectedTrackId),
      c.rallyStageInGame.finished,
      c.rallyStageInGame.timeIsLeq(timeLimit),
      c.pauseIfCheatingInRally
    )
  })

  defineLeaderboard(
    `Historic Challenge ${carName} - ${medalName}`,
    expectedTrackId,
  )
}

Object.entries({
  P2P_: [
    { trackId: 'SE2', timeLimit: '02:09.00' },
    { trackId: 'AR2', timeLimit: '02:27.50' },
    { trackId: 'FR1', timeLimit: '02:21.50' }
  ],
  SBC_: [
    { trackId: 'FI2', timeLimit: '02:46.50' },
    { trackId: 'DE1', timeLimit: '02:21.90' },
    { trackId: 'AU2', timeLimit: '02:15.10' }
  ],
  P3C_: [
    { trackId: 'IT2', timeLimit: '02:14.30' },
    { trackId: 'FR2', timeLimit: '02:54.35' },
    { trackId: 'AR3', timeLimit: '02:14.00' }
  ],
  MCE_: [
    { trackId: 'CY3', timeLimit: '02:50.50' },
    { trackId: 'TR3', timeLimit: '03:01.00' },
    { trackId: 'ES2', timeLimit: '02:25.20' }
  ],
  CXE_: [
    { trackId: 'MC1', timeLimit: '02:31.20' },
    { trackId: 'NZ1', timeLimit: '02:09.60' },
    { trackId: 'TR1', timeLimit: '02:18.40' }
  ],
  FFE_: [
    { trackId: 'GR2', timeLimit: '02:53.90' },
    { trackId: 'JA1', timeLimit: '01:48.80' },
    { trackId: 'FR3', timeLimit: '02:27.80' }
  ],
  SIE_: [
    { trackId: 'SE1', timeLimit: '02:06.00' },
    { trackId: 'ME2', timeLimit: '01:51.20' },
    { trackId: 'GB3', timeLimit: '02:27.80' }
  ],
  P3E_: [
    { trackId: 'FI3', timeLimit: '02:28.00' },
    { trackId: 'DE2', timeLimit: '02:17.20' },
    { trackId: 'JA3', timeLimit: '01:54.00' }
  ],
  MLE_: [
    { trackId: 'NZ2', timeLimit: '02:30.00' },
    { trackId: 'CY1', timeLimit: '02:22.10' },
    { trackId: 'AU3', timeLimit: '02:07.50' }
  ],
  SFE_: [
    { trackId: 'ME3', timeLimit: '03:09.50' },
    { trackId: 'GB1', timeLimit: '03:04.60' },
    { trackId: 'ES1', timeLimit: '02:12.50' }
  ],
  AQH_: [
    { trackId: 'ME1', timeLimit: '03:15.00' },
    { trackId: 'GR3', timeLimit: '02:58.60' },
    { trackId: 'ES3', timeLimit: '02:41.10' }
  ],
  LDH_: [
    { trackId: 'IT1', timeLimit: '02:41.30' },
    { trackId: 'FI1', timeLimit: '02:03.00' },
    { trackId: 'JA2', timeLimit: '01:52.50' }
  ],
  FRH_: [
    { trackId: 'NZ3', timeLimit: '02:07.40' },
    { trackId: 'TR2', timeLimit: '02:25.80' },
    { trackId: 'DE3', timeLimit: '02:28.00' }
  ],
  LRH_: [
    { trackId: 'MC3', timeLimit: '02:50.00' },
    { trackId: 'SE3', timeLimit: '03:45.00' },
    { trackId: 'IT3', timeLimit: '03:00.00' }
  ],
  P2H_: [
    { trackId: 'MC2', timeLimit: '04:00.40' },
    { trackId: 'GR1', timeLimit: '02:49.00' },
    { trackId: 'AR1', timeLimit: '02:01.50' }
  ],
  RMH_: [
    { trackId: 'CY2', timeLimit: '02:54.00' },
    { trackId: 'GB2', timeLimit: '02:29.00' },
    { trackId: 'AU1', timeLimit: '01:35.20' }
  ]
}).forEach(([expectedCarId, challenges]) => {
  const carName = carIds[expectedCarId]

  challenges.forEach(({ trackId, timeLimit }, index) => {
    const timePieces = timeLimit.split(/[:\.]/).map(Number)
    const timeLimitMsec = timePieces[0] * 60000 + timePieces[1] * 1000 + timePieces[2] * 10

    const countryName = countryIds[trackId.slice(0, -1)]
    const trackName = trackIds[trackId]

    set.addAchievement({
      title: `${carName} Challenge #${index + 1}`,
      description: `Rally ${countryName} ${trackName}, beat time of ${timeLimit} in ${carName}`,
      points: 3,
      conditions: $(
        c.trackIs(trackId),
        c.carIs(expectedCarId),
        c.rallyStageInGame.finished,
        c.rallyStageInGame.timeIsLeq(timeLimitMsec),
        c.pauseIfCheatingInRally
      )
    })

    defineLeaderboard(
      `${countryName} ${trackName}, ${carName}`,
      trackId,
      [expectedCarId]
    )
  })
})

set.addAchievement({
  title: 'Driver Evolved',
  description: 'Win any rally event on WRC Professional or Expert difficulty, using manual transmission, with driving aids and pacenote display off, in one sitting',
  points: 10,
  conditions: $(
    pauseIf(
      andNext(
        c.gameModeIsNot('singleRally'),
        c.gameModeIsNot('championship')
      ),
      andNext(
        c.difficultyIsNot('professional'),
        c.difficultyIsNot('expert')
      ),
    ),
    once(
      c.beganRally
    ),
    trigger(c.hasWonRally),
    resetIf(
      c.isInMainMenu,
      c.aids.braking.active,
      c.aids.steering.active,
      c.aids.tcs.active,
      c.aids.autoGearbox.active,
      c.aids.pacenotes.active,
    ),
    c.pauseIfCheatingInRally
  )
})

set.addAchievement({
  title: `Don't Break the Car`,
  description: 'Win any rally event without seriously damaging your car on WRC Professional or Expert difficulty, in one sitting',
  points: 10,
  conditions: $(
    pauseIf(
      andNext(
        c.gameModeIsNot('singleRally'),
        c.gameModeIsNot('championship')
      ),
      andNext(
        c.difficultyIsNot('professional'),
        c.difficultyIsNot('expert')
      ),
    ),

    once(c.beganRally),
    trigger(c.hasWonRally),
    resetIf(
      c.hasDamagedCar,
      c.isInMainMenu
    ),
    c.pauseIfCheatingInRally
  )
})

set.addAchievement({
  title: 'Sweet Rally',
  description: 'Win any rally event with Psychedelic sky cheat active, in one sitting',
  points: 5,
  conditions: $(
    once(
      orNext(
        c.gameModeIs('singleRally'),
        c.gameModeIs('championship'),
      ).andNext(
        c.cheatActive,
        c.activeCheatStrIs('PSYC'),
        c.beganRally
      )
    ),
    trigger(c.hasWonRally),
    resetIf(c.isInMainMenu),
    pauseIf(c.debugModeTampered)
  )
})

set.addAchievement({
  title: 'Shattered Pacenotes',
  description: 'Win any rally event with Cross-eyed co-driver cheat active, in one sitting',
  points: 5,
  conditions: $(
    once(
      orNext(
        c.gameModeIs('singleRally'),
        c.gameModeIs('championship'),
      ).andNext(
        c.cheatActive,
        c.activeCheatStrIs('XEYE'),
        c.beganRally
      )
    ),
    trigger(c.hasWonRally),
    resetIf(c.isInMainMenu),
    pauseIf(c.debugModeTampered)
  )
})

set.addAchievement({
  title: 'Heli of a View',
  description: 'Finish any rally stage with Top down view cheat active',
  points: 1,
  conditions: $(
    andNext(
      'once',
      c.rallyStageInGame.timeIsLeq(3000),
      c.generalInGame2.currentCameraIs(0),
      c.cheatActive,
      c.activeCheatStrIs('TOPD'),
    ),
    resetIf(
      c.isInMainMenu,
      c.generalInGame2.currentCameraIs(0).withLast({ cmp: '!=' }),
    ),
    trigger(c.rallyStageInGame.finished),
    pauseIf(c.debugModeTampered)
  )
})

set.addAchievement({
  title: 'In Which Co-driver Makes Funny Noises',
  description: 'Finish any rally stage with Helium co-driver cheat active',
  points: 1,
  conditions: $(
    c.rallyStageInGame.finished,
    c.cheatActive,
    c.activeCheatStrIs('SQUE'),
    pauseIf(c.debugModeTampered)
  )
})

// Regular leaderboards
Object.entries({
  S1600: {
    carIds: ['FPS_', 'P2S_', 'FFS_', 'RCS_', 'SIS_', 'SSS_'],
    countries: ['NZ', 'GR', 'FI', 'TR', 'JA', 'FR', 'ES', 'IT']
  },
  WRC: {
    carIds: ['CXW_', 'FCW_', 'FBW_', 'SIW_', 'P3W_', 'MLW_', 'SFW_', 'CXP_'],
    countries: []
  }
}).forEach(([carClass, { carIds, countries }]) => {
  for (const trackId in trackIds) {
    const contryId = trackId.slice(0, 2)
    if (countries.length > 0 && !countries.includes(contryId)) {
      continue
    }

    const countryString = countryIds[contryId]
    defineLeaderboard(
      `${countryString} ${trackIds[trackId]}, ${carClass}`,
      trackId,
      carIds
    )
  }
})

const convertLookup = obj => Object.fromEntries(
  Object.entries(obj).map(([key, value]) => [stringToNumberLE(key), value])
)

export const rich = RichPresence({
  lookupDefaultParameters: { keyFormat: 'hex' },
  lookup: {
    Car: {
      values: convertLookup(carIds),
      defaultAt: 'I:0xX1ff4b3c_M:0xX0'
    },
    Country: {
      values: convertLookup(countryIds),
      defaultAt: 'I:0xX1fe4cec_M:0x0'
    },
    Difficulty: {
      values: {
        1: 'WRC Novice',
        2: 'WRC Professional',
        3: 'WRC Expert',
      },
      defaultAt: '0xH1ffa403',
      keyFormat: 'dec'
    },
    Gamemode: {
      values: {
        1: 'Quick Race',
        2: 'Single Stage',
        3: 'Single Rally',
        4: 'Championship'
      },
      defaultAt: '0xH1ffa404',
      keyFormat: 'dec'
    },
    Stage: {
      values: convertLookup(trackIds),
      defaultAt: 'I:0xX1fe4cf4_M:0xW0'
    },
    HistoricChallenge: {
      values: convertLookup({
        HAQ1: "Audi Quattro Bronze",
        HAQ2: "Audi Quattro Silver",
        HAQ3: "Audi Quattro Gold",
        HFR1: "Ford RS200 Bronze",
        HFR2: "Ford RS200 Silver",
        HFR3: "Ford RS200 Gold",
        HL01: "Lancia 037 Bronze",
        HL02: "Lancia 037 Silver",
        HL03: "Lancia 037 Gold",
        HLD1: "Lancia Delta S4 Bronze",
        HLD2: "Lancia Delta S4 Silver",
        HLD3: "Lancia Delta S4 Gold",
        HPT1: "Peugeot 205 T16 Bronze",
        HPT2: "Peugeot 205 T16 Silver",
        HPT3: "Peugeot 205 T16 Gold",
        HR51: "Renault 5 Maxi Turbo Bronze",
        HR52: "Renault 5 Maxi Turbo Silver",
        HR53: "Renault 5 Maxi Turbo Gold"
      }),
      defaultAt: 'I:0xX1fe4cf4_M:0xX0'
    },
  },

  displays: ({ lookup, tag }) => {
    return [
      [
        $(
          c.isIngame,
          c.rallyClassIs('s1600'),
          orNext(
            c.gameModeIs('championship'),
            c.gameModeIs('singleRally'),
          )
        ),
        tag`S1600 ${lookup.Gamemode} / ${lookup.Country} ${lookup.Stage} / ${lookup.Car}`
      ],
      [
        $(
          c.isIngame,
          orNext(
            c.gameModeIs('championship'),
            c.gameModeIs('singleRally'),
          )
        ),
        tag`${lookup.Difficulty} ${lookup.Gamemode} / ${lookup.Country} ${lookup.Stage} / ${lookup.Car}`
      ],
      [
        $(
          c.isIngame,
          c.gameModeIs('rallycross'),
        ),
        tag`Rallycross / ${lookup.Country} / ${lookup.Car}`
      ],
      [
        $(
          c.isIngame,
          c.gameModeIs('historicChallenge'),
        ),
        tag`Historic Challenge / ${lookup.HistoricChallenge}`
      ],
      [
        $(
          c.isIngame,
          c.gameModeIs('testCourse'),
        ),
        tag`Test Track / ${lookup.Car}`
      ],
      [
        $(c.isIngame),
        tag`${lookup.Gamemode} / ${lookup.Country} ${lookup.Stage} / ${lookup.Car}`
      ],
      'In menus of WRC: Rally Evolved'
    ]
  }
})

export default set