import { AchievementSet, define as $, resetIf, pauseIf, andNext, once, orNext, trigger, ConditionBuilder, measuredIf, RichPresence } from '@cruncheevos/core'
const set = new AchievementSet({ gameId: 11342, title: 'Tomb Raider' })

type Region = 'ntsc' | 'rev1' | 'pal'

const weapons = {
  pistols: 0x63,
  shotgun: 0x64,
  magnums: 0x65,
  uzi: 0x66,
}
type Weapon = keyof typeof weapons

type LevelMeta = {
  kills: number, pickups: number, secrets: number,
  maxWeapon?: Weapon, cutsceneId?: number
}

type Coords = {
  x: [number, number],
  y: [number, number],
  z: [number, number],
  yAdjust?: number
}

const levelNames = {
  0: `Lara's Home`,
  1: 'Caves',
  2: 'City of Vilcabamba',
  3: 'Lost Valley',
  4: 'Tomb of Qualopec',
  5: `St. Francis' Folly`,
  6: 'Colosseum',
  7: 'Palace Midas',
  8: 'The Cistern',
  9: 'Tomb of Tihocan',
  10: 'City of Khamoon',
  11: 'Obelisk of Khamoon',
  12: 'Sanctuary of the Scion',
  13: `Natla's Mines`,
  14: 'Atlantis',
  15: 'The Great Pyramid',

  0x10: 'Tomb of Qualopec',
  0x11: 'Tomb of Tihocan',
  0x12: `Natla's Mines`,
  0x13: 'Atlantis',
}

const levelMeta: Record<number, LevelMeta> = {
  1: { kills: 14, pickups: 7, secrets: 3, maxWeapon: 'pistols' },
  2: { kills: 29, pickups: 13, secrets: 3, maxWeapon: 'pistols' },
  3: { kills: 13, pickups: 16, secrets: 5, maxWeapon: 'shotgun' },
  4: { kills: 8, pickups: 8, secrets: 3, maxWeapon: 'shotgun', cutsceneId: 0x10 },
  5: { kills: 23, pickups: 19, secrets: 4, maxWeapon: 'shotgun' },
  6: { kills: 26, pickups: 14, secrets: 3, maxWeapon: 'magnums' },
  7: { kills: 43, pickups: 22, secrets: 3, maxWeapon: 'magnums' },
  8: { kills: 34, pickups: 28, secrets: 3, maxWeapon: 'magnums' },
  9: { kills: 17, pickups: 26, secrets: 2, maxWeapon: 'magnums', cutsceneId: 0x11 },
  10: { kills: 15, pickups: 24, secrets: 3, maxWeapon: 'magnums' },
  11: { kills: 16, pickups: 38, secrets: 3, maxWeapon: 'magnums' },
  12: { kills: 15, pickups: 29, secrets: 1, maxWeapon: 'uzi' },
  13: { kills: 3, pickups: 30, secrets: 3, maxWeapon: 'uzi' },
  14: { kills: 32, pickups: 50, secrets: 3, maxWeapon: 'uzi', cutsceneId: 0x13 },
  15: { kills: 6, pickups: 31, secrets: 2 /* (+1 glitched!) */, maxWeapon: 'uzi' },
}

type ExtremeRaiderParams = {
  lvId: number
  allPickups?: boolean
  allKills?: boolean
  maxWeapon?: Weapon
  triggerIcon?: boolean
}

const extremeRaiderMeta: Record<number, ExtremeRaiderParams> = {
  0x01: { lvId: 1, allKills: true },
  0x02: { lvId: 2 },
  0x03: { lvId: 3 },
  0x04: { lvId: 4, allKills: true, allPickups: true },
  0x05: { lvId: 5, allPickups: true },
  0x06: { lvId: 6 },
  0x07: { lvId: 7 },
  0x08: { lvId: 8 },
  0x09: { lvId: 9, allPickups: true },
  0x0A: { lvId: 10, allKills: true },
  0x0B: { lvId: 11, allKills: true, allPickups: true },
  0x0C: { lvId: 12, allKills: true },
  0x0D: { lvId: 13, allKills: true, maxWeapon: 'pistols' },
  0x0E: { lvId: 14, allKills: true },
  0x0F: { lvId: 15, allKills: true },
}

const codeFor = (r: Region) => {
  const regionCheck = $(
    r === 'ntsc' && $.str('0152', (s, v) => $(['', 'Mem', s, 0x087e89, '=', ...v])),
    r === 'rev1' && $.str('0152', (s, v) => $(['', 'Mem', s, 0x087f71, '=', ...v])),
    r === 'pal' && $.str('0024', (s, v) => $(['', 'Mem', s, 0x088001, '=', ...v])),
  )
  const pauseIfRegionCheck = pauseIf(regionCheck.map(x => x.with({ cmp: '!=' })))
  const m = (m: number) => {
    if (r === 'rev1') {
      if (m >= 0x89900) return m + 0x100
      return m + 0xE8
    }

    if (r === 'pal') {
      if (m >= 0x89900) return m + 0x190
      return m + 0x178
    }

    return m
  }

  const lvIdIs = (lvId: number) => $.one(['', 'Mem', '8bit', m(0x87580), '=', 'Value', '', lvId])
  const lvIdIsAny = lvIdIs(0xF).with({ cmp: '<=' })
  const lvIsNotFinished = $.one(['', 'Mem', '32bit', m(0x87588), '=', 'Value', '', 0])
  const lvIsFinished = $.one(['', 'Mem', '32bit', m(0x87588), '>', 'Delta', '32bit', m(0x87588), 0])

  const isNotNewGamePlus = $.one(['', 'Mem', '8bit', m(0x9280f), '=', 'Value', '', 0])
  const isNewGamePlus = $.one(['', 'Mem', '8bit', m(0x9280f), '!=', 'Value', '', 0])

  const frameAdvance = $.one(['', 'Mem', '32bit', m(0x927f8), '>', 'Delta', '32bit', m(0x927f8)])
  const frameFirst = andNext(
    ['', 'Delta', '32bit', m(0x927f8), '=', 'Value', '', 0],
    frameAdvance
  )

  const loadingLevelOrBail = orNext(
    lvIdIsAny
  ).andNext(
    lvIdIs(0x14),
    ['', 'Mem', '32bit', m(0x89970), '!=', 'Delta', '32bit', m(0x89970)]
  )

  const gamePaused = $.one(['', 'Mem', '32bit', m(0x089010), '!=', 'Value', '', 0])
  const gameNotPaused = gamePaused.with({ cmp: '=' })

  const levelSkipCheat = $(
    ['AndNext', 'Delta', '32bit', m(0x88b1c), '=', 'Value', '', 7],
    ['AndNext', 'Mem', '32bit', m(0x88b1c), '=', 'Value', '', 0],
    lvIsFinished
  )

  const ammoCheat = $(
    ['OrNext', 'Mem', '32bit', m(0x1ddf94), '!=', 'Delta', '32bit', m(0x1ddf94)],
    ['OrNext', 'Mem', '32bit', m(0x1ddfa0), '!=', 'Delta', '32bit', m(0x1ddfa0)],
    ['AndNext', 'Mem', '32bit', m(0x1ddfac), '!=', 'Delta', '32bit', m(0x1ddfac)],
    gamePaused
  )

  const pickupCountIs = (count: number) => $.one(['', 'Mem', '8bit', m(0x09280e), '=', 'Value', '', count])
  const killCountIs = (count: number) => $.one(['', 'Mem', '32bit', m(0x0927fc), '=', 'Value', '', count])
  const secretCountIs = (count: number) => $.one(['', 'Mem', 'BitCount', m(0x092800), '=', 'Value', '', count])
  const secretCountWentPast = (count: number) => andNext(
    ['', 'Delta', 'BitCount', m(0x092800), '=', 'Value', '', count - 1],
    ['', 'Mem', 'BitCount', m(0x092800), '=', 'Value', '', count]
  )

  const measured = {
    level: $.one(['Measured', 'Mem', '8bit', m(0x87580)]),
    pickups: $.one(['Measured', 'Mem', '8bit', m(0x09280e)]),
    kills: $.one(['Measured', 'Mem', '32bit', m(0x0927fc)]),
    secrets: $.one(['Measured', 'Mem', 'BitCount', m(0x092800)]),
    health: $(
      ['AddAddress', 'Mem', '24bit', m(0x89eac)],
      ['Measured', 'Mem', '16bit', 0x22, '*', 'Float', '', 0.1]
    ),
    frames: $.one(['Measured', 'Mem', '32bit', m(0x927f8), '*', 'Value', '', 2])
  }

  const itemRing = (addr: number) => ({
    itemCountIsGte: (count: number) => $.one(['', 'Mem', '16bit', addr, '>=', 'Value', '', count]),

    slot(slot: number) {
      const countAddr = addr + 0x8 + slot * 2
      const ptrAddr = addr + 0x38 + slot * 4

      return {
        changed: $.one(['', 'Mem', '24bit', ptrAddr, '!=', 'Delta', '24bit', ptrAddr]),
        hasId: (id: number) => $(
          ['AddAddress', 'Mem', '24bit', ptrAddr],
          ['', 'Mem', '16bit', 0x4, '=', 'Value', '', id]
        ),

        countAddSource: $.one(['AddSource', 'Mem', '16bit', countAddr]),
        countIncreased: $.one(['', 'Mem', '16bit', countAddr, '!=', 'Delta', '16bit', countAddr]),
      }
    }
  })

  const hasIllegalWeaponsOnLv = (lvId: number) => {
    const { maxWeapon } = levelMeta[lvId]
    if (maxWeapon === 'uzi') {
      return $()
    }

    const baseRing = itemRing(m(0x088644))
    return $(
      ...[2, 3, 4, 5, 6].map(slot => andNext(
        baseRing.itemCountIsGte(slot + 1),
        maxWeapon === 'magnums' && $(
          baseRing.slot(slot).hasId(0x66)
        ),
        maxWeapon !== 'magnums' && $(
          baseRing.slot(slot).hasId(weapons[maxWeapon] + 1).withLast({ cmp: '>=' }),
          baseRing.slot(slot).hasId(0x66).withLast({ cmp: '<=' }),
        ),
      ))
    )
  }

  const lara = (() => {
    const base = $.one(['AddAddress', 'Mem', '24bit', m(0x89eac)])

    return {
      healedOrDied: $(
        base,
        ['', 'Mem', '16bit', 0x22, '>', 'Delta', '16bit', 0x22],
      ),

      gotHurt: $(
        base,
        ['', 'Mem', '16bit', 0x22, '<', 'Delta', '16bit', 0x22],
      ),

      didHandstand: andNext(
        base,
        ['', 'Delta', '16bit', 0x10, '=', 'Value', '', 0xA],
        base,
        ['', 'Mem', '16bit', 0x10, '=', 'Value', '', 0x36],
      ),
      divedIntoWater: andNext(
        base,
        ['', 'Delta', '16bit', 0x10, '=', 'Value', '', 0x35],
        base,
        ['', 'Mem', '16bit', 0x10, '=', 'Value', '', 0x23],
      ),
      divedIntoGround: $(
        base,
        ['OrNext', 'Mem', '16bit', 0x10, '=', 'Value', '', 0x8],
        base,
        ['AndNext', 'Mem', '16bit', 0x10, '=', 'Value', '', 0x9],
        base,
        ['', 'Delta', '16bit', 0x10, '=', 'Value', '', 0x35],
      ),
      notDivingDelta: andNext(
        base,
        ['', 'Delta', '16bit', 0x10, '!=', 'Value', '', 0x34],
        base,
        ['', 'Delta', '16bit', 0x10, '!=', 'Value', '', 0x35],
      ),
      turningIntoGold: andNext(
        base,
        ['', 'Delta', '16bit', 0x10, '!=', 'Value', '', 0x33],
        base,
        ['', 'Mem', '16bit', 0x10, '=', 'Value', '', 0x33],
      ),

      isInside: ({ x, y, z, yAdjust = 0 }: Coords) => andNext(
        base,
        ['', 'Mem', '32bit', 0x30, '>=', 'Value', '', x[0]],
        base,
        ['', 'Mem', '32bit', 0x30, '<=', 'Value', '', x[1]],

        yAdjust > 0 && ['AddSource', 'Value', '', yAdjust],
        base,
        ['', 'Mem', '32bit', 0x34, '>=', 'Value', '', y[0] + yAdjust],
        yAdjust > 0 && ['AddSource', 'Value', '', yAdjust],
        base,
        ['', 'Mem', '32bit', 0x34, '<=', 'Value', '', y[1] + yAdjust],

        base,
        ['', 'Mem', '32bit', 0x38, '>=', 'Value', '', z[0]],
        base,
        ['', 'Mem', '32bit', 0x38, '<=', 'Value', '', z[1]]
      ),

      isOutside: ({ x, y, z, yAdjust = 0 }: Coords) => orNext(
        base,
        ['', 'Mem', '32bit', 0x30, '<', 'Value', '', x[0]],
        base,
        ['', 'Mem', '32bit', 0x30, '>', 'Value', '', x[1]],

        yAdjust > 0 && ['AddSource', 'Value', '', yAdjust],
        base,
        ['', 'Mem', '32bit', 0x34, '<', 'Value', '', y[0] + yAdjust],
        yAdjust > 0 && ['AddSource', 'Value', '', yAdjust],
        base,
        ['', 'Mem', '32bit', 0x34, '>', 'Value', '', y[1] + yAdjust],

        base,
        ['', 'Mem', '32bit', 0x38, '<', 'Value', '', z[0]],
        base,
        ['', 'Mem', '32bit', 0x38, '>', 'Value', '', z[1]],
      ),

      xPos: {
        between: (a: number, b: number) => andNext(
          base,
          ['', 'Mem', '32bit', 0x30, '>=', 'Value', '', a],
          base,
          ['', 'Mem', '32bit', 0x30, '<=', 'Value', '', b]
        ),
        pastDescending: (a: number) => andNext(
          base,
          ['', 'Mem', '32bit', 0x30, '<', 'Value', '', a],
          base,
          ['', 'Delta', '32bit', 0x30, '>=', 'Value', '', a]
        ),
        pastAscending: (a: number) => andNext(
          base,
          ['', 'Mem', '32bit', 0x30, '>=', 'Value', '', a],
          base,
          ['', 'Delta', '32bit', 0x30, '<', 'Value', '', a]
        ),
      },
      yPos: {
        is: (a: number) => andNext(
          base,
          ['', 'Mem', '32bit', 0x34, '=', 'Value', '', a]
        ),
        gte: (a: number) => andNext(
          base,
          ['', 'Mem', '32bit', 0x34, '>=', 'Value', '', a]
        ),
        between: (a: number, b: number) => andNext(
          base,
          a >= 0 && ['', 'Mem', '32bit', 0x34, '>=', 'Value', '', a],
          a < 0 && ['', 'Mem', '32bit', 0x34, '>=', 'Value', '', 4294967295 + a],
          base,
          ['', 'Mem', '32bit', 0x34, '<=', 'Value', '', b]
        )
      },
      zPos: {
        between: (a: number, b: number) => andNext(
          base,
          ['', 'Mem', '32bit', 0x38, '>=', 'Value', '', a],
          base,
          ['', 'Mem', '32bit', 0x38, '<=', 'Value', '', b]
        )
      }
    }
  })()

  const item = (i: number) => {
    const base = $(
      ['AddAddress', 'Mem', '24bit', m(0x089afc)]
    )

    const offset = i * 0x48

    return {
      stateIsNot: (i: number) => $(
        base,
        ['', 'Mem', '16bit', offset + 0x10, '!=', 'Value', '', i]
      ),

      addSourceBit2: $(
        base,
        ['AddSource', 'Mem', 'Bit2', offset + 0x44]
      ),

      lo4FlagsAre: (i: number) => $(
        base,
        ['', 'Mem', 'Lower4', offset + 0x44, '=', 'Value', '', i]
      ),
      lo4FlagsWere: (i: number) => $(
        base,
        ['', 'Delta', 'Lower4', offset + 0x44, '=', 'Value', '', i]
      ),

      weirdFuseCheck: $(
        base,
        ['', 'Mem', '16bit', offset + 0x28, '!=', 'Value', '', 0]
      ),

      // Enemies can underflow into negative health, hence 0x8000 check
      died: $(
        base,
        ['OrNext', 'Mem', '16bit', offset + 0x22, '=', 'Value', '', 0],
        base,
        ['AndNext', 'Mem', '16bit', offset + 0x22, '>=', 'Value', '', 0x8000],
        base,
        ['', 'Mem', '16bit', offset + 0x22, '!=', 'Delta', '16bit', offset + 0x22]
      )
    }
  }

  const midasBladeSecret = andNext(
    lara.xPos.pastDescending(62300),
    lara.zPos.between(60450, 61400)
  )
  const pyramidFinalSecret = orNext(
    lara.yPos.is(0)
  ).andNext(
    lara.yPos.gte(-768),
    lara.xPos.pastAscending(67700),
    lara.zPos.between(51250, 52250)
  )


  const forFirstPlaythrough = ({ lvId, oneSession = false }: { lvId: number, oneSession?: boolean }) => ({
    start: andNext(
      lvIdIs(lvId),
      lvIsNotFinished,
      !oneSession && frameAdvance,
      oneSession && frameFirst
    ),

    resetArray: [
      loadingLevelOrBail,
      ammoCheat,
      isNewGamePlus,
      hasIllegalWeaponsOnLv(lvId)
    ]
  })

  const forAnyPlaythrough = ({ lvId }: { lvId: number }) => ({
    start: andNext(
      lvIdIs(lvId),
      lvIsNotFinished,
      frameAdvance
    ),

    resetArray: [
      loadingLevelOrBail,
      andNext(
        ammoCheat,
        isNotNewGamePlus
      ),
      hasIllegalWeaponsOnLv(lvId)
    ]
  })

  const forLvComplete = (params: { lvId: number, oneSession?: boolean }) => {
    const { lvId } = params
    const { cutsceneId } = levelMeta[lvId]
    const c = forFirstPlaythrough(params)

    return {
      start: c.start,
      trigger: andNext(
        lvIsFinished,
        cutsceneId && lvIdIs(cutsceneId)
      ),
      resetArray: [
        levelSkipCheat,
        ...c.resetArray
      ]
    }
  }

  const forExtremeRaider = ({
    lvId,
    allPickups = false,
    allKills = false,
    maxWeapon
  }: ExtremeRaiderParams) => {
    const { cutsceneId, kills, pickups, secrets } = levelMeta[lvId]

    const shotIllegalWeapons = (maxWeapon: Weapon) => {
      const weaponId = weapons[maxWeapon]

      return orNext(
        weaponId <= 0x65 && ['', 'Mem', '32bit', m(0x1ddfa8), '>', 'Delta', '32bit', m(0x1ddfa8)],
        weaponId <= 0x64 && ['', 'Mem', '32bit', m(0x1ddf9c), '>', 'Delta', '32bit', m(0x1ddf9c)],
        weaponId <= 0x63 && ['', 'Mem', '32bit', m(0x1ddfb4), '>', 'Delta', '32bit', m(0x1ddfb4)]
      )
    }

    const loadLevelExploit = $(
      ['OrNext', 'Mem', '32bit', m(0x0927f8), '!=', 'Delta', '32bit', m(0x0927f8)],
      ['OrNext', 'Mem', '32bit', m(0x0927fc), '!=', 'Delta', '32bit', m(0x0927fc)],
      ['OrNext', 'Mem', '8bit', m(0x092800), '!=', 'Delta', '8bit', m(0x092800)],
      ['AndNext', 'Mem', '8bit', m(0x09280e), '!=', 'Delta', '8bit', m(0x09280e)],
      gamePaused,
    )

    return {
      start: andNext(
        lvIdIs(lvId),
        frameFirst
      ),

      trigger: andNext(
        lvIsFinished,
        cutsceneId && lvIdIs(cutsceneId),
        secretCountIs(secrets),
        allKills && killCountIs(kills),
        allPickups && pickupCountIs(pickups)
      ),

      triggerSecrets: $(
        lvId === 7 && !allPickups && midasBladeSecret,
        lvId === 15 && pyramidFinalSecret
      ),

      resetArray: [
        loadingLevelOrBail,
        levelSkipCheat,
        andNext(
          ammoCheat,
          isNotNewGamePlus
        ),
        lara.healedOrDied,
        loadLevelExploit,
        shotIllegalWeapons(maxWeapon ?? levelMeta[lvId].maxWeapon),
      ]
    }
  }

  return {
    regionCheck,
    pauseIfRegionCheck,
    lara,
    item,
    lvIdIs,
    loadingLevelOrBail,
    gameNotPaused,

    lvIsFinished,
    lvIsNotFinished,
    levelSkipCheat,

    keyRing: itemRing(m(0x0886d8)),

    frameAdvance,
    killCountIs,

    measured,

    larasHomeAchievement: $(
      pauseIfRegionCheck,
      andNext(
        'once',
        lvIdIs(0),
        lvIsNotFinished,
        frameAdvance
      ),
      lvIsFinished,
      resetIf(levelSkipCheat),
      resetIf(loadingLevelOrBail)
    ),

    lvCompleteAchievement: (params: { lvId: number, oneSession?: boolean }) => {
      const c = forLvComplete(params)

      return $(
        pauseIfRegionCheck,
        once(c.start),
        c.trigger,
        resetIf(...c.resetArray)
      )
    },

    firstPlaythroughAchievement(params: {
      lvId: number,
      conditions: ConditionBuilder
    }) {
      const c = forFirstPlaythrough(params)

      return $(
        pauseIfRegionCheck,
        once(c.start),
        params.conditions,
        resetIf(...c.resetArray)
      )
    },

    anyPlaythroughAchievement(params: {
      lvId: number,
      conditions: ConditionBuilder
    }) {
      const c = forAnyPlaythrough(params)
      return $(
        pauseIfRegionCheck,
        once(c.start),
        params.conditions,
        resetIf(...c.resetArray)
      )
    },

    noKillsPlaythroughAchievement({
      lvId,
      triggerIcon = true,
      oneSession = false
    }: {
      lvId: number,
      triggerIcon?: boolean,
      oneSession?: boolean
    }) {
      return $(
        pauseIfRegionCheck,
        andNext(
          'once',
          lvIdIs(lvId),
          lvIsNotFinished,
          !oneSession && frameAdvance,
          oneSession && frameFirst,
          killCountIs(0),
        ),

        triggerIcon ? trigger(lvIsFinished) : lvIsFinished,
        resetIf(
          loadingLevelOrBail,
          levelSkipCheat,
          killCountIs(0).with({ cmp: '>' })
        )
      )
    },

    extremeRaiderConditions(params: ExtremeRaiderParams) {
      const c = forExtremeRaider(params)
      const { triggerIcon = true } = params

      return $(
        pauseIfRegionCheck,

        once(c.start),
        triggerIcon ? trigger(c.trigger) : c.trigger,
        resetIf(...c.resetArray),
        once(triggerIcon ? trigger(c.triggerSecrets) : c.triggerSecrets)
      )
    },

    weaponObtainedAchievement(weapon: Weapon) {
      return $(
        pauseIfRegionCheck,
        lvIdIsAny,
        gameNotPaused,

        weapon === 'shotgun' && ['', 'Mem', '32bit', m(0x1ddfac), '>', 'Delta', '32bit', m(0x1ddfac)],
        weapon === 'magnums' && ['', 'Mem', '32bit', m(0x1ddf94), '>', 'Delta', '32bit', m(0x1ddf94)]
      )
    },

    secretsFoundAchievement(params: { lvId: number }) {
      const { lvId } = params
      const { secrets } = levelMeta[lvId]
      const c = forAnyPlaythrough(params)

      return $(
        pauseIfRegionCheck,
        once(c.start),

        lvId !== 15 && andNext(
          gameNotPaused,
          secretCountWentPast(secrets)
        ),
        lvId === 15 && secretCountIs(secrets),

        resetIf(...c.resetArray),

        lvId === 15 && once(pyramidFinalSecret)
      )
    },

    diveAchievement({ lvId,
      coords,
      type,
      startAdjust = $(),
      triggerAdjust = $()
    }: {
      lvId: number,
      coords: Coords,
      type: 'ground' | 'water',
      startAdjust?: ConditionBuilder,
      triggerAdjust?: ConditionBuilder,
    }) {
      return $(
        pauseIfRegionCheck,
        andNext(
          'once',
          startAdjust,
          lvIdIs(lvId),
          lara.isInside(coords)
        ),

        trigger(
          andNext(
            type === 'ground' && lara.divedIntoGround,
            type === 'water' && lara.divedIntoWater,
            triggerAdjust
          )
        ),

        resetIf(loadingLevelOrBail),
        resetIf(
          andNext(
            lara.isOutside(coords),
            lara.notDivingDelta
          )
        )
      )
    },

    handStandAchievement({ lvId, coords, triggerAdjust = $() }: {
      lvId: number,
      coords: Coords,
      triggerAdjust?: ConditionBuilder
    }) {
      return $(
        pauseIfRegionCheck,
        andNext(
          'once',
          lvIdIs(lvId),
          lara.isInside(coords)
        ),

        trigger(
          andNext(
            lara.didHandstand,
            triggerAdjust
          )
        ),

        resetIf(loadingLevelOrBail),
        resetIf(lara.isOutside(coords))
      )
    }
  }
}

const _c = {
  ntsc: codeFor('ntsc'),
  rev1: codeFor('rev1'),
  pal: codeFor('pal'),
}

function multiRegionalConditions(cb: (code: ReturnType<typeof codeFor>, region: Region) => any) {
  return {
    core: 'hcafe=hcafe',
    alt1: cb(_c.ntsc, 'ntsc'),
    alt2: cb(_c.rev1, 'rev1'),
    alt3: cb(_c.pal, 'pal'),
  }
}

function multiRegionalValue(cb: (code: ReturnType<typeof codeFor>, region: Region) => any) {
  return {
    core: cb(_c.ntsc, 'ntsc'),
    alt1: cb(_c.rev1, 'rev1'),
    alt2: cb(_c.pal, 'pal'),
  }
}

set.addAchievement({
  title: 'Home Is Where the Guide Is',
  description: `Complete "Lara's Home"`,
  points: 1,
  conditions: multiRegionalConditions(c => c.larasHomeAchievement),
  badge: '131489',
  id: 120496,
})

set.addAchievement({
  title: 'Battle in the Ancient Courtyard',
  description: `Complete "Caves"`,
  points: 5,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId: 1 })),
  badge: '131351',
  id: 120338,
})

set.addAchievement({
  title: 'A Trapped Hallway',
  description: `Complete "City of Vilcabamba"`,
  points: 5,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId: 2 })),
  badge: '131352',
  id: 120339,
})

set.addAchievement({
  title: 'Derelict Mechanism',
  description: `Complete "Lost Valley"`,
  points: 5,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId: 3 })),
  badge: '131353',
  id: 120340,
})

set.addAchievement({
  title: 'Evading Danger',
  description: `Complete "Tomb of Qualopec"`,
  points: 5,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId: 4 })),
  badge: '131354',
  id: 120341,
})

set.addAchievement({
  title: 'Architecture of the Past',
  description: `Complete "St. Francis' Folly"`,
  points: 10,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId: 5 })),
  badge: '131355',
  id: 120342,
})

set.addAchievement({
  title: 'Ruins of a Lost Civilization',
  description: `Complete "Colosseum"`,
  points: 10,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId: 6 })),
  badge: '131356',
  id: 120343,
})

set.addAchievement({
  title: 'All That Glitters...',
  description: `Complete "Palace Midas"`,
  points: 10,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId: 7 })),
  badge: '131357',
  id: 120344,
})

set.addAchievement({
  title: 'Reservoir Explorers',
  description: `Complete "The Cistern"`,
  points: 10,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId: 8 })),
  badge: '131358',
  id: 120345,
})

set.addAchievement({
  title: 'Another Deserted Place',
  description: `Complete "Tomb of Tihocan"`,
  points: 10,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId: 9 })),
  badge: '131359',
  id: 120346,
})

set.addAchievement({
  title: 'Metropolis of Yesterday',
  description: `Complete "City of Khamoon"`,
  points: 10,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId: 10 })),
  badge: '131360',
  id: 120347,
})

set.addAchievement({
  title: 'An Abandoned Chamber',
  description: `Complete "Obelisk of Khamoon"`,
  points: 10,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId: 11 })),
  badge: '131361',
  id: 120348,
})

set.addAchievement({
  title: 'Remnants of Giza',
  description: `Complete "Sanctuary of the Scion"`,
  points: 10,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId: 12 })),
  badge: '131362',
  id: 120349,
})

set.addAchievement({
  title: 'Under the Ground Deals',
  description: `Complete "Natla's Mines"`,
  points: 5,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId: 13 })),
  badge: '131363',
  id: 120350,
})

set.addAchievement({
  title: 'Sunken Costs',
  description: `Complete "Atlantis"`,
  points: 25,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId: 14 })),
  badge: '131364',
  id: 120351,
})

set.addAchievement({
  title: 'Landmark Adventurer',
  description: `Complete "The Great Pyramid" and beat the game`,
  points: 10,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId: 15 })),
  badge: '131365',
  id: 120352,
})

set.addAchievement({
  title: 'Faithful Alloys',
  description: `Obtain the Gold Idol and the Silver Key in "City of Vilcabamba"`,
  points: 5,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 2,
    conditions: $(
      orNext(
        c.item(19).lo4FlagsWere(0),
        c.item(20).lo4FlagsWere(0),
      ),
      andNext(
        c.item(19).lo4FlagsAre(6),
        c.item(20).lo4FlagsAre(6),
      ),
    )
  })),
  badge: '130153',
  id: 120353,
})

set.addAchievement({
  title: 'The Gears Are Turning',
  description: `Collect all 3 of the Machine Cogs in "Lost Valley"`,
  points: 5,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 3,
    conditions: $(
      orNext(
        c.item(33).lo4FlagsWere(0),
        c.item(40).lo4FlagsWere(0),
        c.item(53).lo4FlagsWere(0),
      ),
      andNext(
        c.item(33).lo4FlagsAre(4),
        c.item(40).lo4FlagsAre(4),
        c.item(53).lo4FlagsAre(4),
      ),
    )
  })),
  badge: '130237',
  id: 120354,
})

set.addAchievement({
  title: 'Mummy Dearest',
  description: `Obtain the first Scion piece in "Tomb of Qualopec"`,
  points: 5,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 4,
    conditions: $(
      c.item(32).lo4FlagsWere(0),
      c.item(32).lo4FlagsAre(3)
    )
  })),
  badge: '130243',
  id: 120355,
})

set.addAchievement({
  title: 'Tomb Raider Mythologies',
  description: `Collect all 4 of the keys in "St. Francis' Folly"`,
  points: 5,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 5,
    conditions: $(
      orNext(
        c.item(65).lo4FlagsWere(0),
        c.item(71).lo4FlagsWere(0),
        c.item(89).lo4FlagsWere(0),
        c.item(92).lo4FlagsWere(0),
      ),
      andNext(
        c.item(65).lo4FlagsAre(6), // neptune
        c.item(71).lo4FlagsAre(4), // damocles
        c.item(89).lo4FlagsAre(6), // thor
        c.item(92).lo4FlagsAre(6), // atlas
      ),
    )
  })),
  badge: '130248',
  id: 120356,
})

set.addAchievement({
  title: 'Backstage Pass',
  description: `Obtain the Rusty Key in "Colosseum"`,
  points: 2,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 6,
    conditions: $(
      c.item(50).lo4FlagsWere(0),
      c.item(50).lo4FlagsAre(6)
    )
  })),
  badge: '130257',
  id: 120357,
})

set.addAchievement({
  title: 'Lead Astray',
  description: `Collect all 3 Lead Bars in "Palace Midas"`,
  points: 5,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 5,
    conditions: $(
      orNext(
        c.item(22).lo4FlagsWere(0),
        c.item(40).lo4FlagsWere(0),
        c.item(66).lo4FlagsWere(0)
      ),
      andNext(
        c.item(22).lo4FlagsAre(6),
        c.item(40).lo4FlagsAre(6),
        c.item(66).lo4FlagsAre(6)
      ),
    )
  })),
  badge: '130278',
  id: 120358,
})

set.addAchievement({
  title: 'Every Time We Touch...',
  description: `Turn all 3 Lead Bars into Gold Bars in "Palace Midas"`,
  points: 5,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 7,
    conditions: $(
      orNext(
        c.keyRing.slot(0).countIncreased,
        c.keyRing.slot(0).changed
      ),
      andNext(
        c.keyRing.slot(0).hasId(0x72),
        c.item(30).addSourceBit2,
        c.item(31).addSourceBit2,
        c.item(32).addSourceBit2,
        c.keyRing.slot(0).countAddSource,
        ['', 'Value', '', 0, '=', 'Value', '', 3]
      ),
    )
  })),
  badge: '130279',
  id: 120359,
})

set.addAchievement({
  title: 'Mistress of the Elements',
  description: `Collect all 5 keys in "The Cistern"`,
  points: 5,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 8,
    conditions: $(
      orNext(
        c.item(24).lo4FlagsWere(0),
        c.item(46).lo4FlagsWere(0),
        c.item(100).lo4FlagsWere(0),
        c.item(104).lo4FlagsWere(0),
        c.item(106).lo4FlagsWere(0),
      ),
      andNext(
        c.item(24).lo4FlagsAre(6),
        c.item(46).lo4FlagsAre(4),
        c.item(100).lo4FlagsAre(6),
        c.item(104).lo4FlagsAre(3),
        c.item(106).lo4FlagsAre(3)
      ),
    )
  })),
  badge: '130281',
  id: 120360,
})

set.addAchievement({
  title: 'Archaeology Defies English',
  description: `Collect both of the Saphire Keys in "City of Khamoon"`,
  points: 3,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 10,
    conditions: $(
      orNext(
        c.item(22).lo4FlagsWere(0),
        c.item(39).lo4FlagsWere(0),
      ),
      andNext(
        c.item(22).lo4FlagsAre(6),
        c.item(39).lo4FlagsAre(6),
      ),
    )
  })),
  badge: '130337',
  id: 120361,
})

set.addAchievement({
  title: 'Healing Gaze',
  description: `Obtain the Eye of Horus in "Obelisk of Khamoon"`,
  points: 2,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 11,
    conditions: $(
      c.item(15).lo4FlagsWere(0),
      c.item(15).lo4FlagsAre(4)
    )
  })),
  badge: '130351',
  id: 120363,
})

set.addAchievement({
  title: 'Key of Life',
  description: `Obtain the Ankh in "Obelisk of Khamoon"`,
  points: 2,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 11,
    conditions: $(
      c.item(18).lo4FlagsWere(0),
      c.item(18).lo4FlagsAre(4)
    )
  })),
  badge: '130352',
  id: 120364,
})

set.addAchievement({
  title: 'Mark of the Dead',
  description: `Obtain the Seal of Anubis in "Obelisk of Khamoon"`,
  points: 2,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 11,
    conditions: $(
      c.item(17).lo4FlagsWere(0),
      c.item(17).lo4FlagsAre(4)
    )
  })),
  badge: '130396',
  id: 120365,
})

set.addAchievement({
  title: 'Solar Idol',
  description: `Obtain the Scarab in "Obelisk of Khamoon"`,
  points: 2,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 11,
    conditions: $(
      c.item(16).lo4FlagsWere(0),
      c.item(16).lo4FlagsAre(4)
    )
  })),
  badge: '130397',
  id: 120366,
})

set.addAchievement({
  title: 'Biliteral Signage',
  description: `Collect both of the Ankhs in "Sanctuary of the Scion"`,
  points: 3,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 12, conditions: $(
      orNext(
        c.item(38).lo4FlagsWere(0),
        c.item(50).lo4FlagsWere(0),
      ),
      andNext(
        c.item(38).lo4FlagsAre(6),
        c.item(50).lo4FlagsAre(6),
      ),
    )
  })),
  badge: '130440',
  id: 120367,
})

set.addAchievement({
  title: 'Unlocking Greatness',
  description: `Obtain the Pyramid Key in "Natla's Mines"`,
  points: 3,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 13,
    conditions: $(
      c.item(71).lo4FlagsWere(0),
      c.item(71).lo4FlagsAre(6)
    )
  })),
  badge: '130498',
  id: 120368,
})

set.addAchievement({
  title: 'Now, Drop It!',
  description: `Collect all 3 Fuses in "Natla's Mines"`,
  points: 5,
  conditions: multiRegionalConditions(c => c.anyPlaythroughAchievement({
    lvId: 13,
    conditions: $(
      orNext(
        c.item(16).lo4FlagsWere(0),
        c.item(36).lo4FlagsWere(0),
        c.item(42).lo4FlagsWere(0),
      ),
      andNext(
        c.item(16).lo4FlagsAre(6),
        c.item(36).lo4FlagsAre(6),
        c.item(42).lo4FlagsAre(6),
        c.item(42).weirdFuseCheck
      ),
    )
  })),
  badge: '130461',
  id: 120369,
})

set.addAchievement({
  title: 'Henchman No More',
  description: `Kill the annoying Pierre Dupont once and for all in "Tomb of Tihocan"`,
  points: 3,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 9,
    conditions: $(
      c.item(82).died
    )
  })),
  badge: '130312',
  id: 120370,
})

set.addAchievement({
  title: 'Scion Savior',
  description: `Kill Larson in "Sanctuary of the Scion"`,
  points: 3,
  conditions: multiRegionalConditions(c => c.anyPlaythroughAchievement({
    lvId: 12,
    conditions: $(
      c.item(72).died
    )
  })),
  badge: '130452',
  id: 120371,
})

set.addAchievement({
  title: 'Shootout at Low Noon',
  description: `Kill the first of Natla's men in "Natla's Mines"`,
  points: 2,
  conditions: multiRegionalConditions(c => c.anyPlaythroughAchievement({
    lvId: 13,
    conditions: $(
      c.item(17).died
    )
  })),
  badge: '130476',
  id: 120372,
})

set.addAchievement({
  title: 'Shredded Dreams',
  description: `Kill the second of Natla's men in "Natla's Mines"`,
  points: 1,
  conditions: multiRegionalConditions(c => c.anyPlaythroughAchievement({
    lvId: 13,
    conditions: $(
      c.item(50).died
    )
  })),
  badge: '130482',
  id: 120373,
})

set.addAchievement({
  title: 'The Last Blast',
  description: `Kill the third of Natla's men in "Natla's Mines"`,
  points: 1,
  conditions: multiRegionalConditions(c => c.anyPlaythroughAchievement({
    lvId: 13,
    conditions: $(
      c.item(75).died
    )
  })),
  badge: '130496',
  id: 120374,
})

set.addAchievement({
  title: 'All Crawls of Death',
  description: `Kill the legless mutant in "The Great Pyramid"`,
  points: 5,
  type: 'progression',
  conditions: multiRegionalConditions(c => c.firstPlaythroughAchievement({
    lvId: 15,
    conditions: $(
      c.item(129).died
    )
  })),
  badge: '130681',
  id: 120375,
})

set.addAchievement({
  title: `Money Isn't Power`,
  description: `Kill Jacqueline Natla in "The Great Pyramid"`,
  points: 5,
  conditions: multiRegionalConditions(c => c.anyPlaythroughAchievement({
    lvId: 15,
    conditions: $(
      c.item(101).stateIsNot(5),
      c.item(101).stateIsNot(7),
      c.item(101).died
    )
  })),
  badge: '130932',
  id: 120376,
})

set.addAchievement({
  title: `I'm One Clever Girl!`,
  description: `Kill the T-Rex in "Lost Valley" without taking damage`,
  points: 3,
  conditions: multiRegionalConditions(c => c.anyPlaythroughAchievement({
    lvId: 3,
    conditions: $(
      andNext(
        'once',
        c.gameNotPaused,
        c.item(55).lo4FlagsWere(0),
        c.item(55).lo4FlagsAre(3)
      ),
      trigger(
        c.item(55).died
      ),
      resetIf(c.lara.gotHurt)
    )
  })),
  badge: '130238',
  id: 120377,
})

set.addAchievement({
  title: 'Buckshots for Boneheads',
  description: `Obtain the Shotgun`,
  points: 2,
  conditions: multiRegionalConditions(c => c.weaponObtainedAchievement('shotgun')),
  badge: '130254',
  id: 120378,
})

set.addAchievement({
  title: 'Artillery for Athletes',
  description: `Obtain the Magnums`,
  points: 2,
  conditions: multiRegionalConditions(c => c.weaponObtainedAchievement('magnums')),
  badge: '130265',
  id: 120379,
})



set.addAchievement({
  title: 'Extreme Raider of the Caves',
  description: `Complete "Caves" with 14 kills and 3 secrets, without using Medi Packs, without loading mid-level saves`,
  points: 5,
  conditions: multiRegionalConditions(c => c.extremeRaiderConditions(extremeRaiderMeta[1])),
  badge: '131380',
  id: 120450,
})

set.addAchievement({
  title: 'Extreme Raider of the City of Vilcabamba',
  description: `Complete "City of Vilcabamba" with 3 secrets, without using Medi Packs, without loading mid-level saves`,
  points: 10,
  conditions: multiRegionalConditions(c => c.extremeRaiderConditions(extremeRaiderMeta[2])),
  badge: '131381',
  id: 120451,
})

set.addAchievement({
  title: 'Extreme Raider of the Lost Valley',
  description: `Complete "Lost Valley" with 5 secrets, without using Medi Packs, without loading mid-level saves`,
  points: 10,
  conditions: multiRegionalConditions(c => c.extremeRaiderConditions(extremeRaiderMeta[3])),
  badge: '131382',
  id: 120452,
})

set.addAchievement({
  title: 'Extreme Raider of the Tomb of Qualopec',
  description: `Complete "Tomb of Qualopec" with 8 kills, 8 pickups and 3 secrets, without using Medi Packs, without loading mid-level saves`,
  points: 10,
  conditions: multiRegionalConditions(c => c.extremeRaiderConditions(extremeRaiderMeta[4])),
  badge: '131383',
  id: 120453,
})

set.addAchievement({
  title: `Extreme Raider of St. Francis' Folly`,
  description: `Complete "St. Francis' Folly" with 19 pickups and 4 secrets, without using Medi Packs, without loading mid-level saves`,
  points: 25,
  conditions: multiRegionalConditions(c => c.extremeRaiderConditions(extremeRaiderMeta[5])),
  badge: '131384',
  id: 120454,
})

set.addAchievement({
  title: 'Extreme Raider of the Colosseum',
  description: `Complete "Colosseum" with 3 secrets, without using Medi Packs, without loading mid-level saves`,
  points: 10,
  conditions: multiRegionalConditions(c => c.extremeRaiderConditions(extremeRaiderMeta[6])),
  badge: '131385',
  id: 120455,
})

set.addAchievement({
  title: 'Extreme Raider of Palace Midas',
  description: `Complete "Palace Midas" while going past blades near one of the secrets and getting 3 secrets, without using Medi Packs, without loading mid-level saves`,
  points: 10,
  conditions: multiRegionalConditions(c => c.extremeRaiderConditions(extremeRaiderMeta[7])),
  badge: '131386',
  id: 120456,
})

set.addAchievement({
  title: 'Extreme Raider of the Cistern',
  description: `Complete "The Cistern" with 3 secrets, without using Medi Packs, without loading mid-level saves`,
  points: 10,
  conditions: multiRegionalConditions(c => c.extremeRaiderConditions(extremeRaiderMeta[8])),
  badge: '131387',
  id: 120458,
})

set.addAchievement({
  title: 'Extreme Raider of the Tomb of Tihocan',
  description: `Complete "Tomb of Tihocan" with 26 pickups and 2 secrets, without using Medi Packs, without loading mid-level saves`,
  points: 10,
  conditions: multiRegionalConditions(c => c.extremeRaiderConditions(extremeRaiderMeta[9])),
  badge: '131388',
  id: 120457,
})

set.addAchievement({
  title: 'Extreme Raider of the City of Khamoon',
  description: `Complete "City of Khamoon" with 15 kills and 3 secrets, without using Medi Packs, without loading mid-level saves`,
  points: 10,
  conditions: multiRegionalConditions(c => c.extremeRaiderConditions(extremeRaiderMeta[10])),
  badge: '131389',
  id: 120459,
})

set.addAchievement({
  title: 'Extreme Raider of the Obelisk of Khamoon',
  description: `Complete "Obelisk of Khamoon" with 16 kills, 38 pickups and 3 secrets, without using Medi Packs, without loading mid-level saves`,
  points: 25,
  conditions: multiRegionalConditions(c => c.extremeRaiderConditions(extremeRaiderMeta[11])),
  badge: '131390',
  id: 120460,
})

set.addAchievement({
  title: 'Extreme Raider of the Sanctuary of the Scion',
  description: `Complete "Sanctuary of the Scion" with 15 kills and 1 secret, without using Medi Packs, without loading mid-level saves`,
  points: 25,
  conditions: multiRegionalConditions(c => c.extremeRaiderConditions(extremeRaiderMeta[12])),
  badge: '131391',
  id: 120461,
})

set.addAchievement({
  title: `Extreme Raider of Natla's Mines`,
  description: `Complete "Natla's Mines" using Pistols only, with 3 kills and 3 secrets, without using Medi Packs, without loading mid-level saves`,
  points: 25,
  conditions: multiRegionalConditions(c => c.extremeRaiderConditions(extremeRaiderMeta[13])),
  badge: '131392',
  id: 120462,
})

set.addAchievement({
  title: 'Extreme Raider of Atlantis',
  description: `Complete "Atlantis" with 32 kills and 3 secrets, without using Medi Packs, without loading mid-level saves`,
  points: 50,
  conditions: multiRegionalConditions(c => c.extremeRaiderConditions(extremeRaiderMeta[14])),
  badge: '131393',
  id: 120463,
})

set.addAchievement({
  title: 'Extreme Raider of the Great Pyramid',
  description: `Complete "The Great Pyramid" with 6 kills and 3 secrets, without using Medi Packs, without loading mid-level saves`,
  points: 25,
  conditions: multiRegionalConditions(c => c.extremeRaiderConditions(extremeRaiderMeta[15])),
  badge: '131394',
  id: 120464,
})

set.addAchievement({
  title: 'Lara the Explorer in the Caves',
  description: `Find all 3 secrets in "Caves"`,
  points: 3,
  conditions: multiRegionalConditions(c => c.secretsFoundAchievement({ lvId: 1 })),
  badge: '131366',
  id: 120465,
})

set.addAchievement({
  title: 'Lara the Explorer in the City of Vilcabamba',
  description: `Find all 3 secrets in "City of Vilcabamba"`,
  points: 3,
  conditions: multiRegionalConditions(c => c.secretsFoundAchievement({ lvId: 2 })),
  badge: '131367',
  id: 120466,
})

set.addAchievement({
  title: 'Lara the Explorer in the Lost Valley',
  description: `Find all 5 secrets in "Lost Valley"`,
  points: 5,
  conditions: multiRegionalConditions(c => c.secretsFoundAchievement({ lvId: 3 })),
  badge: '131368',
  id: 120467,
})

set.addAchievement({
  title: 'Lara the Explorer in the Tomb of Qualopec',
  description: `Find all 3 secrets in "Tomb of Qualopec"`,
  points: 3,
  conditions: multiRegionalConditions(c => c.secretsFoundAchievement({ lvId: 4 })),
  badge: '131369',
  id: 120468,
})

set.addAchievement({
  title: `Lara the Explorer in St. Francis' Folly`,
  description: `Find all 4 secrets in "St. Francis' Folly"`,
  points: 5,
  conditions: multiRegionalConditions(c => c.secretsFoundAchievement({ lvId: 5 })),
  badge: '131370',
  id: 120469,
})

set.addAchievement({
  title: 'Lara the Explorer in the Colosseum',
  description: `Find all 3 secrets in "Colosseum"`,
  points: 4,
  conditions: multiRegionalConditions(c => c.secretsFoundAchievement({ lvId: 6 })),
  badge: '131371',
  id: 120470,
})

set.addAchievement({
  title: 'Lara the Explorer in Palace Midas',
  description: `Find all 3 secrets in "Palace Midas"`,
  points: 3,
  conditions: multiRegionalConditions(c => c.secretsFoundAchievement({ lvId: 7 })),
  badge: '131372',
  id: 120471,
})

set.addAchievement({
  title: 'Lara the Explorer in the Cistern',
  description: `Find all 3 secrets in "The Cistern"`,
  points: 3,
  conditions: multiRegionalConditions(c => c.secretsFoundAchievement({ lvId: 8 })),
  badge: '131373',
  id: 120472,
})

set.addAchievement({
  title: 'Lara the Explorer in the Tomb of Tihocan',
  description: `Find both of the secrets in "Tomb of Tihocan"`,
  points: 3,
  conditions: multiRegionalConditions(c => c.secretsFoundAchievement({ lvId: 9 })),
  badge: '131374',
  id: 120473,
})

set.addAchievement({
  title: 'Lara the Explorer in the City of Khamoon',
  description: `Find all 3 secrets in "City of Khamoon"`,
  points: 3,
  conditions: multiRegionalConditions(c => c.secretsFoundAchievement({ lvId: 10 })),
  badge: '131375',
  id: 120474,
})

set.addAchievement({
  title: 'Lara the Explorer in the Obelisk of Khamoon',
  description: `Find all 3 secrets in "Obelisk of Khamoon"`,
  points: 3,
  conditions: multiRegionalConditions(c => c.secretsFoundAchievement({ lvId: 11 })),
  badge: '131376',
  id: 120475,
})

set.addAchievement({
  title: 'Bullet-Riddled Sphinx',
  description: `Obtain the uzis in "Sanctuary of the Scion"`,
  points: 1,
  conditions: multiRegionalConditions(c => c.secretsFoundAchievement({ lvId: 12 })),
  badge: '130434',
  id: 120380,
})

set.addAchievement({
  title: `Lara the Explorer in Natla's Mines`,
  description: `Find all 3 secrets in "Natla's Mines"`,
  points: 4,
  conditions: multiRegionalConditions(c => c.secretsFoundAchievement({ lvId: 13 })),
  badge: '131377',
  id: 120476,
})

set.addAchievement({
  title: 'Lara the Explorer in Atlantis',
  description: `Find all 3 secrets in "Atlantis"`,
  points: 3,
  conditions: multiRegionalConditions(c => c.secretsFoundAchievement({ lvId: 14 })),
  badge: '131378',
  id: 120477,
})

set.addAchievement({
  title: 'Lara the Explorer in the Great Pyramid',
  description: `Find all 3 secrets in "The Great Pyramid"`,
  points: 5,
  conditions: multiRegionalConditions(c => c.secretsFoundAchievement({ lvId: 15 })),
  badge: '131379',
  id: 120478,
})

set.addAchievement({
  title: 'No Animals Were Harmed',
  description: `Complete "Caves" without killing any animals`,
  points: 5,
  conditions: multiRegionalConditions(c => c.noKillsPlaythroughAchievement({ lvId: 1, })),
  badge: '131461',
  id: 120491,
})

set.addAchievement({
  title: 'Exotic Retreat',
  description: `Dive into the water at the start of "Lost Valley"`,
  points: 1,
  conditions: multiRegionalConditions(c => c.diveAchievement({
    lvId: 3,
    type: 'water',
    coords: {
      x: [32800, 39000],
      y: [-1050, 500], yAdjust: 2000,
      z: [69700, 72200],
    }
  })),
  badge: '130192',
  id: 120479,
})

set.addAchievement({
  title: `Ms. Croft's Fall-y`,
  description: `Dive into the ground from the top of the shaft in "St. Francis' Folly"`,
  points: 1,
  conditions: multiRegionalConditions(c => c.diveAchievement({
    lvId: 5,
    type: 'ground',
    triggerAdjust: c.lara.yPos.is(0x5c00),
    coords: {
      x: [34899, 42000],
      y: [10300, 11800],
      z: [35900, 46000],
    }
  })),
  badge: '130247',
  id: 120480,
})

set.addAchievement({
  title: 'Thrown to the Lions',
  description: `Dive into the underground spike pit in "Colosseum" from the highest point you can`,
  points: 2,
  conditions: multiRegionalConditions(c => c.diveAchievement({
    lvId: 6,
    type: 'ground',
    triggerAdjust: c.lara.yPos.is(0xb00),
    coords: {
      x: [46170, 47010],
      y: [-7800, -6100], yAdjust: 10000,
      z: [60500, 62400],
    }
  })),
  badge: '130253',
  id: 120481,
})

set.addAchievement({
  title: 'The Seventh Seal',
  description: `Dive off the roof into nearest spike pit at the end of "The Cistern"`,
  points: 2,
  conditions: multiRegionalConditions(c => c.diveAchievement({
    lvId: 8,
    type: 'ground',
    triggerAdjust: $(
      c.lara.isInside({
        x: [39000, 39815],
        y: [-5700, -5000], yAdjust: 6000,
        z: [27770, 28550]
      })
    ),
    coords: {
      x: [33800, 47100],
      y: [-10240, -8490], yAdjust: 12000,
      z: [24400, 26600],
    }
  })),
  badge: '130282',
  id: 120482,
})

set.addAchievement({
  title: 'Professor Splash',
  description: `Dive into the small square of water in "Tomb of Tihocan" near the swinging axe, from the highest point you can`,
  points: 2,
  conditions: multiRegionalConditions(c => c.diveAchievement({
    lvId: 9,
    type: 'water',
    coords: {
      x: [42700, 43940],
      y: [-6810, -5900], yAdjust: 12000,
      z: [75800, 77100],
    }
  })),
  badge: '130283',
  id: 120483,
})

set.addAchievement({
  title: 'Pillar of Humanity',
  description: `Dive into the Central Obelisk from the mirror room in "Obelisk of Khamoon"`,
  points: 2,
  conditions: multiRegionalConditions(c => c.diveAchievement({
    lvId: 11,
    type: 'ground',
    triggerAdjust: c.lara.yPos.is(-7680),
    coords: {
      x: [43000, 45300],
      y: [-12000, -10500], yAdjust: 14000,
      z: [52300, 57300],
    }
  })),
  badge: '130395',
  id: 120484,
})

set.addAchievement({
  title: 'Trust Exercise',
  description: `After draining the water in "Sanctuary of the Scion", do a clean dive between the Sphinx's legs`,
  points: 2,
  conditions: multiRegionalConditions(c => c.diveAchievement({
    lvId: 12,
    type: 'water',
    startAdjust: c.item(54).lo4FlagsAre(4),
    triggerAdjust: c.lara.yPos.between(18400, 18700),
    coords: {
      x: [43100, 46000],
      y: [-3300, -40], yAdjust: 5000,
      z: [46100, 51100],
    }
  })),
  badge: '130450',
  id: 120485,
})

set.addAchievement({
  title: 'Human Landmark',
  description: `Perform a handstand on center of the building with the second secret in "Lost Valley"`,
  points: 1,
  conditions: multiRegionalConditions(c => c.handStandAchievement({
    lvId: 3,
    coords: {
      x: [65300, 67500],
      y: [-3600, -1800], yAdjust: 4000,
      z: [11300, 12200],
    }
  })),
  badge: '130239',
  id: 120486,
})

set.addAchievement({
  title: 'Now for the Real Show!',
  description: `Perform a handstand on the balcony in "Colosseum"`,
  points: 1,
  conditions: multiRegionalConditions(c => c.handStandAchievement({
    lvId: 6,
    coords: {
      x: [39000, 40300],
      y: [-5200, -3800], yAdjust: 10000,
      z: [46200, 50000],
    }
  })),
  badge: '130256',
  id: 120487,
})

set.addAchievement({
  title: 'Ancient Show-Off',
  description: `Perform a handstand on the Central Obelisk in "Obelisk of Khamoon"`,
  points: 1,
  conditions: multiRegionalConditions(c => c.handStandAchievement({
    lvId: 11,
    coords: {
      x: [48822, 50300],
      y: [-8700, -6900], yAdjust: 10000,
      z: [56100, 57560],
    }
  })),
  badge: '130342',
  id: 120488,
})

set.addAchievement({
  title: 'Smells Like Egyptian Spirit',
  description: `Perform a handstand on the hidden platform inside the Sphinx's nose in "Sanctuary of the Scion"`,
  points: 1,
  conditions: multiRegionalConditions(c => c.handStandAchievement({
    lvId: 12,
    coords: {
      x: [44000, 46200],
      y: [-12400, -7900], yAdjust: 14000,
      z: [47000, 50300],
    },
    triggerAdjust: c.lara.yPos.is(-7979)
  })),
  badge: '130398',
  id: 120489,
})

set.addAchievement({
  title: 'What Am I, Made of Money?',
  description: `Get turned into gold in "Palace Midas"`,
  points: 1,
  conditions: multiRegionalConditions(c => $(
    c.pauseIfRegionCheck,
    c.lvIdIs(7),
    c.lara.turningIntoGold
  )),
  badge: '130267',
  id: 120490,
})

set.addLeaderboard({
  title: `Lara's Home`,
  description: `Fastest time to beat "Lara's Home"`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.larasHomeAchievement),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  },
  id: 5782,
})

set.addLeaderboard({
  title: 'No Animals Were Harmed',
  description: 'Fastest time to beat complete "Caves" without killing any animals',
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.noKillsPlaythroughAchievement({ lvId: 1, triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  },
  id: 9078,
})

for (let lvId = 1; lvId <= 15; lvId++) {
  const title = levelNames[lvId]

  set.addLeaderboard({
    title,
    description: `Fastest time to beat "${title}"`,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: multiRegionalConditions(c => c.lvCompleteAchievement({ lvId, oneSession: true })),
      cancel: '0=1',
      submit: '1=1',
      value: multiRegionalValue(c => $(
        measuredIf(c.regionCheck),
        c.measured.frames
      ))
    }
  })

  set.addLeaderboard({
    title: `Extreme Raider Classic - ${title}`,
    description: `Fastest time to beat "${title}" with pistols only, all kills, pickups and secrets, without using Medi Packs`,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: multiRegionalConditions(c => c.extremeRaiderConditions({
        lvId,
        allKills: true,
        allPickups: true,
        maxWeapon: 'pistols',
        triggerIcon: false
      })),
      cancel: '0=1',
      submit: '1=1',
      value: multiRegionalValue(c => $(
        measuredIf(c.regionCheck),
        c.measured.frames
      ))
    }
  })
}

set.addLeaderboard({
  title: 'Extreme Raider of the Caves',
  description: `Fastest time to beat "Caves" with 14 kills and 3 secrets, without using Medi Packs`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.extremeRaiderConditions({ ...extremeRaiderMeta[1], triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  }
})

set.addLeaderboard({
  title: 'Extreme Raider of the City of Vilcabamba',
  description: `Fastest time to beat "City of Vilcabamba" with 3 secrets, without using Medi Packs`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.extremeRaiderConditions({ ...extremeRaiderMeta[2], triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  }
})

set.addLeaderboard({
  title: 'Extreme Raider of the Lost Valley',
  description: `Fastest time to beat "Lost Valley" with 5 secrets, without using Medi Packs`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.extremeRaiderConditions({ ...extremeRaiderMeta[3], triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  }
})

set.addLeaderboard({
  title: 'Extreme Raider of the Tomb of Qualopec',
  description: `Fastest time to beat "Tomb of Qualopec" with 8 kills, 8 pickups and 3 secrets, without using Medi Packs`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.extremeRaiderConditions({ ...extremeRaiderMeta[4], triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  }
})

set.addLeaderboard({
  title: `Extreme Raider of St. Francis' Folly`,
  description: `Fastest time to beat "St. Francis' Folly" with 19 pickups and 4 secrets, without using Medi Packs`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.extremeRaiderConditions({ ...extremeRaiderMeta[5], triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  }
})

set.addLeaderboard({
  title: 'Extreme Raider of the Colosseum',
  description: `Fastest time to beat "Colosseum" with 3 secrets, without using Medi Packs`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.extremeRaiderConditions({ ...extremeRaiderMeta[6], triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  }
})

set.addLeaderboard({
  title: 'Extreme Raider of Palace Midas',
  description: `Fastest time to beat "Palace Midas" while going past blades near one of the secrets and getting 3 secrets, without using Medi Packs`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.extremeRaiderConditions({ ...extremeRaiderMeta[7], triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  }
})

set.addLeaderboard({
  title: 'Extreme Raider of the Cistern',
  description: `Fastest time to beat "The Cistern" with 3 secrets, without using Medi Packs`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.extremeRaiderConditions({ ...extremeRaiderMeta[8], triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  }
})

set.addLeaderboard({
  title: 'Extreme Raider of the Tomb of Tihocan',
  description: `Fastest time to beat "Tomb of Tihocan" with 26 pickups and 2 secrets, without using Medi Packs`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.extremeRaiderConditions({ ...extremeRaiderMeta[9], triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  }
})

set.addLeaderboard({
  title: 'Extreme Raider of the City of Khamoon',
  description: `Fastest time to beat "City of Khamoon" with 15 kills and 3 secrets, without using Medi Packs`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.extremeRaiderConditions({ ...extremeRaiderMeta[10], triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  }
})

set.addLeaderboard({
  title: 'Extreme Raider of the Obelisk of Khamoon',
  description: `Fastest time to beat "Obelisk of Khamoon" with 16 kills, 38 pickups and 3 secrets, without using Medi Packs`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.extremeRaiderConditions({ ...extremeRaiderMeta[11], triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  }
})

set.addLeaderboard({
  title: 'Extreme Raider of the Sanctuary of the Scion',
  description: `Fastest time to beat "Sanctuary of the Scion" with 15 kills and 1 secret, without using Medi Packs`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.extremeRaiderConditions({ ...extremeRaiderMeta[12], triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  }
})

set.addLeaderboard({
  title: `Extreme Raider of Natla's Mines`,
  description: `Fastest time to beat "Natla's Mines" using Pistols only, with 3 kills and 3 secrets, without using Medi Packs`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.extremeRaiderConditions({ ...extremeRaiderMeta[13], triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  }
})

set.addLeaderboard({
  title: 'Extreme Raider of Atlantis',
  description: `Fastest time to beat "Atlantis" with 32 kills and 3 secrets, without using Medi Packs`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.extremeRaiderConditions({ ...extremeRaiderMeta[14], triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  }
})

set.addLeaderboard({
  title: 'Extreme Raider of the Great Pyramid',
  description: `Fastest time to beat "The Great Pyramid" with 6 kills and 3 secrets, without using Medi Packs`,
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: multiRegionalConditions(c => c.extremeRaiderConditions({ ...extremeRaiderMeta[15], triggerIcon: false })),
    cancel: '0=1',
    submit: '1=1',
    value: multiRegionalValue(c => $(
      measuredIf(c.regionCheck),
      c.measured.frames
    ))
  }
})

export const rich = (() => {
  const regions = Object.values(_c)

  return RichPresence({
    lookupDefaultParameters: { compressRanges: false, keyFormat: 'dec' },
    lookup: {
      Level: {
        values: levelNames
      },
      Kills: {
        values: Object.entries(levelMeta).reduce((prev, cur) => {
          prev[cur[0]] = cur[1].kills
          return prev
        }, {})
      },
      Pickups: {
        values: Object.entries(levelMeta).reduce((prev, cur) => {
          prev[cur[0]] = cur[1].pickups
          return prev
        }, {})
      },
      Secrets: {
        values: Object.entries(levelMeta).reduce((prev, cur) => {
          prev[cur[0]] = cur[1].secrets
          return prev
        }, {})
      },
    },
    format: {
      Time: 'FRAMES'
    },
    displays: ({ lookup, macro, format, tag }) => {
      const result: Array<string | [ConditionBuilder, string]> =
        regions.flatMap(c => {
          const atLevel = lookup.Level.at(c.measured.level)
          const health = macro.Number.at(c.measured.health)

          const secrets = macro.Number.at(c.measured.secrets)
          const maxSecrets = lookup.Secrets.at(c.measured.level)

          const kills = macro.Number.at(c.measured.kills)
          const maxKills = lookup.Kills.at(c.measured.level)

          const pickups = macro.Number.at(c.measured.pickups)
          const maxPickups = lookup.Pickups.at(c.measured.level)

          const time = format.Time.at(c.measured.frames)

          return [
            [
              andNext(
                c.regionCheck,
                c.lvIdIs(0x14)
              ),
              'In Main Menu'
            ],
            [
              andNext(
                c.regionCheck,
                c.lvIdIs(0)
              ),
              tag`${atLevel} ❤️ ${health}% 🕒${time}`
            ],
            [
              andNext(
                c.regionCheck,
                c.lvIdIs(0x14).with({ cmp: '<' })
              ),
              tag`${atLevel} ❤️ ${health}% ❔${secrets}/${maxSecrets} 💀${kills}/${maxKills} 🎒${pickups}/${maxPickups} 🕒${time}`
            ]
          ]
        })

      result.push('Playing Tomb Raider')

      return result
    }
  })
})()

export default set
