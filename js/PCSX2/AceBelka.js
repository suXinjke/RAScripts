import { AchievementSet, RichPresence, define as $, pauseIf, trigger, andNext, orNext, resetNextIf, resetIf, measuredIf, addHits, once } from '@cruncheevos/core'

Number.prototype.paddedMissionNumber = function () {
  return (this + 1).toString().padStart(2, '0')
}

const alwaysFalse = '0xcafe=0'
const alwaysTrue = '0xcafe=0xcafe'

const mission = {
  GlacialSkies_01: 0x00,
  Annex_02: 0x01,
  RoundTable_03: 0x02,
  Juggernaut_04: 0x03,
  FlickerOfHope_05: 0x04,
  Diapason_06: 0x05,
  Glatisant_07: 0x06,
  Merlon_08: 0x07,
  Excalibur_09: 0x08,
  Mayhem_10: 0x09,
  Inefrno_11: 0x0A,
  Apocalypse_12: 0x0B,
  Deceit_13: 0x0C,
  Overture_14: 0x0D,
  AirFortress_15: 0x0E,
  Demon_16: 0x0F,
  Avalon_17: 0x10,
  Zero_18: 0x11,
  Gauntlet_SP: 0x1E,
}

const craft = {
  draken: 0x00,
  gripen: 0x01,
  typhoon: 0x02,
  tornado: 0x03,
  f4: 0x04,
  f15c: 0x05,
  f15e: 0x06,
  f15smtd: 0x07,
  hornet: 0x08,
  hornetRadio: 0x09,
  f16c: 0x0A,
  f16xl: 0x0B,
  f117a: 0x0C,
  f22: 0x0D,
  f35: 0x0E,
  f5e: 0x0F,
  f20: 0x10,
  xPlane: 0x11,
  f14: 0x12,
  yfBlackWidow: 0x13,
  prowlerRadio: 0x14,
  a10: 0x15,
  mirage: 0x16,
  rafale: 0x17,
  su27: 0x18,
  su32: 0x19,
  su37: 0x1A,
  su47: 0x1B,
  mig21: 0x1C,
  mig29: 0x1D,
  mig31: 0x1E,
  f1: 0x1F,
  f2: 0x20,
  x02: 0x21,
  falken: 0x22,
  morgan: 0x23
}

const weapon = {
  faeb: 0x04,
  rcl: 0x07,
  sod: 0x08,
  tls: 0x13,
  mpbm: 0x14
}

const missionMeta = {
  0x00: {
    title: 'Glacial Skies',
    ach: { title: 'Enter the Galm Team', points: 2 },
    freeMissions: [
      {
        id: 0x00,
        ace: { title: 'Hunting Dog of the Frozen North', points: 3 }
      }
    ]
  },
  0x01: {
    title: 'Annex',
    ach: { title: 'Lifeline', points: 2 },
    freeMissions: [
      { id: 0x01, ace: { title: 'Annihilation Transit', points: 3 } }
    ]
  },
  0x02: {
    title: 'The Round Table',
    ach: { title: 'Decoy Combat', points: 2 },
    freeMissions: [
      {
        id: 0x02,
        ace: { title: 'Prideful Swallow', points: 3, noTLSandMPBM: true },
        squadron: 'Rot'
      },
      {
        id: 0x03,
        ace: { title: 'Calculating Owl', points: 3, noTLSandMPBM: true },
        squadron: 'Grun'
      },
      {
        id: 0x04,
        ace: { title: 'Graceful Heron', points: 3, noTLSandMPBM: true },
        squadron: 'Indigo'
      }
    ]
  },
  0x03: {
    title: 'Juggernaut',
    ach: { title: 'Allied Assault', points: 2 },
    freeMissions: [
      {
        id: 0x06,
        ace: { title: 'Majestic Condor', points: 3 },
        team: 'Gelnikos'
      },
      {
        id: 0x05,
        ace: { title: 'Opportunistic Seagull', points: 3 },
        team: 'Round Hammer'
      },
      {
        id: 0x07,
        ace: { title: 'Unfazed Kestrel', points: 3 },
        team: 'Costner'
      }
    ]
  },
  0x04: {
    title: 'Flicker of Hope',
    ach: { title: 'Daybreak', points: 2 },
    freeMissions: [
      {
        id: 0x08,
        ace: { title: 'Dance in the Blue Sky', points: 3 }
      }
    ]
  },
  0x05: {
    title: 'Diapason',
    ach: { title: 'Deliverance Bell', points: 2 },
    freeMissions: [{ id: 0x09, ace: { title: 'Fallen Cormorant', points: 3 } }]
  },
  0x06: {
    title: 'Bastion',
    ach: { title: 'Casus Belli', points: 3 },
    freeMissions: [{ id: 0x0a, ace: { title: 'AA Hardened', points: 5 } }]
  },
  0x07: {
    title: 'Merlon',
    ach: { title: 'Darkest Hour', points: 2 },
    freeMissions: [
      {
        id: 0x0b,
        ace: { title: 'Taking Flak', points: 3 },
        team: 'Alpha Team'
      },
      {
        id: 0x0c,
        ace: { title: 'Draken Defense', points: 3 },
        team: 'Beta Team'
      },
      {
        id: 0x0d,
        ace: { title: 'Air Corridor', points: 3 },
        team: 'Gamma Team'
      }
    ]
  },
  0x08: {
    title: 'Sword of Annihilation',
    ach: { title: "King's Blade", points: 2 },
    freeMissions: [{ id: 0x0e, ace: { title: "Grab'n'Pull", points: 5 } }]
  },
  0x09: {
    title: 'Mayhem',
    ach: { title: 'Demon Lord', points: 3 },
    freeMissions: [
      {
        id: 0x0f,
        ace: { title: 'Vulture', points: 5, noTLSandMPBM: true },
        squadron: 'Schwarze'
      },
      {
        id: 0x10,
        ace: { title: 'Phonix', points: 5, noTLSandMPBM: true },
        squadron: 'Schnee'
      },
      {
        id: 0x11,
        ace: { title: 'Silver Eagle', points: 5, noTLSandMPBM: true },
        squadron: 'Silber'
      }
    ]
  },
  0x0A: {
    title: 'The Inferno',
    ach: { title: 'What Is Our Mission?', points: 2 },
    freeMissions: [{ id: 0x12, ace: { title: 'Scorched Earth', points: 3 } }]
  },
  0x0B: {
    title: 'Stage of Apocalypse',
    ach: { title: 'Reasons to Fight', points: 2 },
    freeMissions: [{ id: 0x13, ace: { title: 'Capital Punishment', points: 3 } }]
  },
  0x0C: {
    title: 'Lying in Deceit',
    ach: { title: 'Stone Age', points: 3 },
    freeMissions: [{ id: 0x14, ace: { title: 'Chasing Shadows', points: 5 } }]
  },
  0x0D: {
    title: 'The Final Overture',
    ach: { title: 'Dichotomy', points: 2 },
    freeMissions: [
      {
        id: 0x15,
        ace: { title: 'Martian Rage', points: 3 },
        team: 'Mars Team'
      },
      {
        id: 0x16,
        ace: { title: 'Mercurian Fortune', points: 3 },
        team: 'Mercury Team'
      },
      {
        id: 0x17,
        ace: { title: 'Rulers of the Sky', points: 3 },
        team: 'Jupiter Team'
      }
    ]
  },
  0x0E: {
    title: 'The Talon of Ruin',
    ach: { title: 'Steel Wind', points: 2 },
    freeMissions: [
      {
        id: 0x18,
        ace: { title: 'Special Raid', points: 3, noTLSandMPBM: true }
      }
    ]
  },
  0x0F: {
    title: 'The Demon of the Round Table',
    ach: { title: 'The Forces of Annwn', points: 2 },
    freeMissions: [
      {
        id: 0x19,
        ace: { title: 'Bedivere', points: 5, noTLSandMPBM: true },
        squadron: 'Sorcerer'
      },
      {
        id: 0x1a,
        ace: { title: 'Golden Woodpecker', points: 5, noTLSandMPBM: true },
        squadron: 'Gault'
      },
      {
        id: 0x1b,
        ace: { title: 'Lucan', points: 5, noTLSandMPBM: true },
        squadron: 'Wizard'
      }
    ]
  },
  0x10: {
    title: 'The Valley of Kings',
    ach: { title: 'The Gate to Annwn', points: 2 },
    freeMissions: [{ id: 0x1c, ace: { title: 'The Fall of Annwn', points: 3 } }]
  },
  0x11: {
    title: 'Zero',
    ach: { title: 'Edge of the Coin', points: 2 },
    freeMissions: [
      {
        id: 0x1d,
        ace: { title: 'Twisted Games', points: 5, noTLSandMPBM: true }
      }
    ]
  },
  0x1E: {
    // title: 'The Gauntlet',
    freeMissions: [{ id: 0x1E }],
    isNotCampaign: true
  }
}


const missionToFreeMissions = (id, style) => id === 'any' ? [] : missionMeta[id].freeMissions.filter(
  (_, idx) => style >= 0 ? idx === style : true
)

const difficulty = {
  veryEasy: 0,
  easy: 1,
  normal: 2,
  hard: 3,
  expert: 4,
  ace: 5,
  freeFlight: 6
}

const inGameMode = {
  start: 0x01,
  start2: 0x02,
  gameplayOrCutscene: 0x03,
  landingBegins: 0x0E
}

const rank = {
  S: 0,
  A: 1,
  B: 2,
  C: 3
}

const b = (s) => {
  if (process.argv.includes('badge')) {
    return `local\\\\${s}.png`
  }
}

/** @typedef {'pal' | 'ntsc'} Region */

/**
 * @template T
 * @typedef {(c: typeof codeFor extends (...args: any[]) => infer U ? U : any) => T} CodeForCallbackTemplate
*/

/** @typedef {CodeForCallbackTemplate<
      import('@cruncheevos/core').ConditionBuilder |
      import('@cruncheevos/core').Condition
    >} CodeForCallback */

/** @param {Region} region */
const codeFor = (region) => {
  const offset = a => {
    const offset =
      a < 0x400000 ? 0x1700 :
        a < 0x700000 ? 0x1f80 :
          -0x8bf0

    return region === 'ntsc' ? a - offset : a
  }

  const address = {
    missionType: offset(0x3ae730),
    functionPointer: offset(0x3b2380),

    campaignCraftId: offset(0x3b51ac),
    campaignMissionId: offset(0x3baea8),
    campaignMissionDifficulty: offset(0x3baebc),

    freeCraftId: offset(0x3bb140),
    freeMissionId: offset(0x3c0e40),
    freeMissionDifficulty: offset(0x3c0e50),

    assaultRecordsTable: offset(0x3b5888),
    freeRankTable: offset(0x3b5b88),
    tgtDestroyedTable: offset(0x3b51c4),

    postScore: offset(0x3c0f10),
    postRankBonus: offset(0x3c0f24),
    postTime: offset(0x3c0f1c),
    postRank: offset(0x3c0f20),
    postLandingBonus: offset(0x3c0f28),
    postYellowAirTargetsDestroyed: offset(0x3c0f30),
    postYellowGroundTargetsDestroyed: offset(0x3c0f34),

    missionTimer: offset(0x4076c0),
  }

  const fpOffset = offset => region === 'ntsc' ? offset + 0x28 : offset
  const functionPointer = {
    mainMenu: fpOffset(0x281C10),
    briefing: fpOffset(0x281C60),
    mission: fpOffset(0x2829B0),
    debriefing: fpOffset(0x282B40),
    loadGame: fpOffset(0x281C10)
  }

  const regionCheck = $(
    region === 'pal' && ['', 'Mem', '32bit', 0x3b055a, '=', 'Value', '', 0x53454353],
    region === 'ntsc' && ['', 'Mem', '32bit', 0x3aee5a, '=', 'Value', '', 0x53554C53]
  )

  const functionPointerChanged = $.one(['', 'Mem', '32bit', address.functionPointer, '!=', 'Delta', '32bit', address.functionPointer])
  const functionPointerIs = pointer => $.one(['', 'Mem', '32bit', address.functionPointer, '=', 'Value', '', pointer])

  return {
    address,
    regionCheck,
    regionCheckPause: regionCheck.map(c => c.with({ flag: 'PauseIf', cmp: '!=' })),

    isNotInGame: andNext(
      functionPointerIs(functionPointer.mission).with({ cmp: '!=' }),
      functionPointerIs(functionPointer.debriefing).with({ cmp: '!=' }),
    ),

    inBriefing: functionPointerIs(functionPointer.briefing),
    inBriefingForTwoFrames: andNext(
      functionPointerIs(functionPointer.briefing),
      functionPointerIs(functionPointer.briefing).with({
        lvalue: { type: 'Delta' }
      })
    ),
    inMission: functionPointerIs(functionPointer.mission),
    inDebriefing: functionPointerIs(functionPointer.debriefing),
    wasInDebriefing: functionPointerIs(functionPointer.debriefing).with({ lvalue: { type: 'Delta' } }),
    debriefingStarted: andNext(
      ['AndNext', 'Delta', '32bit', address.functionPointer, '!=', 'Value', '', functionPointer.debriefing],
      ['', 'Mem', '32bit', address.functionPointer, '=', 'Value', '', functionPointer.debriefing]
    ),

    missionTimerAdvanced: $.one(['', 'Mem', '32bit', address.missionTimer, '>', 'Delta', '32bit', address.missionTimer]),

    missionTypeIsFree: $.one(['', 'Mem', '32bit', address.missionType, '=', 'Value', '', 8]),
    missionTypeIsCampaign: $.one(['', 'Mem', '32bit', address.missionType, '=', 'Value', '', 9]),

    isInFreeFlight: $(
      ['', 'Mem', '32bit', address.freeMissionDifficulty, '=', 'Value', '', difficulty.freeFlight]
    ),

    inGame: (() => {
      const base = $.one(['AddAddress', 'Mem', '32bit', offset(0x3b4904)])
      const missionInfo = $(
        base,
        ['AddAddress', 'Mem', '32bit', 0x98B70],
        ['AddAddress', 'Mem', '32bit', 0x8],
      )
      const playerStuffPointer = $(
        base,
        ['AddAddress', 'Mem', '32bit', 0x98B08],
      )
      const missionStatePointer = $(
        base,
        ['AddAddress', 'Mem', '32bit', 0x5E4B8],
      )

      const minimalMissionDifficultyIs = difficulty => $(
        missionInfo,
        ['', 'Mem', '8bit', 0x39B, '>=', 'Value', '', difficulty]
      )
      const craftIdIs = craftId => $(
        playerStuffPointer,
        ['', 'Mem', '8bit', 0x1AB3, '=', 'Value', '', craftId]
      )
      const missionIdIs = missionId => $(
        missionInfo,
        ['', 'Mem', '8bit', 0x396, '=', 'Value', '', missionId]
      )

      const modeIs = mode => $(
        missionInfo,
        ['', 'Mem', '8bit', 0x38D, '=', 'Value', '', mode]
      )

      const entityGroup = (group) => {
        const basePointer = $(
          base,
          ['AddAddress', 'Mem', '32bit', 0x5E500],
          ['AddAddress', 'Mem', '32bit', group * 0x4],
          ['AddAddress', 'Mem', '32bit', 0x104],
        )

        return {
          index(index) {
            const offset = index * 0x4A0

            return {
              becameAlive: $(
                basePointer,
                ['AndNext', 'Delta', 'Bit1', offset + 0x1F8, '=', 'Value', '', 0],
                basePointer,
                ['', 'Mem', 'Bit1', offset + 0x1F8, '>', 'Value', '', 0]
              ),

              isAlive: $(
                basePointer,
                ['', 'Mem', 'Bit1', offset + 0x1F8, '=', 'Value', '', 1]
              ),

              gotDestroyed: $(
                basePointer,
                ['', 'Mem', 'Bit1', offset + 0x1F8, '<', 'Delta', 'Bit1', offset + 0x1F8]
              ),

              takenDamage: $(
                basePointer,
                ['SubSource', 'Delta', '32bit', offset + 0x398]
              ).also(
                basePointer,
                ['', 'Mem', '32bit', offset + 0x398, '>', 'Value', '', 0]
              ),

              isGoingSouth: $(
                basePointer,
                ['', 'Mem', 'Float', 0x268, '>', 'Delta', 'Float', 0x268]
              ),

              inAvalon: (() => {
                const pi2 = Math.PI / 2
                const isUnderAndNext = $(
                  basePointer,
                  ['AndNext', 'Mem', 'Float', 0x264, '<=', 'Float', '', 1500],
                )

                const isInTheRightAreaAndNext = $(
                  basePointer,
                  ['AndNext', 'Mem', 'Float', 0x260, '>=', 'Float', '', 13000],
                  basePointer,
                  ['AndNext', 'Mem', 'Float', 0x260, '<=', 'Float', '', 25000],
                  basePointer,
                  ['AndNext', 'Mem', 'Float', 0x268, '>=', 'Float', '', -154000],
                  basePointer,
                  ['AndNext', 'Mem', 'Float', 0x268, '<=', 'Float', '', -100000],
                )

                return {
                  divedIn: $(
                    isInTheRightAreaAndNext,
                    basePointer,
                    ['AndNext', 'Delta', 'Float', 0x264, '>', 'Float', '', 1500],
                    basePointer,
                    ['', 'Mem', 'Float', 0x264, '<=', 'Float', '', 1500]
                  ),
                  turnedAroundUnder: $(
                    isInTheRightAreaAndNext,
                    isUnderAndNext,
                    basePointer,
                    ['AndNext', 'Delta', 'Float', 0x274, '>', 'Float', '', 0],
                    basePointer,
                    ['AndNext', 'Mem', 'Float', 0x274, '>', 'Float', '', 0],
                    basePointer,
                    ['AndNext', 'Delta', 'Float', 0x274, '<=', 'Float', '', pi2],
                    basePointer,
                    ['', 'Mem', 'Float', 0x274, '>', 'Float', '', pi2],

                    isInTheRightAreaAndNext,
                    isUnderAndNext,
                    basePointer,
                    ['AndNext', 'Delta', 'Float', 0x274, '>', 'Float', '', 0],
                    basePointer,
                    ['AndNext', 'Mem', 'Float', 0x274, '>', 'Float', '', 0],
                    basePointer,
                    ['AndNext', 'Delta', 'Float', 0x274, '>', 'Float', '', pi2],
                    basePointer,
                    ['', 'Mem', 'Float', 0x274, '<=', 'Float', '', pi2],

                    isInTheRightAreaAndNext,
                    isUnderAndNext,
                    basePointer,
                    ['AndNext', 'Delta', 'Float', 0x274, '<', 'Float', '', 0],
                    basePointer,
                    ['AndNext', 'Mem', 'Float', 0x274, '<', 'Float', '', 0],
                    basePointer,
                    ['AndNext', 'Delta', 'Float', 0x274, '<=', 'Float', '', -pi2],
                    basePointer,
                    ['', 'Mem', 'Float', 0x274, '>', 'Float', '', -pi2],

                    isInTheRightAreaAndNext,
                    isUnderAndNext,
                    basePointer,
                    ['AndNext', 'Delta', 'Float', 0x274, '<', 'Float', '', 0],
                    basePointer,
                    ['AndNext', 'Mem', 'Float', 0x274, '<', 'Float', '', 0],
                    basePointer,
                    ['AndNext', 'Delta', 'Float', 0x274, '>', 'Float', '', -pi2],
                    basePointer,
                    ['', 'Mem', 'Float', 0x274, '<=', 'Float', '', -pi2],
                  )
                }
              })(),

              scoreIsEqualOrGreaterThan: score => $(
                basePointer,
                ['', 'Mem', '32bit', 0x390, '>=', 'Value', '', score]
              )
            }
          }
        }
      }

      return {
        minimalMissionDifficultyIs,
        minimalMissionDifficultyIsNot: difficulty => minimalMissionDifficultyIs(difficulty).withLast({ cmp: '<' }),
        missionIdIs,
        missionIdIsNot: missionId => missionIdIs(missionId).withLast({ cmp: '!=' }),
        specialWeaponIdIsNot: weaponId => $(
          playerStuffPointer,
          ['', 'Mem', '8bit', 0x1624, '!=', 'Value', '', weaponId]
        ),
        craftIdIs,
        craftIdIsNot: craftId => craftIdIs(craftId).map(c => c.flag !== '' ? c : c.with({ cmp: '!=' })),

        notInFreeFlight: minimalMissionDifficultyIs(difficulty.freeFlight).withLast({ cmp: '!=' }),

        missionStatePointer,
        missionMedalAwarded: $(
          missionStatePointer,
          ['', 'Mem', '8bit', 0x0, '=', 'Value', '', 1],
        ),

        modeIs,
        isLanding: modeIs(inGameMode.landingBegins),

        missionPhaseTimer: {
          advanced: $(
            missionInfo,
            ['', 'Mem', '32bit', 0x348, '>', 'Delta', '32bit', 0x348]
          ),
          wentPast: seconds => $(
            missionInfo,
            ['AndNext', 'Mem', '32bit', 0x348, '>', 'Delta', '32bit', 0x348],
            missionInfo,
            ['', 'Mem', '32bit', 0x348, '>', 'Value', '', seconds * (region === 'ntsc' ? 60 : 50)]
          ),
          refuelIsTakingLessThan: seconds => $(
            missionInfo,
            ['AndNext', 'Mem', '32bit', 0x348, '<', 'Delta', '32bit', 0x348],
            missionInfo,
            ['', 'Mem', '32bit', 0x348, '>', 'Value', '', seconds * (region === 'ntsc' ? 60 : 50)]
          ),
          wasLessThan: (seconds) => $(
            missionInfo,
            ['', 'Delta', '32bit', 0x348, '<', 'Value', '', seconds * (region === 'ntsc' ? 60 : 50)]
          ),

          measured: $(
            missionInfo,
            ['Measured', 'Mem', '32bit', 0x348]
          )
        },

        entityGroup,
        player: (() => {
          const hasSysMessageBase = bit => $(
            playerStuffPointer,
            ['', 'Mem', 'Bit' + bit, 0x1600, '=', 'Value', '', 1]
          )

          const gotSysMessageBase = bit => $(
            playerStuffPointer,
            ['', 'Mem', 'Bit' + bit, 0x1600, '>', 'Delta', 'Bit' + bit, 0x1600]
          )

          return {
            hasSysMessage: {
              missionUpdate: hasSysMessageBase(5),
              missionComplete: hasSysMessageBase(6)
            },

            gotSysMessage: {
              missionUpdate: gotSysMessageBase(5)
            },

            gotForcedAutopilot: $(
              playerStuffPointer,
              ['', 'Mem', 'Bit0', 0x1303, '>', 'Delta', 'Bit0', 0x1303],
            ),

            shotMissile: $(
              playerStuffPointer,
              ['', 'Mem', '8bit', 0x1AA9, '<', 'Delta', '8bit', 0x1AA9],
            ),
            shotSpecial: $(
              playerStuffPointer,
              ['', 'Mem', '8bit', 0x1AAA, '<', 'Delta', '8bit', 0x1AAA],
            ),

            hasMoreOrEqualSpecialShots: (shots) => $(
              playerStuffPointer,
              ['', 'Mem', '8bit', 0x1AAA, '>=', 'Value', '', shots],
            ),

            specialCooldown(index) {
              const offset = + 0x20 * index
              return {
                inProgress: $(
                  playerStuffPointer,
                  ['', 'Mem', '16bit', 0x1984 + offset, '>', 'Value', '', 0],
                ),
                isOver: $(
                  playerStuffPointer,
                  ['', 'Mem', '16bit', 0x1984 + offset, '=', 'Value', '', 0]
                ),
              }
            },

            gotEnoughAirKills(amount) {
              return $(
                playerStuffPointer,
                ['', 'Mem', '16bit', 0x2150, '>=', 'Value', '', amount],
              )
            },

            gotGunKill: $(
              playerStuffPointer,
              ['', 'Mem', '8bit', 0x2156, '>', 'Delta', '8bit', 0x2156],
            ),
            gotMissileKill: $(
              playerStuffPointer,
              ['', 'Mem', '8bit', 0x2154, '>', 'Delta', '8bit', 0x2154],
            ),
            gotSpecialWeaponKill: $(
              playerStuffPointer,
              ['', 'Mem', '8bit', 0x2155, '>', 'Delta', '8bit', 0x2155],
            ),

            gotAirKill: $(
              playerStuffPointer,
              ['', 'Mem', '16bit', 0x2150, '>', 'Delta', '16bit', 0x2150],
            ),
            gotGroundKill: $(
              playerStuffPointer,
              ['', 'Mem', '16bit', 0x2152, '>', 'Delta', '16bit', 0x2152],
            ),

            wingmanGotKill: $(
              playerStuffPointer,
              ['', 'Mem', '8bit', 0x228C, '>', 'Delta', '8bit', 0x228C],
            ),

            usingCockpitCamera: $(
              playerStuffPointer,
              ['', 'Mem', '8bit', 0x1AB5, '=', 'Value', '', 2],
            ),
            notUsingCockpitCamera: $(
              playerStuffPointer,
              ['', 'Mem', '8bit', 0x1AB5, '!=', 'Value', '', 2],
            ),

            ...entityGroup(0).index(0)
          }
        })(),
      }
    })(),

    bailedIntoMainMenu: andNext(
      functionPointerChanged,
      functionPointerIs(functionPointer.debriefing).with({ cmp: '!=' })
    ),

    bailedIntoMainMenuFromMission: andNext(
      functionPointerIs(functionPointer.mission).with({ lvalue: { type: 'Delta' } }),
      functionPointerIs(functionPointer.mainMenu)
    ),

    missionHasStarted: $(
      ['AndNext', 'Delta', '32bit', address.missionTimer, '=', 'Value', '', 0],
      ['', 'Mem', '32bit', address.missionTimer, '>', 'Delta', '32bit', address.missionTimer]
    ),

    postRankIsAtleast: value => $(
      ['', 'Mem', '32bit', address.postRank, value === 0 ? '=' : '<=', 'Value', '', value]
    ),
    postScoreIsAtleast: value => $(
      ['SubSource', 'Mem', '32bit', address.postRankBonus],
      ['SubSource', 'Mem', '32bit', address.postLandingBonus],
      ['', 'Mem', '32bit', address.postScore, '>=', 'Value', '', value]
    ),
    postLandingBonusIs: value => $.one(
      ['', 'Mem', '32bit', address.postLandingBonus, '=', 'Value', '', value]
    ),
    postDidntDestroyYellow: $(
      ['', 'Mem', '32bit', address.postYellowAirTargetsDestroyed, '=', 'Value', '', 0],
      ['', 'Mem', '32bit', address.postYellowGroundTargetsDestroyed, '=', 'Value', '', 0]
    ),

    completedMissionInLessThan(timeString) {
      const [min, sec] = timeString.split(':').map(Number)
      const totalSec = min * 60 + sec

      const frames = totalSec * (region === 'ntsc' ? 60 : 50)

      return $.one(['', 'Mem', '32bit', address.postTime, '<', 'Value', '', frames])
    },

    applyingBrakes: $.one(['', 'Mem', '8bit', offset(0x69952a), '>', 'Value', '', 0]),
    applyingThrottle: $.one(['', 'Mem', '8bit', offset(0x69952b), '>', 'Value', '', 0]),
  }
}

const code = {
  pal: codeFor('pal'),
  ntsc: codeFor('ntsc')
}

function timeTrialDebriefingConditions(conditions) {
  return {
    cancel: alwaysFalse,
    submit: alwaysTrue,
    start: conditions,
    value: {
      core: $(
        measuredIf(code.pal.regionCheck),
        ['Measured', 'Mem', '32bit', code.pal.address.postTime, '*', 'Float', '', 1.2]
      ),
      alt1: $(
        measuredIf(code.ntsc.regionCheck),
        ['Measured', 'Mem', '32bit', code.ntsc.address.postTime]
      ),
    }
  }
}

function timeTrialDuringMissionConditions(conditions) {
  return {
    cancel: alwaysFalse,
    submit: alwaysTrue,
    start: conditions,
    value: {
      core: $(
        measuredIf(code.pal.regionCheck),
        code.pal.inGame.missionPhaseTimer.measured.withLast({
          cmp: '*', rvalue: ['Float', '', 1.2]
        }),
      ),
      alt1: $(
        measuredIf(code.ntsc.regionCheck),
        code.pal.inGame.missionPhaseTimer.measured,
      ),
    }
  }
}

/** @param params {{
  missionId: number | 'any'
  craftId?: number
  weaponSelection?: number
  missionStyle?: number
  minimalDifficulty?: number
  minimalScore?: number
  minimalRank?: number
  additionalConditions?: CodeForCallback
  startConditions?: CodeForCallback
  resetConditions?: CodeForCallback
  triggerOverride?: boolean
  targetsToDestroy?: Record<number, Array<number | {
    id: number,
    additionalConditions?: CodeForCallback
  }>
}} */
function completedMissionInAnyMode({
  missionId,
  craftId = -1,
  weaponSelection = -1,
  missionStyle = -1,
  minimalDifficulty = -1,
  minimalScore,
  minimalRank = -1,
  additionalConditions = null,
  startConditions = null,
  resetConditions = null,
  triggerOverride,
  targetsToDestroy = {}
}) {
  const hasTargetsToDestroy = Object.keys(targetsToDestroy).length > 0
  const hasHits = Boolean(startConditions || resetConditions || hasTargetsToDestroy)
  const freeMissions = missionToFreeMissions(missionId, missionStyle)

  const shouldWrapInTrigger = triggerOverride !== undefined ? triggerOverride : hasHits

  const [alt1, alt2] = [code.pal, code.ntsc].map(c => {
    let triggerConditions = $(
      c.debriefingStarted,
      minimalScore > 0 && c.postScoreIsAtleast(minimalScore),
      minimalRank >= 0 && c.postRankIsAtleast(minimalRank),
      additionalConditions?.(c),
    )

    if (shouldWrapInTrigger) {
      triggerConditions = trigger(triggerConditions)
    }

    return pauseIf(
      c.regionCheckPause,
      c.isNotInGame,

      andNext(
        ...freeMissions.map(x => c.inGame.missionIdIsNot(x.id))
      ),

      minimalDifficulty >= 0 && c.inGame.minimalMissionDifficultyIsNot(minimalDifficulty),
      craftId >= 0 && c.inGame.craftIdIsNot(craftId),
      weaponSelection >= 0 && c.inGame.specialWeaponIdIsNot(weaponSelection)
    ).also(
      startConditions && andNext(
        'once',
        c.inMission,
        startConditions(c)
      ),

      triggerConditions,

      ...Object.entries(targetsToDestroy).flatMap(([group, pack]) =>
        pack.map(value => {
          const obj = typeof value === 'number' ? { id: value } : value
          return { group, ...obj }
        })
      ).map(({ group, id, additionalConditions = null }) =>
        andNext(
          'once',
          additionalConditions?.(c),
          c.missionTimerAdvanced,
          c.inGame.entityGroup(group).index(id).gotDestroyed
        )
      ),

      hasTargetsToDestroy && !resetConditions && resetIf(
        c.missionHasStarted
      ),

      resetConditions && resetIf(
        resetConditions(c)
      )
    )
  })

  return {
    core: alwaysTrue,
    alt1,
    alt2
  }
}

/** @param params {{
  missionId?: number
  missionStyle?: number
  craftId?: number
  weaponSelection?: number
  minimalDifficulty?: number
  additionalConditions: CodeForCallback
}} */
function achievedDuringMission({
  missionId,
  missionStyle,
  craftId,
  weaponSelection,
  minimalDifficulty = -1,
  additionalConditions
}) {
  const freeMissions = missionToFreeMissions(missionId, missionStyle)

  const [alt1, alt2] = [code.pal, code.ntsc].map(c => {
    return pauseIf(
      c.regionCheckPause,
      andNext(...freeMissions.map(x => c.inGame.missionIdIsNot(x.id))),

      minimalDifficulty >= 0 && c.inGame.minimalMissionDifficultyIsNot(minimalDifficulty),
      craftId >= 0 && c.inGame.craftIdIsNot(craftId),
      weaponSelection >= 0 && c.inGame.specialWeaponIdIsNot(weaponSelection)
    ).also(
      additionalConditions?.(c)
    )
  })

  return {
    core: alwaysTrue,
    alt1,
    alt2
  }
}

/** @param params {{
  missionsRequired: number
  // missionIds?: Record<number, number[] | 'any'>
  missionIds?: number[],
  craftId?: number
  minimalDifficulty: number,
  minimalRank: number,

  pauseLockWhen?: CodeForCallback,
}} */
function completedSetOfMissions({
  missionIds,
  missionsRequired,
  craftId = -1,
  minimalDifficulty = -1,

  minimalRank = -1,
  pauseLockWhen
}) {
  // const freeMissionGroups = Object.values(missionIds ? missionIds : freeMissionMapping)
  const freeMissionGroups = (missionIds || Object.keys(missionMeta)).map(id => missionMeta[id].freeMissions.map(x => x.id))

  const [alt1, alt2] = [code.pal, code.ntsc].map(c => {
    return pauseIf(
      c.regionCheckPause,
      c.isNotInGame,

      minimalDifficulty >= 0 && c.inGame.minimalMissionDifficultyIsNot(minimalDifficulty),
      craftId >= 0 && c.inGame.craftIdIsNot(craftId),
    ).addHits(
      // Complete any mission in the mission group and it marks a hit
      ...freeMissionGroups.map(group => andNext(
        'once',
        orNext(
          ...group.map(missionId => c.inGame.missionIdIs(missionId))
        ),
        minimalRank >= 0 && c.postRankIsAtleast(minimalRank),
        c.debriefingStarted
      ))
    ).also(
      ['Measured', 'Value', '', 0, '=', 'Value', '', 1, missionsRequired],

      pauseLockWhen && resetNextIf(
        c.missionHasStarted
      ).pauseIf(
        'once',
        pauseLockWhen(c)
      )
    )
  })

  return {
    core: alwaysTrue,
    alt1,
    alt2
  }
}

/** @param params {{
  minimalDifficulty: number,
  allStyles?: boolean
}} */
function completedSetOfMissionFlags({
  minimalDifficulty,
  allStyles
}) {
  const offsets = []
  const missionCount = 18

  if (allStyles) {
    for (let m = 0; m < missionCount; m++) {
      for (let s = 0; s <= 2; s++) {
        const offsetPack = []

        for (let d = minimalDifficulty; d <= difficulty.ace; d++) {
          offsetPack.push(
            m * 12 + d * 0xE4 + s * 4
          )
        }

        offsets.push(offsetPack)
      }
    }
  } else {
    for (let m = 0; m < missionCount; m++) {
      const offsetPack = []

      for (let d = minimalDifficulty; d <= difficulty.ace; d++) {
        offsetPack.push(
          m * 12 + d * 0xE4 + 0,
          m * 12 + d * 0xE4 + 4,
          m * 12 + d * 0xE4 + 8
        )
      }

      offsets.push(offsetPack)
    }
  }

  const [alt1, alt2] = [code.pal, code.ntsc].map(c => {
    const missionFlagsAreOk = offsets.flatMap((pack) =>
      pack.map((offset, offsetIndex, offsetSelf) =>
        offsetIndex < offsetSelf.length - 1 ?
          $.one(['AddSource', 'Mem', '32bit', c.address.freeRankTable + offset]) :
          $.one(['', 'Mem', '32bit', c.address.freeRankTable + offset, '<', 'Value', '', 4 * offsetSelf.length])
      )
    )

    return $(
      c.regionCheckPause,

      // Put the PauseIf lock if player entered
      // the mission with all conditions fulfilled
      resetNextIf(
        c.inBriefingForTwoFrames
      ).pauseIf(
        'once',
        andNext(
          c.inMission,
          ...missionFlagsAreOk
        )
      ),

      // Actually do the check
      // when there's no PauseIf lock
      orNext(
        c.inDebriefing
      ).andNext(
        c.wasInDebriefing,
        ...missionFlagsAreOk
      )
    )
  })

  return {
    core: alwaysTrue,
    alt1,
    alt2
  }
}

/** @param params {{
  begin: number,
  end: number
}} */
function completedAssaultRecords({ begin, end }) {
  const recordCount = (end - begin) + 1
  const assaultRecordIndexes = Array.from({ length: recordCount }, (_, i) => i + begin)

  const [alt1, alt2] = [code.pal, code.ntsc].map(c => {
    const assaultRecordsAreOk = assaultRecordIndexes.map(entry => $.one(
      ['', 'Mem', '8bit', c.address.assaultRecordsTable + entry, '>', 'Value', '', 0]
    ))

    return $(
      c.regionCheckPause,

      // Put the PauseIf lock if player entered
      // the mission with all conditions fulfilled
      resetNextIf(c.inBriefingForTwoFrames)
        .pauseIf(
          'once',
          andNext(
            c.inMission,
            ...assaultRecordsAreOk
          )
        ),

      // Actually do the check
      // when there's no PauseIf lock
      orNext(
        c.inDebriefing
      ).andNext(
        c.wasInDebriefing,
        ...assaultRecordsAreOk
      )
    )
  })

  return {
    core: alwaysTrue,
    alt1,
    alt2
  }
}

/** @param params {{
  craftId: number,
  minimalDifficulty: number
}} */
function completedPermadeath({
  craftId,
  minimalDifficulty
}) {

  const [alt1, alt2] = [code.pal, code.ntsc].map(c => {
    const gracePeriod = 8
    const graceFrames = (c === code.pal ? 25 : 30) * gracePeriod

    const isPastGracePeriod = $.one(['', 'Mem', '32bit', c.address.missionTimer, '>', 'Value', '', graceFrames])
    const gotPastGracePeriod = andNext(
      isPastGracePeriod,
      isPastGracePeriod.with({ lvalue: { type: 'Delta' }, cmp: '<=' })
    )

    const restartedPastGracePeriod = andNext(
      isPastGracePeriod.with({ lvalue: { type: 'Delta' } }),
      ['', 'Mem', '32bit', c.address.missionTimer, '=', 'Value', '', 0]
    )

    return $(
      c.regionCheckPause,

      // Hit (1) on correct mission start
      andNext(
        'once',
        minimalDifficulty >= 0 && c.inGame.minimalMissionDifficultyIs(minimalDifficulty),
        craftId >= 0 && c.inGame.craftIdIs(craftId),
        c.inGame.missionIdIs(mission.GlacialSkies_01),
        c.missionHasStarted
      ),

      // ResetIf if wrong plane for several frames
      resetIf(
        andNext(
          c.inMission,
          gotPastGracePeriod,
          c.inGame.craftIdIsNot(craftId)
        )
      ),

      // ResetIf if mission restart after several frames
      resetIf(
        andNext(
          c.inMission,
          c.inGame.modeIs(inGameMode.gameplayOrCutscene).withLast({ cmp: '>=' }),
          restartedPastGracePeriod
        )
      ),

      // ResetIf if mission bail after several frames
      resetIf(
        andNext(
          isPastGracePeriod,
          c.bailedIntoMainMenuFromMission
        )
      ),

      // ResetIf if mission changed in unexpected way
      resetIf(
        andNext(
          c.inDebriefing.with({ cmp: '!=' }),
          c.inDebriefing.with({ cmp: '!=', lvalue: { type: 'Delta' } }),
          ['', 'Mem', '32bit', c.address.campaignMissionId, '!=', 'Delta', '32bit', c.address.campaignMissionId]
        )
      ),

      // ResetIf if difficulty changed to lower then needed
      resetIf(
        ['AndNext', 'Delta', '32bit', c.address.campaignMissionDifficulty, '>=', 'Value', '', difficulty.normal],
        ['', 'Mem', '32bit', c.address.campaignMissionDifficulty, '<', 'Value', '', difficulty.normal]
      ),

      // PauseIf playing free mission
      pauseIf(
        c.missionTypeIsFree
      ),

      // Trigger on final mission complete
      trigger(
        andNext(
          c.inGame.missionIdIs(missionMeta[mission.Zero_18].freeMissions[0].id),
          c.debriefingStarted
        )
      )
    )
  })

  return {
    core: alwaysTrue,
    alt1,
    alt2
  }
}

const set = new AchievementSet({ gameId: 20921, title: 'Ace Combat Zero: The Belkan War' })

// Regular progression and easy challenges
for (let missionId in missionMeta) {
  missionId = Number(missionId)

  const meta = missionMeta[missionId]
  if (meta.isNotCampaign) {
    continue
  }

  const missionNumber = Number(missionId).paddedMissionNumber()
  const { title, points } = meta.ach

  set.addAchievement({
    title,
    badge: b(`MISSION_${missionNumber}_COMPLETE`),
    description: `Complete Mission ${missionNumber}: ${meta.title}`,
    points,
    conditions: completedMissionInAnyMode({ missionId }),
    type: 'progression'
  })

  if (missionId === mission.FlickerOfHope_05) {
    set.addAchievement({
      title: 'Guardian',
      badge: b('MISSION_05_MEDAL'),
      description: `Complete Mission 05 without any allied transport aircraft getting shot down`,
      points: 2,
      conditions: completedMissionInAnyMode({
        missionId,
        additionalConditions: c => c.inGame.missionMedalAwarded
      })
    }).addAchievement({
      title: 'On the Money',
      badge: b('MISSION_05_LANDING_PERFECT'),
      description: `Perfect, Galm 1! You've got grand credit Landing Bonus at the end of Mission 05`,
      points: 1,
      conditions: completedMissionInAnyMode({
        missionId,
        additionalConditions: c => c.postLandingBonusIs(1000)
      })
    })
  }

  if (missionId === mission.Glatisant_07) {
    set.addAchievement({
      title: 'Relentless Onslaught',
      badge: b('MISSION_07_NO_REFUEL'),
      description: `Complete Mission 07 without crossing the Return Line`,
      points: 3,
      conditions: completedMissionInAnyMode({
        missionId,
        startConditions: c => c.missionHasStarted,
        resetConditions: c => c.inGame.isLanding
      })
    })
  }

  if (missionId === mission.Merlon_08) {
    set.addAchievement({
      title: 'Brightest Minute',
      badge: b('MISSION_08_EXCALIBUR_NO_DAMAGE'),
      description: `Complete Mission 08 without taking damage after MISSION UPDATE`,
      points: 1,
      conditions: completedMissionInAnyMode({
        missionId,
        startConditions: c => c.inGame.player.hasSysMessage.missionUpdate,
        resetConditions: c => $(
          c.missionHasStarted,
          andNext(
            c.missionTimerAdvanced,
            c.inGame.player.takenDamage
          )
        )
      })
    })
  }
  if (missionId === mission.Excalibur_09) {
    set.addAchievement({
      title: 'Broken Sword',
      badge: b('MISSION_09_MEDAL'),
      description: `Complete Mission 09 with all JAMMERs and RTLS units destroyed`,
      points: 1,
      conditions: completedMissionInAnyMode({
        missionId,
        targetsToDestroy: {
          2: [0],
          3: [0],
          4: [0],
          5: [0],

          49: [0],
          50: [0],
          51: [0],
          52: [0]
        },
        resetConditions: c => c.missionHasStarted
      })
    })
  }

  if (missionId === mission.Deceit_13) {
    set.addAchievement({
      title: 'Long Haul',
      badge: b('MISSION_13_NO_REFUEL'),
      description: `Complete Mission 13 without crossing the Return Line`,
      points: 3,
      conditions: completedMissionInAnyMode({
        missionId,
        startConditions: c => c.missionHasStarted,
        resetConditions: c => c.inGame.isLanding
      })
    })
  }

  if (missionId === mission.AirFortress_15) {
    set.addAchievement({
      title: 'Ragnarok',
      badge: b('MISSION_15_MEDAL'),
      description: `Complete Mission 15 within 7 minutes of Espada Team appearing`,
      points: 2,
      conditions: completedMissionInAnyMode({
        missionId,
        additionalConditions: c => c.inGame.missionMedalAwarded
      })
    })
  }

  if (missionId === mission.Avalon_17) {
    set.addAchievement({
      title: 'Ace Gulps',
      badge: b('MISSION_17_REFUEL_PERFECT'),
      description: `Perfect, Galm 1! You've approached refuel in 20 seconds at the start of Mission 17`,
      points: 1,
      conditions: achievedDuringMission({
        missionId,
        additionalConditions: c => $(
          c.inGame.missionPhaseTimer.refuelIsTakingLessThan(160),
          c.inGame.player.gotForcedAutopilot,
          c.inGame.player.hasSysMessage.missionComplete
        )
      })
    }).addAchievement({
      title: 'The Gold of Annwn',
      badge: b('MISSION_17_MEDAL'),
      description: `Complete Mission 17 with all eight GUN TOWERs destroyed`,
      points: 2,
      conditions: completedMissionInAnyMode({
        missionId,
        targetsToDestroy: {
          0x2d: [0],
          0x2e: [0],
          0x2f: [0],
          0x30: [0],
          0x31: [0],
          0x32: [0],
          0x33: [0],
          0x34: [0],
        },
        resetConditions: c => c.missionHasStarted
      })
    })
  }
}

// Ace difficulty
for (let missionId in missionMeta) {
  if (missionMeta[missionId].isNotCampaign) {
    continue
  }

  const missionNumber = Number(missionId).paddedMissionNumber()
  const letters = ['A', 'B', 'C']

  missionMeta[missionId].freeMissions.forEach(({ squadron, team, ace }, i) => {
    const hasChoice = Boolean(squadron || team)
    const { title, points, noTLSandMPBM } = ace

    let description = `Complete Mission ${missionNumber} on ACE difficulty with S rank`
    if (squadron) {
      description += ` (${squadron} team)`
    }
    if (team) {
      description += ` (${team})`
    }
    if (noTLSandMPBM) {
      description += `, without using TLS or MPBM`
    }

    set.addAchievement({
      title,
      badge: b(`MISSION_${missionNumber}${hasChoice ? letters[i] : ''}_ACE`),
      description,
      points,
      conditions: completedMissionInAnyMode({
        missionId,
        missionStyle: hasChoice ? i : -1,
        minimalDifficulty: difficulty.ace,
        minimalRank: rank.S,
        additionalConditions: c => $(
          noTLSandMPBM && orNext(
            c.inGame.craftIdIsNot(craft.morgan),
            c.inGame.specialWeaponIdIsNot(weapon.mpbm),
            c.inGame.player.hasMoreOrEqualSpecialShots(8)
          ),

          noTLSandMPBM && orNext(
            c.inGame.craftIdIsNot(craft.morgan),
            c.inGame.specialWeaponIdIsNot(weapon.tls),
            c.inGame.player.hasMoreOrEqualSpecialShots(7)
          ),

          noTLSandMPBM && orNext(
            c.inGame.craftIdIsNot(craft.falken),
            c.inGame.specialWeaponIdIsNot(weapon.tls),
            c.inGame.player.hasMoreOrEqualSpecialShots(14)
          )
        )
      })
    })
  })
}


// Game Clear
set.addAchievement({
  title: 'Bronze Wing',
  badge: b('DIFFICULTY_NORMAL_CLEAR'),
  description: 'Complete all campaign missions (any variation) on Normal difficulty or higher',
  points: 5,
  conditions: (() => {
    const normal = completedSetOfMissionFlags({
      minimalDifficulty: difficulty.normal
    })

    const hard = completedSetOfMissionFlags({
      minimalDifficulty: difficulty.hard
    })

    const expert = completedSetOfMissionFlags({
      minimalDifficulty: difficulty.expert
    })

    return {
      core: alwaysTrue,
      alt1: normal.alt1,
      alt2: hard.alt1,
      alt3: expert.alt1,
      alt4: normal.alt2,
      alt5: hard.alt2,
      alt6: expert.alt2
    }
  })()
})

set.addAchievement({
  title: 'Silver Wing',
  badge: b('DIFFICULTY_HARD_CLEAR'),
  description: 'Complete all campaign missions (any variation) on Hard difficulty or higher',
  points: 10,
  conditions: (() => {
    const hard = completedSetOfMissionFlags({
      minimalDifficulty: difficulty.hard
    })

    const expert = completedSetOfMissionFlags({
      minimalDifficulty: difficulty.expert
    })

    return {
      core: alwaysTrue,
      alt1: hard.alt1,
      alt2: expert.alt1,
      alt3: hard.alt2,
      alt4: expert.alt2,
    }
  })()
})

set.addAchievement({
  title: 'Gold Wing',
  badge: b('DIFFICULTY_EXPERT_CLEAR'),
  description: 'Complete all campaign missions (any variation) on Expert difficulty or higher',
  points: 10,
  conditions: completedSetOfMissionFlags({
    minimalDifficulty: difficulty.expert
  })
})

set.addAchievement({
  title: 'Three Kinds of Aces',
  badge: b('MERCENARY_STYLE_CLEAR'),
  description: 'Complete all variations of campaign missions on any difficulty',
  points: 25,
  conditions: completedSetOfMissionFlags({
    minimalDifficulty: difficulty.veryEasy,
    allStyles: true
  })
})

set.addAchievement({
  title: 'Ace Rush',
  badge: b('GAUNTLET_CLEAR'),
  description: 'Complete Mission SP: The Gauntlet on Normal difficulty or higher',
  points: 10,
  conditions: completedMissionInAnyMode({
    missionId: mission.Gauntlet_SP,
    minimalDifficulty: difficulty.normal
  })
})

set.addAchievement({
  title: 'Torn Ribbon',
  badge: b('GAUNTLET_ACE_CLEAR'),
  description: 'Complete The Gauntlet on Ace difficulty with MOBIUS shot down after dealing with Espada Team in 60 seconds',
  points: 10,
  conditions: completedMissionInAnyMode({
    missionId: mission.Gauntlet_SP,
    minimalDifficulty: difficulty.ace,
    targetsToDestroy: {
      0x37: [0]
    }
  })
})

// Assault Records
for (const [mission, title, points, begin, end] of [
  ['01', 'The Falcons of Dawn', 5, 0, 4],
  ['02', 'A Letter to My Lovely Rose', 5, 5, 9],
  ['03', 'Liberty Seven', 5, 10, 25],
  ['04', 'The Winds of Futuro', 5, 26, 37],
  ['05', 'Iron Man', 5, 38, 43],
  ['06', 'Lost in Translation', 5, 44, 49],
  ['07', 'Monster Mash', 5, 50, 54],
  ['08', 'House of Ludwig', 5, 55, 63],
  ['09', 'Witnesses of Pendragon', 5, 64, 68],
  ['10', 'Grey Men', 10, 69, 101],
  ['11', 'Nepotism', 5, 102, 106],
  ['12', 'Sole Survivor', 5, 107, 111],
  ['13', 'Sentry', 5, 112, 116],
  ['14', 'Zone of Endless', 5, 117, 126],
  ['15', 'Worldwide Coup', 5, 127, 136],
  ['16', 'X-Planes', 5, 137, 160],
  ['17', 'Political Turmoil', 5, 161, 167],
]) {
  const beginPadded = begin.toString().padStart(3, '0')
  const endPadded = end.toString().padStart(3, '0')

  set.addAchievement({
    title,
    badge: b(`MISSION_${mission}_ASSAULT_RECORDS`),
    description: `Unlock Assault Records #${beginPadded}-${endPadded}`,
    points,
    conditions: completedAssaultRecords({ begin, end })
  })
}

// Aircraft challenges
{
  set.addAchievement({
    title: 'Paper Tiger',
    badge: b('AIRCRAFT_F5E_CHALLENGE'),
    description: 'F-5E Tiger II, NORMAL+, Mission 18: complete the mission without applying throttle or brakes',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Zero_18,
      craftId: craft.f5e,
      minimalDifficulty: difficulty.normal,
      startConditions: c => c.missionHasStarted,
      resetConditions: c => resetNextIf(
        c.missionHasStarted
      ).orNext(
        c.applyingBrakes
      ).andNext(
        c.applyingThrottle
      ).also(
        'hits 6',
        c.missionTimerAdvanced
      )
    })
  })

  const drakenChallengeConditions = triggerOverride => completedMissionInAnyMode({
    missionId: mission.GlacialSkies_01,
    craftId: craft.draken,
    minimalDifficulty: difficulty.ace,
    minimalScore: 13000,
    additionalConditions: c => c.completedMissionInLessThan('02:30'),
    triggerOverride
  })

  set.addAchievement({
    title: 'Draconian Measures',
    badge: b('AIRCRAFT_DRAKEN_CHALLENGE'),
    description: 'J35J Draken, ACE, Mission 01: complete the mission with SCORE of 13000 or more in less than 02:30',
    points: 10,
    conditions: drakenChallengeConditions()
  }).addLeaderboard({
    id: 83867,
    title: 'Draconian Measures',
    description: 'Fastest time to earn this achievement',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: timeTrialDebriefingConditions(drakenChallengeConditions(false))
  })

  set.addAchievement({
    title: 'Dam Break',
    badge: b('AIRCRAFT_F1_CHALLENGE'),
    description: 'F-1, HARD+, Mission 17: break into the dam with SCORE of 2000 or more in less than 01:35, then prevent the V2 launch in one or two dives into facility, without U-turns underground',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Avalon_17,
      craftId: craft.f1,
      minimalDifficulty: difficulty.hard,
      startConditions: c => andNext(
        c.inGame.entityGroup(0).index(0).scoreIsEqualOrGreaterThan(2000),
        c.inGame.missionPhaseTimer.wasLessThan(95),
        c.inGame.player.gotSysMessage.missionUpdate
      ),
      resetConditions: c => $(
        'hits 3',
        c.missionHasStarted,
        c.inGame.player.inAvalon.turnedAroundUnder,
        c.inGame.player.inAvalon.divedIn
      )
    })
  })

  const mig21ChallengeConditions = triggerOverride => completedMissionInAnyMode({
    missionId: mission.Mayhem_10,
    missionStyle: 2,
    triggerOverride,
    craftId: craft.mig21,
    minimalDifficulty: difficulty.ace,
    startConditions: c => c.missionHasStarted,
    resetConditions: c => orNext(
      c.inGame.player.shotMissile,
      c.inGame.player.shotSpecial
    )
  })

  set.addAchievement({
    title: 'Swiss Cheeser',
    badge: b('AIRCRAFT_MIG21_CHALLENGE'),
    description: 'MiG-21bis Fishbed, ACE, Mission 10K: complete the mission using GUN only',
    points: 25,
    conditions: mig21ChallengeConditions()
  }).addLeaderboard({
    id: 83868,
    title: 'Swiss Cheeser',
    badge: b('LB_AIRCRAFT_MIG21_CHALLENGE'),
    description: 'Fastest time to earn this achievement',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: timeTrialDebriefingConditions(mig21ChallengeConditions(false))
  })

  const f4ChallengeConditions = completedMissionInAnyMode({
    missionId: 0x1E,
    triggerOverride: false,
    minimalDifficulty: difficulty.ace,
    craftId: craft.f4,
    targetsToDestroy: {
      0x37: [0]
    }
  })
  set.addAchievement({
    title: 'Blast From the Past',
    badge: b('AIRCRAFT_F4_CHALLENGE'),
    description: 'F-4E Phantom II, ACE, Mission SP: complete the mission with MOBIUS shot down after dealing with Espada Team in 60 seconds',
    points: 25,
    conditions: f4ChallengeConditions
  }).addLeaderboard({
    id: 83869,
    title: 'Blast From the Past',
    description: 'Fastest time to earn this achievement',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: timeTrialDebriefingConditions(f4ChallengeConditions)
  })

  const mig29challengeConditions = triggerOverride => completedMissionInAnyMode({
    missionId: mission.Merlon_08,
    missionStyle: 2,
    craftId: craft.mig29,
    minimalDifficulty: difficulty.ace,
    minimalScore: 11000,
    additionalConditions: c => c.completedMissionInLessThan('08:00'),
    triggerOverride
  })
  set.addAchievement({
    title: 'Fairly Superior',
    badge: b('AIRCRAFT_MIG29_CHALLENGE'),
    description: 'MiG-29A Fulcrum, ACE, Mission 08C: complete the mission with SCORE of 11000 or more in less than 08:00',
    points: 10,
    conditions: mig29challengeConditions()
  }).addLeaderboard({
    id: 83870,
    title: 'Fairly Superior',
    description: 'Fastest time to earn this achievement',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: timeTrialDebriefingConditions(mig29challengeConditions(false))
  })

  set.addAchievement({
    title: 'Shark Waters',
    badge: b('AIRCRAFT_F20_CHALLENGE'),
    description: 'F-20A Tigershark, NORMAL+, Mission 04C: complete the mission with S rank, without giving the enemy a single chance to attack the fleet',
    points: 25,
    conditions: completedMissionInAnyMode({
      missionId: mission.Juggernaut_04,
      missionStyle: 2,
      craftId: craft.f20,
      minimalDifficulty: difficulty.normal,
      minimalRank: rank.S,

      startConditions: c => c.missionHasStarted,
      resetConditions: c => $(...[
        [4, 0],
        [4, 1],

        [5, 0],
        [5, 1],

        [6, 0],
        [6, 1],
        [6, 2],

        [7, 0],

        [8, 0],

        [9, 0]
      ].map(([group, index]) => andNext(
        c.missionTimerAdvanced,
        c.inGame.entityGroup(group).index(index).takenDamage
      )))
    })
  })

  set.addAchievement({
    title: 'Very Straightforward Mission',
    id: 377348,
    badge: b('AIRCRAFT_F16_CHALLENGE'),
    description: 'F-16C Fighting Falcon, NORMAL+, Mission 02: without ever going back south, complete the mission with SCORE of 5000 or more in less than 02:00',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Annex_02,
      craftId: craft.f16c,
      minimalDifficulty: difficulty.normal,
      minimalScore: 5000,
      startConditions: c => c.missionHasStarted,
      resetConditions: c => $(
        c.inGame.missionPhaseTimer.wentPast(120),
        andNext(
          c.inGame.missionPhaseTimer.wentPast(0.5),
          c.inGame.player.isGoingSouth
        )
      )
    })
  })

  const f18ChallengeConditions = triggerOverride => completedMissionInAnyMode({
    missionId: mission.Merlon_08,
    missionStyle: 0,
    craftId: craft.hornet,
    minimalDifficulty: difficulty.ace,
    minimalScore: 9000,
    triggerOverride,
    additionalConditions: c => c.completedMissionInLessThan('05:00')
  })
  set.addAchievement({
    title: 'Stinger',
    badge: b('AIRCRAFT_F18_CHALLENGE'),
    description: 'F/A-18C Hornet, ACE, Mission 08A: complete the mission with SCORE of 9000 or more in less than 05:00',
    points: 10,
    conditions: f18ChallengeConditions()
  }).addLeaderboard({
    id: 83871,
    title: 'Stinger',
    description: 'Fastest time to earn this achievement',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: timeTrialDebriefingConditions(f18ChallengeConditions(false))
  })

  set.addAchievement({
    title: 'BRRRRRRRT',
    badge: b('AIRCRAFT_A10_CHALLENGE_01'),
    description: 'A-10A Thunderbolt II, NORMAL+, Mission 13: complete the mission using GUN only',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Deceit_13,
      craftId: craft.a10,
      minimalDifficulty: difficulty.normal,
      startConditions: c => c.missionHasStarted,
      resetConditions: c => orNext(
        c.inGame.player.shotMissile,
        c.inGame.player.shotSpecial
      )
    })
  }).addAchievement({
    title: 'Hamburger Griller',
    badge: b('AIRCRAFT_A10_CHALLENGE_02'),
    description: 'A-10A Thunderbolt II, NORMAL+, Mission 15: destroy any target using FAEB, then complete the mission',
    points: 5,
    conditions: completedMissionInAnyMode({
      missionId: mission.AirFortress_15,
      craftId: craft.a10,
      weaponSelection: weapon.faeb,
      minimalDifficulty: difficulty.normal,
      startConditions: c => c.inGame.player.gotSpecialWeaponKill,
      resetConditions: c => c.missionHasStarted
    })
  })

  const mig31ChallengeConditions = triggerOverride => completedMissionInAnyMode({
    missionId: mission.GlacialSkies_01,
    craftId: craft.mig31,
    minimalDifficulty: difficulty.ace,
    triggerOverride,
    additionalConditions: c => c.completedMissionInLessThan('01:10')
  })
  set.addAchievement({
    title: 'The Final Hit is Out of Bounds',
    badge: b('AIRCRAFT_MIG31_CHALLENGE'),
    description: 'MiG-31 Foxhound, ACE, Mission 01: complete the mission in less than 01:10',
    points: 5,
    conditions: mig31ChallengeConditions()
  }).addLeaderboard({
    id: 83872,
    title: 'The Final Hit is Out of Bounds',
    description: 'Fastest time to earn this achievement',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: timeTrialDebriefingConditions(mig31ChallengeConditions(false))
  })

  set.addAchievement({
    title: 'Les Chevaliers du Ciel',
    badge: b('AIRCRAFT_MIRAGE_CHALLENGE'),
    description: 'Mirage 2000D, HARD+, Mission 10K: shoot down BERGTAUBE using GUN or Special Weapon, then complete the mission with SCORE of 14000 or more',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Mayhem_10,
      missionStyle: 2,
      craftId: craft.mirage,
      minimalDifficulty: difficulty.hard,
      minimalScore: 14000,

      targetsToDestroy: {
        0x20: [{
          id: 0, additionalConditions: c => orNext(
            c.inGame.player.gotGunKill,
            c.inGame.player.gotSpecialWeaponKill
          )
        }]
      }
    })
  })

  set.addAchievement({
    title: 'Interference',
    badge: b('AIRCRAFT_EA6B_CHALLENGE'),
    description: 'EA-6B Prowler, HARD+, Mission 04A: complete the mission with SCORE of 13000 or more in less than 04:00',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Juggernaut_04,
      missionStyle: 0,
      craftId: craft.prowlerRadio,
      minimalDifficulty: difficulty.hard,
      minimalScore: 13000,
      additionalConditions: c => c.completedMissionInLessThan('04:00')
    })
  })

  set.addAchievement({
    title: 'Flanker Crusade',
    badge: b('AIRCRAFT_SU27_CHALLENGE'),
    description: 'Su-27 Flanker, ACE, Mission 08B: complete the mission with SCORE of 12000 or more in less than 07:00',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Merlon_08,
      missionStyle: 1,
      craftId: craft.su27,
      minimalDifficulty: difficulty.ace,
      minimalScore: 12000,
      additionalConditions: c => c.completedMissionInLessThan('07:00')
    })
  })

  set.addAchievement({
    title: 'Yo, Buddy, Still Alive?',
    badge: b('AIRCRAFT_F15C_CHALLENGE'),
    description: 'F-15C Eagle, NORMAL+, SP New Game: complete the campaign in one sitting without failing, restarting or exiting the mission',
    points: 50,
    conditions: completedPermadeath({
      craftId: craft.f15c,
      minimalDifficulty: difficulty.normal
    })
  })

  set.addAchievement({
    title: 'eXtra feisty',
    badge: b('AIRCRAFT_X29A_CHALLENGE'),
    description: 'X-29A, EXPERT+, Mission 10S: complete the mission with SCORE of 28000 or more in less than 08:00',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Mayhem_10,
      missionStyle: 1,
      craftId: craft.xPlane,
      minimalDifficulty: difficulty.expert,
      minimalScore: 28000,
      additionalConditions: c => c.completedMissionInLessThan('08:00')
    })
  })

  set.addAchievement({
    title: 'Extremely Huge Fly Swatter',
    badge: b('AIRCRAFT_F14D_CHALLENGE'),
    description: 'F-14D Super Tomcat, EXPERT+, Mission 07: after all major targets are revealed, complete the mission by attacking aircraft only (Pixy is allowed to attack ground targets)',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Glatisant_07,
      craftId: craft.f14,
      minimalDifficulty: difficulty.expert,
      startConditions: c => $(
        c.inGame.modeIs(inGameMode.gameplayOrCutscene).withLast({ lvalue: { type: 'Delta' } }),
        c.inGame.entityGroup(0x5D).index(0).becameAlive
      ),
      resetConditions: c => andNext(
        c.inGame.entityGroup(0x5D).index(0).isAlive.map(x => x.lvalue.size === 'Bit1' ? x.with({ lvalue: { type: 'Delta' } }) : x),
        c.inGame.missionStatePointer,
        ['', 'Delta', '16bit', 0x6e, '>=', 'Value', '', 7],
      ).also(
        c.inGame.player.gotGroundKill,
        c.missionHasStarted
      )
    })
  })

  set.addAchievement({
    title: 'Old School Methods',
    badge: b('AIRCRAFT_GRIPEN_CHALLENGE'),
    description: 'Gripen C, HARD+, Mission 14A: without destroying yellow targets, complete the mission using GUN and RCL only with SCORE of 10000 or more in less than 04:00',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Overture_14,
      missionStyle: 0,
      craftId: craft.gripen,
      minimalDifficulty: difficulty.hard,
      minimalScore: 10000,
      additionalConditions: c => c.postDidntDestroyYellow,
      startConditions: c => c.missionHasStarted,
      resetConditions: c => $(
        c.inGame.player.shotMissile,
        andNext(
          c.inGame.specialWeaponIdIsNot(weapon.rcl),
          c.inGame.player.shotSpecial
        ),
        c.inGame.missionPhaseTimer.wentPast(240)
      )
    })
  })

  const f16xlChallengeConditions = triggerOverride => achievedDuringMission({
    missionId: mission.Demon_16,
    missionStyle: 2,
    craftId: craft.f16xl,
    minimalDifficulty: difficulty.ace,
    additionalConditions: c => {
      let targetConditions = $(c.inGame.player.gotEnoughAirKills(8))
      if (triggerOverride) {
        targetConditions = trigger(targetConditions)
      }

      return once(
        c.missionHasStarted
      ).also(targetConditions).resetIf(
        c.inGame.player.wingmanGotKill,
        c.inGame.missionPhaseTimer.wentPast(60 * 3),
        c.bailedIntoMainMenu
      )
    }
  })
  set.addAchievement({
    title: 'Witch Hunt',
    id: 377354,
    badge: b('AIRCRAFT_F16XL_CHALLENGE'),
    description: `F-16XL, ACE, Mission 16K: destroy the Wizard Team all by yourself in less than 03:00`,
    points: 10,
    conditions: f16xlChallengeConditions(true)
  }).addLeaderboard({
    id: 83873,
    title: 'Witch Hunt',
    description: 'Fastest time to earn this achievement',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: timeTrialDuringMissionConditions(f16xlChallengeConditions())
  })

  set.addAchievement({
    title: 'Natural Disaster',
    badge: b('AIRCRAFT_TORNADO_CHALLENGE'),
    description: `Tornado GR.4, EXPERT+, Mission 06: complete the mission with SCORE of 15500 or more in less than 05:00`,
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Diapason_06,
      craftId: craft.tornado,
      minimalDifficulty: difficulty.expert,
      minimalScore: 15500,
      additionalConditions: c => c.completedMissionInLessThan('05:00')
    })
  })

  set.addAchievement({
    title: 'Miracles',
    badge: b('AIRCRAFT_F2_CHALLENGE'),
    description: 'F-2A, EXPERT+, Mission 09: without destroying any jammers, complete the mission in less than 04:00',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Excalibur_09,
      craftId: craft.f2,
      minimalDifficulty: difficulty.expert,
      startConditions: c => c.missionHasStarted,
      resetConditions: c => $(
        c.inGame.entityGroup(49).index(0).gotDestroyed,
        c.inGame.entityGroup(50).index(0).gotDestroyed,
        c.inGame.entityGroup(51).index(0).gotDestroyed,
        c.inGame.entityGroup(52).index(0).gotDestroyed,

        c.inGame.missionPhaseTimer.wentPast(240)
      )
    })
  })

  /** @type {CodeForCallback} */
  const f15eAdditionalConditions = c => c.inGame.player.gotSpecialWeaponKill

  set.addAchievement({
    title: 'The Talons Go Deep',
    badge: b('AIRCRAFT_F15E_CHALLENGE'),
    description: 'F-15E Strike Eagle, EXPERT+, Mission 07: destroy CTRL TOWER, ACC, both RAMPARTs and both AA SITEs using GPB, then complete the mission in less than 10:00',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Glatisant_07,
      craftId: craft.f15e,
      minimalDifficulty: difficulty.expert,
      additionalConditions: c => c.completedMissionInLessThan('10:00'),

      targetsToDestroy: {
        0x5C: [{ id: 0, additionalConditions: f15eAdditionalConditions }],
        0x5D: [
          { id: 0, additionalConditions: f15eAdditionalConditions },
          { id: 1, additionalConditions: f15eAdditionalConditions },
        ],
        0x5E: [{ id: 0, additionalConditions: f15eAdditionalConditions }],
        0x5F: [{ id: 0, additionalConditions: f15eAdditionalConditions }],
      }
    })
  })

  set.addAchievement({
    title: 'Nightless Night',
    badge: b('AIRCRAFT_F117_CHALLENGE'),
    description: 'F-117A Nighthawk, EXPERT+, Mission 11: without destroying yellow targets, complete the mission with score of 15000 or more in less than 06:00',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Inefrno_11,
      craftId: craft.f117a,
      minimalDifficulty: difficulty.expert,
      minimalScore: 15000,
      additionalConditions: c => $(
        c.postDidntDestroyYellow,
        c.completedMissionInLessThan('06:00'),
      )
    })
  })

  const f35ChallengeConditions = triggerOverride => completedMissionInAnyMode({
    missionId: mission.Juggernaut_04,
    missionStyle: 1,
    craftId: craft.f35,
    minimalDifficulty: difficulty.ace,
    minimalScore: 20000,
    triggerOverride,

    startConditions: c => c.missionHasStarted,
    resetConditions: c => $(...[
      [0xC, 0],
      [0xD, 0],
      [0xE, 0],

      [0x0F, 0],
      [0x0F, 1],
      [0x0F, 2],
      [0x0F, 3],
      [0x0F, 4],
      [0x0F, 5],
    ].map(([group, index]) => andNext(
      c.inGame.missionPhaseTimer.wentPast(60 + 40),
      c.inGame.entityGroup(group).index(index).isAlive
    )))
  })
  set.addAchievement({
    title: 'Fleetbuster',
    id: 377347,
    badge: b('AIRCRAFT_F35C_CHALLENGE'),
    description: 'F-35C, ACE, Mission 04B: sink the entire TGT naval fleet in less than 01:40, then complete the mission with SCORE of 20000 or more',
    points: 5,
    conditions: f35ChallengeConditions()
  }).addLeaderboard({
    id: 83874,
    title: 'Fleetbuster',
    description: 'Fastest time to earn this achievement',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: timeTrialDebriefingConditions(f35ChallengeConditions(false))
  })

  set.addAchievement({
    title: 'EWAR',
    badge: b('AIRCRAFT_EA-18G_CHALLENGE'),
    description: 'EA-18G, EXPERT+, Mission 14C: complete the mission with SCORE of 14000 or more in less than 05:00',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Overture_14,
      missionStyle: 2,
      craftId: craft.hornetRadio,
      minimalDifficulty: difficulty.expert,
      minimalScore: 14000,
      additionalConditions: c => c.completedMissionInLessThan('05:00')
    })
  })

  set.addAchievement({
    title: 'Bombing Raffle',
    badge: b('AIRCRAFT_RAFALE_CHALLENGE'),
    description: 'Rafale M, EXPERT+, Mission 14B: while also using SOD, complete the mission with SCORE of 15000 or more in less than 04:30',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Overture_14,
      missionStyle: 1,
      weaponSelection: weapon.sod,
      craftId: craft.rafale,
      minimalDifficulty: difficulty.expert,
      minimalScore: 15000,
      additionalConditions: c => c.completedMissionInLessThan('04:30')
    })
  })

  set.addAchievement({
    title: 'Maelstrom',
    badge: b('AIRCRAFT_TYPHOON_CHALLENGE'),
    description: 'Typhoon, EXPERT+, Mission 12: complete the mission with SCORE of 22000 or more in less than 06:30',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Apocalypse_12,
      craftId: craft.typhoon,
      minimalDifficulty: difficulty.expert,
      minimalScore: 22000,
      additionalConditions: c => c.completedMissionInLessThan('06:30')
    })
  })

  set.addAchievement({
    title: `Cipher Wouldn't Do It`,
    badge: b('AIRCRAFT_SU32_CHALLENGE'),
    description: 'Su-32 Strike Flanker, EXPERT+, Mission 02: without destroying yellow targets, complete the mission with SCORE of 6000 or more in less than 03:00',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.Annex_02,
      craftId: craft.su32,
      minimalDifficulty: difficulty.expert,
      minimalScore: 6000,
      additionalConditions: c => $(
        c.postDidntDestroyYellow,
        c.completedMissionInLessThan('03:00')
      )
    })
  })

  set.addAchievement({
    title: `We're the Best!`,
    badge: b('AIRCRAFT_YF23A_CHALLENGE'),
    description: 'YF-23A Black Widow II, HARD+, Mission 05: complete the mission with SCORE of 8000 or more in less than 04:00',
    points: 10,
    conditions: completedMissionInAnyMode({
      missionId: mission.FlickerOfHope_05,
      craftId: craft.yfBlackWidow,
      minimalDifficulty: difficulty.hard,
      minimalScore: 8000,
      additionalConditions: c => c.completedMissionInLessThan('04:00')
    })
  })

  const f15smtdChallengeConditions = triggerOverride => achievedDuringMission({
    missionId: mission.Demon_16,
    missionStyle: 0,
    craftId: craft.f15smtd,
    minimalDifficulty: difficulty.ace,
    additionalConditions: c => {
      let targetConditions = $(c.inGame.player.gotEnoughAirKills(8))
      if (triggerOverride) {
        targetConditions = trigger(targetConditions)
      }

      return once(
        c.missionHasStarted
      ).also(targetConditions).resetIf(
        c.inGame.player.wingmanGotKill,
        c.inGame.missionPhaseTimer.wentPast(60 * 3 + 45),
        c.bailedIntoMainMenu
      )
    }
  })

  set.addAchievement({
    title: 'Sorcery',
    id: 377353,
    badge: b('AIRCRAFT_F15SMTD_CHALLENGE'),
    description: `F-15S/MTD, ACE, Mission 16M: destroy the Sorcerer Team all by yourself in less than 03:45 (kudos for flying with SPECIAL skin)`,
    points: 10,
    conditions: f15smtdChallengeConditions(true)
  }).addLeaderboard({
    id: 83875,
    title: 'Sorcery',
    description: 'Fastest time to earn this achievement',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: timeTrialDuringMissionConditions(f15smtdChallengeConditions())
  })

  const su47ChallengeConditions = triggerOverride => achievedDuringMission({
    missionId: mission.Demon_16,
    missionStyle: 1,
    craftId: craft.su47,
    minimalDifficulty: difficulty.ace,
    additionalConditions: c => {
      let targetConditions = $(c.inGame.player.gotEnoughAirKills(8))
      if (triggerOverride) {
        targetConditions = trigger(targetConditions)
      }

      return once(
        c.missionHasStarted
      ).also(targetConditions).resetIf(
        c.inGame.player.wingmanGotKill,
        c.inGame.missionPhaseTimer.wentPast(60 * 3 + 30),
        c.bailedIntoMainMenu
      )
    }
  })
  set.addAchievement({
    title: 'Unpredictable Patterns!',
    id: 377338,
    badge: b('AIRCRAFT_SU47_CHALLENGE'),
    description: `Su-47, ACE, Mission 16S: destroy the Gault Team all by yourself in less than 03:30 (kudos for flying with KNIGHT skin)`,
    points: 10,
    conditions: su47ChallengeConditions(true)
  }).addLeaderboard({
    id: 83876,
    title: 'Unpredictable Patterns!',
    description: 'Fastest time to earn this achievement',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: timeTrialDuringMissionConditions(su47ChallengeConditions())
  })

  set.addAchievement({
    title: 'B7R Terminator',
    badge: b('AIRCRAFT_SU37_CHALLENGE'),
    description: 'Su-37 Terminator, ACE: in one session, get S ranks for any variation of Mission 03, 10 and 16',
    points: 10,
    conditions: completedSetOfMissions({
      missionIds: [0x02, 0x09, 0x0F],
      missionsRequired: 3,
      craftId: craft.su37,
      minimalDifficulty: difficulty.ace,
      minimalRank: rank.S
    })
  })

  set.addAchievement({
    title: 'Three Strikes',
    badge: b('AIRCRAFT_F22_CHALLENGE'),
    description: 'F/A-22A Raptor, EXPERT+: in one session, get S ranks for three different missions of your choice, only one variation per mission',
    points: 10,
    conditions: completedSetOfMissions({
      missionsRequired: 3,
      craftId: craft.f22,
      minimalDifficulty: difficulty.expert,
      minimalRank: rank.S
    })
  })

  set.addAchievement({
    title: 'Dragon Slayer',
    badge: b('AIRCRAFT_X02_CHALLENGE'),
    description: 'X-02 Wyvern, ACE: in one session and without using special weapons, get S ranks for any variation of mission 09, 15, 16, 17 and 18',
    points: 10,
    conditions: completedSetOfMissions({
      missionIds: [0x08, 0x0E, 0x0F, 0x10, 0x11],
      missionsRequired: 5,
      craftId: craft.x02,
      minimalDifficulty: difficulty.ace,
      minimalRank: rank.S,
      pauseLockWhen: c => c.inGame.player.shotSpecial
    })
  })

  set.addAchievement({
    title: 'Swordsmanship',
    badge: b('AIRCRAFT_MORGAN_CHALLENGE_01'),
    description: `ADFX-01 Morgan, NORMAL+, Mission 17: destroy one of the V2 control devices and it's locks with one swift slash of TLS`,
    points: 5,
    conditions: achievedDuringMission({
      missionId: mission.Avalon_17,
      minimalDifficulty: difficulty.normal,
      craftId: craft.morgan,
      weaponSelection: weapon.tls,

      additionalConditions: c => $(
        ...[
          [0x42, 0],
          [0x42, 1],
          [0x42, 2],
          [0x42, 3],
          [0x44, 0],
          [0x44, 1],
          [0x44, 2],
          [0x44, 3],
          [0x46, 0],
          [0x46, 1],
          [0x46, 2],
          [0x46, 3],
        ].map(([group, index]) => addHits(
          andNext(
            c.inGame.player.specialCooldown(0).inProgress,
            c.inGame.entityGroup(group).index(index).gotDestroyed
          )
        )),
        '0=1.4.',

        orNext(
          c.inGame.entityGroup(0x41).index(0).gotDestroyed,
          c.inGame.entityGroup(0x43).index(0).gotDestroyed,
          c.inGame.entityGroup(0x45).index(0).gotDestroyed
        )
      ).resetIf(
        c.inGame.player.specialCooldown(0).isOver,
        c.bailedIntoMainMenu
      )
    })
  }).addAchievement({
    title: 'POPSICLE',
    description: `HEY POPS, DOES THIS NUKE WORK? SURE DOES, YOU'RE ABOUT TO POPCORN INTO THE GROUND, WOOF!`,
    points: 1,
    conditions: achievedDuringMission({
      missionId: mission.Mayhem_10,
      craftId: craft.morgan,
      weaponSelection: weapon.mpbm,

      additionalConditions: c => andNext(
        c.inGame.player.gotSpecialWeaponKill,
        c.inGame.entityGroup(0x19).index(0).gotDestroyed
      )
    })
  })

  const falkenChallengeConditions = triggerOverride => completedMissionInAnyMode({
    missionId: mission.Mayhem_10,
    missionStyle: 0,
    craftId: craft.falken,
    weaponSelection: weapon.tls,
    minimalDifficulty: difficulty.ace,
    triggerOverride,

    startConditions: c => c.missionHasStarted,
    resetConditions: c => orNext(
      c.inGame.player.gotGunKill,
      c.inGame.player.gotMissileKill
    )
  })
  set.addAchievement({
    title: 'Death Rays',
    badge: b('AIRCRAFT_FALKEN_CHALLENGE'),
    description: 'ADF-01 FALKEN, ACE, Mission 10M: complete the mission using TLS only',
    points: 10,
    conditions: falkenChallengeConditions()
  }).addLeaderboard({
    id: 83877,
    title: 'Death Rays',
    description: 'Fastest time to earn this achievement',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: timeTrialDebriefingConditions(falkenChallengeConditions(false))
  })

}

// MISC
{
  set.addAchievement({
    title: 'Immersive Canopy',
    description: 'Complete any mission using Cockpit view only',
    points: 1,
    conditions: (() => {
      const [alt1, alt2] = [code.pal, code.ntsc].map(c => {
        const resetNextOnMissionRestart = resetNextIf(
          ['', 'Delta', '32bit', c.address.missionTimer, '=', 'Value', '', 0]
        )

        return $(
          c.regionCheckPause,
          pauseIf(c.isNotInGame),
          trigger(c.debriefingStarted),

          resetNextOnMissionRestart,
          andNext(
            'once',
            c.inGame.modeIs(inGameMode.gameplayOrCutscene),
            c.inGame.player.usingCockpitCamera
          ),

          resetNextOnMissionRestart,
          pauseIf(
            'once',
            andNext(
              $('hits 90', c.inGame.missionPhaseTimer.advanced),
              c.inGame.modeIs(inGameMode.gameplayOrCutscene),
              c.inGame.player.notUsingCockpitCamera
            )
          )
        )
      })

      return {
        core: alwaysTrue,
        alt1,
        alt2
      }
    })(),
  })

  set.addAchievement({
    title: 'Na-Mu-Ko',
    badge: b('ACE_PACMAN_765'),
    description: `One of your aircraft have accumulated 765 kills and acquired the secret cheese wheel in its cockpit`,
    points: 3,
    conditions: (() => {
      const [alt1, alt2] = [code.pal, code.ntsc].map(c => {
        return $(
          c.regionCheckPause,
          ...Array.from({ length: 36 }, (_, i) => {
            const offset = c.address.tgtDestroyedTable + i * 4
            return andNext(
              c.wasInDebriefing,
              ['', 'Delta', '32bit', offset, '<', 'Value', '', 765],
              ['AddHits', 'Mem', '32bit', offset, '>=', 'Value', '', 765]
            )
          }),
          '0=1.1.'
        )
      })

      return {
        core: alwaysTrue,
        alt1,
        alt2
      }
    })()
  })
}

// Campaign / Free Mission (DIFFICULTY) | 📍 Mission | ✈️ Craft | SCORE: %d
export const rich = (() => {

  const regions = ['pal', 'ntsc']
  const missionFree = {
    0x00: 'Glacial Skies',
    0x01: 'Annex',
    0x02: 'The Round Table (vs. Rot)',
    0x03: 'The Round Table (vs. Grun)',
    0x04: 'The Round Table (vs. Indigo)',
    0x05: 'Juggernaut (Round Hammer)',
    0x06: 'Juggernaut (Gelnikos)',
    0x07: 'Juggernaut (Costner)',
    0x08: 'Flicker of Hope',
    0x09: 'Diapason',
    0x0A: 'Bastion',
    0x0B: 'Merlon (Alpha)',
    0x0C: 'Merlon (Beta)',
    0x0D: 'Merlon (Theta)',
    0x0E: 'Sword of Annihilation',
    0x0F: 'Mayhem (vs. Schwarze)',
    0x10: 'Mayhem (vs. Schnee)',
    0x11: 'Mayhem (vs. Silber)',
    0x12: 'The Inferno',
    0x13: 'Stage of Apocalypse',
    0x14: 'Lying in Deceit',
    0x15: 'The Final Overture (Mars)',
    0x16: 'The Final Overture (Mercury)',
    0x17: 'The Final Overture (Jupiter)',
    0x18: 'The Talon of Ruin',
    0x19: 'The Demon of the Round Table (vs. Sorcerer)',
    0x1A: 'The Demon of the Round Table (vs. Gault)',
    0x1B: 'The Demon of the Round Table (vs. Wizard)',
    0x1C: 'The Valley of Kings',
    0x1D: 'Zero',
    0x1E: 'Gauntlet'
  }

  return RichPresence({
    lookupDefaultParameters: {
      compressRanges: false,
      keyFormat: 'hex'
    },
    lookup: {
      Difficulty: {
        values: {
          0: 'VERY EASY',
          1: 'EASY',
          2: 'NORMAL',
          3: 'HARD',
          4: 'EXPERT',
          5: 'ACE',
        }
      },
      MissionC: {
        values: Object.fromEntries(
          Object.entries(missionMeta).filter(x => !x[1].isNotCampaign).map(([key, value]) => [key, value.title])
        )
      },
      MissionF: {
        values: missionFree
      },
      MissionFF: {
        values: Object.fromEntries(
          Object.entries(missionFree).map(
            ([key, value]) => [Number(key) + 0x4E, value.replace(/ \(.*\)$/, '')]
          )
        )
      },
      Craft: {
        values: {
          0x00: 'J35J Draken',
          0x01: 'Gripen C',
          0x02: 'Typhoon',
          0x03: 'Tornado GR.4',
          0x04: 'F-4E Phantom II',
          0x05: 'F-15C Eagle',
          0x06: 'F-15E Strike Eagle',
          0x07: 'F-15S/MTD',
          0x08: 'F/A-18C Hornet',
          0x09: 'EA-18G',
          0x0A: 'F-16C Fighting Falcon',
          0x0B: 'F-16XL',
          0x0C: 'F-117A Nighthawk',
          0x0D: 'F/A-22A Raptor',
          0x0E: 'F-35C',
          0x0F: 'F-5E Tiger II',
          0x10: 'F-20A Tigershark',
          0x11: 'X-29A',
          0x12: 'F-14D Super Tomcat',
          0x13: 'YF-23A Black Widow II',
          0x14: 'EA-6B Prowler',
          0x15: 'A-10A Thunderbolt II',
          0x16: 'Mirage 2000D',
          0x17: 'Rafale M',
          0x18: 'Su-27 Flanker',
          0x19: 'Su-32 Strike Flanker',
          0x1A: 'Su-37 Terminator',
          0x1B: 'Su-47 Berkut',
          0x1C: 'MiG-21bis Fishbed',
          0x1D: 'MiG-29A Fulcrum',
          0x1E: 'MiG-31 Foxhound',
          0x1F: 'F-1',
          0x20: 'F-2A',
          0x21: 'X-02 Wyvern',
          0x22: 'ADF-01 FALKEN',
          0x23: 'ADFX-01 Morgan',
        }
      }
    },

    displays: ({ lookup }) =>
      regions.flatMap(region => {
        const c = codeFor(region)
        const atMissionC = lookup.MissionC.at(`0xX` + c.address.campaignMissionId.toString(16).toUpperCase())
        const atMissionF = lookup.MissionF.at(`0xX` + c.address.freeMissionId.toString(16).toUpperCase())
        const atMissionFF = lookup.MissionFF.at(`0xX` + c.address.freeMissionId.toString(16).toUpperCase())
        const atCraftC = lookup.Craft.at(`0xX` + c.address.campaignCraftId.toString(16).toUpperCase())
        const atCraftF = lookup.Craft.at(`0xX` + c.address.freeCraftId.toString(16).toUpperCase())
        const atDifficultyC = lookup.Difficulty.at(`0xX` + c.address.campaignMissionDifficulty.toString(16).toUpperCase())
        const atDifficultyF = lookup.Difficulty.at(`0xX` + c.address.freeMissionDifficulty.toString(16).toUpperCase())

        return [
          [
            $(
              c.regionCheck,
              c.missionTypeIsFree,
              c.isInFreeFlight,
              c.inBriefing
            ),
            `Free Flight | 📍 ${atMissionFF} | Preparations`
          ],

          [
            $(
              c.regionCheck,
              c.missionTypeIsFree,
              c.isInFreeFlight,
              c.inMission
            ),
            `Free Flight | 📍 ${atMissionFF} | ✈️ ${atCraftF}`
          ],

          [

            $(
              c.regionCheck,
              c.missionTypeIsCampaign,
              orNext(
                c.inMission,
                c.inDebriefing
              )
            ),
            `Campaign (${atDifficultyC}) | 📍 ${atMissionC} | ✈️ ${atCraftC}`
          ],

          [
            $(
              c.regionCheck,
              c.missionTypeIsCampaign,
              c.inBriefing
            ),
            `Campaign (${atDifficultyC}) | 📍 ${atMissionC} | Briefing and Preparations`
          ],

          [
            $(
              c.regionCheck,
              c.missionTypeIsFree,
              orNext(
                c.inMission,
                c.inDebriefing
              )
            ),
            `Free Mission (${atDifficultyF}) | 📍 ${atMissionF} | ✈️ ${atCraftF}`
          ],

          [
            $(
              c.regionCheck,
              c.missionTypeIsFree,
              c.inBriefing
            ),
            `Free Mission (${atDifficultyF}) | 📍 ${atMissionF} | Briefing and Preparations`
          ]
        ]
      }).concat('Playing Ace Combat Zero')

  })
})()

export default set