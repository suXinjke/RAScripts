// @ts-check
import { AchievementSet, define as $, orNext, ConditionBuilder, RichPresence, pauseIf, measuredIf, once, andNext, resetIf, trigger, measured } from '@cruncheevos/core'

/** @typedef {'pal' | 'ntsc'} Region */

/** @type Record<string, { station: number, title: string }> */
const missionIds = {
  '1_1': { station: 0, title: 'Escort Duty' },
  '1_3': { station: 0, title: 'Covert Insertion' },
  '1_4': { station: 0, title: 'Rebel Smugglers' },
  '1_2': { station: 0, title: 'Insult and Injury' },
  '0_1': { station: 0, title: 'Valdemar...' },
  '0_2': { station: 0, title: 'Convoy' },
  '0_3': { station: 0, title: 'Retrieval' },

  '1_5': { station: 1, title: 'Retrieval' },
  '1_6': { station: 1, title: 'Convoy' },
  '1_7': { station: 1, title: 'Investigation' },
  '1_8': { station: 1, title: 'Thunderbowl I' },
  '1_9': { station: 1, title: 'Surgical Strike' },
  '1_10': { station: 1, title: 'Hunting' },
  '1_11': { station: 1, title: 'Protection' },
  '1_12': { station: 1, title: 'Gang Warfare' },
  '0_4': { station: 1, title: 'Defense' },
  '0_5': { station: 1, title: 'Rescue Hilachet Ship' },
  '2_5': { station: 1, title: 'Rescue Hilachet Ship pt2' },
  '0_6': { station: 1, title: 'Calculus 3' },

  '1_13': { station: 2, title: 'Seek and Destroy' },
  '1_14': { station: 2, title: 'Tank Support' },
  '1_15': { station: 2, title: 'Defend Refinery' },
  '1_16': { station: 2, title: 'Templecruiser' },
  '1_17': { station: 2, title: 'Rescue Team' },
  '1_18': { station: 2, title: 'Clear Path' },
  '1_19': { station: 2, title: 'Protect Cult' },
  '1_20': { station: 2, title: 'Thunderbowl II' },
  '1_21': { station: 2, title: 'Kidnap Queen' },
  '1_22': { station: 2, title: 'Distress Call' },
  '0_7': { station: 2, title: 'Genesis' },
  '0_8': { station: 2, title: 'Escape' },

  '1_23': { station: 3, title: 'Robohunting' },
  '1_24': { station: 3, title: 'Solar Flare' },
  '1_25': { station: 3, title: 'Protect Refugees' },
  '1_26': { station: 3, title: 'Scavenge This' },
  '1_27': { station: 3, title: 'Hostage Release' },
  '1_28': { station: 3, title: 'Roadblock' },
  '1_29': { station: 3, title: 'Thunderbowl III' },
  '0_9': { station: 3, title: 'Capture Sha\'Har' },
  '0_10': { station: 3, title: 'Defender' },

  '1_30': { station: 4, title: 'Necessity' },
  '1_31': { station: 4, title: 'Sabotage' },
  '1_32': { station: 4, title: 'The Hilachet Betrayed' },
  '0_11': { station: 4, title: 'Infiltrate' },
  '0_12': { station: 4, title: 'The Gauntlet' },
  '2_12': { station: 4, title: 'The Gauntlet pt2' },
  '0_13': { station: 4, title: 'Destroy Red Sun' },
  '2_13': { station: 4, title: 'Destroy Red Sun pt2' },
}

/**
 * @typedef {Object} WeaponMeta
 * @property {number} id
 * @property {'primary' | 'secondary' | 'passive'} type
 * @property {number} [station]
 * @property {boolean} [cheat]
 * @property {number[]} [missions]
 * @property {'delay' | 'charging' | '0x19_bit1' | 'pod' | 'hardpoint'} firingCheck
 */

/** @type Record<string, WeaponMeta> */
const weapons = {
  'GP Laser Mk I': { id: 0x00, type: 'primary', firingCheck: 'delay', station: 0 },
  'Shield Laser Mk I': { id: 0x03, type: 'primary', firingCheck: 'delay', station: 0 },
  'Stun Missile': { id: 0x20, type: 'secondary', firingCheck: 'delay', station: 0 },
  'Flare': { id: 0x2a, type: 'secondary', firingCheck: 'delay', station: 0 },
  'Shield Booster': { id: 0x37, type: 'passive', firingCheck: 'hardpoint', station: 0 },

  'GP Laser Mk II': { id: 0x01, type: 'primary', firingCheck: 'delay', station: 1 },
  'Hull Laser Mk I': { id: 0x06, type: 'primary', firingCheck: 'delay', station: 1 },
  'Gauss Gun': { id: 0x0d, type: 'primary', firingCheck: 'charging', station: 1 },
  'Shield Missile Mk I': { id: 0x18, type: 'secondary', firingCheck: 'delay', station: 1 },
  'Hull Missile Mk I': { id: 0x1b, type: 'secondary', firingCheck: 'delay', station: 1 },
  'Decloaker': { id: 0x2c, type: 'secondary', firingCheck: 'delay', station: 1 },
  'Grapple Gun': { id: 0x2e, type: 'secondary', firingCheck: 'delay', station: 1 },
  'Repair Pod': { id: 0x31, type: 'secondary', firingCheck: 'pod', station: 1 },
  'ECM Pod': { id: 0x32, type: 'secondary', firingCheck: 'pod', station: 1 },
  'Cooling Vents': { id: 0x35, type: 'passive', firingCheck: 'hardpoint', station: 1 },

  'Shield Laser Mk II': { id: 0x04, type: 'primary', firingCheck: 'delay', station: 2 },
  'Hull Laser Mk II': { id: 0x07, type: 'primary', firingCheck: 'delay', station: 2 },
  'Plasma Cannon': { id: 0x0c, type: 'primary', firingCheck: 'delay', station: 2 },
  'Scatter Gun': { id: 0x0e, type: 'primary', firingCheck: 'charging', station: 2 },
  'Shield Missile Mk II': { id: 0x19, type: 'secondary', firingCheck: 'delay', station: 2 },
  'Hull Missile Mk II': { id: 0x1c, type: 'secondary', firingCheck: 'delay', station: 2 },
  'Jamma Missile': { id: 0x21, type: 'secondary', firingCheck: 'delay', station: 2 },
  'Stun Torpedo': { id: 0x24, type: 'secondary', firingCheck: 'delay', station: 2 },
  'Scarab HDW': { id: 0x27, type: 'secondary', firingCheck: 'delay', station: 2 },
  'Defence Pod': { id: 0x30, type: 'secondary', firingCheck: 'pod', station: 2 },
  'Heat Sinks': { id: 0x36, type: 'passive', firingCheck: 'hardpoint', station: 2 },
  'Shield Maximizer': { id: 0x38, type: 'passive', firingCheck: 'hardpoint', station: 2 },

  'GP Laser Mk III': { id: 0x02, type: 'primary', firingCheck: 'delay', station: 3 },
  'Plasma Missile': { id: 0x1e, type: 'secondary', firingCheck: 'delay', station: 3 },
  'Nanotech Missile': { id: 0x22, type: 'secondary', firingCheck: 'delay', station: 3 },
  'Plasma Torpedo': { id: 0x25, type: 'secondary', firingCheck: 'delay', station: 3 },
  'Offence Pod': { id: 0x2f, type: 'secondary', firingCheck: 'pod', station: 3 },

  'Phase Distorter': { id: 0x33, type: 'secondary', firingCheck: 'delay', station: 4 },
  'Nanotech Torpedo': { id: 0x26, type: 'secondary', firingCheck: 'delay', station: 4 },

  'Shield Cooled Laser': { id: 0x0a, type: 'primary', firingCheck: 'delay', missions: [] },
  'Hull Cooled Laser': { id: 0x0b, type: 'primary', firingCheck: 'delay', missions: [] },
  'BFG': { id: 0x0f, type: 'primary', firingCheck: 'delay', missions: [] },
  'Death Ray': { id: 0x10, type: 'primary', firingCheck: '0x19_bit1', missions: [] },
  'Two-Stage Missile': { id: 0x23, type: 'secondary', firingCheck: 'delay', missions: [] },
  'BDS 9000': { id: 0x28, type: 'secondary', firingCheck: 'delay', missions: [] },
  'GP Cooled Laser': { id: 0x09, type: 'primary', firingCheck: 'delay', missions: [] },

  'Shield Laser Mk III': { id: 0x05, type: 'primary', firingCheck: 'delay', cheat: true },
  'Hull Laser Mk III': { id: 0x08, type: 'primary', firingCheck: 'delay', cheat: true },
  'Cloak': { id: 0x2d, type: 'secondary', firingCheck: 'delay', cheat: true },
}

/** @type Record<number, WeaponMeta> */
const weaponsById = Object.entries(weapons).reduce((prev, [name, obj]) => {
  prev[obj.id] = obj
  return prev
}, {})


/** @param {Region} r */
const codeFor = (r) => {
  const m = (addr = 0) => {
    if (addr >= 0x100000) {
      return r === 'pal' ? addr - 0x2C : addr
    }

    return r === 'pal' ? addr + 0x3C : addr
  }

  const primaryWeapon = (() => {
    const p = $.one(['AddAddress', 'Mem', '24bit', m(0x125d0c)])

    return {
      p,
      notNull: p.with({ flag: '', cmp: '!=', rvalue: ['Value', '', 0] }),
      idIs: id => $(
        p,
        ['', 'Mem', '32bit', 0x00, '=', 'Value', '', id]
      ),
      gotDelayed: $(
        p,
        ['', 'Mem', '32bit', 0x2c, '>', 'Delta', '32bit', 0x2c]
      ),
      isCharging: $(
        p,
        ['', 'Mem', '32bit', 0x34, '>', 'Delta', '32bit', 0x34]
      ),
      deathRayFiring: $(
        p,
        ['', 'Mem', 'Bit1', 0x19, '>', 'Delta', 'Bit1', 0x19]
      )
    }
  })()

  const secondaryWeapon = (() => {
    const p = $.one(['AddAddress', 'Mem', '24bit', m(0x125d10)])

    return {
      p,
      idIs: id => $(
        p,
        ['', 'Mem', '32bit', 0x00, '=', 'Value', '', id]
      ),
      gotDelayed: $(
        p,
        ['', 'Mem', '32bit', 0x2c, '>', 'Delta', '32bit', 0x2c]
      ),
      podReleased: $(
        p,
        ['AndNext', 'Mem', '32bit', 0x1C, '>', 'Value', '', 0],
        p,
        ['', 'Delta', '32bit', 0x1C, '=', 'Value', '', 0]
      ),
    }
  })()

  const firedWeapon = (...ids) => {
    const metas = ids.map(id => weaponsById[id])

    return $(
      andNext(
        orNext(
          ...metas
            .filter(x => x.type === 'primary' && x.firingCheck === 'delay')
            .map(x => primaryWeapon.idIs(x.id))
        ),
        primaryWeapon.gotDelayed,
        primaryWeapon.notNull
      ),

      andNext(
        orNext(
          ...metas
            .filter(x => x.type === 'primary' && x.firingCheck === 'charging')
            .map(x => primaryWeapon.idIs(x.id))
        ),
        primaryWeapon.isCharging,
        primaryWeapon.notNull
      ),

      andNext(
        orNext(
          ...metas
            .filter(x => x.type === 'primary' && x.firingCheck === '0x19_bit1')
            .map(x => primaryWeapon.idIs(x.id))
        ),
        primaryWeapon.deathRayFiring,
        primaryWeapon.notNull
      ),

      andNext(
        orNext(
          ...metas
            .filter(x => x.type === 'secondary' && x.firingCheck === 'delay')
            .map(x => secondaryWeapon.idIs(x.id))
        ),
        secondaryWeapon.gotDelayed,
        secondaryWeapon.notNull
      ),
      andNext(
        orNext(
          ...metas
            .filter(x => x.type === 'secondary' && x.firingCheck === 'pod')
            .map(x => secondaryWeapon.idIs(x.id))
        ),
        secondaryWeapon.podReleased,
        secondaryWeapon.notNull
      ),
    )
  }

  const haveHardpoints = (max, ...ids) => $(
    ...Array.from({ length: max }, (_, hardpoint) => orNext(
      ...ids.map(id => $(
        ['', 'Mem', '8bit', m(0x425ec + hardpoint * 0x4), '=', 'Value', '', id]
      ))))
  )

  const missionIs = (group = -1, id = -1) => $(
    ['', 'Mem', '8bit', m(0x425b7), '=', 'Value', '', group],
    ['', 'Mem', '8bit', m(0x425b6), '=', 'Value', '', id],
  )

  const shipIs = (id = -1) => $.one(['', 'Mem', '32bit', m(0x42620), '=', 'Value', '', id])
  const shipIsNot = (id = -1) => $.one(['', 'Mem', '32bit', m(0x42620), '!=', 'Value', '', id])

  const incorrectShipForMission = (group = -1, id = -1) => {
    if (group === 0 && id === 1) {
      return shipIsNot(0) // Valdemar... snapdragon
    }

    if (group === 0 && id === 9) {
      return shipIsNot(8) // Capture Sha'Har
    }

    const { station } = missionIds[group + '_' + id]
    const shipIsBetterThan = (id) => shipIs(id).with({ cmp: '>' })

    return $(
      station === 0 && shipIsBetterThan(1),
      station === 1 && shipIsBetterThan(3),
      station === 2 && shipIsBetterThan(4),
      station === 3 && shipIsBetterThan(5),
      station === 4 && shipIsBetterThan(6),
    )
  }

  const isInGameMission = $.one(['', 'Mem', '32bit', m(0x3ba8c), '=', 'Value', '', 1])
  const isInGameTutorial = $.one(['', 'Mem', '32bit', m(0x3ba8c), '=', 'Value', '', 8])
  const isInGameCredits = $.one(['', 'Mem', '32bit', m(0x3ba8c), '=', 'Value', '', 7])
  const isNotInGame = $.one(['', 'Mem', '32bit', m(0x3ba8c), '=', 'Value', '', 3])
  const timerIsZero = $.one(['', 'Mem', '32bit', m(0x6a05c), '=', 'Value', '', 0])
  const timerIsAboveInMsec = (msec) => {
    const time = Math.floor(msec / (r === 'pal' ? 20 : 16.666))
    return $.one(['', 'Mem', '32bit', m(0x6a05c), '>', 'Value', '', time])
  }
  const timerIsAboveZero = timerIsAboveInMsec(0)

  const missionFlagIs = (flag) => $.one(['', 'Mem', '32bit', m(0x45470), '=', 'Value', '', flag])
  const missionInProgress = missionFlagIs(0)
  const missionComplete = missionFlagIs(2)
  const cheatedMissionComplete = andNext(
    ['', 'Mem', '32bit', m(0x120f58), '=', 'Value', '', 1], // game paused
    missionComplete
  )

  const regionCheck = $(
    r === 'ntsc' && ['', 'Mem', '32bit', 0x77475, '=', 'Value', '', 0x2e383030],
    r === 'pal' && ['', 'Mem', '32bit', 0x774ad, '=', 'Value', '', 0x2e393130]
  )

  return {
    regionCheck,
    regionCheckPause: pauseIf(
      regionCheck.withLast({ cmp: '!=' })
    ),

    measured: {
      ship: $.one(['Measured', 'Mem', '32bit', m(0x42620)]),
      money: $.one(['Measured', 'Mem', '32bit', m(0x4261c)]),
      station: $.one(['Measured', 'Mem', '16bit', m(0x425ba)]),
      mission: $(
        ['AddSource', 'Mem', '8bit', m(0x425b7), '*', 'Value', '', 100],
        ['Measured', 'Mem', '8bit', m(0x425b6)],
      ),
      killsBig: $.one(['Measured', 'Mem', '16bit', m(0x42612)]),
      killsMedium: $.one(['Measured', 'Mem', '16bit', m(0x42614)]),
      killsSmall: $.one(['Measured', 'Mem', '16bit', m(0x42616)]),
    },

    isInGameMission,
    isInGameTutorial,
    isInGameCredits,
    isNotInGame,

    timerIsZero,
    timerIsAboveZero,
    timerIsAboveInMsec,

    missionIs,
    missionInProgress,
    missionComplete,

    incorrectShipForMission,
    cheatedMissionComplete,

    firedWeapon,
    haveHardpoints,

    cheatActive: orNext(
      ['', 'Mem', '8bit', m(0x41b24), '!=', 'Value', '', 0], // god mode
      ['', 'Mem', '8bit', m(0x41b25), '!=', 'Value', '', 0], // infinite ammo
      ['', 'Mem', '8bit', m(0x41b26), '!=', 'Value', '', 0], // no weapon heat
      ['', 'Mem', '8bit', m(0x41b27), '!=', 'Value', '', 0], // no afterburner heat
    ),

    // it's stack-like so offset goes backwards
    entity: (i = -1) => {
      const o = m(0x4d340) - i * 0x258

      return {
        hullDead: $(
          ['', 'Mem', '32bit', o + 0x13c, '=', 'Value', '', 0]
        )
      }
    },

    entityGroup: (i = -1) => {
      const o = m(0x03c180) + i * 0x378

      return {
        killCountIsMoreThan: c => $(
          ['', 'Mem', '16bit', o, '>', 'Value', '', c]
        ),
        escapeCountIsLessThan: c => $(
          ['', 'Mem', '16bit', o + 0x2, '<', 'Value', '', c]
        ),
        escapeCountIsMoreThan: c => $(
          ['', 'Mem', '16bit', o + 0x2, '>', 'Value', '', c]
        )
      }
    },

    entityGroupPtr: (i = -1) => {
      const p = $.one(
        ['AddAddress', 'Mem', '24bit', m(0x3bac8) + i * 0x38]
      )

      return {
        notNull: p.with({ flag: '', cmp: '!=', rvalue: ['Value', '', 0] }),
        hullDamaged: $(
          p,
          // TODO: missing 32bit on rvalue makes it valid and crashes?
          // ['', 'Mem', '32bit', 0x138, '<', 'Delta', '32bit', 0x138]
          ['', 'Mem', '32bit', 0x13c, '<', 'Delta', '32bit', 0x13c]
        )
      }
    },

    semaphore: (i = -1) => {
      const p = $.one(['AddAddress', 'Mem', '24bit', m(0x123b58)])
      return {
        is: (v = -1) => $(
          p,
          ['', 'Mem', '8bit', i, '=', 'Value', '', v]
        )
      }
    },

    /**
     * @param  {Array<'big' | 'mid' | 'small'>} types
     */
    killCountSumFor: (...types) => {
      const offset = {
        'big': 0,
        'mid': 4,
        'small': 8
      }

      const base = $(
        ...types.map(t => $(
          ['AddSource', 'Mem', '32bit', m(0x451cc) + offset[t]]
        ))
      )

      return {
        isAtleast: value => base.withLast({ flag: '', cmp: '>=', rvalue: ['Value', '', value] }),
        isLessThan: value => base.withLast({ flag: '', cmp: '<', rvalue: ['Value', '', value] })
      }
    }
  }
}

const _c = {
  ntsc: codeFor('ntsc'),
  pal: codeFor('pal')
}

/** @typedef {(code: ReturnType<typeof codeFor>, region: Region) => any} CodeCallback */

/**
 * @param {Object} params
 * @param {[number, number]} [params.id]
 * @param {Array<number>} [params.weaponExceptions]
 * @param {CodeCallback} [params.inGameTrigger]
 * @param {CodeCallback} [params.reset]
 * @param {CodeCallback} [params.measured]
 */
function missionAchievement(params) {
  const { id, weaponExceptions = [] } = params
  const { station } = missionIds[id[0] + '_' + id[1]]
  const notAllowedWeaponsIds = Object.values(weapons)
    .filter(x => x.station > station || x.cheat || x.station === undefined)
    .map(x => x.id)
    .filter(id => weaponExceptions.includes(id) === false)

  const notAllowedHardpoints = Object.values(weapons)
    .filter(x => x.station > station && x.firingCheck === 'hardpoint')
    .map(x => x.id)
    .filter(id => weaponExceptions.includes(id) === false)

  const maxHardpoints = {
    0: 5,
    1: 6,
    2: 7,
    3: 7,
    4: 8
  }[station]

  const groups = [$('hcafe=hcafe')]
  for (const c of [_c.ntsc, _c.pal]) {
    const region = c === _c.ntsc ? 'ntsc' : 'pal'

    const genericStart = andNext(
      c.missionIs(...id),
      c.timerIsZero.with({ lvalue: { type: 'Delta' } }),
      c.timerIsAboveZero,
      c.isInGameMission,
    )

    groups.push($(
      c.regionCheckPause,
      once(
        genericStart
      ),

      trigger(
        params.inGameTrigger && params.inGameTrigger(c, region),
        !params.inGameTrigger && c.isNotInGame,
      ),

      params.reset && resetIf(params.reset(c, region))
    ))

    groups.push($(
      c.regionCheckPause,
      'hcafe!=hcafe',
      resetIf(
        c.cheatActive,

        c.incorrectShipForMission(...id),
        c.cheatedMissionComplete,
        andNext(
          c.isNotInGame,
          c.missionComplete.with({ cmp: '!=' })
        ),

        c.firedWeapon(...notAllowedWeaponsIds),
        c.haveHardpoints(maxHardpoints, ...notAllowedHardpoints),
      )
    ))

    if (params.measured) {
      groups.push($(
        c.regionCheckPause,
        'hcafe!=hcafe',
        measuredIf(
          'once',
          andNext(
            c.regionCheck,
            genericStart
          )
        ),
        measured(params.measured(c, region))
      ))
    }
  }

  const res = groups.reduce((prev, cur, i) => {
    prev[i === 0 ? 'core' : `alt${i}`] = cur
    return prev
  }, { core: '' })
  return res
}

const set = new AchievementSet({ gameId: 11672, title: 'Colony Wars: Red Sun' })

set.addAchievement({
  title: 'ESCORT_DUTY',
  description: 'Escort Duty: complete the mission with all three Cargo Stompers escorted to the Depot',
  points: 3,
  conditions: missionAchievement({
    id: [1, 1],
    reset: c => andNext(
      orNext(
        c.entity(9).hullDead,
        c.entity(10).hullDead,
        c.entity(11).hullDead,
      ),
      c.missionInProgress
    ),
  })
})

set.addAchievement({
  title: 'INSULT_INJURY',
  description: 'Insult and Injury: stay close to EW Pod until you identify the target, then complete the mission',
  points: 1,
  conditions: missionAchievement({
    id: [1, 2],
    reset: c => andNext(
      c.semaphore(0).is(1), // EW pod escapes
      c.semaphore(4).is(0), // identification complete
      c.missionInProgress,
    ),
  })
}).addAchievement({
  title: 'INSULT_INJURY_MAD',
  description: 'Insult and Injury: immediately disregard stealth and complete the mission by destroying both Insult and Injury',
  points: 2,
  conditions: missionAchievement({
    id: [1, 2],
    reset: c => $(
      andNext(
        c.semaphore(0).is(0),
        c.timerIsAboveInMsec(10000),
        c.missionInProgress,
      ),
      andNext(
        c.isNotInGame,
        c.killCountSumFor('mid').isLessThan(2)
      )
    ),
    measured: c => c.killCountSumFor('mid').isAtleast(2)
  })
}).addAchievement({
  title: 'INSULT_INJURY_GRAPPLE',
  description: 'Insult and Injury: cheat yourself a grapple gun and have the target identified in less than 30 seconds, then complete the mission',
  points: 1,
  conditions: missionAchievement({
    id: [1, 2],
    reset: c => $(
      andNext(
        c.semaphore(4).is(0),
        c.timerIsAboveInMsec(30000),
        c.missionInProgress,
      )
    ),
    weaponExceptions: [weapons['Grapple Gun'].id]
  })
})

set.addAchievement({
  title: 'COVERT',
  description: 'Covert Insertion: complete mission with all Rebel Tanks and Fighters destroyed',
  points: 2,
  conditions: missionAchievement({
    id: [1, 3],
    reset: c => andNext(
      c.isNotInGame,
      c.killCountSumFor('small').isLessThan(8)
    ),
    measured: c => c.killCountSumFor('small').isAtleast(8)
  })
}).addAchievement({
  title: 'COVERT_SAAD',
  description: 'Covert Insertion: covertly destroy one of SAAD installations',
  points: 1,
  conditions: missionAchievement({
    id: [1, 3],
    inGameTrigger: c => andNext(
      orNext(
        c.entity(13).hullDead,
        c.entity(14).hullDead,
        c.entity(15).hullDead,
        c.entity(16).hullDead,
        c.entity(17).hullDead,
      ),
      c.isInGameMission
    )
  })
})

set.addAchievement({
  title: 'REBEL_SMUG',
  description: 'Rebel Smugglers: stay around for a while and complete the mission with 25 kills or more',
  points: 2,
  conditions: missionAchievement({
    id: [1, 4],
    reset: c => andNext(
      c.isNotInGame,
      c.killCountSumFor('small', 'big').isLessThan(25)
    ),
    measured: c => c.killCountSumFor('small', 'big').isAtleast(25)
  })
})

set.addAchievement({
  title: 'VALDEMAR',
  description: 'Valdemar: complete the mission',
  points: 1,
  conditions: missionAchievement({
    id: [0, 1]
  })
})

set.addAchievement({
  title: 'CONVOY',
  description: 'Convoy (Magenta): complete the mission',
  points: 2,
  conditions: missionAchievement({
    id: [0, 2]
  })
}).addAchievement({
  title: 'CONVOY_PERFECT',
  description: 'Convoy (Magenta): complete the mission with all 9 pieces of cargo delivered',
  points: 5,
  conditions: missionAchievement({
    id: [0, 2],
    reset: c => $(
      c.semaphore(4 + 4 * 0).is(1),
      c.semaphore(4 + 4 * 1).is(1),
      c.semaphore(4 + 4 * 2).is(1),

      c.semaphore(4 + 4 * 3).is(1),
      c.semaphore(4 + 4 * 4).is(1),
      c.semaphore(4 + 4 * 5).is(1),

      c.semaphore(4 + 4 * 6).is(1),
      c.semaphore(4 + 4 * 7).is(1),
      c.semaphore(4 + 4 * 8).is(1),

      andNext(
        c.isNotInGame,
        c.entityGroup(3).escapeCountIsLessThan(9)
      )
    )
  })
})

set.addAchievement({
  title: 'RETRIEVAL',
  description: 'Retrieval (Magenta): complete the mission',
  points: 2,
  conditions: missionAchievement({
    id: [0, 3]
  })
}).addAchievement({
  title: 'RETRIEVAL_S',
  description: `Retrieval (Magenta): complete the mission and ensure the Empiret Decoder doesn't get any hull damage`,
  points: 2,
  conditions: missionAchievement({
    id: [0, 3],
    reset: c => andNext(
      c.entityGroupPtr(1).notNull,
      c.entityGroupPtr(1).hullDamaged,
      c.isInGameMission
    )
  })
})

set.addAchievement({
  title: 'RETRIEVAL_2_SNAKE',
  description: 'Retrieval (Marjorie): scare away the Snake Mahoney going after the Idol',
  points: 1,
  conditions: missionAchievement({
    id: [1, 5],
    inGameTrigger: c => $(
      andNext(
        c.entityGroup(1).escapeCountIsMoreThan(0),
        c.missionInProgress,
      ),
    )
  })
}).addAchievement({
  title: 'RETRIEVAL_2',
  description: 'Retrieval (Marjorie): complete the mission in less than 70 seconds',
  points: 1,
  conditions: missionAchievement({
    id: [1, 5],
    reset: c => $(
      andNext(
        c.timerIsAboveInMsec(70000),
        c.missionInProgress,
      ),
    )
  })
})

set.addAchievement({
  title: 'CONVOY_MARJORIE',
  description: 'Convoy (Marjorie): complete the mission with all Refugee Haulers and Cargo Pods escorted',
  points: 2,
  conditions: missionAchievement({
    id: [1, 6],
    reset: c => $(
      andNext(
        orNext(
          c.entityGroup(4).killCountIsMoreThan(0),
          c.entityGroup(4).escapeCountIsMoreThan(0),
          c.entityGroup(10).killCountIsMoreThan(0),
        ),
        c.isInGameMission,
      ),
    )
  })
})

export const rich = (() => {
  /** @type Region[] */
  const regions = ['ntsc', 'pal']

  return RichPresence({
    lookup: {
      Station: {
        values: {
          0: 'Magenta',
          1: 'Marjorie',
          2: 'Cardinale',
          3: 'Aurora',
          4: 'Boreas',
        }
      },
      Ship: {
        values: {
          0: 'CR8 Snapdragon',
          1: 'Zu-7 Ryusei',
          2: 'Zu-15A Shinden',
          3: 'H2S Cobra',
          4: 'H4E Magnum',
          5: 'BSI 919 Medusa II',
          6: 'BSI 303 Hyper Zeroid',
          7: 'BSI 606 Super Medusa',
          8: `Sha'Har Fighter`
        }
      },
      Mission: {
        values: {
          ...Object.entries(missionIds).reduce((prev, [key, value]) => {
            const [group, id] = key.split('_').map(Number)
            prev[group * 100 + id] = value.title
            return prev
          }, {}),
          401: 'Craft Handling Exercise',
          402: 'Tactical Exercises',
        },
        compressRanges: false
      }
    },
    displays: ({ lookup, macro, tag }) => regions.flatMap(r => {
      const c = codeFor(r)
      const atStation = lookup.Station.at(c.measured.station)
      const atShip = lookup.Ship.at(c.measured.ship)
      const atMission = lookup.Mission.at(c.measured.mission)
      const atMoney = macro.Number.at(c.measured.money)

      const killCount = '💀' + [
        c.measured.killsSmall,
        c.measured.killsMedium,
        c.measured.killsBig
      ].map(macro.Number.at).join('/')

      return /** @type Array<string | [ConditionBuilder, string]> */ ([
        [
          $(c.regionCheck, c.isNotInGame),
          tag`${atStation} 🚀${atShip} ${killCount} 💰${atMoney}`
        ],
        [
          $(c.regionCheck, c.isInGameMission),
          tag`${atStation} 📍${atMission} 🚀${atShip}`
        ],
        [
          $(c.regionCheck, c.isInGameTutorial),
          tag`${atMission} 🚀${atShip}`
        ],
        [
          $(c.regionCheck, c.isInGameCredits),
          `Watching Credits`
        ],
      ])
    }).concat('Playing Colony Wars: Red Sun')
  })
})()

export default set