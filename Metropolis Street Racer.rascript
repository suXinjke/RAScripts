// Metropolis Street Racer
// #ID = 343

// ============
// LOOKUP FUNCS
// ============

function currentEventId() => dword(0x186104)

// 0xFFFFFFFF - no selection
function garageSlotSelected() => dword(0x186424)

function garageSlotsAvailable() => dword(0x186428)

function garageSlotNotEmpty( garageSlotIndex ) => dword(0x186434 + garageSlotIndex * 0x40)

function garageSlotCarId( garageSlotIndex ) => dword(0x186438 + garageSlotIndex * 0x40)

function garageSlotCarABS( garageSlotIndex ) => dword(0x18646c + garageSlotIndex * 0x40)

function currentCarId() => garageSlotCarId( garageSlotSelected() )

function currentCarABS() => garageSlotCarABS( garageSlotSelected() )

// TODO: replace with float when it's supported
function inGameCarMileage() => dword(0x1A2B14)

// Can be 0xFFFF at the start of the event
function inGameLapsPassed() => word(0x1A2CD2)

// 0x00 - 1st position
function inGameRacePosition() => byte(0x1A2CD8)

// 0x01 - Automatic
// 0x00 - Manual
function inGameTransmission() => byte(0x51FA7C)

// 0x00000000 - Neutral
// 0xFFFFFFFF - Reverse
function inGameGear() => dword(0x51FAB0)

function inGamePaused() => dword(0x53B380)

function inGamePenalties() => word(0x1863be)

function inGameKudosSignIntensity() => dword(0x53ba98)
function inGameKudosSignDisappearTimeLeft() => dword(0x53ba80)

function chapterEventFlagsAddress( chapterIndex, eventIndex ) {
    chapterOffset = ( 0x10 * 10 * chapterIndex )
    eventOffset = eventIndex * 0x10
    return 0x1866d8 + chapterOffset + eventOffset
}

function quickRaceOpponentCarId( opponentIndex ) {
    return dword( 0x188fb0 + opponentIndex * 0x4 )
}

function quickRaceAmountOfLaps() => dword(0x188f5c)

function grassCheat() => dword(0x1ac38c)

// 0x05 - Time Attack
// 0x06 - Ghost Attack
// 0x08 - Street Racing (Career)
// 0x09 - Speed Challenge (Internet)
// 0x0B - Quick Race
// 0x0C - Test Drive
// 0xFFFFFFFF - None of that
function gameMode() => dword(0x186120)

// 0x0 - Hotlap
// 0x1 - Timed Run
// 0x3 - One On One
// 0x5 - Street Race / Championship
// 0x6 - Challenge
function eventType() => dword(0x18611c)

// 0x5 - Top Speed
// 0x7 - Average Split Speed
// 0x9 - Overtakes
// 0xA - Lap an Opponent
function challengeEventType() => dword(0x186124)

function oneOnOneHeadstartSeconds() => dword(0x113b6c)

// ============
// AUX    FUNCS
// ============

// Values in these addresses change depending on menu screen,
// but I'm not sure if this combination is unique
function isLoadingSave() => __ornext(
    (word(0x53c08c) == 0xB && word(0x53c0b0) == 0x17) ||
    (prior(word(0x53c08c)) == 0xB && prior(word(0x53c0b0)) == 0x17)
)

function gameIsNotLoading() => dword(0x53bfc8) != 0x0

function isInGame() {
    return (
        word(0x53c0b2) == 0xA &&
        // not in demo mode
        dword(0x1a3f40) == 0x0
    )
}

function gotInGame() {
    return (
        prev(word(0x53c0b2)) == 0x64 &&
        word(0x53c0b2) == 0xA
    )
}

function gotInMainMenu() {
    return (
        prev(word(0x53c0b2)) == 0xA &&
        word(0x53c0b2) == 0x64
    )
}

function hasFinished() => dword(0x1a2d04) == 0x1 && prev(dword(0x1a2d04)) != 0x1

function showroomCarUnlockedLegit( carIndex ) {
    address = 0x188b68 + carIndex * 4
    return (
        prev(dword(address)) == 0 && __ornext(
            dword(address) == 1 ||
            dword(address) == 3
        )
    )
}

function didntGetPenalty() => inGamePenalties() == prev(inGamePenalties())
function gotPenalty() => inGamePenalties() > prev(inGamePenalties())

function inQuickRace() => gameMode() == 0xB
function inHotlapEvent() => gameMode() == 0x8 && eventType() == 0x0
function inTimedRunEvent() => gameMode() == 0x8 && eventType() == 0x1
function inStreetRacingEvent() => gameMode() == 0x8 && eventType() == 0x5
function inChampionshipEvent() => gameMode() == 0x8 && eventType() == 0x5
function inOneOnOneEvent() => gameMode() == 0x8 && eventType() == 0x3
function inChallengeOvertakeEvent() => gameMode() == 0x8 && eventType() == 0x6 && challengeEventType() == 0x9
function inChallengeTopSpeedEvent() => gameMode() == 0x8 && eventType() == 0x6 && challengeEventType() == 0x5

function hasWonChampionship( racesAmount, expectedChampionshipPoints = 0 ) {
    lastRacePlayersPositionAddress = 0x1862a0 + 0x1C * ( racesAmount - 1 )
    championshipResultsRow1OpponentID = dword(0x54fb6c)

    gotExpectedPointsConditions = true
    if ( expectedChampionshipPoints > 0 ) {
        gotExpectedPointsConditions = dword(0x54fb3c) == expectedChampionshipPoints
    }

    return (
        prev(dword(lastRacePlayersPositionAddress)) == 0x0 &&
        dword(lastRacePlayersPositionAddress) != 0x0 &&
        championshipResultsRow1OpponentID == 0x0 &&
        gotExpectedPointsConditions
    )
}

function chapterCompletionAchievement( title, chapterIndex, showroomRowIndex, points ) {
    type = "progression"
    if (chapterIndex == 24) {
      type = ""
    }

    achievement(
        title = title,
        type = type,
        description = format( "Complete all events in chapter {0}", chapterIndex + 1 ),
        points = points,
        trigger = (
            showroomCarUnlockedLegit( showroomRowIndex ) &&
            unless( isLoadingSave() )
        )
    )
}

function streetRaceChallengeAchievement(
    title,
    description,
    points,
    carIds,
    eventId,
    noPenalty = false,
    noHeadstart = false
) {
    gameModeConditions = inStreetRacingEvent()

    winningConditions = (
        isInGame() &&
        trigger_when(
          inGameRacePosition() == 0 &&
          hasFinished()
        )
    )

    noPenaltyConditions = true
    if ( noPenalty == true ) {
        noPenaltyConditions = (
            once(gotInGame()) &&
            never(gotPenalty() || gotInMainMenu())
        )

        winningConditions = trigger_when( winningConditions )
    }

    noHeadstartConditions = true
    if ( noHeadstart == true ) {
        noHeadstartConditions = (
            oneOnOneHeadstartSeconds() >= 0x0 &&
            oneOnOneHeadstartSeconds() <= 0x7fffffff
        )

        gameModeConditions = inOneOnOneEvent()
    }

    achievement(
        title = title,
        description = description,
        points = points,
        trigger = (
            gameModeConditions &&
            currentEventId() == eventId &&
            any_of(
                carIds,
                carId => currentCarId() == carId
            ) &&
            noPenaltyConditions &&
            noHeadstartConditions &&
            winningConditions
        )
    )
}

function championshipChallengeAchievement(
    title,
    description,
    points,
    carIds,
    eventId,
    racesAmount,
    expectedChampionshipPoints = 0,
    isOneOnOne = false
) {
    noHeadstartConditions = true

    eventConditions = inChampionshipEvent()
    if ( isOneOnOne == true ) {
        eventConditions = inOneOnOneEvent()

        noHeadstartConditions = (
            oneOnOneHeadstartSeconds() >= 0x0 &&
            oneOnOneHeadstartSeconds() <= 0x7fffffff
        )
    }

    achievement(
        title = title,
        description = description,
        points = points,
        trigger = (
            eventConditions &&
            noHeadstartConditions &&
            currentEventId() == eventId &&
            any_of(
                carIds,
                carId => currentCarId() == carId
            ) &&
            trigger_when(
              hasWonChampionship( racesAmount, expectedChampionshipPoints )
            )
        )
    )
}

function hotlapChallengeAchievement(
    title,
    description,
    points,
    carId,
    eventId,
    targetTimeMsec = 0,
    averageTargetTimeMsec = 0,
    noPenalty = false
) {

    timeAfterPassingLastCheckpoint = dword(0x1a2b3c)

    winningConditions = (
        isInGame() &&
        inGameLapsPassed() > prev(inGameLapsPassed()) &&
        prev(timeAfterPassingLastCheckpoint) != timeAfterPassingLastCheckpoint &&
        timeAfterPassingLastCheckpoint < targetTimeMsec
    )

    if ( averageTargetTimeMsec > 0 ) {
        currentAverageLapTimeMsec = dword(0x1a2d34)

        winningConditions = (
            isInGame() &&
            hasFinished() &&
            currentAverageLapTimeMsec < averageTargetTimeMsec
        )
    }

    noPenaltyConditions = true
    if ( noPenalty == true ) {
        // HACK: the lap must be fully marked with hits *a frame after* the lap value changes,
        // otherwise achievements can unlock no matter the amount of penalties.
        noPenaltyConditions = (
            repeated(2,
                once(
                    prev(inGameLapsPassed()) != inGameLapsPassed()
                ) &&
                prev(inGameLapsPassed()) == inGameLapsPassed()
            ) &&
            never(gotPenalty() || gotInMainMenu())
        )
    }

    achievement(
        title = title,
        description = description,
        points = points,
        trigger = (
            inHotlapEvent() &&
            currentEventId() == eventId &&
            currentCarId() == carId &&
            noPenaltyConditions &&
            trigger_when(winningConditions)
        )
    )
}

function timedRunChallengeAchievement( title, description, points, carId, eventId, targetTimeMsec ) {
    challengeMsecLeft = dword(0x186110)
    challengeTargetTimeMsec = dword(0x113b70)

    achievement(
        title = title,
        description = description,
        points = points,
        trigger = (
            inTimedRunEvent() &&
            currentEventId() == eventId &&
            currentCarId() == carId &&
            isInGame() &&
            trigger_when(
              hasFinished() &&
              challengeMsecLeft > 0 &&
              challengeTargetTimeMsec <= targetTimeMsec
            )
        )
    )
}

function overtakeChallengeAchievement( title, description, points, carId, eventId, overtakes, noPenalty = false ) {
    inGameCarsOvertakenInChallengeMode = dword(0x1A4108)

    winningConditions = (
        isInGame() &&
        hasFinished() &&
        inGameCarsOvertakenInChallengeMode >= overtakes &&
        inGameCarsOvertakenInChallengeMode <= 0x7FFFFFFF
    )

    noPenaltyConditions = true
    if ( noPenalty == true ) {
        noPenaltyConditions = (
            once(gotInGame()) &&
            never(gotPenalty() || gotInMainMenu())
        )
    }

    achievement(
        title = title,
        description = description,
        points = points,
        trigger = (
            inChallengeOvertakeEvent() &&
            currentEventId() == eventId &&
            currentCarId() == carId &&
            noPenaltyConditions &&
            trigger_when(winningConditions)
        )
    )
}

// ============
// ACHIEVEMENTS
// ============

achievement(
    title = "Welcome to Metropolis",
    description = "Get your first car by completing it's challenge",
    points = 1,
    type = "progression",
    trigger = (
        byte(chapterEventFlagsAddress( 0, 0 )) == 0x01 &&
        byte(chapterEventFlagsAddress( 0, 1 )) == 0x01 &&
        byte(chapterEventFlagsAddress( 0, 2 )) == 0x01 &&
        __ornext(
            garageSlotNotEmpty( 0 ) != 0 ||
            garageSlotNotEmpty( 1 ) != 0 ||
            garageSlotNotEmpty( 2 ) != 0
        ) &&
        unless( isLoadingSave() )
    )
)

achievement(
    title = "Personal Favorite",
    description = "Drive over 365 km / 226.8 mi in any of your cars",
    points = 5,
    trigger = (
        isInGame() &&
        // float binary value for 365 * 1000 Meters
        // TODO: use floating point value when it's supported
        prev(inGameCarMileage()) < 0x48b23900 &&
        inGameCarMileage() >= 0x48b23900
    )
)

chapterCompletionAchievement( "Training Complete", 0,  0x03, 5  )
chapterCompletionAchievement( "Beginner",          1,  0x04, 5  )
chapterCompletionAchievement( "Learner",           2,  0x06, 5  )
chapterCompletionAchievement( "Novice",            3,  0x07, 5  )
chapterCompletionAchievement( "Amateur",           4,  0x09, 10 )
chapterCompletionAchievement( "Rookie",            5,  0x0a, 5  )
chapterCompletionAchievement( "Developing",        6,  0x0c, 5  )
chapterCompletionAchievement( "Improving",         7,  0x0d, 5  )
chapterCompletionAchievement( "Advancing",         8,  0x0f, 5  )
chapterCompletionAchievement( "Progressing",       9,  0x10, 10 )
chapterCompletionAchievement( "Intermediate",      10, 0x12, 5  )
chapterCompletionAchievement( "Competent",         11, 0x13, 5  )
chapterCompletionAchievement( "Capable",           12, 0x15, 5  )
chapterCompletionAchievement( "Proficient",        13, 0x16, 5  )
chapterCompletionAchievement( "Qualified",         14, 0x18, 10 )
chapterCompletionAchievement( "Skilled",           15, 0x19, 5  )
chapterCompletionAchievement( "Successful",        16, 0x1b, 5  )
chapterCompletionAchievement( "Accomplished",      17, 0x1c, 5  )
chapterCompletionAchievement( "Professional",      18, 0x1e, 5  )
chapterCompletionAchievement( "Renowned",          19, 0x1f, 10 )
chapterCompletionAchievement( "Specialist",        20, 0x21, 5  )
chapterCompletionAchievement( "Expert",            21, 0x22, 5  )
chapterCompletionAchievement( "Exceptional",       22, 0x24, 5  )
chapterCompletionAchievement( "Perfect",           23, 0x26, 5  )
chapterCompletionAchievement( "World Champion",    24, 0x28, 25 )

achievement(
    title = "Property Mine",
    description = "Unlock 6 garage slots for your cars",
    points = 10,
    trigger = (
        prev(garageSlotsAvailable()) == 5 &&
        garageSlotsAvailable() == 6 &&
        unless( isLoadingSave() )
    )
)

function tenOfAKind() {
    amountOfEventsWithJokersCompleted = sum_of(
        range( 0, 24 ),
        chapterIndex => sum_of(
            range( 0, 9 ),
            eventIndex => byte(chapterEventFlagsAddress( chapterIndex, eventIndex )) / 0x1F
        )
    )

    achievement(
        title = "Ten of a Kind",
        description = "Have 10 events completed with Jokers applied to them",
        points = 10,
        trigger = (
            prev(amountOfEventsWithJokersCompleted) < 10 &&
            amountOfEventsWithJokersCompleted == 10 &&
            unless( isLoadingSave() )
        )
    )
}
tenOfAKind()

achievement(
    title = "In Control",
    description = "Win any Street Race event while driving a car with manual transmission and ABS off",
    points = 10,
    trigger = (
        currentCarABS() == 0x0 &&
        inGameTransmission() == 0x0 &&
        inStreetRacingEvent() &&
        isInGame() &&
        hasFinished() &&
        inGameRacePosition() == 0
    )
)

achievement(
    title = "Driving With Style",
    description = "Make a really good drift",
    points = 5,
    trigger = (
        isInGame() &&
        // AndNextChain
        // 1. No penalty for 1 second
        // 2. Max kudos sign intensity reached
        // 3. Sign disappeared
        once(
            once(
                repeated(
                    60,
                    gameIsNotLoading() &&
                    inGamePaused() == 0x0 &&
                    didntGetPenalty()
                ) &&
                inGameKudosSignDisappearTimeLeft() > 0 &&
                inGameKudosSignIntensity() == 5
            ) &&
            inGameKudosSignDisappearTimeLeft() == 0
        ) &&
        never(gotPenalty() || gotInMainMenu() || inGamePaused() == 1)
    )
)

achievement(
    title = "Anti-Kudos Behaviour",
    description = "Win any Street Race event while crossing the finish line in reverse gear",
    points = 5,
    trigger = (
        inStreetRacingEvent() &&
        isInGame() &&
        inGameRacePosition() == 0 &&
        inGameGear() == 0xFFFFFFFF &&
        hasFinished()
    )
)

streetRaceChallengeAchievement(
    title = "The Little Boat",
    description = "Driving Fiat Barchetta, win the Street Race in Chapter 1, Event 9 without penalty",
    points = 5,
    carIds = [ 0x0 ],
    eventId = 0x8,
    noPenalty = true
)

championshipChallengeAchievement(
    title = "The Roadster That Could",
    description = "Driving Mazda MX-5 / Miata / Roadster, win both Championship races of Chapter 3, Event 10",
    points = 5,
    carIds = [ 0x1, 0x2, 0x3 ],
    eventId = 0x1D,
    racesAmount = 2,
    expectedChampionshipPoints = 20
)

hotlapChallengeAchievement(
    title = "British Sports Brilliance",
    description = "Driving MG MGF, set a lap time of 21 seconds or better without penalty in Chapter 3, Event 1",
    points = 5,
    carId = 0x4,
    eventId = 0x14,
    targetTimeMsec = 21000,
    noPenalty = true
)

streetRaceChallengeAchievement(
    title = "From the Stars",
    description = "Driving Opel Astra Coupe, win the One on One battle in Chapter 3, Event 6 without giving yourself a headstart",
    points = 5,
    carIds = [ 0x5 ],
    eventId = 0x19,
    noHeadstart = true
)

timedRunChallengeAchievement(
    title = "Megane Around the Corner",
    description = "Driving Renault Megane, set a target time of 3:03 and beat it in Chapter 3, Event 3",
    points = 5,
    carId = 0x6,
    eventId = 0x16,
    targetTimeMsec = 180 * 1000 + 3000
)

hotlapChallengeAchievement(
    title = "Goosebumps Guaranteed",
    description = "Driving Opel Astra OPC, set an average lap time of less than 26 seconds in Chapter 6, Event 2",
    points = 5,
    carId = 0x7,
    eventId = 0x33,
    averageTargetTimeMsec = 26000
)

streetRaceChallengeAchievement(
    title = "The Mechanics of Emotion",
    description = "Driving Alfa Romeo Spider, win the Street Race in Chapter 7, Event 7",
    points = 5,
    carIds = [ 0x8 ],
    eventId = 0x42
)

timedRunChallengeAchievement(
    title = "The Bestseller",
    description = "Driving Peugeot 206, set a target time of 4:01 and beat it in Chapter 4, Event 3",
    points = 5,
    carId = 0x9,
    eventId = 0x20,
    targetTimeMsec = 241 * 1000
)

timedRunChallengeAchievement(
    title = "Tokyo Run",
    description = "Driving Peugeot 306 Cabriolet, set a target time of 2:05 and beat it in Chapter 5, Event 2",
    points = 5,
    carId = 0xA,
    eventId = 0x29,
    targetTimeMsec = 125 * 1000
)

timedRunChallengeAchievement(
    title = "French Taxi",
    description = "Driving Peugeot 406 Coupe, set a target time of 5:30 and beat it in Chapter 8, Event 4",
    points = 5,
    carId = 0xB,
    eventId = 0x49,
    targetTimeMsec = 330 * 1000
)

championshipChallengeAchievement(
    title = "Not Oversteer Enough",
    description = "Driving Toyota MR-2, win the Championship in Chapter 12, Event 10",
    points = 10,
    carIds = [ 0xC ],
    eventId = 0x77,
    racesAmount = 3
)

hotlapChallengeAchievement(
    title = "W30",
    description = "Driving Toyota MR-S, set a lap time of 1:17.3 or better without penalty in Chapter 8, Event 1",
    points = 5,
    carId = 0xD,
    eventId = 0x46,
    targetTimeMsec = 77300,
    noPenalty = true
)

championshipChallengeAchievement(
    title = "A Family Thing",
    description = "Driving Peugeot 306 Hatchback, win the Championship in Chapter 8, Event 10",
    points = 10,
    carIds = [ 0xE ],
    eventId = 0x4F,
    racesAmount = 3
)

hotlapChallengeAchievement(
    title = "Sportlich, Leicht, Kurz",
    description = "Driving Mercedes-Benz SLK, set an average lap time of less than 52 seconds in Chapter 13, Event 2",
    points = 5,
    carId = 0xF,
    eventId = 0x79,
    averageTargetTimeMsec = 52000
)

streetRaceChallengeAchievement(
    title = "Generation R129",
    description = "Driving Mercedes-Benz SL 320, win the Street Race in Chapter 10, Event 7",
    points = 5,
    carIds = [ 0x10 ],
    eventId = 0x60
)

championshipChallengeAchievement(
    title = "Cuore Sportivo",
    description = "Driving Alfa Romeo 156, win the Championship in Chapter 11, Event 10",
    points = 10,
    carIds = [ 0x11 ],
    eventId = 0x6D,
    racesAmount = 4
)

overtakeChallengeAchievement(
    title = "Hothatch Roundabout",
    description = "Driving Audi S3, overtake 11 cars or more in Chapter 1, Event 7 without a penalty",
    points = 5,
    carId = 0x12,
    eventId = 0x6,
    overtakes = 11,
    noPenalty = true
)

championshipChallengeAchievement(
    title = "Tourist Trophy",
    description = "Driving Audi TT Roadster, win the Championship in Chapter 16, Event 10",
    points = 10,
    carIds = [ 0x13 ],
    eventId = 0x9F,
    racesAmount = 4
)

overtakeChallengeAchievement(
    title = "Gran Turismo Veloce",
    description = "Driving Alfa Romeo GTV, overtake 10 cars or more in Chapter 12, Event 5",
    points = 5,
    carId = 0x14,
    eventId = 0x72,
    overtakes = 10
)

streetRaceChallengeAchievement(
    title = "Driven by Instinct",
    description = "Driving Audi TT Coupe, win the Street Race in Chapter 14, Event 9 without penalty",
    points = 5,
    carIds = [ 0x15 ],
    eventId = 0x8A,
    noPenalty = true
)

streetRaceChallengeAchievement(
    title = "Project W94",
    description = "Driving Renault Spider, win the Street Race in Chapter 16, Event 9",
    points = 5,
    carIds = [ 0x16 ],
    eventId = 0x9E
)

streetRaceChallengeAchievement(
    title = "Celestial",
    description = "Driving Toyota Celica '99, win the One on One battle in Chapter 13, Event 6 without penalty and giving yourself a headstart",
    points = 5,
    carIds = [ 0x17 ],
    eventId = 0x7D,
    noPenalty = true,
    noHeadstart = true
)

streetRaceChallengeAchievement(
    title = "Speed to Match Its Looks",
    description = "Driving Fiat Coupe 20v turbo, win the Street Race in Chapter 16, Event 7",
    points = 5,
    carIds = [ 0x18 ],
    eventId = 0x9C
)

overtakeChallengeAchievement(
    title = "Looks Fast",
    description = "Driving Toyota Celica, overtake 10 cars or more in Chapter 18, Event 4",
    points = 10,
    carId = 0x19,
    eventId = 0xAD,
    overtakes = 10
)

timedRunChallengeAchievement(
    title = "Fresco Turismo Omologato",
    description = "Driving Mitsubishi FTO, set a target time of 4:27 and beat it in Chapter 12, Event 3",
    points = 10,
    carId = 0x1A,
    eventId = 0x70,
    targetTimeMsec = 267000
)

streetRaceChallengeAchievement(
    title = "Battle of the Generations",
    description = "Driving Mitsubishi Eclipse / Spyder, win the One on One battle in Chapter 17, Event 6 without giving yourself a headstart",
    points = 5,
    carIds = [ 0x1B, 0x1C ],
    eventId = 0xA5,
    noHeadstart = true
)

hotlapChallengeAchievement(
    title = "Thoroughbred",
    description = "Driving Mitsubishi Eclipse '99, set an average lap time of less than 42.4 seconds in Chapter 17, Event 1",
    points = 5,
    carId = 0x1D,
    eventId = 0xA0,
    averageTargetTimeMsec = 42400
)

championshipChallengeAchievement(
    title = "Guts of Elise",
    description = "Driving Opel Speedster / Vauxhall VX 220, win the Championship in Chapter 22, Event 10",
    points = 10,
    carIds = [ 0x1E, 0x1F ],
    eventId = 0xDB,
    racesAmount = 5
)

function topSpeed3000GTChallenge() {

    onNextFrame = prev(dword(0x1524d0)) != dword(0x1524d0)

    // AndNext chain from innermost to outermost
    // 1. No penalty for 1 second
    // 2. Reached 250 KPH
    // 3. No penalty for 5 seconds
    step1 = repeated(60, gameIsNotLoading() && inGamePaused() == 0x0 && didntGetPenalty())
    step12 = repeated(1,
        step1 &&
        dword(0x5b82c0) >= 0x44f2a000 // 1941.0f
    )
    step123 = trigger_when(
        repeated(60 * 5,
            step12 &&
            inGamePaused() == 0x0 &&
            onNextFrame
        )
    )

    achievement(
        title = "Speed Conservation",
        description = "Driving Mistubishi 3000GT / GTO, reach speed of 250 KPH / 155.3 MPH and receive no penalty for 5 seconds afterwards in Chapter 23, Event 4",
        points = 5,
        trigger = (
            inChallengeTopSpeedEvent() &&
            currentEventId() == 0xDF &&
            (
                currentCarId() == 0x20 ||
                currentCarId() == 0x21
            ) &&
            step123 &&

            // HACK: to help in forcing Trigger icon to appear
            step12 &&
            never(gotPenalty() || gotInMainMenu())
        )
    )
}
topSpeed3000GTChallenge()

championshipChallengeAchievement(
    title = "Built to Last",
    description = "Driving Ford Mustang, win the Championship in Chapter 17, Event 10",
    points = 10,
    carIds = [ 0x22 ],
    eventId = 0xA9,
    racesAmount = 4
)

championshipChallengeAchievement(
    title = "Is That a...",
    description = "Driving Toyota Supra, win the Championship in Chapter 20, Event 10",
    points = 10,
    carIds = [ 0x23 ],
    eventId = 0xC7,
    racesAmount = 5
)

championshipChallengeAchievement(
    title = "My Fair Lady",
    description = "Driving Nissan Fairlady Z / Convertible / 300ZX, win the Championship in Chapter 21, Event 10",
    points = 10,
    carIds = [ 0x24, 0x25, 0x26 ],
    eventId = 0xD1,
    racesAmount = 5
)

streetRaceChallengeAchievement(
    title = "MGB Reincarnate",
    description = "Driving MG RV8, win the One on One battle in Chapter 14, Event 6 without giving yourself a headstart",
    points = 5,
    carIds = [ 0x27 ],
    eventId = 0x87,
    noHeadstart = true
)

streetRaceChallengeAchievement(
    title = "Drifting Legend",
    description = "Driving Nissan Silvia / Varietta, win the Street Race in Chapter 19, Event 6",
    points = 5,
    carIds = [ 0x28, 0x29 ],
    eventId = 0xB9
)

streetRaceChallengeAchievement(
    title = "Compact Trophy",
    description = "Driving Renault Clio V6, win the Street Race in Chapter 22, Event 9",
    points = 5,
    carIds = [ 0x2A ],
    eventId = 0xDA
)

overtakeChallengeAchievement(
    title = "Midtown Madness",
    description = "Driving Toyota Celica GT-Four, overtake 10 cars or more in Chapter 14, Event 4",
    points = 10,
    carId = 0x2B,
    eventId = 0x85,
    overtakes = 10
)

championshipChallengeAchievement(
    title = "Rotary Experiment",
    description = "Driving Mazda RX-7, win all three One on One battles in Global Challenge, Event 5 without giving yourself a headstart",
    points = 10,
    carIds = [ 0x2C ],
    eventId = 0xF4,
    racesAmount = 3,
    expectedChampionshipPoints = 3,
    isOneOnOne = true
)

streetRaceChallengeAchievement(
    title = "Made From Griffith Leftovers",
    description = "Driving TVR Chimaera, win the Street Race in Chapter 23, Event 6",
    points = 5,
    carIds = [ 0x2D ],
    eventId = 0xE1
)

streetRaceChallengeAchievement(
    title = "Yellow Color Not Included",
    description = "Driving Mitsubishi Lancer VI EVO, win the Street Race in Chapter 24, Event 7",
    points = 5,
    carIds = [ 0x2E ],
    eventId = 0xEC
)

championshipChallengeAchievement(
    title = "The Final Jensen",
    description = "Driving Jensen S-V8, win the Championship in Chapter 24, Event 10",
    points = 10,
    carIds = [ 0x2F ],
    eventId = 0xEF,
    racesAmount = 5
)

achievement(
    title = "Godzilla Attack",
    description = "Drive over 123 km / 76.4 mi in your Nissan Skyline GT-R",
    points = 5,
    trigger = (
        isInGame() &&
        currentCarId() == 0x30 &&
        // float binary value for 123 * 1000 Meters
        // TODO: use floating point value when it's supported
        prev(inGameCarMileage()) < 0x47f03c00 &&
        inGameCarMileage() >= 0x47f03c00
    )
)

busCarIds = [ 0x35, 0x36, 0x37 ]
achievement(
    title = "Metropolis Transit Racing",
    description = "Setup and win a Quick race between three buses from each city, with you driving one of them for atleast 5 laps",
    points = 10,
    trigger = (
        inQuickRace() &&
        all_of(
            busCarIds,
            busCarId => (
                currentCarId() == busCarId ||
                quickRaceOpponentCarId( 0 ) == busCarId ||
                quickRaceOpponentCarId( 1 ) == busCarId ||
                quickRaceOpponentCarId( 2 ) == busCarId ||
                quickRaceOpponentCarId( 3 ) == busCarId ||
                quickRaceOpponentCarId( 4 ) == busCarId
            )
        ) && (
            currentCarId() + 1 + sum_of(
                range( 0, 4 ),
                opponentIndex => quickRaceOpponentCarId( opponentIndex ) + 1
            ) == 0xA5
        ) &&
        quickRaceAmountOfLaps() >= 5 &&
        trigger_when(
            isInGame() &&
            inGameRacePosition() == 0 &&
            hasFinished()
        )
    )
)

taxiCarIds = [ 0x31, 0x32, 0x33 ]
achievement(
    title = "Crazy Taxi Showdown",
    description = "Setup and win a Quick race between three taxis from each city, with you driving one of them for atleast 5 laps",
    points = 5,
    trigger = (
        inQuickRace() &&
        all_of(
            taxiCarIds,
            taxiCarId => (
                currentCarId() == taxiCarId ||
                quickRaceOpponentCarId( 0 ) == taxiCarId ||
                quickRaceOpponentCarId( 1 ) == taxiCarId ||
                quickRaceOpponentCarId( 2 ) == taxiCarId ||
                quickRaceOpponentCarId( 3 ) == taxiCarId ||
                quickRaceOpponentCarId( 4 ) == taxiCarId
            )
        ) && (
            currentCarId() + 1 + sum_of(
                range( 0, 4 ),
                opponentIndex => quickRaceOpponentCarId( opponentIndex ) + 1
            ) == 0x99
        ) &&
        quickRaceAmountOfLaps() >= 5 &&
        trigger_when(
            isInGame() &&
            inGameRacePosition() == 0 &&
            hasFinished()
        )
    )
)

achievement(
    title = "Labor Day",
    description = "Setup and win a Quick race with 5 lawnmower opponents, with atleast 3 laps, with Grass cheat enabled, and drive a lawnmower yourself",
    points = 5,
    trigger = (
        inQuickRace() &&
        quickRaceOpponentCarId( 0 ) == 0x34 &&
        quickRaceOpponentCarId( 1 ) == 0x34 &&
        quickRaceOpponentCarId( 2 ) == 0x34 &&
        quickRaceOpponentCarId( 3 ) == 0x34 &&
        quickRaceOpponentCarId( 4 ) == 0x34 &&
        quickRaceAmountOfLaps() >= 3 &&
        grassCheat() != 0 &&
        trigger_when(
            isInGame() &&
            inGameRacePosition() == 0 &&
            hasFinished()
        )
    )
)
