import { AchievementSet, define as $ } from '@cruncheevos/core'

const trackIdToName = {
  1: 'Altima VII',
  2: 'Karbonis V',
  3: 'Terramax',
  4: 'Korodera',
  5: 'Arridos IV',
  6: 'SilverStream',
  7: 'FireStar',
  8: 'Altima VII',
  9: 'Karbonis V',
  10: 'Terramax',
  11: 'Korodera',
  12: 'Arridos IV',
  13: 'SilverStream',
  14: 'FireStar',
}

function inGameTimeFromStr(input: string) {
  const [minutes, seconds, milliseconds] = input.split(/[:.]/).map(Number)

  const totalMilliseconds = ((minutes * 60 + seconds) * 1000 + milliseconds * 100)
  return totalMilliseconds * 60 / 1000
}

const set = new AchievementSet({ gameId: 11378, title: 'Wipeout' })

for (const [title, points, trackId, targetTime] of [
  ['Venomous Trial I', 10, 1, '03:39.0'],
  ['Venomous Trial II', 10, 2, '02:18.0'],
  ['Venomous Trial III', 10, 3, '02:18.6'],
  ['Venomous Trial IV', 10, 4, '03:45.0'],
  ['Venomous Trial V', 10, 5, '03:19.5'],
  ['Venomous Trial VI', 10, 6, '02:30.0'],
  ['Venomous Trial VII', 10, 7, '02:33.0'],
  ['Rapier Trial I', 10, 8, '02:43.5'],
  ['Rapier Trial II', 10, 9, '01:44.1'],
  ['Rapier Trial III', 10, 10, '01:46.8'],
  ['Rapier Trial IV', 10, 11, '03:00.0'],
  ['Rapier Trial V', 10, 12, '02:37.5'],
  ['Rapier Trial VI', 10, 13, '02:07.8'],
  ['Rapier Trial VII', 10, 14, '02:09.0']
] as const) {
  const trackName = trackIdToName[trackId]
  const className = trackId > 7 ? 'Rapier' : 'Venom'

  set.addAchievement({
    title,
    description: `[Time Trial] Finish ${trackName} (${className} Class) in ${targetTime} or less`,
    points,
    conditions: $(
      ['', 'Mem', '8bit', 0x1f7012, '=', 'Value', '', 3],
      ['', 'Mem', '8bit', 0x1f7008, '=', 'Value', '', trackId],
      ['', 'Delta', '8bit', 0x7e4cc, '=', 'Value', '', 3],
      ['', 'Mem', '8bit', 0x7e4cc, '=', 'Value', '', 4],
      ['', 'Mem', '8bit', 0x7ded0, '!=', 'Value', '', 0],
      ['AddAddress', 'Mem', '8bit', 0x1f700a, '*', 'Value', '', 4],
      ['AddAddress', 'Mem', '24bit', 0x1fef98],
      ['AddSource', 'Mem', '32bit', 0xb8],
      ['AddAddress', 'Mem', '8bit', 0x1f700a, '*', 'Value', '', 4],
      ['AddAddress', 'Mem', '24bit', 0x1fef98],
      ['AddSource', 'Mem', '32bit', 0xbc],
      ['AddAddress', 'Mem', '8bit', 0x1f700a, '*', 'Value', '', 4],
      ['AddAddress', 'Mem', '24bit', 0x1fef98],

      // 5 frames still equals 0 milliseconds, so account for that.
      // But unfortunately in-game math may result in total time
      // matching the target one and making player think that result is unfair
      ['', 'Mem', '32bit', 0xc0, '<=', 'Value', '', inGameTimeFromStr(targetTime) + 5],
    )
  })
}

export default set
