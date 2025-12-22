import { AchievementSet, define as $ } from '@cruncheevos/core'
const set = new AchievementSet({ gameId: 11342, title: 'Tomb Raider' })

set.addAchievement({
  title: 'Battle in the Ancient Courtyard',
  description: `Complete "Caves"`,
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 1],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131351',
  id: 120338,
})

set.addAchievement({
  title: 'A Trapped Hallway',
  description: `Complete "City of Vilcabamba"`,
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 2],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131352',
  id: 120339,
})

set.addAchievement({
  title: 'Derelict Mechanism',
  description: `Complete "Lost Valley"`,
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131353',
  id: 120340,
})

set.addAchievement({
  title: 'Evading Danger',
  description: `Complete "Tomb of Qualopec"`,
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Prior', '8bit', 0x87580, '=', 'Value', '', 4],
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 16],
      ['', 'Mem', '16bit', 0x87588, '=', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131354',
  id: 120341,
})

set.addAchievement({
  title: 'Architecture of the Past',
  description: `Complete "St. Francis' Folly"`,
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 5],
      ['', 'Delta', '8bit', 0x87588, '=', 'Value', '', 0],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131355',
  id: 120342,
})

set.addAchievement({
  title: 'Ruins of a Lost Civilization',
  description: `Complete "Colosseum"`,
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 6],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131356',
  id: 120343,
})

set.addAchievement({
  title: 'All That Glitters...',
  description: `Complete "Palace Midas"`,
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 7],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131357',
  id: 120344,
})

set.addAchievement({
  title: 'Reservoir Explorers',
  description: `Complete "The Cistern"`,
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 8],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131358',
  id: 120345,
})

set.addAchievement({
  title: 'Another Deserted Place',
  description: `Complete "Tomb of Tihocan"`,
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Prior', '8bit', 0x87580, '=', 'Value', '', 9],
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 17],
      ['', 'Mem', '16bit', 0x87588, '=', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131359',
  id: 120346,
})

set.addAchievement({
  title: 'Metropolis of Yesterday',
  description: `Complete "City of Khamoon"`,
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 10],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131360',
  id: 120347,
})

set.addAchievement({
  title: 'An Abandoned Chamber',
  description: `Complete "Obelisk of Khamoon"`,
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 11],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131361',
  id: 120348,
})

set.addAchievement({
  title: 'Remnants of Giza',
  description: `Complete "Sanctuary of the Scion"`,
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 12],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131362',
  id: 120349,
})

set.addAchievement({
  title: 'Under the Ground Deals',
  description: `Complete "Natla's Mines"`,
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 13],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131363',
  id: 120350,
})

set.addAchievement({
  title: 'Sunken Costs',
  description: `Complete "Atlantis"`,
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Prior', '8bit', 0x87580, '=', 'Value', '', 14],
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 19],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131364',
  id: 120351,
})

set.addAchievement({
  title: 'Landmark Adventurer',
  description: `Complete "The Great Pyramid" and beat the game`,
  points: 25,
  type: 'win_condition',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131365',
  id: 120352,
})

set.addAchievement({
  title: 'Faithful Alloys',
  description: `Obtain the Gold Idol and the Silver Key in "City of Vilcabamba"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 2],
      ['', 'Mem', 'Lower4', 0x17fea0, '=', 'Value', '', 6],
      ['', 'Mem', 'Lower4', 0x17fe58, '=', 'Value', '', 6],
      ['OrNext', 'Delta', 'Lower4', 0x17fea0, '=', 'Value', '', 0],
      ['', 'Delta', 'Lower4', 0x17fe58, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130153',
  id: 120353,
})

set.addAchievement({
  title: 'The Gears Are Turning',
  description: `Collect all 3 of the Machine Cogs in "Lost Valley"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
      ['', 'Mem', 'Lower4', 0x195114, '=', 'Value', '', 4],
      ['', 'Mem', 'Lower4', 0x19530c, '=', 'Value', '', 4],
      ['', 'Mem', 'Lower4', 0x1956b4, '=', 'Value', '', 4],
      ['OrNext', 'Delta', 'Lower4', 0x195114, '=', 'Value', '', 0],
      ['OrNext', 'Delta', 'Lower4', 0x19530c, '=', 'Value', '', 0],
      ['', 'Delta', 'Lower4', 0x1956b4, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130237',
  id: 120354,
})

set.addAchievement({
  title: 'Mummy Dearest',
  description: `Obtain the first Scion piece in "Tomb of Qualopec"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 4],
      ['', 'Delta', 'Lower4', 0x176570, '=', 'Value', '', 0],
      ['', 'Mem', 'Lower4', 0x176570, '=', 'Value', '', 3],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130243',
  id: 120355,
})

set.addAchievement({
  title: 'Tomb Raider Mythologies',
  description: `Collect all 4 of the keys in "St. Francis' Folly"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 5],
      ['AddSource', 'Mem', 'Bit2', 0x187fcc],
      ['AddSource', 'Mem', 'Bit2', 0x187ef4],
      ['AddSource', 'Mem', 'Bit2', 0x1879e4],
      ['Measured', 'Mem', 'Bit2', 0x187834, '=', 'Value', '', 4],
      ['AddSource', 'Delta', 'Bit2', 0x187fcc],
      ['AddSource', 'Delta', 'Bit2', 0x187ef4],
      ['AddSource', 'Delta', 'Bit2', 0x1879e4],
      ['', 'Delta', 'Bit2', 0x187834, '=', 'Value', '', 3],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130248',
  id: 120356,
})

set.addAchievement({
  title: 'Backstage Pass',
  description: `Obtain the Rusty Key in "Colosseum"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 6],
      ['', 'Delta', 'Lower4', 0x18e9ac, '=', 'Value', '', 0],
      ['', 'Mem', 'Lower4', 0x18e9ac, '=', 'Value', '', 6],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130257',
  id: 120357,
})

set.addAchievement({
  title: 'Lead Astray',
  description: `Collect all 3 Lead Bars in "Palace Midas"`,
  points: 3,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 7],
      ['', 'Mem', 'Lower4', 0x19de8c, '=', 'Value', '', 6],
      ['', 'Mem', 'Lower4', 0x19d97c, '=', 'Value', '', 6],
      ['', 'Mem', 'Lower4', 0x19e5dc, '=', 'Value', '', 6],
      ['OrNext', 'Delta', 'Lower4', 0x19de8c, '=', 'Value', '', 0],
      ['OrNext', 'Delta', 'Lower4', 0x19d97c, '=', 'Value', '', 0],
      ['', 'Delta', 'Lower4', 0x19e5dc, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130278',
  id: 120358,
})

set.addAchievement({
  title: 'Every Time We Touch...',
  description: `Have all 3 Gold Bars at once in "Palace Midas"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 7],
      ['', 'Mem', '16bit', 0x88710, '=', 'Value', '', 33476],
      ['', 'Mem', '16bit', 0x886e0, '=', 'Value', '', 3],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130279',
  id: 120359,
})

set.addAchievement({
  title: 'Mistress of the Elements',
  description: `Collect all 5 keys in "The Cistern"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 8],
      ['AddSource', 'Mem', 'Bit2', 0x1a9f50],
      ['AddSource', 'Mem', 'Bit2', 0x1aa580],
      ['AddSource', 'Mem', 'Bit2', 0x1ab4b0],
      ['AddSource', 'Mem', 'Bit1', 0x1ab5d0],
      ['Measured', 'Mem', 'Bit1', 0x1ab660, '=', 'Value', '', 5],
      ['AddSource', 'Delta', 'Bit2', 0x1a9f50],
      ['AddSource', 'Delta', 'Bit2', 0x1aa580],
      ['AddSource', 'Delta', 'Bit2', 0x1ab4b0],
      ['AddSource', 'Delta', 'Bit1', 0x1ab5d0],
      ['', 'Delta', 'Bit1', 0x1ab660, '=', 'Value', '', 4],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130281',
  id: 120360,
})

set.addAchievement({
  title: 'Archaeology Defies English',
  description: `Collect both of the Saphire Keys in "City of Khamoon"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 10],
      ['', 'Mem', 'Lower4', 0x1824c0, '=', 'Value', '', 6],
      ['', 'Mem', 'Lower4', 0x182988, '=', 'Value', '', 6],
      ['OrNext', 'Delta', 'Lower4', 0x1824c0, '=', 'Value', '', 0],
      ['', 'Delta', 'Lower4', 0x182988, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130337',
  id: 120361,
})

set.addAchievement({
  title: `Dupont's New Tomb`,
  description: `Obtain the second Scion piece from Pierre in "Tomb of Tihocan"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 9],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1],
      ['', 'Delta', '8bit', 0x886d8, '=', 'Value', '', 1],
      ['', 'Mem', '8bit', 0x886d8, '=', 'Value', '', 2],
      ['', 'Delta', '8bit', 0x886e2, '=', 'Value', '', 1],
      ['', 'Mem', '8bit', 0x886e2, '=', 'Value', '', 2],
      ['', 'Delta', '16bit', 0x88710, '=', 'Value', '', 33412],
      ['', 'Mem', '16bit', 0x88710, '=', 'Value', '', 33732]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130311',
  id: 120362,
})

set.addAchievement({
  title: 'Healing Gaze',
  description: `Obtain the Eye of Horus in "Obelisk of Khamoon"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 11],
      ['', 'Delta', 'Lower4', 0x1892c0, '=', 'Value', '', 0],
      ['', 'Mem', 'Lower4', 0x1892c0, '=', 'Value', '', 4],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130351',
  id: 120363,
})

set.addAchievement({
  title: 'Key of Life',
  description: `Obtain the Ankh in "Obelisk of Khamoon"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 11],
      ['', 'Delta', 'Lower4', 0x189398, '=', 'Value', '', 0],
      ['', 'Mem', 'Lower4', 0x189398, '=', 'Value', '', 4],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130352',
  id: 120364,
})

set.addAchievement({
  title: 'Mark of the Dead',
  description: `Obtain the Seal of Anubis in "Obelisk of Khamoon"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 11],
      ['', 'Delta', 'Lower4', 0x189350, '=', 'Value', '', 0],
      ['', 'Mem', 'Lower4', 0x189350, '=', 'Value', '', 4],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130396',
  id: 120365,
})

set.addAchievement({
  title: 'Solar Idol',
  description: `Obtain the Scarab in "Obelisk of Khamoon"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 11],
      ['', 'Delta', 'Lower4', 0x189308, '=', 'Value', '', 0],
      ['', 'Mem', 'Lower4', 0x189308, '=', 'Value', '', 4],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130397',
  id: 120366,
})

set.addAchievement({
  title: 'Biliteral Signage',
  description: `Collect both of the Ankhs in "Sanctuary of the Scion"`,
  points: 3,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 12],
      ['', 'Mem', 'Lower4', 0x18ea18, '=', 'Value', '', 6],
      ['', 'Mem', 'Lower4', 0x18e6b8, '=', 'Value', '', 6],
      ['OrNext', 'Delta', 'Lower4', 0x18e6b8, '=', 'Value', '', 0],
      ['', 'Delta', 'Lower4', 0x18ea18, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130440',
  id: 120367,
})

set.addAchievement({
  title: 'Unlocking Greatness',
  description: `Obtain the Pyramid Key in "Natla's Mines"`,
  points: 3,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 13],
      ['', 'Delta', 'Lower4', 0x19eba8, '=', 'Value', '', 0],
      ['', 'Mem', 'Lower4', 0x19eba8, '=', 'Value', '', 6],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130498',
  id: 120368,
})

set.addAchievement({
  title: 'Now, Drop It!',
  description: `Have all 3 Fuses at once in "Natla's Mines"`,
  points: 3,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 13],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1],
      ['', 'Delta', '16bit', 0x886e0, '=', 'Value', '', 2],
      ['', 'Mem', '16bit', 0x886e0, '=', 'Value', '', 3]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130461',
  id: 120369,
})

set.addAchievement({
  title: 'Henchman No More',
  description: `Kill the annoying Pierre Dupont once and for all in "Tomb of Tihocan"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 9],
      ['OrNext', 'Mem', '16bit', 0x1a155a, '=', 'Value', '', 65535],
      ['OrNext', 'Mem', '16bit', 0x1a155a, '=', 'Value', '', 65534],
      ['OrNext', 'Mem', '16bit', 0x1a155a, '=', 'Value', '', 65533],
      ['', 'Mem', '16bit', 0x1a155a, '=', 'Value', '', 49152],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130312',
  id: 120370,
})

set.addAchievement({
  title: 'Scion Savior',
  description: `Kill Larson in "Sanctuary of the Scion"`,
  points: 3,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 12],
      ['OrNext', 'Mem', '16bit', 0x18f026, '=', 'Value', '', 65535],
      ['OrNext', 'Mem', '16bit', 0x18f026, '=', 'Value', '', 65534],
      ['OrNext', 'Mem', '16bit', 0x18f026, '=', 'Value', '', 65533],
      ['', 'Mem', '16bit', 0x18f026, '=', 'Value', '', 49152],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130452',
  id: 120371,
})

set.addAchievement({
  title: 'Shootout at Low Noon',
  description: `Kill the first of Natla's men in "Natla's Mines"`,
  points: 3,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 13],
      ['OrNext', 'Mem', '16bit', 0x19dc56, '=', 'Value', '', 65535],
      ['OrNext', 'Mem', '16bit', 0x19dc56, '=', 'Value', '', 65534],
      ['OrNext', 'Mem', '16bit', 0x19dc56, '=', 'Value', '', 65533],
      ['', 'Mem', '16bit', 0x19dc56, '=', 'Value', '', 49152],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130476',
  id: 120372,
})

set.addAchievement({
  title: 'Shredded Dreams',
  description: `Kill the second of Natla's men in "Natla's Mines"`,
  points: 3,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 13],
      ['OrNext', 'Mem', '16bit', 0x19e59e, '=', 'Value', '', 65535],
      ['OrNext', 'Mem', '16bit', 0x19e59e, '=', 'Value', '', 65534],
      ['OrNext', 'Mem', '16bit', 0x19e59e, '=', 'Value', '', 65533],
      ['', 'Mem', '16bit', 0x19e59e, '=', 'Value', '', 49152],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130482',
  id: 120373,
})

set.addAchievement({
  title: 'The Last Blast',
  description: `Kill the third of Natla's men in "Natla's Mines"`,
  points: 3,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 13],
      ['OrNext', 'Mem', '16bit', 0x19eca6, '=', 'Value', '', 65535],
      ['OrNext', 'Mem', '16bit', 0x19eca6, '=', 'Value', '', 65534],
      ['OrNext', 'Mem', '16bit', 0x19eca6, '=', 'Value', '', 65533],
      ['', 'Mem', '16bit', 0x19eca6, '=', 'Value', '', 49152],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130496',
  id: 120374,
})

set.addAchievement({
  title: 'All Crawls of Death',
  description: `Kill the legless mutant in "The Great Pyramid"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      ['OrNext', 'Mem', '16bit', 0x1a3b9e, '=', 'Value', '', 65535],
      ['OrNext', 'Mem', '16bit', 0x1a3b9e, '=', 'Value', '', 65534],
      ['OrNext', 'Mem', '16bit', 0x1a3b9e, '=', 'Value', '', 65533],
      ['', 'Mem', '16bit', 0x1a3b9e, '=', 'Value', '', 49152],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130681',
  id: 120375,
})

set.addAchievement({
  title: `Money Isn't Power`,
  description: `Kill Jacqueline Natla in "The Great Pyramid"`,
  points: 10,
  conditions: {
    core: $(
      ['', 'Mem', '16bit', 0x87580, '=', 'Value', '', 15],
      ['OrNext', 'Mem', '16bit', 0x1a33be, '=', 'Value', '', 65535],
      ['OrNext', 'Mem', '16bit', 0x1a33be, '=', 'Value', '', 65534],
      ['OrNext', 'Mem', '16bit', 0x1a33be, '=', 'Value', '', 65533],
      ['', 'Mem', '16bit', 0x1a33be, '=', 'Value', '', 49152],
      ['', 'Delta', '16bit', 0x1a33be, '<', 'Value', '', 4],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130932',
  id: 120376,
})

set.addAchievement({
  title: `I'm One Clever Girl!`,
  description: `Kill the T-Rex in "Lost Valley" without taking damage`,
  points: 3,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 1],
      ['AndNext', 'Mem', '16bit', 0x19572c, '!=', 'Value', '', 0],
      ['', 'Mem', '16bit', 0x195722, '=', 'Value', '', 100, 1],
      ['OrNext', 'Mem', '16bit', 0x195722, '=', 'Value', '', 65535],
      ['OrNext', 'Mem', '16bit', 0x195722, '=', 'Value', '', 65534],
      ['OrNext', 'Mem', '16bit', 0x195722, '=', 'Value', '', 65533],
      ['Trigger', 'Mem', '16bit', 0x195722, '=', 'Value', '', 49152],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 1],
      ['AndNext', 'Mem', '16bit', 0x19572c, '!=', 'Value', '', 0],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '>',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(
      ['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20],
      ['ResetIf', 'Mem', '16bit', 0x19572c, '=', 'Value', '', 0]
    ),
  },
  badge: '130238',
  id: 120377,
})

set.addAchievement({
  title: 'Buckshots for Boneheads',
  description: `Obtain the shotgun in "Lost Valley"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
      ['', 'Delta', 'Lower4', 0x194b2c, '=', 'Value', '', 0],
      ['', 'Mem', 'Lower4', 0x194b2c, '=', 'Value', '', 6],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130254',
  id: 120378,
})

set.addAchievement({
  title: 'Artillery for Athletes',
  description: `Obtain the magnums in "Colosseum"`,
  points: 2,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 6],
      ['', 'Delta', 'Lower4', 0x18e7b4, '=', 'Value', '', 0],
      ['', 'Mem', 'Lower4', 0x18e7b4, '=', 'Value', '', 6],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130265',
  id: 120379,
})

set.addAchievement({
  title: 'Bullet-Riddled Sphinx',
  description: `Obtain the uzis in "Sanctuary of the Scion"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 12],
      ['', 'Delta', 'Lower4', 0x18ded8, '=', 'Value', '', 0],
      ['', 'Mem', 'Lower4', 0x18ded8, '=', 'Value', '', 4],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130434',
  id: 120380,
})

set.addAchievement({
  title: 'Extreme Raider of the Caves',
  description: `Complete "Caves" with 14 kills, 7 pickups, all 3 secrets, using only the pistols, and without saving or using any Medi Packs`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 1],
      ['MeasuredIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 1],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['AddSource', 'Mem', 'BitCount', 0x92800],
      ['AddSource', 'Mem', '8bit', 0x927fc],
      ['Measured', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 24],
      ['PauseIf', 'Mem', '16bit', 0x87584, '=', 'Value', '', 21],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 1],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 1],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 1],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 1],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['', 'Mem', '8bit', 0x927fc, '>=', 'Value', '', 14],
      ['', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 7],
      ['', 'Mem', '8bit', 0x92800, '>=', 'Value', '', 3]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['ResetIf', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
  },
  badge: '131380',
  id: 120450,
})

set.addAchievement({
  title: 'Extreme Raider of the City of Vilcabamba',
  description: `Complete "City of Vilcabamba" with 29 kills, 13 pickups, all 3 secrets, using only the pistols, and without saving or using any Medi Packs`,
  points: 10,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 2],
      ['MeasuredIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 2],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['AddSource', 'Mem', 'BitCount', 0x92800],
      ['AddSource', 'Mem', '8bit', 0x927fc],
      ['Measured', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 45],
      ['PauseIf', 'Mem', '16bit', 0x87584, '=', 'Value', '', 21],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 2],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 2],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 2],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 2],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['', 'Mem', '8bit', 0x927fc, '>=', 'Value', '', 29],
      ['', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 13],
      ['', 'Mem', '8bit', 0x92800, '>=', 'Value', '', 3]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['ResetIf', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
  },
  badge: '131381',
  id: 120451,
})

set.addAchievement({
  title: 'Extreme Raider of the Lost Valley',
  description: `Complete "Lost Valley" with 13 kills, 16 pickups, all 5 secrets, using only the pistols, and without saving or using any Medi Packs`,
  points: 10,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 3],
      ['MeasuredIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['AddSource', 'Mem', 'BitCount', 0x92800],
      ['AddSource', 'Mem', '8bit', 0x927fc],
      ['Measured', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 34],
      ['PauseIf', 'Mem', '16bit', 0x87584, '=', 'Value', '', 21],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['', 'Mem', '8bit', 0x927fc, '>=', 'Value', '', 13],
      ['', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 16],
      ['', 'Mem', '8bit', 0x92800, '>=', 'Value', '', 5]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['ResetIf', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
  },
  badge: '131382',
  id: 120452,
})

set.addAchievement({
  title: 'Extreme Raider of the Tomb of Qualopec',
  description: `Complete "Tomb of Qualopec" with 8 kills, 8 pickups, all 3 secrets, using only the pistols, and without saving or using any Medi Packs`,
  points: 10,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 16],
      ['MeasuredIf', 'Delta', '8bit', 0x87580, '=', 'Value', '', 4],
      ['AddSource', 'Mem', 'BitCount', 0x92800],
      ['AddSource', 'Mem', '8bit', 0x927fc],
      ['Measured', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 19],
      ['PauseIf', 'Mem', '16bit', 0x87584, '=', 'Value', '', 21],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 4],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 4],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 4],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 4],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['', 'Mem', '8bit', 0x927fc, '>=', 'Value', '', 8],
      ['', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 8],
      ['', 'Mem', '8bit', 0x92800, '>=', 'Value', '', 3]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['ResetIf', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
  },
  badge: '131383',
  id: 120453,
})

set.addAchievement({
  title: `Extreme Raider of St. Francis' Folly`,
  description: `Complete "St. Francis' Folly" with 23 kills, 19 pickups, all 4 secrets, using only the pistols, and without saving or using any Medi Packs`,
  points: 10,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 5],
      ['MeasuredIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 5],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['AddSource', 'Mem', 'BitCount', 0x92800],
      ['AddSource', 'Mem', '8bit', 0x927fc],
      ['Measured', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 46],
      ['PauseIf', 'Mem', '16bit', 0x87584, '=', 'Value', '', 21],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 5],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 5],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 5],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 5],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['', 'Mem', '8bit', 0x927fc, '>=', 'Value', '', 23],
      ['', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 19],
      ['', 'Mem', '8bit', 0x92800, '>=', 'Value', '', 4]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['ResetIf', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
  },
  badge: '131384',
  id: 120454,
})

set.addAchievement({
  title: 'Extreme Raider of the Colosseum',
  description: `Complete "Colosseum" with 26 kills, 14 pickups, all 3 secrets, using only the pistols, and without saving or using any Medi Packs`,
  points: 10,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 6],
      ['MeasuredIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 6],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['AddSource', 'Mem', 'BitCount', 0x92800],
      ['AddSource', 'Mem', '8bit', 0x927fc],
      ['Measured', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 43],
      ['PauseIf', 'Mem', '16bit', 0x87584, '=', 'Value', '', 21],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 6],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 6],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 6],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 6],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['', 'Mem', '8bit', 0x927fc, '>=', 'Value', '', 26],
      ['', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 14],
      ['', 'Mem', '8bit', 0x92800, '>=', 'Value', '', 3]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['ResetIf', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
  },
  badge: '131385',
  id: 120455,
})

set.addAchievement({
  title: 'Extreme Raider of Palace Midas',
  description: `Complete "Palace Midas" with 43 kills, 22 pickups, all 3 secrets, using only the pistols, and without saving or using any Medi Packs`,
  points: 10,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 7],
      ['MeasuredIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 7],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['AddSource', 'Mem', 'BitCount', 0x92800],
      ['AddSource', 'Mem', '8bit', 0x927fc],
      ['Measured', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 68],
      ['PauseIf', 'Mem', '16bit', 0x87584, '=', 'Value', '', 21],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 7],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 7],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 7],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 7],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['', 'Mem', '8bit', 0x927fc, '>=', 'Value', '', 43],
      ['', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 22],
      ['', 'Mem', '8bit', 0x92800, '>=', 'Value', '', 3]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['ResetIf', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
  },
  badge: '131386',
  id: 120456,
})

set.addAchievement({
  title: 'Extreme Raider of the Tomb of Tihocan',
  description: `Complete "Tomb of Tihocan" with 17 kills, 26 pickups, all 2 secrets, using only the pistols, and without saving or using any Medi Packs`,
  points: 10,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 17],
      ['MeasuredIf', 'Delta', '8bit', 0x87580, '=', 'Value', '', 9],
      ['AddSource', 'Mem', 'BitCount', 0x92800],
      ['AddSource', 'Mem', '8bit', 0x927fc],
      ['Measured', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 45],
      ['PauseIf', 'Mem', '16bit', 0x87584, '=', 'Value', '', 21],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 9],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 9],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 9],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 9],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['', 'Mem', '8bit', 0x927fc, '>=', 'Value', '', 17],
      ['', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 26],
      ['', 'Mem', '8bit', 0x92800, '>=', 'Value', '', 2]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['ResetIf', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
  },
  badge: '131388',
  id: 120457,
})

set.addAchievement({
  title: 'Extreme Raider of the Cistern',
  description: `Complete "The Cistern" with 34 kills, 28 pickups, all 3 secrets, using only the pistols, and without saving or using any Medi Packs`,
  points: 10,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 8],
      ['MeasuredIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 8],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['AddSource', 'Mem', 'BitCount', 0x92800],
      ['AddSource', 'Mem', '8bit', 0x927fc],
      ['Measured', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 65],
      ['PauseIf', 'Mem', '16bit', 0x87584, '=', 'Value', '', 21],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 8],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 8],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 8],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 8],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['', 'Mem', '8bit', 0x927fc, '>=', 'Value', '', 34],
      ['', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 28],
      ['', 'Mem', '8bit', 0x92800, '>=', 'Value', '', 3]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['ResetIf', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
  },
  badge: '131387',
  id: 120458,
})

set.addAchievement({
  title: 'Extreme Raider of the City of Khamoon',
  description: `Complete "City of Khamoon" with 15 kills, 24 pickups, all 3 secrets, using only the pistols, and without saving or using any Medi Packs`,
  points: 10,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 10],
      ['MeasuredIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 10],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['AddSource', 'Mem', 'BitCount', 0x92800],
      ['AddSource', 'Mem', '8bit', 0x927fc],
      ['Measured', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 42],
      ['PauseIf', 'Mem', '16bit', 0x87584, '=', 'Value', '', 21],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 10],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 10],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 10],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 10],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['', 'Mem', '8bit', 0x927fc, '>=', 'Value', '', 15],
      ['', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 24],
      ['', 'Mem', '8bit', 0x92800, '>=', 'Value', '', 3]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['ResetIf', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
  },
  badge: '131389',
  id: 120459,
})

set.addAchievement({
  title: 'Extreme Raider of the Obelisk of Khamoon',
  description: `Complete "Obelisk of Khamoon" with 16 kills, 38 pickups, all 3 secrets, using only the pistols, and without saving or using any Medi Packs`,
  points: 25,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 11],
      ['MeasuredIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 11],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['AddSource', 'Mem', 'BitCount', 0x92800],
      ['AddSource', 'Mem', '8bit', 0x927fc],
      ['Measured', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 57],
      ['PauseIf', 'Mem', '16bit', 0x87584, '=', 'Value', '', 21],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 11],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 11],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 11],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 11],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['', 'Mem', '8bit', 0x927fc, '>=', 'Value', '', 16],
      ['', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 38],
      ['', 'Mem', '8bit', 0x92800, '>=', 'Value', '', 3]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['ResetIf', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
  },
  badge: '131390',
  id: 120460,
})

set.addAchievement({
  title: 'Extreme Raider of the Sanctuary of the Scion',
  description: `Complete "Sanctuary of the Scion" with 15 kills, 29 pickups, the secret, using only the pistols, and without saving or using any Medi Packs`,
  points: 25,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 12],
      ['MeasuredIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 12],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['AddSource', 'Mem', 'BitCount', 0x92800],
      ['AddSource', 'Mem', '8bit', 0x927fc],
      ['Measured', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 45],
      ['PauseIf', 'Mem', '16bit', 0x87584, '=', 'Value', '', 21],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 12],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 12],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 12],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 12],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['', 'Mem', '8bit', 0x927fc, '>=', 'Value', '', 15],
      ['', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 29],
      ['', 'Mem', '8bit', 0x92800, '>=', 'Value', '', 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['ResetIf', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
  },
  badge: '131391',
  id: 120461,
})

set.addAchievement({
  title: `Extreme Raider of Natla's Mines`,
  description: `Complete "Natla's Mines" with 3 kills, 30 pickups, all 3 secrets, using only the pistols, and without saving or using any Medi Packs`,
  points: 25,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 13],
      ['MeasuredIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 13],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['AddSource', 'Mem', 'BitCount', 0x92800],
      ['AddSource', 'Mem', '8bit', 0x927fc],
      ['Measured', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 36],
      ['PauseIf', 'Mem', '16bit', 0x87584, '=', 'Value', '', 21],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 13],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 13],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 13],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 13],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['', 'Mem', '8bit', 0x927fc, '>=', 'Value', '', 3],
      ['', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 30],
      ['', 'Mem', '8bit', 0x92800, '>=', 'Value', '', 3]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['ResetIf', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
  },
  badge: '131392',
  id: 120462,
})

set.addAchievement({
  title: 'Extreme Raider of Atlantis',
  description: `Complete "Atlantis" with 32 kills, 50 pickups, all 3 secrets, using only the pistols, and without saving or using any Medi Packs`,
  points: 50,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 19],
      ['MeasuredIf', 'Delta', '8bit', 0x87580, '=', 'Value', '', 14],
      ['AddSource', 'Mem', 'BitCount', 0x92800],
      ['AddSource', 'Mem', '8bit', 0x927fc],
      ['Measured', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 85],
      ['PauseIf', 'Mem', '16bit', 0x87584, '=', 'Value', '', 21],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 14],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 14],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 14],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 14],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['', 'Mem', '8bit', 0x927fc, '>=', 'Value', '', 32],
      ['', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 50],
      ['', 'Mem', '8bit', 0x92800, '>=', 'Value', '', 3]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['ResetIf', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
  },
  badge: '131393',
  id: 120463,
})

set.addAchievement({
  title: 'Extreme Raider of the Great Pyramid',
  description: `Complete "The Great Pyramid" with 6 kills, 31 pickups, all 3 secrets, using only the pistols, and without saving or using any Medi Packs`,
  points: 50,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 15],
      ['MeasuredIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['AddSource', 'Mem', 'BitCount', 0x92800],
      ['AddSource', 'Mem', '8bit', 0x927fc],
      ['Measured', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 39],
      ['PauseIf', 'Mem', '16bit', 0x87584, '=', 'Value', '', 21],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      ['AndNext', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 16],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      ['AndNext', 'Delta', 'BitCount', 0x92800, '=', 'Value', '', 2],
      ['AndNext', 'Mem', '32bit', 0x1a2fe0, '=', 'Value', '', 0],
      ['AndNext', 'Mem', '32bit', 0x1a2fe4, '>=', 'Value', '', 51300],
      ['AndNext', 'Mem', '32bit', 0x1a2fe4, '<=', 'Value', '', 53147],
      ['AndNext', 'Mem', '32bit', 0x1a2fdc, '>=', 'Value', '', 69733],
      ['', 'Mem', '32bit', 0x1a2fdc, '<=', 'Value', '', 71579, 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      ['AndNext', 'Mem', '32bit', 0x1a2fdc, '<=', 'Value', '', 68242],
      ['AndNext', 'Mem', '32bit', 0x1a2fdc, '>=', 'Value', '', 67483],
      ['AndNext', 'Mem', '32bit', 0x1a2fe4, '<=', 'Value', '', 52123],
      ['AndNext', 'Mem', '32bit', 0x1a2fe4, '>=', 'Value', '', 51307],
      ['AndNext', 'Mem', '32bit', 0x1a2fe0, '>=', 'Value', '', 0],
      ['AndNext', 'Mem', '32bit', 0x1a2fe0, '<=', 'Value', '', 726],
      ['PauseIf', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 1, 1],
      ['', 'Mem', '8bit', 0x927fc, '>=', 'Value', '', 6],
      ['', 'Mem', '8bit', 0x9280e, '>=', 'Value', '', 31],
      ['', 'Mem', '8bit', 0x92800, '>=', 'Value', '', 3]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['ResetIf', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
    alt3: $(
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      ['AndNext', 'Mem', '32bit', 0x1a2fe4, '<=', 'Value', '', 52325],
      ['AndNext', 'Mem', '32bit', 0x1a2fe4, '>=', 'Value', '', 51099],
      ['AndNext', 'Mem', '32bit', 0x1a2fdc, '>=', 'Value', '', 58040],
      ['AndNext', 'Mem', '32bit', 0x1a2fdc, '<=', 'Value', '', 59634],
      ['AndNext', 'Mem', '32bit', 0x1a2fe4, '>=', 'Value', '', 51099],
      ['ResetIf', 'Mem', '32bit', 0x1a2fe4, '<=', 'Value', '', 52930],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddf9c,
        '<',
        'Mem',
        '16bit',
        0x1ddf9c,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfa8,
        '<',
        'Mem',
        '16bit',
        0x1ddfa8,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x1ddfb4,
        '<',
        'Mem',
        '16bit',
        0x1ddfb4,
        1,
      ],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      [
        'PauseIf',
        'Delta',
        '16bit',
        0x87e9c,
        '<',
        'Mem',
        '16bit',
        0x87e9c,
        1,
      ]
    ),
  },
  badge: '131394',
  id: 120464,
})

set.addAchievement({
  title: 'Lara the Explorer in the Caves',
  description: `Find all 3 secrets in "Caves"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 1],
      ['Measured', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 3],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131366',
  id: 120465,
})

set.addAchievement({
  title: 'Lara the Explorer in the City of Vilcabamba',
  description: `Find all 3 secrets in "City of Vilcabamba"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 2],
      ['Measured', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 3],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131367',
  id: 120466,
})

set.addAchievement({
  title: 'Lara the Explorer in the Lost Valley',
  description: `Find all 5 secrets in "Lost Valley"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
      ['Measured', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 5],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131368',
  id: 120467,
})

set.addAchievement({
  title: 'Lara the Explorer in the Tomb of Qualopec',
  description: `Find all 3 secrets in "Tomb of Qualopec"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 4],
      ['Measured', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 3],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131369',
  id: 120468,
})

set.addAchievement({
  title: `Lara the Explorer in St. Francis' Folly`,
  description: `Find all 4 secrets in "St. Francis' Folly"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 5],
      ['Measured', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 4],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131370',
  id: 120469,
})

set.addAchievement({
  title: 'Lara the Explorer in the Colosseum',
  description: `Find all 3 secrets in "Colosseum"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 6],
      ['', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 3],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131371',
  id: 120470,
})

set.addAchievement({
  title: 'Lara the Explorer in Palace Midas',
  description: `Find all 3 secrets in "Palace Midas"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 7],
      ['', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 3],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131372',
  id: 120471,
})

set.addAchievement({
  title: 'Lara the Explorer in the Cistern',
  description: `Find all 3 secrets in "The Cistern"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 8],
      ['Measured', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 3],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131373',
  id: 120472,
})

set.addAchievement({
  title: 'Lara the Explorer in the Tomb of Tihocan',
  description: `Find both of the secrets in "Tomb of Tihocan"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 9],
      ['Measured', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 2],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131374',
  id: 120473,
})

set.addAchievement({
  title: 'Lara the Explorer in the City of Khamoon',
  description: `Find all 3 secrets in "City of Khamoon"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 10],
      ['Measured', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 3],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131375',
  id: 120474,
})

set.addAchievement({
  title: 'Lara the Explorer in the Obelisk of Khamoon',
  description: `Find all 3 secrets in "Obelisk of Khamoon"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 11],
      ['Measured', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 3],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131376',
  id: 120475,
})

set.addAchievement({
  title: `Lara the Explorer in Natla's Mines`,
  description: `Find all 3 secrets in "Natla's Mines"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 13],
      ['Measured', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 3],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131377',
  id: 120476,
})

set.addAchievement({
  title: 'Lara the Explorer in Atlantis',
  description: `Find all 3 secrets in "Atlantis"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 14],
      ['Measured', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 3],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131378',
  id: 120477,
})

set.addAchievement({
  title: 'Lara the Explorer in the Great Pyramid',
  description: `Find all 3 secrets in "The Great Pyramid"`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      ['', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 2],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      ['AndNext', 'Delta', 'BitCount', 0x92800, '=', 'Value', '', 2],
      ['AndNext', 'Mem', '32bit', 0x1a2fe0, '=', 'Value', '', 0],
      ['AndNext', 'Mem', '32bit', 0x1a2fe4, '>=', 'Value', '', 51300],
      ['AndNext', 'Mem', '32bit', 0x1a2fe4, '<=', 'Value', '', 53147],
      ['AndNext', 'Mem', '32bit', 0x1a2fdc, '>=', 'Value', '', 69733],
      ['', 'Mem', '32bit', 0x1a2fdc, '<=', 'Value', '', 71579, 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      ['AndNext', 'Mem', '32bit', 0x1a2fdc, '<=', 'Value', '', 68242],
      ['AndNext', 'Mem', '32bit', 0x1a2fdc, '>=', 'Value', '', 67483],
      ['AndNext', 'Mem', '32bit', 0x1a2fe4, '<=', 'Value', '', 52123],
      ['AndNext', 'Mem', '32bit', 0x1a2fe4, '>=', 'Value', '', 51307],
      ['AndNext', 'Mem', '32bit', 0x1a2fe0, '>=', 'Value', '', 0],
      ['AndNext', 'Mem', '32bit', 0x1a2fe0, '<=', 'Value', '', 726],
      ['PauseIf', 'Mem', 'BitCount', 0x92800, '=', 'Value', '', 1, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
    alt2: $(
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
      ['AndNext', 'Mem', '32bit', 0x1a2fe4, '<=', 'Value', '', 52325],
      ['AndNext', 'Mem', '32bit', 0x1a2fe4, '>=', 'Value', '', 51099],
      ['AndNext', 'Mem', '32bit', 0x1a2fdc, '>=', 'Value', '', 58040],
      ['AndNext', 'Mem', '32bit', 0x1a2fdc, '<=', 'Value', '', 59634],
      ['AndNext', 'Mem', '32bit', 0x1a2fe4, '>=', 'Value', '', 51099],
      ['ResetIf', 'Mem', '32bit', 0x1a2fe4, '<=', 'Value', '', 52930],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
  },
  badge: '131379',
  id: 120478,
})

set.addAchievement({
  title: 'Exotic Retreat',
  description: `Dive into the water at the start of "Lost Valley"`,
  points: 1,
  conditions: {
    core: $(
      ['ResetIf', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 3],
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
      ['', 'Delta', '16bit', 0x194798, '=', 'Value', '', 53],
      ['', 'Mem', '16bit', 0x194798, '=', 'Value', '', 35],
      ['', 'Mem', '16bit', 0x1947c6, '>=', 'Value', '', 17821],
      ['', 'Mem', '16bit', 0x1947c6, '<=', 'Value', '', 27987],
      ['', 'Mem', '32bit', 0x1947bc, '>=', 'Value', '', 0],
      ['', 'Mem', '32bit', 0x1947bc, '<=', 'Value', '', 6851],
      ['', 'Mem', '32bit', 0x1947b8, '>=', 'Value', '', 34715],
      ['', 'Mem', '32bit', 0x1947b8, '<=', 'Value', '', 37719],
      ['', 'Mem', '32bit', 0x1947c0, '<=', 'Value', '', 69733],
      ['', 'Mem', '32bit', 0x1947c0, '>=', 'Value', '', 66769],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130192',
  id: 120479,
})

set.addAchievement({
  title: `Ms. Croft's Fall-y`,
  description: `Dive into the ground from the top of the shaft in "St. Francis' Folly"`,
  points: 3,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 5],
      ['', 'Mem', '8bit', 0x1882f8, '=', 'Value', '', 8],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 5],
      ['AndNext', 'Mem', '32bit', 0x188320, '>=', 'Value', '', 35941],
      ['AndNext', 'Mem', '32bit', 0x188320, '<=', 'Value', '', 45979],
      ['AndNext', 'Mem', '32bit', 0x188318, '>=', 'Value', '', 34917],
      ['AndNext', 'Mem', '32bit', 0x188318, '<=', 'Value', '', 43931],
      ['', 'Delta', '8bit', 0x1882f8, '=', 'Value', '', 53, 130],
      ['', 'Mem', '32bit', 0x18831c, '=', 'Value', '', 23552],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 5],
      ['AndNext', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 0],
      ['ResetIf', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0],
      ['AndNext', 'Delta', '8bit', 0x1882f8, '=', 'Value', '', 35],
      ['ResetIf', 'Mem', '8bit', 0x1882f8, '!=', 'Value', '', 35],
      ['ResetIf', 'Mem', '8bit', 0x1882f8, '=', 'Value', '', 9]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130247',
  id: 120480,
})

set.addAchievement({
  title: 'Thrown to the Lions',
  description: `Dive into the underground spike pit in "Colosseum"`,
  points: 4,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 6],
      ['', 'Mem', '8bit', 0x18eb28, '=', 'Value', '', 8],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 6],
      ['AndNext', 'Mem', '32bit', 0x18eb48, '>=', 'Value', '', 45157],
      ['AndNext', 'Mem', '32bit', 0x18eb48, '<=', 'Value', '', 48027],
      ['AndNext', 'Mem', '32bit', 0x18eb50, '>=', 'Value', '', 54373],
      ['AndNext', 'Mem', '32bit', 0x18eb50, '<=', 'Value', '', 60517],
      ['', 'Delta', '8bit', 0x18eb28, '=', 'Value', '', 53, 90],
      ['', 'Mem', '32bit', 0x18eb4c, '=', 'Value', '', 2816],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 6],
      ['AndNext', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 0],
      ['ResetIf', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0],
      ['AndNext', 'Delta', '8bit', 0x18eb28, '=', 'Value', '', 35],
      ['ResetIf', 'Mem', '8bit', 0x18eb28, '!=', 'Value', '', 35],
      ['ResetIf', 'Mem', '8bit', 0x18eb28, '=', 'Value', '', 9]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130253',
  id: 120481,
})

set.addAchievement({
  title: 'The Seventh Seal',
  description: `Dive off the roof into the center of the spike pit in "The Cistern"`,
  points: 4,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 8],
      ['', 'Mem', '32bit', 0x1ab7b8, '=', 'Value', '', 0xffffec00],
      ['', 'Mem', '8bit', 0x1ab794, '=', 'Value', '', 8],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 8],
      ['AndNext', 'Mem', '32bit', 0x1ab7b4, '<=', 'Value', '', 41323],
      ['AndNext', 'Mem', '32bit', 0x1ab7b4, '>=', 'Value', '', 39133],
      ['AndNext', 'Mem', '32bit', 0x1ab7bc, '>=', 'Value', '', 25096],
      ['AndNext', 'Mem', '32bit', 0x1ab7bc, '<=', 'Value', '', 29227],
      ['', 'Delta', '8bit', 0x1ab794, '=', 'Value', '', 53, 20],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 8],
      ['AndNext', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 0],
      ['ResetIf', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0],
      ['AndNext', 'Delta', '8bit', 0x1ab794, '=', 'Value', '', 35],
      ['ResetIf', 'Mem', '8bit', 0x1ab794, '!=', 'Value', '', 35],
      ['ResetIf', 'Mem', '8bit', 0x1ab794, '=', 'Value', '', 9]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130282',
  id: 120482,
})

set.addAchievement({
  title: 'Professor Splash',
  description: `Dive into the small square of water in "Tomb of Tihocan"`,
  points: 4,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 9],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 9],
      ['AndNext', 'Mem', '32bit', 0x1a0290, '>=', 'Value', '', 40168],
      ['AndNext', 'Mem', '32bit', 0x1a0290, '<=', 'Value', '', 43136],
      ['AndNext', 'Mem', '32bit', 0x1a0298, '<=', 'Value', '', 80439],
      ['AndNext', 'Mem', '32bit', 0x1a0298, '>=', 'Value', '', 76699],
      ['', 'Delta', '32bit', 0x1a0270, '=', 'Value', '', 53, 70],
      ['', 'Mem', '32bit', 0x1a0294, '=', 'Value', '', 824],
      ['', 'Mem', '8bit', 0x1a0270, '=', 'Value', '', 35],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 9],
      ['AndNext', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 0],
      ['ResetIf', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0],
      ['AndNext', 'Delta', '8bit', 0x1a0270, '=', 'Value', '', 35],
      ['ResetIf', 'Mem', '8bit', 0x1a0270, '!=', 'Value', '', 35],
      ['ResetIf', 'Mem', '8bit', 0x1a0270, '=', 'Value', '', 9]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130283',
  id: 120483,
})

set.addAchievement({
  title: 'Pillar of Humanity',
  description: `Dive from the mirror room into the pillar secret in "Obelisk of Khamoon"`,
  points: 3,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 11],
      ['', 'Mem', '32bit', 0x189538, '=', 'Value', '', 0xffffe200],
      ['', 'Mem', '8bit', 0x189514, '=', 'Value', '', 8],
      ['', 'Mem', '32bit', 0x189534, '>=', 'Value', '', 49051],
      ['', 'Mem', '32bit', 0x189534, '<=', 'Value', '', 50277],
      ['', 'Mem', '32bit', 0x18953c, '>=', 'Value', '', 56219],
      ['', 'Mem', '32bit', 0x18953c, '<=', 'Value', '', 57445],
      ['', 'Delta', '8bit', 0x189514, '=', 'Value', '', 53]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130395',
  id: 120484,
})

set.addAchievement({
  title: 'Trust Exercise',
  description: `Dive between the Sphinx's legs in "Sanctuary of the Scion"`,
  points: 4,
  conditions: $(
    ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 12],
    ['', 'Mem', '32bit', 0x18eff0, '>=', 'Value', '', 18432],
    ['', 'Mem', '8bit', 0x18efcc, '=', 'Value', '', 35],
    ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 12],
    ['AndNext', 'Mem', '32bit', 0x18eff4, '>=', 'Value', '', 47872],
    ['AndNext', 'Mem', '32bit', 0x18eff4, '<=', 'Value', '', 50000],
    ['AndNext', 'Mem', '32bit', 0x18efec, '<=', 'Value', '', 43107],
    ['AndNext', 'Mem', '32bit', 0x18efec, '>=', 'Value', '', 41482],
    ['', 'Delta', '8bit', 0x18efcc, '=', 'Value', '', 53, 190],
    ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
    ['AndNext', 'Mem', '8bit', 0x87580, '=', 'Value', '', 12],
    ['AndNext', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 0],
    ['ResetIf', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0],
    ['AndNext', 'Delta', '8bit', 0x18efcc, '=', 'Value', '', 35],
    ['ResetIf', 'Mem', '8bit', 0x18efcc, '!=', 'Value', '', 35],
    ['ResetIf', 'Mem', '8bit', 0x18efcc, '=', 'Value', '', 9]
  ),
  badge: '130450',
  id: 120485,
})

set.addAchievement({
  title: 'Human Landmark',
  description: `Perform a handstand on the building with the second secret in "Lost Valley"`,
  points: 1,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
      ['', 'Mem', '32bit', 0x1947b8, '=', 'Value', '', 65435],
      ['', 'Mem', '32bit', 0x1947c0, '<=', 'Value', '', 12181],
      ['', 'Mem', '32bit', 0x1947c0, '>=', 'Value', '', 11365],
      ['', 'Mem', '32bit', 0x1947bc, '>=', 'Value', '', -1840],
      ['', 'Mem', '32bit', 0x1947bc, '<=', 'Value', '', -1824],
      ['', 'Delta', '8bit', 0x194798, '=', 'Value', '', 10],
      ['', 'Mem', '8bit', 0x194798, '=', 'Value', '', 54],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130239',
  id: 120486,
})

set.addAchievement({
  title: 'Now for the Real Show!',
  description: `Perform a handstand on the center of the balcony in "Colosseum"`,
  points: 1,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 6],
      ['', 'Mem', '32bit', 0x18eb48, '=', 'Value', '', 40037],
      ['', 'Mem', '32bit', 0x18eb50, '>=', 'Value', '', 47702],
      ['', 'Mem', '32bit', 0x18eb50, '<=', 'Value', '', 48886],
      ['', 'Mem', '32bit', 0x18eb4c, '>=', 'Value', '', -3888],
      ['', 'Mem', '32bit', 0x18eb4c, '<=', 'Value', '', -3878],
      ['', 'Delta', '8bit', 0x18eb28, '=', 'Value', '', 10],
      ['', 'Mem', '8bit', 0x18eb28, '=', 'Value', '', 54],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130256',
  id: 120487,
})

set.addAchievement({
  title: 'Ancient Show-Off',
  description: `Perform a handstand on the pillar of the 4 artifacts in "Obelisk of Khamoon"`,
  points: 1,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 11],
      ['', 'Mem', '8bit', 0x189514, '=', 'Value', '', 54],
      ['', 'Mem', '32bit', 0x189538, '=', 'Value', '', 0xffffe4d6],
      ['', 'Mem', '32bit', 0x189534, '>=', 'Value', '', 49051],
      ['', 'Mem', '32bit', 0x189534, '<=', 'Value', '', 50277],
      ['', 'Mem', '32bit', 0x18953c, '>=', 'Value', '', 56219],
      ['', 'Mem', '32bit', 0x18953c, '<=', 'Value', '', 57445],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130342',
  id: 120488,
})

set.addAchievement({
  title: 'Smells Like Egyptian Spirit',
  description: `Perform a handstand on the hidden platform inside the Sphinx's nose in "Sanctuary of the Scion"`,
  points: 3,
  conditions: $(
    ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 12],
    ['', 'Mem', '8bit', 0x18efcc, '=', 'Value', '', 54],
    ['', 'Mem', '32bit', 0x18eff0, '=', 'Value', '', 0xffffe0d5],
    ['', 'Mem', '32bit', 0x18efec, '=', 'Value', '', 46181],
    ['', 'Mem', '32bit', 0x18eff4, '>=', 'Value', '', 48232],
    ['', 'Mem', '32bit', 0x18eff4, '<=', 'Value', '', 49048]
  ),
  badge: '130398',
  id: 120489,
})

set.addAchievement({
  title: 'What Am I, Made of Money?',
  description: `Get turned into gold in "Palace Midas"`,
  points: 1,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 7],
      ['', 'Mem', '8bit', 0x19d318, '=', 'Value', '', 51],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1],
      ['AndNext', 'Mem', '32bit', 0x1ddfa0, '=', 'Value', '', 1234],
      ['AndNext', 'Mem', '32bit', 0x1ddfac, '=', 'Value', '', 1234],
      ['PauseIf', 'Mem', '32bit', 0x1ddf94, '=', 'Value', '', 1234, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '130267',
  id: 120490,
})

set.addAchievement({
  title: 'No Animals Were Harmed',
  description: `Complete "Caves" without killing any enemies`,
  points: 5,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 1],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['', 'Mem', '8bit', 0x927fc, '=', 'Value', '', 0],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131461',
  id: 120491,
})

set.addAchievement({
  title: 'Home Is Where the Guide Is',
  description: 'Complete the training level',
  points: 1,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 0],
      ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 0],
      ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
      ['', 'Mem', '32bit', 0x927f8, '>', 'Value', '', 1],
      ['PauseIf', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7, 1]
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0x87580, '=', 'Value', '', 20]),
  },
  badge: '131489',
  id: 120496,
})

{
  set.addLeaderboard({
    title: 'Laras Home',
    description: 'Fastest Time to beat Laras Home.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 0],
        ['', 'Mem', '32bit', 0x927f8, '=', 'Value', '', 1],
        ['', 'Mem', '32bit', 0x927f8, '>', 'Delta', '32bit', 0x927f8]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 0]),
        alt2: $(
          ['', 'Delta', '8bit', 0x87588, '=', 'Value', '', 0],
          ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
          [
            '',
            'Mem',
            '32bit',
            0x927f8,
            '=',
            'Delta',
            '32bit',
            0x927f8,
          ]
        ),
      },
      submit: $(
        ['', 'Delta', '8bit', 0x87588, '=', 'Value', '', 0],
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['', 'Mem', '32bit', 0x927f8, '!=', 'Delta', '32bit', 0x927f8]
      ),
      value: $(
        [
          'AddSource',
          'Mem',
          '8bit',
          0x927fa,
          '*',
          'Value',
          '',
          0x1fffe,
        ],
        ['Measured', 'Mem', '16bit', 0x927f8, '*', 'Value', '', 2]
      ),
    },
    id: 5782,
  })

  set.addLeaderboard({
    title: 'Pacifist Lara',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 1],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 1],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 1]),
        alt3: $(['', 'Mem', '16bit', 0x927fc, '!=', 'Value', '', 0]),
        alt4: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9078,
  })

  set.addLeaderboard({
    title: 'Extreme Raider - Caves',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 1],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 1],
        ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 1],
        ['', 'Mem', '32bit', 0x927f8, '<', 'Value', '', 30]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 1]),
        alt3: $(['', 'Mem', '8bit', 0x87584, '!=', 'Value', '', 1]),
        alt4: $([
          '',
          'Delta',
          '16bit',
          0x1ddf9c,
          '<',
          'Mem',
          '16bit',
          0x1ddf9c,
        ]),
        alt5: $([
          '',
          'Delta',
          '16bit',
          0x1ddfa8,
          '<',
          'Mem',
          '16bit',
          0x1ddfa8,
        ]),
        alt6: $([
          '',
          'Delta',
          '16bit',
          0x1ddfb4,
          '<',
          'Mem',
          '16bit',
          0x1ddfb4,
        ]),
        alt7: $([
          '',
          'Delta',
          '16bit',
          0x87e9c,
          '<',
          'Mem',
          '16bit',
          0x87e9c,
        ]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['AddSource', 'Mem', 'BitCount', 0x92800],
        ['AddSource', 'Mem', '8bit', 0x927fc],
        ['Measured', 'Mem', '8bit', 0x9280e, '=', 'Value', '', 24]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 8820,
  })

  set.addLeaderboard({
    title: 'Extreme Raider - City of Vilacabamba',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 2],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 2],
        ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 2],
        ['', 'Mem', '32bit', 0x927f8, '<', 'Value', '', 30]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 2]),
        alt3: $(['', 'Mem', '8bit', 0x87584, '!=', 'Value', '', 2]),
        alt4: $([
          '',
          'Delta',
          '16bit',
          0x1ddf9c,
          '<',
          'Mem',
          '16bit',
          0x1ddf9c,
        ]),
        alt5: $([
          '',
          'Delta',
          '16bit',
          0x1ddfa8,
          '<',
          'Mem',
          '16bit',
          0x1ddfa8,
        ]),
        alt6: $([
          '',
          'Delta',
          '16bit',
          0x1ddfb4,
          '<',
          'Mem',
          '16bit',
          0x1ddfb4,
        ]),
        alt7: $([
          '',
          'Delta',
          '16bit',
          0x87e9c,
          '<',
          'Mem',
          '16bit',
          0x87e9c,
        ]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['AddSource', 'Mem', 'BitCount', 0x92800],
        ['AddSource', 'Mem', '8bit', 0x927fc],
        ['Measured', 'Mem', '8bit', 0x9280e, '=', 'Value', '', 45]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9074,
  })

  set.addLeaderboard({
    title: 'Extreme Raider - The Lost Valley',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 3],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
        ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 3],
        ['', 'Mem', '32bit', 0x927f8, '<', 'Value', '', 30]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 3]),
        alt3: $(['', 'Mem', '8bit', 0x87584, '!=', 'Value', '', 3]),
        alt4: $([
          '',
          'Delta',
          '16bit',
          0x1ddf9c,
          '<',
          'Mem',
          '16bit',
          0x1ddf9c,
        ]),
        alt5: $([
          '',
          'Delta',
          '16bit',
          0x1ddfa8,
          '<',
          'Mem',
          '16bit',
          0x1ddfa8,
        ]),
        alt6: $([
          '',
          'Delta',
          '16bit',
          0x1ddfb4,
          '<',
          'Mem',
          '16bit',
          0x1ddfb4,
        ]),
        alt7: $([
          '',
          'Delta',
          '16bit',
          0x87e9c,
          '<',
          'Mem',
          '16bit',
          0x87e9c,
        ]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['AddSource', 'Mem', 'BitCount', 0x92800],
        ['AddSource', 'Mem', '8bit', 0x927fc],
        ['Measured', 'Mem', '8bit', 0x9280e, '=', 'Value', '', 34]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9079,
  })

  set.addLeaderboard({
    title: 'Extreme Raider - Tomb of Qualopec',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 4],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 4],
        ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 4],
        ['', 'Mem', '32bit', 0x927f8, '<', 'Value', '', 30]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87584, '!=', 'Value', '', 4]),
        alt3: $([
          '',
          'Delta',
          '16bit',
          0x1ddf9c,
          '<',
          'Mem',
          '16bit',
          0x1ddf9c,
        ]),
        alt4: $([
          '',
          'Delta',
          '16bit',
          0x1ddfa8,
          '<',
          'Mem',
          '16bit',
          0x1ddfa8,
        ]),
        alt5: $([
          '',
          'Delta',
          '16bit',
          0x1ddfb4,
          '<',
          'Mem',
          '16bit',
          0x1ddfb4,
        ]),
        alt6: $([
          '',
          'Delta',
          '16bit',
          0x87e9c,
          '<',
          'Mem',
          '16bit',
          0x87e9c,
        ]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 16],
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['AddSource', 'Mem', 'BitCount', 0x92800],
        ['AddSource', 'Mem', '8bit', 0x927fc],
        ['Measured', 'Mem', '8bit', 0x9280e, '=', 'Value', '', 19]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9080,
  })

  set.addLeaderboard({
    title: 'Extreme Raider - St. Francis Folly',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 5],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 5],
        ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 5],
        ['', 'Mem', '32bit', 0x927f8, '<', 'Value', '', 30]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 5]),
        alt3: $(['', 'Mem', '8bit', 0x87584, '!=', 'Value', '', 5]),
        alt4: $([
          '',
          'Delta',
          '16bit',
          0x1ddf9c,
          '<',
          'Mem',
          '16bit',
          0x1ddf9c,
        ]),
        alt5: $([
          '',
          'Delta',
          '16bit',
          0x1ddfa8,
          '<',
          'Mem',
          '16bit',
          0x1ddfa8,
        ]),
        alt6: $([
          '',
          'Delta',
          '16bit',
          0x1ddfb4,
          '<',
          'Mem',
          '16bit',
          0x1ddfb4,
        ]),
        alt7: $([
          '',
          'Delta',
          '16bit',
          0x87e9c,
          '<',
          'Mem',
          '16bit',
          0x87e9c,
        ]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['AddSource', 'Mem', 'BitCount', 0x92800],
        ['AddSource', 'Mem', '8bit', 0x927fc],
        ['Measured', 'Mem', '8bit', 0x9280e, '=', 'Value', '', 46]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9081,
  })

  set.addLeaderboard({
    title: 'Extreme Raider - Colosseum',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 6],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 6],
        ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 6],
        ['', 'Mem', '32bit', 0x927f8, '<', 'Value', '', 30]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 6]),
        alt3: $(['', 'Mem', '8bit', 0x87584, '!=', 'Value', '', 6]),
        alt4: $([
          '',
          'Delta',
          '16bit',
          0x1ddf9c,
          '<',
          'Mem',
          '16bit',
          0x1ddf9c,
        ]),
        alt5: $([
          '',
          'Delta',
          '16bit',
          0x1ddfa8,
          '<',
          'Mem',
          '16bit',
          0x1ddfa8,
        ]),
        alt6: $([
          '',
          'Delta',
          '16bit',
          0x1ddfb4,
          '<',
          'Mem',
          '16bit',
          0x1ddfb4,
        ]),
        alt7: $([
          '',
          'Delta',
          '16bit',
          0x87e9c,
          '<',
          'Mem',
          '16bit',
          0x87e9c,
        ]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['AddSource', 'Mem', 'BitCount', 0x92800],
        ['AddSource', 'Mem', '8bit', 0x927fc],
        ['Measured', 'Mem', '8bit', 0x9280e, '=', 'Value', '', 43]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9082,
  })

  set.addLeaderboard({
    title: 'Extreme Raider - Palace Midas',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 7],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 7],
        ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 7],
        ['', 'Mem', '32bit', 0x927f8, '<', 'Value', '', 30]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 7]),
        alt3: $(['', 'Mem', '8bit', 0x87584, '!=', 'Value', '', 7]),
        alt4: $([
          '',
          'Delta',
          '16bit',
          0x1ddf9c,
          '<',
          'Mem',
          '16bit',
          0x1ddf9c,
        ]),
        alt5: $([
          '',
          'Delta',
          '16bit',
          0x1ddfa8,
          '<',
          'Mem',
          '16bit',
          0x1ddfa8,
        ]),
        alt6: $([
          '',
          'Delta',
          '16bit',
          0x1ddfb4,
          '<',
          'Mem',
          '16bit',
          0x1ddfb4,
        ]),
        alt7: $([
          '',
          'Delta',
          '16bit',
          0x87e9c,
          '<',
          'Mem',
          '16bit',
          0x87e9c,
        ]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['AddSource', 'Mem', 'BitCount', 0x92800],
        ['AddSource', 'Mem', '8bit', 0x927fc],
        ['Measured', 'Mem', '8bit', 0x9280e, '=', 'Value', '', 68]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9083,
  })

  set.addLeaderboard({
    title: 'Extreme Raider - Cistern',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 8],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 8],
        ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 8],
        ['', 'Mem', '32bit', 0x927f8, '<', 'Value', '', 30]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 8]),
        alt3: $(['', 'Mem', '8bit', 0x87584, '!=', 'Value', '', 8]),
        alt4: $([
          '',
          'Delta',
          '16bit',
          0x1ddf9c,
          '<',
          'Mem',
          '16bit',
          0x1ddf9c,
        ]),
        alt5: $([
          '',
          'Delta',
          '16bit',
          0x1ddfa8,
          '<',
          'Mem',
          '16bit',
          0x1ddfa8,
        ]),
        alt6: $([
          '',
          'Delta',
          '16bit',
          0x1ddfb4,
          '<',
          'Mem',
          '16bit',
          0x1ddfb4,
        ]),
        alt7: $([
          '',
          'Delta',
          '16bit',
          0x87e9c,
          '<',
          'Mem',
          '16bit',
          0x87e9c,
        ]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['AddSource', 'Mem', 'BitCount', 0x92800],
        ['AddSource', 'Mem', '8bit', 0x927fc],
        ['Measured', 'Mem', '8bit', 0x9280e, '=', 'Value', '', 65]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9084,
  })

  set.addLeaderboard({
    title: 'Extreme Raider - Tomb of Tihocan',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 9],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 9],
        ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 9],
        ['', 'Mem', '32bit', 0x927f8, '<', 'Value', '', 30]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87584, '!=', 'Value', '', 9]),
        alt3: $([
          '',
          'Delta',
          '16bit',
          0x1ddf9c,
          '<',
          'Mem',
          '16bit',
          0x1ddf9c,
        ]),
        alt4: $([
          '',
          'Delta',
          '16bit',
          0x1ddfa8,
          '<',
          'Mem',
          '16bit',
          0x1ddfa8,
        ]),
        alt5: $([
          '',
          'Delta',
          '16bit',
          0x1ddfb4,
          '<',
          'Mem',
          '16bit',
          0x1ddfb4,
        ]),
        alt6: $([
          '',
          'Delta',
          '16bit',
          0x87e9c,
          '<',
          'Mem',
          '16bit',
          0x87e9c,
        ]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 17],
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['AddSource', 'Mem', 'BitCount', 0x92800],
        ['AddSource', 'Mem', '8bit', 0x927fc],
        ['Measured', 'Mem', '8bit', 0x9280e, '=', 'Value', '', 45]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9085,
  })

  set.addLeaderboard({
    title: 'Extreme Raider - City of Khamoon',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 10],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 10],
        ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 10],
        ['', 'Mem', '32bit', 0x927f8, '<', 'Value', '', 30]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 10]),
        alt3: $(['', 'Mem', '8bit', 0x87584, '!=', 'Value', '', 10]),
        alt4: $([
          '',
          'Delta',
          '16bit',
          0x1ddf9c,
          '<',
          'Mem',
          '16bit',
          0x1ddf9c,
        ]),
        alt5: $([
          '',
          'Delta',
          '16bit',
          0x1ddfa8,
          '<',
          'Mem',
          '16bit',
          0x1ddfa8,
        ]),
        alt6: $([
          '',
          'Delta',
          '16bit',
          0x1ddfb4,
          '<',
          'Mem',
          '16bit',
          0x1ddfb4,
        ]),
        alt7: $([
          '',
          'Delta',
          '16bit',
          0x87e9c,
          '<',
          'Mem',
          '16bit',
          0x87e9c,
        ]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['AddSource', 'Mem', 'BitCount', 0x92800],
        ['AddSource', 'Mem', '8bit', 0x927fc],
        ['Measured', 'Mem', '8bit', 0x9280e, '=', 'Value', '', 42]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9086,
  })

  set.addLeaderboard({
    title: 'Extreme Raider - Obelisk of Khamoon',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 11],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 11],
        ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 11],
        ['', 'Mem', '32bit', 0x927f8, '<', 'Value', '', 30]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 11]),
        alt3: $(['', 'Mem', '8bit', 0x87584, '!=', 'Value', '', 11]),
        alt4: $([
          '',
          'Delta',
          '16bit',
          0x1ddf9c,
          '<',
          'Mem',
          '16bit',
          0x1ddf9c,
        ]),
        alt5: $([
          '',
          'Delta',
          '16bit',
          0x1ddfa8,
          '<',
          'Mem',
          '16bit',
          0x1ddfa8,
        ]),
        alt6: $([
          '',
          'Delta',
          '16bit',
          0x1ddfb4,
          '<',
          'Mem',
          '16bit',
          0x1ddfb4,
        ]),
        alt7: $([
          '',
          'Delta',
          '16bit',
          0x87e9c,
          '<',
          'Mem',
          '16bit',
          0x87e9c,
        ]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['AddSource', 'Mem', 'BitCount', 0x92800],
        ['AddSource', 'Mem', '8bit', 0x927fc],
        ['Measured', 'Mem', '8bit', 0x9280e, '=', 'Value', '', 57]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9087,
  })

  set.addLeaderboard({
    title: 'Extreme Raider - Sanctuary of the Scion',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 12],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 12],
        ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 12],
        ['', 'Mem', '32bit', 0x927f8, '<', 'Value', '', 30]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 12]),
        alt3: $(['', 'Mem', '8bit', 0x87584, '!=', 'Value', '', 12]),
        alt4: $([
          '',
          'Delta',
          '16bit',
          0x1ddf9c,
          '<',
          'Mem',
          '16bit',
          0x1ddf9c,
        ]),
        alt5: $([
          '',
          'Delta',
          '16bit',
          0x1ddfa8,
          '<',
          'Mem',
          '16bit',
          0x1ddfa8,
        ]),
        alt6: $([
          '',
          'Delta',
          '16bit',
          0x1ddfb4,
          '<',
          'Mem',
          '16bit',
          0x1ddfb4,
        ]),
        alt7: $([
          '',
          'Delta',
          '16bit',
          0x87e9c,
          '<',
          'Mem',
          '16bit',
          0x87e9c,
        ]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['AddSource', 'Mem', 'BitCount', 0x92800],
        ['AddSource', 'Mem', '8bit', 0x927fc],
        ['Measured', 'Mem', '8bit', 0x9280e, '=', 'Value', '', 45]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9088,
  })

  set.addLeaderboard({
    title: 'Extreme Raider - Natlas Mines',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 13],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 13],
        ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 13],
        ['', 'Mem', '32bit', 0x927f8, '<', 'Value', '', 30]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 13]),
        alt3: $(['', 'Mem', '8bit', 0x87584, '!=', 'Value', '', 13]),
        alt4: $([
          '',
          'Delta',
          '16bit',
          0x1ddf9c,
          '<',
          'Mem',
          '16bit',
          0x1ddf9c,
        ]),
        alt5: $([
          '',
          'Delta',
          '16bit',
          0x1ddfa8,
          '<',
          'Mem',
          '16bit',
          0x1ddfa8,
        ]),
        alt6: $([
          '',
          'Delta',
          '16bit',
          0x1ddfb4,
          '<',
          'Mem',
          '16bit',
          0x1ddfb4,
        ]),
        alt7: $([
          '',
          'Delta',
          '16bit',
          0x87e9c,
          '<',
          'Mem',
          '16bit',
          0x87e9c,
        ]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['AddSource', 'Mem', 'BitCount', 0x92800],
        ['AddSource', 'Mem', '8bit', 0x927fc],
        ['Measured', 'Mem', '8bit', 0x9280e, '=', 'Value', '', 36]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9089,
  })

  set.addLeaderboard({
    title: 'Extreme Raider - Atlantis',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 14],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 14],
        ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 14],
        ['', 'Mem', '32bit', 0x927f8, '<', 'Value', '', 30]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87584, '!=', 'Value', '', 14]),
        alt3: $([
          '',
          'Delta',
          '16bit',
          0x1ddf9c,
          '<',
          'Mem',
          '16bit',
          0x1ddf9c,
        ]),
        alt4: $([
          '',
          'Delta',
          '16bit',
          0x1ddfa8,
          '<',
          'Mem',
          '16bit',
          0x1ddfa8,
        ]),
        alt5: $([
          '',
          'Delta',
          '16bit',
          0x1ddfb4,
          '<',
          'Mem',
          '16bit',
          0x1ddfb4,
        ]),
        alt6: $([
          '',
          'Delta',
          '16bit',
          0x87e9c,
          '<',
          'Mem',
          '16bit',
          0x87e9c,
        ]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 19],
        ['AddSource', 'Mem', 'BitCount', 0x92800],
        ['AddSource', 'Mem', '8bit', 0x927fc],
        ['Measured', 'Mem', '8bit', 0x9280e, '=', 'Value', '', 85]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9090,
  })

  set.addLeaderboard({
    title: 'Extreme Raider - The Great Pyramid',
    description: '', // FIXME
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 1000],
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 15],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
        ['', 'Mem', '8bit', 0x87584, '=', 'Value', '', 15],
        ['', 'Mem', '32bit', 0x927f8, '<', 'Value', '', 30]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 15]),
        alt3: $(['', 'Mem', '8bit', 0x87584, '!=', 'Value', '', 15]),
        alt4: $([
          '',
          'Delta',
          '16bit',
          0x1ddf9c,
          '<',
          'Mem',
          '16bit',
          0x1ddf9c,
        ]),
        alt5: $([
          '',
          'Delta',
          '16bit',
          0x1ddfa8,
          '<',
          'Mem',
          '16bit',
          0x1ddfa8,
        ]),
        alt6: $([
          '',
          'Delta',
          '16bit',
          0x1ddfb4,
          '<',
          'Mem',
          '16bit',
          0x1ddfb4,
        ]),
        alt7: $([
          '',
          'Delta',
          '16bit',
          0x87e9c,
          '<',
          'Mem',
          '16bit',
          0x87e9c,
        ]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1],
        ['AddSource', 'Mem', 'BitCount', 0x92800],
        ['AddSource', 'Mem', '8bit', 0x927fc],
        ['Measured', 'Mem', '8bit', 0x9280e, '=', 'Value', '', 39]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9091,
  })

  set.addLeaderboard({
    title: 'Special - Not Safe',
    description: '', // FIXME
    lowerIsBetter: false,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['AddAddress', 'Mem', '24bit', 0x89eac],
        ['', 'Delta', '8bit', 0x10, '=', 'Value', '', 52],
        ['AddAddress', 'Mem', '24bit', 0x89eac],
        ['', 'Mem', '8bit', 0x10, '=', 'Value', '', 53]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', 'Bit0', 0x89b15, '=', 'Value', '', 1]),
        alt2: $(['', 'Mem', 'Bit5', 0x89b15, '=', 'Value', '', 1]),
        alt3: $(
          ['AddAddress', 'Mem', '24bit', 0x89eac],
          ['', 'Mem', '8bit', 0x10, '=', 'Value', '', 35]
        ),
      },
      submit: $(
        ['AddAddress', 'Mem', '24bit', 0x89eac],
        ['', 'Delta', '8bit', 0x10, '=', 'Value', '', 53],
        ['AddAddress', 'Mem', '24bit', 0x89eac],
        ['', 'Mem', '8bit', 0x10, '=', 'Value', '', 8]
      ),
      value: $([
        'Measured',
        'Mem',
        '8bit',
        0x87580,
        '=',
        'Mem',
        '8bit',
        0x87580,
      ]),
    },
    id: 9094,
  })

  set.addLeaderboard({
    title: 'Special - Safe',
    description: '', // FIXME
    lowerIsBetter: false,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['AddAddress', 'Mem', '24bit', 0x89eac],
        ['', 'Delta', '8bit', 0x10, '=', 'Value', '', 52],
        ['AddAddress', 'Mem', '24bit', 0x89eac],
        ['', 'Mem', '8bit', 0x10, '=', 'Value', '', 53]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', 'Bit0', 0x89b15, '=', 'Value', '', 1]),
        alt2: $(['', 'Mem', 'Bit5', 0x89b15, '=', 'Value', '', 1]),
        alt3: $(
          ['AddAddress', 'Mem', '24bit', 0x89eac],
          ['', 'Mem', '8bit', 0x10, '=', 'Value', '', 8]
        ),
      },
      submit: $(
        ['AddAddress', 'Mem', '24bit', 0x89eac],
        ['', 'Delta', '8bit', 0x10, '=', 'Value', '', 53],
        ['AddAddress', 'Mem', '24bit', 0x89eac],
        ['', 'Mem', '8bit', 0x10, '=', 'Value', '', 35]
      ),
      value: $([
        'Measured',
        'Mem',
        '8bit',
        0x87580,
        '=',
        'Mem',
        '8bit',
        0x87580,
      ]),
    },
    id: 9124,
  })

  set.addLeaderboard({
    title: 'Caves',
    description: 'Fastest Time to beat Caves.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 1],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 1],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 1]),
        alt3: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9148,
  })

  set.addLeaderboard({
    title: 'City of Vilacabamba',
    description: 'Fastest Time to beat City of Vilacabamba.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 2],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 2],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 2]),
        alt3: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9150,
  })

  set.addLeaderboard({
    title: 'The Lost Valley',
    description: 'Fastest Time to beat The Lost Valley.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 3],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 3],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 3]),
        alt3: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9151,
  })

  set.addLeaderboard({
    title: 'Tomb of Qualopec',
    description: 'Fastest Time to beat Tomb of Qualopec.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 4],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 4],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 16],
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9152,
  })

  set.addLeaderboard({
    title: 'St. Francis Folly',
    description: 'Fastest Time to beat St. Francis Folly.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 5],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 5],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 5]),
        alt3: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9153,
  })

  set.addLeaderboard({
    title: 'Colosseum',
    description: 'Fastest Time to beat Colosseum.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 6],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 6],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 6]),
        alt3: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9154,
  })

  set.addLeaderboard({
    title: 'Palace Midas',
    description: 'Fastest Time to beat Palace Midas.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 7],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 7],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 7]),
        alt3: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9155,
  })

  set.addLeaderboard({
    title: 'Cistern',
    description: 'Fastest Time to beat Cistern.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 8],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 8],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 8]),
        alt3: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9156,
  })

  set.addLeaderboard({
    title: 'Tomb of Tihocan',
    description: 'Fastest Time to beat Tomb of Tihocan.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 9],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 9],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 17],
        ['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]
      ),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9157,
  })

  set.addLeaderboard({
    title: 'City of Khamoon',
    description: 'Fastest Time to beat City of Khamoon.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 10],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 10],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 10]),
        alt3: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9158,
  })

  set.addLeaderboard({
    title: 'Obelisk of Khamoon',
    description: 'Fastest Time to beat Obelisk of Khamoon.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 11],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 11],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 11]),
        alt3: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9159,
  })

  set.addLeaderboard({
    title: 'Sanctuary of the Scion',
    description: 'Fastest Time to beat Sanctuary of the Scion',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 12],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 12],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 12]),
        alt3: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9160,
  })

  set.addLeaderboard({
    title: `Natla's Mines`,
    description: `Fastest Time to beat Natla's Mines.`,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 13],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 13],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 13]),
        alt3: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9161,
  })

  set.addLeaderboard({
    title: 'Atlantis',
    description: 'Fastest Time to beat Atlantis.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 14],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 14],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 14]),
        alt3: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9162,
  })

  set.addLeaderboard({
    title: 'The Great Pyramid',
    description: 'Fastest Time to beat The Great Pyramid.',
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: $(
        ['', 'Delta', '8bit', 0x87580, '=', 'Value', '', 15],
        ['', 'Mem', '8bit', 0x87580, '=', 'Value', '', 15],
        [
          'Measured',
          'Delta',
          '32bit',
          0x927f8,
          '!=',
          'Mem',
          '32bit',
          0x927f8,
          30,
        ]
      ),
      cancel: {
        core: $(),
        alt1: $(['', 'Mem', '16bit', 0x87e9c, '=', 'Value', '', 0]),
        alt2: $(['', 'Mem', '8bit', 0x87580, '!=', 'Value', '', 15]),
        alt3: $(['', 'Mem', '16bit', 0x88b1c, '=', 'Value', '', 7]),
      },
      submit: $(['', 'Mem', '8bit', 0x87588, '=', 'Value', '', 1]),
      value: $([
        'Measured',
        'Mem',
        '32bit',
        0x927f8,
        '*',
        'Value',
        '',
        2,
      ]),
    },
    id: 9163,
  })
}

export default set
