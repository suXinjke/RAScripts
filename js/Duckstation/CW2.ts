import { AchievementSet, define as $, once, trigger, andNext, resetIf, orNext, measuredIf, measured, resetNextIf, pauseIf, ConditionBuilder, addHits } from '@cruncheevos/core'
import { givenRangeOf, makeMultiRegionalConditionsFunction } from '../common.ts'

const HEX = 0
const WRAITH = 1
const DIABLO = 2

const infiniteHealthCheatOff = $.one(['', 'Mem', '8bit', 0x34444, '=', 'Value', '', 0])
const levelSelectCheatOff = $.one(['', 'Mem', '8bit', 0x34445, '=', 'Value', '', 0])
const infiniteSecondaryWeaponCheatOff = $.one(['', 'Mem', '8bit', 0x34446, '=', 'Value', '', 0])
const noWeaponOverheatCheatOff = $.one(['', 'Mem', '8bit', 0x34447, '=', 'Value', '', 0])
const infiniteAfterburnersCheatOff = $.one(['', 'Mem', '8bit', 0x34449, '=', 'Value', '', 0])
const allWeaponsCheatOff = $.one(['', 'Mem', '8bit', 0x3444b, '=', 'Value', '', 0])
const allInGameCheatsOff = $(
  infiniteHealthCheatOff,
  infiniteSecondaryWeaponCheatOff,
  noWeaponOverheatCheatOff,
  infiniteAfterburnersCheatOff,
  allWeaponsCheatOff,
)

const noDemoPlaybackAndParticleGun = $.one(['', 'Mem', '8bit', 0x34c8c, '=', 'Value', '', 0])
const inLoadingScreen = $.one(['', 'Mem', '16bit', 0x34684, '=', 'Value', '', 0xA0])

function pauseCodeBelowUntilSubMission(subMission: number) {
  return $(
    ['AndNext', 'Mem', '16bit', 0x34684, '!=', 'Delta', '16bit', 0x34684],
    ['ResetNextIf', 'Mem', '16bit', 0x34684, '=', 'Value', '', 0x100, subMission],
    ['PauseIf', 'Mem', '16bit', 0x34684, '=', 'Value', '', 0xA0, 1],
  )
}

const techTokens = {
  measuredValue: $.one(['Measured', 'Mem', '16bit', 0x5514c]),
  hasNone: $.one(['', 'Mem', '16bit', 0x5514c, '=', 'Value', '', 0]),
  received: $.one(['', 'Mem', '16bit', 0x5514c, '>', 'Delta', '16bit', 0x5514c])
}

const mission = {
  completedInGame: $.one(['', 'Mem', '8bit', 0x59d76, '=', 'Value', '', 2]),
  get completed() {
    return $(
      andNext(
        techTokens.received,
        ['', 'Mem', '16bit', 0x34684, '=', 'Value', '', 0x100],
        once(mission.completedInGame),
      ),
    )
  },

  inProgress: $.one(['', 'Mem', '8bit', 0x59d76, '=', 'Value', '', 0]),
  notCompleted: $.one(['', 'Mem', '8bit', 0x59d76, '!=', 'Value', '', 2]),
  failed: $.one(['', 'Mem', '8bit', 0x59d76, '=', 'Value', '', 0]),

  onFirstFrame: $(
    ['', 'Mem', '16bit', 0x34684, '=', 'Value', '', 0x100],
    ['', 'Mem', '32bit', 0x34440, '=', 'Value', '', 0],
  ),
  pastFirstFrame: $(
    ['', 'Mem', '16bit', 0x34684, '=', 'Value', '', 0x100],
    ['', 'Mem', '32bit', 0x34440, '>', 'Value', '', 0],
  )
}

const inMainMenu = $.one(['', 'Mem', '16bit', 0x34684, '=', 'Value', '', 0x140])
const bailedIntoMainMenu = $(
  ['AndNext', 'Mem', '16bit', 0x34684, '!=', 'Delta', '16bit', 0x34684],
  ['', 'Mem', '16bit', 0x34684, '=', 'Value', '', 0x100],
)

const player = {
  markedTraitor: $.one(['', 'Mem', '8bit', 0x59d76, '=', 'Value', '', 8]),
  sufferedShieldDamage: $.one(['', 'Mem', '32bit', 0x45fb4, '<', 'Delta', '32bit', 0x45fb4]),

  // so hard that it's hull value becomes negative
  sufferedShieldDamageExtremelyHard: $(
    ['AndNext', 'Delta', '32bit', 0x45fb4, '<', 'Value', '', 16534],
    ['AndNext', 'Mem', '32bit', 0x45fb4, '>', 'Delta', '32bit', 0x45fb4],
    ['AndNext', 'Mem', '32bit', 0x45fb4, '>', 'Value', '', 0xffffff00],
    ['', 'Mem', '16bit', 0x4cf68, '>', 'Delta', '16bit', 0x4cf68]
  ),
  sufferedHullDamage: $.one(['', 'Mem', '32bit', 0x45fb8, '<', 'Delta', '32bit', 0x45fb8]),
  hasHulls: $(
    ['AndNext', 'Mem', '32bit', 0x45fb8, '>', 'Value', '', 0],
    ['', 'Mem', '32bit', 0x45fb8, '<', 'Value', '', 0x7FFFFFFF]
  ),

  isFlyingShip: (ship: number) => $.one(
    ['', 'Mem', '8bit', 0x41ff4, '=', 'Value', '', ship]
  ),

  isDead: $.one(['', 'Mem', '8bit', 0x59d76, '=', 'Value', '', 4]),

  cameraDetached: $.one(['', 'Mem', '8bit', 0x34724, '=', 'Value', '', 5]),

  isGrappled: $(
    ['AndNext', 'Mem', '8bit', 0x59d72, '=', 'Value', '', 14],
    ['AndNext', 'Mem', '8bit', 0x59d74, '=', 'Value', '', 1],
    ['', 'Mem', '8bit', 0x46016, '>', 'Value', '', 0],
  ),
  isOperatingParticleGun: $.one(['', 'Mem', '8bit', 0x34c8c, '=', 'Value', '', 4])
}

const timeTrialValue = $.one(['Measured', 'Mem', '32bit', 0x34440, '*', 'Value', '', 2])

const actIs = (act: number) => $.one(['', 'Mem', '8bit', 0x59d72, '=', 'Value', '', act])
const missionIs = (mission: number) => $.one(['', 'Mem', '8bit', 0x59d74, '=', 'Value', '', mission])

function startedMission(opts: {
  ship?: number
  act?: number
  mission?: number
  missions?: Array<[number, number, 'ground'?]>
  withoutCheatChecks?: boolean
  exactShip?: boolean

  additionalConditions?: ConditionBuilder
} = {}) {
  const missions = opts.missions || [[opts.act, opts.mission]]

  const hasMultipleMissions = missions.length > 1

  const demoPlayback = $.one(['', 'Mem', '8bit', 0x34c8c, '=', 'Value', '', 2])
  const anyInGameCheatOn = allInGameCheatsOff.map(c => c.with({ cmp: '!=' }))

  return $(
    pauseIf(
      opts.withoutCheatChecks !== true && anyInGameCheatOn,
      demoPlayback
    ).resetIf(
      inMainMenu
    ),

    ...missions.map(([act, mission, isGroundMission]) => andNext(
      (opts.ship >= 0 && !isGroundMission) && player.isFlyingShip(opts.ship).with({
        cmp: opts.exactShip || opts.ship === 0 ? '=' : '<='
      }),
      act > 0 && actIs(act),
      mission > 0 && missionIs(mission),
      opts.additionalConditions,
      [hasMultipleMissions ? 'AddHits' : '', 'Mem', '32bit', 0x34a68, '=', 'Value', '', 132, 1],
    )),
    hasMultipleMissions && `0=1.1.`
  )
}

function entityInstance(index: number) {
  const base = 0x46520 + 0x280 * index
  const id = base + 0x4
  const bitmask = base + 0x119
  const shields = base + 0x214
  const hulls = base + 0x218

  const gotHullDamage = $.one(['', 'Mem', '32bit', hulls, '<', 'Delta', '32bit', hulls])

  return {
    notProbed: $.one(['', 'Mem', 'Bit3', bitmask, '=', 'Value', '', 0]),
    probed: $.one(['', 'Mem', 'Bit3', bitmask, '=', 'Value', '', 1]),
    noShields: $.one(['', 'Mem', '32bit', shields, '=', 'Value', '', 0]),
    hasNoHulls: $.one(['', 'Mem', '32bit', hulls, '=', 'Value', '', 0]),
    gotShieldDamage: $.one(['', 'Mem', '32bit', shields, '<', 'Delta', '32bit', shields]),
    gotHullDamage,
    gotShieldsLowerThan: (value: number) => $.one(
      ['', 'Mem', '32bit', shields, '<', 'Value', '', value],
    ),

    withId: (entityId: number) => ({
      gotHullDamage: $(
        ['AndNext', 'Mem', '8bit', id, '=', 'Value', '', entityId],
        ['AndNext', 'Mem', '8bit', id, '=', 'Delta', '8bit', id],
        gotHullDamage,
      )
    }),
  }
}

function entityIDStats(index: number) {
  const killCount = 0x4cf68 + index * 0x44
  const objectiveCount = killCount + 0x2
  const jumpedInCount = killCount + 0x4

  return {
    hasKills: $.one(['', 'Mem', '16bit', killCount, '>', 'Value', '', 0]),
    gotKilled: $.one(['', 'Mem', '16bit', killCount, '>', 'Delta', '16bit', killCount]),
    gotKilledExactTimes: (times: number) => $.one(
      ['', 'Mem', '16bit', killCount, '=', 'Value', '', times]
    ),
    gotKilledLessThan: (times: number) => $.one(
      ['', 'Mem', '16bit', killCount, '<', 'Value', '', times]
    ),
    jumpedInAtleastOnce: $.one(['', 'Mem', '8bit', jumpedInCount, '>', 'Value', '', 0]),
    jumpedInHit: $.one(['', 'Mem', '8bit', jumpedInCount, '!=', 'Value', '', 0, 1]),
    jumpedInExactTimes: (times: number) => $.one(
      ['', 'Mem', '8bit', jumpedInCount, '=', 'Value', '', times]
    ),

    objectiveAccomplished: $.one(['', 'Mem', '16bit', objectiveCount, '>', 'Delta', '16bit', objectiveCount]),
  }
}

type Region = 'ntsc' | 'pal'

const codeFor = (r: Region) => {
  const inGameOffset = r === 'pal' ? 0x2c0 : 0
  const menuOffset = r === 'pal' ? 0x10 : 0

  const regionCheck = $(
    r === 'ntsc' && $.one(['', 'Mem', '24bit', 0x9e1e, '=', 'Value', '', 0x373030]),
    r === 'pal' && $.one(['', 'Mem', '24bit', 0x9e1e, '=', 'Value', '', 0x333130]),
  )

  return {
    inGameOffset,

    regionCheck,
    pauseIfRegionCheck: pauseIf(regionCheck.withLast({ cmp: '!=' })),

    playerCannotMove: $.one(['', 'Delta', '8bit', 0x11e250 + inGameOffset, '=', 'Value', '', 0]),

    weaponInstance(index: number) {
      const heat = 0x12e21c + inGameOffset + index * 0x58
      const icon = heat + 0x8
      const shotsLeft = heat + 0xc
      const leachBeamThing = heat + 0x28

      return {
        wasSameWeaponForOneFrame: $.one(['', 'Mem', '8bit', icon, '=', 'Delta', '8bit', icon]),
        isHeatingUp: $.one(['', 'Mem', '32bit', heat, '>', 'Value', '', 0]),
        isAlienLaser: $.one(['', 'Mem', '8bit', icon, '=', 'Value', '', 7]),

        gotLaunched: $.one(['', 'Mem', '32bit', shotsLeft, '<', 'Delta', '32bit', shotsLeft]),
        shotPlasma: $.one(['', 'Mem', '32bit', heat, '<', 'Delta', '32bit', heat]),
        shotLeachBeam: $.one(['', 'Mem', '32bit', leachBeamThing, '>', 'Delta', '32bit', leachBeamThing]),
      }
    },

    currentWeaponInstance: (() => {
      const lookup = $.one(['AddAddress', 'Mem', '8bit', 0x11cad0 + inGameOffset, '*', 'Value', '', 88])
      const isNotFiredCondition = $.one(['', 'Mem', '32bit', 0x12e220 + inGameOffset, '=', 'Value', '', 0])

      return {
        isNotAlienLaser: $(
          lookup,
          ['', 'Mem', '32bit', 0x12e224 + inGameOffset, '!=', 'Value', '', 7],
        ),
        isNotScatterGun: $(
          lookup,
          ['', 'Mem', '32bit', 0x12e224 + inGameOffset, '!=', 'Value', '', 6],
        ),
        isNotFired: $(
          lookup,
          isNotFiredCondition,
        ),
        isNotFiredAndCoolingDown: $(
          lookup,
          ['AndNext', 'Mem', '32bit', 0x12e220 + inGameOffset, '<', 'Delta', '32bit', 0x12e220 + inGameOffset],
          lookup,
          isNotFiredCondition
        )
      }
    })(),

    displayedTimeWentBelow: (timeInfFrames: number) => $.one(['', 'Mem', '32bit', 0x11e400 + inGameOffset, '<=', 'Value', '', timeInfFrames]),

    isOnHomeScreen: andNext(
      ['', 'Mem', '32bit', 0xc4998 + menuOffset, '>', 'Value', '', 0x80000000],
      ['AddAddress', 'Mem', '24bit', 0xc4998 + menuOffset],
      ['', 'Mem', '8bit', 0x18, '=', 'Value', '', 1],
    ),

    loadedTheGameFromMemoryCard: andNext(
      regionCheck,
      ['', 'Mem', '32bit', 0xc4998 + menuOffset, '>', 'Value', '', 0x80000000],
      ['', 'Mem', '32bit', 0xc4998 + menuOffset, '>', 'Delta', '32bit', 0xc4998 + menuOffset],
      ['AddAddress', 'Mem', '24bit', 0xc4998 + menuOffset],
      ['', 'Mem', '8bit', 0x18, '=', 'Value', '', 78],
      ['AddAddress', 'Mem', '24bit', 0xc4998 + menuOffset],
      ['', 'Delta', '8bit', 0x18, '=', 'Value', '', 78],
    ),

    resetTheGameFromMenu: andNext(
      regionCheck,
      ['', 'Mem', '32bit', 0xc4998 + menuOffset, '>', 'Value', '', 0x80000000],
      ['', 'Mem', '32bit', 0xc4998 + menuOffset, '>', 'Delta', '32bit', 0xc4998 + menuOffset],
      ['AddAddress', 'Mem', '24bit', 0xc4998 + menuOffset],
      ['', 'Mem', '8bit', 0x18, '=', 'Value', '', 10],
      ['AddAddress', 'Mem', '24bit', 0xc4998 + menuOffset],
      ['', 'Delta', '8bit', 0x18, '=', 'Value', '', 10],
    )
  }
}

const c = {
  ntsc: codeFor('ntsc'),
  pal: codeFor('pal'),
}

const multiRegionalConditions = makeMultiRegionalConditionsFunction(c)

const set = new AchievementSet({ gameId: 11562, title: 'Colony Wars: Vengeance' })

set.addAchievement({
  title: 'Missile Evasion 101',
  description: 'Break missile lock on your ship by releasing a flare (L2+R2+Circle)',
  points: 1,
  conditions: {
    core: startedMission(),
    ...multiRegionalConditions.altsOnly(c => $(
      pauseIf(
        c.pauseIfRegionCheck,
        inLoadingScreen,
      ),
      ['AddAddress', 'Mem', '8bit', 0x11cae0 + c.inGameOffset, '*', 'Value', '', 88],
      ['AndNext', 'Mem', '32bit', 0x12e228 + c.inGameOffset, '<', 'Delta', '32bit', 0x12e228 + c.inGameOffset],
      ['', 'Mem', '8bit', 0x11d868 + c.inGameOffset, '<', 'Delta', '8bit', 0x11d868 + c.inGameOffset],
    ))
  },
  id: 180743,
})

set.addAchievement({
  title: 'Civil Protection',
  description:
    'Mission 1-1, Escort duty: while piloting Hex, protect the convoy from Tribe attacks',
  points: 5,
  conditions: $(
    startedMission({ ship: HEX, act: 1, mission: 1 }),
    mission.completed,
  ),
  id: 165206,
})

set.addAchievement({
  title: 'Seismic Lance Enthusiast',
  description:
    'Mission 1-2, Resource collation: while piloting Hex and only using seismic lance, help Navy frigate to collect the crystals from asteroids',
  points: 5,
  conditions: {
    core: $(
      startedMission({ ship: HEX, act: 1, mission: 2 }),
      trigger(mission.completed),
    ),
    ...multiRegionalConditions.altsOnly(c => $(
      pauseIf(
        c.pauseIfRegionCheck,
        inLoadingScreen,
      ),
      resetIf(
        c.weaponInstance(0).isHeatingUp,
        c.weaponInstance(1).isHeatingUp,
        c.weaponInstance(3).gotLaunched,
        c.weaponInstance(4).gotLaunched,
        c.weaponInstance(5).gotLaunched,
      )
    ))
  },
  id: 180690,
})

set.addAchievement({
  title: 'Power Porter',
  description:
    'Mission 1-3, Bring battle-platform online: while piloting Hex, successfully deliver power cells to Navy platform',
  points: 5,
  type: 'progression',
  conditions: $(
    startedMission({ ship: HEX, act: 1, mission: 3 }),
    mission.completed,
  ),
  id: 165207,
})

set.addAchievement({
  title: 'Radio Failure',
  description:
    'Mission 2-1, Emerging from warphole: while piloting Hex, destroy the communications rig and escape',
  points: 10,
  conditions: $(
    startedMission({ ship: HEX, act: 2, mission: 1 }),
    mission.completed,
  ),
  id: 180691,
})

set.addAchievement({
  title: 'Pacifist Janitor',
  description:
    'Mission 3-1, Rescue besieged installation: while piloting Hex, dispose of unstable reactors without firing a single shot',
  points: 10,
  conditions: {
    core: $(
      startedMission({ ship: HEX, act: 3, mission: 1 }),
      trigger(mission.completed),
    ),
    ...multiRegionalConditions.altsOnly(c => $(
      pauseIf(
        c.pauseIfRegionCheck,
        inLoadingScreen,
      ),
      resetIf(
        c.weaponInstance(0).isHeatingUp,
        c.weaponInstance(1).isHeatingUp,
        c.weaponInstance(3).gotLaunched,
        c.weaponInstance(4).gotLaunched,
        c.weaponInstance(5).gotLaunched,
      )
    ))
  },
  id: 180692,
})

set.addAchievement({
  title: 'Unclogging the Wormhole',
  description: `Mission 3-2, Mine sweeping: while piloting Hex, ensure Navy support craft doesn't get hull damage whilst deactivating mines`,
  points: 10,
  conditions: {
    core: $(
      startedMission({ ship: HEX, act: 3, mission: 2 }),
      trigger(mission.completed),
    ),
    alt1: $(
      pauseIf(inLoadingScreen),
      resetIf(entityInstance(12).gotHullDamage)
    ),
  },
  id: 180693,
})

set.addAchievement({
  title: 'Particular Approach',
  description:
    'Mission 3-3, Disrupt League supply network: complete the mission without letting a single League fighter to board the Frigate',
  points: 10,
  conditions: {
    core: $(
      startedMission({ act: 3, mission: 3 }),
      trigger(mission.completed),
    ),
    alt1: $(
      pauseIf(inLoadingScreen),
      entityIDStats(0).jumpedInHit,
      resetIf(
        andNext(
          mission.failed,
          entityIDStats(2).objectiveAccomplished
        )
      )
    ),
  },
  id: 180694,
})

set.addAchievement({
  title: 'Regular Approach',
  description:
    'Mission 3-3, Disrupt League supply network: complete the mission without using the Particle gun',
  points: 10,
  conditions: {
    core: $(
      startedMission({ act: 3, mission: 3 }),
      trigger(mission.completed),
    ),
    alt1: $(
      pauseIf(inLoadingScreen),
      resetIf(player.isOperatingParticleGun)
    ),
  },
  id: 180737,
})

set.addAchievement({
  title: 'Eyes Off',
  description:
    'Mission 4-1, Closing League eyes: while piloting Hex, disable the satellites and clear the area of League forces',
  points: 10,
  conditions: $(
    startedMission({ ship: HEX, act: 4, mission: 1 }),
    mission.completed,
  ),
  id: 180695,
})

set.addAchievement({
  title: `Navy's Finest Interceptor`,
  description: `Mission 4-2, Jump missile threat: while piloting Hex, intercept jump missiles and ensure Navy fleet doesn't suffer hull damage`,
  points: 10,
  conditions: {
    core: $(
      startedMission({ ship: HEX, act: 4, mission: 2 }),
      trigger(mission.completed),
    ),
    alt1: $(
      pauseIf(inLoadingScreen),
      resetIf(
        ...givenRangeOf(9, 16).map(i =>
          entityInstance(i).withId(5).gotHullDamage
        )
      ),
    ),
  },
  id: 180696,
})

set.addAchievement({
  title: `Navy's Finest Madman`,
  description: 'Mission 4-2, Jump missile threat: survive getting rid of 3 jump missiles by crashing into them',
  points: 5,
  conditions: {
    core: startedMission({ act: 4, mission: 2 }),
    alt1: $(
      pauseIf(inLoadingScreen),
      addHits(
        orNext(
          player.sufferedShieldDamage
        ).andNext(
          player.sufferedHullDamage,
          player.hasHulls,
          entityIDStats(0).gotKilled,
        ),

        player.sufferedShieldDamageExtremelyHard
      ),
      ['Measured', 'Value', '', 0xcafe, '=', 'Value', '', 0xbeef, 3],
      measuredIf(entityIDStats(0).jumpedInAtleastOnce)
    ),
  },
  id: 180739,
})

set.addAchievement({
  title: 'Grounded',
  description: `Mission 4-3, Elimination of League super gun: allow for destruction of League's super gun by depleting reactors of shields`,
  points: 10,
  conditions: $(
    startedMission({ act: 4, mission: 3 }),
    mission.completed,
  ),
  id: 180697,
})

set.addAchievement({
  title: 'Minesweeper',
  description: `Mission 5-1, Intercept League sappers: while piloting Hex, protect Navy battleship and ensure it doesn't suffer hull damage from mines and League fighters`,
  points: 10,
  conditions: {
    core: $(
      startedMission({ ship: HEX, act: 5, mission: 1 }),
      trigger(mission.completed),
    ),
    alt1: $(
      pauseIf(inLoadingScreen),
      resetIf(entityInstance(2).gotHullDamage)
    ),
  },
  id: 180698,
})

set.addAchievement({
  title: 'DIY Home Defense',
  description:
    'Mission 6-1, Erect defense grid: while piloting Hex, assemble the defense turrets and repel League forces',
  points: 5,
  conditions: $(
    startedMission({ ship: HEX, act: 6, mission: 1 }),
    mission.completed,
  ),
  id: 180699,
})

set.addAchievement({
  title: 'Beware of Mertens',
  description: `Mission 6-2, Cargo heist: while piloting Hex, don't let any cargo get stolen or destroyed`,
  points: 5,
  conditions: {
    core: $(
      startedMission({ ship: HEX, act: 6, mission: 2 }),
      trigger(mission.completed),
    ),
    alt1: $(
      pauseIf(inLoadingScreen),
      resetIf(
        entityIDStats(7).gotKilled,
        andNext(
          mission.failed,
          entityIDStats(7).objectiveAccomplished
        )
      )
    ),
  },
  id: 180700,
})

set.addAchievement({
  title: 'Sole Sol Guardian',
  description:
    'Mission 6-3, Last stand: while piloting Hex, prevent League convoy from entering Sol with 1 minute left to spare (or 45 seconds for PAL version)',
  points: 25,
  conditions: {
    core: $(
      startedMission({ ship: HEX, act: 6, mission: 3 }),
      trigger(mission.completed),
    ),
    ...multiRegionalConditions.altsOnly((c, r) => $(
      pauseIf(
        c.pauseIfRegionCheck,
        inLoadingScreen,
      ),
      resetIf(
        andNext(
          mission.notCompleted,
          c.displayedTimeWentBelow(r === 'ntsc' ? 1800 : 1126)
        )
      )
    ))
  },
  id: 180701,
})

set.addAchievement({
  title: 'Cronus',
  description: 'While piloting Hex or Spook, complete any mission leading to Act 7: Loss of a Pawn',
  points: 10,
  type: 'progression',
  conditions: $(
    startedMission({
      ship: HEX,
      missions: [
        [4, 3, 'ground'],
        [5, 1],
        [6, 3]
      ]
    }),
    mission.completed,
  )
})

set.addAchievement({
  title: 'Unexpected Visitor',
  description: 'Mission 7-1, Scout asteroid field: while piloting Wraith or Hex, secure the asteroid field without suffering hull damage',
  points: 10,
  conditions: {
    core: $(
      startedMission({ ship: WRAITH, act: 7, mission: 1 }),
      trigger(mission.completed),
    ),
    alt1: $(
      pauseIf(inLoadingScreen),
      resetIf(player.sufferedHullDamage)
    ),
  },
  id: 180702,
})

set.addAchievement({
  title: 'Off Course',
  description: 'Mission 8-1, Support assault: while piloting Wraith or Hex, support Navy fleet in assault on installation and prove to be skilled in your towing technique',
  points: 10,
  conditions: $(
    startedMission({ ship: WRAITH, act: 8, mission: 1 }),
    mission.completed,
  ),
  id: 180703,
})

set.addAchievement({
  title: 'Brilliant but Lazy',
  description: 'Mission 8-2, Installation defence: while piloting Wraith or Hex, defend both Navy installations without getting any of the available mines destroyed',
  points: 25,
  conditions: {
    core: $(
      startedMission({ ship: WRAITH, act: 8, mission: 2 }),
      trigger(mission.completed),
    ),
    alt1: $(
      pauseIf(inLoadingScreen),
      resetIf(
        entityInstance(14).hasNoHulls,
        andNext(
          mission.inProgress,
          entityIDStats(5).objectiveAccomplished
        )
      )
    ),
  },
  id: 180704,
})

set.addAchievement({
  title: 'Shiny Steal',
  description: `Mission 8-3, Hit 'n' run: while piloting Wraith or Hex, steal the Research vessel without firing weapons and suffering hull damage on your ship`,
  points: 10,
  conditions: {
    core: $(
      startedMission({ ship: WRAITH, act: 8, mission: 3 }),
      trigger(mission.completed),
    ),
    ...multiRegionalConditions.altsOnly(c => $(
      pauseIf(
        c.pauseIfRegionCheck,
        inLoadingScreen,
      ),

      resetIf(
        player.sufferedHullDamage,
        c.weaponInstance(0).isHeatingUp,
        c.weaponInstance(1).isHeatingUp,
      ).andNext(
        player.isFlyingShip(WRAITH),
      ).resetIf(
        c.weaponInstance(2).shotPlasma,
        c.weaponInstance(3).gotLaunched,
        c.weaponInstance(4).gotLaunched,
        c.weaponInstance(5).gotLaunched
      ).andNext(
        player.isFlyingShip(WRAITH)
      ).resetIf(
        c.weaponInstance(6).gotLaunched,
        c.weaponInstance(7).gotLaunched
      )
    ))
  },
  id: 180705,
})

set.addAchievement({
  title: 'Lucky Star',
  description: `Mission 8-3, Hit 'n' run: while piloting Wraith or Hex, steal the research vessel without damaging it's shields and hulls`,
  points: 10,
  conditions: {
    core: $(
      startedMission({ ship: WRAITH, act: 8, mission: 3 }),
      trigger(mission.completed),
    ),
    alt1: $(
      pauseIf(inLoadingScreen),
      resetIf(entityInstance(0).gotShieldDamage)
    ),
  },
  id: 180706,
})

set.addAchievement({
  title: 'Cronus Fried Asteroids',
  description: 'Mission 9-1, Eliminate League mining facility: while piloting Wraith or Hex, destroy the mining facility using heated asteroids',
  points: 25,
  conditions: $(
    startedMission({ ship: WRAITH, act: 9, mission: 1 }),
    mission.completed,
  ),
  id: 180707,
})

set.addAchievement({
  title: 'Getting Past the Past',
  description: 'Mission 9-2, Scouting graveyard: while piloting Wraith or Hex, escort Navy convoy through the graveyard',
  points: 10,
  conditions: $(
    startedMission({ ship: WRAITH, act: 9, mission: 2 }),
    mission.completed,
  ),
  id: 180708,
})

set.addAchievement({
  title: 'Pest Control',
  description: `Mission 9-3, Sentinel alert: ensure that reactor is protected and doesn't suffer hull damage`,
  points: 10,
  conditions: {
    core: $(
      startedMission({ act: 9, mission: 3 }),
      trigger(mission.completed),
    ),
    alt1: $(
      pauseIf(inLoadingScreen),
      resetIf(entityInstance(7).gotHullDamage)
    ),
  },
  id: 180709,
})

set.addAchievement({
  title: 'Avenger',
  description: `Mission 10-1, Investigate distress call: while piloting Wraith or Hex, accept Widowmaker's challenge and defeat him without suffering hull damage`,
  points: 10,
  conditions: {
    core: $(
      startedMission({ ship: WRAITH, act: 10, mission: 1 }),
      trigger(mission.completed),
    ),
    alt1: $(
      pauseCodeBelowUntilSubMission(2),
      resetIf(player.sufferedHullDamage)
    ),
  },
  id: 180710,
})

set.addAchievement({
  title: 'Cursed Duel',
  description: 'Mission 10-1, Investigate distress call: defeat the Widowmaker while piloting Hex',
  points: 25,
  conditions: $(
    startedMission({ ship: HEX, act: 10, mission: 1 }),
    mission.completed,
  ),
  id: 180711,
})

set.addAchievement({
  title: 'Plasma Fishing',
  description: 'Mission 11-1, Oversee mining operation: while piloting Wraith and using only plasma guns, ensure security of mining fleet',
  points: 10,
  conditions: {
    core: $(
      startedMission({ ship: WRAITH, exactShip: true, act: 11, mission: 1 }),
      trigger(mission.completed),
    ),
    ...multiRegionalConditions.altsOnly(c => $(
      pauseIf(
        c.pauseIfRegionCheck,
        inLoadingScreen,
      ),
      resetIf(
        c.weaponInstance(0).isHeatingUp,
        c.weaponInstance(1).isHeatingUp,
        c.weaponInstance(3).shotLeachBeam,
        c.weaponInstance(4).gotLaunched,
        c.weaponInstance(5).gotLaunched,
        c.weaponInstance(6).gotLaunched,
        c.weaponInstance(7).gotLaunched,
      )
    ))
  },
  id: 180712,
})

set.addAchievement({
  title: 'We Watch Alpha Centauri',
  description: 'While piloting Hex, Wraith or Spook, complete any mission leading to Act 11: The Watch',
  points: 10,
  type: 'progression',
  conditions: $(
    startedMission({
      ship: WRAITH,
      missions: [
        [9, 3, 'ground'],
        [10, 1]
      ]
    }),
    mission.completed,
  )
})

set.addAchievement({
  title: 'Anomalous Materials',
  description: `Mission 12-1, Rescue science vessel: while piloting Wraith or Hex, divert dangerous materials from science vessel and ensure it's safety`,
  points: 25,
  conditions: $(
    startedMission({ ship: WRAITH, act: 12, mission: 1 }),
    mission.completed,
  ),
  id: 180713,
})

set.addAchievement({
  title: 'Natural Problem Solver',
  description: `Mission 12-2, Avert natural disaster: while piloting Wraith or Hex, do not miss too many asteroids and ensure fleet doesn't suffer hull damage`,
  points: 10,
  conditions: {
    core: $(
      startedMission({ ship: WRAITH, act: 12, mission: 2 }),
      trigger(mission.completed),
    ),
    alt1: $(
      pauseIf(inLoadingScreen),
      resetIf(
        entityInstance(6).gotHullDamage,
        entityInstance(9).gotHullDamage,
        entityInstance(5).gotShieldsLowerThan(15)
      )
    ),
  },
  id: 180714,
})

set.addAchievement({
  title: 'Marked for Death',
  description: 'Mission 12-3, Remote targeting: while piloting Wraith or Hex, destroy League fleet by targeting jump missiles using the probe pod',
  points: 5,
  conditions: $(
    startedMission({ ship: WRAITH, act: 12, mission: 3 }),
    mission.completed,
  ),
  id: 180715,
})

set.addAchievement({
  title: 'Prosecution',
  description: 'Mission 13-1, Data snatch: while piloting Diablo, Wraith or Hex, carry probing operations to uncover the traitor',
  points: 10,
  conditions: $(
    startedMission({ ship: DIABLO, act: 13, mission: 1 }),
    mission.completed,
  ),
  id: 180716,
})

set.addAchievement({
  title: 'Smooth Operator',
  description: 'Mission 13-1, Data snatch: after following League Frigate, probe the League installation for the traitor list without taking damage',
  points: 10,
  conditions: {
    core: startedMission({ act: 13, mission: 1 }),
    alt1: $(
      pauseCodeBelowUntilSubMission(2),
      resetIf(player.sufferedShieldDamage),
      trigger(entityInstance(1).probed)
    ),
  },
  id: 180717,
})

set.addAchievement({
  title: 'Violation of Common Sense',
  description: `Mission 13-1, Data snatch: uncover the traitor, become the traitor, eliminate the traitor you've just uncovered, perish`,
  points: 2,
  conditions: {
    core: startedMission({ act: 13, mission: 1 }),
    alt1: $(
      pauseCodeBelowUntilSubMission(3),
      once(entityInstance(0).probed),
      resetIf(
        andNext(
          entityInstance(0).notProbed,
          player.markedTraitor
        ),
        andNext(
          mission.inProgress,
          entityIDStats(5).hasKills
        )
      ),
      trigger(
        'once',
        andNext(
          entityInstance(0).probed,
          player.markedTraitor
        )
      ),
      trigger(
        'once',
        andNext(
          entityIDStats(5).hasKills,
          player.markedTraitor,
          player.cameraDetached
        )
      )
    )
  },
  id: 180718,
})

set.addAchievement({
  title: 'Atonement',
  description: 'Mission 13-2, Capture traitor: while piloting Diablo, Wraith or Hex, atone for your failure by assisting the Watch during assault on the League',
  points: 5,
  conditions: $(
    startedMission({ ship: DIABLO, act: 13, mission: 2 }),
    mission.completed,
  ),
  id: 180719,
})

set.addAchievement({
  title: 'Humiliation Ride',
  description: 'Mission 13-2, Capture traitor: destroy three League Mace ships while keeping the escaped traitor in your grapple',
  points: 5,
  conditions: {
    core: startedMission({ act: 13, mission: 2 }),
    ...multiRegionalConditions.altsOnly(c => $(
      pauseIf(
        c.pauseIfRegionCheck,
        inLoadingScreen,
      ),

      // grapple holds the escape pod
      ['AndNext', 'Mem', '16bit', 0x11d704 + c.inGameOffset, '=', 'Value', '', 0x2500],
      measured('hits 3', entityIDStats(1).gotKilled),
      ['MeasuredIf', 'Mem', '16bit', 0x11d704 + c.inGameOffset, '=', 'Value', '', 9472],
    ))
  },
  id: 180740,
})

set.addAchievement({
  title: 'End of the Watch',
  description: 'Mission 13-3, Traitor hunt: while piloting Diablo, Wraith or Hex, successfully probe and eliminate all traitors',
  points: 10,
  conditions: $(
    startedMission({ ship: DIABLO, act: 13, mission: 3 }),
    mission.completed,
  ),
  id: 180720,
})

set.addAchievement({
  title: 'Execution',
  description: 'Mission 13-3, Traitor hunt: defeat Traitorous leader while piloting Hex',
  points: 25,
  conditions: $(
    startedMission({ ship: HEX, act: 13, mission: 3 }),
    mission.completed,
  ),
  id: 180721,
})

set.addAchievement({
  title: 'Acquittal',
  description: 'Mission 14-1, Sentencing: while piloting Diablo, Wraith or Hex, survive the ambush from League',
  points: 10,
  conditions: $(
    startedMission({ ship: DIABLO, act: 14, mission: 1 }),
    mission.completed,
  ),
  id: 180722,
})

set.addAchievement({
  title: 'Untamed',
  description: 'Mission 14-1, Sentencing: by acting impatient with your ship controls, escape both grapple locks on your own',
  points: 1,
  conditions: {
    core: startedMission({ act: 14, mission: 1 }),
    alt1: $(
      pauseIf(inLoadingScreen),
      resetIf(entityIDStats(6).gotKilled),
      trigger(
        andNext(
          mission.inProgress,
          ['', 'Mem', '8bit', 0x46016, '<', 'Delta', '8bit', 0x46016, 2]
        )
      ),
    ),
  },
  id: 165208,
})

set.addAchievement({
  title: 'Against the Odds',
  description: 'Mission 14-1, Sentencing: survive the ambush from League while piloting Hex',
  points: 25,
  conditions: $(
    startedMission({ ship: HEX, act: 14, mission: 1 }),
    mission.completed,
  ),
  id: 180723,
})

set.addAchievement({
  title: 'Into the Heart of Boreas',
  description: 'While piloting Hex, Wraith or Diablo, complete any mission leading to Act 15: The League Cornered?',
  points: 10,
  type: 'progression',
  conditions: $(
    startedMission({
      ship: DIABLO,
      missions: [
        [13, 3],
        [14, 1]
      ]
    }),
    mission.completed,
  )
})

set.addAchievement({
  title: 'Rotten Core',
  description: 'Mission 15-1, Spearhead assault into League home system: while piloting Diablo, Wraith or Hex, destroy all League Hammer ships and penetrate the Astro gun defenses to eliminate it from inside',
  points: 5,
  conditions: {
    core: $(
      startedMission({ ship: DIABLO, act: 15, mission: 1 }),
      mission.completed,
    ),
    alt1: $(
      pauseIf(inLoadingScreen),
      once(entityIDStats(7).gotKilledExactTimes(6))
    ),
  },
  id: 180724,
})

set.addAchievement({
  title: 'Grapple Released',
  description: 'Mission 16-1, Defend crippled battleship: while piloting Diablo or Wraith, prove to be extremely fast in preventing the hijack of Navy battleship',
  points: 10,
  conditions: $(
    startedMission({ ship: DIABLO, act: 16, mission: 1 }),
    mission.completed,
  ),
  id: 180725,
})

set.addAchievement({
  title: 'Better Call Mertens',
  description: `Mission 16-2, Answering distress signal: protect command center from alien threat and ensure it doesn't suffer hull damage`,
  points: 10,
  conditions: {
    core: $(
      startedMission({ act: 16, mission: 2 }),
      trigger(mission.completed),
    ),
    alt1: $(
      pauseCodeBelowUntilSubMission(2),
      resetIf(entityInstance(0).gotHullDamage)
    ),
  },
  id: 180726,
})

set.addAchievement({
  title: 'Planetary Furball',
  description: 'Mission 16-2, Answering distress signal: eliminate the alien threat in the first sector without using Particle gun',
  points: 10,
  conditions: {
    core: $(
      startedMission({ act: 16, mission: 2 }),
      trigger(mission.completedInGame)
    ),
    alt1: $(
      pauseIf(inLoadingScreen),
      resetIf(player.isOperatingParticleGun),
      trigger(entityIDStats(4).gotKilledExactTimes(5))
    ),
  },
  id: 180738,
})

set.addAchievement({
  title: `Navy's Reverse Card`,
  description: 'Mission 16-3, Eliminate alien super beam: while piloting Diablo, Wraith or Hex, install reflective disks to prevent planet destruction',
  points: 10,
  conditions: $(
    startedMission({ ship: DIABLO, act: 16, mission: 3 }),
    mission.completed,
  ),
  id: 180727,
})

set.addAchievement({
  title: 'Enemy Unknown',
  description: 'Mission 17-1, Support heavy assault: while piloting Diablo, Wraith or Hex, ensure safety of Navy battleship',
  points: 10,
  conditions: $(
    startedMission({ ship: DIABLO, act: 17, mission: 1 }),
    mission.completed,
  ),
  id: 180728,
})

set.addAchievement({
  title: 'Enemy Destroyed',
  description: 'Mission 17-2, Eliminate alien vanguard: while piloting Diablo, Wraith or Hex, eliminate all alien presence including any reinforcements',
  points: 10,
  conditions: {
    core: $(
      startedMission({ ship: DIABLO, act: 17, mission: 2 }),
      mission.completed,
    ),
    alt1: $(
      pauseCodeBelowUntilSubMission(2),
      entityIDStats(4).gotKilledExactTimes(8)
    ),
  },
  id: 180729,
})

set.addAchievement({
  title: 'Enemy Researched',
  description: 'Mission 17-3, Capturing alien technology: while piloting Diablo, Wraith or Hex, deliver alien fighter through jumpgate without damaging it and escape',
  points: 10,
  conditions: {
    core: $(
      startedMission({ ship: DIABLO, act: 17, mission: 3 }),
      trigger(mission.completed),
    ),
    ...multiRegionalConditions.altsOnly(c => $(
      pauseIf(
        c.pauseIfRegionCheck,
        inLoadingScreen,
      ),
      once(c.weaponInstance(0).isAlienLaser),
      resetIf(
        andNext(
          c.weaponInstance(0).isAlienLaser,
          c.weaponInstance(0).wasSameWeaponForOneFrame,
          player.sufferedShieldDamage
        )
      )
    ))
  },
  id: 180730,
})

set.addAchievement({
  title: 'Hoisted by Their Own Petard',
  description: 'Mission 17-3, Capturing alien technology: while piloting Diablo, Wraith or Hex, hijack the alien fighter and destroy three alien ships while piloting it',
  points: 5,
  conditions: {
    core: startedMission({ ship: DIABLO, act: 17, mission: 3 }),
    ...multiRegionalConditions.altsOnly(c => $(
      pauseIf(
        c.pauseIfRegionCheck,
        inLoadingScreen,
      ),
      measuredIf(c.weaponInstance(0).isAlienLaser),
      measured(
        'hits 3',
        andNext(
          c.weaponInstance(0).isAlienLaser,
          entityIDStats(7).gotKilled
        )
      )
    ))
  },
  id: 180741,
})

set.addAchievement({
  title: 'The Abyss Stares Back',
  description: 'While piloting Hex, Wraith or Diablo, complete any mission leading to Act 19: The Madness of Kron',
  points: 10,
  type: 'progression',
  conditions: $(
    startedMission({
      ship: DIABLO,
      missions: [
        [17, 3],
        [18, 1]
      ]
    }),
    mission.completed,
  )
})

set.addAchievement({
  title: `Humanity's Hope`,
  description: 'Mission 18-1, Clear a path to the alien warphole: while piloting Diablo, Wraith or Hex, assemble the cannon to repel the alien threat',
  points: 10,
  conditions: $(
    startedMission({ ship: DIABLO, act: 18, mission: 1 }),
    mission.completed,
  ),
  id: 180731,
})

set.addAchievement({
  title: 'Simon Says Leave',
  description: 'Mission 19-1, Close alien warphole: close the warphole and escape without taking any damage from the weblock',
  points: 10,
  conditions: {
    core: $(
      startedMission({ act: 19, mission: 1 }),
      trigger(mission.completed),
    ),
    ...multiRegionalConditions.altsOnly(c => $(
      pauseIf(c.pauseIfRegionCheck),
      pauseCodeBelowUntilSubMission(2),

      resetIf(
        orNext(
          player.sufferedShieldDamage
        ).andNext(
          player.sufferedHullDamage,
          ['', 'Mem', '8bit', 0x11a96c + c.inGameOffset, '=', 'Value', '', 1]
        )
      ),
    ))
  },
  id: 180732,
})

set.addAchievement({
  title: 'The Sun Must Go On',
  description: `Mission 19-2, Stop Kron's super gun: destroy Kron's loyalists before the super gun reveals itself, then destroy the super gun`,
  points: 25,
  conditions: {
    core: $(
      startedMission({ act: 19, mission: 2 }),
      trigger(mission.completed),
    ),
    alt1: $(
      pauseCodeBelowUntilSubMission(2),
      resetIf(
        orNext(
          entityIDStats(4).gotKilledLessThan(4)
        ).andNext(
          entityIDStats(0).gotKilledLessThan(1),
          entityIDStats(1).jumpedInExactTimes(5)
        )
      )
    ),
  },
  id: 180733,
})

set.addAchievement({
  title: 'Vengeance',
  description: 'Mission 19-3, Locate and kill Kron: succeed in killing Kron',
  points: 10,
  type: 'win_condition',
  conditions: $(
    startedMission({ act: 19, mission: 3 }),
    mission.completed,
  ),
  id: 180734,
})

set.addAchievement({
  title: 'Revengeance',
  description: 'Mission 19-3, Locate and kill Kron: Kill Kron while piloting Hex',
  points: 25,
  conditions: $(
    startedMission({ ship: HEX, act: 19, mission: 3 }),
    mission.completed,
  ),
  id: 180735,
})

set.addAchievement({
  title: 'One Hit Kron Out Wonder',
  description: 'Mission 19-3, Locate and kill Kron: Kill Kron by penetrating both of his shields and hull with a single torpedo',
  points: 5,
  conditions: {
    core: startedMission({ act: 19, mission: 3 }),
    alt1: $(
      pauseCodeBelowUntilSubMission(2),
      andNext(
        entityInstance(0).gotShieldDamage,
        entityInstance(0).noShields,
        entityInstance(0).gotHullDamage,
        entityInstance(0).hasNoHulls,
      ),
    ),
  },
  id: 180736,
})

set.addAchievement({
  title: 'Perfection',
  description: 'Complete any mission without getting damage',
  points: 5,
  conditions: {
    core: $(
      startedMission(),
      mission.completed,
    ),
    ...multiRegionalConditions.altsOnly(c => $(
      pauseIf(
        c.pauseIfRegionCheck,
        inLoadingScreen,
      ),
      resetIf(
        andNext(
          player.sufferedShieldDamage,
          c.playerCannotMove
        )
      ),
    ))
  },
  id: 165210,
})

set.addAchievement({
  title: 'Expert Controls',
  description: 'Complete any mission by only using pitch and roll controls (do not yaw left or right, usage of control scheme 5 and 6 recommended)',
  points: 5,
  conditions: {
    core: $(
      startedMission(),
      mission.completed,
    ),
    ...multiRegionalConditions.altsOnly(c => $(
      pauseIf(
        c.pauseIfRegionCheck,
        inLoadingScreen,
      ),
      ['ResetIf', 'Mem', '32bit', 0x11dfe0 + c.inGameOffset, '!=', 'Value', '', 0],
    ))
  },
  id: 180888,
})

set.addAchievement({
  title: 'Laid-Back Approach',
  description: 'Complete any mission by only moving backwards',
  points: 5,
  conditions: {
    core: $(
      startedMission(),
      mission.completed,
    ),
    ...multiRegionalConditions.altsOnly(c => $(
      pauseIf(
        c.pauseIfRegionCheck,
        inLoadingScreen,
      ),
      ['AndNext', 'Delta', '32bit', 0x11dfec + c.inGameOffset, '!=', 'Mem', '32bit', 0x11dfec + c.inGameOffset],
      ['AndNext', 'Mem', '32bit', 0x11dfec + c.inGameOffset, '>', 'Value', '', 0],
      ['ResetIf', 'Mem', '32bit', 0x11dfec + c.inGameOffset, '<=', 'Value', '', 0x7fffffff],
    ))
  },
  id: 165209,
})

set.addAchievement({
  title: 'Speedster',
  description: `Complete any mission while not letting go of infinite afterburners and by using infinite secondary weapons only, activated with "Avalanche" and "Chimera" passwords`,
  points: 5,
  conditions: {
    core: $(
      pauseIf(
        infiniteHealthCheatOff.with({ cmp: '!=' }),
        noWeaponOverheatCheatOff.with({ cmp: '!=' }),
        allWeaponsCheatOff.with({ cmp: '!=' })
      ),
      startedMission({
        withoutCheatChecks: true,
        additionalConditions: $(
          infiniteAfterburnersCheatOff.with({ cmp: '!=' }),
          infiniteSecondaryWeaponCheatOff.with({ cmp: '!=' }),
        ),
      }),
      trigger(mission.completed),
    ),
    ...multiRegionalConditions.altsOnly((c, r) => {
      const afterburner = {
        active: 0x11a2d8 + c.inGameOffset,
        current: 0x11a2e0 + c.inGameOffset,
        max: 0x11a2d0 + c.inGameOffset
      }

      const resetIfPlayerFailedChallenge = $(
        resetNextIf(bailedIntoMainMenu),

        // immediately reset the timer lower if player activates afterburners
        ['ResetNextIf', 'Mem', '8bit', afterburner.active, '=', 'Value', '', 1, 1],

        ['AndNext', 'Mem', '8bit', afterburner.active, '=', 'Value', '', 0],
        ['ResetIf', 'Mem', '32bit', 0x34440, '>', 'Delta', '32bit', 0x34440, 120],
      )

      // If player is holding afterburners, sometimes your can reach max value,
      // of 0xD2 which will decrease by 1 into 0xD1 - which shouldn't reset the achievement
      // To prevent the reset, AddSource is *conditionally* used to make the bottom
      // ResetIf condition impossible to execute, because the decrease will look like
      // 0xD3 -> 0xD2 and 0xD2 is not less than max value
      const resetIfAfterburnerCoolsDown = $(
        ['AndNext', 'Delta', '32bit', afterburner.current, '<', 'Value', '', 0xff000000],
        ['AndNext', 'Mem', '32bit', afterburner.current, '<', 'Delta', '32bit', afterburner.current],
        ['AddSource', 'Value', '', 1],
        ['ResetIf', 'Mem', '32bit', afterburner.current, '<', 'Mem', '32bit', afterburner.max],
      )

      return $(
        pauseIf(
          c.pauseIfRegionCheck,
          inLoadingScreen,
          player.isGrappled
        ),
        resetIfPlayerFailedChallenge,
        resetIfAfterburnerCoolsDown
      )
    })
  },
  id: 180889,
})

set.addAchievement({
  title: 'Berserker',
  description: `Complete any mission while not letting go of primary weapon fire and with no overheat, activated with "Dark*Angel" password`,
  points: 5,
  conditions: {
    core: $(
      pauseIf(
        infiniteHealthCheatOff.with({ cmp: '!=' }),
        infiniteSecondaryWeaponCheatOff.with({ cmp: '!=' }),
        infiniteAfterburnersCheatOff.with({ cmp: '!=' }),
        allWeaponsCheatOff.with({ cmp: '!=' })
      ),
      startedMission({
        withoutCheatChecks: true,
        additionalConditions: $(
          noWeaponOverheatCheatOff.with({ cmp: '!=' })
        )
      }),
      trigger(mission.completed),
    ),
    ...multiRegionalConditions.altsOnly(c => {
      const currentWeapon = c.currentWeaponInstance

      const resetIfPlayerFailedChallenge = $(
        resetNextIf(bailedIntoMainMenu),
        resetIf(
          'hits 180',
          orNext(
            currentWeapon.isNotAlienLaser
          ).andNext(
            currentWeapon.isNotScatterGun,
            currentWeapon.isNotFired
          )
        )
      )

      return $(
        pauseIf(
          c.pauseIfRegionCheck,
          inLoadingScreen,
          player.isGrappled
        ),
        resetIfPlayerFailedChallenge,
        resetIf(currentWeapon.isNotFiredAndCoolingDown)
      )
    })
  },
  id: 180890,
})

set.addAchievement({
  title: 'This Sucks',
  description: 'Enter the wrong kind of jumpgate',
  points: 1,
  conditions: {
    core: startedMission({
      missions: [
        [3, 1],
        [18, 1]
      ]
    }),
    alt1: $(
      pauseIf(inLoadingScreen),
      player.isDead,
      player.hasHulls
    ),
  },
  id: 180742,
})

set.addLeaderboard({
  title: 'Closing League Eyes speedrun | Hex [NTSC]',
  description: 'Fastest time in Mission 4-1 while piloting Hex',
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: $(
      c.ntsc.regionCheck,
      allInGameCheatsOff,
      noDemoPlaybackAndParticleGun,
      player.isFlyingShip(HEX),
      actIs(4),
      missionIs(1),
      mission.onFirstFrame
    ),
    cancel: $(inMainMenu),
    submit: $(mission.completedInGame),
    value: $(timeTrialValue),
  },
  id: 27539,
})

set.addLeaderboard({
  title: 'Closing League Eyes speedrun | Hex [PAL]',
  description: 'Fastest time in Mission 4-1 while piloting Hex',
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: $(
      c.pal.regionCheck,
      allInGameCheatsOff,
      noDemoPlaybackAndParticleGun,
      player.isFlyingShip(HEX),
      actIs(4),
      missionIs(1),
      mission.onFirstFrame
    ),
    cancel: $(inMainMenu),
    submit: $(mission.completedInGame),
    value: $(timeTrialValue),
  },
  id: 27540,
})

set.addLeaderboard({
  title: 'Last Stand speedrun | Hex [NTSC]',
  description: 'Fastest time in Mission 6-3',
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: $(
      c.ntsc.regionCheck,
      allInGameCheatsOff,
      noDemoPlaybackAndParticleGun,
      player.isFlyingShip(HEX),
      actIs(6),
      missionIs(3),
      mission.onFirstFrame
    ),
    cancel: $(inMainMenu),
    submit: $(mission.completedInGame),
    value: $(timeTrialValue),
  },
  id: 27533,
})

set.addLeaderboard({
  title: 'Last Stand speedrun | Hex [PAL]',
  description: 'Fastest time in Mission 6-3',
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: $(
      c.pal.regionCheck,
      allInGameCheatsOff,
      noDemoPlaybackAndParticleGun,
      player.isFlyingShip(HEX),
      actIs(6),
      missionIs(3),
      mission.onFirstFrame
    ),
    cancel: $(inMainMenu),
    submit: $(mission.completedInGame),
    value: $(timeTrialValue),
  },
  id: 27534,
})

set.addLeaderboard({
  title: 'Sentencing speedrun | Diablo [NTSC]',
  description: 'Fastest time to kill Traitor in Mission 14-1',
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: $(
      c.ntsc.regionCheck,
      allInGameCheatsOff,
      noDemoPlaybackAndParticleGun,
      player.isFlyingShip(DIABLO),
      actIs(14),
      missionIs(1),
      mission.pastFirstFrame
    ),
    cancel: $(inMainMenu),
    submit: $(['', 'Mem', '8bit', 0x4cfac, '=', 'Value', '', 1]),
    value: $(timeTrialValue),
  },
  id: 27535,
})

set.addLeaderboard({
  title: 'Sentencing speedrun | Diablo [PAL]',
  description: 'Fastest time to kill Traitor in Mission 14-1',
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: $(
      c.pal.regionCheck,
      allInGameCheatsOff,
      noDemoPlaybackAndParticleGun,
      player.isFlyingShip(DIABLO),
      actIs(14),
      missionIs(1),
      mission.pastFirstFrame
    ),
    cancel: $(inMainMenu),
    submit: $(['', 'Mem', '8bit', 0x4cfac, '=', 'Value', '', 1]),
    value: $(timeTrialValue),
  },
  id: 27536,
})

set.addLeaderboard({
  title: 'Sentencing speedrun | Hex [NTSC]',
  description: 'Fastest time to kill Traitor in Mission 14-1',
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: $(
      c.ntsc.regionCheck,
      allInGameCheatsOff,
      noDemoPlaybackAndParticleGun,
      player.isFlyingShip(HEX),
      actIs(14),
      missionIs(1),
      mission.onFirstFrame
    ),
    cancel: $(inMainMenu),
    submit: $(['', 'Mem', '8bit', 0x4cfac, '=', 'Value', '', 1]),
    value: $(timeTrialValue),
  },
  id: 27537,
})

set.addLeaderboard({
  title: 'Sentencing speedrun | Hex [PAL]',
  description: 'Fastest time to kill Traitor in Mission 14-1',
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: $(
      c.pal.regionCheck,
      allInGameCheatsOff,
      noDemoPlaybackAndParticleGun,
      player.isFlyingShip(HEX),
      actIs(14),
      missionIs(1),
      mission.onFirstFrame
    ),
    cancel: $(inMainMenu),
    submit: $(['', 'Mem', '8bit', 0x4cfac, '=', 'Value', '', 1]),
    value: $(timeTrialValue),
  },
  id: 27538,
})

set.addLeaderboard({
  title: 'Any ending with most tech tokens',
  description: 'Finish the game in one sitting on good or any of the bad endings, must start with clear file. Loading saves or attempting to read password is not allowed.',
  lowerIsBetter: false,
  type: 'SCORE',
  conditions: {
    start: {
      core: $(
        levelSelectCheatOff,
        allInGameCheatsOff,
        actIs(1),
        missionIs(1),

        // no ship unlocks
        ['', 'Mem', '8bit', 0x5513d, '=', 'Value', '', 0],
        ['', 'Mem', '8bit', 0x55142, '=', 'Value', '', 0],
        ['', 'Mem', '8bit', 0x55147, '=', 'Value', '', 0],

        // no ship upgrades
        ['', 'Mem', '8bit', 0x55139, '=', 'Value', '', 0],
        ['', 'Mem', '8bit', 0x5513a, '=', 'Value', '', 0],
        ['', 'Mem', '8bit', 0x5513b, '=', 'Value', '', 0],
        ['', 'Mem', '8bit', 0x5513c, '=', 'Value', '', 0],

        techTokens.hasNone,

        // act 1 was not finished successfully once
        ['', 'Mem', '8bit', 0x41411, '=', 'Value', '', 0],

        inMainMenu,
      ),
      ...multiRegionalConditions.altsOnly(c => $(
        pauseIf(c.pauseIfRegionCheck),
        c.isOnHomeScreen
      ))
    },
    cancel: {
      core: '0=0',
      alt1: c.ntsc.loadedTheGameFromMemoryCard,
      alt2: c.pal.loadedTheGameFromMemoryCard,
      alt3: c.ntsc.resetTheGameFromMenu,
      alt4: c.pal.resetTheGameFromMenu,
    },
    // endings have weird act number
    submit: andNext(
      inMainMenu,
      actIs(91).with({ cmp: '>=' }),
      actIs(96).with({ cmp: '<=' })
    ),
    value: $(techTokens.measuredValue),
  },
  id: 27542,
})

export default set
