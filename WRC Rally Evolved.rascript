// WRC Rally Evolved
// #ID = 19283

// ============
//  CONSTANTS
// ============

_  = 0x5F000000
__ = 0x5F5F0000

// Countries

AR = 0x5241
AU = 0x5541
CY = 0x5943
DE = 0x4544
ES = 0x5345
FI = 0x4946
FR = 0x5246
GB = 0x4247
GR = 0x5247
IT = 0x5449
JA = 0x414A
MC = 0x434D
ME = 0x454D
NZ = 0x5A4E
SE = 0x4553
TR = 0x5254

countryIdToString = {
    AR: "Argentina",
    AU: "Australia",
    CY: "Cyprus",
    DE: "Germany",
    ES: "Spain",
    FI: "Finland",
    FR: "France",
    GB: "Great Britain",
    GR: "Greece",
    IT: "Italy",
    JA: "Japan",
    MC: "Monte Carlo",
    ME: "Mexico",
    NZ: "New Zealand",
    SE: "Sweden",
    TR: "Turkey",
}

// Trophies
AR__ = __ + AR
AU__ = __ + AU
CY__ = __ + CY
DE__ = __ + DE
ES__ = __ + ES
FI__ = __ + FI
FR__ = __ + FR
GB__ = __ + GB
GR__ = __ + GR
IT__ = __ + IT
JA__ = __ + JA
MC__ = __ + MC
ME__ = __ + ME
NZ__ = __ + NZ
SE__ = __ + SE
TR__ = __ + TR
RX__ = __ + 0x5852
HIST = 0x54534948
JCHA = 0x4148434A
NCHA = 0x4148434E
PCHA = 0x41484350
ECHA = 0x41484345

trophyIdToString = {
    AR__: "Rally Argentina",
    AU__: "Rally Australia",
    CY__: "Rally Cyprus",
    DE__: "Rally Germany",
    ES__: "Rally Spain",
    FI__: "Rally Finland",
    FR__: "Rally France",
    GB__: "Rally Great Britain",
    GR__: "Rally Greece",
    IT__: "Rally Italy",
    JA__: "Rally Japan",
    MC__: "Rally Monte Carlo",
    ME__: "Rally Mexico",
    NZ__: "Rally New Zealand",
    SE__: "Rally Sweden",
    TR__: "Rally Turkey",
    RX__: "Rallycross",
    HIST: "Historic Challenge",
    JCHA: "Championship Junior",
    NCHA: "Championship Novice",
    PCHA: "Championship Professional",
    ECHA: "Championship Expert",
}

// Cars
FPS_ = _ + 0x535046
P2S_ = _ + 0x533250
FFS_ = _ + 0x534646
RCS_ = _ + 0x534352
SIS_ = _ + 0x534953
SSS_ = _ + 0x535353
CXW_ = _ + 0x575843
FCW_ = _ + 0x574346
FBW_ = _ + 0x574246
SIW_ = _ + 0x574953
P3W_ = _ + 0x573350
MLW_ = _ + 0x574c4d
SFW_ = _ + 0x574653
CXP_ = _ + 0x505843
FFP_ = _ + 0x504646
FSP_ = _ + 0x505346
P2P_ = _ + 0x503250
SFP_ = _ + 0x504653
SIP_ = _ + 0x504953
FFC_ = _ + 0x434646
SBC_ = _ + 0x434253
P3C_ = _ + 0x433350
MCE_ = _ + 0x45434d
CXE_ = _ + 0x455843
FFE_ = _ + 0x454646
SIE_ = _ + 0x454953
P3E_ = _ + 0x453350
MLE_ = _ + 0x454c4d
SFE_ = _ + 0x454653
AQH_ = _ + 0x485141
LDH_ = _ + 0x48444c
FRH_ = _ + 0x485246
LRH_ = _ + 0x48524c
P2H_ = _ + 0x483250
RMH_ = _ + 0x484d52

carIdToString = {
    FPS_: "Fiat Punto Abarth Rally S1600",
    P2S_: "Peugeot 206 S1600",
    FFS_: "Ford Fiesta S1600",
    RCS_: "Renault Clio S1600",
    SIS_: "Suzuki Ignis S1600",
    SSS_: "Suzuki Swift S1600",
    CXW_: "Citroen Xsara WRC",
    FCW_: "Ford Focus WRC",
    FBW_: "Ford Focus WRC",
    SIW_: "Subaru Impreza WRC 2005",
    P3W_: "Peugeot 307 WRC",
    MLW_: "Mitsubishi Lancer WRC05",
    SFW_: "Skoda Fabia WRC",
    CXP_: "Citroen Xsara WRC",
    FFP_: "Ford Focus WRC",
    FSP_: "Ford Focus WRC",
    P2P_: "Peugeot 206 WRC",
    SFP_: "Skoda Fabia WRC",
    SIP_: "Subaru Impreza WRC",
    FFC_: "Ford Focus RS Concept",
    SBC_: "Subaru B95C",
    P3C_: "Peugeot 307 Berline",
    MCE_: "Mitsubishi Colt Rally Extreme",
    CXE_: "Citroen Xsara Extreme 05",
    FFE_: "Ford Focus Extreme 05",
    SIE_: "Subrau Impreza Extreme 05",
    P3E_: "Peugeot 307 Extreme 05",
    MLE_: "Mitsubishi Lancer Evolution Extreme Max II",
    SFE_: "Skoda Fabia Extreme 05",
    AQH_: "Audi Sport Quattro S1",
    LDH_: "Lancia Delta S4",
    FRH_: "Ford RS200",
    LRH_: "Lancia Rally 037",
    P2H_: "Peugeot 205 T16",
    RMH_: "Renault 5 Maxi Turbo",
}

// Tracks
MC1 = 0x31434d
MC2 = 0x32434d
MC3 = 0x33434d
SE1 = 0x314553
SE2 = 0x324553
SE3 = 0x334553
ME1 = 0x31454d
ME2 = 0x32454d
ME3 = 0x33454d
NZ1 = 0x315a4e
NZ2 = 0x325a4e
NZ3 = 0x335a4e
IT1 = 0x315449
IT2 = 0x325449
IT3 = 0x335449
CY1 = 0x315943
CY2 = 0x325943
CY3 = 0x335943
TR1 = 0x315254
TR2 = 0x325254
TR3 = 0x335254
GR1 = 0x315247
GR2 = 0x325247
GR3 = 0x335247
AR1 = 0x315241
AR2 = 0x325241
AR3 = 0x335241
FI1 = 0x314946
FI2 = 0x324946
FI3 = 0x334946
DE1 = 0x314544
DE2 = 0x324544
DE3 = 0x334544
GB1 = 0x314247
GB2 = 0x324247
GB3 = 0x334247
JA1 = 0x31414a
JA2 = 0x32414a
JA3 = 0x33414a
FR1 = 0x315246
FR2 = 0x325246
FR3 = 0x335246
ES1 = 0x315345
ES2 = 0x325345
ES3 = 0x335345
AU1 = 0x315541
AU2 = 0x325541
AU3 = 0x335541

trackIdToString = {
    MC1: "SS1 - Prunieres",
    MC2: "SS2 - Sigale",
    MC3: "SS3 - Turini",
    SE1: "SS1 - Sagen",
    SE2: "SS2 - Vargasen",
    SE3: "SS3 - Hagfors",
    ME1: "SS1 - El Cubilete",
    ME2: "SS2 - Otates",
    ME3: "SS3 - La Esperanza",
    NZ1: "SS1 - Te Akau North",
    NZ2: "SS2 - Parahi",
    NZ3: "SS3 - Waipu Gorge",
    IT1: "SS1 - Berchidda",
    IT2: "SS2 - Pattada",
    IT3: "SS3 - Punta Balistreri",
    CY1: "SS1 - Foini",
    CY2: "SS2 - Galatareia",
    CY3: "SS3 - Kellaki",
    TR1: "SS1 - Simena",
    TR2: "SS2 - Silyon",
    TR3: "SS3 - Phaselis",
    GR1: "SS1 - Amfissa",
    GR2: "SS2 - Drosohori",
    GR3: "SS3 - Elatia",
    AR1: "SS1 - Villa Albertina",
    AR2: "SS2 - Capilla del Monte",
    AR3: "SS3 - La Cumbre",
    FI1: "SS1 - Parkkola",
    FI2: "SS2 - Moksi",
    FI3: "SS3 - Ouninpohja",
    DE1: "SS1 - Bosenberg",
    DE2: "SS2 - Moselland",
    DE3: "SS3 - Panzerplatte Ost",
    GB1: "SS1 - Resolfen",
    GB2: "SS2 - Rheola",
    GB3: "SS3 - Margam",
    JA1: "SS1 - Obihiro",
    JA2: "SS2 - Hidaka",
    JA3: "SS3 - Rikubetsu",
    FR1: "SS1 - Pont du Liamone",
    FR2: "SS2 - Coti-Chiavari",
    FR3: "SS3 - Col de Carazzi",
    ES1: "SS1 - La Roca",
    ES2: "SS2 - Viladrau",
    ES3: "SS3 - La Pobla",
    AU1: "SS1 - Bannister North",
    AU2: "SS2 - Helena South",
    AU3: "SS3 - Stirling West"
}

// Historic challenges
HAQ1 = 0x31514148
HAQ2 = 0x32514148
HAQ3 = 0x33514148
HFR1 = 0x31524648
HFR2 = 0x32524648
HFR3 = 0x33524648
HL01 = 0x31304c48
HL02 = 0x32304c48
HL03 = 0x33304c48
HLD1 = 0x31444c48
HLD2 = 0x32444c48
HLD3 = 0x33444c48
HPT1 = 0x31545048
HPT2 = 0x32545048
HPT3 = 0x33545048
HR51 = 0x31355248
HR52 = 0x32355248
HR53 = 0x33355248

historicChallengeIdToString = {
    HAQ1: "Audi Quattro Bronze",
    HAQ2: "Audi Quattro Silver",
    HAQ3: "Audi Quattro Gold",
    HFR1: "Ford RS200 Bronze",
    HFR2: "Ford RS200 Silver",
    HFR3: "Ford RS200 Gold",
    HL01: "Lancia 037 Bronze",
    HL02: "Lancia 037 Silver",
    HL03: "Lancia 037 Gold",
    HLD1: "Lancia Delta S4 Bronze",
    HLD2: "Lancia Delta S4 Silver",
    HLD3: "Lancia Delta S4 Gold",
    HPT1: "Peugeot 205 T16 Bronze",
    HPT2: "Peugeot 205 T16 Silver",
    HPT3: "Peugeot 205 T16 Gold",
    HR51: "Renault 5 Maxi Turbo Bronze",
    HR52: "Renault 5 Maxi Turbo Silver",
    HR53: "Renault 5 Maxi Turbo Gold"
}

// Cheats
BLUR = 0x52554c42 // Motion Blur
CUNL = 0x4c4e5543 // Car unlock
MOON = 0x4e4f4f4d // Low gravity
NODA = 0x41444f4e // No damage
PSYC = 0x43595350 // Psychedelic sky
REVE = 0x45564552 // All reveals on
SQUE = 0x45555153 // Helium codriver
TOPD = 0x44504f54 // Top down camera
WUNL = 0x4c4e5557 // World unlock
XEYE = 0x45594558 // Cross-eyed co-driver

// Enums
GAMEMODE_QUICK_RACE = 0x1
GAMEMODE_SINGLE_STAGE = 0x2
GAMEMODE_SINGLE_RALLY = 0x3
GAMEMODE_CHAMPIONSHIP = 0x4
GAMEMODE_RALLYCROSS = 0x6
GAMEMODE_TEST_COURSE = 0x7
GAMEMODE_HISTORIC_CHALLENGE = 0xa

RALLY_CLASS_S1600 = 0x1
RALLY_CLASS_WRC = 0x2
RALLY_CLASS_EXTREME = 0x3
RALLY_CLASS_HISTORIC = 0x5
RALLY_CLASS_INDEPENDENTS = 0x6

RALLY_DIFFICULTY_NOVICE = 0x1
RALLY_DIFFICULTY_PROFESSIONAL = 0x2
RALLY_DIFFICULTY_EXPERT = 0x3

// ============
//    LOOKUP
// ============

assistBraking = byte(0x1FDFF67)
assistSteering = byte(0x1FDFF65)
assistTractionControl = byte(0x1FDFF66)

carClassId = byte(0x1ffa405)
carId = dword(dword(0x1ff4b3c))
// HACK: I don't know why but if I refer to regular carId in leaderboard - I get always_true/false. RATools 1.9.1
carIdFunc = () => dword(dword(0x1ff4b3c))

cheatActive = byte(0x4d94e4)
cheatSelectedID = dword(0x5794e8)

inGameCamera = dword(dword(dword(dword(0x4dbbb0) + 0xFB4) + 0x0) + 0x8)

inGameRallycrossPointer = dword(0x5797a0)
inGameRallycrossRaceInProgress = byte(inGameRallycrossPointer + 0x36)
inGameRallycrossTime = dword(inGameRallycrossPointer + 0x38)
inGameRallycrossLapsLeft = dword(inGameRallycrossPointer + 0x40)
inGameRallycrossLapsToComplete = dword(inGameRallycrossPointer + 0x44)

inGameRallycrossPositionOnFinish = dword(dword(0x5797e0) + 0xC)

inGameRallyStagePointer = dword(0x579268)
inGameRallyStageFinished = byte(inGameRallyStagePointer + 0x1615)
inGameRallyStageTime = dword(inGameRallyStagePointer + 0x1600)

gameMode = byte(0x1ffa404)

rallyClass = byte(0x1ffa402)
rallyDifficulty = byte(0x1ffa403)
rallyFinishPosition = dword(0x1fea948)

manualTransmissionActive = byte(0x1FDFF64)

onScreenDisplayPacenotes = bit6(0x1FDFF60)

playerAmount = word(0x1ffa408)

trackCountryPointer = dword(0x1fe4cec)
trackCountryId = dword(trackCountryPointer)
trackIdPointer = dword(0x1fe4cf4)

// ============
// AUX    FUNCS
// ============

function carWasReset() {
    tint = float(dword(0x4dbbb0) + 0xE80)

    return tint > prev(tint)
}

function debugModeCodeTampered() =>
    dword(0x241174) != 0x90420000 || dword(0x4d069c) != 0x104710

function isCheatingInRally() {
    // return always_false()

    return (
        debugModeCodeTampered() ||
        (cheatActive != 0 && (
            cheatSelectedID == MOON ||
            cheatSelectedID == NODA ||
            cheatSelectedID == REVE
        ))
    )
}

function isCheatingInRallycross() {
    // return always_false()

    return (
        debugModeCodeTampered() ||
        (cheatActive != 0 && cheatSelectedID == MOON)
    )
}

function isInGamemodePickMenu() {
    // check if 0x1AAFF34 equals .P_menuB
    return (
        dword(0x1AAFF34) == 0x6D5F502E &&
        dword(0x1AAFF38) == 0x42756E65
    )
}

function isInPodiumMenu() {
    // check if 0x1AAFF34 equals .podium.
    return (
        dword(0x1AAFF34) == 0x646F702E &&
        dword(0x1AAFF38) == 0x2E6D7569
    )
}

function isOnStageByIndex(index) {
    // MC1_
    // Some tracks have different suffixes, like AU1R
    trackCharacters = byte(trackIdPointer + 0x2)

    if (index >= 1 && index <= 3) {
        return trackCharacters == (0x30 + index)
    }
}

function isOnTrack(trackId) {
    // if first letter is H - for historic challenges
    if (trackId & 0xFF == 0x48) {
        return dword(trackIdPointer) == trackId
    } else {
        return tbyte(trackIdPointer) == trackId
    }
}

function hasCheatActive(cheat) => cheatActive == 1 && cheatSelectedID == cheat

function hasDamagedCar() {
    carDamagePointer = dword(0x5796e4)
    offsets = [
        0x3F0,
        0x40C,
        0x454,
        0x48C,
        0x4A8,
        0x4C4
    ]

    return carDamagePointer != 0 && any_of(offsets, offset => (
        byte(carDamagePointer + offset) > prev(byte(carDamagePointer + offset))
    ))
}

function hasFinishedStage() {
    return prev(inGameRallyStageFinished) == 0 && inGameRallyStageFinished == 1
}

function hasStartedRallycrossEvent() {
    return prev(inGameRallycrossTime) == 0 && inGameRallycrossTime > 0
}

function hasStartedStage() {
    return prev(inGameRallyStageTime) == 0 && inGameRallyStageTime > 0
}

function hasWonChampionship() {
    return (
        playerAmount == 1 &&
        gameMode == GAMEMODE_CHAMPIONSHIP &&
        isInPodiumMenu() && (
            byte(0x1fea94c) == 0 ||
            byte(0x1fea94c) == 2
        )
    )
}

function hasWonRally() => (
    playerAmount == 1 &&
    ( gameMode == GAMEMODE_SINGLE_RALLY || gameMode == GAMEMODE_CHAMPIONSHIP ) &&
    isInPodiumMenu() &&
    byte(0x1fea94c) == 1 &&
    rallyFinishPosition == 1
)

function hasWonRallyInOneSitting(
    showTrigger = true,
    additionalStartConditions = always_true(),
    additionalResetConditions = always_false()
) {
    hasCorrectGamemode = (
        gameMode == GAMEMODE_SINGLE_RALLY ||
        gameMode == GAMEMODE_CHAMPIONSHIP
    )

    triggerBadgeCondition = hasWonRally()
    if (showTrigger == true) {
        triggerBadgeCondition = trigger_when(triggerBadgeCondition)
    }

    return (
        hasCorrectGamemode &&
        once(isOnStageByIndex(1) && hasStartedStage() && additionalStartConditions) &&
        never(isInGamemodePickMenu() || additionalResetConditions) &&
        triggerBadgeCondition
    )
}

function hasWonRallycrossEvent() {
    hasFinished = (
        prev(inGameRallycrossRaceInProgress) == 1 &&
        inGameRallycrossRaceInProgress == 0
    )

    return (
        gameMode == GAMEMODE_RALLYCROSS &&
        once(hasFinished) &&
        inGameRallycrossPositionOnFinish == 1 &&
        never(inGameRallycrossPointer == 0 || inGameRallycrossTime == 0x7FFFFFFF)
    )
}

function makeLeaderboard(title, expectedTrackId, expectedCarIds = []) {

    additionalStartConditions = always_true()
    if (length(expectedCarIds) > 0) {
        // HACK: referring to carId instead of carIdFunc ruins the condition! RATools 1.9.1
        additionalStartConditions = any_of(expectedCarIds, expectedCarId => expectedCarId == carIdFunc())
    }

    leaderboard(
        title = title,
        description = "Finish in least time",
        start = (
            isOnTrack(expectedTrackId) &&
            hasStartedStage() &&
            additionalStartConditions
        ),
        cancel = (
            (prev(inGameRallyStageTime) > 0 && inGameRallyStageTime == 0) ||
            carWasReset() ||
            isInGamemodePickMenu() ||
            isCheatingInRally()
        ),
        submit = hasFinishedStage(),
        value = measured(inGameRallyStageTime / 10),
        lower_is_better = true,
        format = "MILLISECS"
    )
}

function trackIdToCountryId(trackId) => ((trackId - _) & 0xFFFF)
function trackIdToCountryString(trackId) => countryIdToString[trackIdToCountryId(trackId)]

// ============
// ACHIEVEMENTS
// ============

for x in [
    [ 10, RALLY_CLASS_S1600, RALLY_DIFFICULTY_NOVICE,       "Junior Champion", "Super 1600 Championship" ],
    [ 10, RALLY_CLASS_WRC,   RALLY_DIFFICULTY_NOVICE,       "WRC Novice Champion", "World Rally Championship on Novice difficulty or higher" ],
    [ 25, RALLY_CLASS_WRC,   RALLY_DIFFICULTY_PROFESSIONAL, "WRC Professional Champion", "World Rally Championship on Professional difficulty or higher" ],
    [ 50, RALLY_CLASS_WRC,   RALLY_DIFFICULTY_EXPERT,       "WRC Expert Champion", "World Rally Championship on Expert difficulty" ],
] {
    achievementPoints = x[0]
    expectedRallyClass = x[1]
    expectedRallyDifficulty = x[2]
    title = x[3]
    championshipDescription = x[4]

    rallyDifficultyCondition = rallyDifficulty == expectedRallyDifficulty
    if (expectedRallyClass == RALLY_CLASS_WRC) {
        rallyDifficultyCondition = (
            rallyDifficulty >= expectedRallyDifficulty &&
            rallyDifficulty <= RALLY_DIFFICULTY_EXPERT
        )
    }

    achievement(
        title = title,
        description = format("Win the {0}", championshipDescription),
        points = achievementPoints,
        trigger = (
            rallyClass == expectedRallyClass &&
            rallyDifficultyCondition &&
            hasWonChampionship() &&
            unless(isCheatingInRally())
        )
    )
}

for x in [
    [ MC__, "Monte Carlo Rally Champion" ],
    [ SE__, "Swedish Rally Champion" ],
    [ ME__, "Rally Mexico Champion" ],
    [ NZ__, "Rally New Zealand Champion" ],
    [ IT__, "Rally d'Italia Sardegna Champion" ],
    [ CY__, "Cyprus Rally Champion" ],
    [ TR__, "Rally of Turkey Champion" ],
    [ GR__, "Acropolis Rally Champion" ],
    [ AR__, "Rally Argentina Champion" ],
    [ FI__, "Rally Finland Champion" ],
    [ DE__, "Rallye Deutschland Champion" ],
    [ GB__, "Wales Rally GB Champion" ],
    [ JA__, "Rally Japan Champion" ],
    [ FR__, "Tour de Corse Champion" ],
    [ ES__, "Rally Catalunya Champion" ],
    [ AU__, "Rally Australia Champion" ],
] {
    countryId = x[0]
    achievementName = x[1]

    achievement(
        title = achievementName,
        description = format(
            "Win the {0} on WRC Professional or Expert difficulty",
            trophyIdToString[countryId]
        ),
        points = 5,
        trigger = (
            rallyClass == 2 &&
            (rallyDifficulty == 2 || rallyDifficulty == 3) &&
            trackCountryId == countryId &&
            hasWonRally() &&
            unless(isCheatingInRally())
        )
    )
}

for x in [
    [ 2, [ FPS_ ] ],
    [ 2, [ P2S_ ] ],
    [ 2, [ FFS_ ] ],
    [ 2, [ RCS_ ] ],
    [ 2, [ SIS_ ] ],
    [ 2, [ SSS_ ] ],
    [ 3, [ CXW_ ] ],
    [ 3, [ FCW_, FBW_ ] ],
    [ 3, [ SIW_ ] ],
    [ 3, [ P3W_ ] ],
    [ 3, [ MLW_ ] ],
    [ 3, [ SFW_ ] ],
] {
    points = x[0]
    expectedCarIds = x[1]

    achievement(
        title = format(
            "{0} Enthusiast",
            carIdToString[expectedCarIds[0]]
        ),
        description = format(
            "Win any rally event in {0}",
            carIdToString[expectedCarIds[0]]
        ),
        points = points,
        trigger = (
            ( gameMode == GAMEMODE_SINGLE_RALLY || gameMode == GAMEMODE_CHAMPIONSHIP ) &&
            any_of(expectedCarIds, expectedCarId => carId == expectedCarId) &&
            hasWonRally() &&
            unless(isCheatingInRally())
        )
    )
}

for x in [
    [ CXE_ ],
    [ FFE_ ],
    [ SIE_ ],
    [ P3E_ ],
    [ MLE_ ],
    [ SFE_ ],
    [ AQH_ ],
    [ LDH_ ],
    [ FRH_ ],
    [ P2H_ ],
] {
    expectedCarId = x[0]

    achievement(
        title = format(
            "{0} Enthusiast",
            carIdToString[expectedCarId]
        ),
        description = format(
            "Win any rallycross event in {0}",
            carIdToString[expectedCarId]
        ),
        points = 2,
        trigger = (
            carId == expectedCarId &&
            hasWonRallycrossEvent() &&
            unless(isCheatingInRallycross())
        )
    )
}

achievement(
    title = "RX 2005",
    description = "Win any rallycross event set to 10 laps",
    points = 5,
    trigger = (
        inGameRallycrossLapsToComplete == 10 &&
        hasWonRallycrossEvent() &&
        unless(isCheatingInRallycross())
    )
)

for x in [
    [ 0x53, RALLY_CLASS_S1600,        10, "S1600" ],
    [ 0x57, RALLY_CLASS_WRC,          10, "WRC" ],
    [ 0x50, RALLY_CLASS_INDEPENDENTS, 10, "Independents" ],
    [ 0x45, RALLY_CLASS_EXTREME,      25, "Extreme" ],
    [ 0x48, RALLY_CLASS_HISTORIC,     25, "Historic" ],
] {
    carClassChar = x[0]
    goldChar = 0x4700
    goldMedalChars = goldChar + carClassChar

    expectedCarClassId = x[1]
    points = x[2]
    categoryName = x[3]

    addresses = range(0x1fe45c6, 0x1fe45c6 + 0x4 * 273, step = 0x4)
    resetConditions = all_of(addresses, address => word(address) == prev(word(address)))
    addHitsConditions = array_map(addresses, address => once(word(address) == goldMedalChars))

    achievement(
        title = "Rallycross Champion - " + categoryName,
        description = format(
            "Win all rallycross events in {0} category",
            categoryName
        ),
        points = points,
        trigger = (
            carClassId == expectedCarClassId &&
            never(inGameRallycrossPointer == 0 || resetConditions) &&
            tally(16, addHitsConditions) &&
            unless(isCheatingInRallycross())
        )
    )
}

for x in [
    [ HAQ1, AQH_, 39000, "Bronze" ],
    [ HAQ2, AQH_, 53750, "Silver" ],
    [ HAQ3, AQH_, 62000, "Gold" ],
    [ HLD1, LDH_, 42000, "Bronze" ],
    [ HLD2, LDH_, 48750, "Silver" ],
    [ HLD3, LDH_, 56500, "Gold" ],
    [ HFR1, FRH_, 65000, "Bronze" ],
    [ HFR2, FRH_, 49000, "Silver" ],
    [ HFR3, FRH_, 44000, "Gold" ],
    [ HL01, LRH_, 51000, "Bronze" ],
    [ HL02, LRH_, 43000, "Silver" ],
    [ HL03, LRH_, 45250, "Gold" ],
    [ HPT1, P2H_, 48000, "Bronze" ],
    [ HPT2, P2H_, 46250, "Silver" ],
    [ HPT3, P2H_, 53250, "Gold" ],
    [ HR51, RMH_, 39000, "Bronze" ],
    [ HR52, RMH_, 43250, "Silver" ],
    [ HR53, RMH_, 60000, "Gold" ]
] {
    expectedTrackId = x[0]
    carId = x[1]
    timeLimit = x[2]
    medalName = x[3]

    carName = carIdToString[carId]

    title = format("{0} Historic Challenge {1}", carName, medalName)

    achievement(
        title = title,
        description = format("Complete {0} Historic Challenge for {1}", medalName, carName),
        points = 3,
        trigger = (
            isOnTrack(expectedTrackId) &&
            hasFinishedStage() &&
            inGameRallyStageTime <= timeLimit &&
            unless(isCheatingInRally())
        )
    )

    makeLeaderboard(
        title = format("Historic Challenge {0} - {1}", carName, medalName),
        expectedTrackId = expectedTrackId
    )
}

for x in [
    [ 1, P2P_, SE2, 129000, "02:09.00" ],
    [ 2, P2P_, AR2, 147500, "02:27.50" ],
    [ 3, P2P_, FR1, 141500, "02:21.50" ],

    [ 1, SBC_, FI2, 166500, "02:46.50" ],
    [ 2, SBC_, DE1, 141900, "02:21.90" ],
    [ 3, SBC_, AU2, 135100, "02:15.10" ],
    [ 1, P3C_, IT2, 134300, "02:14.30" ],
    [ 2, P3C_, FR2, 174350, "02:54.35" ],
    [ 3, P3C_, AR3, 134000, "02:14.00" ],
    [ 1, MCE_, CY3, 170500, "02:50.50" ],
    [ 2, MCE_, TR3, 181000, "03:01.00" ],
    [ 3, MCE_, ES2, 145200, "02:25.20" ],

    [ 1, CXE_, MC1, 151200, "02:31.20" ],
    [ 2, CXE_, NZ1, 129600, "02:09.60" ],
    [ 3, CXE_, TR1, 138400, "02:18.40" ],
    [ 1, FFE_, GR2, 173900, "02:53.90" ],
    [ 2, FFE_, JA1, 168800, "02:48.80" ],
    [ 3, FFE_, FR3, 147800, "02:27.80" ],
    [ 1, SIE_, SE1, 126000, "02:06.00" ],
    [ 2, SIE_, ME2, 111200, "01:51.20" ],
    [ 3, SIE_, GB3, 147800, "02:27.80" ],
    [ 1, P3E_, FI3, 148000, "02:28.00" ],
    [ 2, P3E_, DE2, 137200, "02:17.20" ],
    [ 3, P3E_, JA3, 114000, "01:54.00" ],
    [ 1, MLE_, NZ2, 150000, "02:30.00" ],
    [ 2, MLE_, CY1, 142100, "02:22.10" ],
    [ 3, MLE_, AU3, 127500, "02:07.50" ],
    [ 1, SFE_, ME3, 189500, "03:09.50" ],
    [ 2, SFE_, GB1, 184600, "03:04.60" ],
    [ 3, SFE_, ES1, 132500, "02:12.50" ],

    [ 1, AQH_, ME1, 195000, "03:15.00" ],
    [ 2, AQH_, GR3, 178600, "02:58.60" ],
    [ 3, AQH_, ES3, 161100, "02:41.10" ],
    [ 1, LDH_, IT1, 161300, "02:41.30" ],
    [ 2, LDH_, FI1, 123000, "02:03.00" ],
    [ 3, LDH_, JA2, 112500, "01:52.50" ],
    [ 1, FRH_, NZ3, 127400, "02:07.40" ],
    [ 2, FRH_, TR2, 145800, "02:25.80" ],
    [ 3, FRH_, DE3, 148000, "02:28.00" ],
    [ 1, LRH_, MC3, 170000, "02:50.00" ],
    [ 2, LRH_, SE3, 225000, "03:45.00" ],
    [ 3, LRH_, IT3, 180000, "03:00.00" ],
    [ 1, P2H_, MC2, 240400, "04:00.40" ],
    [ 2, P2H_, GR1, 169000, "02:49.00" ],
    [ 3, P2H_, AR1, 121500, "02:01.50" ],
    [ 1, RMH_, CY2, 174000, "02:54.00" ],
    [ 2, RMH_, GB2, 149000, "02:29.00" ],
    [ 3, RMH_, AU1,  95200, "01:35.20" ]
] {
    index = x[0]
    expectedCarId = x[1]
    expectedTrackId = x[2]
    timeLimit = x[3]
    timeLimitFormatted = x[4]

    countryString = trackIdToCountryString(expectedTrackId)
    rallyStageString = countryString + " " + trackIdToString[expectedTrackId]

    carName = carIdToString[expectedCarId]

    achievement(
        title = format("{0} Challenge #{1}", carName, index),
        description = format(
            "Rally {0} {1}, beat time of {2} in {3}",
            countryString, trackIdToString[expectedTrackId], timeLimitFormatted, carName
        ),
        points = 3,
        trigger = (
            isOnTrack(expectedTrackId) &&
            // HACK: referring to carId instead of carIdFunc ruins the condition! RATools 1.9.1
            carIdFunc() == expectedCarId &&
            hasFinishedStage() &&
            inGameRallyStageTime <= timeLimit &&
            unless(isCheatingInRally())
        )
    )

    makeLeaderboard(
        title = format("{0}, {1}", rallyStageString, carName),
        expectedTrackId = expectedTrackId,
        expectedCarIds = [expectedCarId]
    )
}

achievement(
    title = "Driver Evolved",
    description = "Win any rally event on WRC Professional or Expert difficulty, using manual transmission, with driving aids and pacenote display off, in one sitting",
    points = 10,
    trigger = (
        (
            rallyDifficulty == RALLY_DIFFICULTY_PROFESSIONAL ||
            rallyDifficulty == RALLY_DIFFICULTY_EXPERT
        ) &&
        hasWonRallyInOneSitting(
            additionalStartConditions = (
                assistBraking == 0 &&
                assistSteering == 0 &&
                assistTractionControl == 0 &&
                manualTransmissionActive == 1 &&
                onScreenDisplayPacenotes == 0
            ),
            additionalResetConditions = (
                assistBraking > 0 ||
                assistSteering > 0 ||
                assistTractionControl > 0 ||
                manualTransmissionActive == 0 ||
                onScreenDisplayPacenotes == 1
            )
        ) &&
        unless(isCheatingInRally())
    )
)

achievement(
    title = "Don't Break the Car",
    description = "Win any rally event without seriously damaging your car on WRC Professional or Expert difficulty, in one sitting",
    points = 10,
    trigger = (
        (
            rallyDifficulty == RALLY_DIFFICULTY_PROFESSIONAL ||
            rallyDifficulty == RALLY_DIFFICULTY_EXPERT
        ) &&
        hasWonRallyInOneSitting(
            additionalResetConditions = hasDamagedCar()
        ) &&
        unless(isCheatingInRally())
    )
)

achievement(
    title = "Sweet Rally",
    description = "Win any rally event with Psychedelic sky cheat active, in one sitting",
    points = 5,
    trigger = (
        hasWonRallyInOneSitting(
            additionalStartConditions = hasCheatActive(PSYC)
        ) &&
        unless(debugModeCodeTampered())
    )
)

achievement(
    title = "Shattered Pacenotes",
    description = "Win any rally event with Cross-eyed co-driver cheat active, in one sitting",
    points = 5,
    trigger = (
        hasWonRallyInOneSitting(
            additionalStartConditions = hasCheatActive(XEYE)
        ) &&
        unless(debugModeCodeTampered())
    )
)

achievement(
    title = "Heli of a View",
    description = "Finish any rally stage with Top down view cheat active",
    points = 1,
    trigger = (
        hasFinishedStage() &&
        hasCheatActive(TOPD) &&
        unless(debugModeCodeTampered())
    )
)

achievement(
    title = "In Which Co-driver Makes Funny Noises",
    description = "Finish any rally stage with Helium co-driver cheat active",
    points = 1,
    trigger = (
        hasFinishedStage() &&
        hasCheatActive(SQUE) &&
        unless(debugModeCodeTampered())
    )
)


// Class based leaderboards
for trackId in trackIdToString {
    for x in [
        [
            "S1600",
            [ FPS_, P2S_, FFS_, RCS_, SIS_, SSS_],
            [ NZ, GR, FI, TR, JA, FR, ES, IT ]
        ],
        [
            "WRC",
            [ CXW_, FCW_, FBW_, SIW_, P3W_, MLW_, SFW_, CXP_ ],
            []
        ],
    ] {
        carClass = x[0]
        allowedCarIds = x[1]
        countries = x[2]

        countryString = trackIdToCountryString(trackId)

        shouldMakeLeaderboard = length(countries) == 0
        if (length(countries) > 0) {
            for country in countries {
                if (country == trackIdToCountryId(trackId)) {
                    shouldMakeLeaderboard = true
                }
            }
        }

        if (shouldMakeLeaderboard == true) {
            makeLeaderboard(
                title = format("{0} {1}, {2}", countryString, trackIdToString[trackId], carClass),
                expectedTrackId = trackId,
                expectedCarIds = allowedCarIds
            )
        }
    }
}

// =============
// RICH PRESENCE
// =============

function isInGame() => dword(0x579248) != 0

// HACK: referring to carId instead of carIdFunc ruins the lookup into static value! RATools 1.9.1
gameModeWithDifficultyLookup = rich_presence_lookup("GamemodeWithDifficulty", gameMode, {
    GAMEMODE_CHAMPIONSHIP: "Championship",
    GAMEMODE_SINGLE_RALLY: "Single Rally"
})
carLookup = rich_presence_lookup("Car", carIdFunc(), carIdToString)
countryLookup = rich_presence_lookup("Country", word(trackCountryPointer), countryIdToString)
stageLookup = rich_presence_lookup("Stage", tbyte(trackIdPointer), trackIdToString)

rich_presence_conditional_display(
    isInGame() && carClassId == RALLY_CLASS_S1600 && (
        gameMode == GAMEMODE_CHAMPIONSHIP || gameMode == GAMEMODE_SINGLE_RALLY
    ),
    "{0} S1600 / {0} {1} / {2}",
    gameModeWithDifficultyLookup,
    countryLookup,
    stageLookup,
    carLookup
)

rich_presence_conditional_display(
    isInGame() && (gameMode == GAMEMODE_CHAMPIONSHIP || gameMode == GAMEMODE_SINGLE_RALLY),
    "{0} {1} / {2} {3} / {4}",
    gameModeWithDifficultyLookup,
    rich_presence_lookup("Difficulty", gameMode, {
        RALLY_DIFFICULTY_NOVICE: "WRC Novice",
        RALLY_DIFFICULTY_PROFESSIONAL: "WRC Professional",
        RALLY_DIFFICULTY_EXPERT: "WRC Expert"
    }),
    countryLookup,
    stageLookup,
    carLookup
)

rich_presence_conditional_display(
    isInGame() && gameMode == GAMEMODE_RALLYCROSS,
    "Rallycross / {0} / {1}",
    countryLookup,
    carLookup
)

rich_presence_conditional_display(
    isInGame() && gameMode == GAMEMODE_HISTORIC_CHALLENGE,
    "Historic Challenge / {0}",
    rich_presence_lookup("HistoricChallenge", dword(trackIdPointer), historicChallengeIdToString)
)

rich_presence_conditional_display(
    isInGame() && gameMode == GAMEMODE_TEST_COURSE,
    "Test Track / {0}",
    carLookup
)

rich_presence_conditional_display(
    isInGame(),
    "{0} / {1} {2} / {3}",
    rich_presence_lookup("Gamemode", gameMode, {
        GAMEMODE_QUICK_RACE: "Quick Race",
        GAMEMODE_SINGLE_STAGE: "Single Stage"
    }),
    countryLookup,
    stageLookup,
    carLookup
)

rich_presence_display("In menus of WRC: Rally Evolved")