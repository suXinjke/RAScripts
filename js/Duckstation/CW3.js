// @ts-check
import { AchievementSet, define as $, orNext, ConditionBuilder, RichPresence, pauseIf, measuredIf, once, andNext, resetIf, trigger, measured, resetNextIf } from '@cruncheevos/core'

/** @typedef {'pal' | 'ntsc'} Region */

/** @type Record<string, [number, string]> */
const missionIds = {
  '1_1': [0, 'Escort Duty'],
  '1_3': [0, 'Covert Insertion'],
  '1_4': [0, 'Rebel Smugglers'],
  '1_2': [0, 'Insult and Injury'],
  '0_1': [0, 'Valdemar...'],
  '0_2': [0, 'Convoy'],
  '0_3': [0, 'Retrieval'],

  '1_5': [1, 'Retrieval'],
  '1_6': [1, 'Convoy'],
  '1_7': [1, 'Investigation'],
  '1_8': [1, 'Thunderbowl I'],
  '1_9': [1, 'Surgical Strike'],
  '1_10': [1, 'Hunting'],
  '1_11': [1, 'Protection'],
  '1_12': [1, 'Gang Warfare'],
  '0_4': [1, 'Defense'],
  '0_5': [1, 'Rescue Hilachet Ship'],
  '2_5': [1, 'Rescue Hilachet Ship pt2'],
  '0_6': [1, 'Calculus 3'],

  '1_13': [2, 'Seek and Destroy'],
  '1_14': [2, 'Tank Support'],
  '1_15': [2, 'Defend Refinery'],
  '1_16': [2, 'Templecruiser'],
  '1_17': [2, 'Rescue Team'],
  '1_18': [2, 'Clear Path'],
  '1_19': [2, 'Protect Cult'],
  '1_20': [2, 'Thunderbowl II'],
  '1_21': [2, 'Kidnap Queen'],
  '1_22': [2, 'Distress Call'],
  '0_7': [2, 'Genesis'],
  '0_8': [2, 'Escape'],

  '1_23': [3, 'Robohunting'],
  '1_24': [3, 'Solar Flare'],
  '1_25': [3, 'Protect Refugees'],
  '1_26': [3, 'Scavenge This'],
  '1_27': [3, 'Hostage Release'],
  '1_28': [3, 'Roadblock'],
  '1_29': [3, 'Thunderbowl III'],
  '0_9': [3, 'Capture Sha\'Har'],
  '0_10': [3, 'Defender'],

  '1_30': [4, 'Necessity'],
  '1_31': [4, 'Sabotage'],
  '1_32': [4, 'The Hilachet Betrayed'],
  '0_11': [4, 'Infiltrate'],
  '0_12': [4, 'The Gauntlet'],
  '2_12': [4, 'The Gauntlet pt2'],
  '0_13': [4, 'Destroy Red Sun'],
  '2_13': [4, 'Destroy Red Sun pt2'],
}

/**
 * @typedef {Object} WeaponMeta
 * @property {number} id
 * @property {'primary' | 'secondary' | 'passive'} type
 * @property {number} [station]
 * @property {boolean} [cheat]
 * @property {boolean} [missile]
 * @property {boolean} [torpedo]
 * @property {'delay' | 'charging' | '0x19_bit1' | 'pod' | 'hardpoint'} firingCheck
 */

/**
 * @param {WeaponMeta} w
 * @returns WeaponMeta
 */
const w = w => w
const weapons = {
  'GP Laser Mk I': w({ id: 0x00, type: 'primary', firingCheck: 'delay', station: 0 }),
  'Shield Laser Mk I': w({ id: 0x03, type: 'primary', firingCheck: 'delay', station: 0 }),
  'Stun Missile': w({ id: 0x20, type: 'secondary', firingCheck: 'delay', station: 0, missile: true }),
  'Flare': w({ id: 0x2a, type: 'secondary', firingCheck: 'delay', station: 0 }),
  'Shield Booster': w({ id: 0x37, type: 'passive', firingCheck: 'hardpoint', station: 0 }),

  'GP Laser Mk II': w({ id: 0x01, type: 'primary', firingCheck: 'delay', station: 1 }),
  'Hull Laser Mk I': w({ id: 0x06, type: 'primary', firingCheck: 'delay', station: 1 }),
  'Gauss Gun': w({ id: 0x0d, type: 'primary', firingCheck: 'charging', station: 1 }),
  'Shield Missile Mk I': w({ id: 0x18, type: 'secondary', firingCheck: 'delay', station: 1, missile: true }),
  'Hull Missile Mk I': w({ id: 0x1b, type: 'secondary', firingCheck: 'delay', station: 1, missile: true }),
  'Decloaker': w({ id: 0x2c, type: 'secondary', firingCheck: 'delay', station: 1 }),
  'Grapple Gun': w({ id: 0x2e, type: 'secondary', firingCheck: 'delay', station: 1 }),
  'Repair Pod': w({ id: 0x31, type: 'secondary', firingCheck: 'pod', station: 1 }),
  'ECM Pod': w({ id: 0x32, type: 'secondary', firingCheck: 'pod', station: 1 }),
  'Cooling Vents': w({ id: 0x35, type: 'passive', firingCheck: 'hardpoint', station: 1 }),

  'Shield Laser Mk II': w({ id: 0x04, type: 'primary', firingCheck: 'delay', station: 2 }),
  'Hull Laser Mk II': w({ id: 0x07, type: 'primary', firingCheck: 'delay', station: 2 }),
  'Plasma Cannon': w({ id: 0x0c, type: 'primary', firingCheck: 'delay', station: 2 }),
  'Scatter Gun': w({ id: 0x0e, type: 'primary', firingCheck: 'charging', station: 2 }),
  'Shield Missile Mk II': w({ id: 0x19, type: 'secondary', firingCheck: 'delay', station: 2, missile: true }),
  'Hull Missile Mk II': w({ id: 0x1c, type: 'secondary', firingCheck: 'delay', station: 2, missile: true }),
  'Jamma Missile': w({ id: 0x21, type: 'secondary', firingCheck: 'delay', station: 2, missile: true }),
  'Stun Torpedo': w({ id: 0x24, type: 'secondary', firingCheck: 'delay', station: 2, torpedo: true }),
  'Scarab HDW': w({ id: 0x27, type: 'secondary', firingCheck: 'delay', station: 2, torpedo: true }),
  'Defence Pod': w({ id: 0x30, type: 'secondary', firingCheck: 'pod', station: 2 }),
  'Heat Sinks': w({ id: 0x36, type: 'passive', firingCheck: 'hardpoint', station: 2 }),
  'Shield Maximizer': w({ id: 0x38, type: 'passive', firingCheck: 'hardpoint', station: 2 }),

  'GP Laser Mk III': w({ id: 0x02, type: 'primary', firingCheck: 'delay', station: 3 }),
  'Plasma Missile': w({ id: 0x1e, type: 'secondary', firingCheck: 'delay', station: 3, missile: true }),
  'Nanotech Missile': w({ id: 0x22, type: 'secondary', firingCheck: 'delay', station: 3, missile: true }),
  'Plasma Torpedo': w({ id: 0x25, type: 'secondary', firingCheck: 'delay', station: 3, torpedo: true }),
  'Offence Pod': w({ id: 0x2f, type: 'secondary', firingCheck: 'pod', station: 3 }),

  'Phase Distorter': w({ id: 0x33, type: 'secondary', firingCheck: 'delay', station: 4 }),
  'Nanotech Torpedo': w({ id: 0x26, type: 'secondary', firingCheck: 'delay', station: 4, torpedo: true }),

  'Shield Cooled Laser': w({ id: 0x0a, type: 'primary', firingCheck: 'delay', station: 1 }),
  'Hull Cooled Laser': w({ id: 0x0b, type: 'primary', firingCheck: 'delay', station: 1 }),
  'BFG': w({ id: 0x0f, type: 'primary', firingCheck: 'delay', station: 3 }),
  'Two-Stage Missile': w({ id: 0x23, type: 'secondary', firingCheck: 'delay', station: 1, missile: true }),
  'BDS 9000': w({ id: 0x28, type: 'secondary', firingCheck: 'delay', station: 2, torpedo: true }),
  'GP Cooled Laser': w({ id: 0x09, type: 'primary', firingCheck: 'delay', station: 2 }),

  'Death Ray': w({ id: 0x10, type: 'primary', firingCheck: '0x19_bit1' }),
  'Shield Laser Mk III': w({ id: 0x05, type: 'primary', firingCheck: 'delay', cheat: true }),
  'Hull Laser Mk III': w({ id: 0x08, type: 'primary', firingCheck: 'delay', cheat: true }),
  'Cloak': w({ id: 0x2d, type: 'secondary', firingCheck: 'delay', cheat: true }),
}

/** @typedef {keyof typeof weapons} WeaponName */
/** @typedef {[WeaponName, WeaponMeta]} WeaponEntry */

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
      idIs: (id = -1) => $(
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
      notNull: p.with({ flag: '', cmp: '!=', rvalue: ['Value', '', 0] }),
      idIs: (id = -1) => $(
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
      )
    }
  })()

  const shipIs = (id = -1) => $.one(['', 'Mem', '32bit', m(0x42620), '=', 'Value', '', id])

  const timerAdvanced = $.one(['', 'Mem', '32bit', m(0x6a05c), '>', 'Delta', '32bit', m(0x6a05c)])
  const timerIsZero = $.one(['', 'Mem', '32bit', m(0x6a05c), '=', 'Value', '', 0])
  const timerIsAboveInMsec = (msec = -1) => {
    const time = Math.floor(msec / (r === 'pal' ? 20 : 16.666))
    return $.one(['', 'Mem', '32bit', m(0x6a05c), '>', 'Value', '', time])
  }
  const timerIsAboveZero = timerIsAboveInMsec(0)

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

    isInGameMission: $.one(['', 'Mem', '32bit', m(0x3ba8c), '=', 'Value', '', 1]),
    isNotInGame: $.one(['', 'Mem', '32bit', m(0x3ba8c), '=', 'Value', '', 3]),

    timerAdvanced,
    timerIsZero,
    timerIsAboveZero,
    timerIsAboveInMsec,

    gamePaused: $.one(['', 'Mem', '32bit', m(0x120f58), '=', 'Value', '', 1]),

    missionIs: (group = -1, id = -1) => $(
      ['', 'Mem', '8bit', m(0x425b7), '=', 'Value', '', group],
      ['', 'Mem', '8bit', m(0x425b6), '=', 'Value', '', id],
    ),
    missionInProgress: $.one(['', 'Mem', '32bit', m(0x45470), '=', 'Value', '', 0]),
    missionComplete: $.one(['', 'Mem', '32bit', m(0x45470), '=', 'Value', '', 2]),

    shipIs,
    correctShipForMission: (group = -1, id = -1) => {

      if (group === 0 && id === 1) {
        return shipIs(0) // Valdemar... Snapdragon
      }

      if (group === 0 && id === 11) {
        return shipIs(8) // Infilitrate... Sha'Har Fighter
      }

      const [station] = missionIds[group + '_' + id]
      const shipIsOrWorseThan = (id = -1) => shipIs(id).with({ cmp: '<=' })

      return $(
        station === 0 && shipIsOrWorseThan(1),
        station === 1 && shipIsOrWorseThan(3),
        station === 2 && shipIsOrWorseThan(4),
        station === 3 && shipIsOrWorseThan(5),
        station === 4 && shipIsOrWorseThan(7),
      )
    },

    /** @param {WeaponMeta[]} metas */
    firedWeapon: (...metas) => {
      const primaryDelay = metas.filter(w => w.type === 'primary' && w.firingCheck === 'delay')
      const primaryCharging = metas.filter(w => w.type === 'primary' && w.firingCheck === 'charging')
      const primary0x19bit = metas.filter(w => w.type === 'primary' && w.firingCheck === '0x19_bit1')
      const secondaryDelay = metas.filter(w => w.type === 'secondary' && w.firingCheck === 'delay')
      const secondaryPod = metas.filter(w => w.type === 'secondary' && w.firingCheck === 'pod')

      return $(
        primaryDelay.length > 0 && andNext(
          orNext(
            ...primaryDelay.map(w => primaryWeapon.idIs(w.id))
          ),
          primaryWeapon.gotDelayed,
          primaryWeapon.notNull
        ),

        primaryCharging.length > 0 && andNext(
          orNext(
            ...primaryCharging.map(w => primaryWeapon.idIs(w.id))
          ),
          primaryWeapon.isCharging,
          primaryWeapon.notNull
        ),

        primary0x19bit.length > 0 && andNext(
          orNext(
            ...primary0x19bit.map(w => primaryWeapon.idIs(w.id))
          ),
          primaryWeapon.deathRayFiring,
          primaryWeapon.notNull
        ),

        metas.includes(weapons['Flare']) && $(
          ['', 'Mem', '32bit', m(0x12106c), '>', 'Value', '', 0]
        ),

        secondaryDelay.length > 0 && andNext(
          orNext(
            ...secondaryDelay.map(w => secondaryWeapon.idIs(w.id))
          ),
          secondaryWeapon.gotDelayed,
          secondaryWeapon.notNull
        ),

        secondaryPod.length > 0 && andNext(
          orNext(
            ...secondaryPod.map(w => secondaryWeapon.idIs(w.id))
          ),
          secondaryWeapon.podReleased,
          secondaryWeapon.notNull
        ),
      )
    },

    /**
     * @param {number} max
     * @param  {WeaponMeta[]} metas
    */
    haveHardpoints: (max, ...metas) => $(
      ...Array.from({ length: max }, (_, hardpoint) => orNext(
        ...metas.map(w => $(
          ['', 'Mem', '8bit', m(0x425ec + hardpoint * 0x4), '=', 'Value', '', w.id]
        ))))
    ),

    cheatActive: orNext(
      ['', 'Mem', '8bit', m(0x41b24), '!=', 'Value', '', 0], // god mode
      ['', 'Mem', '8bit', m(0x41b25), '!=', 'Value', '', 0], // infinite ammo
      ['', 'Mem', '8bit', m(0x41b26), '!=', 'Value', '', 0], // no weapon heat
      ['', 'Mem', '8bit', m(0x41b27), '!=', 'Value', '', 0], // no afterburner heat
      ['', 'Mem', '8bit', m(0x41b28), '!=', 'Value', '', 0], // all weapons in-game
    ),

    // it's stack-like so offset goes backwards
    entity: (i = -1) => {
      const o = m(0x4d340) - i * 0x258

      return {
        hullDead: $(
          ['', 'Mem', '32bit', o + 0x13c, '=', 'Value', '', 0]
        ),
        hullDamaged: $(
          ['', 'Mem', '32bit', o + 0x13c, '<', 'Delta', '32bit', o + 0x13c]
        ),
      }
    },

    entityGroup: (i = -1) => {
      const o = m(0x03c180) + i * 0x378

      return {
        killCountByPlayerIsLess: $(
          ['', 'Mem', '16bit', o, '>', 'Mem', '16bit', o + 0x8]
        ),
        killCountIsLessThan: (c = -1) => $(
          ['', 'Mem', '16bit', o, '<', 'Value', '', c]
        ),
        killCountAddSource: $(
          ['AddSource', 'Mem', '16bit', o]
        ),
        killCountIsMoreThan: (c = -1) => $(
          ['', 'Mem', '16bit', o, '>', 'Value', '', c]
        ),
        killCountIsAtleast: (c = -1) => $(
          ['', 'Mem', '16bit', o, '>=', 'Value', '', c]
        ),
        escapeCountIsLessThan: (c = -1) => $(
          ['', 'Mem', '16bit', o + 0x2, '<', 'Value', '', c]
        ),
        escapeCountIsMoreThan: (c = -1) => $(
          ['', 'Mem', '16bit', o + 0x2, '>', 'Value', '', c]
        ),
        escapeCountIsAtLeast: (c = -1) => $(
          ['', 'Mem', '16bit', o + 0x2, '>=', 'Value', '', c]
        ),
        captureCountIsLessThan: (c = -1) => $(
          ['', 'Mem', '16bit', o + 0x4, '<', 'Value', '', c]
        ),
        captureCountIsAtleast: (c = -1) => $(
          ['', 'Mem', '16bit', o + 0x4, '<', 'Value', '', c]
        ),
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

    /** @param  {Array<'big' | 'mid' | 'small'>} types */
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
        isAtleast: (value = -1) => base.withLast({ flag: '', cmp: '>=', rvalue: ['Value', '', value] }),
        isLessThan: (value = -1) => base.withLast({ flag: '', cmp: '<', rvalue: ['Value', '', value] })
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
 * @param {Array<WeaponName>} [params.weaponExceptions]
 * @param {Array<WeaponName>} [params.weaponForbidden]
 * @param {number} [params.shipId]
 * @param {number} [params.maxMissiles]
 * @param {number} [params.maxTorpedoes]
 * @param {CodeCallback} [params.inGameTrigger]
 * @param {CodeCallback} [params.resetIf]
 * @param {CodeCallback} [params.measured]
 */
function missionAchievement(params) {
  const { id, weaponExceptions = [], weaponForbidden = [] } = params
  const [station] = missionIds[id[0] + '_' + id[1]]

  let notAllowedWeapons = Object.entries(weapons)
    .filter((/** @type WeaponEntry */[name, w]) => {
      if (weaponExceptions.includes(name)) {
        return false
      }

      if (weaponForbidden.includes(name)) {
        return true
      }

      return w.station > station || w.cheat || w.station === undefined
    })
    .map(x => x[1])

  // Infilitration mission has fixed weapon choice
  // Cheat protection is there already, only don't allow
  // what achievement doesn't allow
  if (id[0] === 0 && id[1] === 11) {
    notAllowedWeapons = weaponForbidden.map(w => weapons[w])
  }

  const notAllowedHardpoints = notAllowedWeapons.filter(w => w.firingCheck === 'hardpoint')

  const allowedWeapons = Object.values(weapons).filter(w => notAllowedWeapons.includes(w) === false)
  const allowedMissiles = allowedWeapons.filter(w => w.missile)
  const allowedTorpedoes = allowedWeapons.filter(w => w.torpedo)

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
      params.shipId !== undefined && c.shipIs(params.shipId),
      params.shipId === undefined && c.correctShipForMission(params.id[0], params.id[1]),
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

      params.resetIf && resetIf(params.resetIf(c, region)),

      params.maxMissiles > 0 && resetNextIf(
        c.timerIsZero
      ).resetIf(
        `hits ${params.maxMissiles + 1}`,
        c.firedWeapon(...allowedMissiles)
      ),

      params.maxTorpedoes > 0 && resetNextIf(
        c.timerIsZero
      ).resetIf(
        `hits ${params.maxTorpedoes + 1}`,
        c.firedWeapon(...allowedTorpedoes)
      ),
    ))

    groups.push($(
      c.regionCheckPause,
      'hcafe!=hcafe',
      resetIf(
        c.cheatActive,
        andNext(
          c.gamePaused,
          c.missionComplete
        ),
        andNext(
          c.isNotInGame,
          c.missionComplete.with({ cmp: '!=' })
        ),

        c.firedWeapon(...notAllowedWeapons),
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
  title: 'Snowstompers',
  description: 'Escort Duty: complete the mission with all three Cargo Stompers escorted to the Depot',
  points: 5,
  conditions: missionAchievement({
    id: [1, 1],
    resetIf: c => andNext(
      c.entityGroup(7).killCountIsMoreThan(0),
      c.missionInProgress
    ),
  })
})

set.addAchievement({
  title: 'Outer Sneak',
  description: 'Insult and Injury: stay close to EW Pod until you identify the target, then complete the mission',
  points: 3,
  conditions: missionAchievement({
    id: [1, 2],
    resetIf: c => andNext(
      c.semaphore(0).is(1), // EW pod escapes
      c.semaphore(4).is(0), // identification complete
      c.missionInProgress,
    ),
  })
}).addAchievement({
  title: 'Actual Insult to Injury',
  description: 'Insult and Injury: immediately disregard stealth and complete the mission by destroying both Insult and Injury',
  points: 3,
  conditions: missionAchievement({
    id: [1, 2],
    resetIf: c => $(
      andNext(
        c.semaphore(0).is(0),
        c.timerIsAboveInMsec(10000),
        c.missionInProgress,
      ),
      andNext(
        c.isNotInGame,
        c.entityGroup(4).killCountIsLessThan(1),
        c.entityGroup(5).killCountIsLessThan(1),
      )
    ),
    measured: c => $(
      c.entityGroup(4).killCountAddSource,
      c.entityGroup(5).killCountIsAtleast(2)
    )
  })
}).addAchievement({
  title: 'Cloak and Dagger',
  description: 'Insult and Injury: cheat yourself a grapple gun and have the target identified in less than 30 seconds, then complete the mission',
  points: 3,
  conditions: missionAchievement({
    id: [1, 2],
    resetIf: c => $(
      andNext(
        c.semaphore(4).is(0),
        c.timerIsAboveInMsec(30000),
        c.missionInProgress,
      ),
      andNext(
        c.haveHardpoints(5, weapons['Grapple Gun'])
          .map(x => x.with({ cmp: '!=' }))
      )
    ),
    weaponExceptions: ['Grapple Gun']
  })
})

set.addAchievement({
  title: 'Canyon Sweep',
  description: 'Covert Insertion: complete mission with all Rebel Tanks and Fighters destroyed',
  points: 3,
  conditions: missionAchievement({
    id: [1, 3],
    resetIf: c => andNext(
      c.isNotInGame,
      c.killCountSumFor('small').isLessThan(8)
    ),
    measured: c => c.killCountSumFor('small').isAtleast(8)
  })
}).addAchievement({
  title: 'Peekaboo',
  description: 'Covert Insertion: covertly destroy one of SAAD installations',
  points: 1,
  conditions: missionAchievement({
    id: [1, 3],
    inGameTrigger: c => andNext(
      c.entityGroup(3).killCountIsMoreThan(0),
      c.missionInProgress
    )
  })
})

set.addAchievement({
  title: 'Overkill',
  description: 'Rebel Smugglers: stay around for a while and complete the mission with 25 kills or more',
  points: 5,
  conditions: missionAchievement({
    id: [1, 4],
    resetIf: c => andNext(
      c.isNotInGame,
      c.killCountSumFor('small', 'big').isLessThan(25)
    ),
    measured: c => c.killCountSumFor('small', 'big').isAtleast(25)
  })
})

set.addAchievement({
  title: 'Do You Remember Your Dreams?',
  description: 'Valdemar: complete the mission',
  points: 5,
  type: 'progression',
  conditions: missionAchievement({
    id: [0, 1]
  })
})

set.addAchievement({
  title: 'Cargo High',
  description: 'Convoy (Magenta): complete the mission',
  points: 5,
  type: 'progression',
  conditions: missionAchievement({
    id: [0, 2]
  })
}).addAchievement({
  title: `Don't Get Eaten`,
  description: 'Convoy (Magenta): complete the mission with all 9 pieces of cargo delivered',
  points: 5,
  conditions: missionAchievement({
    id: [0, 2],
    resetIf: c => $(
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
  title: 'Retrieve...',
  description: 'Retrieval (Magenta): complete the mission',
  points: 10,
  type: 'progression',
  conditions: missionAchievement({
    id: [0, 3]
  })
}).addAchievement({
  title: '...Then Retreat',
  description: `Retrieval (Magenta): complete the mission and ensure the Empiret Decoder doesn't get any hull damage`,
  points: 5,
  conditions: missionAchievement({
    id: [0, 3],
    resetIf: c => andNext(
      c.entityGroupPtr(1).notNull,
      c.entityGroupPtr(1).hullDamaged,
      c.missionInProgress,
    )
  })
})

set.addAchievement({
  title: 'No Competition',
  description: 'Retrieval (Marjorie): scare away the Snake Mahoney going after the Idol',
  points: 3,
  conditions: missionAchievement({
    id: [1, 5],
    inGameTrigger: c => andNext(
      c.entityGroup(1).escapeCountIsMoreThan(0),
      c.missionInProgress,
      c.timerAdvanced
    )
  })
}).addAchievement({
  title: 'High Card',
  description: 'Retrieval (Marjorie): complete the mission in less than 70 seconds',
  points: 3,
  conditions: missionAchievement({
    id: [1, 5],
    resetIf: c => andNext(
      c.timerIsAboveInMsec(70000),
      c.missionInProgress,
    )
  })
})

set.addAchievement({
  title: 'Safe Return',
  description: 'Convoy (Marjorie): complete the mission with all Refugee Haulers and Cargo Pods escorted',
  points: 5,
  conditions: missionAchievement({
    id: [1, 6],
    resetIf: c => andNext(
      orNext(
        c.entityGroup(4).killCountIsMoreThan(0),
        c.entityGroup(4).escapeCountIsMoreThan(0),
        c.entityGroup(10).killCountIsMoreThan(0),
      ),
      c.missionInProgress,
    ),
  })
})

set.addAchievement({
  title: 'Valdemar Saves the Animals',
  description: 'Investigation: complete the mission with at least three Terraform Stations staying intact',
  points: 3,
  conditions: missionAchievement({
    id: [1, 7],
    resetIf: c => andNext(
      c.entityGroup(5).killCountIsMoreThan(1),
      c.missionInProgress,
    ),
  })
})

set.addAchievement({
  title: 'Thunderbowl',
  description: 'Thunderbowl I: destroy all contestants yourself, up to 3 any missile shots max',
  points: 5,
  conditions: missionAchievement({
    id: [1, 8],
    maxMissiles: 3,
    resetIf: c => andNext(
      orNext(
        ...[4, 5, 6].map(x => c.entityGroup(x).killCountByPlayerIsLess)
      ),
      c.missionInProgress,
    )
  })
})

set.addAchievement({
  title: 'Sunburn',
  description: 'Surgical Strike: destroy the Precinct 31 without any additional casualties',
  points: 3,
  conditions: missionAchievement({
    id: [1, 9],
    resetIf: c => andNext(
      c.killCountSumFor('small', 'big').isAtleast(1),
      c.missionInProgress
    )
  })
})

set.addAchievement({
  title: 'Jellypoaching',
  description: 'Hunting: help the barge capture at least 6 Protoshelp Cows',
  points: 5,
  conditions: missionAchievement({
    id: [1, 10],
    resetIf: c => andNext(
      c.isNotInGame,
      c.entityGroup(5).captureCountIsLessThan(6)
    ),
    measured: c => c.entityGroup(5).captureCountIsAtleast(6)
  })
})

set.addAchievement({
  title: 'The Loveboat',
  description: `Protection: complete the mission`,
  points: 3,
  conditions: missionAchievement({
    id: [1, 11]
  })
})

set.addAchievement({
  title: 'Old School Defense',
  description: `Gang Warfare: complete the mission without using GP Lasers`,
  points: 5,
  conditions: missionAchievement({
    id: [1, 12],
    weaponForbidden: [
      'GP Laser Mk I',
      'GP Laser Mk II'
    ]
  })
})

set.addAchievement({
  title: `Hell's Kitchen`,
  description: `Defense: complete the mission`,
  points: 5,
  type: 'progression',
  conditions: missionAchievement({
    id: [0, 4]
  })
}).addAchievement({
  title: 'Now We Gamble',
  description: `Defense: complete the mission without using Repair Pod and ensure Marjorie Station doesn't get any hull damage`,
  points: 5,
  conditions: missionAchievement({
    id: [0, 4],
    resetIf: c => andNext(
      c.entity(5).hullDamaged,
      c.missionInProgress,
    ),
    weaponForbidden: ['Repair Pod']
  })
}).addAchievement({
  title: 'I Was Broke',
  description: `Defense: complete the mission while piloting Zu-7 Ryusei`,
  points: 5,
  conditions: missionAchievement({
    id: [0, 4],
    shipId: 1
  })
})

set.addAchievement({
  title: 'Scarcity',
  description: `Rescue Hilachet Ship: complete the mission`,
  points: 5,
  type: 'progression',
  conditions: missionAchievement({
    id: [0, 5]
  })
}).addAchievement({
  title: 'Five Hardpoints is Enough',
  description: `Rescue Hilachet Ship: complete the mission while piloting Zu-7 Ryusei`,
  points: 5,
  conditions: missionAchievement({
    id: [0, 5],
    shipId: 1
  })
})

set.addAchievement({
  title: 'Delicate Rescue Mission',
  description: `Calculus 3: complete the mission`,
  points: 5,
  type: 'progression',
  conditions: missionAchievement({
    id: [0, 6]
  })
}).addAchievement({
  title: 'You Do the Math',
  description: `Calculus 3: complete the mission while piloting Zu-7 Ryusei`,
  points: 5,
  conditions: missionAchievement({
    id: [0, 6],
    shipId: 1
  })
})

set.addAchievement({
  title: 'Eating Dirt',
  description: 'Seek and Destroy: complete the mission with at least 13 kills',
  points: 5,
  conditions: missionAchievement({
    id: [1, 13],
    resetIf: c => andNext(
      c.isNotInGame,
      c.killCountSumFor('small', 'mid').isLessThan(13)
    ),
    measured: c => c.killCountSumFor('small', 'mid').isAtleast(13)
  })
})

set.addAchievement({
  title: 'Three of a Kind',
  description: 'Tank Support: complete the mission with all three Dirt Warrior Tanks alive',
  points: 5,
  conditions: missionAchievement({
    id: [1, 14],
    resetIf: c => andNext(
      c.entityGroup(2).killCountIsMoreThan(0),
      c.missionInProgress,
    )
  })
})

set.addAchievement({
  title: 'This Contract is Fire',
  description: 'Defend Refinery: complete the mission with at least 9 Fuel Silos intact',
  points: 5,
  conditions: missionAchievement({
    id: [1, 15],
    resetIf: c => andNext(
      c.entityGroup(2).killCountIsMoreThan(3),
      c.missionInProgress,
    )
  })
})

set.addAchievement({
  title: 'Target Painting',
  description: 'Templecruiser: complete the mission',
  points: 5,
  conditions: missionAchievement({
    id: [1, 16]
  })
})

set.addAchievement({
  title: 'Radio Silence',
  description: 'Rescue Team: complete the mission',
  points: 5,
  conditions: missionAchievement({
    id: [1, 17]
  })
})

set.addAchievement({
  title: 'Four of a Kind',
  description: 'Clear Path: complete the mission with all four Dargothan Haulers escorted through jumpgate',
  points: 5,
  conditions: missionAchievement({
    id: [1, 18],
    resetIf: c => $(
      andNext(
        c.entityGroup(3).killCountIsMoreThan(0),
        c.missionInProgress
      ),
      andNext(
        c.isNotInGame,
        c.entityGroup(3).escapeCountIsLessThan(4)
      )
    )
  })
})

set.addAchievement({
  title: 'Not a Cult',
  description: 'Protect Cult: complete the mission without using primary weapons',
  points: 5,
  conditions: missionAchievement({
    id: [1, 19],
    weaponForbidden: Object.entries(weapons)
      .filter(x => x[1].type === 'primary')
      .map(x => /** @type WeaponName */(x[0]))
  })
})

set.addAchievement({
  title: 'Thunderbowl II: With Vengeance',
  description: 'Thunderbowl II: destroy all contestants yourself, up to 3 any missile and 1 torpedo shots max',
  points: 5,
  conditions: missionAchievement({
    id: [1, 20],
    resetIf: c => andNext(
      orNext(
        ...[2, 3, 4].map(x => c.entityGroup(x).killCountByPlayerIsLess)
      ),
      c.missionInProgress,
    ),
    maxMissiles: 3,
    maxTorpedoes: 1,
  })
})

set.addAchievement({
  title: 'Extremely Illegal Jelly',
  description: 'Kidnap Queen: complete the mission with at least 30 kills, only Plasma Cannon and secondary weapons are allowed',
  points: 5,
  conditions: missionAchievement({
    id: [1, 21],
    resetIf: c => andNext(
      c.isNotInGame,
      c.killCountSumFor('small').isLessThan(30)
    ),
    measured: c => c.killCountSumFor('small').isAtleast(30),
    weaponForbidden: Object.entries(weapons)
      .filter(x => x[0] !== 'Plasma Cannon' && x[1].type === 'primary')
      .map(x => /** @type WeaponName */(x[0]))
  })
})

set.addAchievement({
  title: 'Shield Bubble',
  description: 'Distress Call: complete the mission',
  points: 5,
  conditions: missionAchievement({
    id: [1, 22],
  })
})

set.addAchievement({
  title: 'Crucial Research Piece',
  description: 'Genesis: complete the mission',
  points: 5,
  type: 'progression',
  conditions: missionAchievement({
    id: [0, 7],
  })
}).addAchievement({
  title: `It's Getting Tougher`,
  description: 'Genesis: complete the mission while piloting Zu-7 Ryusei',
  points: 10,
  conditions: missionAchievement({
    id: [0, 7],
    shipId: 1
  })
})

set.addAchievement({
  title: 'Emergency',
  description: 'Escape: complete the mission',
  points: 10,
  type: 'progression',
  conditions: missionAchievement({
    id: [0, 8],
  })
}).addAchievement({
  title: `Don't Let It Away`,
  description: 'Escape: complete the mission while piloting Zu-7 Ryusei',
  points: 10,
  conditions: missionAchievement({
    id: [0, 8],
    shipId: 1
  })
})

set.addAchievement({
  title: 'Precious Drones',
  description: 'Robohunting: complete the mission',
  points: 5,
  conditions: missionAchievement({
    id: [1, 23]
  })
})

set.addAchievement({
  title: 'Escape the Sun',
  description: 'Solar Flare: complete the mission with all six Refugee Habitats rescued',
  points: 5,
  conditions: missionAchievement({
    id: [1, 24],
    resetIf: c => $(
      andNext(
        c.isNotInGame,
        c.entityGroup(5).escapeCountIsLessThan(6),
      ),
      andNext(
        c.entityGroup(5).killCountIsMoreThan(0),
        c.missionInProgress
      )
    ),
    measured: c => c.entityGroup(5).escapeCountIsAtLeast(6)
  })
})

set.addAchievement({
  title: 'Crowd Control',
  description: 'Protect Refugees: complete the mission with all four Refugee Habitats escorted',
  points: 5,
  conditions: missionAchievement({
    id: [1, 25],
    resetIf: c => $(
      c.semaphore(4).is(1),
      c.semaphore(8).is(1),
      c.semaphore(24).is(1),
      c.semaphore(28).is(1),

      andNext(
        c.entityGroup(4).killCountIsMoreThan(0),
        c.missionInProgress,
      ),
      andNext(
        c.isNotInGame,
        c.entityGroup(4).escapeCountIsLessThan(4)
      )
    )
  })
})

set.addAchievement({
  title: 'Ride the Nuke',
  description: 'Scavenge This: complete the mission',
  points: 5,
  conditions: missionAchievement({
    id: [1, 26]
  })
})

set.addAchievement({
  title: 'Disarmament',
  description: 'Hostage Release: complete the mission',
  points: 5,
  conditions: missionAchievement({
    id: [1, 27]
  })
})

set.addAchievement({
  title: 'Advanced Escort Duty',
  description: 'Roadblock: complete the mission with all three Cargo Stompers escorted',
  points: 5,
  conditions: missionAchievement({
    id: [1, 28],
    resetIf: c => andNext(
      c.entityGroup(5).killCountIsMoreThan(0),
      c.missionInProgress,
    )
  })
})

set.addAchievement({
  title: 'Thunderbowl III: Final Bowl',
  description: 'Thunderbowl III: destroy all contestants yourself, up to 3 any missile and 1 torpedo shots max, without using BFG',
  points: 5,
  conditions: missionAchievement({
    id: [1, 29],
    resetIf: c => andNext(
      orNext(
        ...[2, 3, 4].map(x => c.entityGroup(x).killCountByPlayerIsLess)
      ),
      c.missionInProgress,
    ),
    maxMissiles: 3,
    maxTorpedoes: 1,
    weaponForbidden: ['BFG']
  })
})

set.addAchievement({
  title: 'Alien Extraction',
  description: `Capture Sha'Har: complete the mission`,
  points: 5,
  type: 'progression',
  conditions: missionAchievement({
    id: [0, 9],
  })
}).addAchievement({
  title: 'Low Shields, Big Firepower',
  description: `Capture Sha'Har: complete the mission while piloting Zu-7 Ryusei`,
  points: 10,
  conditions: missionAchievement({
    id: [0, 9],
    shipId: 1
  })
})

set.addAchievement({
  title: 'Nanocrisis',
  description: `Defender: complete the mission`,
  points: 10,
  type: 'progression',
  conditions: missionAchievement({
    id: [0, 10],
  })
}).addAchievement({
  title: 'Camping',
  description: `Defender: complete the mission while piloting Zu-7 Ryusei`,
  points: 25,
  conditions: missionAchievement({
    id: [0, 10],
    shipId: 1
  })
})

set.addAchievement({
  title: 'Black Box Recovery',
  description: 'Necessity: complete the mission',
  points: 5,
  conditions: missionAchievement({
    id: [1, 30]
  })
})

set.addAchievement({
  title: 'Flush',
  description: 'Sabotage: complete the mission',
  points: 5,
  conditions: missionAchievement({
    id: [1, 31]
  })
})

set.addAchievement({
  title: 'Banish to Subspace',
  description: 'Hilachet Betrayed: complete the mission',
  points: 5,
  conditions: missionAchievement({
    id: [1, 32]
  })
})

set.addAchievement({
  title: 'Probe Complete',
  description: 'Infiltrate: complete the mission',
  points: 5,
  conditions: missionAchievement({
    id: [0, 11],
    weaponExceptions: ['Death Ray']
  })
}).addAchievement({
  title: 'Death Rays',
  description: 'Infiltrate: complete the mission with 30 kills and without using flares',
  points: 5,
  conditions: missionAchievement({
    id: [0, 11],
    resetIf: c => andNext(
      c.isNotInGame,
      c.killCountSumFor('small').isLessThan(30)
    ),
    measured: c => c.killCountSumFor('small').isAtleast(30),
    weaponExceptions: ['Death Ray'],
    weaponForbidden: ['Flare']
  })
})

set.addAchievement({
  title: 'Gone',
  description: 'Gauntlet: complete the mission',
  points: 5,
  type: 'progression',
  conditions: missionAchievement({
    id: [0, 12]
  })
}).addAchievement({
  title: 'Furball',
  description: 'Gauntlet: complete the first part of the mission with at least 15 fighters destroyed, without using BFG',
  points: 5,
  conditions: missionAchievement({
    id: [0, 12],
    inGameTrigger: c => andNext(
      c.killCountSumFor('small').isAtleast(15),
      c.missionComplete,
    ),
    resetIf: c => andNext(
      c.killCountSumFor('small').isLessThan(15),
      c.missionComplete,
    ),
    measured: c => c.killCountSumFor('small').isAtleast(15),
    weaponForbidden: ['BFG']
  })
}).addAchievement({
  title: 'Think Ryusei',
  description: 'Gauntlet: complete the mission while piloting Zu-7 Ryusei',
  points: 10,
  conditions: missionAchievement({
    id: [0, 12],
    shipId: 1
  })
})

set.addAchievement({
  title: 'Sunset',
  description: 'Destroy Red Sun: complete the mission',
  points: 10,
  type: 'progression',
  conditions: missionAchievement({
    id: [0, 13]
  })
}).addAchievement({
  title: 'Murderous Technology',
  description: 'Destroy Red Sun: complete the mission while piloting Zu-7 Ryusei',
  points: 25,
  conditions: missionAchievement({
    id: [0, 13],
    shipId: 1
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
            prev[group * 100 + id] = value[1]
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