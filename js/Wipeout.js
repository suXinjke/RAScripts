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

function timeTrialConditions(opts) {
  const [minutes, seconds, milliseconds] = opts.timeTarget.split(/[:.]/).map(Number)

  const totalMilliseconds = ((minutes * 60 + seconds) * 1000 + milliseconds * 100)
  const timeInFrames = totalMilliseconds * 60 / 1000

  const trackName = trackIdToName[opts.trackId]
  const className = opts.trackId > 7 ? 'Rapier' : 'Venom'

  return {
    description: `[Time Trial] Finish ${trackName} (${className} Class) in ${opts.timeTarget} or less`,

    conditions: $(
      ['', 'Mem', '8bit', 0x1f7012, '=', 'Value', '', 3],
      ['', 'Mem', '8bit', 0x1f7008, '=', 'Value', '', opts.trackId],
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
      ['', 'Mem', '32bit', 0xc0, '<=', 'Value', '', timeInFrames + 5],
    )
  }
}

const set = new AchievementSet({ gameId: 11378, title: 'Wipeout' })

set.addAchievement({
  title: 'Venomous Trial I',
  points: 10,
  ...timeTrialConditions({
    trackId: 1,
    timeTarget: '03:39.0'
  }),
  badge: '285984'
})

set.addAchievement({
  title: 'Venomous Trial II',
  points: 10,
  ...timeTrialConditions({
    trackId: 2,
    timeTarget: '02.18.0',
  }),
  badge: '285984'
})

set.addAchievement({
  title: 'Venomous Trial III',
  points: 10,
  ...timeTrialConditions({
    trackId: 3,
    timeTarget: '02:18.6',
  }),
  badge: '285984'
})

set.addAchievement({
  title: 'Venomous Trial IV',
  points: 10,
  ...timeTrialConditions({
    trackId: 4,
    timeTarget: '03:45.0',
  }),
  badge: '285984'
})

set.addAchievement({
  title: 'Venomous Trial V',
  points: 10,
  ...timeTrialConditions({
    trackId: 5,
    timeTarget: '03:19.5',
  }),
  badge: '285984'
})

set.addAchievement({
  title: 'Venomous Trial VI',
  points: 10,
  ...timeTrialConditions({
    trackId: 6,
    timeTarget: '02:30.0',
  }),
  badge: '285984'
})

set.addAchievement({
  title: 'Venomous Trial VII',
  points: 10,
  ...timeTrialConditions({
    trackId: 7,
    timeTarget: '02:33.0',
  }),
  badge: '285984'
})

set.addAchievement({
  title: 'Rapier Trial I',
  points: 10,
  ...timeTrialConditions({
    trackId: 7 + 1,
    timeTarget: '02:43.5',
  }),
  badge: '285985'
})

set.addAchievement({
  title: 'Rapier Trial II',
  points: 10,
  ...timeTrialConditions({
    trackId: 7 + 2,
    timeTarget: '01:44.1'
  }),
  badge: '285985'
})

set.addAchievement({
  title: 'Rapier Trial III',
  points: 10,
  ...timeTrialConditions({
    trackId: 7 + 3,
    timeTarget: '01:46.8',
  }),
  badge: '285985'
})

set.addAchievement({
  title: 'Rapier Trial IV',
  points: 10,
  ...timeTrialConditions({
    trackId: 7 + 4,
    timeTarget: '03:00.0',
  }),
  badge: '285985'
})

set.addAchievement({
  title: 'Rapier Trial V',
  points: 10,
  ...timeTrialConditions({
    trackId: 7 + 5,
    timeTarget: '02:37.5',
  }),
  badge: '285985'
})

set.addAchievement({
  title: 'Rapier Trial VI',
  points: 10,
  ...timeTrialConditions({
    trackId: 7 + 6,
    timeTarget: '02:07.8',
  }),
  badge: '285985'
})

set.addAchievement({
  title: 'Rapier Trial VII',
  points: 10,
  ...timeTrialConditions({
    trackId: 7 + 7,
    timeTarget: '02.09.0'
  }),
  badge: '285985'
})

export default set
