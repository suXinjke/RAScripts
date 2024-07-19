// Driver
// #ID = 11391

// ============
// LOOKUP FUNCS
// ============

function missionId() => byte(0x096808)

function completed() => byte(0x096818)

function invincibilityCheat() => byte(0x09681C)

function noCopsCheat() => byte(0x096820)

function minisCheat() => byte(0x09d8e0)

function rearWheelCheat() => byte(0x09d8dc)

function stiltsCheat() => byte(0x09d8e4)

function antipodeanCheat() => byte(0x09d8ec)

function copsDifficulty() => byte(0x096870)

function playerCarForceStop() => byte(0x096878)

function checkpoints() => byte(0x0C6FD4)

function carParkMistakes() => byte(0x1e35b8)

// 4096 - one minute
function carParkTimer() => word(0x1e4278)

function playerDamage() => word(0x09b220)

// 0x00 - In-game
// 0x01 - Mission over
// 0x02 - Mission exit
// 0x03 - Mission restart
// 0x04 - Start director mode
function missionControl() => byte(0x09709c)

// 0x03 - Training
// 0x05 - Undercover Mission
// 0x11 - Trailblazer
// 0x12 - Cross Town Checkpoint
// 0x13 - Survival
// 0x14 - Pursuit
// 0x15 - Getaway
// 0x16 - Dirt Track Practice/Time Trial
// 0x17 - Take a drive
function gameMode() => byte(0x967f4)

function inGame() => byte(0x096fac)

function missionTimer() => dword(0x0c71a4)

function filmDirector() => byte(0x096899)

function practiceDemonstrationMode() => dword(0x096874)

function practicePoints() => dword(0x1e4018)

function practicePenalties() => dword(0x09745c)

// ============
// AUX    FUNCS
// ============

function noFilmDirector() => filmDirector() == 0

function withMissionCheatProtection() => noFilmDirector() && invincibilityCheat() == 0 && noCopsCheat() == 0

// This is alternative way of checking mission success,
// if you rely on 0x096818 flag only - it may become stale
// when you restart a mission (mostly issue with driving games)
function missionScriptIndicatesSuccess() {
    currentMissionScriptAddress = dword(0x0c71bc)

    return (
        prev(dword(currentMissionScriptAddress)) != 0x1 &&
        dword(currentMissionScriptAddress) == 0x1
    )
}

function completedRegularMission(missionId) => (
    withMissionCheatProtection() &&
    missionId() == missionId &&
    prev(completed()) == 0 && completed() == 1
)

// ====================
// MISSION ACHIEVEMENTS
// ====================

// Cheat protection not required, invincibility doesn't help and there are no cops
achievement(
    title = "Car Park Job", description = "Complete car park job.", points = 5,
    id = 84458, badge = "91364",
    trigger = (
        noFilmDirector() &&
        missionId() == 0xAE &&
        prev(completed()) == 0 && completed() == 1
    )
)

leaderboard(
    title = "Car Park",
    description = "Complete the Undercover park job or Car park practice WITHOUT REAR WHEEL cheat.",
    start = (
        inGame() == 1 &&
        noFilmDirector() &&
        practiceDemonstrationMode() == 0 &&
        (missionId() == 0xAD || missionId() == 0xAE) &&
        rearWheelCheat() == 0 &&
        prev(completed()) == 0 && completed() == 1
    ),
    cancel = always_false(),
    submit = always_true(),
    value = carParkTimer() / 0.6826666666666667,
    lower_is_better = true,
    format = "MILLISECS"
)

leaderboard(
    title = "Car Park - REAR WHEELS",
    description = "Complete the Undercover park job or Car park practice WITH REAR WHEEL cheat.",
    start = (
        inGame() == 1 &&
        noFilmDirector() &&
        practiceDemonstrationMode() == 0 &&
        (missionId() == 0xAD || missionId() == 0xAE) &&
        rearWheelCheat() == 1 &&
        prev(completed()) == 0 && completed() == 1
    ),
    cancel = always_false(),
    submit = always_true(),
    value = carParkTimer() / 0.6826666666666667,
    lower_is_better = true,
    format = "MILLISECS"
)

achievement(
    title = "Case for a Key",
    description = "Complete Miami missions: Hide the Evidence -> Case for a Key.",
    points = 10,
    trigger = completedRegularMission(0x38)
)

achievement(
    title = "The Clean Up",
    description = "Complete Miami missions: Ticco's Ride -> The Clean Up.",
    points = 5,
    trigger = completedRegularMission(0x35)
)

achievement(
    title = "A Shipment's Coming In",
    description = "Complete Miami missions: Payback -> A Shipment's Coming In.",
    points = 10,
    trigger = completedRegularMission(0xA)
)

achievement(
    title = "Take Out Di'Angio's Car",
    description = "Complete Miami missions: Superfly Drive -> Take Out Di'Angio's Car.",
    points = 5,
    id = 84645,
    badge = "92216",
    trigger = completedRegularMission(0xC)
)


achievement(
    title = "Bait for a Trap",
    description = "Complete Miami missions: Superfly Drive -> Bait for a Trap.",
    points = 5,
    trigger = completedRegularMission(0xB)
)

achievement(
    title = "The Informant",
    description = "Complete final Miami mission: The Informant.",
    points = 10,
    id = 84460,
    badge = "91789",
    trigger = completedRegularMission(0xD)
)

achievement(
    title = "The Briefcase",
    description = "Complete San Francisco missions: The Casino Job -> The Briefcase.",
    points = 10,
    trigger = completedRegularMission(0x39)
)

achievement(
    title = "Guns in the Trunk",
    description = "Complete San Francisco missions: The Casino Job -> Guns in the Trunk.",
    points = 5,
    id = 84646,
    badge = "92220",
    trigger = completedRegularMission(0x3A)
)

achievement(
    title = "Visit to the Mall",
    description = "Complete San Francisco missions: The Casino Job -> Visit to the Mall.",
    points = 5,
    trigger = completedRegularMission(0x11)
)

achievement(
    title = "Cosy to the Chopper",
    description = "Complete San Francisco missions: Taxi! -> Cosy to the Chopper.",
    points = 5,
    id = 84461,
    badge = "91790",
    trigger = completedRegularMission(0x14)
)

achievement(
    title = "The Chinatown Pick Up",
    description = "Complete San Francisco missions: In the Pickup -> The Chinatown Pick Up.",
    points = 10,
    trigger = completedRegularMission(0x15)
)

achievement(
    title = "The Set Up",
    description = "Complete San Francisco missions: The Mercy Mission -> The Set Up.",
    points = 5,
    trigger = completedRegularMission(0x17)
)

achievement(
    title = "The Hyde Street Pick Up",
    description = "Complete San Francisco missions: The Mercy Mission -> The Hyde Street Pick Up.",
    points = 5,
    trigger = completedRegularMission(0x18)
)

achievement(
    title = "Tanner and Slater",
    description = "Complete final San Francisco mission: Tanner and Slater.",
    points = 10,
    id = 84462,
    badge = "91791",
    trigger = completedRegularMission(0x19)
)

achievement(
    title = "The Chase",
    description = "Complete Los Angeles missions: Steal a Cop Car -> The Chase.",
    points = 5,
    id = 84647,
    badge = "92218",
    trigger = completedRegularMission(0x1C)
)

achievement(
    title = "Maya",
    description = "Complete Los Angeles missions: Lucky to the Doc's -> Maya.",
    points = 10,
    id = 84463,
    badge = "91792",
    trigger = completedRegularMission(0x1D)
)

achievement(
    title = "Lucky to the Crib",
    description = "Complete Los Angeles missions: The Maddox Hit -> Lucky to the Crib.",
    points = 5,
    trigger = completedRegularMission(0x1F)
)

achievement(
    title = "The Beverly Hills Getaway",
    description = "Complete Los Angeles missions: The Maddox Hit -> The Beverly Hills Getaway.",
    points = 5,
    trigger = completedRegularMission(0x20)
)

achievement(
    title = "The Test Run",
    description = "Complete Los Angeles missions: The Maddox Hit -> The Test Run.",
    points = 5,
    id = 84464,
    badge = "91793",
    trigger = completedRegularMission(0x21)
)

achievement(
    title = "The Accident",
    description = "Complete New York missions: Grand Central Station Switch -> The Accident.",
    points = 10,
    trigger = completedRegularMission(0x24)
)

achievement(
    title = "The Rescue",
    description = "Complete New York missions: Luther's Heap O' Junk -> The Rescue.",
    points = 10,
    id = 84649,
    badge = "92223",
    trigger = completedRegularMission(0x25)
)

achievement(
    title = "Take Out Granger's Boys",
    description = "Complete New York missions: Take a Cab -> Take Out Granger's Boys.",
    points = 5,
    id = 84650,
    badge = "92225",
    trigger = completedRegularMission(0x28)
)

achievement(
    title = "The Negatives",
    description = "Complete New York missions: Trash Granger's Wheels -> The Negatives.",
    points = 5,
    trigger = completedRegularMission(0x29)
)

achievement(
    title = "Rite Of Passage",
    description = "Complete New York mission: Rite of Passage, by formerly finishing The Accident.",
    points = 5,
    trigger = completedRegularMission(0x2A)
)

achievement(
    title = "The Ali Situation",
    description = "Complete New York mission: The Ali Situation, by formerly finishing The Rescue.",
    points = 5,
    trigger = completedRegularMission(0x2B)
)

achievement(
    title = "The President's Run",
    description = "Complete final New York mission: The President's Run.",
    points = 25,
    id = 84466,
    badge = "91794",
    trigger = (
        withMissionCheatProtection() &&
        missionId() == 0x2C &&
        missionScriptIndicatesSuccess()
    )
)

leaderboard(
    title = "The President's Run - Hard - Speedrun",
    description = "Complete The President's Run as fast as possible on hardest difficulty",
    start = (
        inGame() == 1 &&
        withMissionCheatProtection() &&
        copsDifficulty() == 2 &&
        missionId() == 0x2C &&
        missionScriptIndicatesSuccess()
    ),
    cancel = always_false(),
    submit = always_true(),
    value = missionTimer() / 163.84,
    lower_is_better = true,
    format = "MILLISECS"
)

leaderboard(
    title = "The President's Run - Hard - Least damage",
    description = "Complete The President's Run with least damage possible on hardest difficulty",
    start = (
        inGame() == 1 &&
        withMissionCheatProtection() &&
        copsDifficulty() == 2 &&
        missionId() == 0x2C &&
        missionScriptIndicatesSuccess()
    ),
    cancel = always_false(),
    submit = always_true(),
    value = playerDamage(),
    lower_is_better = true,
    format = "VALUE"
)

// =====================
// PURSUIT DRIVING GAMES
// =====================

function completedPursuitDrivingGame(missionId) {
    requiredDamageDealt = word(0x096e78)
    damageDealt = word(0x09d5b4)

    return (
        noFilmDirector() &&
        invincibilityCheat() == 0 &&
        missionId() == missionId &&
        missionScriptIndicatesSuccess() &&
        damageDealt >= requiredDamageDealt
    )
}

achievement(
    title = "Pursuit: Miami 1", description = "Takedown the escaping car in Pursuit: Miami 1 driving game.", points = 5,
    id = 84040, badge = "91346",
    trigger = completedPursuitDrivingGame(0x6e)
)

achievement(
    title = "Pursuit: Miami 2", description = "Takedown the escaping car in Pursuit: Miami 2 driving game.", points = 5,
    id = 84041, badge = "91347",
    trigger = completedPursuitDrivingGame(0x6f)
)

achievement(
    title = "Pursuit: San Francisco 1", description = "Takedown the escaping car in Pursuit: San Francisco 1 driving game.", points = 5,
    id = 84042, badge = "91348",
    trigger = completedPursuitDrivingGame(0x70)
)

achievement(
    title = "Pursuit: San Francisco 2", description = "Takedown the escaping car in Pursuit: San Francisco 2 driving game.", points = 5,
    id = 84043, badge = "91348",
    trigger = completedPursuitDrivingGame(0x71)
)

achievement(
    title = "Pursuit: Los Angeles 1", description = "Takedown the escaping car in Pursuit: Los Angeles 1 driving game.", points = 5,
    id = 84467, badge = "91796",
    trigger = completedPursuitDrivingGame(0x72)
)

achievement(
    title = "Pursuit: Los Angeles 2", description = "Takedown the escaping car in Pursuit: Los Angeles 2 driving game.", points = 5,
    id = 85161, badge = "91796",
    trigger = completedPursuitDrivingGame(0x73)
)

achievement(
    title = "Pursuit: New York 1", description = "Takedown the escaping car in Pursuit: New York 1 driving game.", points = 5,
    id = 84468, badge = "91848",
    trigger = completedPursuitDrivingGame(0x74)
)

achievement(
    title = "Pursuit: New York 2", description = "Takedown the escaping car in Pursuit: New York 2 driving game.", points = 5,
    id = 85162, badge = "91848",
    trigger = completedPursuitDrivingGame(0x75)
)

achievement(
    title = "Worst Suspension of My Life",
    description = "Complete any Pursuit driving game with MINIS and STILTS cheats active.",
    points = 5,
    trigger = (
        noFilmDirector() &&
        invincibilityCheat() == 0 &&
        stiltsCheat() == 1 &&
        minisCheat() == 1 &&
        gameMode() == 0x14 &&
        prev(completed()) == 0 && completed() == 1
    )
)

// =====================
// GETAWAY DRIVING GAMES
// =====================

function completedGetawayDrivingGame(missionId = 0, noDamage = true) {
    triggerConditions = missionScriptIndicatesSuccess()

    if ( noDamage == true ) {
        noDamageConditions = playerDamage() == 0
        triggerConditions = trigger_when( triggerConditions )
    } else {
        noDamageConditions = always_true()
    }

    if ( missionId == 0 ) {
        missionConditions = gameMode() == 0x15
    } else {
        missionConditions = missionId() == missionId
    }

    return (
        noFilmDirector() &&
        invincibilityCheat() == 0 &&
        missionConditions &&
        triggerConditions &&
        noDamageConditions
    )
}

achievement(
    title = "Getaway: Miami", description = "Complete Miami Getaway driving game without taking damage.", points = 5,
    badge = "91349",
    trigger = completedGetawayDrivingGame(0x46)
)

achievement(
    title = "Getaway: San Francisco", description = "Complete San Francisco Getaway driving game without taking damage.", points = 5,
    badge = "91351",
    trigger = completedGetawayDrivingGame(0x47)
)

achievement(
    title = "Getaway: Los Angeles", description = "Complete Los Angeles Getaway driving game without taking damage.", points = 5,
    badge = "91797",
    trigger = completedGetawayDrivingGame(0x48)
)

achievement(
    title = "Getaway: New York", description = "Complete New York Getaway driving game without taking damage.", points = 5,
    badge = "91798",
    trigger = completedGetawayDrivingGame(0x49)
)

achievement(
    title = "Car Unsafety", description = "Complete any Getaway driving game with REAR WHEEL cheat active.", points = 5,
    badge = "91798",
    trigger = (
        rearWheelCheat() == 1 &&
        completedGetawayDrivingGame(noDamage = false)
    )
)

// =========================
// CHECKPOINTS DRIVING GAMES
// =========================

function checkpointDrivingGame(
    title,
    badge,
    missionId,
    requiredTimeSeconds,
    requiredTimeDescription,
    dirtTrack = false
) {
    startConditions = (
        noFilmDirector() &&
        invincibilityCheat() == 0 &&
        missionId() == missionId
    )

    if ( dirtTrack == false ) {
        finishConditions = missionScriptIndicatesSuccess()
    } else {
        lapsToComplete = dword(0x0c6fe4)
        lapsCompleted = dword(0x0c6fe8)
        finishConditions = (
            lapsToComplete == lapsCompleted &&
            lapsToComplete > 0 &&
            inGame() == 1
        )
    }

    achievement(
        title = title,
        description = format("Complete {0} driving game in {1} or less.", title, requiredTimeDescription),
        points = 5,
        badge = badge,
        trigger = (
            startConditions &&
            finishConditions &&
            missionTimer() <= requiredTimeSeconds * 0x4000
        )
    )

    leaderboard(
        title = format("{0}", title),
        description = format("Complete {0} driving game", title),
        start = inGame() == 1 && startConditions && finishConditions,
        cancel = always_false(),
        submit = always_true(),
        value = missionTimer() / 163.84,
        lower_is_better = true,
        format = "MILLISECS"
    )
}

checkpointDrivingGame(
    title = "Checkpoints: Miami 1",
    badge = "91355",
    missionId = 0x50,
    requiredTimeSeconds = 70,
    requiredTimeDescription = "1 minute 10 seconds"
)

checkpointDrivingGame(
    title = "Checkpoints: Miami 2",
    badge = "91355",
    missionId = 0x51,
    requiredTimeSeconds = 57,
    requiredTimeDescription = "57 seconds"
)

checkpointDrivingGame(
    title = "Checkpoints: San Francisco 1",
    badge = "91358",
    missionId = 0x52,
    requiredTimeSeconds = 80,
    requiredTimeDescription = "1 minute 20 seconds"
)

checkpointDrivingGame(
    title = "Checkpoints: San Francisco 2",
    badge = "91359",
    missionId = 0x53,
    requiredTimeSeconds = 42,
    requiredTimeDescription = "42 seconds"
)

checkpointDrivingGame(
    title = "Checkpoints: Los Angeles 1",
    badge = "91849",
    missionId = 0x54,
    requiredTimeSeconds = 75,
    requiredTimeDescription = "1 minute 15 seconds"
)

checkpointDrivingGame(
    title = "Checkpoints: Los Angeles 2",
    badge = "91849",
    missionId = 0x55,
    requiredTimeSeconds = 85,
    requiredTimeDescription = "1 minute 25 seconds"
)

checkpointDrivingGame(
    title = "Checkpoints: New York 1",
    badge = "91850",
    missionId = 0x56,
    requiredTimeSeconds = 110,
    requiredTimeDescription = "1 minute 50 seconds"
)

checkpointDrivingGame(
    title = "Checkpoints: New York 2",
    badge = "91850",
    missionId = 0x57,
    requiredTimeSeconds = 106,
    requiredTimeDescription = "1 minute 46 seconds"
)

// =========================
// TRAILBLAZER DRIVING GAMES
// =========================

function trailblazerDrivingGame(title, id, badge, missionId, points = 5) {

    startConditions = (
        noFilmDirector() &&
        invincibilityCheat() == 0 &&
        missionId() == missionId
    )

    finishConditions = missionScriptIndicatesSuccess()

    achievement(
        title = format("Trailblazer: {0}", title),
        description = format("Collect all 100 flags in Trailblazer: {0} driving game.", title),
        points = points,
        id = id,
        badge = badge,
        trigger = (
            startConditions &&
            finishConditions &&
            checkpoints() == 100
        )
    )

    leaderboard(
        title = format("Trailblazer: {0}", title),
        description = format("Complete Trailblazer: {0} driving game", title),
        start = inGame() == 1 && startConditions && finishConditions,
        cancel = always_false(),
        submit = always_true(),
        value = missionTimer() / 163.84,
        lower_is_better = false,
        format = "MILLISECS"
    )
}

trailblazerDrivingGame(
    title = "Miami 1",
    id = 84050,
    badge = "91360",
    missionId = 0x5a,
    points = 10
)

trailblazerDrivingGame(
    title = "Miami 2",
    id = 84051,
    badge = "91361",
    missionId = 0x5b
)

trailblazerDrivingGame(
    title = "San Francisco 1",
    id = 84052,
    badge = "91362",
    missionId = 0x5c
)

trailblazerDrivingGame(
    title = "San Francisco 2",
    id = 84053,
    badge = "91363",
    missionId = 0x5d
)

trailblazerDrivingGame(
    title = "Los Angeles 1",
    id = 84473,
    badge = "91851",
    missionId = 0x5e,
    points = 10
)

trailblazerDrivingGame(
    title = "Los Angeles 2",
    id = 85159,
    badge = "91851",
    missionId = 0x5f
)

trailblazerDrivingGame(
    title = "New York 1",
    id = 84474,
    badge = "91852",
    missionId = 0x60
)

trailblazerDrivingGame(
    title = "New York 2",
    id = 85160,
    badge = "91852",
    missionId = 0x61
)

achievement(
    title = "Lucky Traffic Navigation",
    description = "Complete any Trailblazer driving game without taking damage.",
    points = 10,
    trigger = (
        noFilmDirector() &&
        invincibilityCheat() == 0 &&
        gameMode() == 0x11 &&

        // Without this, trigger icon is stuck in main menu
        inGame() == 1 &&

        // It's better to use this flag instead of mission script thing, because
        // player loses control and may crash after getting final flag - it'd be unfair.
        trigger_when( prev(playerCarForceStop()) == 0 && playerCarForceStop() == 1 ) &&
        missionTimer() > 0 &&
        playerDamage() == 0
    )
)

// ======================
// SURVIVAL DRIVING GAMES
// ======================

// No need for invincibility/no cops cheat protection - they just don't work
function survivalDrivingGame(title, badge, missionId, requiredTimeSeconds, requiredTimeDescription) {

    startConditions = (
        noFilmDirector() &&
        copsDifficulty() == 2 &&
        missionId() == missionId
    )

    requiredTime = 0x4000 * requiredTimeSeconds

    achievement(
        title = format("Survival: {0}", title),
        description = format("Survive cop onslaught in {0} Survival driving game for {1} or more, on hard Cop difficulty.", title, requiredTimeDescription),
        points = 10,
        badge = badge,
        trigger = (
            startConditions &&
            prev(missionTimer()) < requiredTime && missionTimer() >= requiredTime
        )
    )

    leaderboard(
        title = format("Survival: {0}", title),
        description = format("Complete Survival: {0} driving game on hard Cop difficulty", title),
        start = inGame() == 1 && startConditions && missionControl() == 1,
        cancel = always_false(),
        submit = always_true(),
        value = missionTimer() / 163.84,
        lower_is_better = false,
        format = "MILLISECS"
    )
}

survivalDrivingGame(
    title = "Miami",
    badge = "91861",
    missionId = 0x64,
    requiredTimeSeconds = 60,
    requiredTimeDescription = "one minute"
)

survivalDrivingGame(
    title = "San Francisco",
    badge = "91861",
    missionId = 0x65,
    requiredTimeSeconds = 60,
    requiredTimeDescription = "one minute"
)

survivalDrivingGame(
    title = "Los Angeles",
    badge = "92212",
    missionId = 0x66,
    requiredTimeSeconds = 45,
    requiredTimeDescription = "45 seconds"
)

survivalDrivingGame(
    title = "New York",
    badge = "92212",
    missionId = 0x67,
    requiredTimeSeconds = 60,
    requiredTimeDescription = "one minute"
)

// ========================
// DIRT TRACK DRIVING GAMES
// ========================

checkpointDrivingGame(
    title = "Time Trial: Dirt Track 1",
    badge = "91855",
    missionId = 0x97,
    requiredTimeSeconds = 86,
    requiredTimeDescription = "1 minute 26 seconds",
    dirtTrack = true
)

checkpointDrivingGame(
    title = "Time Trial: Dirt Track 2",
    badge = "91857",
    missionId = 0x98,
    requiredTimeSeconds = 81,
    requiredTimeDescription = "1 minute 21 seconds",
    dirtTrack = true
)

checkpointDrivingGame(
    title = "Time Trial: Dirt Track 3",
    badge = "91859",
    missionId = 0x99,
    requiredTimeSeconds = 105,
    requiredTimeDescription = "1 minute 45 seconds",
    dirtTrack = true
)

checkpointDrivingGame(
    title = "Time Trial: Dirt Track 4",
    badge = "91860",
    missionId = 0x9A,
    requiredTimeSeconds = 144,
    requiredTimeDescription = "2 minutes 24 seconds",
    dirtTrack = true
)

// ====
// MISC
// ====

achievement(
    title = "Professional",
    description = "Complete the Car park in Undercover or Practice mode in 40 seconds or less and with no mistakes.",
    points = 5,
    trigger = (
        noFilmDirector() &&
        practiceDemonstrationMode() == 0 &&
        (missionId() == 0xAD || missionId() == 0xAE) &&
        carParkMistakes() == 0 &&

        // roughly 40 seconds
        carParkTimer() <= 2730 &&
        prev(completed()) == 0 && completed() == 1
    )
)

achievement(
    title = "Antipodean Driver",
    description = "Complete the Undercover park job or Car park practice with ANTIPODEAN cheat active.",
    points = 5,
    trigger = (
        noFilmDirector() &&
        practiceDemonstrationMode() == 0 &&
        (missionId() == 0xAD || missionId() == 0xAE) &&
        antipodeanCheat() == 1 &&
        prev(completed()) == 0 && completed() == 1
    )
)

achievement(
    title = "Unorthodox Ways of Showing Off",
    description = "Complete the Undercover park job or Car park practice with REAR WHEEL cheat active.",
    points = 5,
    trigger = (
        noFilmDirector() &&
        practiceDemonstrationMode() == 0 &&
        (missionId() == 0xAD || missionId() == 0xAE) &&
        rearWheelCheat() == 1 &&
        prev(completed()) == 0 && completed() == 1
    )
)

function dirtTrailing(missionId, targetScore, index) {
    achievement(
        title = format("Dirt Trailing {0}", index),
        description = format("Get score of {0} or higher at Desert practice course {1}, each penalty is 10 point deduction.", targetScore, index),
        points = 5,
        trigger = (
            practiceDemonstrationMode() == 0 &&
            missionId() == missionId &&
            prev(completed()) == 0 && completed() == 1 &&
            ( practicePoints() - practicePenalties() * 10 ) >= targetScore
        )
    )
}

dirtTrailing(0xAA, 200, 1)
dirtTrailing(0xAB, 165, 2)
dirtTrailing(0xAC, 330, 3)