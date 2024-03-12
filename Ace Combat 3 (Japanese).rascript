// Ace Combat 3 JAP
// #ID = 11308

// RATools past 1.9.1 produces different code, 1.12 outright doesn't work

function array_concat(first, second) {
    result = []

    for i in first
        array_push(result, i)

    for i in second
        array_push(result, i)

    return result
}

function array_chain(array) {
    result = once(array[0])

    for i in range(1, length(array) - 1)
        result = once(result && array[i])

    return result
}

// ===========
//  CONSTANTS
// ===========

aircraftIdToString = {
    0x00: "XR-900 Geopelia (Prototype)",
    0x01: "F/A-18I Hornet ADV",
    0x02: "F-16XF Gyrfalcon",
    0x03: "F-16XA Sakerfalcon",
    0x04: "F-15S/MT Eagle+",
    0x05: "A/F-117X NAV Hawk",
    0x06: "F-22C Raptor II",
    0x07: "F/A-32C Erne",
    0x08: "XFA-36A Game",
    0x09: "RF-12A2 Blackbird II",
    0x0A: "EF-2000E Typhoon II",
    0x0B: "MiG-33 Fulcrum SS",
    0x0C: "F/A-18U Hornet ADV",
    0x0D: "F-16XFU Gyrfalcon",
    0x0E: "R-101 Delphinus #1",
    0x0F: "R-201 Asterozoa",
    0x10: "Su-37 Super Flanker",
    0x11: "Su-43 Berkut",
    0x12: "R-101 Delphinus #1",
    0x13: "R-201 Asterozoa",
    0x14: "R-102 Delphinus #2",
    0x15: "R-211 Orcinus",
    0x16: "R-103 Delphinus #3",
    0x17: "R-311 Remora",
    0x18: "R-352 Sepia",
    0x19: "XR-900 Geopelia",
    0x1A: "X-49 Night Raven",
    0x1B: "UI-4054 Aurora",
    0x1C: "XFA-36A Game",
    0x1D: "Su-43 Berkut (Ouroboros)",
    0x1E: "R-103 Delphinus #3 (Ouroboros)",
    0x1F: "F-15S/MT Eagle+ (Dision)",
    0x20: "F-22C Raptor II (Dision)",
    0x21: "Su-37 Super Flanker (Rena)",
    0x22: "R-102 Delphinus #2 (Cynthia)",
    0x23: "R-103 Delphinus #3 (Cynthia)",
    0x24: "R-311 Remora (Cynthia)"
}

missionIdToString = {
    0x01: "Awakening",
    0x02: "Bravado",
    0x03: "Enter Dision",
    0x04: "Paper Tiger",
    0x05: "Broken Truce",
    0x06: "Ghosts of the Past",
    0x07: "No Clearance",
    0x08: "Fragile Cargo",
    0x09: "Scylla and Charybdis",
    0x0A: "Fates Intertwined",
    0x0B: "Reaching for Stars",
    0x0C: "One Way Ticket",
    0x0D: "Bug Hunt",
    0x0E: "Pawns in the Game",
    0x0F: "Damage Control",
    0x10: "Broken Wings",
    0x11: "Sphyrna",
    0x12: "A Canopy of Stars",
    0x14: "Soldier of Fortune",
    0x15: "Megafloat",
    0x16: "Target Acquisition",
    0x17: "Partners",
    0x18: "Tainted Peace",
    0x19: "Stratosphere",
    0x1A: "Welcoming Committee",
    0x1B: "Technology Transfer",
    0x1C: "Claustrophobia",
    0x1D: "Dilemma",
    0x1E: "Betrayal",
    0x1F: "Heart of the Serpent",
    0x20: "Geofront Attack",
    0x21: "Casualties of War",
    0x22: "Geopelia",
    0x36: "Geopelia",
    0x23: "The Orientation",
    0x24: "Liquidation",
    0x25: "Archnemesis",
    0x39: "Archnemesis",
    0x26: "Memory Error",
    0x27: "Electrosphere",
    0x3A: "Electrosphere",
    0x28: "Power for Life",
    0x29: "Guardian Angel",
    0x2A: "Zero Gravity",
    0x2B: "The Prize",
    0x2C: "Utopian Dreams",
    0x32: "Resistance",
    0x33: "Radio Silence",
    0x34: "Revenge",
    0x37: "Tunnel Vision",
    0x35: "Sole Survivor",
    0x2D: "Reality Distortion",
    0x2E: "Counterrevolution",
    0x2F: "Pursuit",
    0x30: "Self Awareness"
}

missionIdToCorp = {
    0x01: "UPEO",
    0x02: "UPEO",
    0x03: "UPEO",
    0x04: "UPEO",
    0x05: "UPEO",
    0x06: "UPEO",
    0x07: "UPEO",
    0x08: "UPEO",
    0x09: "UPEO",
    0x0A: "UPEO",
    0x0B: "UPEO",
    0x0C: "UPEO",
    0x0D: "UPEO",
    0x0E: "UPEO",
    0x0F: "UPEO",
    0x10: "UPEO",
    0x11: "UPEO",
    0x12: "UPEO",
    0x14: "General Resources",
    0x15: "General Resources",
    0x16: "General Resources",
    0x17: "General Resources",
    0x18: "General Resources",
    0x19: "General Resources",
    0x1A: "General Resources",
    0x1B: "General Resources",
    0x1C: "General Resources",
    0x1D: "General Resources",
    0x1E: "General Resources",
    0x1F: "General Resources",
    0x20: "General Resources",
    0x21: "General Resources",
    0x22: "General Resources",
    0x36: "General Resources",
    0x23: "Ouroboros",
    0x24: "Ouroboros",
    0x25: "Ouroboros",
    0x39: "Ouroboros",
    0x26: "Ouroboros",
    0x27: "Ouroboros",
    0x3A: "Ouroboros",
    0x28: "Neucom",
    0x29: "Neucom",
    0x2A: "Neucom",
    0x2B: "Neucom",
    0x2C: "Neucom",
    0x32: "Neucom",
    0x33: "Neucom",
    0x34: "Neucom",
    0x37: "Neucom",
    0x35: "Neucom",
    0x2D: "Ouroboros",
    0x2E: "Ouroboros",
    0x2F: "Ouroboros",
    0x30: "Ouroboros",
}

tier1Aircraft = [ 0x05, 0xA, 0xB ]
tier2AircraftOrWorse = array_concat(tier1Aircraft, [ 0x1, 0x02, 0x03, 0x0C, 0x0D, 0x0E, 0x0F, 0x12, 0x13 ])
tier3AircraftOrWorse = array_concat(tier2AircraftOrWorse, [ 0x04, 0x06, 0x07, 0x10, 0x14, 0x15, 0x1F, 0x20, 0x21, 0x22 ])
tier4Aircraft = [ 0x08, 0x11, 0x16, 0x1C, 0x1D, 0x1E, 0x23 ]
aurora = [0x1B]
blackbird = [0x9]
delphinus3 = [0x16, 0x23]
geopelia = [0x19]
hawk = [0x05]
orcinus = [0x15]
remora = [0x17, 0x24]
su37Rena = [0x21]
typhoon = [0xA]

GAME_LOOP_GAMEPLAY = 2
GAME_LOOP_DATA_SWALLOW = 3
GAME_LOOP_MAIN_MENU = 4
GAME_LOOP_FMV = 5
GAME_LOOP_CREDITS = 7

GAMEPLAY_ENTER = 0x6
GAMEPLAY_FLYING = 0x7
GAMEPLAY_CUTSCENE = 0x8
GAMEPLAY_REPLAY = 0x9
GAMEPLAY_DECISION_LANDING = 0xA
GAMEPLAY_RETRY = 0xE

RANK_A = 1
RANK_B = 2
RANK_D = 4

DIFFICULTY_EASY = 0
DIFFICULTY_NORMAL = 1
DIFFICULTY_HARD = 2

WEAPON_MISSILE = 1
WEAPON_SHORT_RANGE_MISSILE = 2
WEAPON_SPREAD_BOMB = 5

PLANE_BEHAVIOR_REGULAR = 0x1
PLANE_BEHAVIOR_WEAPON_LOCK = 0x4
PLANE_BEHAVIOR_LANDING = 0x8
PLANE_BEHAVIOR_AUTOPILOT_LANDING = 0x10
PLANE_BEHAVIOR_LANDED = 0x20
PLANE_BEHAVIOR_LANDED_BRAKING = 0x40
PLANE_BEHAVIOR_REFUELING = 0x100
PLANE_BEHAVIOR_AUTOPILOT_REFUELING = 0x400
PLANE_BEHAVIOR_CRASH = 0x100000
PLANE_BEHAVIOR_OUTER_SPACE = 0x2000000
PLANE_BEHAVIOR_ATMOSPHERE_ENTRY = 0x4000000
PLANE_BEHAVIOR_AUTOPILOT_ATMOSPHERE_ENTRY = 0x8000000

NEXT_ACTION_CUTSCENE = 1
NEXT_ACTION_DECISION_LANDING = 3
NEXT_ACTION_ENDING_FMV = 4
NEXT_ACTION_NEXT_MISSION = 5
NEXT_ACTION_DEBRIEFING = 9

// ============
//    LOOKUP
// ============

a2aWeaponId = byte(0xbf67a)
a2gWeaponId = byte(0xbf67b)
aircraftId = word(0xbf65e)
frameCount = dword(0x0b6174)
gameLoopMode = dword(0x0bf2fc)
gameLoopState = dword(0x0bf300)
gunId = byte(0xbf679)
missionId = word(0xbf65c)
missionRankToSet = byte(0xbf693)

inGameAuxScore = dword(tbyte(0xbceb4) + 0x4)
inGameDifficulty = byte(0xbf664)
inGameEntityLockedOnByPlayer = tbyte(tbyte(tbyte(0x0bce54) + 0x28) + 0xBC)
inGameFriendliesDestroyed = byte(tbyte(0xbceb4) + 0x21)
inGameInitialMissileAmount = dword(tbyte(tbyte(0xbd098)) + 0x78)
inGameMissileCount = word(tbyte(0xbd098) + 0x1C)
inGameMissionFlag = byte(tbyte(0x0bce54) + 0x4)
inGameMissionPhase = byte(tbyte(0x0bce54) + 0x8)
inGameMissionFlagTimer = dword(tbyte(0x0bce54) + 0xC)
inGameMissionPointer = tbyte(0xbceb4)
inGameMissionTimeSpent = dword(inGameMissionPointer + 0xC)
inGameMissionPhaseTimeSpent = dword(inGameMissionPointer + 0x10)
inGameMissionAlliesKillcount = byte(inGameMissionPointer + 0x2D)
inGameMissionPlayerKillcount = byte(inGameMissionPointer + 0x2E)
inGameNextDecisionLandingScene = byte(tbyte(0x0bceb4) + 0x25)
inGameNextAction = byte(tbyte(0x0bceb4) + 0x29)
inGameNextAction2 = byte(tbyte(0x0bceb4) + 0x2A)
inGamePlaneBehavior = dword(tbyte(0x0bd094) + 0x4)
inGamePortraitShown = byte(0x0bce8e)
inGameTargetsRequired = byte(tbyte(0xbceb4) + 0x1E)
inGameTargetsDestroyed = byte(tbyte(0xbceb4) + 0x20)
inGamePitchApplied = word(tbyte(0x0bd088) + 0x0)
inGameRollApplied = word(tbyte(0x0bd088) + 0x4)
inGameThrustApplied = word(tbyte(0x0bd088) + 0x6)

// ============
// AUX    FUNCS
// ============

function allyKilledSomeone() {
    return inGameMissionAlliesKillcount > prev(inGameMissionAlliesKillcount)
}

function bailedIntoDataSwallow() {
    return (
        gameLoopMode == GAME_LOOP_DATA_SWALLOW &&
        gameLoopState >= 3
    )
}

function beganLanding() {
    return (
        gameLoopMode == GAME_LOOP_GAMEPLAY &&
        gameLoopState == GAMEPLAY_DECISION_LANDING &&
        prev(inGamePlaneBehavior) == PLANE_BEHAVIOR_WEAPON_LOCK &&
        inGamePlaneBehavior == PLANE_BEHAVIOR_LANDING
    )
}

function beganRefueling() {
    return (
        gameLoopMode == GAME_LOOP_GAMEPLAY &&
        gameLoopState == GAMEPLAY_DECISION_LANDING &&
        prev(inGamePlaneBehavior) == PLANE_BEHAVIOR_WEAPON_LOCK &&
        inGamePlaneBehavior == PLANE_BEHAVIOR_REFUELING
    )
}

function difficultyIsAtleast(difficulty) {
    if (difficulty == DIFFICULTY_HARD) {
        return inGameDifficulty == DIFFICULTY_HARD
    } else if (difficulty == DIFFICULTY_NORMAL) {
        return (
            inGameDifficulty >= DIFFICULTY_NORMAL &&
            inGameDifficulty <= DIFFICULTY_HARD
        )
    } else {
        return always_true()
    }
}

function entityDataByIndex(index) {
    arrayOfEntityPointers = tbyte(0x0bce5c)
    return tbyte(arrayOfEntityPointers + 4 * index)
}

function entityHealthByIndex(index) {
    entityData = entityDataByIndex(index)
    return word(entityData + 0x4e)
}

function hasFinishedMission(expectedMissionId = 0, fmvExpected = false) {
    nextActionCondition = inGameNextAction == NEXT_ACTION_DEBRIEFING

    if (fmvExpected == true) {
        nextActionCondition = inGameNextAction == NEXT_ACTION_ENDING_FMV || inGameNextAction == NEXT_ACTION_DEBRIEFING
    }

    missionCondition = always_true()
    if (expectedMissionId != 0) {
        missionCondition = expectedMissionId == missionId
    }

    return (
        noCheesing() &&
        missionCondition &&
        prev(gameLoopMode) == GAME_LOOP_GAMEPLAY && gameLoopMode != GAME_LOOP_GAMEPLAY &&
        prev(gameLoopState) != GAMEPLAY_RETRY &&
        nextActionCondition
    )
}

function hasFinishedMissionAtleastOnce(missionId) {
    rankEasy   = missionRankForDifficulty(missionId, 0)
    rankNormal = missionRankForDifficulty(missionId, 1)
    rankHard   = missionRankForDifficulty(missionId, 2)

    return rankEasy != 0 || rankNormal != 0 || rankHard != 0
}

function hasFinishedMissionForTheFirstTime(missionId) {
    rankEasy   = missionRankForDifficulty(missionId, 0)
    rankNormal = missionRankForDifficulty(missionId, 1)
    rankHard   = missionRankForDifficulty(missionId, 2)

    return (
        gameLoopMode == GAME_LOOP_DATA_SWALLOW &&
        prev(rankEasy) == 0 && prev(rankNormal) == 0 && prev(rankHard) == 0 &&
        hasFinishedMissionAtleastOnce(missionId)
    )
}

function hasEnteredTheMission(expectedMissionId = 0, cutsceneExpected = false, takeOffExpected = false) {
    missionCondition = always_true()
    if (expectedMissionId != 0) {
        missionCondition = missionId == expectedMissionId
    }

    deltaGameLoopStateCondition = prev(gameLoopState) == 6
    if (cutsceneExpected == true) {
        deltaGameLoopStateCondition = deltaGameLoopStateCondition || prev(gameLoopState) == GAMEPLAY_CUTSCENE
    }
    if (takeOffExpected == true) {
        deltaGameLoopStateCondition = deltaGameLoopStateCondition || prev(gameLoopState) == GAMEPLAY_DECISION_LANDING
    }

    return (
        gameLoopMode == GAME_LOOP_GAMEPLAY &&
        deltaGameLoopStateCondition && gameLoopState == 7 &&
        missionCondition
    )
}

function hasLandedWithoutAutopilot(expectedMissionId, scene) {
    return (
        once(
            missionId == expectedMissionId &&
            inGameNextDecisionLandingScene == scene &&
            beganLanding()
        ) &&
        never(inGamePlaneBehavior == PLANE_BEHAVIOR_AUTOPILOT_LANDING) &&
        trigger_when(hasFinishedMission())
    )
}

function hasRefueledWithoutAutopilot(expectedMissionId, scenes) {
    return (
        once(
            missionId == expectedMissionId &&
            any_of(scenes, scene => inGameNextDecisionLandingScene == scene) &&
            beganRefueling()
        ) &&
        never(byte(tbyte(0x0bd094)) == 0x48) &&
        trigger_when(hasFinishedMission())
    )
}

// Techncially can be bombs but whatever
function hasShotAMissile() {
    return (
        isFlying() &&
        inGameMissileCount < prev(inGameMissileCount)
    )
}

function hasShotDownDision() {
    return isFlying() && (
        (
            missionId == 0x21 && // Casualties of War
            dword(targetDataAddressByIndex(8)) != 0 &&
            inGameTargetsDestroyed == 1
        ) ||
        (
            missionId == 0x3A && // Electrosphere
            inGameTargetsDestroyed == 1
        ) ||
        (
            missionId == 0x35 && // Sole Survivor
            targetByIndexDied(2)
        ) ||
        (
            missionId == 0x2E && // Counterrevolution
            targetByIndexDied(19)
        )
    )
}

function hasShotDownRena() {
    return isFlying() && (
        (
            missionId == 0x21 && // Casualties of War
            targetByIndexDied(7)
        ) ||
        (
            missionId == 0x26 && // Memory Error
            targetByIndexDied(11)
        ) ||
        (
            missionId == 0x35 && // Sole Survivor
            targetByIndexDied(1)
        ) ||
        (
            missionId == 0x30 && // Self Awareness
            targetByIndexDied(1)
        )
    )
}

function isFlying() {
    return (
        gameLoopMode == GAME_LOOP_GAMEPLAY &&
        prev(gameLoopState) == GAMEPLAY_FLYING && gameLoopState == GAMEPLAY_FLYING
    )
}

function isInMissionSimulator() {
    return bit4(0x0bfc3c) == 1
}

function killCountIsAtleast(count) {
    return (inGameMissionPlayerKillcount + inGameMissionAlliesKillcount) >= count
}

function missionRankForDifficulty(missionId, difficulty) {
    return byte(0x0BFEEC + missionId + difficulty * 0x3C)
}

function missionTimerIsLessThanSeconds(secs) {
    return inGameMissionTimeSpent <= secs * 30
}

function noCheesing() {
    return a2aWeaponId != 7 && a2gWeaponId != 7
}

function passedTimeLimitInSeconds(secs) {
    return inGameMissionTimeSpent > secs * 30
}

function personalKillCountIsAtleast(count) {
    return inGameMissionPlayerKillcount >= count
}

function targetByIndexDied(index) {
    addr = targetDataAddressByIndex(index)

    return bit1(addr) == 1 && prev(bit1(addr)) == 0
}

function targetDataAddressByIndex(index) {
    return 0x0c6fd8 + 4 * index
}

function usingAircraft(aicraftIds) {
    return any_of(aicraftIds, id => aircraftId == id)
}

function usingTier4AircraftOrWorse() {
    return all_of([ 0x9, 0x17, 0x19, 0x1A, 0x1B, 0x24 ], id => aircraftId != id)
}

// HACK: the && instead of || makes certain once() clauses work without separating them
function usingX49Geopelia() {
    return aircraftId >= 0x19 && aircraftId <= 0x1A
}

function willReachAtLeastTargets(targetRequirementForPhase, totalTargetRequirement) {
    return (
        inGameTargetsRequired == targetRequirementForPhase &&
        (inGameMissionPlayerKillcount + inGameMissionAlliesKillcount) +
        (targetRequirementForPhase - inGameTargetsDestroyed) >= totalTargetRequirement
    )
}

// ==========================
//  PROGRESSION + CHALLENGES
// ==========================

// AWAKENING_COMPLETE
achievement(
    title = "Initialized",
    description = "Awakening: successfully repelled Neucom forces trespassing over Expo City.",
    points = 3,
    trigger = hasFinishedMission(0x01)
)

// AWAKENING_NEUCOM_DIE_FAST
awakeningNeucomCargo = [3, 4, 5, 6]
achievement(
    title = "Multitasking",
    description = "Awakening, NORMAL/HARD, Tier 1 aircraft: destroy two R-501s within a second.",
    points = 3,
    trigger = (
        difficultyIsAtleast(DIFFICULTY_NORMAL) &&
        missionId == 0x1 &&
        usingAircraft(tier1Aircraft) &&
        noCheesing() &&

        // HACK: this any_of is required to delay Trigger icon appearance
        any_of(awakeningNeucomCargo, neucomCargo => once(targetByIndexDied(neucomCargo))) &&
        trigger_when(
            tally_of(awakeningNeucomCargo, 2, neucomCargo => targetByIndexDied(neucomCargo))
        ) &&

        // After any cargo plane dies - run a timer for 60 frames to reset all hits above
        any_of(awakeningNeucomCargo, neucomCargo =>
            repeated(60,
                never(
                    once(
                        targetByIndexDied(neucomCargo)
                    ) &&
                    frameCount > prev(frameCount)
                )
            )
        )
    )
)

// ENTER_DISION_CHASE
distanceToDision = dword(tbyte(0x0c6ed8) + 0x4)
achievement(
    title = "Dision Within",
    description = "Enter Dision, Tier 2 aircraft or worse: chase Dision without getting far behind.",
    points = 3,
    trigger = (
        once(
            hasEnteredTheMission(0x03) &&
            usingAircraft(tier2AircraftOrWorse)
        ) &&

        never(
            bailedIntoDataSwallow() || (
                distanceToDision > 4096 &&
                inGameMissionTimeSpent > 0 &&
                inGameMissionTimeSpent < 90 * 30
            )
        ) &&

        trigger_when(passedTimeLimitInSeconds(90))
    )
)
leaderboard(
    title = "Enter Dision Chase / Tier 2 aircraft or worse",
    description = "Get as many points as you can while chasing Dision",
    start = (
        hasEnteredTheMission(0x03) &&
        usingAircraft(tier2AircraftOrWorse)
    ),
    cancel = (
        bailedIntoDataSwallow()
    ),
    submit = (
        passedTimeLimitInSeconds(90)
    ),
    value = inGameAuxScore,
    lower_is_better = false,
    format = "VALUE"
)

// ENTER_DISION_DECOY_NO_GUN
achievement(
    title = "Showoff",
    description = "Enter Dision: shoot down an airborne target decoy with a missile.",
    points = 3,
    trigger = (
        isFlying() &&
        missionId == 0x3 &&

        any_of([ 0xC, 0xD, 0xE ], function cb(decoy) {
            health = entityHealthByIndex(decoy)
            return (
                health - prev(health) == 0xFFBA ||
                health - prev(health) == 0xFF74
            )
        })
    )
)

// PAPER_TIGER_DECIDE
achievement(
    title = "Conscious",
    description = "Paper Tiger: you've demonstrated the ability to DECIDE.",
    points = 3,
    trigger = hasFinishedMission(0x04)
)

// PAPER_TIGER_LANDING_CARRIER
achievement(
    title = "Landing: Carrier at Night",
    description = "Paper Tiger: successfully landed onto carrier at night without using autopilot.",
    points = 1,
    trigger = hasLandedWithoutAutopilot(0x04, 0)
)

// PAPER_TIGER_LANDING_MEGAFLOAT
achievement(
    title = "Landing: Megafloat at Night",
    description = "Paper Tiger: successfully landed onto Megafloat runway at night without using autopilot.",
    points = 1,
    trigger = hasLandedWithoutAutopilot(0x04, 1)
)

// NO_CLEARANCE_LANDING
achievement(
    title = "Landing: Expo City at Night",
    description = "No Clearance: successfully landed onto Expo City runway at night without using autopilot.",
    points = 1,
    trigger = hasLandedWithoutAutopilot(0x07, 2)
)

// SCYLLA_AND_CHARYBDIS_DECIDE
achievement(
    title = "Critical",
    description = "Scylla and Charybdis: you're capable of dealing with sadistic CHOICES.",
    points = 3,
    trigger = (
        hasFinishedMission(0x09) &&
        inGameMissionPhaseTimeSpent < 1800
    )
)

// SCYLLA_AND_CHARYBDIS_REFUEL
achievement(
    title = "Refuel: Mount Lambert",
    description = "Scylla and Charybdis: successfully refueled midair without using autopilot.",
    points = 1,
    trigger = hasRefueledWithoutAutopilot(0x09, [ 0, 1 ])
)

// REACHING_FOR_STARS_CLEAN_SWEEP
achievement(
    title = "Clean Sweep",
    description = "Reaching for Stars: destroy all airborne antlions in one clean sweep.",
    points = 3,
    trigger = (
        once(
            missionId == 0x0B &&
            prev(inGameTargetsDestroyed) == 0 && inGameTargetsDestroyed > 0 &&
            inGameMissionTimeSpent < 112 * 30 &&
            inGameTargetsRequired == 10 &&
            noCheesing()
        ) &&
        trigger_when(
            tally(
                10,
                inGameTargetsDestroyed > prev(inGameTargetsDestroyed)
            )
        ) &&
        all_of(range(1, 9), i =>
            never(repeated(50 * 3,
                inGameTargetsDestroyed == i &&
                inGameMissionTimeSpent > prev(inGameMissionTimeSpent)
            ))
        ) &&
        never(
            bailedIntoDataSwallow() ||
            inGameMissionTimeSpent >= 112 * 30 ||
            inGameTargetsDestroyed == 0
        )
    )
)

// BUG_HUNT_FAST_RECOVERY
achievement(
    title = "Bomb Away the Headache",
    description = "Bug Hunt: Personal thanks from Rena for saving her so fast.",
    points = 3,
    trigger = (
        once(
            missionId == 0x0D &&
            inGameTargetsRequired == 1 &&
            inGameMissionPhaseTimeSpent > 0 &&
            prev(inGameMissionPhaseTimeSpent) == 0
        ) &&
        repeated(30 * 10,
            never(
                once(
                    missionId == 0x0D &&
                    inGameTargetsRequired == 1 &&
                    inGameMissionPhaseTimeSpent > 0 &&
                    prev(inGameMissionPhaseTimeSpent) == 0
                ) &&
                inGameMissionTimeSpent > prev(inGameMissionTimeSpent)
            )
        ) &&
        once(
            once(
                inGameTargetsDestroyed > prev(inGameTargetsDestroyed)
            ) &&
            prev(inGamePortraitShown) == 1 && inGamePortraitShown == 0
        ) &&
        never(
            bailedIntoDataSwallow() ||
            inGameTargetsRequired != 1
        )
    )
)

// PAWNS_IN_THE_GAME_LANDING
achievement(
    title = "Landing: Expo City",
    description = "Pawns in the Game: successfully landed onto Expo City runway without using autopilot.",
    points = 1,
    trigger = hasLandedWithoutAutopilot(0x0E, 0)
)

// SOLDIER_OF_FORTUNE_CLEAN_SWEEP
achievement(
    title = "No Fledgling",
    description = "Soldier of Fortune: destroy all eight R-201s in one clean sweep before they take off.",
    points = 3,
    trigger = (
        once(
            missionId == 0x14 &&
            prev(inGameTargetsDestroyed) == 0 && inGameTargetsDestroyed > 0 &&
            inGameMissionTimeSpent < 180 * 30 &&
            noCheesing()
        ) &&
        trigger_when(
            tally(
                8,
                inGameTargetsDestroyed > prev(inGameTargetsDestroyed)
            )
        ) &&
        all_of(range(1, 7), i =>
            never(repeated(50 * 3,
                inGameTargetsDestroyed == i &&
                inGameMissionTimeSpent > prev(inGameMissionTimeSpent)
            ))
        ) &&
        never(
            bailedIntoDataSwallow() ||
            inGameMissionTimeSpent >= 180 * 30 ||
            inGameTargetsDestroyed == 0
        )
    )
)

// TAINTED_PEACE_REFUEL
achievement(
    title = "Refuel: Mount Lambert II",
    description = "Tainted Peace: successfully refueled midair without using autopilot.",
    points = 1,
    trigger = hasRefueledWithoutAutopilot(0x18, [ 0 ])
)

// STRATOSPHERE_SAVE_KEITH
achievement(
    title = "Your Down to Earth Buddy",
    description = "Stratosphere: help Keith to get rid of nasty Remora.",
    points = 3,
    trigger = (
        hasFinishedMission(0x19) &&
        missionRankToSet == RANK_D
    )
)

// STRATOSPHERE_LANDING
achievement(
    title = "Landing: White Valley",
    description = "Stratosphere: successfully landed onto White Valley base without using autopilot.",
    points = 1,
    trigger = hasLandedWithoutAutopilot(0x19, 0)
)

// TECHNOLOGY_TRANSFER_ANTLIONS_SAFE
achievement(
    title = "General Infestations Limited",
    description = "Technology Transfer, Tier 3 aircraft or worse: complete the mission without any antlion getting destroyed.",
    points = 5,
    trigger = (
        once(
            hasEnteredTheMission(0x1B) &&
            usingAircraft(tier3AircraftOrWorse)
        ) &&

        never(
            bailedIntoDataSwallow() ||
            inGameFriendliesDestroyed > 0
        ) &&

        trigger_when(hasFinishedMission())
    )
)

// DILEMMA_DECIDE
achievement(
    title = "Decisive",
    description = "Dilemma: you knew the right DECISION from the start.",
    points = 3,
    trigger = hasFinishedMission(0x1D)
)

// DILEMMA_LANDING
achievement(
    title = "Landing: Carrier at Petrol Coast",
    description = "Dilemma: successfully landed onto carrier without using autopilot.",
    points = 1,
    trigger = hasLandedWithoutAutopilot(0x1D, 0)
)

// DILEMMA_DOCKING
achievement(
    title = "Docking: Airship over Petrol Coast",
    description = "Dilemma: successfully docked onto airship without using autopilot.",
    points = 1,
    trigger = hasRefueledWithoutAutopilot(0x1D, [1])
)

// CASUALTIES_OF_WAR_LANDING
achievement(
    title = "Landing: Port Edwards at Night",
    description = "Casualties of War: successfully landed onto Port Edwards runway without using autopilot.",
    points = 1,
    trigger = hasLandedWithoutAutopilot(0x21, 0)
)

// ZERO_GRAVITY_GUNS_ONLY
achievement(
    title = "Pew Pew",
    description = "Zero Gravity: complete the mission without firing any plasma missiles.",
    points = 5,
    trigger = (
        missionId == 0x2A &&
        trigger_when(hasFinishedMission()) &&
        inGameMissileCount == 100
    )
)

// ZERO_GRAVITY_LANDING
achievement(
    title = "Landing: Planet Earth",
    description = "Zero Gravity: successfully entered Earth's atmosphere without using autopilot.",
    points = 1,
    trigger = (
        once(
            missionId == 0x2A &&
            inGameNextDecisionLandingScene == 0 &&
            gameLoopMode == GAME_LOOP_GAMEPLAY &&
            gameLoopState == GAMEPLAY_DECISION_LANDING &&
            prev(inGamePlaneBehavior) == PLANE_BEHAVIOR_OUTER_SPACE &&
            inGamePlaneBehavior == PLANE_BEHAVIOR_ATMOSPHERE_ENTRY
        ) &&
        never(byte(tbyte(0x0bd094)) == 0x50) &&
        trigger_when(hasFinishedMission())
    )
)

// GUARDIAN_ANGEL_LANDING
achievement(
    title = "Landing: Comona Islands",
    description = "Guardian Angel: successfully landed onto Comona Islands runway without using autopilot.",
    points = 1,
    trigger = hasLandedWithoutAutopilot(0x29, 1)
)

// THE_PRIZE_HYDROFOIL_SAFE
achievement(
    title = "Hydrofren",
    description = "The Prize, Tier 3 aircraft or worse: complete the mission without any friendly hydrofoil getting destroyed.",
    points = 5,
    trigger = (
        once(
            hasEnteredTheMission(0x2B) &&
            usingAircraft(tier3AircraftOrWorse)
        ) &&

        never(
            bailedIntoDataSwallow() ||
            inGameFriendliesDestroyed > 0
        ) &&

        trigger_when(hasFinishedMission())
    )
)

// UTOPIAN_DREAMS_LANDING
achievement(
    title = "Landing: Carrier in White Valley",
    description = "Utopian Dreams: successfully landed onto carrier without using autopilot.",
    points = 1,
    trigger = hasLandedWithoutAutopilot(0x2C, 1)
)

// DILEMMA_DOCKING
achievement(
    title = "Docking: Airship over White Valley",
    description = "Utopian Dreams: successfully docked onto airship over without using autopilot.",
    points = 1,
    trigger = hasRefueledWithoutAutopilot(0x2C, [0])
)

// UTOPIAN_DREAMS_DECIDE
achievement(
    title = "Conflicting",
    description = "Utopian Dreams: you've stated your BELIEFS.",
    points = 3,
    trigger = hasFinishedMission(0x2C)
)

// TUNNEL_VISION_LEFT_PATH
playerPosX = dword(entityDataByIndex(0) + 0x8)
playerPosZ = dword(entityDataByIndex(0) + 0x10)
achievement(
    title = "Straight Wave",
    description = "Tunnel Vision: get through the shortcut near the start of the mission without taking damage.",
    points = 3,
    trigger = (
        missionId == 0x37 &&

        once(
            isFlying() &&
            playerPosX < 0xFC900000 &&
            prev(playerPosZ) < 0xEA000000 && playerPosZ > 0xEA000000
        ) &&
        never(
            bailedIntoDataSwallow() ||
            inGameMissionTimeSpent == 0 ||
            entityHealthByIndex(0) < prev(entityHealthByIndex(0))
        ) &&

        trigger_when(playerPosZ > 0xF7000000)
    )
)

// SELF_AWARENESS_AEON_NO_DAMAGE
achievement(
    title = "Aeonphobia",
    description = "Self Awareness, Tier 4 aircraft or worse: destroy Aeonosphere without getting damage. Using spread bombs is not allowed.",
    points = 5,
    trigger = (
        isFlying() &&
        missionId == 0x30 &&
        a2gWeaponId != WEAPON_SPREAD_BOMB &&
        noCheesing() &&
        usingTier4AircraftOrWorse() &&
        once(
            inGameTargetsRequired == 10 &&
            inGameMissionPhaseTimeSpent == 0
        ) &&
        never(
            bailedIntoDataSwallow() || (
                inGameTargetsRequired == 10 &&
                entityHealthByIndex(0) < prev(entityHealthByIndex(0))
            ) ||
            inGameTargetsRequired != 10
        ) &&
        trigger_when(inGameTargetsDestroyed == 10)
    )
)

// =========
//  ENDINGS
// =========

// ENDING_GR
achievement(
    title = "Secret Craft",
    description = "There's nobody inside...",
    points = 10,
    trigger = hasFinishedMissionForTheFirstTime(0x22)
)

// ENDING_OURO_2
achievement(
    title = "Inner Opposition",
    description = "You keep opposing, but you've served your purpose.",
    points = 10,
    trigger = hasFinishedMissionForTheFirstTime(0x30)
)

// ENDING_UPEO
achievement(
    title = "My Hardships",
    description = "Loyal to the UPEO.",
    points = 10,
    trigger = hasFinishedMissionForTheFirstTime(0x12)
)

// ENDING_OURO_1
achievement(
    title = "Ouroboros to Extinct",
    description = "This time, they were all dead... erased?",
    points = 10,
    trigger = hasFinishedMissionForTheFirstTime(0x27)
)

// ENDING_NEUCOM
achievement(
    title = "Neurological Nightmares",
    description = "Existential crisis succeeds a regular one.",
    points = 10,
    trigger = hasFinishedMissionForTheFirstTime(0x35)
)

// ENDING_FINAL
endings = [0x12, 0x22, 0x27, 0x30, 0x35]
achievement(
    title = "He Always Dies",
    description = "See all five outcomes and receive the final message.",
    points = 25,
    trigger = (
        any_of(endings, function cb(id) {
            otherEndings = []
            for x in endings {
                if (x != id) {
                    array_push(otherEndings, x)
                }
            }

            return (
                all_of(otherEndings, otherId => hasFinishedMissionAtleastOnce(otherId)) &&
                hasFinishedMissionForTheFirstTime(id)
            )
        })
    )
)

// =============
//  HARD RANK A
// =============

// A_RANK_AWAKENING
achievement(
    title = "De-escalation",
    description = "Awakening, HARD, Tier 1 aircraft: have all targets destroyed in 2:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier1Aircraft) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x01) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(120) &&
        killCountIsAtleast(12)
    )
)

// A_RANK_BRAVADO
achievement(
    title = "No Signal",
    description = "Bravado, HARD, Tier 1 aircraft: have all targets destroyed in 3:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier1Aircraft) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x02) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(180) &&
        killCountIsAtleast(24)
    )
)

// A_RANK_ENTER_DISION
achievement(
    title = "Joint Operations",
    description = "Enter Dision, HARD, Tier 2 aircraft or worse: chase Dision for 4000 points or more, shoot down all Neucom forces and chemicals, achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier2AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x03) &&
        inGameAuxScore >= 4000 + 1800 &&
        missionRankToSet == RANK_A &&
        killCountIsAtleast(16)
    )
)

// A_RANK_PAPER_TIGER
achievement(
    title = "Origami Ace",
    description = "Paper Tiger, HARD, Tier 2 aircraft or worse: have all targets destroyed in 3:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier2AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x04) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(180) &&
        killCountIsAtleast(25)
    )
)

// A_RANK_BROKEN_TRUCE
achievement(
    title = "You Are Now on NEU",
    description = "Broken Truce, HARD, Tier 2 aircraft or worse: have all targets destroyed in 3:30 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier2AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x05) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(210) &&
        killCountIsAtleast(13)
    )
)

// A_RANK_GHOSTS_OF_THE_PAST
achievement(
    title = "Darkness of Enigma",
    description = "Ghosts of the Past, Tier 2 aircraft or worse: have at least 8 targets destroyed and achieve A rank. Trigger icon will appear when you're eligible for achievement.",
    points = 5,
    trigger = (
        once(hasEnteredTheMission(0x06)) &&
        never(bailedIntoDataSwallow()) &&
        trigger_when(
            usingAircraft(tier2AircraftOrWorse) &&
            hasFinishedMission(0x06) &&
            missionRankToSet == RANK_A
        ) && (
            willReachAtLeastTargets(targetRequirementForPhase = 0, totalTargetRequirement = 7) ||
            willReachAtLeastTargets(targetRequirementForPhase = 1, totalTargetRequirement = 8)
        )
    )
)

// A_RANK_NO_CLEARANCE
achievement(
    title = "Night Stroll",
    description = "No Clearance, HARD, Tier 2 aircraft or worse: have all targets destroyed in 3:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier2AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x07) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(180)
    )
)

// A_RANK_FRAGILE_CARGO
achievement(
    title = "Pathetic at Terror",
    description = "Fragile Cargo, Tier 2 aircraft or worse: complete the mission with A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier2AircraftOrWorse) &&
        hasFinishedMission(0x08) &&
        missionRankToSet == RANK_A
    )
)

// A_RANK_SCYLLA_AND_CHARYBDIS
achievement(
    title = "Questionable Objectives",
    description = "Scylla and Charybdis, HARD, Tier 2 aircraft or worse: have all targets destroyed in 2:30 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier2AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x09) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(150)
    )
)

// A_RANK_FATES_INTERTWINED
achievement(
    title = "Dark Blue",
    description = "Fates Intertwined, HARD, Tier 3 aircraft or worse: destroy all Moburas before they release their Remoras and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier3AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x0A) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(90)
    )
)

// A_RANK_REACHING_FOR_STARS
achievement(
    title = "Launch Secured",
    description = "Reaching for Stars, HARD, Tier 3 aircraft or worse: have all targets destroyed in 2:30 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier3AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x0B) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(150)
    )
)

// A_RANK_ONE_WAY_TICKET
achievement(
    title = "Full Stop",
    description = "One-Way Ticket, HARD, Tier 3 aircraft or worse: have all targets destroyed in 1:30 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier3AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x0C) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(90) &&
        killCountIsAtleast(12)
    )
)

// A_RANK_BUG_HUNT
achievement(
    title = "Nano and Deadly",
    description = "Bug Hunt, Tier 3 aircraft or worse: eradicate the virus threat in 2:30 or less and achieve A rank with 11 or less bombs deployed.",
    points = 5,
    trigger = (
        usingAircraft(tier3AircraftOrWorse) &&
        hasFinishedMission(0x0D) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(150) &&
        (inGameInitialMissileAmount - inGameMissileCount) <= 11
    )
)

// A_RANK_PAWNS_IN_THE_GAME
achievement(
    title = "Checkmate in Two Dives",
    description = "Pawns in the Game, HARD, R-211 Orcinus: have all targets destroyed in 3:20 or less and achieve A rank.",
    points = 10,
    trigger = (
        usingAircraft(orcinus) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x0E) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(200) &&
        killCountIsAtleast(20)
    )
)

// A_RANK_DAMAGE_CONTROL
achievement(
    title = "Damage Uncontrollable",
    description = "Damage Control, HARD, Tier 4 aircraft or worse: have all targets destroyed in 6:30 or less and achieve A rank.",
    points = 10,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x0F) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(390) &&
        killCountIsAtleast(24)
    )
)

// A_RANK_BROKEN_WINGS
achievement(
    title = "The First Strike",
    description = "Broken Wings, HARD, Tier 4 aircraft or worse: have all targets destroyed in 4:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x10) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(240)
    )
)
leaderboard(
    title = "Broken Wings HARD / Tier 4 aircraft",
    description = "Fastest time to complete the mission",
    start = (
        hasEnteredTheMission(0x10) &&
        noCheesing() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        usingAircraft(tier4Aircraft)
    ),
    cancel = (
        bailedIntoDataSwallow()
    ),
    submit = (
        isFlying() &&
        inGameTargetsDestroyed == inGameTargetsRequired
    ),
    value = measured(inGameMissionTimeSpent * 3.333334),
    lower_is_better = true,
    format = "MILLISECS"
)

// A_RANK_SPHYRNA
achievement(
    title = "The Second Strike",
    description = "Sphyrna, HARD, Tier 4 aircraft or worse: have all targets destroyed in 4:20 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x11) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(260) &&
        killCountIsAtleast(13)
    )
)

// A_RANK_CANOPY_OF_STARS
achievement(
    title = "The Third Strike - You Get What You Deserve",
    description = "A Canopy of Stars, HARD, Tier 4 aircraft or worse: have at least 21 targets destroyed in 3:30 or less and achieve A rank. Trigger icon will appear when you're eligible for achievement.",
    points = 10,
    trigger = (
        once(hasEnteredTheMission(0x12)) &&
        never(
            bailedIntoDataSwallow() ||
            isFlying() && (
                passedTimeLimitInSeconds(210)
            )
        ) &&
        trigger_when(
            usingTier4AircraftOrWorse() &&
            difficultyIsAtleast(DIFFICULTY_HARD) &&
            hasFinishedMission(0, fmvExpected = true) &&
            missionRankToSet == RANK_A &&
            killCountIsAtleast(21)
        ) && (
            willReachAtLeastTargets(targetRequirementForPhase = 9, totalTargetRequirement = 20) || (
                inGameTargetsRequired == 1 &&
                killCountIsAtleast(20)
            )
        )
    )
)

// A_RANK_SOLDIER_OF_FORTUNE
achievement(
    title = "NeuDown",
    description = "Soldier of Fortune, HARD, Tier 3 aircraft or worse: have all targets destroyed in 2:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier3AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x14) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(120) &&
        killCountIsAtleast(13)
    )
)

// A_RANK_MEGAFLOAT
achievement(
    title = "Demilitarization",
    description = "Megafloat, HARD, Tier 3 aircraft or worse: have all targets destroyed in 3:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier3AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x15) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(180) &&
        killCountIsAtleast(25)
    )
)

// A_RANK_PARTNERS
achievement(
    title = "Blackout",
    description = "Partners, HARD, Tier 3 aircraft or worse: have at least 18 targets destroyed in 3:00 or less and achieve A rank. Trigger icon will appear when you're eligible for achievement.",
    points = 5,
    trigger = (
        once(hasEnteredTheMission(0x17)) &&
        never(
            bailedIntoDataSwallow() ||
            isFlying() && (
                passedTimeLimitInSeconds(180)
            )
        ) &&
        trigger_when(
            usingAircraft(tier3AircraftOrWorse) &&
            difficultyIsAtleast(DIFFICULTY_HARD) &&
            hasFinishedMission() &&
            missionRankToSet == RANK_A &&
            killCountIsAtleast(18)
        ) && (
            willReachAtLeastTargets(targetRequirementForPhase = 4, totalTargetRequirement = 14) ||
            willReachAtLeastTargets(targetRequirementForPhase = 1, totalTargetRequirement = 18)
        )
    )
)

// A_RANK_TARGET_ACQUISITION
achievement(
    title = "Hawk Recon",
    description = "Target Acquisition, HARD, A/F-117X NAV Hawk: photograph all facilities and have all targets destroyed in 6:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(hawk) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x16) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(360) &&
        killCountIsAtleast(27)
    )
)

// A_RANK_TAINTED_PEACE
achievement(
    title = "No Room for Peace",
    description = "Tainted Peace, HARD, Tier 3 aircraft or worse: have all targets destroyed in 2:30 or less and achieve A rank.",
    points = 10,
    trigger = (
        usingAircraft(tier3AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x18) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(150) &&
        killCountIsAtleast(10)
    )
)

// A_RANK_STRATOSPHERE
achievement(
    title = "Strato Fighter",
    description = "Stratosphere, HARD, RF-12A2 Blackbird: destroy at least 8 targets in 2:00 or less and achieve A rank. Trigger icon will appear when you're eligible for achievement.",
    points = 5,
    trigger = (
        once(hasEnteredTheMission(0x19, cutsceneExpected = true)) &&
        never(
            bailedIntoDataSwallow() ||
            isFlying() && (
                passedTimeLimitInSeconds(120)
            )
        ) &&
        trigger_when(
            usingAircraft(blackbird) &&
            difficultyIsAtleast(DIFFICULTY_HARD) &&
            hasFinishedMission(0x19) &&
            missionRankToSet == RANK_A
        ) && willReachAtLeastTargets(targetRequirementForPhase = 6, totalTargetRequirement = 8)
    )
)

// A_RANK_TECHNOLOGY_TRANSFER
achievement(
    title = "Bug Assist",
    description = "Technology Transfer, HARD, Tier 3 aircraft or worse: have all targets destroyed in 2:30 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier3AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x1B) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(150) &&
        killCountIsAtleast(15)
    )
)

// A_RANK_WELCOMING_COMMITTEE
achievement(
    title = "Shut(tle)down",
    description = "Welcoming Committee, HARD, Tier 3 aircraft or worse: have at least 17 targets destroyed in 3:00 or less and achieve A rank. Trigger icon will appear when you're eligible for achievement.",
    points = 5,
    trigger = (
        once(hasEnteredTheMission(0x1A)) &&
        never(
            bailedIntoDataSwallow() ||
            isFlying() && (
                passedTimeLimitInSeconds(180)
            )
        ) &&
        trigger_when(
            usingAircraft(tier3AircraftOrWorse) &&
            difficultyIsAtleast(DIFFICULTY_HARD) &&
            hasFinishedMission() &&
            missionRankToSet == RANK_A &&
            killCountIsAtleast(17)
        ) && (
            willReachAtLeastTargets(targetRequirementForPhase = 4, totalTargetRequirement = 17)
        )
    )
)

// A_RANK_CLAUSTROPHOBIA
achievement(
    title = "Mist Cracks",
    description = "Claustrophobia, HARD, Tier 3 aircraft or worse: have all targets destroyed in 4:30 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier3AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x1C) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(270) &&
        killCountIsAtleast(37)
    )
)

// A_RANK_DILEMMA
achievement(
    title = "Unsubbed",
    description = "Dilemma, HARD, Tier 3 aircraft or worse: have all targets destroyed in 6:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier3AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x1D) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(360) &&
        killCountIsAtleast(33)
    )
)

// A_RANK_BETRAYAL
achievement(
    title = "Game On",
    description = "Betrayal, HARD, Tier 4 aircraft or worse: have all targets destroyed in 7:00 or less and achieve A rank.",
    points = 10,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x1E) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(420) &&
        killCountIsAtleast(50)
    )
)
leaderboard(
    title = "Betrayal EASY / Tier 4 aircraft or worse",
    description = "Fastest time to destroy first batch of enemy forces",
    start = (
        hasEnteredTheMission(0x1E) &&
        noCheesing() &&
        inGameDifficulty == DIFFICULTY_EASY &&
        usingTier4AircraftOrWorse()
    ),
    cancel = (
        bailedIntoDataSwallow()
    ),
    submit = (
        isFlying() &&
        inGameTargetsRequired == 0x1A &&
        inGameTargetsDestroyed == inGameTargetsRequired
    ),
    value = measured(inGameMissionTimeSpent * 3.333334),
    lower_is_better = true,
    format = "MILLISECS"
)
leaderboard(
    title = "Betrayal HARD / Tier 4 aircraft or worse",
    description = "Fastest time to destroy first batch of enemy forces",
    start = (
        hasEnteredTheMission(0x1E) &&
        noCheesing() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        usingTier4AircraftOrWorse()
    ),
    cancel = (
        bailedIntoDataSwallow()
    ),
    submit = (
        isFlying() &&
        inGameTargetsRequired == 0x1A &&
        inGameTargetsDestroyed == inGameTargetsRequired
    ),
    value = measured(inGameMissionTimeSpent * 3.333334),
    lower_is_better = true,
    format = "MILLISECS"
)

// A_RANK_HEART_OF_THE_SERPENT
achievement(
    title = "Cutting the Knot",
    description = "Heart of the Serpent, HARD, Tier 4 aircraft or worse: have all targets destroyed in 4:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x1F) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(240) &&
        killCountIsAtleast(11)
    )
)

// A_RANK_GEOFRONT_ATTACK
achievement(
    title = "Extreme Measures",
    description = "Geofront Attack, HARD, Tier 4 aircraft or worse: destroy all pillars in 4:00 or less without getting damage and achieve A rank.",
    points = 5,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x20) &&
        missionRankToSet == RANK_A &&
        entityHealthByIndex(0) == 0x1E
    )
)

// A_RANK_CASUALTIES_OF_WAR
achievement(
    title = "Nevermore",
    description = "Casualties of War, HARD, Tier 4 aircraft or worse: have all targets destroyed in 4:00 or less and achieve A rank.",
    points = 10,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x21) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(240) &&
        killCountIsAtleast(7)
    )
)

// A_RANK_GEOPELIA
achievement(
    title = "Morceaux",
    description = "Geopelia, HARD: finish the mission in 4:00 or less and achieve A rank.",
    points = 10,
    trigger = (
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x36, fmvExpected = true) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(240)
    )
)
leaderboard(
    title = "Geopelia HARD",
    description = "Fastest time to complete the mission",
    start = (
        hasEnteredTheMission(0x36) &&
        noCheesing() &&
        difficultyIsAtleast(DIFFICULTY_HARD)
    ),
    cancel = (
        bailedIntoDataSwallow()
    ),
    submit = (
        isFlying() &&
        inGameTargetsDestroyed == inGameTargetsRequired
    ),
    value = measured(inGameMissionTimeSpent * 3.333334),
    lower_is_better = true,
    format = "MILLISECS"
)

// A_RANK_THE_ORIENTATION
achievement(
    title = "Terror and Havoc",
    description = "The Orientation, HARD, Tier 4 aircraft or worse: have all targets destroyed in 6:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x23) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(360) &&
        killCountIsAtleast(34)
    )
)

// A_RANK_LIQUIDATION
achievement(
    title = "Loose Ends - Gone",
    description = "Liquidation, HARD, Tier 4 aircraft or worse: have all targets destroyed in 7:00 or less and achieve A rank.",
    points = 10,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x24) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(420) &&
        killCountIsAtleast(41)
    )
)

// A_RANK_ARCHNEMESIS
achievement(
    title = "Payback",
    description = "Archnemesis, HARD, Tier 4 aircraft or worse: have at least 21 targets destroyed in 3:30 or less and achieve A rank. Trigger icon will appear when you're eligible for achievement.",
    points = 10,
    trigger = (
        once(hasEnteredTheMission(0x25)) &&
        never(
            bailedIntoDataSwallow() ||
            isFlying() && (
                passedTimeLimitInSeconds(210)
            )
        ) &&
        trigger_when(
            usingTier4AircraftOrWorse() &&
            difficultyIsAtleast(DIFFICULTY_HARD) &&
            hasFinishedMission(0, fmvExpected = true) &&
            missionRankToSet == RANK_A &&
            killCountIsAtleast(21)
        ) && (
            willReachAtLeastTargets(targetRequirementForPhase = 9, totalTargetRequirement = 20) || (
                inGameTargetsRequired == 1 &&
                killCountIsAtleast(20)
            )
        )
    )
)

// A_RANK_MEMORY_ERROR
achievement(
    title = "Clipped Wings",
    description = "Memory Error, HARD, Tier 4 aircraft or worse: have all targets destroyed in 5:00 or less and achieve A rank.",
    points = 10,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x26) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(300) &&
        killCountIsAtleast(13)
    )
)

// A_RANK_ELECTROSPHERE
achievement(
    title = "[DATA EXPUNGED]",
    description = "Electrosphere, HARD, Tier 4 aircraft or worse: finish the fight within Electrosphere without using guns in 3:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        trigger_when(
            usingTier4AircraftOrWorse() &&
            hasFinishedMission(0, fmvExpected = true) &&
            missionRankToSet == RANK_A
        ) &&
        once(
            hasEnteredTheMission(0x3A)
        ) &&
        never(
            bailedIntoDataSwallow() ||
            isFlying() &&
            (
                passedTimeLimitInSeconds(180) ||
                (
                    prev(entityHealthByIndex(2)) - entityHealthByIndex(2) > 0 &&
                    prev(entityHealthByIndex(2)) - entityHealthByIndex(2) < 70
                )
            )
        )
    )
)

// A_RANK_POWER_FOR_LIFE
achievement(
    title = "They Came From Above",
    description = "Power for Life, HARD, R-311 Remora: have at least 21 targets destroyed in 3:00 or less and achieve A rank. Trigger icon will appear when you're eligible for achievement.",
    points = 5,
    trigger = (
        once(hasEnteredTheMission(0x28, cutsceneExpected = true)) &&
        never(
            bailedIntoDataSwallow() ||
            isFlying() && (
                passedTimeLimitInSeconds(180)
            )
        ) &&
        trigger_when(
            usingAircraft(remora) &&
            difficultyIsAtleast(DIFFICULTY_HARD) &&
            hasFinishedMission() &&
            missionRankToSet == RANK_A &&
            killCountIsAtleast(21)
        ) && willReachAtLeastTargets(targetRequirementForPhase = 6, totalTargetRequirement = 21)
    )
)

// A_RANK_ZERO_GRAVITY
achievement(
    title = "NeuStar",
    description = "Zero Gravity: complete the mission in 2:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        hasFinishedMission(0x2A) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(120)
    )
)

leaderboard(
    title = "Zero Gravity",
    description = "Fastest time to complete the mission",
    start = (
        hasEnteredTheMission(0x2A) &&
        noCheesing()
    ),
    cancel = (
        bailedIntoDataSwallow()
    ),
    submit = (
        inGameTargetsDestroyed == inGameTargetsRequired
    ),
    value = measured(inGameMissionTimeSpent * 3.333334),
    lower_is_better = true,
    format = "MILLISECS"
)

// A_RANK_GUARDIAN_ANGEL
achievement(
    title = "Phoca Care",
    description = "Guardian Angel, HARD, Tier 3 aircraft or worse: have all targets destroyed in 2:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier3AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x29) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(120)
    )
)

// A_RANK_THE_PRIZE
achievement(
    title = "Intel Meteorite",
    description = "The Prize, HARD, Tier 3 aircraft or worse: have all targets destroyed in 3:30 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(tier3AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x2B) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(210) &&
        killCountIsAtleast(26)
    )
)

// A_RANK_UTOPIAN_DREAMS
achievement(
    title = "Low Profile",
    description = "Utopian Dreams, HARD, Tier 4 aircraft or worse: have all targets destroyed in 2:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x2C) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(180) &&
        killCountIsAtleast(16)
    )
)

// A_RANK_RESISTANCE
achievement(
    title = "Rise Against Sphyrna",
    description = "Resistance, HARD, Tier 4 aircraft or worse: have at least 17 targets destroyed in 4:30 or less and achieve A rank. Trigger icon will appear when you're eligible for achievement.",
    points = 5,
    trigger = (
        once(hasEnteredTheMission(0x32, takeOffExpected = true)) &&
        never(
            bailedIntoDataSwallow() ||
            isFlying() && (
                passedTimeLimitInSeconds(270)
            )
        ) &&
        trigger_when(
            usingTier4AircraftOrWorse() &&
            difficultyIsAtleast(DIFFICULTY_HARD) &&
            hasFinishedMission() &&
            missionRankToSet == RANK_A
        ) &&
        inGameTargetsRequired == 4 &&
        (inGameMissionPlayerKillcount + inGameMissionAlliesKillcount) >= 17
    )
)

// A_RANK_RADIO_SILENCE
achievement(
    title = "Round 2",
    description = "Radio Silence, HARD, Tier 4 aircraft or worse: have all targets destroyed in 3:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x33) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(180)
    )
)

// A_RANK_REVENGE
achievement(
    title = "Megafloat Avenger",
    description = "Revenge, HARD, Tier 4 aircraft or worse: have all targets destroyed in 3:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x34) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(180)
    )
)

// A_RANK_TUNNEL_VISION
achievement(
    title = "Daredevil",
    description = "Tunnel Vision, NORMAL/HARD, Tier 4 aircraft or worse: get through the tunnel in 2:30 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_NORMAL) &&
        hasFinishedMission(0x37) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(150)
    )
)

// A_RANK_SOLE_SURVIVOR
achievement(
    title = "Super Underground Skirmish",
    description = "Sole Survivor, HARD, Tier 4 aircraft or worse: complete the mission in 4:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x35, fmvExpected = true) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(240)
    )
)

// A_RANK_REALITY_DISTORTION
achievement(
    title = "Rogue Rescue",
    description = "Reality Distortion, HARD, Tier 4 aircraft or worse: have all targets destroyed in 5:00 or less and achieve A rank.",
    points = 10,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x2D, fmvExpected = true) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(300) &&
        killCountIsAtleast(38)
    )
)

// A_RANK_COUNTERREVOLUTION
achievement(
    title = "Just Two Revolting",
    description = "Counterrevolution, HARD, Tier 4 aircraft or worse: have all targets destroyed in 5:00 or less and achieve A rank.",
    points = 10,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x2E) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(300) &&
        killCountIsAtleast(25)
    )
)

// A_RANK_PURSUIT
achievement(
    title = "Hunt Down the Raven",
    description = "Pursuit, HARD, Tier 4 aircraft or worse: complete the mission in 1:30 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x2F) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(90)
    )
)

// A_RANK_SELF_AWARENESS
achievement(
    title = "Sour Wings",
    description = "Self Awareness, HARD, Tier 4 aircraft or worse: complete the mission in 4:00 or less and achieve A rank.",
    points = 10,
    trigger = (
        usingTier4AircraftOrWorse() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x30, fmvExpected = true) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(240)
    )
)

// =====================
//  AIRCRAFT ANY A RANK
// =====================

for x in [
    [ "AIRCRAFT_A_RANK_TYPHOON",     "EF-2000E Typhoon II", [0x0A ], "Eye of the Storm" ],
    [ "AIRCRAFT_A_RANK_FULCRUM",     "MiG-33 Fulcrum SS",   [0x0B ], "Swallow" ],
    [ "AIRCRAFT_A_RANK_HORNET",      "F/A-18 Hornet ADV",   [0x01, 0x0C], "Carrier Bird" ],
    [ "AIRCRAFT_A_RANK_GYRFALCON",   "F-16XF Gyrfalcon",    [0x02, 0x0D], "Fighting Falcon" ],
    [ "AIRCRAFT_A_RANK_ASTEROZOA",   "R-201 Asterozoa",     [0x0F, 0x13], "Probably the Last Time You Pilot This" ],
    [ "AIRCRAFT_A_RANK_DELPHINUS",   "R-101 Delphinus #1",  [0x0E, 0x12], "Trust Me, I'm a Dolphin" ],
    [ "AIRCRAFT_A_RANK_SAKERFALCON", "F-16XA Sakerfalcon",  [0x03], "Delta Falconry" ],
    [ "AIRCRAFT_A_RANK_EAGLE",       "F-15S/MT Eagle+",    [0x04, 0x1F], "New Adler" ],
    [ "AIRCRAFT_A_RANK_RAPTOR",      "F-22C Raptor II",     [0x06], "Apex Predator" ],
    [ "AIRCRAFT_A_RANK_ERNE",        "F/A-32C Erne",        [0x07], "Sea Eagle" ],
    [ "AIRCRAFT_A_RANK_DELPHINUS_2", "R-102 Delphinus #2",  [0x14], "NeuGeneration" ],
    [ "AIRCRAFT_A_RANK_FLANKER",     "Su-37 Super Flanker", [0x10, 0x21], "Kono's Favorite" ],
] {
    aircraftName = x[1]
    aircraftIds = x[2]
    title = x[3]

    achievement(
        title = title,
        description = format("While piloting {0}, achieve A rank in any mission.", aircraftName),
        points = 3,
        trigger = (
            usingAircraft(aircraftIds) &&
            hasFinishedMission(0, fmvExpected = true) &&
            missionRankToSet == RANK_A
        )
    )
}

// ==========
//  HITLIST
// ==========

// SHOT_DOWN_KEITH
achievement(
    title = "Pinned Down",
    description = "Shoot down Keith piloting F/A-32C.",
    points = 3,
    trigger = (
        missionId == 0x28 &&
        isFlying() &&
        noCheesing() &&
        targetByIndexDied(11)
    )
)

// SHOT_DOWN_ERICH
achievement(
    title = "Not a Tale You'd Tell the Father",
    description = "Shoot down Erich piloting R-101U.",
    points = 3,
    trigger = (
        missionId == 0x18 &&
        isFlying() &&
        noCheesing() &&
        targetByIndexDied(10)
    )
)

// SHOT_DOWN_CYNTHIA
achievement(
    title = "Broken Dreams",
    description = "Shoot down Cynthia piloting R-103.",
    points = 3,
    trigger = (
        isFlying() &&
        noCheesing() &&
        (
            (missionId == 0x1A && targetByIndexDied(7)) ||
            (missionId == 0x33 && targetByIndexDied(1))
        )
    )
)

// ===============================
//  BLACKBIRD / REMORA CHALLENGES
// ===============================

blackbirdAwakeningStartConditions = (
    missionId == 0x1 &&
    isFlying() &&
    noCheesing() &&
    inGameThrustApplied >= 0x800 &&
    usingAircraft(blackbird) &&
    inGameMissionFlag == 2 &&
    inGameMissionPhase == 0 &&
    prev(inGameMissionFlagTimer) <= 0x20 &&
    inGameMissionFlagTimer > 0x20
)
blackbirdAwakeningResetConditions = (
    bailedIntoDataSwallow() ||
    inGameThrustApplied < 0x800 ||
    inGameThrustApplied < prev(inGameThrustApplied)
)

// BLACKBIRD_CHALLENGE_AWAKENING
achievement(
    title = "Swift Response",
    description = "Awakening: Blackbird intercepts and completes mission successfully in 0:28 or less and without letting go of afterburners.",
    points = 5,
    trigger = (
        once(blackbirdAwakeningStartConditions) &&

        never(
            blackbirdAwakeningResetConditions ||
            passedTimeLimitInSeconds(28)
        ) &&

        trigger_when(hasFinishedMission())
    )
)
leaderboard(
    title = "Awakening / Blackbird",
    description = "Fastest time to complete the mission without letting go of afterburners",
    start = blackbirdAwakeningStartConditions,
    cancel = blackbirdAwakeningResetConditions,
    submit = hasFinishedMission(),
    value = measured(inGameMissionTimeSpent * 3.333334),
    lower_is_better = true,
    format = "MILLISECS"
)

// BLACKBIRD_CHALLENGE_ENTER_DISION
achievement(
    title = "Blackbird vs. Dision",
    description = "Enter Dision: Mighty Blackbird eats Dision for breakfast with 3300 chase points or more, then saves the day with A rank in 2:35 or less.",
    points = 5,
    trigger = (
        usingAircraft(blackbird) &&
        hasFinishedMission(0x03) &&
        inGameAuxScore >= 3300 + 1800 &&
        missionTimerIsLessThanSeconds(155) &&
        missionRankToSet == RANK_A
    )
)

// BLACKBIRD_CHALLENGE_BROKEN_TRUCE
achievement(
    title = "Raiden",
    description = "Broken Truce, NORMAL/HARD: blazing through the rain, Blackbird intercepts and finishes the mission in 1:20 or less.",
    points = 5,
    trigger = (
        usingAircraft(blackbird) &&
        difficultyIsAtleast(DIFFICULTY_NORMAL) &&
        hasFinishedMission(0x05) &&
        missionTimerIsLessThanSeconds(80)
    )
)

// REMORA_CHALLENGE_GHOSTS_OF_THE_PAST
baseLocationPosPiece = byte(entityDataByIndex(0x21) + 0xb)
achievement(
    title = "Wiped Out",
    description = "Ghosts of the Past: R-311 Remora swoops to the central spot and gets A rank in 1:45 or less. The trigger icon will let you know when base is there!",
    points = 5,
    trigger = (
        once(
            hasEnteredTheMission(0x06) &&
            usingAircraft(remora) &&
            baseLocationPosPiece == 0xE3
        ) &&

        never(
            bailedIntoDataSwallow() ||
            (prev(baseLocationPosPiece) == 0xE3 && baseLocationPosPiece != 0xE3)
        ) &&
        trigger_when(
            hasFinishedMission() &&
            missionRankToSet == RANK_A &&
            missionTimerIsLessThanSeconds(105)
        )
    )
)
leaderboard(
    title = "Ghosts of the Past / Remora",
    description = "Fastest time to destroy base at the central spot with A rank",
    start = (
        hasEnteredTheMission(0x06) &&
        noCheesing() &&
        usingAircraft(remora) &&
        baseLocationPosPiece == 0xE3
    ),
    cancel = (
        bailedIntoDataSwallow() ||
        (prev(baseLocationPosPiece) == 0xE3 && baseLocationPosPiece != 0xE3)
    ),
    submit = (
        hasFinishedMission() &&
        missionRankToSet == RANK_A
    ),
    value = measured(inGameMissionTimeSpent * 3.333334),
    lower_is_better = true,
    format = "MILLISECS"
)

// BLACKBIRD_CHALLENGE_FATES_INTERTWINED
achievement(
    title = "Natural Habitat",
    description = "Fates Intertwined: the Moburas have no chance, as Blackbird intercepted them in 40 seconds or less.",
    points = 5,
    trigger = (
        usingAircraft(blackbird) &&
        hasFinishedMission(0x0A) &&
        missionTimerIsLessThanSeconds(40)
    )
)

// BLACKBIRD_CHALLENGE_ONE_WAY_TICKET
achievement(
    title = "Blackbird vs. Train",
    description = "One-Way Ticket, EASY: that's insane! Blackbird stopped that damn train in less than 9 seconds!",
    points = 5,
    trigger = (
        usingAircraft(blackbird) &&
        hasFinishedMission(0x0C) &&
        missionTimerIsLessThanSeconds(9)
    )
)

// BLACKBIRD_CHALLENGE_PAWNS_IN_THE_GAME
achievement(
    title = "Territorial Dispute",
    description = "Pawns in the Game, NORMAL/HARD: Blackbird immediately spikes down to summon and destroy 4 other Blackbirds (RF-12A2), then finish the mission in 3:00 or less. Trigger icon will show when it's ok to complete the mission.",
    points = 10,
    trigger = (
        usingAircraft(blackbird) &&
        all_of([11, 12, 13, 14], hostileBlackbird => once(targetByIndexDied(hostileBlackbird))) &&
        never(
            bailedIntoDataSwallow() ||
            hasEnteredTheMission(0x0E) ||
            passedTimeLimitInSeconds(180)
        ) &&
        trigger_when(hasFinishedMission(0x0E))
    )
)

// BLACKBIRD_CHALLENGE_PARTNERS
achievement(
    title = "Blackbird Alert",
    description = "Partners, NORMAL/HARD: Blackbird destroys 4 MSSLs then finishes the mission in 2:00 or less. Trigger icon will appear when all MSSLs are destroyed.",
    points = 5,
    trigger = (
        missionId == 0x17 &&
        trigger_when(
            usingAircraft(blackbird) &&
            difficultyIsAtleast(DIFFICULTY_NORMAL) &&
            hasFinishedMission() &&
            missionTimerIsLessThanSeconds(120)
        ) &&
        all_of([ 0x2D, 0x2E, 0x2F, 0x30 ], missileLauncher => once(targetByIndexDied(missileLauncher))) &&

        never(
            bailedIntoDataSwallow() ||
            hasEnteredTheMission()
        )
    )
)

// BLACKBIRD_CHALLENGE_GEOFRONT_ATTACK
achievement(
    title = "Biffgrounds",
    description = "Geofront Attack: Blackbird pecks down the entire Geofront in 2:30 or less.",
    points = 5,
    trigger = (
        usingAircraft(blackbird) &&
        hasFinishedMission(0x20) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(150)
    )
)
leaderboard(
    title = "Geofront Attack / Blackbird",
    description = "Fastest time to destroy all pillars",
    start = (
        hasEnteredTheMission(0x20, cutsceneExpected = true) &&
        usingAircraft(blackbird)
    ),
    cancel = (
        bailedIntoDataSwallow()
    ),
    submit = (
        inGameTargetsDestroyed == 10
    ),
    value = measured(inGameMissionTimeSpent * 3.333334),
    lower_is_better = true,
    format = "MILLISECS"
)

// REMORA_CHALLENGE_TUNNEL_VISION
achievement(
    title = "Geofront Racing League",
    description = "Tunnel Vision, NORMAL/HARD: R-311 Remora dares to go through the tunnels, successfully gambles the gate RNG and somehow avoids crashing in 2:00 or less.",
    points = 10,
    trigger = (
        usingAircraft(remora) &&
        difficultyIsAtleast(DIFFICULTY_NORMAL) &&
        hasFinishedMission(0x37) &&
        missionTimerIsLessThanSeconds(120)
    )
)

// BLACKBIRD_CHALLENGE_SELF_AWARENESS
achievement(
    title = "Blackbird vs. Raven",
    description = "Self Awareness: Blackbird helps Cynthia to ruin the entire Aeonosphere and hunt down the Night Raven in 3:00 or less. It's recommended to use bombs.",
    points = 10,
    trigger = (
        usingAircraft(blackbird) &&
        hasFinishedMission(0x30, fmvExpected = true) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(180)
    )
)
leaderboard(
    title = "Self Awareness / Blackbird",
    description = "Fastest time to destroy the Aeonosphere",
    start = (
        isFlying() &&
        missionId == 0x30 &&
        usingAircraft(blackbird) &&
        noCheesing() &&
        inGameTargetsRequired == 10
    ),
    cancel = (
        bailedIntoDataSwallow() ||
        inGameTargetsRequired != 10
    ),
    submit = (
        inGameTargetsDestroyed == 10
    ),
    value = measured(inGameMissionTimeSpent * 3.333334),
    lower_is_better = true,
    format = "MILLISECS"
)

// ==================
//  LASER CHALLENGES
// ==================

// LASER_CHALLENGE_AWAKENING
achievement(
    title = "Beam of Peace",
    description = "Awakening, NORMAL/HARD: Geopelia / Night Raven shreds all enemy forces with laser in 2:00 or less, don't let your allies steal YOUR kills!",
    points = 5,
    trigger = (
        once(
            hasEnteredTheMission(0x01) &&
            usingX49Geopelia() &&
            difficultyIsAtleast(DIFFICULTY_NORMAL)
        ) &&
        never(
            bailedIntoDataSwallow() ||
            isFlying() && (
                hasShotAMissile() ||
                passedTimeLimitInSeconds(120) ||
                allyKilledSomeone()
            )
        ) &&
        trigger_when(hasFinishedMission(0x1) && personalKillCountIsAtleast(12))
    )
)

// LASER_CHALLENGE_GHOSTS_OF_THE_PAST
achievement(
    title = "Pac-Mania",
    description = "Ghosts of the Past: Geopelia / Night Raven zooms through canyon to vaporize all 24 targets with laser in 5:30 or less. The trigger icon will appear when base is on the leftmost spot!",
    points = 10,
    trigger = (
        once(
            hasEnteredTheMission(0x06) &&
            usingX49Geopelia()
        ) &&

        once(
            baseLocationPosPiece == 0xD9 ||
            (isFlying() && word(0x0c7054) == 0xF901)
        ) &&

        never(
            bailedIntoDataSwallow() ||
            (prev(baseLocationPosPiece) == 0xD9 && baseLocationPosPiece != 0xD9) ||
            hasShotAMissile()
        ) &&
        trigger_when(
            hasFinishedMission() &&
            missionTimerIsLessThanSeconds(330) &&
            killCountIsAtleast(24)
        )
    )
)
leaderboard(
    title = "Ghosts of the Past / Geopelia",
    description = "Fastest time to destroy all 24 targets with laser",
    start = (
        hasEnteredTheMission(0x06) &&
        usingAircraft(geopelia)
    ),
    cancel = (
        bailedIntoDataSwallow() ||
        inGameMissileCount < 192
    ),
    submit = (
        hasFinishedMission() &&
        killCountIsAtleast(24)
    ),
    value = measured(inGameMissionTimeSpent * 3.333334),
    lower_is_better = true,
    format = "MILLISECS"
)

// LASER_CHALLENGE_REACHING_FOR_STARS
achievement(
    title = "Bug Assault",
    description = "Reaching for Stars, NORMAL/HARD: Geopelia / Night Raven lasers down all targets in 2:30 or less, don't let allies steal YOUR kills!",
    points = 5,
    trigger = (
        once(
            hasEnteredTheMission(0x0B) &&
            usingX49Geopelia() &&
            difficultyIsAtleast(DIFFICULTY_NORMAL)
        ) &&
        never(
            bailedIntoDataSwallow() ||
            isFlying() && (
                hasShotAMissile() ||
                passedTimeLimitInSeconds(150) ||
                allyKilledSomeone()
            )
        ) &&
        trigger_when(hasFinishedMission(0x0B) && personalKillCountIsAtleast(19))
    )
)

// LASER_CHALLENGE_BETRAYAL
achievement(
    title = "Unfair Competition",
    description = "Betrayal: Geopelia / Night Raven lasers down all airborne targets and doesn't let feisty Keith have any of them!",
    points = 10,
    trigger = (
        once(
            hasEnteredTheMission(0x1E) &&
            usingX49Geopelia()
        ) &&
        never(
            bailedIntoDataSwallow() ||
            isFlying() && (
                hasShotAMissile() ||
                allyKilledSomeone()
            )
        ) &&
        trigger_when(
            isFlying() &&
            inGameTargetsRequired == 26 &&
            inGameMissionPlayerKillcount == 26
        )
    )
)
leaderboard(
    title = "Betrayal EASY / Geopelia",
    description = "Fastest time to complete the mission with laser only",
    start = (
        hasEnteredTheMission(0x1E) &&
        inGameDifficulty == DIFFICULTY_EASY &&
        usingAircraft(geopelia)
    ),
    cancel = (
        bailedIntoDataSwallow() ||
        (isFlying() && hasShotAMissile())
    ),
    submit = (
        isFlying() &&
        inGameTargetsRequired == 0x1A &&
        inGameTargetsDestroyed == inGameTargetsRequired
    ),
    value = measured(inGameMissionTimeSpent * 3.333334),
    lower_is_better = true,
    format = "MILLISECS"
)

// LASER_CHALLENGE_LIQUIDATION
achievement(
    title = "Liquibeaming",
    description = "Liquidation, NORMAL/HARD: Geopelia / Night Raven *liquidates* everyone with laser in 7:00 or less.",
    points = 10,
    trigger = (
        once(
            hasEnteredTheMission(0x24, cutsceneExpected = true) &&
            difficultyIsAtleast(DIFFICULTY_NORMAL) &&
            usingX49Geopelia()
        ) &&
        never(
            bailedIntoDataSwallow() ||
            isFlying() && (
                hasShotAMissile() ||
                passedTimeLimitInSeconds(420)
            )
        ) &&
        trigger_when(hasFinishedMission() && killCountIsAtleast(41))
    )
)

// LASER_CHALLENGE_CASUALTIES_OF_WAR
achievement(
    title = "Laser Show",
    description = "Casualties of War, HARD: Geopelia / Night Raven lasers down all enemy forces in 2:00 or less and achieves A rank. Don't let Keith steal YOUR kills!",
    points = 5,
    trigger = (
        once(
            hasEnteredTheMission(0x21, cutsceneExpected = true) &&
            difficultyIsAtleast(DIFFICULTY_HARD)
        ) &&
        never(
            bailedIntoDataSwallow() ||
            isFlying() && (
                hasShotAMissile() ||
                passedTimeLimitInSeconds(120) ||
                (
                    // HACK: shooting down Dision for some reason
                    // increases the counter for killcount by allies, account for that
                    inGameTargetsDestroyed < inGameTargetsRequired &&
                    allyKilledSomeone()
                )
            )
        ) &&
        trigger_when(hasFinishedMission(0, fmvExpected = true) && personalKillCountIsAtleast(7))
    )
)

// LASER_CHALLENGE_GEOPELIA
achievement(
    title = "Morceaux Deux",
    description = "Geopelia, HARD: without firing missiles after the hack, laser down all enemy Geopelias in 5:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        once(
            hasEnteredTheMission(0x36) &&
            difficultyIsAtleast(DIFFICULTY_HARD)
        ) &&
        never(
            bailedIntoDataSwallow() ||
            isFlying() && (
                hasShotAMissile() ||
                passedTimeLimitInSeconds(300)
            )
        ) &&
        trigger_when(hasFinishedMission(0x36, fmvExpected = true))
    )
)

// LASER_CHALLENGE_SPHYRNA
achievement(
    title = "Sphyrnahhilation",
    description = "Sphyrna, NORMAL/HARD: Geopelia / Night Raven annihilates everyone with laser in 4:00 or less, don't let Erich steal YOUR kills!",
    points = 10,
    trigger = (
        once(
            hasEnteredTheMission(0x11, cutsceneExpected = true) &&
            usingX49Geopelia() &&
            difficultyIsAtleast(DIFFICULTY_NORMAL)
        ) &&
        never(
            bailedIntoDataSwallow() ||
            isFlying() && (
                hasShotAMissile() ||
                passedTimeLimitInSeconds(240) ||
                allyKilledSomeone()
            )
        ) &&
        trigger_when(hasFinishedMission() && personalKillCountIsAtleast(13))
    )
)

// LASER_CHALLENGE_TUNNEL_VISION
achievement(
    title = "Threading the Needle",
    description = "Tunnel Vision, NORMAL/HARD: Geopelia / Night Raven zooms through Geofront tunnels in 1:40 or less. It's much harder in Night Raven!",
    points = 10,
    trigger = (
        usingX49Geopelia() &&
        difficultyIsAtleast(DIFFICULTY_NORMAL) &&
        hasFinishedMission(0x37) &&
        missionTimerIsLessThanSeconds(100)
    )
)

// ===================
//  AURORA CHALLENGES
// ===================

// AURORA_CHALLENGE_PAPER_TIGER
achievement(
    title = "Paper Cut",
    description = "Paper Tiger, HARD: UI-4054 Aurora: have all targets destroyed in 2:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(aurora) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x04) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(120) &&
        killCountIsAtleast(25)
    )
)

// AURORA_CHALLENGE_MEGAFLOAT
achievement(
    title = "Dash Strike",
    description = "Megafloat, HARD, UI-4054 Aurora: have all targets destroyed in 2:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(aurora) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x15) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(120) &&
        killCountIsAtleast(25)
    )
)

// AURORA_CHALLENGE_CLAUSTROPHOBIA
achievement(
    title = "Ouromenace",
    description = "Claustrophobia, HARD, UI-4054 Aurora: have all targets destroyed in 3:20 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(aurora) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x1C) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(200) &&
        killCountIsAtleast(37)
    )
)

// AURORA_CHALLENGE_THE_ORIENTATION
achievement(
    title = "Double Down",
    description = "The Orientation, HARD, UI-4054 Aurora: have all targets destroyed in 5:00 or less and achieve A rank.",
    points = 5,
    trigger = (
        usingAircraft(aurora) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x23) &&
        missionRankToSet == RANK_A &&
        missionTimerIsLessThanSeconds(300) &&
        killCountIsAtleast(34)
    )
)

// =======================
//  LOW TIER ACHIEVEMENTS
// =======================

// FATES_INTERTWINED_LOW_TIER
achievement(
    title = "Budget Cuts",
    description = "Fates Intertwined, EASY: piloting the EF-2000E Typhoon II, finish the mission with B rank or better.",
    points = 10,
    trigger = (
        usingAircraft(typhoon) &&
        hasFinishedMission(0x0A) &&
        (missionRankToSet == RANK_A || missionRankToSet == RANK_B)
    )
)

// LOW_TIER_DAMAGE_CONTROL
achievement(
    title = "Pawn Power",
    description = "Damage Control, HARD: survive the ongoing war in Tier 1 plane and achieve A rank by having at least 22 targets destroyed. Trigger icon will appear when you're eligible for achievement.",
    points = 10,
    trigger = (
        once(hasEnteredTheMission(0x0F)) &&
        never(bailedIntoDataSwallow()) &&
        trigger_when(
            hasFinishedMission() &&
            missionRankToSet == RANK_A &&
            usingAircraft(tier1Aircraft) &&
            difficultyIsAtleast(DIFFICULTY_HARD)
        ) && (
            willReachAtLeastTargets(targetRequirementForPhase = 4, totalTargetRequirement = 22) ||
            willReachAtLeastTargets(targetRequirementForPhase = 6, totalTargetRequirement = 18)
        )
    )
)

// LOW_TIER_BROKEN_WINGS
achievement(
    title = "Not Enough Gs",
    description = "Broken Wings, HARD, Tier 2 aircraft or worse: survive the gauntlet in inferior aircraft while Sphyrna is watching.",
    points = 10,
    trigger = (
        usingAircraft(tier2AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x10)
    )
)
leaderboard(
    title = "Broken Wings HARD / Tier 2 aircraft or worse",
    description = "Fastest time to complete the mission",
    start = (
        hasEnteredTheMission(0x10) &&
        noCheesing() &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        usingAircraft(tier2AircraftOrWorse)
    ),
    cancel = (
        bailedIntoDataSwallow()
    ),
    submit = (
        isFlying() &&
        inGameTargetsDestroyed == inGameTargetsRequired
    ),
    value = measured(inGameMissionTimeSpent * 3.333334),
    lower_is_better = true,
    format = "MILLISECS"
)

// LOW_TIER_DISION
achievement(
    title = "XOR DISION, DISION",
    description = "Piloting a Tier 1 plane on NORMAL/HARD difficulty, shoot down Dision.",
    points = 10,
    trigger = (
        usingAircraft(tier1Aircraft) &&
        difficultyIsAtleast(DIFFICULTY_NORMAL) &&
        hasShotDownDision()
    )
)

// LOW_TIER_MEMORY_ERROR
achievement(
    title = "Kite Jr.",
    description = "Memory Error, HARD, Tier 2 aircraft or worse: against the odds, have everyone shot down and get the A rank.",
    points = 10,
    trigger = (
        usingAircraft(tier2AircraftOrWorse) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasFinishedMission(0x26) &&
        missionRankToSet == RANK_A &&
        killCountIsAtleast(13)
    )
)

// LOW_TIER_REALITY_DISTORTION
achievement(
    title = "Missile Conservation",
    description = "Reality Distortion, HARD: achieve A rank in Tier 1 aircraft by having at least 31 targets destroyed. Trigger icon will appear when you're eligible for achievement.",
    points = 10,
    trigger = (
        once(hasEnteredTheMission(0x2D)) &&
        never(bailedIntoDataSwallow()) &&
        trigger_when(
            usingAircraft(tier1Aircraft) &&
            difficultyIsAtleast(DIFFICULTY_HARD) &&
            hasFinishedMission(0, fmvExpected = true) &&
            missionRankToSet == RANK_A &&
            killCountIsAtleast(31)
        ) && (
            willReachAtLeastTargets(targetRequirementForPhase = 10, totalTargetRequirement = 31) ||
            willReachAtLeastTargets(targetRequirementForPhase = 16, totalTargetRequirement = 21)
        )
    )
)

// ================================
//  SPECIFIC AIRCRAFT ACHIEVEMENTS
// ================================

// RENA_VS_RENA
achievement(
    title = "Good vs. Evil",
    description = "Piloting Su-37 (Rena) on HARD difficulty, destroy the X-49 Night Raven.",
    points = 5,
    trigger = (
        isFlying() &&
        usingAircraft(su37Rena) &&
        difficultyIsAtleast(DIFFICULTY_HARD) &&
        hasShotDownRena()
    )
)

// ===================
//  MISC ACHIEVEMENTS
// ===================

// POST_LANDING_FAIL
achievement(
    title = "Nice Landing",
    description = "But you've overshot it.",
    points = 1,
    trigger = (
        gameLoopMode == GAME_LOOP_GAMEPLAY &&
        gameLoopState == GAMEPLAY_DECISION_LANDING && (
            prev(inGamePlaneBehavior) == PLANE_BEHAVIOR_LANDED ||
            prev(inGamePlaneBehavior) == PLANE_BEHAVIOR_LANDED_BRAKING
        ) &&
        inGamePlaneBehavior == PLANE_BEHAVIOR_CRASH
    )
)

// BRAVADO_FIGHTER_BOMB
achievement(
    title = "Weapon System Violation",
    description = "Bravado: drop a bomb onto enemy fighter, good luck trying.",
    points = 5,
    trigger = (
        isFlying() &&
        missionId == 0x2 &&
        a2gWeaponId == WEAPON_SPREAD_BOMB &&

        any_of([ 5, 6, 7, 8 ], function cb(neucomFighter) {
            health = entityHealthByIndex(neucomFighter)
            return
              (inGameDifficulty < DIFFICULTY_NORMAL && health - prev(health) == 0xFE5C) ||
              (inGameDifficulty >= DIFFICULTY_NORMAL && health - prev(health) == 0xFF2E)
        })
    )
)

// SCYLLA_AND_CHARYBDIS_THIRD_OPTION
achievement(
    title = "Friendly Fire",
    description = "There is no third OPTION.",
    points = 3,
    trigger = (
        missionId == 0x09 &&
        isFlying() &&
        dword(targetDataAddressByIndex(11)) != 0 &&
        dword(entityDataByIndex(13) + 0x50) != prev(dword(entityDataByIndex(13) + 0x50))
    )
)

// BETRAYAL_GUN_ONLY
achievement(
    title = "Marksmanship",
    description = "Betrayal: finish the mission with A rank using guns / pulse laser only. Geopelia / X-49 is not allowed.",
    points = 5,
    trigger = (
        once(
            hasEnteredTheMission(0x1E) &&
            gunId != 5
        ) &&
        never(
            bailedIntoDataSwallow() ||
            hasShotAMissile()
        ) &&
        trigger_when(hasFinishedMission() && missionRankToSet == RANK_A)
    )
)

// TUNNEL_VISION_YAW_ONLY
achievement(
    title = "Yaw Vision",
    description = "Tunnel Vision, EASY: finish the run without pitching or rolling your aircraft.",
    points = 5,
    trigger = (
        once(
            hasEnteredTheMission(0x37, cutsceneExpected = true) &&
            inGameDifficulty == DIFFICULTY_EASY
        ) &&
        never(
            bailedIntoDataSwallow() ||
            inGamePitchApplied != 0 ||
            inGameRollApplied != 0
        ) &&
        trigger_when(hasFinishedMission())
    )
)

// TUNNEL_VISION_BARREL_ROLL
threshold = 1024
inGameRoll = word(entityDataByIndex(0) + 0x1C)
rollToRightConditions = [
    prev(inGameRoll) >  0xFFFF - threshold && inGameRoll < threshold,
    prev(inGameRoll) >= 0x1000 - threshold && prev(inGameRoll) <  0x1000 && inGameRoll >= 0x1000,
    prev(inGameRoll) >= 0x2000 - threshold && prev(inGameRoll) <= 0x2000 && inGameRoll >= 0xDFFF,
    prev(inGameRoll) >= 0xEFFF - threshold && prev(inGameRoll) <  0xEFFF && inGameRoll >= 0xEFFF,
]

rollToLeftConditions = [
    prev(inGameRoll) < threshold && inGameRoll >= 0xFFFF - threshold,
    prev(inGameRoll) >  0xEFFF   && inGameRoll <= 0xEFFF && inGameRoll >= 0xEFFF - threshold,
    prev(inGameRoll) >= 0xDFFF   && inGameRoll <  0x2000 && inGameRoll >= 0x2000 - threshold,
    prev(inGameRoll) >  0x1000   && inGameRoll <= 0x1000 && inGameRoll >= 0x1000 - threshold,
]

achievement(
    title = "Supercharge",
    description = "Tunnel Vision: do plenty of barrel rolling in same direction inside one of those hexagonal green tubes.",
    points = 3,
    trigger = (
        missionId == 0x37 &&

        never(gameLoopState == GAMEPLAY_RETRY) &&
        never(bailedIntoDataSwallow()) &&

        // before first set of tubes
        never(playerPosZ < 0x11c34ead) &&

        // between first and second set of tubes
        never(playerPosZ > 0x1484a316 && playerPosZ < 0x178456b8) &&

        // between second left and third set of tubes
        never(playerPosX < 0xfc760000 && playerPosZ > 0x1985aee7 && playerPosZ < 0x2f03dacd) &&

        // between second right and third set of tubes
        never(playerPosX >= 0xfc760000 && playerPosZ > 0x1b040540 && playerPosZ < 0x2f03dacd) &&

        // after third set of tubes
        never(playerPosZ > 0x3188339e) &&

        trigger_when(
            any_of([
                [rollToRightConditions, rollToLeftConditions, 0],
                [rollToRightConditions, rollToLeftConditions, 1],
                [rollToRightConditions, rollToLeftConditions, 2],
                [rollToRightConditions, rollToLeftConditions, 3],
                [rollToLeftConditions, rollToRightConditions, 0],
                [rollToLeftConditions, rollToRightConditions, 1],
                [rollToLeftConditions, rollToRightConditions, 2],
                [rollToLeftConditions, rollToRightConditions, 3],
            ], function cb(array) {
                first = array[0]
                second = array[1]
                idx = array[2]

                result = []

                array_push(result, first[idx])
                array_push(result, first[(idx + 1) % 4])
                array_push(result, first[(idx + 2) % 4])
                array_push(result, first[(idx + 3) % 4])
                array_push(result, first[idx])
                array_push(result, first[(idx + 1) % 4])
                array_push(result, first[(idx + 2) % 4])
                array_push(result, first[(idx + 3) % 4])
                array_push(result, first[idx])

                return (
                    once(
                        array_chain(result) &&
                        never(any_of(second, x => x))
                    )
                )
            })
        )
    )
)

// ===================
//  MISC LEADERBOARDS
// ===================

for x in [
    [ delphinus3, "R-103 Delphinus 3", "EASY",        [DIFFICULTY_EASY]],
    [ delphinus3, "R-103 Delphinus 3", "NORMAL/HARD", [DIFFICULTY_NORMAL, DIFFICULTY_HARD]],
    [ remora,     "R-311 Remora",      "NORMAL/HARD", [DIFFICULTY_NORMAL, DIFFICULTY_HARD]],
    [ geopelia,   "Geopelia",          "HARD",        [DIFFICULTY_HARD]]
] {
    aircraftIds = x[0]
    aircraftName = x[1]
    difficultyName = x[2]
    difficultyIds = x[3]

    leaderboard(
        title = format("Tunnel Vision {0} / {1}", difficultyName, aircraftName),
        description = "Fastest time to complete the mission",
        start = (
            hasEnteredTheMission(0x37, cutsceneExpected = true) &&
            usingAircraft(aircraftIds) &&
            any_of(difficultyIds, id => inGameDifficulty == id)
        ),
        cancel = bailedIntoDataSwallow(),
        submit = (
            inGameNextAction == NEXT_ACTION_DEBRIEFING && inGameNextAction2 == 1
        ),
        value = measured(inGameMissionTimeSpent * 3.333334),
        lower_is_better = true,
        format = "MILLISECS"
    )
}

// =============
// RICH PRESENCE
// =============

aircraftLookup = rich_presence_lookup("Aircraft", aircraftId, aircraftIdToString)
difficultyLookup = rich_presence_lookup("Difficulty", inGameDifficulty, {
    0: "EASY",
    1: "NORMAL",
    2: "HARD",
})
corpLookup = rich_presence_lookup("Corporation", missionId, missionIdToCorp)
missionLookup = rich_presence_lookup("Mission", missionId, missionIdToString)

// HACK: value below produces invalid code
//       I:0xW0bceb4_M:0xX00000c*f0,03333333333333333 makes the output 0:00
//       I:0xW0bceb4_M:0xX00000c/30 makes the output correct
timeLookup = rich_presence_value("MissionTime", inGameMissionTimeSpent / 30, "SECS")

function dataSwallowRichPresence(corpName, condition) {
    rich_presence_conditional_display(
        condition,
        "{0} | Operating Data Swallow",
        corpName
    )
}

function missionRichPresence(corpName, condition) {
    rich_presence_conditional_display(
        condition,
        "{0} 📍 {1} ({2}) ⏰ {3} ✈️ {4}",
        corpName,
        missionLookup,
        difficultyLookup,
        timeLookup,
        aircraftLookup
    )
}

rich_presence_conditional_display(gameLoopMode == GAME_LOOP_MAIN_MENU, "Logging in to Electrosphere")
rich_presence_conditional_display(gameLoopMode == GAME_LOOP_FMV, "Watching FMV cutscene")

for x in [
    [ 0x12, "UPEO"],
    [ 0x30, "Neucom - Ouroboros"],
    [ 0x35, "Neucom"],
    [ 0x36, "General Resource"],
    [ 0x3A, "General Resource - Ouroboros"],
] {
    expectedMissionId = x[0]
    endingName = x[1]

    rich_presence_conditional_display(
        gameLoopMode == GAME_LOOP_CREDITS && missionId == expectedMissionId,
        "Credits: {0} Ending",
        endingName
    )
}
dataSwallowRichPresence("Mission Simulator", gameLoopMode == GAME_LOOP_DATA_SWALLOW && isInMissionSimulator())
dataSwallowRichPresence(corpLookup, gameLoopMode == GAME_LOOP_DATA_SWALLOW)

missionRichPresence("Mission Simulator", gameLoopMode == GAME_LOOP_GAMEPLAY && isInMissionSimulator())
missionRichPresence(corpLookup, gameLoopMode == GAME_LOOP_GAMEPLAY)

rich_presence_display("Playing Ace Combat 3: Electropshere")
