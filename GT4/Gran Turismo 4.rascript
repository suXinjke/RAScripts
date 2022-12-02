// Gran Turismo 4
// #ID = 20580

// ============
//  CORE STUFF
// ============

function mem(args) {
    size = args[0]
    addr = args[1]

    if (size == 1) {
        return byte(addr)
    } else if (size == 2) {
        return word(addr)
    } else if (size == 3) {
        return tbyte(addr)
    } else if (size == 4) {
        return dword(addr)
    } else {
        return dword(0xDEADBEEF) == 0xDEADCAFE
    }
}

function matchString(address, stringConditions) {
    result = []

    for tuple in stringConditions {
        array_push(result, mem([tuple[0], address]) == tuple[1])
        address = address + tuple[0]
    }

    return all_of(result, x => x)
}

function array_concat(first, second) {
    result = []

    for i in first
        array_push(result, i)

    for i in second
        array_push(result, i)

    return result
}

function pointerChain(src, pieces) {
    conditions = src

    for piece in pieces {
        conditions = dword(conditions) + piece
    }

    return conditions
}


isRunningPAL = dword(0x68BB00) == 0x53454353 && dword(0x68BB04) == 0x3731352D
isRunningNTSC = dword(0x68BB00) == 0x53554353 && dword(0x68BB04) == 0x3337392D

// ====================
//  CONSTANTS AND META
// ====================

CAR_ID_DODGE_RAM = 0x3BB
CAR_ID_CHAPARAL_2J = 0x42D
CAR_ID_FORMULA = 0x416
CAR_ID_MERCEDES_SL_300 = 0x183

GAME_FLAG_MENUS = 0x01
GAME_FLAG_RACE_EVENT = 0x02
GAME_FLAG_CHAMPIONSHIP = 0x03
GAME_FLAG_POWER_AND_SPEED = 0x04
GAME_FLAG_FREE_RUN = 0x05
GAME_FLAG_RACE_MEETING = 0x06
GAME_FLAG_LICENSE = 0x07
GAME_FLAG_MISSION = 0x08
GAME_FLAG_PHOTO_DRIVE = 0x09
GAME_FLAG_ARCADE_RACE = 0x0A
GAME_FLAG_ARCADE_TIME_TRIAL = 0x0B
GAME_FLAG_PHOTO_SCENE = 0x15

LICENSE_STAND_BY = -2
LICENSE_FAIL = -1
LICENSE_FINISH = 0
LICENSE_GOLD = 2
LICENSE_SILVER = 3
LICENSE_BRONZE = 4

TIRES = {
    "n2": 0x1,
    "n3": 0x2,
    "sh": 0x3,
    "sm": 0x4,
    "ss": 0x5,
    "rh": 0x7,
    "rs": 0x9
}

DRIVING_AIDS_NONE = 0
DRIVING_AIDS_TCS = 1
DRIVING_AIDS_TCS_ASM = 2

menuProjectStringConditions = {
    "arcade": [ [ 4, 0x61637261 ] ],
    "gtmode": [ [ 4, 0x6F6D7467 ] ]
}

carIdToString = {
    0x15: "Isuzu 117 Coupe `68",
    0x16: "Alfa Romeo 147 2.0 Twinspark `02",
    0x18: "Nissan 180SX Type X `96",
    0x19: "Nissan 300ZX 2seater (Z32) `98",
    0x1b: "Fiat 500F `65",
    0x1c: "Alpine A110 1600S `73",
    0x1d: "Suzuki ALTO WORKS SUZUKI SPORT LIMITED `97",
    0x1e: "Mazda Atenza Concept `01",
    0x1f: "Chevrolet Camaro Z28 302 `69",
    0x20: "Chevrolet Camaro Z28 Coupe `97",
    0x23: "Toyota CELICA SS-II (ST202) `97",
    0x24: "Chevrolet Chevelle SS 454 `70",
    0x25: "Honda CIVIC SiR-II (EG) `93",
    0x26: "Renault Clio Renault Sport 2.0 16V `02",
    0x28: "Chevrolet Corvette GRAND SPORT (C4) `96",
    0x29: "Chevrolet Corvette Stingray L46 350 (C3) `69",
    0x2a: "Chrysler Crossfire `04",
    0x2b: "Plymouth Cuda 440 Six Pack `71",
    0x2d: "Dodge VIPER GTS-R Team Oreca Race Car `00",
    0x2e: "Lotus Elise `00",
    0x30: "Nissan Fairlady 240ZG (HS30) `71",
    0x31: "Ford FOCUS RS `02",
    0x32: "Ford GT LM Race Car `02",
    0x33: "Mitsubishi FTO GP Version R `97",
    0x34: "Alfa Romeo Giulia Sprint GTA 1600 `65",
    0x35: "Volkswagen Golf IV GTI `01",
    0x36: "Mitsubishi GTO Twin Turbo `95",
    0x37: "Nissan GT-R Concept LM Race Car `02",
    0x38: "Subaru IMPREZA Rally Car `03",
    0x39: "Subaru IMPREZA WRX STi Prodrive Style (GD, Type-I) `01",
    0x3a: "Subaru IMPREZA Sedan WRX STi (GD, Type-II) `02",
    0x3b: "Ford Ka `01",
    0x3c: "Mitsubishi Lancer Evolution VII GSR `01",
    0x3e: "Mitsubishi Lancer Evolution VIII GSR `03",
    0x3f: "Toyota COROLLA LEVIN GT-APEX (AE86) `83",
    0x41: "MINI COOPER-S `02",
    0x42: "Daihatsu MIRA TR-XX Avanzato R `97",
    0x43: "Honda NSX-R Prototype LM Race Car `02",
    0x44: "Honda NSX Type S Zero `97",
    0x45: "Pontiac Tempest Le Mans GTO `64",
    0x46: "Pontiac Vibe GT `03",
    0x47: "Honda PRELUDE Type S `96",
    0x48: "Nissan PRIMERA 20V `01",
    0x4b: "Mazda RX-8 Concept LM Race Car `01",
    0x4c: "Mazda RX-8 Concept (Type-II) `01",
    0x4d: "Nissan SILVIA K's (S13) `88",
    0x4e: "Nissan SILVIA K's AERO (S14) `96",
    0x4f: "Chevrolet SSR `03",
    0x50: "Daihatsu STORIA X4 `00",
    0x51: "Pontiac Sunfire GXP Concept `02",
    0x52: "Toyota SUPRA RZ `97",
    0x55: "Toyota WiLL VS `01",
    0x56: "Nissan Fairlady Z Concept LM Race Car `02",
    0x57: "Alfa Romeo 147 GTA `02",
    0x59: "Toyota PRIUS G Touring Selection (J) `03",
    0x5a: "Toyota PRIUS G (J) `02",
    0x5b: "Dodge VIPER GTS-R Team Oreca Race Car `00",
    0x5c: "Honda BALLADE SPORTS CR-X 1.5i `83",
    0x5d: "Honda CITY Turbo II `83",
    0x5f: "Isuzu PIAZZA XE `81",
    0x60: "Lancia Delta S4 Rally Car `85",
    0x61: "Mazda Lantis Coupe 2000 Type R `93",
    0x62: "Mazda Familia Sedan Sport 20 `02",
    0x63: "Mitsubishi ECLIPSE GT `95",
    0x65: "Nissan 240RS Rally Car `85",
    0x66: "Nissan SKYLINE GTS-R (R31) `87",
    0x67: "Nissan PRIMERA 2.0Te `90",
    0x68: "SILEIGHTY `98",
    0x69: "Peugeot 205 Turbo 16 Evolution 2 Rally Car `86",
    0x6a: "Renault 5 Maxi Turbo Rally Car `85",
    0x6b: "Toyota CELICA XX 2800GT `81",
    0x6c: "Toyota CELICA 2000GT-R (ST162) `86",
    0x6d: "Toyota MR2 1600 G-Limited Super Charger `86",
    0x6f: "Toyota CELICA GT-FOUR RC (ST185) `91",
    0x70: "Toyota COROLLA LEVIN BZ-R `98",
    0x71: "Toyota SPRINTER TRUENO BZ-R `98",
    0x72: "Panoz Esperante GTR-1 Race Car `98",
    0x73: "Nissan R390 GT1 Race Car `98",
    0x74: "Toyota GT-ONE Race Car (TS020) `99",
    0x76: "Subaru LEGACY Touring Wagon 2.0GT specB `03",
    0x77: "Subaru LEGACY B4 2.0GT specB `03",
    0x79: "Subaru IMPREZA Rally Car `99",
    0x7a: "Subaru LEGACY Touring Wagon GT-B `96",
    0x7b: "Subaru LEGACY B4 RSK `98",
    0x7c: "Subaru LEGACY B4 Blitzen `00",
    0x7d: "Subaru LEGACY Touring Wagon 3.0R `03",
    0x7e: "Subaru LEGACY B4 3.0R `03",
    0x7f: "Honda 1300 Coupe 9 S `70",
    0x80: "Honda ACCORD Coupe (US) `88",
    0x81: "Honda HSC \"The 37th Tokyo Motor Show Concept Car\" `03",
    0x82: "Honda Insight `99",
    0x83: "Honda N360 `67",
    0x84: "Honda Odyssey `03",
    0x85: "Honda S2000 `03",
    0x86: "Honda PRELUDE SiR `96",
    0x87: "Honda S800 `66",
    0x88: "Honda TODAY G `85",
    0x89: "Honda BEAT `91",
    0x8a: "Honda TAKATA DOME NSX (JGTC) `03",
    0x8b: "Honda RAYBRIG NSX (JGTC) `00",
    0x8c: "Honda Castrol MUGEN NSX (JGTC) `00",
    0x8d: "Honda ARTA NSX (JGTC) `00",
    0x8e: "Honda LOCTITE MUGEN NSX (JGTC) `01",
    0x8f: "Honda Mobil 1 NSX (JGTC) `01",
    0x90: "ASL ARTA Garaiya (JGTC) `03",
    0x91: "Daihatsu Copen Active Top `02",
    0x92: "Daihatsu Midget II D-type `98",
    0x94: "Spoon Fit Race Car `03",
    0x95: "Mazda KUSABI `03",
    0x96: "Mitsubishi Lancer 1600 GSR `73",
    0x97: "Mitsubishi Lancer Evolution GSR `92",
    0x99: "Mitsubishi ECLIPSE Spyder GTS `03",
    0x9a: "Mitsubishi HSR-II Concept `89",
    0x9b: "Mitsubishi i `03",
    0x9c: "Nissan BLUEBIRD 1600 Deluxe (510) `69",
    0x9d: "Nissan CUBE EX (FF/CVT) `02",
    0x9e: "Nissan March G# `99",
    0x9f: "Nissan SKYLINE COUPE 350GT `03",
    0xa0: "Nissan Fairlady Z Roadster (Z33) `03",
    0xa1: "Nissan XANAVI NISMO GT-R (JGTC) `03",
    0xa2: "Subaru CUSCO SUBARU ADVAN IMPREZA (JGTC) `03",
    0xa3: "Suzuki CONCEPT-S2 `03",
    0xa4: "Toyota ARISTO 3.0V `91",
    0xa5: "Toyota ARISTO V300 Vertex Edition `00",
    0xa6: "Toyota bB 1.5Z X Version `00",
    0xa7: "Toyota CELICA 1600GT (TA22) `70",
    0xa8: "Toyota ist 1.5S `02",
    0xa9: "Toyota WOODONE Tom's Supra (JGTC) `03",
    0xaa: "Autobianchi A112 Abarth `79",
    0xab: "Citroen C5 V6 Exclusive `03",
    0xac: "Fiat Panda Super i.e. `90",
    0xad: "Renault 5 Turbo `80",
    0xb0: "TVR Cerbera Speed Six `97",
    0xb2: "Volkswagen Lupo GTI Cup Car (J) `03",
    0xb3: "Volkswagen Beetle 1100 Standard (Type-11) `49",
    0xb4: "Subaru IMPREZA Sedan WRX STi (GC) `94",
    0xb5: "Toyota au CERUMO Supra (JGTC) `01",
    0xb6: "Nissan PENNZOIL ZEXEL GT-R (JGTC) `01",
    0xb7: "Toyota SUPERAUTOBACS APEX MR-S (JGTC) `00",
    0xb8: "Nissan C-WEST RAZO SILVIA (JGTC) `01",
    0xb9: "Nissan 350Z (Z33) `03",
    0xbb: "TVR Tuscan Speed 6 `00",
    0xbd: "RUF RGT `00",
    0xbe: "Volkswagen New Beetle Cup Car `00",
    0xbf: "Volkswagen Lupo Cup Car `00",
    0xc0: "Nissan mm-R Cup Car `01",
    0xc1: "TRIAL CELICA SS-II (ZZT231) `03",
    0xc2: "Mazda BP FALKEN RX-7 (D1GP) `03",
    0xc5: "Toyota VITZ RS 1.5 `00",
    0xc6: "Mitsubishi COLT 1.5 Sport X Version `02",
    0xc7: "Mazda DEMIO SPORT `03",
    0xc8: "Honda Fit W `01",
    0xc9: "Mazda Eunos Roadster (NA) `89",
    0xcb: "Honda INTEGRA TYPE R (DC2) `98",
    0xcc: "Honda CIVIC TYPE R (EK) `98",
    0xcd: "Mazda RX-7 Spirit R Type A (FD) `02",
    0xce: "Mazda RX-8 Type S (J) `03",
    0xcf: "Toyota MR2 GT-S `97",
    0xd1: "Mercedes-Benz SL 55 AMG (R230) `02",
    0xd2: "Nissan SKYLINE GT-R V-spec II Nur (R34) `02",
    0xd3: "Mitsubishi Lancer Evolution V GSR `98",
    0xd4: "Ford GT `02",
    0xd5: "Spoon CIVIC TYPE R (EK) `00",
    0xd6: "Spoon S2000 Race Car `00",
    0xd7: "NISMO Fairlady Z Z-tune (Z33) `03",
    0xd8: "BMW McLaren F1 GTR Race Car `97",
    0xd9: "Ford FOCUS Rally Car `99",
    0xdb: "Toyota Motor Triathlon Race Car `04",
    0xdd: "Toyota MR-S S Edition `99",
    0xde: "Toyota Modellista CELICA TRD Sports M (ZZT231) `00",
    0xdf: "Mitsubishi Lancer Evolution IV Rally Car `97",
    0xe1: "Toyota Castrol Tom's Supra (JGTC) `00",
    0xe2: "Toyota Castrol Tom's Supra (JGTC) `01",
    0xe4: "Toyota DENSO SARD SUPRA GT (JGTC) `00",
    0xe5: "Toyota ESSO Ultraflo Supra (JGTC) `01",
    0xe6: "Toyota RSC Rally Raid Car `02",
    0xe7: "Toyota SOARER 430SCV `01",
    0xe8: "Toyota VITZ U Euro Sport Edition `00",
    0xe9: "Mine's Lancer Evolution VI `00",
    0xea: "Mine's Skyline GT-R･N1 V･spec (R34) `00",
    0x110: "Peugeot 206 Rally Car `99",
    0x111: "Honda Jazz 1.4 dsi Se Sp `01",
    0x112: "Honda HONDA S2000 `03",
    0x113: "Mazda Mazda2 `03",
    0x114: "Mazda MX-5 (NA) `89",
    0x116: "Nissan 350Z Roadster (Z33) `03",
    0x117: "Nissan 240ZG (HS30) `71",
    0x118: "Toyota Yaris RS 1.5 (J) `00",
    0x119: "BMW 120i `04",
    0x11a: "PlayStation Pescarolo C60/Judd Race Car `04",
    0x11b: "Opel Vectra 3.2 V6 `03",
    0x11c: "Suzuki Kei WORKS `02",
    0x11d: "Ford Taurus SHO `98",
    0x120: "Honda ACCORD Coupe EX V6 (US) `03",
    0x121: "Honda CIVIC TYPE R (EP) `01",
    0x123: "Honda INTEGRA TYPE R Touring Car `02",
    0x125: "Honda NSX Type R `92",
    0x126: "ASL Garaiya `02",
    0x127: "DOME ZERO `78",
    0x128: "Mazda 787B Race Car `91",
    0x129: "Mazda Atenza Touring Car `02",
    0x12a: "Mazda ROADSTER 1.8 RS (NB) `98",
    0x12b: "Mazda SAVANNA RX-7 INFINI III (FC) `90",
    0x12c: "Mitsubishi FTO Super Touring Car `97",
    0x12d: "Mitsubishi Lancer Evolution IV GSR `96",
    0x12e: "Mitsubishi Lancer Evolution VI GSR `99",
    0x130: "Mitsubishi STARION 4WD Rally Car `84",
    0x132: "Nissan CUBE X `98",
    0x133: "Nissan SILVIA K's (S13) `91",
    0x134: "Nissan SKYLINE GTS-t Type M (R32) `91",
    0x135: "Subaru IMPREZA Sport Wagon WRX STi Version VI (GF) `99",
    0x137: "Cadillac CIEN `02",
    0x138: "Chevrolet Camaro SS `00",
    0x139: "Chevrolet Corvette C5R (C5) `00",
    0x13a: "Dodge VIPER GTSR Concept `00",
    0x13b: "Shelby Cobra 427 `67",
    0x13c: "Ford GT40 Race Car `69",
    0x13d: "Ford MUSTANG SVT Cobra R `00",
    0x13f: "Audi RS 6 `02",
    0x140: "Audi TT Coupe 1.8T quattro `00",
    0x141: "Audi Abt Audi TT-R Touring Car `02",
    0x142: "RUF 3400S `00",
    0x143: "Opel Astra Touring Car (Opel Team Phoenix) `00",
    0x145: "Opel Corsa Comfort 1.4 `01",
    0x146: "Volkswagen W12 Nardo Concept `01",
    0x147: "Fiat Coupe Turbo Plus `00",
    0x148: "Pagani Zonda C12S 7.3 `02",
    0x149: "Pagani Zonda LM Race Car `01",
    0x14a: "Pescarolo Courage C60/Peugeot Race Car `03",
    0x14c: "Peugeot 206cc `01",
    0x14e: "Renault Clio Renault Sport V6 24V `00",
    0x14f: "Clio Renault Sport Trophy V6 24V Race Car `00",
    0x151: "Jaguar S-Type R `02",
    0x153: "Jaguar XKR R-Performance `02",
    0x154: "Lotus Esprit Sport 350 `00",
    0x156: "TVR Cerbera Speed 12 `00",
    0x157: "2000 Ford Falcon XR8",
    0x159: "Toyota SPRINTER TRUENO GT-APEX (AE86) Shuichi Shigeno Version `00",
    0x15a: "Hyundai Clix `01",
    0x15b: "Hyundai Coupe FX `01",
    0x15c: "Mercedes-Benz CLK Touring Car `00",
    0x15d: "Fiat Barchetta Giovane Due `00",
    0x15e: "Fiat Punto HGT Abarth `00",
    0x15f: "NISMO Skyline GT-R S-tune (R32) `00",
    0x160: "Honda Z ACT `70",
    0x161: "Mitsubishi MIRAGE CYBORG ZR `97",
    0x162: "Nissan Be-1 `87",
    0x163: "Nissan SKYLINE Hard Top 2000 Turbo RS (R30) `83",
    0x165: "Toyota SERA `92",
    0x166: "Subaru LEGACY B4 2.0GT `03",
    0x167: "Subaru LEGACY Touring Wagon 2.0GT `03",
    0x168: "Saleen S7 `02",
    0x169: "BMW M3 GTR Race Car `01",
    0x16a: "AMG Mercedes 190 E 2.5 - 16 Evolution II Touring Car `92",
    0x16b: "TVR T350C `03",
    0x16c: "Volkswagen Golf IV R32 `03",
    0x16d: "Alfa Romeo 155 2.5 V6 TI `93",
    0x16e: "Mazda Carol 360 Deluxe `62",
    0x16f: "Opel Calibra Touring Car `94",
    0x170: "Mazda ROADSTER 1800 RS (NB) `00",
    0x172: "Honda NSX-R Concept `01",
    0x173: "Honda PRELUDE Si VTEC `91",
    0x174: "AMUSE S2000 Street Version `04",
    0x175: "Mazda Cosmo Sport (L10B) `68",
    0x176: "Mazda SAVANNA RX-7 GT-X (FC) `90",
    0x178: "Nissan R89C Race Car `89",
    0x179: "Nissan SKYLINE Hard Top 2000 RS-X Turbo C (R30) `84",
    0x17b: "Subaru IMPREZA Coupe WRXtypeR STi Version VI (GC) `99",
    0x17c: "Chevrolet Corvette Convertible (C1) `54",
    0x17d: "Dodge SRT4 `03",
    0x17e: "Audi A2 1.4 `02",
    0x17f: "Audi A3 3.2 quattro `03",
    0x181: "BMW 320i Touring Car `03",
    0x182: "BMW V12 LMR Race Car `99",
    0x183: "Mercedes-Benz 300 SL Coupe `54",
    0x184: "AMG Mercedes CLK-GTR Race Car `98",
    0x186: "Opel Tigra 1.6i `99",
    0x188: "Alfa Romeo GTV 3.0 V6 24V `01",
    0x189: "Lancia STRATOS Rally Car `77",
    0x18a: "Lotus Esprit Turbo HC `87",
    0x18b: "BMW 120d `04",
    0x18c: "Honda NSX Type R `02",
    0x18d: "Toyota CELICA GT-FOUR Rally Car (ST185) `95",
    0x18e: "Toyota ARISTO V300 `00",
    0x18f: "Ford GT `05",
    0x190: "Audi S3 `02",
    0x191: "Nissan FALKEN GT-R Race Car `04",
    0x196: "NIKE One 2022",
    0x19c: "Peugeot 206 S16 `99",
    0x19e: "Honda ACCORD Euro-R `02",
    0x19f: "Honda ACCORD Euro-R `00",
    0x1a1: "Acura NSX Coupe `97",
    0x1a8: "Mitsubishi AIRTREK Turbo-R `02",
    0x1a9: "Alfa Romeo Spider 3.0i V6 24V `01",
    0x1aa: "Toyota ALTEZZA AS200 `98",
    0x1ab: "Toyota ALTEZZA Gita AS300 `01",
    0x1ac: "Toyota ALTEZZA Touring Car `01",
    0x1ad: "Toyota ALTEZZA RS200 `98",
    0x1ae: "Volkswagen New Beetle 2.0 `00",
    0x1af: "Volkswagen New Beetle RSi `00",
    0x1b0: "Spyker C8 Laviolette `02",
    0x1b1: "Nissan CALSONIC SKYLINE (JGTC) `00",
    0x1b2: "Chevrolet Camaro LM Race Car `01",
    0x1b3: "Suzuki Cappuccino (EA21R) `95",
    0x1b4: "Toyota CELICA SS-II (ZZT231) `99",
    0x1b5: "Honda CIVIC TYPE R (EP) `01",
    0x1b6: "Mercedes-Benz CL 600 `00",
    0x1b7: "Mercedes-Benz CLK 55 AMG `00",
    0x1b8: "Chevrolet Corvette Z06 (C5) `00",
    0x1b9: "Mitsubishi CZ-3 Tarmac `01",
    0x1ba: "Mitsubishi CZ-3 Tarmac Rally Car `02",
    0x1bb: "Aston Martin DB7 Vantage Coupe `00",
    0x1bc: "Mazda DEMIO (J) `99",
    0x1bd: "Lotus Elise Type 72 `01",
    0x1be: "Lotus Esprit V8 SE `98",
    0x1bf: "Mitsubishi Lancer Evolution VI Rally Car `99",
    0x1c0: "Suzuki GSX-R/4 `01",
    0x1c1: "Mitsubishi GTO Twin Turbo `98",
    0x1c3: "Subaru IMPREZA Premium Sport Coupe 22B-STi Version (GC) `98",
    0x1c4: "Subaru IMPREZA Super Touring Car `01",
    0x1c6: "Subaru IMPREZA Rally Car `01",
    0x1c7: "Subaru IMPREZA Rally Car Prototype `01",
    0x1c8: "Subaru IMPREZA Sedan WRX STi Version (GD, Type-I) `00",
    0x1c9: "Infiniti FX45 Concept `02",
    0x1ca: "Infiniti G35 SEDAN `03",
    0x1cb: "Mitsubishi Lancer Evolution VI RS `99",
    0x1cc: "Mitsubishi Lancer Evolution VI GSR TOMMI MAKINEN Edition `00",
    0x1cd: "Mitsubishi Lancer Evolution VII GT-A `02",
    0x1ce: "Mitsubishi Lancer Evolution VII RS `01",
    0x1d0: "Lexus IS200 `98",
    0x1d2: "Lexus IS300 Sport Cross `01",
    0x1d4: "Lexus SC430 `01",
    0x1d5: "Lexus SC430 `01",
    0x1d6: "Nissan LOCTITE ZEXEL GT-R (JGTC) `00",
    0x1d7: "Volkswagen Lupo GTI `01",
    0x1d8: "Mazda Mazda6 Concept `01",
    0x1d9: "Mazda Mazda6 Touring Car `02",
    0x1db: "MINI COOPER `02",
    0x1dc: "MINI ONE `02",
    0x1e0: "MUGEN S2000 `00",
    0x1e1: "NISMO GT-R LM Road Going Version `95",
    0x1e2: "NISMO 270R `94",
    0x1e3: "Honda NSX-R Prototype LM Road Car `02",
    0x1e4: "Opel Speedster `00",
    0x1e5: "Nissan PENNZOIL Nismo GT-R (JGTC) `99",
    0x1e7: "Nissan PRIMERA 20V `01",
    0x1e8: "Chrysler PT-Cruiser `00",
    0x1e9: "Nissan SKYLINE GT-R Vspec (R33) `97",
    0x1ea: "Nissan SKYLINE GT-R M-spec (R34) `01",
    0x1eb: "NISMO Skyline GT-R R-tune (R34) `99",
    0x1ec: "Nissan SKYLINE GT-R V-spec (R34) `99",
    0x1ed: "Nissan GRAN TURISMO SKYLINE GT-R (PaceCar) `01",
    0x1ee: "Nissan SKYLINE GT-R V-spec II (R34) `00",
    0x1ef: "Nissan GT-R Concept (TokyoShow) `01",
    0x1f0: "Nissan R390 GT1 Road Car `98",
    0x1f2: "Mazda Eunos Roadster J-Limited (NA) `91",
    0x1f3: "Mazda Eunos Roadster J-Limited II (NA) `93",
    0x1f4: "Mazda Eunos Roadster SR-Limited (NA) `97",
    0x1f7: "Audi RS 4 `01",
    0x1f8: "Audi RS 6 Avant `02",
    0x1f9: "Toyota RSC `01",
    0x1fb: "Mazda RX-7 LM Race Car `01",
    0x1fc: "Mazda RX-7 Type R Bathurst R (FD) `01",
    0x1fd: "Mazda RX-7 Type RS (FD) `98",
    0x1fe: "Mazda RX-7 Type RZ (FD) `00",
    0x1ff: "Mazda RX-8 Concept (Type-I) `01",
    0x200: "Nissan SILVIA Spec R AERO (S15) `99",
    0x201: "Honda S2000 `01",
    0x202: "Honda S2000 `99",
    0x203: "Honda S2000 `99",
    0x204: "Honda HONDA S2000 `99",
    0x205: "Honda HONDA S2000 `01",
    0x206: "Honda S2000 LM Race Car `01",
    0x207: "Honda S2000 Type V `00",
    0x208: "Honda S2000 Type V `01",
    0x209: "Honda HONDA S2000 Type V `00",
    0x20a: "Honda HONDA S2000 Type V `01",
    0x20b: "Honda HONDA S2000 Type V `01",
    0x20c: "Honda S2000 `01",
    0x20e: "Nissan SILVIA Varietta (S15) `00",
    0x20f: "Nissan SKYLINE SEDAN 300GT `01",
    0x212: "Pontiac Solstice Coupe Concept `02",
    0x213: "Spoon S2000 `00",
    0x214: "Lister Storm V12 Race Car `99",
    0x215: "Lancia STRATOS `73",
    0x216: "Toyota SUPRA SZ-R `97",
    0x217: "Tom's X540 CHASER `00",
    0x219: "Vauxhall Astra Super Touring Car `00",
    0x21a: "Vauxhall Calibra Super Touring Car `94",
    0x21b: "Vauxhall Corsa Comfort 1.4 `01",
    0x21c: "Vauxhall VX220 `00",
    0x21e: "Nissan XANAVI HIROTO GT-R (JGTC) `01",
    0x21f: "Jaguar XJ220 `92",
    0x220: "Jaguar XKR Coupe `99",
    0x221: "Citroen Xsara Rally Car `99",
    0x222: "Nissan Fairlady Z 300ZX Version R TwinTurbo 2by2 (Z32) `98",
    0x223: "Nissan Fairlady Z 300ZX Version S TwinTurbo 2seater (Z32) `98",
    0x224: "Pagani Zonda C12 `00",
    0x225: "Pagani Zonda C12S `00",
    0x226: "Tommy kaira ZZII `00",
    0x227: "Tommy kaira ZZ-S `00",
    0x228: "Hyundai Accent Rally Car `01",
    0x22a: "Hyundai HCD6 `01",
    0x22d: "Nissan 300ZX 2by2 (Z32) `98",
    0x22e: "Mazda MX-5 1800 RS (NB, J) `00",
    0x22f: "Mazda MX-5 1.8 RS (NB, J) `98",
    0x230: "Mercedes-Benz SL 500 (R230) `02",
    0x231: "Jay Leno Tank Car `03",
    0x233: "BMW M3 GTR `03",
    0x234: "BUICK GNX `87",
    0x235: "Callaway C12 `03",
    0x236: "Chevrolet Silverado SST Concept `02",
    0x237: "Chevrolet Camaro SS `69",
    0x238: "Citroen Xsara VTR `03",
    0x23a: "Dodge VIPER SRT10 `03",
    0x23b: "EAGLE Talon Esi `97",
    0x23c: "Lotus Carlton `90",
    0x23d: "Lotus Elan S1 `62",
    0x23e: "Mercedes-Benz E 55 AMG `02",
    0x23f: "Mercedes-Benz 190 E 2.5 - 16 Evolution II `91",
    0x240: "Mercury Cougar XR-7 `67",
    0x241: "MG TF160 `03",
    0x242: "Peugeot 205 Turbo 16 Rally Car `85",
    0x243: "Peugeot 205 Turbo 16 `85",
    0x244: "Pontiac GTO 5.7 Coupe `04",
    0x245: "RUF BTR `86",
    0x246: "Triumph Spitfire 1500 `74",
    0x247: "TVR Tamora `02",
    0x248: "Toyota SOARER 2.5GT-T `97",
    0x249: "Toyota VOLTZ S `02",
    0x24a: "Toyota COROLLA RUNX Z AEROTOURER `02",
    0x24b: "Toyota WEDSSPORT CELICA (JGTC) `03",
    0x24d: "Mitsubishi PAJERO Evolution Rally Raid Car `03",
    0x24e: "Alfa Romeo 166 2.5 V6 24V Sportronic `98",
    0x24f: "Citroen C3 1.6 `02",
    0x250: "Daihatsu Copen Detachable Top `02",
    0x251: "Honda CIVIC 1500 3door 25i `83",
    0x252: "Honda LIFE STEP VAN `72",
    0x253: "Honda ELEMENT `03",
    0x254: "Honda BEAT Version F `92",
    0x255: "Honda BEAT Version Z `93",
    0x256: "Jaguar E-Type Coupe `61",
    0x257: "Mazda RX-8 Type E (J) `03",
    0x259: "RUF CTR \"Yellow Bird\" `87",
    0x25a: "Suzuki ALTO LAPIN Turbo `02",
    0x25b: "Toyota CALDINA GT-FOUR `02",
    0x25c: "Toyota 2000GT `67",
    0x25d: "Volkswagen Lupo1.4 `02",
    0x25e: "Volvo S60 T 5 Sport `03",
    0x25f: "Nissan 200SX `96",
    0x261: "Peugeot 206 Rally Car `99",
    0x267: "Renault Lutecia Renault Sport V6 24V `01",
    0x268: "Lutecia Renault Sport Trophy V6 24V Race Car `00",
    0x269: "Renault Lutecia Renault Sport 2.0 16V `02",
    0x26c: "Acura HSC `04",
    0x26f: "Mazda Mazda 323F `93",
    0x270: "Daihatsu Cuore TR-XX Avanzato R (J) `97",
    0x274: "Vauxhall Vectra 3.2 V6 `03",
    0x275: "Vauxhall Tigra 1.6i `99",
    0x278: "Mazda MX-5 J-Limited (NA, J) `91",
    0x27c: "Mazda MX-5 J-Limited II (NA, J) `93",
    0x280: "Mazda MX-5 SR-Limited (NA, J) `97",
    0x283: "Nissan 200SX (S14) `96",
    0x284: "Nissan 240SX (S14) `96",
    0x285: "Honda S2000 Type V `00",
    0x288: "Daihatsu SIRION X4 (J) `00",
    0x28a: "Mazda 110S (L10B) `68",
    0x28b: "Alfa Romeo Giulia Sprint Speciale `63",
    0x28c: "Audi quattro `82",
    0x28d: "BMW M3 `04",
    0x28e: "BMW M Coupe `98",
    0x28f: "BMW Z4 `03",
    0x291: "Dodge Charger 440 R/T `70",
    0x292: "Ford Mustang GT `05",
    0x294: "Honda Gathers Drider CIVIC Race Car `98",
    0x295: "Honda S800 RSC Race Car `68",
    0x296: "Jensen Interceptor MkIII `74",
    0x297: "Marcos Mini Marcos GT `70",
    0x298: "MGF `97",
    0x299: "Plymouth Super Bird `70",
    0x29a: "Renault Megane 2.0 16V `03",
    0x29c: "Mazda Atenza Sports 23Z `03",
    0x29d: "Acura CL 3.2 Type-S `03",
    0x29e: "Acura RSX Type-S `04",
    0x29f: "Alfa Romeo Spider 1600 Duetto `66",
    0x2a0: "Alpine A310 1600VE `73",
    0x2a2: "BMW 330i `05",
    0x2a4: "Chevrolet Camaro IROC-Z Concept `88",
    0x2a5: "Cizeta V16T `94",
    0x2a6: "Daihatsu MOVE Custom RS Limited `02",
    0x2a7: "Dodge Charger Super Bee 426 Hemi `71",
    0x2a8: "Ford RS200 `84",
    0x2a9: "Ford RS200 Rally Car `85",
    0x2aa: "Honda CIVIC 1500 3door CX `79",
    0x2ab: "Honda MUGEN MOTUL CIVIC Si Race Car `87",
    0x2ac: "Honda CIVIC SiR-II (EG) `91",
    0x2ad: "Honda CIVIC SiR-II (EG) `92",
    0x2ae: "Honda CIVIC SiR-II (EG) `95",
    0x2af: "Honda CR-X del Sol SiR `92",
    0x2b0: "Honda INTEGRA TYPE R (DC2) `95",
    0x2b1: "Honda INTEGRA TYPE R (DC2) `99",
    0x2b2: "Honda S2000 Type V `03",
    0x2b3: "Honda S500 `63",
    0x2b4: "Honda S600 `64",
    0x2b5: "Isuzu Bellett 1600 GT-R `69",
    0x2b6: "Mazda Autozam AZ-1 `92",
    0x2b7: "Mazda Eunos Roadster S-Special Type I (NA) `95",
    0x2b8: "Mazda RX-8 `03",
    0x2b9: "Mazda SAVANNA RX-7 GT-Limited (FC) `85",
    0x2ba: "Mitsubishi Galant 2.0 DOHC Turbo VR-4 `89",
    0x2bb: "Mitsubishi GALANT GTO MR `70",
    0x2bc: "Mitsubishi Lancer EX 1800GSR IC Turbo `83",
    0x2bd: "Mitsubishi Lancer Evolution VI RS TOMMI MAKINEN Edition `00",
    0x2be: "Mitsubishi Lancer Evolution VIII RS `03",
    0x2bf: "Mitsubishi MINICA DANGAN ZZ `89",
    0x2c0: "Mitsubishi MIRAGE 1400GLX `78",
    0x2c1: "Mitsubishi PAJERO Rally Raid Car `85",
    0x2c2: "Nissan Fairlady 2000 (SR311) `68",
    0x2c3: "Nissan Fairlady Z 280Z-L 2seater (S130) `78",
    0x2c4: "Nissan Fairlady Z 300ZX (Z31) `83",
    0x2c5: "Nissan Fairlady Z 300ZX TwinTurbo 2seater (Z32) `89",
    0x2c6: "Nissan MOTUL PITWORK Z (JGTC) `04",
    0x2c7: "Nissan PAO `89",
    0x2c8: "Nissan SILVIA (CSP311) `65",
    0x2c9: "Nissan SILVIA 240RS (S100) `83",
    0x2ca: "Nissan SKYLINE 1500 Deluxe (S50D-1) `63",
    0x2cb: "Nissan SKYLINE SEDAN 350GT-8 `02",
    0x2cc: "Nissan SKYLINE GT-R (R34) `99",
    0x2cd: "Nissan SKYLINE GT-R (R34) `00",
    0x2cf: "Nissan SKYLINE GT-R Special Color Midnight Purple II (R34) `99",
    0x2d0: "Nissan SKYLINE GT-R Special Color Midnight Purple III (R34) `00",
    0x2d1: "Nissan SKYLINE GT-R Vspec (R33) `95",
    0x2d2: "Nissan SKYLINE GT-R Vspec (R33) `96",
    0x2d3: "Nissan SKYLINE GT-R V-spec II N1 (R34) `00",
    0x2d4: "Nissan SKYLINE GT-R V-spec N1 (R34) `99",
    0x2d5: "Nissan SKYLINE Sport Coupe (BLRA-3) `62",
    0x2d6: "Nissan STAGEA 25t RS FOUR S `98",
    0x2d7: "Nissan STAGEA 260RS AutechVersion `98",
    0x2d9: "Renault AVANTIME `02",
    0x2db: "Shelby Mustang G.T. 350R `65",
    0x2dc: "Shelby Series 1 Super Charged `03",
    0x2dd: "Subaru IMPREZA Sedan WRX STi Version II (GC) `95",
    0x2de: "Subaru IMPREZA Sedan WRX STi Version III (GC) `96",
    0x2df: "Subaru IMPREZA Sedan WRX STi Version IV (GC) `97",
    0x2e0: "Subaru IMPREZA Sedan WRX STi Version V (GC) `98",
    0x2e1: "Suzuki WAGON R RR `98",
    0x2e2: "MINOLTA Toyota 88C-V Race Car `89",
    0x2e3: "Toyota STARLET Glanza V `97",
    0x2e4: "Toyota 7 Race Car `70",
    0x2e5: "Toyota VITZ F `99",
    0x2e6: "Volvo 240 GLT Estate `88",
    0x2e8: "Toyota GT-ONE Race Car (TS020) `99",
    0x2eb: "Toyota Yaris U Euro Sport Edition (J) `00",
    0x2ec: "Toyota Yaris F (J) `99",
    0x2ee: "Acura INTEGRA Type-R `01",
    0x2f0: "Chrysler Prowler `02",
    0x2f2: "Citroen Xantia 3.0i V6 Exclusive `00",
    0x2f3: "Daihatsu MOVE CX `95",
    0x2f4: "Dodge VIPER GTS `99",
    0x2f5: "Ford Escort Rally Car `98",
    0x2f6: "Honda CR-X SiR `90",
    0x2f7: "Honda DUALNOTE `01",
    0x2f8: "Jaguar XJ220 LM Race Car `01",
    0x2f9: "Lancia DELTA HF Integrale Rally Car `92",
    0x2fa: "Lotus Elise Sport 190 `98",
    0x2fb: "Lotus Europa Special `71",
    0x2fc: "Lotus Motor Sport Elise `99",
    0x2fd: "Mitsubishi LEGNUM VR-4 Type V `98",
    0x2fe: "NISMO 400R `96",
    0x2ff: "Nissan BLUEBIRD Hardtop 1800SSS (910) `79",
    0x300: "Nissan BLUEBIRD Rally Car (510) `69",
    0x301: "Nissan EXA CANOPY L.A.Version Type S (N13) `88",
    0x302: "Nissan GRAN TURISMO SKYLINE GT-R `01",
    0x303: "Nissan March 12c 5door `03",
    0x304: "Nissan MICRA `03",
    0x305: "Nissan SKYLINE GT-R Vspec II (R32) `94",
    0x306: "Peugeot 106 S16 `03",
    0x307: "Peugeot 406 3.0 V6 Coupe `98",
    0x309: "RUF CTR2 `96",
    0x30a: "Subaru IMPREZA Sport Wagon STi (GG, Type-I) `00",
    0x30b: "Suzuki Cappuccino (EA11R) `91",
    0x30c: "Toyota CELICA GT-FOUR (ST205) `98",
    0x30d: "Toyota CELICA GT-FOUR Rally Car (ST205) `95",
    0x30e: "Toyota COROLLA Rally Car `98",
    0x30f: "Toyota MR2 G-Limited `97",
    0x310: "Toyota SUPRA 2.5GT Twin Turbo R `90",
    0x311: "TVR Griffith 500 `94",
    0x312: "Volkswagen Karmann Ghia Coupe (Type-1) `68",
    0x314: "Volkswagen Polo GTI `01",
    0x315: "Mazda Eunos Roadster VR-Limited (NA) `95",
    0x316: "Mazda Eunos Roadster V-Special Type II (NA) `93",
    0x319: "Mazda MX-5 VR-Limited (NA, J) `95",
    0x31a: "Mazda MX-5 V-Special Type II (NA, J) `93",
    0x31b: "Mercedes-Benz A 160 Avantgarde `98",
    0x31c: "Mercedes-Benz SLK 230 Kompressor `98",
    0x31d: "Subaru IMPREZA Sedan WRX STi Version VI (GC) `99",
    0x31e: "Aston Martin Vanquish `04",
    0x31f: "Mitsubishi Lancer Evolution VIII MR GSR `04",
    0x320: "Ginetta G4 `64",
    0x321: "Honda S2000 `04",
    0x322: "Renault Megane 2.0 IDE Coupe `00",
    0x323: "Mini Cooper 1.3i `98",
    0x324: "Chevrolet Corvette Z06 (C2) Race Car `63",
    0x325: "Alfa Romeo 156 2.5 V6 24V `98",
    0x326: "Aston Martin V8 Vantage `99",
    0x327: "Audi S4 `98",
    0x328: "Suzuki ESCUDO Dirt Trial Car `98",
    0x329: "Toyota CARINA ED 2.0 X 4WS `89",
    0x32a: "Toyota SPRINTER TRUENO GT-APEX (AE86) `83",
    0x32b: "Toyota CELICA GT-R (ST183, 4WS) `91",
    0x32c: "BMW M3 CSL `03",
    0x32d: "Peugeot 307 XSi `04",
    0x32e: "TVR V8S `91",
    0x32f: "Mercedes-Benz SL 500 (R129) `98",
    0x330: "Mazda Mazdaspeed Atenza `05",
    0x331: "BUICK Special `62",
    0x332: "Chevrolet Corvette Coupe (C2) `63",
    0x333: "Daihatsu MOVE SR-XX 4WD `97",
    0x334: "HKS GENKI HYPER SILVIA RS2 (D1GP) `04",
    0x335: "Honda CIVIC TYPE R (EK) `97",
    0x336: "Honda CIVIC TYPE R (EP) `04",
    0x337: "Honda NSX `90",
    0x338: "Honda NSX `01",
    0x339: "Honda NSX Type S `97",
    0x33a: "Honda NSX Type S `01",
    0x33b: "Honda NSX Type S Zero `99",
    0x33c: "Honda PRELUDE Type S `98",
    0x33d: "Lancia DELTA HF Integrale Evoluzione `91",
    0x33e: "Lotus Elise 111R `04",
    0x33f: "Lotus Esprit V8 GT `98",
    0x340: "Mazda Cosmo Sport (L10A) `67",
    0x341: "Mercedes-Benz SL 600 (R230) `04",
    0x342: "Mercedes-Benz SL 65 AMG (R230) `04",
    0x343: "Nissan SILVIA K's AERO (S14) `93",
    0x344: "Nissan SKYLINE 2000GT-R (KPGC110) `73",
    0x345: "Nissan SKYLINE Hard Top 2000GT-R (KPGC10) `70",
    0x346: "Peugeot 106 Rallye `03",
    0x347: "Spoon INTEGRA TYPE R (DC2) `99",
    0x348: "Suzuki MR Wagon Sport `04",
    0x349: "Toyota CELICA 2000GT-FOUR (ST165) `86",
    0x34a: "Toyota MR2 1600 G `86",
    0x34b: "Toyota SUPRA 3.0GT Turbo A `88",
    0x34c: "Honda INTEGRA TYPE R (DC5) `03",
    0x34f: "Mazda Mazda6 MPS `05",
    0x353: "Mazda 110S (L10A) `67",
    0x355: "Gillet Vertigo Race Car `04",
    0x356: "Audi S4 `03",
    0x357: "Infiniti G35 COUPE `03",
    0x358: "Volkswagen Bora V6 4MOTION `01",
    0x359: "Nissan Fairlady Z Version S (Z33) `02",
    0x35a: "Mazda Mazda6 5-door `03",
    0x35b: "Nissan SKYLINE GT-R M-spec Nur (R34) `02",
    0x35c: "Acura CL 3.2 Type-S `01",
    0x35e: "Mazda MX-5 S-Special Type I (NA, J) `95",
    0x35f: "BLITZ ER34 D1 spec 2004 (D1GP) `04",
    0x360: "Nissan 300ZX 2seater (Z32) `89",
    0x361: "BMW M5 `05",
    0x362: "Honda PRELUDE SiR S spec `98",
    0x364: "NISMO Fairlady Z S-tune concept by GRANTURISMO (Z33) `02",
    0x365: "Hommell Berlinette R/S Coupe `99",
    0x369: "Infiniti G20 `90",
    0x36a: "Nissan PRIMERA 2.0Te (J) `90",
    0x36b: "Fiat 500L `69",
    0x36c: "Fiat 500R `72",
    0x36d: "Audi A4 Touring Car `04",
    0x36f: "RE Amemiya AMEMIYA ASPARADRINK RX7 (JGTC) `04",
    0x370: "Lotus Elise 111S `03",
    0x371: "Nissan Fairlady Z Version ST (Z33) Option Wheel `02",
    0x372: "Mitsubishi FTO GP Version R `99",
    0x373: "Mitsubishi FTO GPX `94",
    0x374: "Mitsubishi FTO GPX `97",
    0x375: "Mitsubishi FTO GPX `99",
    0x376: "Mitsubishi FTO GR `94",
    0x377: "Mitsubishi FTO GR `97",
    0x378: "Mitsubishi GTO SR `95",
    0x379: "Mitsubishi GTO SR `96",
    0x37a: "Mitsubishi GTO SR `98",
    0x37b: "Mitsubishi GTO Twin Turbo `96",
    0x37c: "Mitsubishi GTO Twin Turbo MR `95",
    0x37d: "Mitsubishi GTO Twin Turbo MR `98",
    0x37e: "Mitsubishi Lancer 1600 GSR Rally Car `74",
    0x37f: "Audi Le Mans quattro `03",
    0x380: "Holden Monaro CV8 `04",
    0x381: "Daihatsu MOVE SR-XX 2WD `97",
    0x382: "Toyota MR-S V Edition (6MT) `02",
    0x383: "Honda NSX `93",
    0x384: "Honda NSX `95",
    0x385: "Honda NSX `97",
    0x386: "Honda NSX `99",
    0x387: "Honda NSX Type S `99",
    0x388: "Opel Speedster Turbo `00",
    0x389: "Opera Performance S2000 `04",
    0x38a: "Nissan SKYLINE GT-R (R32) `89",
    0x38b: "Nissan SKYLINE GT-R (R32) `91",
    0x38c: "Nissan SKYLINE GT-R N1 (R32) `91",
    0x38d: "Nissan SKYLINE GT-R Vspec (R32) `93",
    0x38e: "Nissan SKYLINE GT-R Vspec N1 (R32) `93",
    0x38f: "Nissan SKYLINE GTS25 Type S (R32) `91",
    0x390: "Nissan SKYLINE GTS-t Type M (R32) `89",
    0x391: "Nissan SKYLINE GT-R (R33) `95",
    0x392: "Nissan SKYLINE GT-R (R33) `96",
    0x393: "Nissan SKYLINE GT-R (R33) `97",
    0x394: "Nissan SKYLINE GT-R N1 (R33) `95",
    0x395: "Nissan SKYLINE GT-R Vspec LM Limited (R33) `96",
    0x396: "Mazda RX-7 Type RS (FD) `00",
    0x397: "Nissan SILVIA Q's (S13) `88",
    0x398: "Nissan SILVIA Q's (S13) `91",
    0x399: "Nissan SILVIA Q's AERO (S14) `93",
    0x39a: "Nissan SILVIA Q's AERO (S14) `96",
    0x39b: "Nissan SILVIA Spec S AERO (S15) `99",
    0x39c: "Nissan SKYLINE 2000GT-B (S54A) `67",
    0x39d: "Mercedes-Benz SL 600 (R129) `98",
    0x39e: "Ford SVT F-150 Lightning `03",
    0x39f: "Toyota Tacoma X-Runner `04",
    0x3a0: "Acura NSX `04",
    0x3a1: "Daihatsu STORIA CX 2WD `98",
    0x3a2: "Daihatsu STORIA CX 4WD `98",
    0x3a3: "Mitsubishi Lancer Evolution III GSR `95",
    0x3a4: "Subaru IMPREZA Sedan WRX STi spec C (GD, Type-II) `04",
    0x3a5: "Suzuki ALTO WORKS RS-Z `97",
    0x3a6: "Caterham Seven Fire Blade `02",
    0x3a7: "Citroen 2CV Type A `54",
    0x3a8: "Subaru SUBARU 360 `58",
    0x3a9: "AC Cars 427 S/C `66",
    0x3aa: "AMUSE CarbonR (R34) `04",
    0x3ab: "AMUSE S2000 GT1 `04",
    0x3ac: "Nissan CALSONIC SKYLINE GT-R Race Car `93",
    0x3ae: "Chevrolet Corvette ZR-1 (C4) `90",
    0x3af: "Aston Martin DB9 Coupe `03",
    0x3b0: "Bentley Speed 8 Race Car `03",
    0x3b1: "FPV F6 Typhoon `04",
    0x3b2: "FPV GT `04",
    0x3b3: "Volkswagen Golf V GTI `05",
    0x3b4: "Volkswagen Golf I GTI `76",
    0x3b5: "Seat Ibiza Cupra `04",
    0x3b6: "Mitsubishi Lancer Evolution Super Rally Car `03",
    0x3b7: "Land Rover Range Stormer Concept `04",
    0x3b9: "Audi R8 Race Car `01",
    0x3ba: "Nissan R92CP Race Car `92",
    0x3bb: "Dodge RAM 1500 LARAMIE Hemi Quad Cab `04",
    0x3bc: "Mercedes-Benz SLR McLaren `03",
    0x3bd: "Holden Commodore SS `04",
    0x3be: "Nissan OPTION Stream Z `04",
    0x3bf: "Audi TT Coupe 3.2 quattro `03",
    0x3c0: "BMW 2002 Turbo `73",
    0x3c1: "Peugeot 206 RC `03",
    0x3c2: "Lotus Esprit V8 `02",
    0x3c3: "Renault Clio Renault Sport V6 Phase 2 `03",
    0x3c4: "Ford FOCUS ST170 `03",
    0x3c5: "Mitsubishi Lancer Evolution II GSR `94",
    0x3c6: "Toyota VITZ RS Turbo `02",
    0x3c7: "Mazda efini RX-7 Type R (FD) `91",
    0x3c8: "Mazda efini RX-7 Type R (FD) `93",
    0x3c9: "Mazda efini RX-7 Type R-S (FD) `95",
    0x3ca: "Mazda efini RX-7 Type RS (FD) `96",
    0x3cb: "Mazda RX-7 Type RS-R (FD) `97",
    0x3cc: "Mazda efini RX-7 Type RZ (FD) `92",
    0x3cd: "Mazda efini RX-7 Type RZ (FD) `93",
    0x3ce: "Mazda efini RX-7 Type RZ (FD) `95",
    0x3cf: "Mazda efini RX-7 Type RZ (FD) `96",
    0x3d0: "Renault Lutecia Renault Sport V6 Phase2 `03",
    0x3d2: "Mercedes-Benz Benz Patent Motor Wagen `86",
    0x3d3: "Mercedes-Benz Daimler Motor Carriage `86",
    0x3d4: "Opera Performance 350Z `04",
    0x3d5: "Vauxhall VX220 Turbo `00",
    0x3e5: "Toyota Yaris RS Turbo (J) `02",
    0x3e6: "Sauber Mercedes C 9 Race Car `89",
    0x3eb: "Mazda RX-7 GT-Limited (FC, J) `85",
    0x3ec: "Mazda RX-7 GT-X (FC, J) `90",
    0x3ed: "Mazda RX-7 INFINI III (FC, J) `90",
    0x3ee: "Mazda RX-7 Type R (FD, J) `91",
    0x3ef: "Mazda RX-7 Type R (FD, J) `93",
    0x3f0: "Mazda RX-7 Type RS (FD, J) `96",
    0x3f1: "Mazda RX-7 Type R-S (FD, J) `95",
    0x3f2: "Mazda RX-7 Type RZ (FD, J) `92",
    0x3f3: "Mazda RX-7 Type RZ (FD, J) `93",
    0x3f4: "Mazda RX-7 Type RZ (FD, J) `95",
    0x3f5: "Mazda RX-7 Type RZ (FD, J) `96",
    0x3f6: "Mitsubishi 3000GT MR (J) `95",
    0x3f7: "Mitsubishi 3000GT MR (J) `98",
    0x3f8: "Mitsubishi 3000GT SL (J) `95",
    0x3f9: "Mitsubishi 3000GT SL (J) `96",
    0x3fa: "Mitsubishi 3000GT SL (J) `98",
    0x3fb: "Mitsubishi 3000GT SR (J) `95",
    0x3fc: "Mitsubishi 3000GT SR (J) `96",
    0x3fd: "Mitsubishi 3000GT SR (J) `98",
    0x3fe: "Mitsubishi 3000GT VR-4 (J) `98",
    0x3ff: "Mitsubishi 3000GT VR-4 Turbo (J) `98",
    0x400: "Mitsubishi 3000GT VR-4 Turbo (J) `95",
    0x401: "Mitsubishi 3000GT VR-4 Turbo (J) `96",
    0x402: "Acura NSX `91",
    0x403: "DMC DeLorean S2 `04",
    0x404: "Daihatsu SIRION CX 2WD (J) `98",
    0x405: "Daihatsu SIRION CX 4WD (J) `98",
    0x406: "Ford Model T Tourer `15",
    0x407: "Lexus GS300 `91",
    0x408: "Lexus GS300 `00",
    0x409: "Lexus GS300 Vertex Edition (J) `00",
    0x40a: "Toyota MR2 V Edition (J) `02",
    0x40b: "Lexus SC300 `97",
    0x40c: "Toyota MR2 S Edition (J) `99",
    0x40f: "AMUSE S2000 R1 `04",
    0x410: "Ford GT LM Race Car Spec II `04",
    0x411: "Nissan 350Z (Z33) `03",
    0x412: "Nissan 350Z Roadster (Z33) `03",
    0x413: "Daihatsu Midget `63",
    0x414: "Toyota SPORTS 800 `65",
    0x416: "Formula Gran Turismo `04",
    0x417: "Toyota MR2 Spyder (6-speed sequential manual transmission) `02",
    0x418: "Toyota MR2 Spyder `99",
    0x419: "Lexus IS200 (J) `98",
    0x41a: "Honda HONDA S2000 Type V `03",
    0x41d: "Nissan 350Z Gran Turismo 4 Limited Edition (Z33) `05",
    0x41e: "Mazda ROADSTER 1600 NR-A (NB) `04",
    0x41f: "Mazda ROADSTER 1800 RS (NB) `04",
    0x420: "Ford GT `05",
    0x421: "Mazda MX-Crossport `05",
    0x423: "Mazda MX-5 1800 RS (NB, J) `04",
    0x425: "Mazda MX-5 1600 NR-A (NB, J) `04",
    0x429: "Peugeot 905 Race Car `92",
    0x42a: "Peugeot 905 Race Car `92",
    0x42b: "Jaguar XJR-9 Race Car `88",
    0x42c: "Chaparral 2D Race Car `67",
    0x42d: "Chaparral 2J Race Car `70",
    0x42e: "HPA Motorsports Stage II R32 `04",
    0x42f: "Chrysler 300C `05",
    0x430: "Alfa Romeo GT 3.2 V6 24V `04",
    0x431: "Auto Union V16 Type C Streamline `37",
    0x432: "Audi Nuvolari quattro `03",
    0x433: "Audi Pikes Peak quattro `03",
    0x434: "Proto Motors SPIRRA 4.6 V8 `04",
    0x435: "Mitsubishi Eclipse GT `06"
}

trackIdToString = {
    0x02: "Costa di Amalfi",
    0x03: "Fuji Speedway 90s",
    0x04: "Grand Canyon",
    0x05: "Hong Kong",
    0x07: "New York",
    0x08: "George Paris",
    0x09: "Opera Paris",
    0x0a: "Tsukuba Circuit",
    0x0b: "El Capitan",
    0x0c: "Citta di Aria",
    0x16: "Laguna Seca",
    0x17: "Twin Ring Motegi - Road Course",
    0x18: "Trial Mountain Circuit",
    0x19: "Chamonix",
    0x1a: "Special Stage Route 5",
    0x1b: "Grand Valley",
    0x1d: "High Speed Ring",
    0x28: "Midfield Raceway",
    0x2b: "Beginner Course",
    0x40: "Deep Forest Raceway",
    0x41: "Nurburgring Nordschleife",
    0x43: "Infineon Raceway - Sports Car Course",
    0x45: "Twin Ring Motegi Super Speedway",
    0x4c: "Apricot Hill",
    0x4e: "Tahiti Maze",
    0x50: "Test Course",
    0x51: "Autumn Ring Mini",
    0x53: "Cote d'Azur",
    0x54: "Seoul Central",
    0x59: "Motor Sports Land",
    0x5d: "Tokyo R246",
    0x63: "Suzuka Circuit",
    0x64: "Seattle Circuit",
    0x68: "Ice Arena",
    0x6a: "Fuji Speedway 2005",
    0x6b: "Autumn Ring",
    0x6c: "Twin Ring Motegi - West Short Course",
    0x6d: "Twin Ring Motegi - East Short Course",
    0x6e: "Fuji Speedway 80s",
    0x6f: "Circuit de la Sarthe",
    0x70: "Grand Valley East",
    0x71: "Cathedral Rocks Trail I",
    0x74: "Grand Canyon Reverse",
    0x75: "Grand Valley Reverse",
    0x76: "Grand Valley East Reverse",
    0x77: "Clubman Stage Route 5",
    0x78: "Opera Paris Reverse",
    0x79: "High Speed Ring Reverse",
    0x7a: "Trial Mountain Circuit Reverse",
    0x7b: "Tokyo R246 Reverse",
    0x7c: "Cathedral Rocks Trail II",
    0x7d: "El Capitan Reverse",
    0x7e: "New York Reverse",
    0x7f: "Ice Arena Reverse",
    0x80: "Autumn Ring Mini Reverse",
    0x81: "Swiss Alps",
    0x82: "Apricot Hill Reverse",
    0x83: "Infineon Raceway - Stock Car Course",
    0x84: "Seattle Circuit Reverse",
    0x85: "Citta di Aria Reverse",
    0x86: "Tsukuba Circuit Wet",
    0x87: "Chamonix Reverse",
    0x88: "Suzuka Circuit East Course",
    0x89: "Suzuka Circuit West Course",
    0x8a: "Hong Kong Reverse",
    0x8b: "George Paris Reverse",
    0x8c: "Autumn Ring Reverse",
    0x8d: "Tahiti Maze Reverse",
    0x8e: "Special Stage Route 5 Reverse",
    0x8f: "Clubman Stage Route 5 Reverse",
    0x90: "Seoul Reverse",
    0x91: "Costa di Amalfi Reverse",
    0x92: "Deep Forest Raceway Reverse",
    0x93: "Midfield Raceway Reverse",
    0x94: "Fuji Speedway 2005 GT",
    0x95: "Cathedral Rocks Trail I Reverse",
    0x96: "Cathedral Rocks Trail II Reverse",
    0x97: "Swiss Alps Reverse",
    0x99: "Circuit de la Sarthe II",
    0x9a: "Beginner Course Reverse",
    0x9b: "Motor Sports Land Reverse",
    0xaf: "Circuit de la Sarthe 24h",
    0xb0: "Circuit de la Sarthe II 24h",
    0xae: "Gymkhana Course"
}

eventMeta = {
    "am_sunday": {
        "name": "Sunday Cup",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 3,
        "aSpecAnyEvent": 50,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x80, 0xaf4],
            [0x2b, 0xaf5],
            [0x1d, 0xaf6],
            [0x8f, 0xaf7],
            [0x6c, 0xaf8]
        ]
    },
    "am_ff": {
        "name": "FF Challenge",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 3,
        "aSpecAnyEvent": 80,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x93, 0xaf9],
            [0x88, 0xafa],
            [0x8a, 0xafb],
            [0x70, 0xafc],
            [0x6d, 0xafd]
        ]
    },
    "am_fr": {
        "name": "FR Challenge",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 3,
        "aSpecAnyEvent": 80,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x84, 0xafe],
            [0xa, 0xaff],
            [0x1a, 0xb00],
            [0x16, 0xb01],
            [0x9b, 0xb02]
        ]
    },
    "am_4wd": {
        "name": "4WD Challenge",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 3,
        "aSpecAnyEvent": 100,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x70, 0xb03],
            [0x80, 0xb04],
            [0x88, 0xb05],
            [0x7d, 0xb06],
            [0x3, 0xb07]
        ]
    },
    "am_mr": {
        "name": "MR Challenge",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 3,
        "aSpecAnyEvent": 50,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x2b, 0xb08],
            [0x8c, 0xb09],
            [0x7e, 0xb0a],
            [0x3, 0xb0b],
            [0xb, 0xb0c]
        ]
    },
    "am_kcar": {
        "name": "Lightweight K-Car Cup",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 3,
        "aSpecAnyEvent": 40,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x59, 0xb0d],
            [0xa, 0xb0e],
            [0x2b, 0xb0f]
        ]
    },
    "am_spider": {
        "name": "Spider & Roadster",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 3,
        "aSpecAnyEvent": 100,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x6d, 0xb10],
            [0x7a, 0xb11],
            [0x43, 0xb12]
        ]
    },
    "am_pickup": {
        "name": "Pickup Truck Race",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x3, 0xb13],
            [0x16, 0xb14],
            [0x84, 0xb15]
        ]
    },
    "pr_clubman": {
        "name": "Clubman Cup",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 100,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x4c, 0xb16],
            [0x6d, 0xb17],
            [0x90, 0xb18],
            [0x77, 0xb19],
            [0x40, 0xb1a]
        ]
    },
    "pr_tuning": {
        "name": "Tuning Car Grand Prix",
        "descriptionSuffix": "",
        "points": 10,
        "pointsChallenge": 10,
        "aSpecAnyEvent": 80,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": true,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x82, 0xb1c],
            [0x3, 0xb1d],
            [0x5d, 0xb1e],
            [0x7d, 0xb1f],
            [0xa, 0xb20]
        ]
    },
    "pr_na": {
        "name": "Race of NA Sports",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 120,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x43, 0xb21],
            [0x82, 0xb22],
            [0x17, 0xb23],
            [0x8e, 0xb24],
            [0x18, 0xb25]
        ]
    },
    "pr_turbo": {
        "name": "Turbo Sports Cars",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 100,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x6e, 0xb26],
            [0x7b, 0xb27],
            [0x1d, 0xb28],
            [0x7e, 0xb29],
            [0x28, 0xb2a]
        ]
    },
    "pr_boxer": {
        "name": "Boxer Spirit",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 80,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x5, 0xb2b],
            [0x43, 0xb2c],
            [0x92, 0xb2d]
        ]
    },
    "pr_classic": {
        "name": "World Classics",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x6e, 0xb2f],
            [0x7d, 0xb30],
            [0x41, 0xb31],
            [0x53, 0xb32],
            [0x16, 0xb33]
        ]
    },
    "pr_compact": {
        "name": "World Compact",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 50,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x64, 0xb35],
            [0xa, 0xb36],
            [0x76, 0xb37],
            [0x8a, 0xb38],
            [0x6d, 0xb39]
        ]
    },
    "pr_supercar": {
        "name": "Supercar Festival",
        "descriptionSuffix": "",
        "points": 10,
        "pointsChallenge": 10,
        "aSpecAnyEvent": 50,
        "aSpecAllEvents": 0,
        "inOneSitting": false,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x54, 0xb3a],
            [0x3, 0xb3b],
            [0x7, 0xb3c],
            [0x93, 0xb3d],
            [0x43, 0xb3e]
        ]
    },
    "pr_gtworld": {
        "name": "Gran Turismo World Championship",
        "descriptionSuffix": "Formula Gran Turismo is not allowed.",
        "points": 50,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 5,
        "inOneSitting": false,
        "isChampionship": true,
        "nitrousAllowed": true,
        "carIdAnyEvent": [],
        "carIdsForbidden": [
            0x416
        ],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x5d, 0xb40],
            [0x45, 0xb41],
            [0x5, 0xb42],
            [0x90, 0xb43],
            [0xb, 0xb44],
            [0x7, 0xb45],
            [0x78, 0xb46],
            [0x63, 0xb47],
            [0x75, 0xb48],
            [0x6f, 0xb49]
        ]
    },
    "ex_gtallstar": {
        "name": "Gran Turismo All Stars",
        "descriptionSuffix": "Formula Gran Turismo is not allowed.",
        "points": 50,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 5,
        "inOneSitting": false,
        "isChampionship": true,
        "nitrousAllowed": true,
        "carIdAnyEvent": [],
        "carIdsForbidden": [
            0x416
        ],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x79, 0xb4b],
            [0x6e, 0xb4c],
            [0x16, 0xb4d],
            [0x8c, 0xb4e],
            [0x50, 0xb4f],
            [0x75, 0xb50],
            [0x63, 0xb51],
            [0x83, 0xb52],
            [0x6f, 0xb53],
            [0x41, 0xb54]
        ]
    },
    "ex_dream": {
        "name": "Dream Car Championship",
        "descriptionSuffix": "",
        "points": 50,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 5,
        "inOneSitting": false,
        "isChampionship": true,
        "nitrousAllowed": true,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x9, 0xb56],
            [0x7b, 0xb57],
            [0x40, 0xb58],
            [0x90, 0xb59],
            [0x5, 0xb5a],
            [0x50, 0xb5b],
            [0x2b, 0xb5c],
            [0x99, 0xb5d],
            [0x7d, 0xb5e],
            [0x53, 0xb5f]
        ]
    },
    "ex_polyphony": {
        "name": "Polyphony Digital Cup",
        "descriptionSuffix": "",
        "points": 30,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 5,
        "inOneSitting": false,
        "isChampionship": true,
        "nitrousAllowed": true,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x17, 0xb61],
            [0x84, 0xb62],
            [0x83, 0xb63],
            [0x7b, 0xb64],
            [0x6a, 0xb65],
            [0x9b, 0xb66],
            [0x6f, 0xb67],
            [0x7d, 0xb68],
            [0x63, 0xb69],
            [0x41, 0xb6a]
        ]
    },
    "ex_wind": {
        "name": "Like the Wind",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x50, 0xb6b]
        ]
    },
    "ex_formula": {
        "name": "Formula GT World Championship",
        "descriptionSuffix": "",
        "points": 75,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": false,
        "isChampionship": true,
        "nitrousAllowed": true,
        "carIdAnyEvent": [
            0x416,
            ""
        ],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x5d, 0xb6d],
            [0x45, 0xb6e],
            [0x7, 0xb6f],
            [0x1d, 0xb70],
            [0x1b, 0xb71],
            [0x6f, 0xb72],
            [0x53, 0xb73],
            [0x54, 0xb74],
            [0x43, 0xb75],
            [0x16, 0xb76],
            [0x17, 0xb77],
            [0x41, 0xb78],
            [0xb, 0xb79],
            [0x6a, 0xb7a],
            [0x63, 0xb7b]
        ]
    },
    "ex_real_circuit": {
        "name": "Real Circuit Tours",
        "descriptionSuffix": "Formula Gran Turismo is not allowed.",
        "points": 40,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 5,
        "inOneSitting": false,
        "isChampionship": false,
        "nitrousAllowed": true,
        "carIdAnyEvent": [],
        "carIdsForbidden": [
            0x416
        ],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x63, 0xb7c],
            [0x17, 0xb7d],
            [0xa, 0xb7e],
            [0x16, 0xb7f],
            [0x43, 0xb80],
            [0x94, 0xb81],
            [0x6f, 0xb82],
            [0x41, 0xb83]
        ]
    },
    "ex_premium": {
        "name": "Premium Sports Lounge",
        "descriptionSuffix": "",
        "points": 10,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 10,
        "inOneSitting": false,
        "isChampionship": false,
        "nitrousAllowed": true,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x53, 0xb84],
            [0x9, 0xb85],
            [0x8a, 0xb86],
            [0x79, 0xb87],
            [0x7e, 0xb88]
        ]
    },
    "en_grandvalley300": {
        "name": "Grand Valley 300 km",
        "descriptionSuffix": "",
        "points": 10,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 80,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": true,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x1b, 0xb8e]
        ]
    },
    "en_laguna200": {
        "name": "Laguna Seca 200 miles",
        "descriptionSuffix": "",
        "points": 10,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 50,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": true,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x16, 0xb8f]
        ]
    },
    "en_r246_300": {
        "name": "Tokyo R246 300 km",
        "descriptionSuffix": "",
        "points": 10,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 50,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": true,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x5d, 0xb91]
        ]
    },
    "en_ssw150": {
        "name": "Super Speedway 150 miles",
        "descriptionSuffix": "",
        "points": 10,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": true,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x45, 0xb92]
        ]
    },
    "en_infinion_alms": {
        "name": "Infineon World Sports Car Race",
        "descriptionSuffix": "",
        "points": 10,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 5,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": true,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x43, 0xb9b]
        ]
    },
    "en_capitan200": {
        "name": "El Capitan 200 miles",
        "descriptionSuffix": "",
        "points": 10,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 100,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": true,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0xb, 0xb9c]
        ]
    },
    "en_newyork200": {
        "name": "New York 200 mile race",
        "descriptionSuffix": "",
        "points": 10,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 100,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": true,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x7, 0xb9d]
        ]
    },
    "eureurope": {
        "name": "Pan Euro Championship",
        "descriptionSuffix": "",
        "points": 10,
        "pointsChallenge": 10,
        "aSpecAnyEvent": 100,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x9, 0xb9f],
            [0x1b, 0xba0],
            [0x6f, 0xba1],
            [0x53, 0xba2],
            [0x41, 0xba3]
        ]
    },
    "eurbritish_gt": {
        "name": "British GT Series",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 100,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x1b, 0xba5],
            [0x3, 0xba6],
            [0xb, 0xba7],
            [0x43, 0xba8],
            [0x93, 0xba9]
        ]
    },
    "eurbritish_light": {
        "name": "British Lightweight Series",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x6b, 0xbaa],
            [0x82, 0xbab],
            [0x1a, 0xbac]
        ]
    },
    "eurdeu_touring": {
        "name": "Deutsche Touring Car Meistershaft",
        "descriptionSuffix": "",
        "points": 10,
        "pointsChallenge": 10,
        "aSpecAnyEvent": 80,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x9, 0xbae],
            [0x28, 0xbaf],
            [0x79, 0xbb0],
            [0x41, 0xbb1],
            [0x94, 0xbb2]
        ]
    },
    "euritaly": {
        "name": "La Festa Italiano",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 3,
        "aSpecAnyEvent": 50,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x8c, 0xbb3],
            [0x53, 0xbb4],
            [0x43, 0xbb5]
        ]
    },
    "eurfrench": {
        "name": "Tous France Championnat",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 40,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x9, 0xbb7],
            [0x6f, 0xbb8],
            [0x1a, 0xbb9],
            [0x75, 0xbba],
            [0x53, 0xbbb]
        ]
    },
    "eureuro_classic": {
        "name": "Europe Classic Car League",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x41, 0xbbd],
            [0x6e, 0xbbe],
            [0x78, 0xbbf],
            [0x63, 0xbc0],
            [0x92, 0xbc1]
        ]
    },
    "eureuro_hatch": {
        "name": "Euro Hot Hatch League",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 90,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x6d, 0xbc3],
            [0x9, 0xbc4],
            [0x7a, 0xbc5],
            [0x88, 0xbc6],
            [0x8e, 0xbc7]
        ]
    },
    "eur1000mile": {
        "name": "1000 miles!",
        "descriptionSuffix": "",
        "points": 25,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 5,
        "aSpecAllEvents": 0,
        "inOneSitting": false,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x41, 0xbc9],
            [0x9, 0xbca],
            [0x53, 0xbcb],
            [0x99, 0xbcc]
        ]
    },
    "eurschvartz_a": {
        "name": "Schwarzwald Liga A",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 3,
        "aSpecAnyEvent": 80,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x18, 0xbcd],
            [0x78, 0xbce],
            [0x6b, 0xbcf]
        ]
    },
    "eurschvartz_b": {
        "name": "Schwarzwald Liga B",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 80,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x41, 0xbd0],
            [0x5d, 0xbd1],
            [0x3, 0xbd2],
            [0x79, 0xbd3],
            [0x63, 0xbd4]
        ]
    },
    "usrusa": {
        "name": "All American Championship",
        "descriptionSuffix": "",
        "points": 10,
        "pointsChallenge": 10,
        "aSpecAnyEvent": 50,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x64, 0xbd6],
            [0x43, 0xbd7],
            [0x7, 0xbd8],
            [0x7d, 0xbd9],
            [0x16, 0xbda]
        ]
    },
    "usrstar": {
        "name": "Stars and Stripes",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 3,
        "aSpecAnyEvent": 100,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x16, 0xbdb],
            [0x64, 0xbdc],
            [0x83, 0xbdd]
        ]
    },
    "usrmuscle": {
        "name": "Muscle Car Competition",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 3,
        "aSpecAnyEvent": 100,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x7e, 0xbde],
            [0x16, 0xbdf],
            [0xb, 0xbe0]
        ]
    },
    "usrmuscle_old": {
        "name": "Old Muscle Car Competition",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 3,
        "aSpecAnyEvent": 20,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x7, 0xbe1],
            [0x43, 0xbe2],
            [0x64, 0xbe3]
        ]
    },
    "jprjapan": {
        "name": "Japan Championship",
        "descriptionSuffix": "",
        "points": 10,
        "pointsChallenge": 10,
        "aSpecAnyEvent": 120,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x3, 0xbe5],
            [0xa, 0xbe6],
            [0x7b, 0xbe7],
            [0x17, 0xbe8],
            [0x63, 0xbe9]
        ]
    },
    "jprjgtc": {
        "name": "All Japan GT Championship",
        "descriptionSuffix": "",
        "points": 50,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 80,
        "inOneSitting": false,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x5d, 0xbeb],
            [0x88, 0xbec],
            [0x54, 0xbed],
            [0x3, 0xbee],
            [0x45, 0xbef],
            [0x16, 0xbf0],
            [0x5, 0xbf1],
            [0x17, 0xbf2],
            [0x94, 0xbf3],
            [0x63, 0xbf4]
        ]
    },
    "jprjp_70": {
        "name": "Japanese 70's Classics",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 50,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x6e, 0xbf5],
            [0x80, 0xbf6],
            [0xa, 0xbf7],
            [0x9b, 0xbf8],
            [0x18, 0xbf9]
        ]
    },
    "jprjp_80": {
        "name": "Japanese 80's Festival",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 90,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0xb, 0xbfa],
            [0x8f, 0xbfb],
            [0xa, 0xbfc],
            [0x82, 0xbfd],
            [0x63, 0xbfe]
        ]
    },
    "jprjp_90": {
        "name": "Japanese 90's Challenge",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 90,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x4c, 0xbff],
            [0x76, 0xc00],
            [0x6d, 0xc01],
            [0x8e, 0xc02],
            [0x3, 0xc03]
        ]
    },
    "jprjp_compact": {
        "name": "Japanese Compact Cup",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 50,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x6d, 0xc05],
            [0x80, 0xc06],
            [0xa, 0xc07],
            [0x92, 0xc08],
            [0x88, 0xc09]
        ]
    },
    "it_alfa_gta": {
        "name": "GTA Cup",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 3,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [
            0x34,
            "Alfa Romeo Giulia Sprint GTA 1600 '65, which you can win from this event."
        ],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x76, 0xc0a],
            [0xa, 0xc0b],
            [0x4c, 0xc0c]
        ]
    },
    "uk_aston": {
        "name": "Aston Martin Festival",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x3, 0xc0d],
            [0x5, 0xc0e],
            [0x6b, 0xc0f]
        ]
    },
    "uk_lotus_elise": {
        "name": "Elise Trophy",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x5d, 0xc11],
            [0x8c, 0xc12],
            [0x8e, 0xc13],
            [0x5, 0xc14],
            [0x4c, 0xc15]
        ]
    },
    "uk_lotus_classic": {
        "name": "Lotus Classics",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x8a, 0xc17],
            [0x16, 0xc18],
            [0xb, 0xc19],
            [0xa, 0xc1a],
            [0x82, 0xc1b]
        ]
    },
    "uk_mg": {
        "name": "MG Festival",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x8a, 0xc1c],
            [0x63, 0xc1d],
            [0x9, 0xc1e],
            [0x59, 0xc1f],
            [0x76, 0xc20]
        ]
    },
    "uk_triumph_spitfire": {
        "name": "Spitfire Cup",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0xb, 0xc21],
            [0x6c, 0xc22],
            [0x80, 0xc23],
            [0x77, 0xc24],
            [0x90, 0xc25]
        ]
    },
    "uk_tvr": {
        "name": "Blackpool Racers",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x88, 0xc26],
            [0x1a, 0xc27],
            [0x16, 0xc28],
            [0x9, 0xc29],
            [0x6a, 0xc2a]
        ]
    },
    "de_audi_tt": {
        "name": "Tourist Trophy",
        "descriptionSuffix": "Only road cars allowed.",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [
            0x141
        ],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0xb, 0xc2c],
            [0x7b, 0xc2d],
            [0x92, 0xc2e]
        ]
    },
    "de_audi_a3": {
        "name": "A3 Cup",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x88, 0xc2f],
            [0x28, 0xc30],
            [0x16, 0xc31]
        ]
    },
    "de_bmw1": {
        "name": "1 Series Trophy",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x1b, 0xc32],
            [0x43, 0xc33],
            [0x6d, 0xc34]
        ]
    },
    "de_bmw_m": {
        "name": "Club 'M'",
        "descriptionSuffix": "Only road cars allowed.",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [
            0x169
        ],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x7d, 0xc36],
            [0x4c, 0xc37],
            [0x78, 0xc38],
            [0x63, 0xc39],
            [0x41, 0xc3a]
        ]
    },
    "de_mercedes_arrow": {
        "name": "Legends of the Silver Arrow",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 3,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [
            0x183,
            ""
        ],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x3, 0xc3b],
            [0x41, 0xc3c],
            [0x9, 0xc3d]
        ]
    },
    "de_mercedes_sl": {
        "name": "SL Challenge",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [
            0x183,
            ""
        ],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x4c, 0xc3e],
            [0x6e, 0xc3f],
            [0xb, 0xc40]
        ]
    },
    "de_mini": {
        "name": "Mini Sports Meeting",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x9, 0xc41],
            [0x5d, 0xc42],
            [0x8f, 0xc43],
            [0x64, 0xc44],
            [0x7e, 0xc45]
        ]
    },
    "de_opel_speed": {
        "name": "Speedster Trophy",
        "descriptionSuffix": "",
        "points": 20,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": false,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x1b, 0xc46],
            [0x8c, 0xc47],
            [0x88, 0xc48],
            [0x43, 0xc49],
            [0x64, 0xc4a]
        ]
    },
    "de_vw_beetle": {
        "name": "Beetle Cup",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [
            0xb3,
            "Volkswagen Beetle 1100 Standard (Type-11) '49, which you can win from this event. Proper tune and usage of nitrous is recommended."
        ],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x3, 0xc4c],
            [0x17, 0xc4d],
            [0xa, 0xc4e],
            [0x63, 0xc4f],
            [0x6a, 0xc50]
        ]
    },
    "de_vw_lupo": {
        "name": "Lupo Cup",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x3, 0xc52],
            [0x41, 0xc53],
            [0xa, 0xc54],
            [0x63, 0xc55],
            [0x43, 0xc56]
        ]
    },
    "de_vw_gti": {
        "name": "GTi Cup",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x8a, 0xc57],
            [0xa, 0xc58],
            [0x9, 0xc59],
            [0x93, 0xc5a],
            [0x92, 0xc5b]
        ]
    },
    "us_chev_corvette": {
        "name": "Corvette Festival",
        "descriptionSuffix": "Only road cars allowed.",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x64, 0xc5c],
            [0x16, 0xc5d],
            [0x7e, 0xc5e],
            [0x43, 0xc5f],
            [0xb, 0xc60]
        ]
    },
    "us_chev_camaro": {
        "name": "Camaro Meeting",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x54, 0xc61],
            [0x7d, 0xc62],
            [0x28, 0xc63]
        ]
    },
    "us_chry_crossfire": {
        "name": "Crossfire Trophy",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x84, 0xc64],
            [0x45, 0xc65],
            [0x7a, 0xc66]
        ]
    },
    "us_saleen_s7": {
        "name": "Saleen S7 Club",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x6f, 0xc67],
            [0xb, 0xc68],
            [0x8e, 0xc69],
            [0x63, 0xc6a],
            [0x43, 0xc6b]
        ]
    },
    "us_shelby_cobra": {
        "name": "Shelby Cobra Cup",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 100,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [
            0x2DB,
            "Shelby Mustang G.T. 350R `65, which you can win from this event. Commence operation Snake Eater!"
        ],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x84, 0xc6c],
            [0x79, 0xc6d],
            [0x7, 0xc6e],
            [0x16, 0xc6f],
            [0x7a, 0xc70]
        ]
    },
    "fr_citroen_2cv": {
        "name": "2HP - 2CV Classics",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x78, 0xc72],
            [0x53, 0xc73],
            [0x51, 0xc74],
            [0x92, 0xc75],
            [0xa, 0xc76]
        ]
    },
    "fr_peugeot_206": {
        "name": "206 Cup",
        "descriptionSuffix": "Only road cars allowed.",
        "points": 20,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": false,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [
            0x110
        ],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x9, 0xc77],
            [0xa, 0xc78],
            [0x9b, 0xc79],
            [0x88, 0xc7a],
            [0x53, 0xc7b]
        ]
    },
    "fr_renault_clio": {
        "name": "Clio Trophy",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x63, 0xc7d],
            [0x17, 0xc7e],
            [0xa, 0xc7f],
            [0x40, 0xc80],
            [0x7d, 0xc81]
        ]
    },
    "fr_renault_megane": {
        "name": "Megane Cup",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x88, 0xc83],
            [0x9, 0xc84],
            [0x16, 0xc85],
            [0x54, 0xc86],
            [0x53, 0xc87]
        ]
    },
    "fr_renault_alpine": {
        "name": "Renault Alpine Cup",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x5d, 0xc89],
            [0x18, 0xc8a],
            [0x78, 0xc8b],
            [0x1a, 0xc8c],
            [0x1b, 0xc8d]
        ]
    },
    "jp_daihatsu_copen": {
        "name": "Copen Race",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0xa, 0xc8e],
            [0x59, 0xc8f],
            [0x51, 0xc90]
        ]
    },
    "jp_daihatsu_midget2": {
        "name": "Midget II Race",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 50,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x9b, 0xc91]
        ]
    },
    "jp_honda_typer": {
        "name": "Type R Meeting",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x17, 0xc92],
            [0x8c, 0xc93],
            [0x63, 0xc94],
            [0x9b, 0xc95],
            [0xa, 0xc96]
        ]
    },
    "jp_honda_civic": {
        "name": "Civic Race",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x6d, 0xc97],
            [0x88, 0xc98],
            [0x40, 0xc99],
            [0x51, 0xc9a],
            [0x93, 0xc9b]
        ]
    },
    "jp_isuzu": {
        "name": "Isuzu Sports Classics",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0xa, 0xc9c],
            [0x6e, 0xc9d],
            [0x18, 0xc9e]
        ]
    },
    "jp_mazda_rotary": {
        "name": "Club 'RE'",
        "descriptionSuffix": "Only road cars allowed.",
        "points": 5,
        "pointsChallenge": 5,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [
            0x28a,
            "Mazda 110S (L10B) '68, which you can win from this event."
        ],
        "carIdsForbidden": [
            0xc2,
            0x1fb,
            0x4b
        ],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x16, 0xc9f],
            [0x8c, 0xca0],
            [0x8e, 0xca1],
            [0x9, 0xca2],
            [0x63, 0xca3]
        ]
    },
    "jp_mazda_roadster": {
        "name": "NR-A Roadster Cup",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x6d, 0xca5],
            [0x5d, 0xca6],
            [0x8f, 0xca7],
            [0xa, 0xca8],
            [0x18, 0xca9]
        ]
    },
    "jp_mazda_rx8": {
        "name": "NR-A RX-8 Cup",
        "descriptionSuffix": "Only road cars allowed.",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [
            0x4b
        ],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x16, 0xcab],
            [0x1a, 0xcac],
            [0x3, 0xcad],
            [0xb, 0xcae],
            [0xa, 0xcaf]
        ]
    },
    "jp_mitsubishi_mirage": {
        "name": "Mirage Cup",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0xa, 0xcb1],
            [0x6b, 0xcb2],
            [0x1a, 0xcb3],
            [0x16, 0xcb4],
            [0x63, 0xcb5]
        ]
    },
    "jp_mitsubishi_evo": {
        "name": "Evolution Meeting",
        "descriptionSuffix": "Only road cars allowed.",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [
            0xdF,
            0x1bf,
            0x3b6,
            0x24d
        ],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x77, 0xcb6],
            [0x3, 0xcb7],
            [0x5d, 0xcb8]
        ]
    },
    "jp_nissan_gtr": {
        "name": "Race of the Red 'R' Emblem",
        "descriptionSuffix": "",
        "points": 10,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": false,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x17, 0xcb9],
            [0x7a, 0xcba],
            [0x6e, 0xcbb],
            [0x7e, 0xcbc],
            [0x63, 0xcbd]
        ]
    },
    "jp_nissan_march": {
        "name": "Micra Brothers",
        "descriptionSuffix": "Only road cars allowed.",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [
            0xc0
        ],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x51, 0xcbe],
            [0x88, 0xcbf],
            [0x76, 0xcc0]
        ]
    },
    "jp_nissan_silvia": {
        "name": "Silvia Sisters",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 40,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0xa, 0xcc1],
            [0x1a, 0xcc2],
            [0x3, 0xcc3]
        ]
    },
    "jp_nissan_z": {
        "name": "Club 'Z'",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x7, 0xcc4],
            [0x7b, 0xcc5],
            [0xb, 0xcc6],
            [0x16, 0xcc7],
            [0x75, 0xcc8]
        ]
    },
    "jp_subaru_360": {
        "name": "Subaru 360 Race",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 50,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0xa, 0xcc9]
        ]
    },
    "jp_subaru_4wd": {
        "name": "Stars of Pleiades",
        "descriptionSuffix": "Only road cars allowed.",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": true,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [
            0xa2,
            0x79,
            0x1c6,
            0x1c7,
            0x38,
            0x1c4
        ],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0xa, 0xccb],
            [0x18, 0xccc],
            [0x63, 0xccd],
            [0x92, 0xcce],
            [0x16, 0xccf]
        ]
    },
    "jp_suzuki_k": {
        "name": "Suzuki K-Car Cup",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 50,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x80, 0xcd0],
            [0xa, 0xcd1],
            [0x59, 0xcd2]
        ]
    },
    "jp_suzuki_concept": {
        "name": "Suzuki Concepts",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 3,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 0,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [
            0x1c0,
            "Suzuki GSX-R/4 Concept '01, which you can win from this event."
        ],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x6c, 0xcd3],
            [0x64, 0xcd4],
            [0xa, 0xcd5]
        ]
    },
    "jp_toyota_altezza": {
        "name": "Altezza Race",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 50,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0xa, 0xcd6],
            [0x63, 0xcd7],
            [0x4c, 0xcd8],
            [0x17, 0xcd9],
            [0x6a, 0xcda]
        ]
    },
    "jp_toyota_vitz": {
        "name": "Vitz Race",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x3, 0xcdb],
            [0x88, 0xcdc],
            [0x6d, 0xcdd],
            [0xa, 0xcde],
            [0x6b, 0xcdf]
        ]
    },
    "kr_hyundai_sport": {
        "name": "Hyundai Sports Festival",
        "descriptionSuffix": "Only road cars allowed.",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 50,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [
            0x228
        ],
        "noBrokenASpecCars": false,
        "noPenalty": false,
        "events": [
            [0x6b, 0xce0],
            [0x5, 0xce1],
            [0x70, 0xce2],
            [0xa, 0xce3],
            [0x54, 0xce4]
        ]
    },
    "rh_assisi_e": {
        "name": "Umbria Rally (Easy)",
        "descriptionSuffix": "",
        "points": 2,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0xc, 0xd37],
            [0x85, 0xd3a]
        ]
    },
    "rh_assisi_n": {
        "name": "Umbria Rally (Normal)",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0xc, 0xd38],
            [0x85, 0xd3b]
        ]
    },
    "rh_assisi_h": {
        "name": "Umbria Rally (Hard)",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0xc, 0xd39],
            [0x85, 0xd3c]
        ]
    },
    "rh_capri_e": {
        "name": "Capri Rally (Easy)",
        "descriptionSuffix": "",
        "points": 2,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x2, 0xd3d],
            [0x91, 0xd40]
        ]
    },
    "rh_capri_n": {
        "name": "Capri Rally (Normal)",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x2, 0xd3e],
            [0x91, 0xd41]
        ]
    },
    "rh_capri_h": {
        "name": "Capri Rally (Hard)",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x2, 0xd3f],
            [0x91, 0xd42]
        ]
    },
    "rh_grandcanyon_e": {
        "name": "Grand Canyon Rally (Easy)",
        "descriptionSuffix": "",
        "points": 2,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x4, 0xd43],
            [0x74, 0xd46]
        ]
    },
    "rh_grandcanyon_n": {
        "name": "Grand Canyon Rally (Normal)",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x4, 0xd44],
            [0x74, 0xd47]
        ]
    },
    "rh_grandcanyon_h": {
        "name": "Grand Canyon Rally (Hard)",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x4, 0xd45],
            [0x74, 0xd48]
        ]
    },
    "rh_icerace_e": {
        "name": "Whistler Ice Race (Easy)",
        "descriptionSuffix": "",
        "points": 2,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x68, 0xd49],
            [0x7f, 0xd4c]
        ]
    },
    "rh_icerace_n": {
        "name": "Whistler Ice Race (Normal)",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x68, 0xd4a],
            [0x7f, 0xd4d]
        ]
    },
    "rh_icerace_h": {
        "name": "Whistler Ice Race (Hard)",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x68, 0xd4b],
            [0x7f, 0xd4e]
        ]
    },
    "rh_nursnow_e": {
        "name": "Chamonix Rally (Easy)",
        "descriptionSuffix": "",
        "points": 2,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x19, 0xd4f],
            [0x87, 0xd52]
        ]
    },
    "rh_nursnow_n": {
        "name": "Chamonix Rally (Normal)",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x19, 0xd50],
            [0x87, 0xd53]
        ]
    },
    "rh_nursnow_h": {
        "name": "Chamonix Rally (Hard)",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x19, 0xd51],
            [0x87, 0xd54]
        ]
    },
    "rh_paris_rally_e": {
        "name": "George V Rally (Easy)",
        "descriptionSuffix": "",
        "points": 2,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x8, 0xd55],
            [0x8b, 0xd58]
        ]
    },
    "rh_paris_rally_n": {
        "name": "George V Rally (Normal)",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x8, 0xd56],
            [0x8b, 0xd59]
        ]
    },
    "rh_paris_rally_h": {
        "name": "George V Rally (Hard)",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x8, 0xd57],
            [0x8b, 0xd5a]
        ]
    },
    "rh_smtsouth_e": {
        "name": "Swiss Alps Rally (Easy)",
        "descriptionSuffix": "",
        "points": 2,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x81, 0xd5b],
            [0x97, 0xd5e]
        ]
    },
    "rh_smtsouth_n": {
        "name": "Swiss Alps Rally (Normal)",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x81, 0xd5c],
            [0x97, 0xd5f]
        ]
    },
    "rh_smtsouth_h": {
        "name": "Swiss Alps Rally (Hard)",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x81, 0xd5d],
            [0x97, 0xd60]
        ]
    },
    "rh_tahiti_maze_e": {
        "name": "Tour of Tahiti (Easy)",
        "descriptionSuffix": "",
        "points": 2,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x4e, 0xd61],
            [0x8d, 0xd64]
        ]
    },
    "rh_tahiti_maze_n": {
        "name": "Tour of Tahiti (Normal)",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x4e, 0xd62],
            [0x8d, 0xd65]
        ]
    },
    "rh_tahiti_maze_h": {
        "name": "Tour of Tahiti (Hard)",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x4e, 0xd63],
            [0x8d, 0xd66]
        ]
    },
    "rh_tsukuba_wet_e": {
        "name": "Tsukuba Wet Race (Easy)",
        "descriptionSuffix": "",
        "points": 2,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 100,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": true,
        "events": [
            [0x86, 0xd67]
        ]
    },
    "rh_tsukuba_wet_n": {
        "name": "Tsukuba Wet Race (Normal)",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 100,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": true,
        "events": [
            [0x86, 0xd68]
        ]
    },
    "rh_tsukuba_wet_h": {
        "name": "Tsukuba Wet Race (Hard)",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 50,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": true,
        "events": [
            [0x86, 0xd69]
        ]
    },
    "rh_yosemite_dirt_e": {
        "name": "Yosemite Rally I (Easy)",
        "descriptionSuffix": "",
        "points": 2,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x71, 0xd6d],
            [0x95, 0xd70]
        ]
    },
    "rh_yosemite_dirt_n": {
        "name": "Yosemite Rally I (Normal)",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x71, 0xd6e],
            [0x95, 0xd71]
        ]
    },
    "rh_yosemite_dirt_h": {
        "name": "Yosemite Rally I (Hard)",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x71, 0xd6f],
            [0x95, 0xd72]
        ]
    },
    "rh_yosemite_dirt_short_e": {
        "name": "Yosemite Rally II (Easy)",
        "descriptionSuffix": "",
        "points": 2,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x7c, 0xd73],
            [0x96, 0xd76]
        ]
    },
    "rh_yosemite_dirt_short_n": {
        "name": "Yosemite Rally II (Normal)",
        "descriptionSuffix": "",
        "points": 3,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x7c, 0xd74],
            [0x96, 0xd77]
        ]
    },
    "rh_yosemite_dirt_short_h": {
        "name": "Yosemite Rally II (Hard)",
        "descriptionSuffix": "",
        "points": 5,
        "pointsChallenge": 0,
        "aSpecAnyEvent": 0,
        "aSpecAllEvents": 30,
        "inOneSitting": true,
        "isChampionship": false,
        "nitrousAllowed": false,
        "carIdAnyEvent": [],
        "carIdsForbidden": [],
        "noBrokenASpecCars": true,
        "noPenalty": false,
        "events": [
            [0x7c, 0xd75],
            [0x96, 0xd78]
        ]
    }
}

licenseMeta = {
    "l0b0001": {
        "name": "Acceleration and braking: 1",
        "license": "B",
        "index": 1,
        "isCoffee": false,
        "points": 2,
        "flags": {
            "pal": 0xa32268,
            "ntscOffset": 0x14764
        },
        "eventId": {
            "pal": 0xef9,
            "ntsc": 0xd82
        }
    },
    "l0b0002": {
        "name": "Acceleration and braking: 2",
        "license": "B",
        "index": 2,
        "isCoffee": false,
        "points": 2,
        "flags": {
            "pal": 0xa3226c,
            "ntscOffset": 0x14768
        },
        "eventId": {
            "pal": 0xefa,
            "ntsc": 0xd83
        }
    },
    "l0b0003": {
        "name": "Basics of cornering: 1",
        "license": "B",
        "index": 3,
        "isCoffee": false,
        "points": 2,
        "flags": {
            "pal": 0xa32270,
            "ntscOffset": 0x1476C
        },
        "eventId": {
            "pal": 0xefb,
            "ntsc": 0xd84
        }
    },
    "l0b0004": {
        "name": "Basics of cornering: 2",
        "license": "B",
        "index": 4,
        "isCoffee": false,
        "points": 2,
        "flags": {
            "pal": 0xa32274,
            "ntscOffset": 0x14770
        },
        "eventId": {
            "pal": 0xefc,
            "ntsc": 0xd85
        }
    },
    "l0b0005": {
        "name": "1 Lap Guide Run (Tsukuba)",
        "license": "B",
        "index": 5,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa32278,
            "ntscOffset": 0x14774
        },
        "eventId": {
            "pal": 0xefd,
            "ntsc": 0xd86
        }
    },
    "l0b0006": {
        "name": "Acceleration and braking: 3",
        "license": "B",
        "index": 6,
        "isCoffee": false,
        "points": 2,
        "flags": {
            "pal": 0xa3227c,
            "ntscOffset": 0x14778
        },
        "eventId": {
            "pal": 0xefe,
            "ntsc": 0xd87
        }
    },
    "l0b0007": {
        "name": "Acceleration and braking: 4",
        "license": "B",
        "index": 7,
        "isCoffee": false,
        "points": 2,
        "flags": {
            "pal": 0xa32280,
            "ntscOffset": 0x1477C
        },
        "eventId": {
            "pal": 0xeff,
            "ntsc": 0xd88
        }
    },
    "l0b0008": {
        "name": "Basics of cornering: 3",
        "license": "B",
        "index": 8,
        "isCoffee": false,
        "points": 2,
        "flags": {
            "pal": 0xa32284,
            "ntscOffset": 0x14780
        },
        "eventId": {
            "pal": 0xf00,
            "ntsc": 0xd89
        }
    },
    "l0b0009": {
        "name": "Basics of cornering: 4",
        "license": "B",
        "index": 9,
        "isCoffee": false,
        "points": 2,
        "flags": {
            "pal": 0xa32288,
            "ntscOffset": 0x14784
        },
        "eventId": {
            "pal": 0xf01,
            "ntsc": 0xd8a
        }
    },
    "l0b0010": {
        "name": "1 Lap Guide Run (Laguna Seca)",
        "license": "B",
        "index": 10,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa3228c,
            "ntscOffset": 0x14788
        },
        "eventId": {
            "pal": 0xf02,
            "ntsc": 0xd8b
        }
    },
    "l0b0011": {
        "name": "Basics of Dirt driving: 1",
        "license": "B",
        "index": 11,
        "isCoffee": false,
        "points": 2,
        "flags": {
            "pal": 0xa32290,
            "ntscOffset": 0x1478C
        },
        "eventId": {
            "pal": 0xf03,
            "ntsc": 0xd8c
        }
    },
    "l0b0012": {
        "name": "Basics of Dirt driving: 2",
        "license": "B",
        "index": 12,
        "isCoffee": false,
        "points": 2,
        "flags": {
            "pal": 0xa32294,
            "ntscOffset": 0x14790
        },
        "eventId": {
            "pal": 0xf04,
            "ntsc": 0xd8d
        }
    },
    "l0b0013": {
        "name": "Basics of cornering: 5",
        "license": "B",
        "index": 13,
        "isCoffee": false,
        "points": 2,
        "flags": {
            "pal": 0xa32298,
            "ntscOffset": 0x14794
        },
        "eventId": {
            "pal": 0xf05,
            "ntsc": 0xd8e
        }
    },
    "l0b0014": {
        "name": "Basics of cornering: 6",
        "license": "B",
        "index": 14,
        "isCoffee": false,
        "points": 2,
        "flags": {
            "pal": 0xa3229c,
            "ntscOffset": 0x14798
        },
        "eventId": {
            "pal": 0xf06,
            "ntsc": 0xd8f
        }
    },
    "l0b0015": {
        "name": "1 Lap Guide Run (Infineon Raceway)",
        "license": "B",
        "index": 15,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa322a0,
            "ntscOffset": 0x1479C
        },
        "eventId": {
            "pal": 0xf07,
            "ntsc": 0xd90
        }
    },
    "l0b0016": {
        "name": "Graduation Test",
        "license": "B",
        "index": 16,
        "isCoffee": false,
        "points": 2,
        "flags": {
            "pal": 0xa322a4,
            "ntscOffset": 0x147A0
        },
        "eventId": {
            "pal": 0xf08,
            "ntsc": 0xd91
        }
    },
    "l0a0001": {
        "name": "Complex corners: Beginner 1",
        "license": "A",
        "index": 1,
        "isCoffee": false,
        "points": 3,
        "flags": {
            "pal": 0xa322a8,
            "ntscOffset": 0x147A4
        },
        "eventId": {
            "pal": 0xf09,
            "ntsc": 0xd92
        }
    },
    "l0a0002": {
        "name": "Complex corners: Beginner 2",
        "license": "A",
        "index": 2,
        "isCoffee": false,
        "points": 3,
        "flags": {
            "pal": 0xa322ac,
            "ntscOffset": 0x147A8
        },
        "eventId": {
            "pal": 0xf0a,
            "ntsc": 0xd93
        }
    },
    "l0a0003": {
        "name": "Tackling high speed corners: 1",
        "license": "A",
        "index": 3,
        "isCoffee": false,
        "points": 3,
        "flags": {
            "pal": 0xa322b0,
            "ntscOffset": 0x147AC
        },
        "eventId": {
            "pal": 0xf0b,
            "ntsc": 0xd94
        }
    },
    "l0a0004": {
        "name": "Tackling high speed corners: 2",
        "license": "A",
        "index": 4,
        "isCoffee": false,
        "points": 3,
        "flags": {
            "pal": 0xa322b4,
            "ntscOffset": 0x147B0
        },
        "eventId": {
            "pal": 0xf0c,
            "ntsc": 0xd95
        }
    },
    "l0a0005": {
        "name": "1 Lap Guide Run (Grand Valley East)",
        "license": "A",
        "index": 5,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa322b8,
            "ntscOffset": 0x147B4
        },
        "eventId": {
            "pal": 0xf0d,
            "ntsc": 0xd96
        }
    },
    "l0a0006": {
        "name": "Complex corners: Intermediate 1",
        "license": "A",
        "index": 6,
        "isCoffee": false,
        "points": 3,
        "flags": {
            "pal": 0xa322bc,
            "ntscOffset": 0x147B8
        },
        "eventId": {
            "pal": 0xf0e,
            "ntsc": 0xd97
        }
    },
    "l0a0007": {
        "name": "Complex corners: Intermediate 2",
        "license": "A",
        "index": 7,
        "isCoffee": false,
        "points": 3,
        "flags": {
            "pal": 0xa322c0,
            "ntscOffset": 0x147BC
        },
        "eventId": {
            "pal": 0xf0f,
            "ntsc": 0xd98
        }
    },
    "l0a0008": {
        "name": "Applied cornering: 1",
        "license": "A",
        "index": 8,
        "isCoffee": false,
        "points": 3,
        "flags": {
            "pal": 0xa322c4,
            "ntscOffset": 0x147C0
        },
        "eventId": {
            "pal": 0xf10,
            "ntsc": 0xd99
        }
    },
    "l0a0009": {
        "name": "Applied cornering: 2",
        "license": "A",
        "index": 9,
        "isCoffee": false,
        "points": 3,
        "flags": {
            "pal": 0xa322c8,
            "ntscOffset": 0x147C4
        },
        "eventId": {
            "pal": 0xf11,
            "ntsc": 0xd9a
        }
    },
    "l0a0010": {
        "name": "1 Lap Guide Run (Suzuka)",
        "license": "A",
        "index": 10,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa322cc,
            "ntscOffset": 0x147C8
        },
        "eventId": {
            "pal": 0xf12,
            "ntsc": 0xd9b
        }
    },
    "l0a0011": {
        "name": "Applied dirt driving: 1",
        "license": "A",
        "index": 11,
        "isCoffee": false,
        "points": 3,
        "flags": {
            "pal": 0xa322d0,
            "ntscOffset": 0x147CC
        },
        "eventId": {
            "pal": 0xf13,
            "ntsc": 0xd9c
        }
    },
    "l0a0012": {
        "name": "Applied dirt driving: 2",
        "license": "A",
        "index": 12,
        "isCoffee": false,
        "points": 3,
        "flags": {
            "pal": 0xa322d4,
            "ntscOffset": 0x147D0
        },
        "eventId": {
            "pal": 0xf14,
            "ntsc": 0xd9d
        }
    },
    "l0a0013": {
        "name": "Tackling blind corners: 1",
        "license": "A",
        "index": 13,
        "isCoffee": false,
        "points": 3,
        "flags": {
            "pal": 0xa322d8,
            "ntscOffset": 0x147D4
        },
        "eventId": {
            "pal": 0xf15,
            "ntsc": 0xd9e
        }
    },
    "l0a0014": {
        "name": "Tackling blind corners: 2",
        "license": "A",
        "index": 14,
        "isCoffee": false,
        "points": 3,
        "flags": {
            "pal": 0xa322dc,
            "ntscOffset": 0x147D8
        },
        "eventId": {
            "pal": 0xf16,
            "ntsc": 0xd9f
        }
    },
    "l0a0015": {
        "name": "1 Lap Guide Run (Trial Mountain)",
        "license": "A",
        "index": 15,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa322e0,
            "ntscOffset": 0x147DC
        },
        "eventId": {
            "pal": 0xf17,
            "ntsc": 0xda0
        }
    },
    "l0a0016": {
        "name": "Graduation Test",
        "license": "A",
        "index": 16,
        "isCoffee": false,
        "points": 3,
        "flags": {
            "pal": 0xa322e4,
            "ntscOffset": 0x147E0
        },
        "eventId": {
            "pal": 0xf18,
            "ntsc": 0xda1
        }
    },
    "lib0001": {
        "name": "Braking during turns: 1",
        "license": "IB",
        "index": 1,
        "isCoffee": false,
        "points": 4,
        "flags": {
            "pal": 0xa322e8,
            "ntscOffset": 0x147E4
        },
        "eventId": {
            "pal": 0xf19,
            "ntsc": 0xda2
        }
    },
    "lib0002": {
        "name": "Braking during turns: 2",
        "license": "IB",
        "index": 2,
        "isCoffee": false,
        "points": 4,
        "flags": {
            "pal": 0xa322ec,
            "ntscOffset": 0x147E8
        },
        "eventId": {
            "pal": 0xf1a,
            "ntsc": 0xda3
        }
    },
    "lib0003": {
        "name": "Advanced level complex corners: 1",
        "license": "IB",
        "index": 3,
        "isCoffee": false,
        "points": 4,
        "flags": {
            "pal": 0xa322f0,
            "ntscOffset": 0x147EC
        },
        "eventId": {
            "pal": 0xf1b,
            "ntsc": 0xda4
        }
    },
    "lib0004": {
        "name": "Advanced level complex corners: 2",
        "license": "IB",
        "index": 4,
        "isCoffee": false,
        "points": 4,
        "flags": {
            "pal": 0xa322f4,
            "ntscOffset": 0x147F0
        },
        "eventId": {
            "pal": 0xf1c,
            "ntsc": 0xda5
        }
    },
    "lib0005": {
        "name": "1 Lap Guide Run (Costa di Amalfi)",
        "license": "IB",
        "index": 5,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa322f8,
            "ntscOffset": 0x147F4
        },
        "eventId": {
            "pal": 0xf1d,
            "ntsc": 0xda6
        }
    },
    "lib0006": {
        "name": "Cone Slalom 1",
        "license": "IB",
        "index": 6,
        "isCoffee": false,
        "points": 4,
        "flags": {
            "pal": 0xa322fc,
            "ntscOffset": 0x147F8
        },
        "eventId": {
            "pal": 0xf1e,
            "ntsc": 0xda7
        }
    },
    "lib0007": {
        "name": "Cone Slalom 2",
        "license": "IB",
        "index": 7,
        "isCoffee": false,
        "points": 4,
        "flags": {
            "pal": 0xa32300,
            "ntscOffset": 0x147FC
        },
        "eventId": {
            "pal": 0xf1f,
            "ntsc": 0xda8
        }
    },
    "lib0008": {
        "name": "City street guide: 1",
        "license": "IB",
        "index": 8,
        "isCoffee": false,
        "points": 4,
        "flags": {
            "pal": 0xa32304,
            "ntscOffset": 0x14800
        },
        "eventId": {
            "pal": 0xf20,
            "ntsc": 0xda9
        }
    },
    "lib0009": {
        "name": "City street guide: 2",
        "license": "IB",
        "index": 9,
        "isCoffee": false,
        "points": 4,
        "flags": {
            "pal": 0xa32308,
            "ntscOffset": 0x14804
        },
        "eventId": {
            "pal": 0xf21,
            "ntsc": 0xdaa
        }
    },
    "lib0010": {
        "name": "1 Lap Guide Run (Hong Kong)",
        "license": "IB",
        "index": 10,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa3230c,
            "ntscOffset": 0x14808
        },
        "eventId": {
            "pal": 0xf22,
            "ntsc": 0xdab
        }
    },
    "lib0011": {
        "name": "Competition dirt racing: 1",
        "license": "IB",
        "index": 11,
        "isCoffee": false,
        "points": 4,
        "flags": {
            "pal": 0xa32310,
            "ntscOffset": 0x1480C
        },
        "eventId": {
            "pal": 0xf23,
            "ntsc": 0xdac
        }
    },
    "lib0012": {
        "name": "Driving on Snow: 1",
        "license": "IB",
        "index": 12,
        "isCoffee": false,
        "points": 4,
        "flags": {
            "pal": 0xa32314,
            "ntscOffset": 0x14810
        },
        "eventId": {
            "pal": 0xf24,
            "ntsc": 0xdad
        }
    },
    "lib0013": {
        "name": "Tackling undulating S-bends",
        "license": "IB",
        "index": 13,
        "isCoffee": false,
        "points": 4,
        "flags": {
            "pal": 0xa32318,
            "ntscOffset": 0x14814
        },
        "eventId": {
            "pal": 0xf25,
            "ntsc": 0xdae
        }
    },
    "lib0014": {
        "name": "Tackling corner sequences over undulating surfaces",
        "license": "IB",
        "index": 14,
        "isCoffee": false,
        "points": 4,
        "flags": {
            "pal": 0xa3231c,
            "ntscOffset": 0x14818
        },
        "eventId": {
            "pal": 0xf26,
            "ntsc": 0xdaf
        }
    },
    "lib0015": {
        "name": "1 Lap Guide Run (Citta di Aria)",
        "license": "IB",
        "index": 15,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa32320,
            "ntscOffset": 0x1481C
        },
        "eventId": {
            "pal": 0xf27,
            "ntsc": 0xdb0
        }
    },
    "lib0016": {
        "name": "Graduation Test",
        "license": "IB",
        "index": 16,
        "isCoffee": false,
        "points": 4,
        "flags": {
            "pal": 0xa32324,
            "ntscOffset": 0x14820
        },
        "eventId": {
            "pal": 0xf28,
            "ntsc": 0xdb1
        }
    },
    "lia0001": {
        "name": "Tackling complex corner sequences: 1",
        "license": "IA",
        "index": 1,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa32328,
            "ntscOffset": 0x14824
        },
        "eventId": {
            "pal": 0xf29,
            "ntsc": 0xdb2
        }
    },
    "lia0002": {
        "name": "Tackling complex corner sequences: 2",
        "license": "IA",
        "index": 2,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa3232c,
            "ntscOffset": 0x14828
        },
        "eventId": {
            "pal": 0xf2a,
            "ntsc": 0xdb3
        }
    },
    "lia0003": {
        "name": "Guide to Chicanes: 1",
        "license": "IA",
        "index": 3,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa32330,
            "ntscOffset": 0x1482C
        },
        "eventId": {
            "pal": 0xf2b,
            "ntsc": 0xdb4
        }
    },
    "lia0004": {
        "name": "Guide to Chicanes: 2",
        "license": "IA",
        "index": 4,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa32334,
            "ntscOffset": 0x14830
        },
        "eventId": {
            "pal": 0xf2c,
            "ntsc": 0xdb5
        }
    },
    "lia0005": {
        "name": "1 Lap Guide Run (El Capitan)",
        "license": "IA",
        "index": 5,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa32338,
            "ntscOffset": 0x14834
        },
        "eventId": {
            "pal": 0xf2d,
            "ntsc": 0xdb6
        }
    },
    "lia0006": {
        "name": "Tackling complex corner sequences: 3",
        "license": "IA",
        "index": 6,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa3233c,
            "ntscOffset": 0x14838
        },
        "eventId": {
            "pal": 0xf2e,
            "ntsc": 0xdb7
        }
    },
    "lia0007": {
        "name": "Tackling complex corner sequences: 4",
        "license": "IA",
        "index": 7,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa32340,
            "ntscOffset": 0x1483C
        },
        "eventId": {
            "pal": 0xf2f,
            "ntsc": 0xdb8
        }
    },
    "lia0008": {
        "name": "City street guide: 3",
        "license": "IA",
        "index": 8,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa32344,
            "ntscOffset": 0x14840
        },
        "eventId": {
            "pal": 0xf30,
            "ntsc": 0xdb9
        }
    },
    "lia0009": {
        "name": "City street guide: 4",
        "license": "IA",
        "index": 9,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa32348,
            "ntscOffset": 0x14844
        },
        "eventId": {
            "pal": 0xf31,
            "ntsc": 0xdba
        }
    },
    "lia0010": {
        "name": "1 Lap Guide Run (Fuji Speedway 2005)",
        "license": "IA",
        "index": 10,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa3234c,
            "ntscOffset": 0x14848
        },
        "eventId": {
            "pal": 0xf32,
            "ntsc": 0xdbb
        }
    },
    "lia0011": {
        "name": "Competition dirt racing: 2",
        "license": "IA",
        "index": 11,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa32350,
            "ntscOffset": 0x1484C
        },
        "eventId": {
            "pal": 0xf33,
            "ntsc": 0xdbc
        }
    },
    "lia0012": {
        "name": "Driving on Snow: 2",
        "license": "IA",
        "index": 12,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa32354,
            "ntscOffset": 0x14850
        },
        "eventId": {
            "pal": 0xf34,
            "ntsc": 0xdbd
        }
    },
    "lia0013": {
        "name": "Tackling complex corner sequences: 5",
        "license": "IA",
        "index": 13,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa32358,
            "ntscOffset": 0x14854
        },
        "eventId": {
            "pal": 0xf35,
            "ntsc": 0xdbe
        }
    },
    "lia0014": {
        "name": "Tackling complex corner sequences: 6",
        "license": "IA",
        "index": 14,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa3235c,
            "ntscOffset": 0x14858
        },
        "eventId": {
            "pal": 0xf36,
            "ntsc": 0xdbf
        }
    },
    "lia0015": {
        "name": "1 Lap Guide Run (Nurburgring)",
        "license": "IA",
        "index": 15,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa32360,
            "ntscOffset": 0x1485C
        },
        "eventId": {
            "pal": 0xf37,
            "ntsc": 0xdc0
        }
    },
    "lia0016": {
        "name": "Graduation Test",
        "license": "IA",
        "index": 16,
        "isCoffee": false,
        "points": 5,
        "flags": {
            "pal": 0xa32364,
            "ntscOffset": 0x14860
        },
        "eventId": {
            "pal": 0xf38,
            "ntsc": 0xdc1
        }
    },
    "l0s0001": {
        "name": "1 Lap Time Trial (Twin Ring Motegi)",
        "license": "S",
        "index": 1,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa32368,
            "ntscOffset": 0x14864
        },
        "eventId": {
            "pal": 0xf39,
            "ntsc": 0xdc2
        }
    },
    "l0s0002": {
        "name": "1 Lap Time Trial (Citta di Aria)",
        "license": "S",
        "index": 2,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa3236c,
            "ntscOffset": 0x14868
        },
        "eventId": {
            "pal": 0xf3a,
            "ntsc": 0xdc3
        }
    },
    "l0s0003": {
        "name": "1 Lap Time Trial (SS Route 5)",
        "license": "S",
        "index": 3,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa32370,
            "ntscOffset": 0x1486C
        },
        "eventId": {
            "pal": 0xf3b,
            "ntsc": 0xdc4
        }
    },
    "l0s0004": {
        "name": "1 Lap Time Trial (Costa di Amalfi)",
        "license": "S",
        "index": 4,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa32374,
            "ntscOffset": 0x14870
        },
        "eventId": {
            "pal": 0xf3c,
            "ntsc": 0xdc5
        }
    },
    "l0s0005": {
        "name": "1 Lap Time Trial (Seattle)",
        "license": "S",
        "index": 5,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa32378,
            "ntscOffset": 0x14874
        },
        "eventId": {
            "pal": 0xf3d,
            "ntsc": 0xdc6
        }
    },
    "l0s0006": {
        "name": "1 Lap Time Trial (Ice Arena)",
        "license": "S",
        "index": 6,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa3237c,
            "ntscOffset": 0x14878
        },
        "eventId": {
            "pal": 0xf3e,
            "ntsc": 0xdc7
        }
    },
    "l0s0007": {
        "name": "1 Lap Time Trial (Trial Mountain)",
        "license": "S",
        "index": 7,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa32380,
            "ntscOffset": 0x1487C
        },
        "eventId": {
            "pal": 0xf3f,
            "ntsc": 0xdc8
        }
    },
    "l0s0008": {
        "name": "1 Lap Time Trial (Tokyo R246)",
        "license": "S",
        "index": 8,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa32384,
            "ntscOffset": 0x14880
        },
        "eventId": {
            "pal": 0xf40,
            "ntsc": 0xdc9
        }
    },
    "l0s0009": {
        "name": "1 Lap Time Trial (El Capitan)",
        "license": "S",
        "index": 9,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa32388,
            "ntscOffset": 0x14884
        },
        "eventId": {
            "pal": 0xf41,
            "ntsc": 0xdca
        }
    },
    "l0s0010": {
        "name": "1 Lap Time Trial (Grand Canyon)",
        "license": "S",
        "index": 10,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa3238c,
            "ntscOffset": 0x14888
        },
        "eventId": {
            "pal": 0xf42,
            "ntsc": 0xdcb
        }
    },
    "l0s0011": {
        "name": "1 Lap Time Trial (Opera Paris)",
        "license": "S",
        "index": 11,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa32390,
            "ntscOffset": 0x1488C
        },
        "eventId": {
            "pal": 0xf43,
            "ntsc": 0xdcc
        }
    },
    "l0s0012": {
        "name": "1 Lap Time Trial (Suzuka Circuit)",
        "license": "S",
        "index": 12,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa32394,
            "ntscOffset": 0x14890
        },
        "eventId": {
            "pal": 0xf44,
            "ntsc": 0xdcd
        }
    },
    "l0s0013": {
        "name": "1 Lap Time Trial (Infineon Raceway)",
        "license": "S",
        "index": 13,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa32398,
            "ntscOffset": 0x14894
        },
        "eventId": {
            "pal": 0xf45,
            "ntsc": 0xdce
        }
    },
    "l0s0014": {
        "name": "1 Lap Time Trial (Chamonix)",
        "license": "S",
        "index": 14,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa3239c,
            "ntscOffset": 0x14898
        },
        "eventId": {
            "pal": 0xf46,
            "ntsc": 0xdcf
        }
    },
    "l0s0015": {
        "name": "1 Lap Time Trial (Circuit de la Sarthe)",
        "license": "S",
        "index": 15,
        "isCoffee": false,
        "points": 10,
        "flags": {
            "pal": 0xa323a0,
            "ntscOffset": 0x1489C
        },
        "eventId": {
            "pal": 0xf47,
            "ntsc": 0xdd0
        }
    },
    "l0s0016": {
        "name": "1 Lap Time Trial (Nurburgring)",
        "license": "S",
        "index": 16,
        "isCoffee": false,
        "points": 25,
        "flags": {
            "pal": 0xa323a4,
            "ntscOffset": 0x148A0
        },
        "eventId": {
            "pal": 0xf48,
            "ntsc": 0xdd1
        }
    },
    "l0c0001": {
        "name": "Manoeuvre around the cones",
        "license": "B",
        "index": 1,
        "isCoffee": true,
        "points": 5,
        "flags": {
            "pal": 0xa323a8,
            "ntscOffset": 0x148A4
        },
        "eventId": {
            "pal": 0xf49,
            "ntsc": 0xe72
        }
    },
    "l0c0002": {
        "name": "Knock over the cones laid out in a spiral",
        "license": "A",
        "index": 2,
        "isCoffee": true,
        "points": 5,
        "flags": {
            "pal": 0xa323ac,
            "ntscOffset": 0x148A8
        },
        "eventId": {
            "pal": 0xf4a,
            "ntsc": 0xe73
        }
    },
    "l0c0003": {
        "name": "Knock over the cones laid out in a spiral (2)",
        "license": "IB",
        "index": 3,
        "isCoffee": true,
        "points": 5,
        "flags": {
            "pal": 0xa323b0,
            "ntscOffset": 0x148AC
        },
        "eventId": {
            "pal": 0xf4b,
            "ntsc": 0xe74
        }
    },
    "l0c0004": {
        "name": "Cones - Gymkhana",
        "license": "IA",
        "index": 4,
        "isCoffee": true,
        "points": 5,
        "flags": {
            "pal": 0xa323b4,
            "ntscOffset": 0x148B0
        },
        "eventId": {
            "pal": 0xf4c,
            "ntsc": 0xe75
        }
    },
    "l0c0005": {
        "name": "Guide to cone maze",
        "license": "S",
        "index": 5,
        "isCoffee": true,
        "points": 10,
        "flags": {
            "pal": 0xa323b8,
            "ntscOffset": 0x148B4
        },
        "eventId": {
            "pal": 0xf4d,
            "ntsc": 0xe76
        }
    }
}

missionMeta = {
    "l0m0001": {
        "name": "The Pass: Deep Forest Raceway",
        "nameFull": "The Pass: Deep Forest Raceway",
        "index": 1,
        "points": 2,
        "eventId": {
            "pal": 0xf4e,
            "ntsc": 0xe81
        }
    },
    "l0m0002": {
        "name": "The Pass: Grand Valley Speedway",
        "nameFull": "The Pass: Grand Valley Speedway",
        "index": 2,
        "points": 2,
        "eventId": {
            "pal": 0xf4f,
            "ntsc": 0xe82
        }
    },
    "l0m0003": {
        "name": "The Pass: Cote d'Azur",
        "nameFull": "The Pass: Cote d'Azur",
        "index": 3,
        "points": 2,
        "eventId": {
            "pal": 0xf50,
            "ntsc": 0xe83
        }
    },
    "l0m0004": {
        "name": "The Pass: Seattle Circuit",
        "nameFull": "The Pass: Seattle Circuit",
        "index": 4,
        "points": 2,
        "eventId": {
            "pal": 0xf51,
            "ntsc": 0xe84
        }
    },
    "l0m0005": {
        "name": "The Pass: High-speed Ring",
        "nameFull": "The Pass: High-speed Ring",
        "index": 5,
        "points": 2,
        "eventId": {
            "pal": 0xf52,
            "ntsc": 0xe85
        }
    },
    "l0m0006": {
        "name": "The Pass: Tsukuba Circuit",
        "nameFull": "The Pass: Tsukuba Circuit",
        "index": 6,
        "points": 2,
        "eventId": {
            "pal": 0xf53,
            "ntsc": 0xe86
        }
    },
    "l0m0007": {
        "name": "The Pass: Midfield Raceway",
        "nameFull": "The Pass: Midfield Raceway",
        "index": 7,
        "points": 2,
        "eventId": {
            "pal": 0xf54,
            "ntsc": 0xe87
        }
    },
    "l0m0008": {
        "name": "The Pass: Trial Mountain",
        "nameFull": "The Pass: Trial Mountain",
        "index": 8,
        "points": 2,
        "eventId": {
            "pal": 0xf55,
            "ntsc": 0xe88
        }
    },
    "l0m0009": {
        "name": "The Pass: Twin Ring Motegi",
        "nameFull": "The Pass: Twin Ring Motegi",
        "index": 9,
        "points": 2,
        "eventId": {
            "pal": 0xf56,
            "ntsc": 0xe89
        }
    },
    "l0m0010": {
        "name": "The Pass: Circuit de la Sarthe",
        "nameFull": "The Pass: Circuit de la Sarthe",
        "index": 10,
        "points": 2,
        "eventId": {
            "pal": 0xf57,
            "ntsc": 0xe8a
        }
    },
    "l0m0011": {
        "name": "3 Lap Battle: New York City Street Course",
        "nameFull": "3 Lap Battle: New York City Street Course",
        "index": 11,
        "points": 10,
        "eventId": {
            "pal": 0xf58,
            "ntsc": 0xe8b
        }
    },
    "l0m0012": {
        "name": "3 Lap Battle: Laguna Seca Raceway",
        "nameFull": "3 Lap Battle: Laguna Seca Raceway",
        "index": 12,
        "points": 10,
        "eventId": {
            "pal": 0xf59,
            "ntsc": 0xe8c
        }
    },
    "l0m0013": {
        "name": "3 Lap Battle: Opera Paris Course",
        "nameFull": "3 Lap Battle: Opera Paris Course",
        "index": 13,
        "points": 10,
        "eventId": {
            "pal": 0xf5a,
            "ntsc": 0xe8d
        }
    },
    "l0m0014": {
        "name": "3 Lap Battle: Seattle Circuit",
        "nameFull": "3 Lap Battle: Seattle Circuit",
        "index": 14,
        "points": 10,
        "eventId": {
            "pal": 0xf5b,
            "ntsc": 0xe8e
        }
    },
    "l0m0015": {
        "name": "3 Lap Battle: Cote d'Azur",
        "nameFull": "3 Lap Battle: Cote d'Azur",
        "index": 15,
        "points": 10,
        "eventId": {
            "pal": 0xf5c,
            "ntsc": 0xe8f
        }
    },
    "l0m0016": {
        "name": "3 Lap Battle: Suzuka Circuit",
        "nameFull": "3 Lap Battle: Suzuka Circuit",
        "index": 16,
        "points": 10,
        "eventId": {
            "pal": 0xf5d,
            "ntsc": 0xe90
        }
    },
    "l0m0017": {
        "name": "3 Lap Battle: Infineon Raceway",
        "nameFull": "3 Lap Battle: Infineon Raceway",
        "index": 17,
        "points": 10,
        "eventId": {
            "pal": 0xf5e,
            "ntsc": 0xe91
        }
    },
    "l0m0018": {
        "name": "3 Lap Battle: Circuit de la Sarthe 2",
        "nameFull": "3 Lap Battle: Circuit de la Sarthe 2",
        "index": 18,
        "points": 10,
        "eventId": {
            "pal": 0xf5f,
            "ntsc": 0xe92
        }
    },
    "l0m0019": {
        "name": "3 Lap Battle: Suzuka Circuit East Course",
        "nameFull": "3 Lap Battle: Suzuka Circuit East Course",
        "index": 19,
        "points": 10,
        "eventId": {
            "pal": 0xf60,
            "ntsc": 0xe93
        }
    },
    "l0m0020": {
        "name": "3 Lap Battle: Tsukuba Circuit",
        "nameFull": "3 Lap Battle: Tsukuba Circuit",
        "index": 20,
        "points": 10,
        "eventId": {
            "pal": 0xf61,
            "ntsc": 0xe94
        }
    },
    "l0m0021": {
        "name": "Slipstream Battle 1: Nissan Cube",
        "nameFull": "Slipstream Battle 1: Nissan Cube",
        "index": 21,
        "points": 5,
        "eventId": {
            "pal": 0xf62,
            "ntsc": 0xe95
        }
    },
    "l0m0022": {
        "name": "Slipstream Battle 2: Honda Odyssey",
        "nameFull": "Slipstream Battle 2: Honda Odyssey",
        "index": 22,
        "points": 5,
        "eventId": {
            "pal": 0xf63,
            "ntsc": 0xe96
        }
    },
    "l0m0023": {
        "name": "Slipstream Battle 3: Nissan Skyline GT-R",
        "nameFull": "Slipstream Battle 3: Nissan Skyline GT-R",
        "index": 23,
        "points": 5,
        "eventId": {
            "pal": 0xf64,
            "ntsc": 0xe97
        }
    },
    "l0m0024": {
        "name": "Slipstream Battle 4: Amuse S2000 GT1",
        "nameFull": "Slipstream Battle 4: Amuse S2000 GT1",
        "index": 24,
        "points": 5,
        "eventId": {
            "pal": 0xf65,
            "ntsc": 0xe98
        }
    },
    "l0m0025": {
        "name": "One Lap Magic: A showdown between Z's!",
        "nameFull": "One Lap Magic: A showdown between Z's old and new!",
        "index": 25,
        "points": 10,
        "eventId": {
            "pal": 0xf66,
            "ntsc": 0xe99
        }
    },
    "l0m0026": {
        "name": "One Lap Magic: A showdown between Hondas!",
        "nameFull": "One Lap Magic: A showdown between Hondas old and new!",
        "index": 26,
        "points": 10,
        "eventId": {
            "pal": 0xf67,
            "ntsc": 0xe9a
        }
    },
    "l0m0027": {
        "name": "One Lap Magic: A showdown between Mazdas!",
        "nameFull": "One Lap Magic: A showdown between Mazdas old and new!",
        "index": 27,
        "points": 10,
        "eventId": {
            "pal": 0xf68,
            "ntsc": 0xe9b
        }
    },
    "l0m0028": {
        "name": "One Lap Magic: A showdown between Celicas!",
        "nameFull": "One Lap Magic: A showdown between Celicas old and new!",
        "index": 28,
        "points": 10,
        "eventId": {
            "pal": 0xf69,
            "ntsc": 0xe9c
        }
    },
    "l0m0029": {
        "name": "One Lap Magic: A showdown between Chevrolets!",
        "nameFull": "One Lap Magic: A showdown between Chevrolets old and new!",
        "index": 29,
        "points": 10,
        "eventId": {
            "pal": 0xf6a,
            "ntsc": 0xe9d
        }
    },
    "l0m0030": {
        "name": "One Lap Magic: A showdown between Subarus!",
        "nameFull": "One Lap Magic: A showdown between Subarus old and new!",
        "index": 30,
        "points": 10,
        "eventId": {
            "pal": 0xf6b,
            "ntsc": 0xe9e
        }
    },
    "l0m0031": {
        "name": "One Lap Magic: A showdown between Lotuses!",
        "nameFull": "One Lap Magic: A showdown between Lotuses old and new!",
        "index": 31,
        "points": 10,
        "eventId": {
            "pal": 0xf6c,
            "ntsc": 0xe9f
        }
    },
    "l0m0032": {
        "name": "One Lap Magic: A showdown between Fords!",
        "nameFull": "One Lap Magic: A showdown between Fords old and new!",
        "index": 32,
        "points": 10,
        "eventId": {
            "pal": 0xf6d,
            "ntsc": 0xea0
        }
    },
    "l0m0033": {
        "name": "One Lap Magic: A showdown between GM's!",
        "nameFull": "One Lap Magic: A showdown between GM's old and new!",
        "index": 33,
        "points": 10,
        "eventId": {
            "pal": 0xf6e,
            "ntsc": 0xea1
        }
    },
    "l0m0034": {
        "name": "One Lap Magic: A showdown between Mercedes Benz's!",
        "nameFull": "One Lap Magic: A showdown between Mercedes Benz's old and new!",
        "index": 34,
        "points": 25,
        "eventId": {
            "pal": 0xf6f,
            "ntsc": 0xea2
        }
    }
}

eventIdToString = {
    0xaf4: "Sunday Cup",
    0xaf5: "Sunday Cup",
    0xaf6: "Sunday Cup",
    0xaf7: "Sunday Cup",
    0xaf8: "Sunday Cup",
    0xaf9: "FF Challenge",
    0xafa: "FF Challenge",
    0xafb: "FF Challenge",
    0xafc: "FF Challenge",
    0xafd: "FF Challenge",
    0xafe: "FR Challenge",
    0xaff: "FR Challenge",
    0xb00: "FR Challenge",
    0xb01: "FR Challenge",
    0xb02: "FR Challenge",
    0xb03: "4WD Challenge",
    0xb04: "4WD Challenge",
    0xb05: "4WD Challenge",
    0xb06: "4WD Challenge",
    0xb07: "4WD Challenge",
    0xb08: "MR Challenge",
    0xb09: "MR Challenge",
    0xb0a: "MR Challenge",
    0xb0b: "MR Challenge",
    0xb0c: "MR Challenge",
    0xb0d: "Lightweight K-Car Cup",
    0xb0e: "Lightweight K-Car Cup",
    0xb0f: "Lightweight K-Car Cup",
    0xb10: "Spider & Roadster",
    0xb11: "Spider & Roadster",
    0xb12: "Spider & Roadster",
    0xb13: "Pickup Truck Race",
    0xb14: "Pickup Truck Race",
    0xb15: "Pickup Truck Race",
    0xb16: "Clubman Cup",
    0xb17: "Clubman Cup",
    0xb18: "Clubman Cup",
    0xb19: "Clubman Cup",
    0xb1a: "Clubman Cup",
    0xb1b: "Tuning Car Grand Prix",
    0xb1c: "Tuning Car Grand Prix",
    0xb1d: "Tuning Car Grand Prix",
    0xb1e: "Tuning Car Grand Prix",
    0xb1f: "Tuning Car Grand Prix",
    0xb20: "Tuning Car Grand Prix",
    0xb21: "Race of NA Sports",
    0xb22: "Race of NA Sports",
    0xb23: "Race of NA Sports",
    0xb24: "Race of NA Sports",
    0xb25: "Race of NA Sports",
    0xb26: "Turbo Sports Cars",
    0xb27: "Turbo Sports Cars",
    0xb28: "Turbo Sports Cars",
    0xb29: "Turbo Sports Cars",
    0xb2a: "Turbo Sports Cars",
    0xb2b: "Boxer Spirit",
    0xb2c: "Boxer Spirit",
    0xb2d: "Boxer Spirit",
    0xb2e: "World Classics",
    0xb2f: "World Classics",
    0xb30: "World Classics",
    0xb31: "World Classics",
    0xb32: "World Classics",
    0xb33: "World Classics",
    0xb34: "World Compact",
    0xb35: "World Compact",
    0xb36: "World Compact",
    0xb37: "World Compact",
    0xb38: "World Compact",
    0xb39: "World Compact",
    0xb3a: "Supercar Festival",
    0xb3b: "Supercar Festival",
    0xb3c: "Supercar Festival",
    0xb3d: "Supercar Festival",
    0xb3e: "Supercar Festival",
    0xb3f: "Gran Turismo World Championship",
    0xb40: "Gran Turismo World Championship",
    0xb41: "Gran Turismo World Championship",
    0xb42: "Gran Turismo World Championship",
    0xb43: "Gran Turismo World Championship",
    0xb44: "Gran Turismo World Championship",
    0xb45: "Gran Turismo World Championship",
    0xb46: "Gran Turismo World Championship",
    0xb47: "Gran Turismo World Championship",
    0xb48: "Gran Turismo World Championship",
    0xb49: "Gran Turismo World Championship",
    0xb4a: "Gran Turismo All Stars",
    0xb4b: "Gran Turismo All Stars",
    0xb4c: "Gran Turismo All Stars",
    0xb4d: "Gran Turismo All Stars",
    0xb4e: "Gran Turismo All Stars",
    0xb4f: "Gran Turismo All Stars",
    0xb50: "Gran Turismo All Stars",
    0xb51: "Gran Turismo All Stars",
    0xb52: "Gran Turismo All Stars",
    0xb53: "Gran Turismo All Stars",
    0xb54: "Gran Turismo All Stars",
    0xb55: "Dream Car Championship",
    0xb56: "Dream Car Championship",
    0xb57: "Dream Car Championship",
    0xb58: "Dream Car Championship",
    0xb59: "Dream Car Championship",
    0xb5a: "Dream Car Championship",
    0xb5b: "Dream Car Championship",
    0xb5c: "Dream Car Championship",
    0xb5d: "Dream Car Championship",
    0xb5e: "Dream Car Championship",
    0xb5f: "Dream Car Championship",
    0xb60: "Polyphony Digital Cup",
    0xb61: "Polyphony Digital Cup",
    0xb62: "Polyphony Digital Cup",
    0xb63: "Polyphony Digital Cup",
    0xb64: "Polyphony Digital Cup",
    0xb65: "Polyphony Digital Cup",
    0xb66: "Polyphony Digital Cup",
    0xb67: "Polyphony Digital Cup",
    0xb68: "Polyphony Digital Cup",
    0xb69: "Polyphony Digital Cup",
    0xb6a: "Polyphony Digital Cup",
    0xb6b: "Like the Wind",
    0xb6c: "Formula GT World Championship",
    0xb6d: "Formula GT World Championship",
    0xb6e: "Formula GT World Championship",
    0xb6f: "Formula GT World Championship",
    0xb70: "Formula GT World Championship",
    0xb71: "Formula GT World Championship",
    0xb72: "Formula GT World Championship",
    0xb73: "Formula GT World Championship",
    0xb74: "Formula GT World Championship",
    0xb75: "Formula GT World Championship",
    0xb76: "Formula GT World Championship",
    0xb77: "Formula GT World Championship",
    0xb78: "Formula GT World Championship",
    0xb79: "Formula GT World Championship",
    0xb7a: "Formula GT World Championship",
    0xb7b: "Formula GT World Championship",
    0xb7c: "Real Circuit Tours",
    0xb7d: "Real Circuit Tours",
    0xb7e: "Real Circuit Tours",
    0xb7f: "Real Circuit Tours",
    0xb80: "Real Circuit Tours",
    0xb81: "Real Circuit Tours",
    0xb82: "Real Circuit Tours",
    0xb83: "Real Circuit Tours",
    0xb84: "Premium Sports Lounge",
    0xb85: "Premium Sports Lounge",
    0xb86: "Premium Sports Lounge",
    0xb87: "Premium Sports Lounge",
    0xb88: "Premium Sports Lounge",
    0xb89: "Road-going Formula",
    0xb8a: "Road-going Formula",
    0xb8b: "Road-going Formula",
    0xb8c: "Road-going Formula",
    0xb8d: "Road-going Formula",
    0xb8e: "Grand Valley 300 km",
    0xb8f: "Laguna Seca 200 miles",
    0xb90: "Roadster 4h Endurance",
    0xb91: "Tokyo R246 300 km",
    0xb92: "Super Speedway 150 miles",
    0xb93: "Nurburgring 24h Endurance",
    0xb94: "Nurburgring 4h Endurance",
    0xb95: "Suzuka 1000 km",
    0xb96: "Motegi 8h Endurance",
    0xb97: "Tsukuba 9h Endurance",
    0xb98: "Circuit de la Sarthe 24h I",
    0xb99: "Circuit de la Sarthe 24h II",
    0xb9a: "Fuji 1000 km",
    0xb9b: "Infineon World Sports Car Race",
    0xb9c: "El Capitan 200 miles",
    0xb9d: "New York 200 mile race",
    0xb9e: "Pan Euro Championship",
    0xb9f: "Pan Euro Championship",
    0xba0: "Pan Euro Championship",
    0xba1: "Pan Euro Championship",
    0xba2: "Pan Euro Championship",
    0xba3: "Pan Euro Championship",
    0xba4: "British GT Series",
    0xba5: "British GT Series",
    0xba6: "British GT Series",
    0xba7: "British GT Series",
    0xba8: "British GT Series",
    0xba9: "British GT Series",
    0xbaa: "British Lightweight Series",
    0xbab: "British Lightweight Series",
    0xbac: "British Lightweight Series",
    0xbad: "Deutsche Touring Car Meistershaft",
    0xbae: "Deutsche Touring Car Meistershaft",
    0xbaf: "Deutsche Touring Car Meistershaft",
    0xbb0: "Deutsche Touring Car Meistershaft",
    0xbb1: "Deutsche Touring Car Meistershaft",
    0xbb2: "Deutsche Touring Car Meistershaft",
    0xbb3: "La Festa Italiano",
    0xbb4: "La Festa Italiano",
    0xbb5: "La Festa Italiano",
    0xbb6: "Tous France Championnat",
    0xbb7: "Tous France Championnat",
    0xbb8: "Tous France Championnat",
    0xbb9: "Tous France Championnat",
    0xbba: "Tous France Championnat",
    0xbbb: "Tous France Championnat",
    0xbbc: "Europe Classic Car League",
    0xbbd: "Europe Classic Car League",
    0xbbe: "Europe Classic Car League",
    0xbbf: "Europe Classic Car League",
    0xbc0: "Europe Classic Car League",
    0xbc1: "Europe Classic Car League",
    0xbc2: "Euro Hot Hatch League",
    0xbc3: "Euro Hot Hatch League",
    0xbc4: "Euro Hot Hatch League",
    0xbc5: "Euro Hot Hatch League",
    0xbc6: "Euro Hot Hatch League",
    0xbc7: "Euro Hot Hatch League",
    0xbc8: "1000 miles !",
    0xbc9: "1000 miles !",
    0xbca: "1000 miles !",
    0xbcb: "1000 miles !",
    0xbcc: "1000 miles !",
    0xbcd: "Schwarzwald Liga A",
    0xbce: "Schwarzwald Liga A",
    0xbcf: "Schwarzwald Liga A",
    0xbd0: "Schwarzwald Liga B",
    0xbd1: "Schwarzwald Liga B",
    0xbd2: "Schwarzwald Liga B",
    0xbd3: "Schwarzwald Liga B",
    0xbd4: "Schwarzwald Liga B",
    0xbd5: "All American Championship",
    0xbd6: "All American Championship",
    0xbd7: "All American Championship",
    0xbd8: "All American Championship",
    0xbd9: "All American Championship",
    0xbda: "All American Championship",
    0xbdb: "Stars and Stripes",
    0xbdc: "Stars and Stripes",
    0xbdd: "Stars and Stripes",
    0xbde: "Muscle Car Competition",
    0xbdf: "Muscle Car Competition",
    0xbe0: "Muscle Car Competition",
    0xbe1: "Old Muscle Car Competition",
    0xbe2: "Old Muscle Car Competition",
    0xbe3: "Old Muscle Car Competition",
    0xbe4: "Japan Championship",
    0xbe5: "Japan Championship",
    0xbe6: "Japan Championship",
    0xbe7: "Japan Championship",
    0xbe8: "Japan Championship",
    0xbe9: "Japan Championship",
    0xbea: "All Japan GT Championship",
    0xbeb: "All Japan GT Championship",
    0xbec: "All Japan GT Championship",
    0xbed: "All Japan GT Championship",
    0xbee: "All Japan GT Championship",
    0xbef: "All Japan GT Championship",
    0xbf0: "All Japan GT Championship",
    0xbf1: "All Japan GT Championship",
    0xbf2: "All Japan GT Championship",
    0xbf3: "All Japan GT Championship",
    0xbf4: "All Japan GT Championship",
    0xbf5: "Japanese 70's Classics",
    0xbf6: "Japanese 70's Classics",
    0xbf7: "Japanese 70's Classics",
    0xbf8: "Japanese 70's Classics",
    0xbf9: "Japanese 70's Classics",
    0xbfa: "Japanese 80's Festival",
    0xbfb: "Japanese 80's Festival",
    0xbfc: "Japanese 80's Festival",
    0xbfd: "Japanese 80's Festival",
    0xbfe: "Japanese 80's Festival",
    0xbff: "Japanese 90's Challenge",
    0xc00: "Japanese 90's Challenge",
    0xc01: "Japanese 90's Challenge",
    0xc02: "Japanese 90's Challenge",
    0xc03: "Japanese 90's Challenge",
    0xc04: "Japanese Compact Cup",
    0xc05: "Japanese Compact Cup",
    0xc06: "Japanese Compact Cup",
    0xc07: "Japanese Compact Cup",
    0xc08: "Japanese Compact Cup",
    0xc09: "Japanese Compact Cup",
    0xc0a: "GTA Cup",
    0xc0b: "GTA Cup",
    0xc0c: "GTA Cup",
    0xc0d: "Aston Martin Festival",
    0xc0e: "Aston Martin Festival",
    0xc0f: "Aston Martin Festival",
    0xc10: "Elise Trophy",
    0xc11: "Elise Trophy",
    0xc12: "Elise Trophy",
    0xc13: "Elise Trophy",
    0xc14: "Elise Trophy",
    0xc15: "Elise Trophy",
    0xc16: "Lotus Classics",
    0xc17: "Lotus Classics",
    0xc18: "Lotus Classics",
    0xc19: "Lotus Classics",
    0xc1a: "Lotus Classics",
    0xc1b: "Lotus Classics",
    0xc1c: "MG Festival",
    0xc1d: "MG Festival",
    0xc1e: "MG Festival",
    0xc1f: "MG Festival",
    0xc20: "MG Festival",
    0xc21: "Spitfire Cup",
    0xc22: "Spitfire Cup",
    0xc23: "Spitfire Cup",
    0xc24: "Spitfire Cup",
    0xc25: "Spitfire Cup",
    0xc26: "Blackpool Racers",
    0xc27: "Blackpool Racers",
    0xc28: "Blackpool Racers",
    0xc29: "Blackpool Racers",
    0xc2a: "Blackpool Racers",
    0xc2b: "Tourist Trophy",
    0xc2c: "Tourist Trophy",
    0xc2d: "Tourist Trophy",
    0xc2e: "Tourist Trophy",
    0xc2f: "A3 Cup",
    0xc30: "A3 Cup",
    0xc31: "A3 Cup",
    0xc32: "1 Series Trophy",
    0xc33: "1 Series Trophy",
    0xc34: "1 Series Trophy",
    0xc35: "Club 'M'",
    0xc36: "Club 'M'",
    0xc37: "Club 'M'",
    0xc38: "Club 'M'",
    0xc39: "Club 'M'",
    0xc3a: "Club 'M'",
    0xc3b: "Legends of the Silver Arrow",
    0xc3c: "Legends of the Silver Arrow",
    0xc3d: "Legends of the Silver Arrow",
    0xc3e: "SL Challenge",
    0xc3f: "SL Challenge",
    0xc40: "SL Challenge",
    0xc41: "Mini Sports Meeting",
    0xc42: "Mini Sports Meeting",
    0xc43: "Mini Sports Meeting",
    0xc44: "Mini Sports Meeting",
    0xc45: "Mini Sports Meeting",
    0xc46: "Speedster Trophy",
    0xc47: "Speedster Trophy",
    0xc48: "Speedster Trophy",
    0xc49: "Speedster Trophy",
    0xc4a: "Speedster Trophy",
    0xc4b: "Beetle Cup",
    0xc4c: "Beetle Cup",
    0xc4d: "Beetle Cup",
    0xc4e: "Beetle Cup",
    0xc4f: "Beetle Cup",
    0xc50: "Beetle Cup",
    0xc51: "Lupo Cup",
    0xc52: "Lupo Cup",
    0xc53: "Lupo Cup",
    0xc54: "Lupo Cup",
    0xc55: "Lupo Cup",
    0xc56: "Lupo Cup",
    0xc57: "GTi Cup",
    0xc58: "GTi Cup",
    0xc59: "GTi Cup",
    0xc5a: "GTi Cup",
    0xc5b: "GTi Cup",
    0xc5c: "Corvette Festival",
    0xc5d: "Corvette Festival",
    0xc5e: "Corvette Festival",
    0xc5f: "Corvette Festival",
    0xc60: "Corvette Festival",
    0xc61: "Camaro Meeting",
    0xc62: "Camaro Meeting",
    0xc63: "Camaro Meeting",
    0xc64: "Crossfire Trophy",
    0xc65: "Crossfire Trophy",
    0xc66: "Crossfire Trophy",
    0xc67: "Saleen S7 Club",
    0xc68: "Saleen S7 Club",
    0xc69: "Saleen S7 Club",
    0xc6a: "Saleen S7 Club",
    0xc6b: "Saleen S7 Club",
    0xc6c: "Shelby Cobra Cup",
    0xc6d: "Shelby Cobra Cup",
    0xc6e: "Shelby Cobra Cup",
    0xc6f: "Shelby Cobra Cup",
    0xc70: "Shelby Cobra Cup",
    0xc71: "2HP - 2CV Classics",
    0xc72: "2HP - 2CV Classics",
    0xc73: "2HP - 2CV Classics",
    0xc74: "2HP - 2CV Classics",
    0xc75: "2HP - 2CV Classics",
    0xc76: "2HP - 2CV Classics",
    0xc77: "206 Cup",
    0xc78: "206 Cup",
    0xc79: "206 Cup",
    0xc7a: "206 Cup",
    0xc7b: "206 Cup",
    0xc7c: "Clio Trophy",
    0xc7d: "Clio Trophy",
    0xc7e: "Clio Trophy",
    0xc7f: "Clio Trophy",
    0xc80: "Clio Trophy",
    0xc81: "Clio Trophy",
    0xc82: "Megane Cup",
    0xc83: "Megane Cup",
    0xc84: "Megane Cup",
    0xc85: "Megane Cup",
    0xc86: "Megane Cup",
    0xc87: "Megane Cup",
    0xc88: "Renault Alpine Cup",
    0xc89: "Renault Alpine Cup",
    0xc8a: "Renault Alpine Cup",
    0xc8b: "Renault Alpine Cup",
    0xc8c: "Renault Alpine Cup",
    0xc8d: "Renault Alpine Cup",
    0xc8e: "Copen Race",
    0xc8f: "Copen Race",
    0xc90: "Copen Race",
    0xc91: "Midget II Race",
    0xc92: "Type R Meeting",
    0xc93: "Type R Meeting",
    0xc94: "Type R Meeting",
    0xc95: "Type R Meeting",
    0xc96: "Type R Meeting",
    0xc97: "Civic Race",
    0xc98: "Civic Race",
    0xc99: "Civic Race",
    0xc9a: "Civic Race",
    0xc9b: "Civic Race",
    0xc9c: "Isuzu Sports Classics",
    0xc9d: "Isuzu Sports Classics",
    0xc9e: "Isuzu Sports Classics",
    0xc9f: "Club 'RE'",
    0xca0: "Club 'RE'",
    0xca1: "Club 'RE'",
    0xca2: "Club 'RE'",
    0xca3: "Club 'RE'",
    0xca4: "NR-A Roadster Cup",
    0xca5: "NR-A Roadster Cup",
    0xca6: "NR-A Roadster Cup",
    0xca7: "NR-A Roadster Cup",
    0xca8: "NR-A Roadster Cup",
    0xca9: "NR-A Roadster Cup",
    0xcaa: "NR-A RX-8 Cup",
    0xcab: "NR-A RX-8 Cup",
    0xcac: "NR-A RX-8 Cup",
    0xcad: "NR-A RX-8 Cup",
    0xcae: "NR-A RX-8 Cup",
    0xcaf: "NR-A RX-8 Cup",
    0xcb0: "Mirage Cup",
    0xcb1: "Mirage Cup",
    0xcb2: "Mirage Cup",
    0xcb3: "Mirage Cup",
    0xcb4: "Mirage Cup",
    0xcb5: "Mirage Cup",
    0xcb6: "Evolution Meeting",
    0xcb7: "Evolution Meeting",
    0xcb8: "Evolution Meeting",
    0xcb9: "Race of the Red 'R' Emblem",
    0xcba: "Race of the Red 'R' Emblem",
    0xcbb: "Race of the Red 'R' Emblem",
    0xcbc: "Race of the Red 'R' Emblem",
    0xcbd: "Race of the Red 'R' Emblem",
    0xcbe: "Micra Brothers",
    0xcbf: "Micra Brothers",
    0xcc0: "Micra Brothers",
    0xcc1: "Silvia Sisters",
    0xcc2: "Silvia Sisters",
    0xcc3: "Silvia Sisters",
    0xcc4: "Club 'Z'",
    0xcc5: "Club 'Z'",
    0xcc6: "Club 'Z'",
    0xcc7: "Club 'Z'",
    0xcc8: "Club 'Z'",
    0xcc9: "Subaru 360 Race",
    0xcca: "Stars of Pleiades",
    0xccb: "Stars of Pleiades",
    0xccc: "Stars of Pleiades",
    0xccd: "Stars of Pleiades",
    0xcce: "Stars of Pleiades",
    0xccf: "Stars of Pleiades",
    0xcd0: "Suzuki K-Car Cup",
    0xcd1: "Suzuki K-Car Cup",
    0xcd2: "Suzuki K-Car Cup",
    0xcd3: "Suzuki Concepts",
    0xcd4: "Suzuki Concepts",
    0xcd5: "Suzuki Concepts",
    0xcd6: "Altezza Race",
    0xcd7: "Altezza Race",
    0xcd8: "Altezza Race",
    0xcd9: "Altezza Race",
    0xcda: "Altezza Race",
    0xcdb: "Vitz Race",
    0xcdc: "Vitz Race",
    0xcdd: "Vitz Race",
    0xcde: "Vitz Race",
    0xcdf: "Vitz Race",
    0xce5: "Free Run",
    0xce8: "Family Cup",
    0xce9: "400m Speed Test",
    0xcea: "1000m Speed Test",
    0xceb: "Top Speed Test",
    0xcec: "400m Las Vegas Drag Strip",
    0xd37: "Umbria Rally (Easy)",
    0xd38: "Umbria Rally (Normal)",
    0xd39: "Umbria Rally (Hard)",
    0xd3a: "Umbria Rally (Easy)",
    0xd3b: "Umbria Rally (Normal)",
    0xd3c: "Umbria Rally (Hard)",
    0xd3d: "Capri Rally (Easy)",
    0xd3e: "Capri Rally (Normal)",
    0xd3f: "Capri Rally (Hard)",
    0xd40: "Capri Rally (Easy)",
    0xd41: "Capri Rally (Normal)",
    0xd42: "Capri Rally (Hard)",
    0xd43: "Grand Canyon Rally (Easy)",
    0xd44: "Grand Canyon Rally (Normal)",
    0xd45: "Grand Canyon Rally (Hard)",
    0xd46: "Grand Canyon Rally (Easy)",
    0xd47: "Grand Canyon Rally (Normal)",
    0xd48: "Grand Canyon Rally (Hard)",
    0xd49: "Whistler Ice Race (Easy)",
    0xd4a: "Whistler Ice Race (Normal)",
    0xd4b: "Whistler Ice Race (Hard)",
    0xd4c: "Whistler Ice Race (Easy)",
    0xd4d: "Whistler Ice Race (Normal)",
    0xd4e: "Whistler Ice Race (Hard)",
    0xd4f: "Chamonix Rally (Easy)",
    0xd50: "Chamonix Rally (Normal)",
    0xd51: "Chamonix Rally (Hard)",
    0xd52: "Chamonix Rally (Easy)",
    0xd53: "Chamonix Rally (Normal)",
    0xd54: "Chamonix Rally (Hard)",
    0xd55: "George V Rally (Easy)",
    0xd56: "George V Rally (Normal)",
    0xd57: "George V Rally (Hard)",
    0xd58: "George V Rally (Easy)",
    0xd59: "George V Rally (Normal)",
    0xd5a: "George V Rally (Hard)",
    0xd5b: "Swiss Alps Rally (Easy)",
    0xd5c: "Swiss Alps Rally (Normal)",
    0xd5d: "Swiss Alps Rally (Hard)",
    0xd5e: "Swiss Alps Rally (Easy)",
    0xd5f: "Swiss Alps Rally (Normal)",
    0xd60: "Swiss Alps Rally (Hard)",
    0xd61: "Tour of Tahiti (Easy)",
    0xd62: "Tour of Tahiti (Normal)",
    0xd63: "Tour of Tahiti (Hard)",
    0xd64: "Tour of Tahiti (Easy)",
    0xd65: "Tour of Tahiti (Normal)",
    0xd66: "Tour of Tahiti (Hard)",
    0xd67: "Tsukuba Wet Race (Easy)",
    0xd68: "Tsukuba Wet Race (Normal)",
    0xd69: "Tsukuba Wet Race (Hard)",
    0xd6d: "Yosemite Rally I (Easy)",
    0xd6e: "Yosemite Rally I (Normal)",
    0xd6f: "Yosemite Rally I (Hard)",
    0xd70: "Yosemite Rally I (Easy)",
    0xd71: "Yosemite Rally I (Normal)",
    0xd72: "Yosemite Rally I (Hard)",
    0xd73: "Yosemite Rally II (Easy)",
    0xd74: "Yosemite Rally II (Normal)",
    0xd75: "Yosemite Rally II (Hard)",
    0xd76: "Yosemite Rally II (Easy)",
    0xd77: "Yosemite Rally II (Normal)",
    0xd78: "Yosemite Rally II (Hard)",
    0xef9: "Acceleration and braking: 1",
    0xd82: "Acceleration and braking: 1",
    0xefa: "Acceleration and braking: 2",
    0xd83: "Acceleration and braking: 2",
    0xefb: "Basics of cornering: 1",
    0xd84: "Basics of cornering: 1",
    0xefc: "Basics of cornering: 2",
    0xd85: "Basics of cornering: 2",
    0xefd: "1 Lap Guide Run (Tsukuba)",
    0xd86: "1 Lap Guide Run (Tsukuba)",
    0xefe: "Acceleration and braking: 3",
    0xd87: "Acceleration and braking: 3",
    0xeff: "Acceleration and braking: 4",
    0xd88: "Acceleration and braking: 4",
    0xf00: "Basics of cornering: 3",
    0xd89: "Basics of cornering: 3",
    0xf01: "Basics of cornering: 4",
    0xd8a: "Basics of cornering: 4",
    0xf02: "1 Lap Guide Run (Laguna Seca)",
    0xd8b: "1 Lap Guide Run (Laguna Seca)",
    0xf03: "Basics of Dirt driving: 1",
    0xd8c: "Basics of Dirt driving: 1",
    0xf04: "Basics of Dirt driving: 2",
    0xd8d: "Basics of Dirt driving: 2",
    0xf05: "Basics of cornering: 5",
    0xd8e: "Basics of cornering: 5",
    0xf06: "Basics of cornering: 6",
    0xd8f: "Basics of cornering: 6",
    0xf07: "1 Lap Guide Run (Infineon Raceway)",
    0xd90: "1 Lap Guide Run (Infineon Raceway)",
    0xf08: "Graduation Test",
    0xd91: "Graduation Test",
    0xf09: "Complex corners: Beginner 1",
    0xd92: "Complex corners: Beginner 1",
    0xf0a: "Complex corners: Beginner 2",
    0xd93: "Complex corners: Beginner 2",
    0xf0b: "Tackling high speed corners: 1",
    0xd94: "Tackling high speed corners: 1",
    0xf0c: "Tackling high speed corners: 2",
    0xd95: "Tackling high speed corners: 2",
    0xf0d: "1 Lap Guide Run (Grand Valley East)",
    0xd96: "1 Lap Guide Run (Grand Valley East)",
    0xf0e: "Complex corners: Intermediate 1",
    0xd97: "Complex corners: Intermediate 1",
    0xf0f: "Complex corners: Intermediate 2",
    0xd98: "Complex corners: Intermediate 2",
    0xf10: "Applied cornering: 1",
    0xd99: "Applied cornering: 1",
    0xf11: "Applied cornering: 2",
    0xd9a: "Applied cornering: 2",
    0xf12: "1 Lap Guide Run (Suzuka)",
    0xd9b: "1 Lap Guide Run (Suzuka)",
    0xf13: "Applied dirt driving: 1",
    0xd9c: "Applied dirt driving: 1",
    0xf14: "Applied dirt driving: 2",
    0xd9d: "Applied dirt driving: 2",
    0xf15: "Tackling blind corners: 1",
    0xd9e: "Tackling blind corners: 1",
    0xf16: "Tackling blind corners: 2",
    0xd9f: "Tackling blind corners: 2",
    0xf17: "1 Lap Guide Run (Trial Mountain)",
    0xda0: "1 Lap Guide Run (Trial Mountain)",
    0xf18: "Graduation Test",
    0xda1: "Graduation Test",
    0xf19: "Braking during turns: 1",
    0xda2: "Braking during turns: 1",
    0xf1a: "Braking during turns: 2",
    0xda3: "Braking during turns: 2",
    0xf1b: "Advanced level complex corners: 1",
    0xda4: "Advanced level complex corners: 1",
    0xf1c: "Advanced level complex corners: 2",
    0xda5: "Advanced level complex corners: 2",
    0xf1d: "1 Lap Guide Run (Costa di Amalfi)",
    0xda6: "1 Lap Guide Run (Costa di Amalfi)",
    0xf1e: "Cone Slalom 1",
    0xda7: "Cone Slalom 1",
    0xf1f: "Cone Slalom 2",
    0xda8: "Cone Slalom 2",
    0xf20: "City street guide: 1",
    0xda9: "City street guide: 1",
    0xf21: "City street guide: 2",
    0xdaa: "City street guide: 2",
    0xf22: "1 Lap Guide Run (Hong Kong)",
    0xdab: "1 Lap Guide Run (Hong Kong)",
    0xf23: "Competition dirt racing: 1",
    0xdac: "Competition dirt racing: 1",
    0xf24: "Driving on Snow: 1",
    0xdad: "Driving on Snow: 1",
    0xf25: "Tackling undulating S-bends",
    0xdae: "Tackling undulating S-bends",
    0xf26: "Tackling corner sequences over undulating surfaces",
    0xdaf: "Tackling corner sequences over undulating surfaces",
    0xf27: "1 Lap Guide Run (Citta di Aria)",
    0xdb0: "1 Lap Guide Run (Citta di Aria)",
    0xf28: "Graduation Test",
    0xdb1: "Graduation Test",
    0xf29: "Tackling complex corner sequences: 1",
    0xdb2: "Tackling complex corner sequences: 1",
    0xf2a: "Tackling complex corner sequences: 2",
    0xdb3: "Tackling complex corner sequences: 2",
    0xf2b: "Guide to Chicanes: 1",
    0xdb4: "Guide to Chicanes: 1",
    0xf2c: "Guide to Chicanes: 2",
    0xdb5: "Guide to Chicanes: 2",
    0xf2d: "1 Lap Guide Run (El Capitan)",
    0xdb6: "1 Lap Guide Run (El Capitan)",
    0xf2e: "Tackling complex corner sequences: 3",
    0xdb7: "Tackling complex corner sequences: 3",
    0xf2f: "Tackling complex corner sequences: 4",
    0xdb8: "Tackling complex corner sequences: 4",
    0xf30: "City street guide: 3",
    0xdb9: "City street guide: 3",
    0xf31: "City street guide: 4",
    0xdba: "City street guide: 4",
    0xf32: "1 Lap Guide Run (Fuji Speedway 2005)",
    0xdbb: "1 Lap Guide Run (Fuji Speedway 2005)",
    0xf33: "Competition dirt racing: 2",
    0xdbc: "Competition dirt racing: 2",
    0xf34: "Driving on Snow: 2",
    0xdbd: "Driving on Snow: 2",
    0xf35: "Tackling complex corner sequences: 5",
    0xdbe: "Tackling complex corner sequences: 5",
    0xf36: "Tackling complex corner sequences: 6",
    0xdbf: "Tackling complex corner sequences: 6",
    0xf37: "1 Lap Guide Run (Nurburgring)",
    0xdc0: "1 Lap Guide Run (Nurburgring)",
    0xf38: "Graduation Test",
    0xdc1: "Graduation Test",
    0xf39: "1 Lap Time Trial (Twin Ring Motegi)",
    0xdc2: "1 Lap Time Trial (Twin Ring Motegi)",
    0xf3a: "1 Lap Time Trial (Citta di Aria)",
    0xdc3: "1 Lap Time Trial (Citta di Aria)",
    0xf3b: "1 Lap Time Trial (SS Route 5)",
    0xdc4: "1 Lap Time Trial (SS Route 5)",
    0xf3c: "1 Lap Time Trial (Costa di Amalfi)",
    0xdc5: "1 Lap Time Trial (Costa di Amalfi)",
    0xf3d: "1 Lap Time Trial (Seattle)",
    0xdc6: "1 Lap Time Trial (Seattle)",
    0xf3e: "1 Lap Time Trial (Ice Arena)",
    0xdc7: "1 Lap Time Trial (Ice Arena)",
    0xf3f: "1 Lap Time Trial (Trial Mountain)",
    0xdc8: "1 Lap Time Trial (Trial Mountain)",
    0xf40: "1 Lap Time Trial (Tokyo R246)",
    0xdc9: "1 Lap Time Trial (Tokyo R246)",
    0xf41: "1 Lap Time Trial (El Capitan)",
    0xdca: "1 Lap Time Trial (El Capitan)",
    0xf42: "1 Lap Time Trial (Grand Canyon)",
    0xdcb: "1 Lap Time Trial (Grand Canyon)",
    0xf43: "1 Lap Time Trial (Opera Paris)",
    0xdcc: "1 Lap Time Trial (Opera Paris)",
    0xf44: "1 Lap Time Trial (Suzuka Circuit)",
    0xdcd: "1 Lap Time Trial (Suzuka Circuit)",
    0xf45: "1 Lap Time Trial (Infineon Raceway)",
    0xdce: "1 Lap Time Trial (Infineon Raceway)",
    0xf46: "1 Lap Time Trial (Chamonix)",
    0xdcf: "1 Lap Time Trial (Chamonix)",
    0xf47: "1 Lap Time Trial (Circuit de la Sarthe)",
    0xdd0: "1 Lap Time Trial (Circuit de la Sarthe)",
    0xf48: "1 Lap Time Trial (Nurburgring)",
    0xdd1: "1 Lap Time Trial (Nurburgring)",
    0xf49: "Manoeuvre around the cones",
    0xe72: "Manoeuvre around the cones",
    0xf4a: "Knock over the cones laid out in a spiral",
    0xe73: "Knock over the cones laid out in a spiral",
    0xf4b: "Knock over the cones laid out in a spiral (2)",
    0xe74: "Knock over the cones laid out in a spiral (2)",
    0xf4c: "Cones - Gymkhana",
    0xe75: "Cones - Gymkhana",
    0xf4d: "Guide to cone maze",
    0xe76: "Guide to cone maze",
    0xf4e: "The Pass: Deep Forest Raceway",
    0xe81: "The Pass: Deep Forest Raceway",
    0xf4f: "The Pass: Grand Valley Speedway",
    0xe82: "The Pass: Grand Valley Speedway",
    0xf50: "The Pass: Cote d'Azur",
    0xe83: "The Pass: Cote d'Azur",
    0xf51: "The Pass: Seattle Circuit",
    0xe84: "The Pass: Seattle Circuit",
    0xf52: "The Pass: High-speed Ring",
    0xe85: "The Pass: High-speed Ring",
    0xf53: "The Pass: Tsukuba Circuit",
    0xe86: "The Pass: Tsukuba Circuit",
    0xf54: "The Pass: Midfield Raceway",
    0xe87: "The Pass: Midfield Raceway",
    0xf55: "The Pass: Trial Mountain",
    0xe88: "The Pass: Trial Mountain",
    0xf56: "The Pass: Twin Ring Motegi",
    0xe89: "The Pass: Twin Ring Motegi",
    0xf57: "The Pass: Circuit de la Sarthe",
    0xe8a: "The Pass: Circuit de la Sarthe",
    0xf58: "3 Lap Battle: New York City Street Course",
    0xe8b: "3 Lap Battle: New York City Street Course",
    0xf59: "3 Lap Battle: Laguna Seca Raceway",
    0xe8c: "3 Lap Battle: Laguna Seca Raceway",
    0xf5a: "3 Lap Battle: Opera Paris Course",
    0xe8d: "3 Lap Battle: Opera Paris Course",
    0xf5b: "3 Lap Battle: Seattle Circuit",
    0xe8e: "3 Lap Battle: Seattle Circuit",
    0xf5c: "3 Lap Battle: Cote d'Azur",
    0xe8f: "3 Lap Battle: Cote d'Azur",
    0xf5d: "3 Lap Battle: Suzuka Circuit",
    0xe90: "3 Lap Battle: Suzuka Circuit",
    0xf5e: "3 Lap Battle: Infineon Raceway",
    0xe91: "3 Lap Battle: Infineon Raceway",
    0xf5f: "3 Lap Battle: Circuit de la Sarthe 2",
    0xe92: "3 Lap Battle: Circuit de la Sarthe 2",
    0xf60: "3 Lap Battle: Suzuka Circuit East Course",
    0xe93: "3 Lap Battle: Suzuka Circuit East Course",
    0xf61: "3 Lap Battle: Tsukuba Circuit",
    0xe94: "3 Lap Battle: Tsukuba Circuit",
    0xf62: "Slipstream Battle 1: Nissan Cube",
    0xe95: "Slipstream Battle 1: Nissan Cube",
    0xf63: "Slipstream Battle 2: Honda Odyssey",
    0xe96: "Slipstream Battle 2: Honda Odyssey",
    0xf64: "Slipstream Battle 3: Nissan Skyline GT-R",
    0xe97: "Slipstream Battle 3: Nissan Skyline GT-R",
    0xf65: "Slipstream Battle 4: Amuse S2000 GT1",
    0xe98: "Slipstream Battle 4: Amuse S2000 GT1",
    0xf66: "One Lap Magic: A showdown between Z's old and new!",
    0xe99: "One Lap Magic: A showdown between Z's old and new!",
    0xf67: "One Lap Magic: A showdown between Hondas old and new!",
    0xe9a: "One Lap Magic: A showdown between Hondas old and new!",
    0xf68: "One Lap Magic: A showdown between Mazdas old and new!",
    0xe9b: "One Lap Magic: A showdown between Mazdas old and new!",
    0xf69: "One Lap Magic: A showdown between Celicas old and new!",
    0xe9c: "One Lap Magic: A showdown between Celicas old and new!",
    0xf6a: "One Lap Magic: A showdown between Chevrolets old and new!",
    0xe9d: "One Lap Magic: A showdown between Chevrolets old and new!",
    0xf6b: "One Lap Magic: A showdown between Subarus old and new!",
    0xe9e: "One Lap Magic: A showdown between Subarus old and new!",
    0xf6c: "One Lap Magic: A showdown between Lotuses old and new!",
    0xe9f: "One Lap Magic: A showdown between Lotuses old and new!",
    0xf6d: "One Lap Magic: A showdown between Fords old and new!",
    0xea0: "One Lap Magic: A showdown between Fords old and new!",
    0xf6e: "One Lap Magic: A showdown between GM's old and new!",
    0xea1: "One Lap Magic: A showdown between GM's old and new!",
    0xf6f: "One Lap Magic: A showdown between Mercedes Benz's old and new!",
    0xea2: "One Lap Magic: A showdown between Mercedes Benz's old and new!"
}

carChallenges = [
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "A-B-C of Kei Cars: Letter A",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2B6
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "A-B-C of Kei Cars: Letter B",
        "description": "any of Honda Beat cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x89,
            0x254,
            0x255
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "A-B-C of Kei Cars: Letter C",
        "description": "any of Suzuki Cappuccino cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x30B,
            0x1B3
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Japanese Wagons: Legacy",
        "description": "any of Subaru Legacy Touring wagons",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x167,
            0x76,
            0x7D,
            0x7A
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Japanese Wagons: Nissan Stagea",
        "description": "any of Nissan Stagea wagons",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2D6,
            0x2D7
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Japanese Wagons: Legnum",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2FD
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Aston Martin Collection: DB7",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x1BB
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Aston Martin Collection: DB9",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x3AF
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Aston Martin Collection: Vantage",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x326
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Aston Martin Collection: Vanquish",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x31E
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Corvette Collection: C1",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x17C
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Corvette Collection: C2",
        "description": "any of Chevrolet Corvette C2 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x332,
            0x324
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Corvette Collection: C3",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x29
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Corvette Collection: C4",
        "description": "any of Chevrolet Corvette C4 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x28,
            0x3AE
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Corvette Collection: C5",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x1B8
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 5,
        "name": "Jaguar Collection: E-Type",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x256
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Jaguar Collection: S-Type",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x151
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Jaguar Collection: XJ220",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x21F
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Jaguar Collection: XKR",
        "description": "any of Jaguar XKR cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x220,
            0x153
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Honda Type-R: Civic (EK)",
        "description": "any of Honda Civic (EK) Type-R cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x335,
            0xCC,
            0xD5
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Honda Type-R: Integra (DC2)",
        "description": "any of Honda Integra (DC2) Type-R cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2EE,
            0x2B0,
            0xCB,
            0x2B1,
            0x347
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Honda Type-R: NSX of 92",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x125
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "Isuzu Sport Classics: 117",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x15
        ],
        "trackIds": [],
        "eventStringIds": [
            "jp_isuzu"
        ],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "Isuzu Sport Classics: Bellett",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2B5
        ],
        "trackIds": [],
        "eventStringIds": [
            "jp_isuzu"
        ],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "Isuzu Sport Classics: Piazza",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x5F
        ],
        "trackIds": [],
        "eventStringIds": [
            "jp_isuzu"
        ],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "RX Collection: RX-7 FC",
        "description": "any of Mazda RX-7 FC cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0xC2,
            0x3EB,
            0x3EC,
            0x3ED,
            0x2B9,
            0x176,
            0x12B
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "RX Collection: RX-7 FD",
        "description": "any of Mazda RX-7 FD road (!) cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x3C7,
            0x3C8,
            0x3C9,
            0x3CA,
            0x3CC,
            0x3CD,
            0x3CE,
            0x3CF,
            0xCD,
            0x3EE,
            0x3EF,
            0x1FC,
            0x3F1,
            0x3F0,
            0x396,
            0x1FD,
            0x3CB,
            0x3F2,
            0x3F3,
            0x3F4,
            0x3F5,
            0x1FE
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "RX Collection: RX-8",
        "description": "any of Mazda RX-8 road (!) cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2B8,
            0x1FF,
            0x4C,
            0x257,
            0xCE
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Eclipse Collection: 2nd gen",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x63
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Eclipse Collection: 3rd gen",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x99
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Eclipse Collection: 4th gen",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x435
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Lancer Collection: 1600 GSR",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x96
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Lancer Collection: 1800 GSR",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2BC
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Lancer Collection: Evo I",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x97
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Lancer Collection: Evo II",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x3C5
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Lancer Collection: Evo III",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x3A3
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Lancer Collection: Evo IV",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x12D
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Lancer Collection: Evo V - GT 2 0 0 4",
        "description": "",
        "fullDescription": "Let it loose on DANDELION YELLOW MITSUBISHI LANCER EVOLUTION V GSR `98 and earn atleast 30 A-Spec points in Arcade Race on Seattle Circuit (Normal) with 10 or more laps set. Listen to Daiki Kasho - Mirage on repeat for authentic experience.",
        "points": 3,
        "carIds": [
            0xD3
        ],
        "trackIds": [
            0x64
        ],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": 10,
        "colorId": 0
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Lancer Collection: Evo VI",
        "description": "any of Mitsubishi Lancer Evolution VI road (!) cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0xE9,
            0x1CC,
            0x12E,
            0x2BD,
            0x1CB
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Lancer Collection: Evo VII",
        "description": "any of Mitsubishi Lancer Evolution VII cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x3C,
            0x1CD,
            0x1CE
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Lancer Collection: Evo VIII",
        "description": "any of Mitsubishi Lancer Evolution VIII cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x3E,
            0x2BE,
            0x31F
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Skyline Collection: The Prince",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2D5
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Skyline Collection: The Prince II",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2CA
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Skyline Collection: 2000 GT-B",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x39C
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Skyline Collection: GT-R Beginnings",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x345
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Skyline Collection: Kenmeri",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x344
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Skyline Collection: R30",
        "description": "any of Nissan Skyline R30 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x163,
            0x179
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Skyline Collection: R31",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x66
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Skyline Collection: R32",
        "description": "any of Nissan Skyline R32 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x15F,
            0x38A,
            0x38B,
            0x38C,
            0x38D,
            0x305,
            0x38E,
            0x390,
            0x134,
            0x38F,
            0x3AC
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Skyline Collection: R33",
        "description": "any of Nissan Skyline R33 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2FE,
            0x1E1,
            0x391,
            0x392,
            0x393,
            0x394,
            0x2D1,
            0x2D2,
            0x1E9,
            0x395
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Skyline Collection: R34",
        "description": "any of Nissan Skyline R34 road (!) cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x3AA,
            0x35F,
            0xEA,
            0x1EB,
            0x302,
            0x1ED,
            0x2CD,
            0x2CC,
            0x1EA,
            0x35B,
            0x2CF,
            0x2D0,
            0x1EC,
            0x1EE,
            0x2D3,
            0xD2,
            0x2D4
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Fairlady Collection: Datsun",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2C2
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Fairlady Collection: 240ZG",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x117
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Fairlady Collection: 280Z",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2C3
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Fairlady Collection: Z31",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2C4
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Fairlady Collection: Z32",
        "description": "any of Nissan Fairlady Z32 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x360,
            0x2C5,
            0x222,
            0x223,
            0x22D,
            0x19
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Fairlady Collection: Z33",
        "description": "any of Nissan Fairlady Z33 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x364,
            0xD7,
            0x56,
            0xA0,
            0x359,
            0x371,
            0x411,
            0x41D,
            0x3BE,
            0x2C6,
            0x3D4,
            0xB9,
            0x116
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Silvia Collection: CSP311",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2C8
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Silvia Collection: S100",
        "description": "Nissan SILVIA 240RS (S100) `83 or it's rally variant",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2C9,
            0x65
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Silvia Collection: S12",
        "description": "Nissan 200SX `96 or SILEIGHTY `98",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x25F,
            0x68
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Silvia Collection: S13",
        "description": "any of Nissan Silvia S13 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x4D,
            0x133,
            0x397,
            0x398
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Silvia Collection: S14",
        "description": "any of Nissan Silvia S14 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x1E2,
            0x343,
            0x4E,
            0x399,
            0x39A,
            0x283,
            0x284
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Silvia Collection: S15",
        "description": "any of Nissan Silvia S15 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x200,
            0x39B,
            0x20E,
            0xB8,
            0x334
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "RUF Collection: 3400S",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x142
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "RUF Collection: CTR2",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x309
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "RUF Collection: RGT",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0xBD
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "arcadeTimeTrial",
        "target": 485000,
        "name": "RUF Collection: Yellowbird's Daring Flight",
        "description": "",
        "fullDescription": "Arcade Time Trial, RUF CTR \"Yellow Bird\" `87, Sports Hard tires, no driving aids, manual transimission, no quick tune. Do a clean lap on Nurburgring Nordschleife and beat the time of 8:05'000, originally set by Stefan Roser.",
        "points": 25,
        "carIds": [
            0x259
        ],
        "trackIds": [
            0x41
        ],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "sh",
        "gearbox": "manual",
        "aid": "none",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Initial D: Stage GT4",
        "description": "",
        "fullDescription": "Earn atleast 10 A-Spec points while driving Toyota SPRINTER TRUENO GT-APEX (AE86) Shuichi Shigeno Version `00 on George Paris track (any direction).",
        "points": 5,
        "carIds": [
            0x159
        ],
        "trackIds": [
            0x8,
            0x8b
        ],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "MR2 Collection: W10",
        "description": "any of Toyota MR2 `86 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x34A,
            0x6D
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "none",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "MR2 Collection: W20",
        "description": "any of Toyota MR2 `97 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x30F,
            0xCF
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "none",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "MR2 Collection: W30",
        "description": "any of Toyota MR-S cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x40C,
            0x40A,
            0xB7,
            0x417,
            0x418
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "none",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Celestial Collection: TA22",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0xA7
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Celestial Collection: XX",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x6B
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Celestial Collection: T160",
        "description": "any of Toyota CELICA ST162 or ST165 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x6C,
            0x349
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Celestial Collection: T180",
        "description": "any of Toyota CELICA ST183 or ST185 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x32B,
            0x6F,
            0x18D
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Celestial Collection: T200",
        "description": "any of Toyota CELICA ST202 or ST205 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x23,
            0x30C,
            0x30D
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Celestial Collection: T230",
        "description": "any of Toyota CELICA ZZT231 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x1B4,
            0xDE,
            0xC1,
            0x24B
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "TVR Collection: Tuscan 6",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0xBB
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 5,
        "name": "TVR Collection: Cerbera 12",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x156
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "TVR Collection: Cerbera 6",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0xB0
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "arcadeTimeTrial",
        "target": 84000,
        "name": "TVR Collection: Griffith",
        "description": "",
        "fullDescription": "Arcade Time Trial, TVR Griffith 500 `94, Sports Soft tires, power +20%, weight 0%. Let's recreate original Gran Turismo IA-5 test on Autumn Ring (Normal), can you beat bronze time of 1:24'000 with more realistic physics?",
        "points": 10,
        "carIds": [
            0x311
        ],
        "trackIds": [
            0x6b
        ],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "ss",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 20,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "TVR Collection: T350C",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x16B
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "TVR Collection: Tamora 2",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x247
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "TVR Collection: V8S",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x32E
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "DTM: Audi A3",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x16D
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "DTM: Audi A4",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x36D
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "DTM: Audi TT-R",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x141
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "DTM: BMW 320i",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x181
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "DTM: Mercedes 190E Evo II",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x16A
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "DTM: Mercedes CLK",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x15C
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "DTM: Opel Astra",
        "description": "Opel/Vauxhall Astra Super Touring Car `00",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x219,
            0x143
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "DTM: Opel Calibra",
        "description": "Opel/Vauxhall Calibra Super Touring Car `94",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x21A,
            0x16F
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "JGTC Trio: Toyota Supra",
        "description": "any of Toyota Supra JGTC cars",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0xB5,
            0xE1,
            0xE2,
            0xE4,
            0xE5,
            0xA9
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "JGTC Trio: Nissan GT-R",
        "description": "any of Nissan GT-R JGTC cars",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x1B1,
            0x1D6,
            0x1E5,
            0xB6,
            0x191,
            0xA1,
            0x21E
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "JGTC Trio: Honda NSX",
        "description": "any of Honda NSX JGTC cars",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x8A,
            0x8B,
            0x8C,
            0x8D,
            0x8E,
            0x8F
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Legend of Le Mans: Ford GT40",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x13C
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "arcadeTimeTrial",
        "target": 195040,
        "name": "Le Mans Prototypes: Sauber C9",
        "description": "",
        "fullDescription": "Arcade Time Trial, Sauber Mercedes C9 Race Car `89, Racing Hard tires, no quick tune. Do a clean lap on Circuit de la Sarthe 2 and beat the time of 3:15'040, originally set by Team Sauber Mercedes at Le Mans 24hrs 1989.",
        "points": 5,
        "carIds": [
            0x3E6
        ],
        "trackIds": [
            0x99
        ],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "rh",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 40,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Le Mans Prototypes: Toyota GT-ONE",
        "description": "Toyota GT-ONE Race Car (TS020) `99",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x74,
            0x2E8
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Le Mans Prototypes: Peugeot 905",
        "description": "Peugeot 905 Race Car `92",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x429,
            0x42A
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Le Mans Prototypes: Jaguar XJR-9",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x42B
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Le Mans Prototypes: Toyota 88C",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x2E2
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Le Mans Prototypes: Mazda 787B",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x128
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Le Mans Prototypes: BMW V12 LMR",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x182
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Le Mans Prototypes: Nissan",
        "description": "Nissan R89C Race Car `89 or R92CP `92",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x178,
            0x3BA
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Le Mans Prototypes: Courage C60",
        "description": "any of Pescarolo Courage C60 race cars",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x14A,
            0x11A
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Le Mans Prototypes: Audi R8",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x3B9
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Le Mans Prototypes: Bentley Speed 8",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x3B0
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "World Rally Collection: Impreza",
        "description": "",
        "fullDescription": "In any Dirt or Snow rally event of Special Conditions hall, earn 50 A-Spec points or more in any of Subaru Impreza Rally cars.",
        "points": 2,
        "carIds": [
            0x1C6,
            0x38,
            0x79,
            0x1C7
        ],
        "trackIds": [],
        "eventStringIds": [
            "rh_capri_e",
            "rh_capri_n",
            "rh_capri_h",
            "rh_grandcanyon_e",
            "rh_grandcanyon_n",
            "rh_grandcanyon_h",
            "rh_icerace_e",
            "rh_icerace_n",
            "rh_icerace_h",
            "rh_nursnow_e",
            "rh_nursnow_n",
            "rh_nursnow_h",
            "rh_smtsouth_e",
            "rh_smtsouth_n",
            "rh_smtsouth_h",
            "rh_tahiti_maze_e",
            "rh_tahiti_maze_n",
            "rh_tahiti_maze_h",
            "rh_yosemite_dirt_e",
            "rh_yosemite_dirt_n",
            "rh_yosemite_dirt_h",
            "rh_yosemite_dirt_short_e",
            "rh_yosemite_dirt_short_n",
            "rh_yosemite_dirt_short_h"
        ],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "World Rally Collection: Lancer",
        "description": "",
        "fullDescription": "In any Dirt or Snow rally event of Special Conditions hall, earn 50 A-Spec points or more in any of Mitsubishi Lancer Rally cars.",
        "points": 2,
        "carIds": [
            0x37E,
            0x3B6,
            0xDF,
            0x1BF
        ],
        "trackIds": [],
        "eventStringIds": [
            "rh_capri_e",
            "rh_capri_n",
            "rh_capri_h",
            "rh_grandcanyon_e",
            "rh_grandcanyon_n",
            "rh_grandcanyon_h",
            "rh_icerace_e",
            "rh_icerace_n",
            "rh_icerace_h",
            "rh_nursnow_e",
            "rh_nursnow_n",
            "rh_nursnow_h",
            "rh_smtsouth_e",
            "rh_smtsouth_n",
            "rh_smtsouth_h",
            "rh_tahiti_maze_e",
            "rh_tahiti_maze_n",
            "rh_tahiti_maze_h",
            "rh_yosemite_dirt_e",
            "rh_yosemite_dirt_n",
            "rh_yosemite_dirt_h",
            "rh_yosemite_dirt_short_e",
            "rh_yosemite_dirt_short_n",
            "rh_yosemite_dirt_short_h"
        ],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "World Rally Collection: Toyota",
        "description": "",
        "fullDescription": "In any Dirt or Snow rally event of Special Conditions hall, earn 50 A-Spec points or more in any of Toyota Rally cars (excluding raid one).",
        "points": 2,
        "carIds": [
            0x18D,
            0x30D,
            0x30E
        ],
        "trackIds": [],
        "eventStringIds": [
            "rh_capri_e",
            "rh_capri_n",
            "rh_capri_h",
            "rh_grandcanyon_e",
            "rh_grandcanyon_n",
            "rh_grandcanyon_h",
            "rh_icerace_e",
            "rh_icerace_n",
            "rh_icerace_h",
            "rh_nursnow_e",
            "rh_nursnow_n",
            "rh_nursnow_h",
            "rh_smtsouth_e",
            "rh_smtsouth_n",
            "rh_smtsouth_h",
            "rh_tahiti_maze_e",
            "rh_tahiti_maze_n",
            "rh_tahiti_maze_h",
            "rh_yosemite_dirt_e",
            "rh_yosemite_dirt_n",
            "rh_yosemite_dirt_h",
            "rh_yosemite_dirt_short_e",
            "rh_yosemite_dirt_short_n",
            "rh_yosemite_dirt_short_h"
        ],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "World Rally Collection: Ford",
        "description": "",
        "fullDescription": "In any Dirt or Snow rally event of Special Conditions hall, earn 50 A-Spec points or more in Ford Escort or Ford Focus Rally car.",
        "points": 2,
        "carIds": [
            0x2F5,
            0xD9
        ],
        "trackIds": [],
        "eventStringIds": [
            "rh_capri_e",
            "rh_capri_n",
            "rh_capri_h",
            "rh_grandcanyon_e",
            "rh_grandcanyon_n",
            "rh_grandcanyon_h",
            "rh_icerace_e",
            "rh_icerace_n",
            "rh_icerace_h",
            "rh_nursnow_e",
            "rh_nursnow_n",
            "rh_nursnow_h",
            "rh_smtsouth_e",
            "rh_smtsouth_n",
            "rh_smtsouth_h",
            "rh_tahiti_maze_e",
            "rh_tahiti_maze_n",
            "rh_tahiti_maze_h",
            "rh_yosemite_dirt_e",
            "rh_yosemite_dirt_n",
            "rh_yosemite_dirt_h",
            "rh_yosemite_dirt_short_e",
            "rh_yosemite_dirt_short_n",
            "rh_yosemite_dirt_short_h"
        ],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "World Rally Collection: Peugeot 206",
        "description": "",
        "fullDescription": "In any Dirt or Snow rally event of Special Conditions hall, earn 50 A-Spec points or more in Peugeot 206 Rally Car `99.",
        "points": 2,
        "carIds": [
            0x110,
            0x261
        ],
        "trackIds": [],
        "eventStringIds": [
            "rh_capri_e",
            "rh_capri_n",
            "rh_capri_h",
            "rh_grandcanyon_e",
            "rh_grandcanyon_n",
            "rh_grandcanyon_h",
            "rh_icerace_e",
            "rh_icerace_n",
            "rh_icerace_h",
            "rh_nursnow_e",
            "rh_nursnow_n",
            "rh_nursnow_h",
            "rh_smtsouth_e",
            "rh_smtsouth_n",
            "rh_smtsouth_h",
            "rh_tahiti_maze_e",
            "rh_tahiti_maze_n",
            "rh_tahiti_maze_h",
            "rh_yosemite_dirt_e",
            "rh_yosemite_dirt_n",
            "rh_yosemite_dirt_h",
            "rh_yosemite_dirt_short_e",
            "rh_yosemite_dirt_short_n",
            "rh_yosemite_dirt_short_h"
        ],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "World Rally Collection: Xsara",
        "description": "Earn 30 A-Spec points or more in Citroen Xsara Rally Car `99. Caution! It's inappropriately front-wheel drive!",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x221
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "World Rally Collection: Lancia Delta",
        "description": "",
        "fullDescription": "In any Dirt or Snow rally event of Special Conditions hall, earn 50 A-Spec points or more in any of Lancia Rally cars.",
        "points": 2,
        "carIds": [
            0x189,
            0x2F9,
            0x60
        ],
        "trackIds": [],
        "eventStringIds": [
            "rh_capri_e",
            "rh_capri_n",
            "rh_capri_h",
            "rh_grandcanyon_e",
            "rh_grandcanyon_n",
            "rh_grandcanyon_h",
            "rh_icerace_e",
            "rh_icerace_n",
            "rh_icerace_h",
            "rh_nursnow_e",
            "rh_nursnow_n",
            "rh_nursnow_h",
            "rh_smtsouth_e",
            "rh_smtsouth_n",
            "rh_smtsouth_h",
            "rh_tahiti_maze_e",
            "rh_tahiti_maze_n",
            "rh_tahiti_maze_h",
            "rh_yosemite_dirt_e",
            "rh_yosemite_dirt_n",
            "rh_yosemite_dirt_h",
            "rh_yosemite_dirt_short_e",
            "rh_yosemite_dirt_short_n",
            "rh_yosemite_dirt_short_h"
        ],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "World Rally Collection: RS200",
        "description": "",
        "fullDescription": "In any Dirt or Snow rally event of Special Conditions hall, earn 50 A-Spec points or more in Ford RS200 Rally Car `85.",
        "points": 2,
        "carIds": [
            0x2A9
        ],
        "trackIds": [],
        "eventStringIds": [
            "rh_capri_e",
            "rh_capri_n",
            "rh_capri_h",
            "rh_grandcanyon_e",
            "rh_grandcanyon_n",
            "rh_grandcanyon_h",
            "rh_icerace_e",
            "rh_icerace_n",
            "rh_icerace_h",
            "rh_nursnow_e",
            "rh_nursnow_n",
            "rh_nursnow_h",
            "rh_smtsouth_e",
            "rh_smtsouth_n",
            "rh_smtsouth_h",
            "rh_tahiti_maze_e",
            "rh_tahiti_maze_n",
            "rh_tahiti_maze_h",
            "rh_yosemite_dirt_e",
            "rh_yosemite_dirt_n",
            "rh_yosemite_dirt_h",
            "rh_yosemite_dirt_short_e",
            "rh_yosemite_dirt_short_n",
            "rh_yosemite_dirt_short_h"
        ],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "World Rally Collection: Peugeot 205",
        "description": "",
        "fullDescription": "In any Dirt or Snow rally event of Special Conditions hall, earn 50 A-Spec points or more in Peugeot 205 Turbo 16 Rally Car (or 205 Evolution 2).",
        "points": 2,
        "carIds": [
            0x69,
            0x242
        ],
        "trackIds": [],
        "eventStringIds": [
            "rh_capri_e",
            "rh_capri_n",
            "rh_capri_h",
            "rh_grandcanyon_e",
            "rh_grandcanyon_n",
            "rh_grandcanyon_h",
            "rh_icerace_e",
            "rh_icerace_n",
            "rh_icerace_h",
            "rh_nursnow_e",
            "rh_nursnow_n",
            "rh_nursnow_h",
            "rh_smtsouth_e",
            "rh_smtsouth_n",
            "rh_smtsouth_h",
            "rh_tahiti_maze_e",
            "rh_tahiti_maze_n",
            "rh_tahiti_maze_h",
            "rh_yosemite_dirt_e",
            "rh_yosemite_dirt_n",
            "rh_yosemite_dirt_h",
            "rh_yosemite_dirt_short_e",
            "rh_yosemite_dirt_short_n",
            "rh_yosemite_dirt_short_h"
        ],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 50,
        "name": "World Rally Collection: Renault 5",
        "description": "",
        "fullDescription": "In any Dirt or Snow rally event of Special Conditions hall, earn 50 A-Spec points or more in Renault 5 Maxi Turbo Rally Car `85.",
        "points": 2,
        "carIds": [
            0x6A
        ],
        "trackIds": [],
        "eventStringIds": [
            "rh_capri_e",
            "rh_capri_n",
            "rh_capri_h",
            "rh_grandcanyon_e",
            "rh_grandcanyon_n",
            "rh_grandcanyon_h",
            "rh_icerace_e",
            "rh_icerace_n",
            "rh_icerace_h",
            "rh_nursnow_e",
            "rh_nursnow_n",
            "rh_nursnow_h",
            "rh_smtsouth_e",
            "rh_smtsouth_n",
            "rh_smtsouth_h",
            "rh_tahiti_maze_e",
            "rh_tahiti_maze_n",
            "rh_tahiti_maze_h",
            "rh_yosemite_dirt_e",
            "rh_yosemite_dirt_n",
            "rh_yosemite_dirt_h",
            "rh_yosemite_dirt_short_e",
            "rh_yosemite_dirt_short_n",
            "rh_yosemite_dirt_short_h"
        ],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Grand Raid",
        "description": "any of Rally Raid cars on Grand Canyon track",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x2C1,
            0xE6,
            0x24D
        ],
        "trackIds": [
            0x4,
            0x74
        ],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Fan Menace",
        "description": "",
        "fullDescription": "Earn atleast 30 A-Spec points in any Gran Turismo World Championship or Gran Turismo All Stars race while driving Chaparral 2J Race Car `70.",
        "points": 2,
        "carIds": [
            0x42D
        ],
        "trackIds": [],
        "eventStringIds": [
            "pr_gtworld",
            "ex_gtallstar"
        ],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: Camaro",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x1B2
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: Jaguar XJ220",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x2F8
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: RX-7",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x1FB
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: RX-8",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x4B
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: FTO",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x12C
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: Pagani Zonda",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x149
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: BMW M3",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x169
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: Corvette C5R",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x139
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: Dodge Viper GTS-R",
        "description": "Dodge VIPER GTS-R Team Oreca Race Car `00",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x2D,
            0x5B
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Race Cars: Gillet Vertigo",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x355
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: Lister Storm",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x214
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "arcadeTimeTrial",
        "target": 116023,
        "name": "Race Cars: CLK-GTR",
        "description": "",
        "fullDescription": "Arcade Time Trial, AMG Mercedes CLK-GTR Race Car `98, Racing Hard tires, no quick tune. Do a clean lap on Suzuka Circuit and beat the time of 1:56'023, originally set by Team AMG-Mercedes at Suzuka 1000km 1997.",
        "points": 5,
        "carIds": [
            0x184
        ],
        "trackIds": [
            0x63
        ],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "rh",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 40,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: BMW McLaren F1",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0xD8
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: Panoz Esperante",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x72
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: Civic",
        "description": "any of Honda Civic race cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x294,
            0x2AB
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: Ford Falcon XR8",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x157
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: Chaparral 2D",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x42C
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Race Cars: Toyota 7",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x2E4
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Heard Of: Autobacs Sportscar Laboratory?",
        "description": "any of ASL cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x90,
            0x126
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Heard Of: Callaway C12?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x235
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Heard Of: Cizeta V16T?",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x2A5
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Heard Of: Eagle Talon?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x23B
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Heard Of: Ford Performance Vehicles?",
        "description": "any of FPV cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x3B1,
            0x3B2
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Heard Of: Holden?",
        "description": "any of Holden cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x3BD,
            0x380
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Heard Of: Hommell?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x365
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Heard Of: Lotus Carlton?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x23C
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Heard Of: Proto Motors?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x434
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Heard Of: Spyker C8?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x1B0
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Heard Of: Tommykaira?",
        "description": "any of Tommykaira cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x227,
            0x226
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Heard Of: Toyota Sera?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x165
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "autoUnionTimeTrial",
        "target": 400000,
        "name": "Have You Heard Of: Type C Streamline?",
        "description": "",
        "fullDescription": "Gran Turismo mode, Free Run, Auto Union V16 Type C Streamline `37, Racing Soft tires, no turbo kit and weight ballast, body rigidity upgrade optional. Do a clean lap on Nurburgring Nordschleife and beat the time of 6:40'000.",
        "points": 25,
        "carIds": [
            0x431
        ],
        "trackIds": [
            0x41
        ],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "rs",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Alfa Romeo GTV?",
        "description": "Alfa Romeo Spider 3.0i V6 24V `01 or GTV 3.0 V6 24V `01",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x1A9,
            0x188
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Audi Le Mans quattro?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x37F
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Audi quattro?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x28C
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: BMW Z4?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x28F
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Buick GNX?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x234
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Buick Special?",
        "description": "",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x331
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Caterham?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x3A6
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: 4th Gen Camaro?",
        "description": "any of fourth generation Chevrolet Camaro road (!) cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x20,
            0x138
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "arcadeTimeTrial",
        "target": 65800,
        "name": "Have You Tried: Chrysler Prowler",
        "description": "",
        "fullDescription": "Arcade Time Trial, Chrysler Prowler `02, Sports Hard tires, no quick tune. Do a clean lap on Clubman Stage Route 5 (Reverse) and beat the time of 1:05'800.",
        "points": 10,
        "carIds": [
            0x2F0
        ],
        "trackIds": [
            0x8f
        ],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "sh",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Daihatsu Cuore?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x270
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Dodge Viper?",
        "description": "any of Dodge Viper road (!) cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2F4,
            0x13A,
            0x23A
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Fiat Barchetta?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x15D
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Fiat Coupe Turbo?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x147
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Ford GT?",
        "description": "any of Ford GT road (!) cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0xD4,
            0x18F,
            0x420
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Ford Ka?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x3B
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Ford Mustang GT?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x292
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Ford Mustang SVT?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x13D
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Honda CR-X?",
        "description": "Honda BALLADE SPORTS CR-X 1.5i `83 or CR-X SiR `90",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x5C,
            0x2F6
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Honda CR-X del Sol?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2AF
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Honda S2000?",
        "description": "any of Honda S2000 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x3AB,
            0x40F,
            0x174,
            0x205,
            0x112,
            0x204,
            0x209,
            0x20A,
            0x20B,
            0x20C,
            0x41A,
            0x201,
            0x85,
            0x202,
            0x203,
            0x206,
            0x207,
            0x208,
            0x2B2,
            0x285,
            0x1E0,
            0x389,
            0x213,
            0xD6,
            0x321
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Infiniti?",
        "description": "any of Infiniti cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x1C9,
            0x1CA,
            0x357,
            0x369
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Lexus?",
        "description": "any of the Lexus cars other than Lexus SC430 `01",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x408,
            0x407,
            0x409,
            0x419,
            0x1D0,
            0x1D2,
            0x40B
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Lexus SC430?",
        "description": "Lexus SC430 `01",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x1D4,
            0x1D5
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Lotus Esprit Turbo?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x18A
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Lotus Esprit?",
        "description": "any of Lotus Esprit V8 cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x3C2,
            0x33F,
            0x1BE
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Mitsubishi 3000GT?",
        "description": "any of Mitsubishi 3000GT cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x3F6,
            0x3F7,
            0x3FB,
            0x3FC,
            0x3FD,
            0x400,
            0x401,
            0x3FF,
            0x3F8,
            0x3F9,
            0x3FA,
            0x3FE
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Mitsubishi FTO?",
        "description": "any of Mitsubishi FTO cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x33,
            0x372,
            0x373,
            0x374,
            0x375,
            0x376,
            0x377
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Nissan R390?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x1F0
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Pagani Zonda?",
        "description": "any of Pagani Zonda road (!) cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x224,
            0x225,
            0x148
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Pontiac GTO?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x244
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Pontiac Vibe GT?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x46
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Shelby Series 1?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2DC
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHuntPrius",
        "target": 30,
        "name": "Have You Tried: Toyota Prius?????",
        "description": "any of Toyota PRIUS cars without custom transmission",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x5A,
            0x59
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Toyota Supra?",
        "description": "Toyota SUPRA 3.0GT Turbo A `88 or 2.5GT Twin Turbo R `90",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x34B,
            0x310
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: 4th Gen Supra?",
        "description": "any of Toyota Supra `97 road (!) cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x52,
            0x216
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Opel Tigra?",
        "description": "Opel/Vauxhall Tigra 1.6i `99",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x275,
            0x186
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Volvo 240?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2E6
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Have You Tried: Volvo S60?",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x25E
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "arcadeTimeTrial",
        "target": 114900,
        "name": "The Terminator",
        "description": "",
        "fullDescription": "Arcade Time Trial, Jay Leno Tank Car `03, Sports Soft tires, no quick tune. Do a clean lap on New York circuit (Normal) and beat the time of 1:54'900.",
        "points": 5,
        "carIds": [
            0x231
        ],
        "trackIds": [
            0x7
        ],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "ss",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "arcadeTimeTrial",
        "target": 128088,
        "name": "Plutonium Not Included",
        "description": "",
        "fullDescription": "Arcade Time Trial, DMC DeLorean S2 `04, Normal Road tires (Normal Comfort in NTSC version), no quick tune. Do a clean lap on Cote d'Azur and beat the time of 2:08'080.",
        "points": 10,
        "carIds": [
            0x403
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "n2",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Concepts: Cadillac CIEN",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x137
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Concepts: Camaro IROC-Z",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2A4
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Concepts: DOME ZERO",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x127
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Concepts: Honda Dualnote",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2F7
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Concepts: Honda HSC",
        "description": "in Honda/Acura HSC",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x81,
            0x26C
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Concepts: NSX-R LM",
        "description": "any of Honda NSX-R Prototype LM Race Cars",
        "fullDescription": "",
        "points": 2,
        "carIds": [
            0x43,
            0x1E3
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 20,
        "name": "Concepts: Hyundai Clix",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x15A
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Concepts: Hyundai HCD6",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x22A
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Concepts: Mazda Kusabi",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x95
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Concepts: Mitsubishi HSR-II",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x9A
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Concepts: iChubby",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x9B
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "arcadeTimeTrial",
        "target": 92777,
        "name": "Concepts: Nike ONE",
        "description": "",
        "fullDescription": "Arcade Time Trial, NIKE One 2022, Sports Soft tires, no quick tune. Do a clean lap on Trial Mountain (Normal) and beat the time of 1:32'777.",
        "points": 10,
        "carIds": [
            0x196
        ],
        "trackIds": [
            0x18
        ],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "ss",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Concepts: Nissan GT-R",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x1EF
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Concepts: Pontiac Solstice",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x212
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "arcadeTimeTrial",
        "target": 86400,
        "name": "Concepts: Motor Triathlon",
        "description": "",
        "fullDescription": "Arcade Time Trial, Toyota Motor Triathlon Race Car `04, Sports Medium tires, no quick tune. Do a clean lap on Deep Forest (Normal) and beat the time of 1:26'400.",
        "points": 10,
        "carIds": [
            0xDB
        ],
        "trackIds": [
            0x40
        ],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "sm",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Concepts: Volkswagen W12",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x146
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Legendary Muscles: Camaro SS",
        "description": "any of Chevrolet Camaro 1969 muscle cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x1F,
            0x237
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Legendary Muscles: Chevelle SS",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x24
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Legendary Muscles: Tempest",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x45
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Legendary Muscles: Cuda 440",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2B
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Legendary Muscles: Super Bird!",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x299
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Legendary Muscles: Charger",
        "description": "any of Dodge Charger muscle cars",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x291,
            0x2A7
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 30,
        "name": "Legendary Muscles: Cougar XR-7",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x240
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 5,
        "name": "Historics: Alfa Romeo Giulia",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x28B
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 5,
        "name": "Historics: Alfa Romeo Spider 1600",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x29F
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Historics: BMW 2002 Turbo",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x3C0
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "eventWin",
        "target": 0,
        "name": "Historics: Fiat Sunday Joke",
        "description": "",
        "fullDescription": "Win at any Sunday Cup event while driving any of the old and tiny Fiat 500 cars.",
        "points": 3,
        "carIds": [
            0x1B,
            0x36B,
            0x36C
        ],
        "trackIds": [],
        "eventStringIds": [
            "am_sunday"
        ],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Historics: Ginetta G4",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x320
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Historics: Honda 1300",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x7F
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 5,
        "name": "Historics: Honda S series",
        "description": "Honda S500, S600 or S800",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2B3,
            0x2B4,
            0x87,
            0x295
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Historics: Jensen Interceptor",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x296
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 5,
        "name": "Historics: Lotus Elan",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x23D
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Historics: Lotus Europa",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2FB
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 5,
        "name": "Historics: Mini Marcos",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x297
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Historics: Galant",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x2BB
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 5,
        "name": "Historics: Bluebird",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x9C
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Historics: Toyota 2000GT",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x25C
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 5,
        "name": "Historics: Toyota Sports 800",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x414
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 10,
        "name": "Historics: Karmann Ghia",
        "description": "",
        "fullDescription": "",
        "points": 1,
        "carIds": [
            0x312
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "aSpecHunt",
        "target": 200,
        "name": "A-Violation",
        "description": "",
        "fullDescription": "Assert dominance by earning 200 A-Spec points while driving Dodge RAM 1500 LARAMIE Hemi Quad Cab `04.",
        "points": 1,
        "carIds": [
            0x3BB
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "arcadeTimeTrial",
        "target": 180000,
        "name": "Tin Lizzie Trial",
        "description": "",
        "fullDescription": "Arcade Time Trial, Ford Model T Tourer `15, Normal Sports (Normal Road in NTSC version) tires, no quick tune. Be very smooth and gentle to beat a lap time of 3:00'000 on Seattle Circuit (Reverse).",
        "points": 10,
        "carIds": [
            0x406
        ],
        "trackIds": [
            0x84
        ],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "n3",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "oneLap",
        "target": 0,
        "name": "One Horsepower Wonder",
        "description": "",
        "fullDescription": "Take any of Mercedes-Benz ONE HORSEPOWER carriages and have enough patience to complete one lap on any track. Did you like it???",
        "points": 1,
        "carIds": [
            0x3D2,
            0x3D3
        ],
        "trackIds": [],
        "eventStringIds": [],
        "raceIndex": -1,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    },
    {
        "type": "eventWin",
        "target": 0,
        "name": "Make This Your Final Achievement",
        "description": "",
        "fullDescription": "Take the title car: Ford GT LM Race Car Spec II `04, and win the final race of Gran Turismo World Championship on Circuit de la Sarthe.",
        "points": 10,
        "carIds": [
            0x410
        ],
        "trackIds": [],
        "eventStringIds": [
            "pr_gtworld"
        ],
        "raceIndex": 9,
        "tires": "",
        "gearbox": "",
        "aid": "",
        "topSpeedTune": 0,
        "powerTune": 0,
        "laps": -1,
        "colorId": -1
    }
]





// ========
//  LOOKUP
// ========

gameFlag = dword(dword(0x622F4C) + 0x3a370)
menuProjectAddress = dword(0x622F4C) + 0x3A3BC

arcadeFrontTires = dword(dword(0x6187a8) + 0x3B8)
arcadeRearTires = dword(dword(0x6187a8) + 0x3BC)
arcadeTransmission = dword(dword(0x6187a8) + 0x3C0)
arcadeDrivingAids = dword(dword(0x6187a8) + 0x3C4)
arcadeWeightAdjust = dword(dword(0x6187a8) + 0x3AC)
arcadePowerAdjust = dword(dword(0x6187a8) + 0x3B0)
arcadeTopSpeedAdjust = byte(dword(0x6187a8) + 0x3B4)

gtModeASpecMileage = dword(dword(0x622F4C) + 0x3B8)
gtModeChampionshipInProgress = byte(dword(0x622F4C) + 0x38C20)
gtModeDateJulian =  dword(dword(0x622F4C) + 0xBC28)
gtModePlayerCarLabelId = dword(dword(0x622F4C) + 0x13940)
gtModePlayerGearboxId = dword(dword(0x622F4C) + 0x13988)
gtModePlayerFrontTiresId = dword(dword(0x622F4C) + 0x139A0)
gtModePlayerRearTiresId = dword(dword(0x622F4C) + 0x139A8)
gtModePlayerTurbineId = dword(dword(0x622F4C) + 0x139F0)
gtModePlayerNOSId = dword(dword(0x622F4C) + 0x13A38)

inGameEventId = dword(dword(0x621cb4) + 0x68)
inGameTrackId = dword(dword(0x621cb4) + 0x78)
inGamePlayerCarId = dword(dword(0x621cb4) + 0x9B0)
inGamePlayerCarColorId = byte(dword(0x621cb4) + 0x9C8)
inGameBSpecActive = dword(pointerChain(0x621cb4, [0x84, 0xCCC]))
inGameControlScheme = dword(pointerChain(0x621cb4, [0x84, 0x58, 0x30, 0x1BC]))
inGameLapsToGo = dword(dword(0x621cb4) + 0x0)

inGamePlayerPositionByHUD = dword(pointerChain(0x621cb4, [0x84, 0xE420, 0x13B0]))
inGameASpecPointsWon = byte(dword(0x621cb4) + 0x96C)

function inGameDataForCarAddress(index) => pointerChain(0x621cb4, [0x60, 0x8, 0x0 + index * 4])
function inGameGridCarId(index) => dword(dword(inGameDataForCarAddress(index)) + 0x20)
function inGameCurrentLapForCarAddress(index) => dword(inGameDataForCarAddress(index)) + 0x1AC
inGameCurrentLapForPlayer = dword(inGameCurrentLapForCarAddress(0))
inGameCurrentLapTimeInMsecByHUD = dword(pointerChain(0x621cb4, [0x84, 0xE420, 0x1664]))
inGameLastLapTimeInMsec = dword(pointerChain(0x621cb4, [0x60, 0x8, 0x0, 0x11DC]))

inGameLicenseState = dword(dword(0x621cb4) + 0x88)
inGameLicenseFinishTimeInMsec = dword(dword(0x621cb4) + 0x8c)

playerCarFrontCamber = byte(dword(0x622f4c) + 0x13A79)
playerCarRearCamber = byte(dword(0x622f4c) + 0x13A7A)
playerCarWeightBallast = byte(dword(0x622f4c) + 0x13A9B)

speedUnits = byte(dword(0x622f4c) + 0x38CC0)
transmission = dword(dword(0x622f4c) + 0x39D78)

subEventStringAddress = dword(0x6187a8) + 0x3C8

showingResults = dword(pointerChain(0x621cb4, [0x84, 0xE41C, 0x0]))

// =======
//   AUX
// =======

function isInASpecMode() => inGameControlScheme == 0

function hasCompletedALap() {
    return inGameCurrentLapForPlayer > prev(inGameCurrentLapForPlayer)
}

function hasFinishedRace() {
    return showingResults > prev(showingResults)
}

function hasWentOut() {
    collisionIntensity = float(pointerChain(0x621cb4, [0x84, 0x70, 0x6DAC]))

    failConditions = []
    tireCombos = [
        [ 0x6E81, 0x6EB5, 0x6EE9 ],
        [ 0x6E81, 0x6EB5, 0x6F1D ],
        [ 0x6E81, 0x6EE9, 0x6F1D ],
        [ 0x6EB5, 0x6EE9, 0x6F1D ],
    ]

    for tires in tireCombos {
        array_push(failConditions, all_of(tires, function cb(tire) {
            GRASS = 2
            surface = byte(pointerChain(0x621cb4, [0x84, 0x70, tire]))
            return surface == GRASS
        }))
        array_push(failConditions, all_of(tires, function cb(tire) {
            surface = byte(pointerChain(0x621cb4, [0x84, 0x70, tire]))
            SAND = 3
            return surface == SAND
        }))
        array_push(failConditions, all_of(tires, function cb(tire) {
            surface = byte(pointerChain(0x621cb4, [0x84, 0x70, tire]))
            SAND = 4
            return surface == SAND
        }))
    }

    return (
        any_of(failConditions, x => x) || (
            collisionIntensity > 0.05 &&
            collisionIntensity > prev(collisionIntensity)
        )
    )
}

function hasWonChampionship() {
    championshipMoneyToAward = dword(dword(0x6187a8) + 0x4A8)

    return championshipMoneyToAward > prev(championshipMoneyToAward)
}

function hasWonRaceInASpec(aSpecRequirement = 0) {
    if (aSpecRequirement > 0) {
        condition = inGameASpecPointsWon >= aSpecRequirement && prev(inGameASpecPointsWon) == 0
    } else {
        condition = inGameASpecPointsWon > prev(inGameASpecPointsWon)
    }

    return condition && isInASpecMode() && showingResults == 1
}

function hasWonRaceEvent(
    eventStringId,
    raceIndex = -1, // -1 is any event
    aSpecRequirement = 0,
    forbiddenCarIds = [],
    nosAllowed = true,
    requiredCarIds = [],
    triggerFlag = false
) {
    restrictions = []

    if (raceIndex >= 0) {
        array_push(restrictions, inGameEventId == eventMeta[eventStringId]["events"][raceIndex][1])
    } else {
        array_push(restrictions, __ornext((
            any_of(
                eventMeta[eventStringId]["events"],
                x => inGameEventId == x[1]
            )
        )))
    }

    if (eventMeta[eventStringId]["isChampionship"] == true) {
        array_push(restrictions, __ornext(
            gameFlag == GAME_FLAG_RACE_EVENT ||
            gameFlag == GAME_FLAG_CHAMPIONSHIP
        ))
    } else {
        array_push(restrictions, gameFlag == GAME_FLAG_RACE_EVENT)
    }

    if (length(requiredCarIds) > 0) {
        array_push(restrictions, __ornext(any_of(requiredCarIds, requiredCarId => gtModePlayerCarLabelId == requiredCarId)))
    } else if (length(forbiddenCarIds) > 0) {
        array_push(restrictions, all_of(forbiddenCarIds, carId => gtModePlayerCarLabelId != carId))
    }

    if (nosAllowed == false) {
        array_push(restrictions, gtModePlayerNOSId == -1)
    }

    wonRaceCondition = hasWonRaceInASpec(aSpecRequirement)
    if (triggerFlag == true) {
        wonRaceCondition = trigger_when(wonRaceCondition)
    }

    return wonRaceCondition && all_of(restrictions, x => x)
}

function hasWonAllRaceEventsInOneSitting(
    eventStringId,
    aSpecRequirement = 0,
    forbiddenCarIds = [],
    nosAllowed = true
) {
    raceAmount = length(eventMeta[eventStringId]["events"])

    return measured(tally_of(range(0, raceAmount - 1), raceAmount, raceIndex => once(
        hasWonRaceEvent(eventStringId, raceIndex, aSpecRequirement, forbiddenCarIds, nosAllowed)
    )))
}

function hasWonChampionshipInOneSitting(eventStringId, forbiddenCarIds = []) {
    abandonedChampionshipInMainMenu = (
        gameFlag == GAME_FLAG_MENUS &&
        gtModeChampionshipInProgress == 0
    )
    firstRaceEventId = eventMeta[eventStringId]["events"][0][1]

    enteredTheFirstRace = (
        isInASpecMode() &&
        gameFlag == GAME_FLAG_CHAMPIONSHIP &&
        inGameEventId == firstRaceEventId &&
        all_of(forbiddenCarIds, carId => gtModePlayerCarLabelId != carId) &&
        prev(inGameCurrentLapTimeInMsecByHUD) <= 0x3F && inGameCurrentLapTimeInMsecByHUD > 0x3F
    )

    return (
        once(enteredTheFirstRace) &&
        never(abandonedChampionshipInMainMenu) &&
        never(inGameBSpecActive == 1) &&

        hasWonChampionship()
    )
}


function hasWonMissionEvent(eventStringId) {
    eventId = missionMeta[eventStringId]["eventId"]

    return (
        hasWonRaceInASpec() &&
        gameFlag == GAME_FLAG_MISSION && (
            inGameEventId == eventId["pal"] ||
            inGameEventId == eventId["ntsc"]
        )
    )
}

function hasFinishedLicenseTest(eventStringId, requirement) {
    wonExpectedReward = (
        prev(inGameLicenseState) == LICENSE_STAND_BY
    )

    if (requirement == LICENSE_SILVER || requirement == LICENSE_BRONZE) {
        wonExpectedReward = wonExpectedReward && (
            inGameLicenseState >= LICENSE_GOLD &&
            inGameLicenseState <= requirement
        )
    } else if (requirement == LICENSE_GOLD) {
        wonExpectedReward = wonExpectedReward && inGameLicenseState == LICENSE_GOLD
    } else if (requirement == LICENSE_FINISH) {
        wonExpectedReward = wonExpectedReward && inGameLicenseState <= LICENSE_BRONZE
    }

    eventId = licenseMeta[eventStringId]["eventId"]

    return (
        wonExpectedReward &&
        gameFlag == GAME_FLAG_LICENSE && (
            inGameEventId == eventId["pal"] ||
            inGameEventId == eventId["ntsc"]
        )
    )
}

function hasWonAllLicenses(licenseLetter) {
    licenseIds = []
    palMem = []
    ntscOffsetMem = []
    for x in licenseMeta {
        if (
            licenseMeta[x]["license"] == licenseLetter &&
            licenseMeta[x]["isCoffee"] == false
        ) {
            meta = licenseMeta[x]
            array_push(licenseIds, x)
            array_push(palMem,  meta["flags"]["pal"])
            array_push(ntscOffsetMem, meta["flags"]["ntscOffset"])
        }
    }

    licenseAmount = length(licenseIds)

    wonAllInOneSitting = measured(tally_of(licenseIds, licenseAmount, id => once(
        hasFinishedLicenseTest(id, LICENSE_BRONZE)
    )))

    function gotAllRewardsConditionsPAL(mems) {
        return (
            all_of(mems, mem => high4(mem) <= 0xB) &&
            any_of(mems, mem => prev(high4(mem)) > 0xB && high4(mem) <= 0xB)
        )
    }

    function gotAllRewardsConditionsNTSC(mems) {
        return (
            all_of(mems, mem => high4(dword(0x622f4c) + mem) <= 0xB) &&
            any_of(mems, mem => prev(high4(dword(0x622f4c) + mem)) > 0xB && high4(dword(0x622f4c) + mem) <= 0xB)
        )
    }

    gotAllRewards = gameFlag == GAME_FLAG_LICENSE && (
        (isRunningPAL && gotAllRewardsConditionsPAL(palMem)) ||
        (isRunningNTSC && gotAllRewardsConditionsNTSC(ntscOffsetMem))
    )

    return wonAllInOneSitting || gotAllRewards
}

// ==============
//  ACHIEVEMENTS
// ==============

// Not satisfied with the code, but I'd say it's the way I defined
// data in Google Sheet that led to it's complexity. Data should've been more explicit
// with challenge types instead of trying to satisfy all requirements in one row.
// Having separate tables would be nice too.
function defineRaceEvents() {
    for id in eventMeta {
        meta = eventMeta[id]

        achievements = []

        descriptionSuffix = ""
        if (length(meta["descriptionSuffix"]) > 0) {
            descriptionSuffix = " " + meta["descriptionSuffix"]
        }

        nitrousSuffix = ""
        if (meta["nitrousAllowed"] != true) {
            nitrousSuffix = " Nitrous is not allowed."
        }

        forbiddenCarIds = meta["carIdsForbidden"]
        if (meta["noBrokenASpecCars"] == true) {
            array_push(forbiddenCarIds, CAR_ID_DODGE_RAM)
            array_push(forbiddenCarIds, CAR_ID_CHAPARAL_2J)
        }

        raceAmount = length(meta["events"])

        if (id == "ex_formula") { // exception: Formula GT event is too big so player is allowed to win three different races instead of all 15
            conditions = [
                [1, "1st to 5th", [0, 1, 2, 3, 4]],
                [2, "6th to 10th", [6, 7, 8, 9, 10]],
                [3, "11th to 15th", [10, 11, 12, 13, 14]]
            ]

            for x in conditions {
                array_push(achievements, {
                    "title": format("{0} - Series #{1}", meta["name"], x[0]),
                    "description": format("Win in any {0} event placed {1} in the menu, in A-Spec mode while driving Formula Gran Turismo, which you can win from Nurburgring 24h Endurance (but you'd rather borrow a save file).", meta["name"], x[1]),
                    "points": (meta["points"] / length(conditions)),
                    "trigger": any_of(x[2], raceIndex => hasWonRaceEvent(
                        id,
                        raceIndex,
                        aSpecRequirement = 0,
                        forbiddenCarIds = [],
                        nosAllowed = true,
                        requiredCarIds = [CAR_ID_FORMULA]
                    ))
                })
            }
        } else if (id == "eur1000mile") { // exception: the event is too big and boring, so player is allowed to win only one event
            array_push(achievements, {
                "title": meta["name"],
                "description": format("Win any {0} event in A-Spec mode and earn atleast {1} A-Spec points.{2}", meta["name"], meta["aSpecAnyEvent"], nitrousSuffix),
                "points": meta["points"],
                "trigger": hasWonRaceEvent(id, -1, meta["aSpecAnyEvent"], forbiddenCarIds, meta["nitrousAllowed"])
            })
        } else if (meta["inOneSitting"] == true) {
            if (meta["isChampionship"] == true) {
                array_push(achievements, {
                    "title": meta["name"],
                    "description": format("Win {0} in A-Spec championship mode in one sitting.{1}", meta["name"], descriptionSuffix),
                    "points": meta["points"],
                    "trigger": hasWonChampionshipInOneSitting(id, forbiddenCarIds)
                })
            } else if (meta["aSpecAllEvents"] > 0) {
                description = format("Win all {0} events in one sitting in A-Spec mode, earning atleast {1} A-Spec points in each.{2}{3}", meta["name"], meta["aSpecAllEvents"], nitrousSuffix, descriptionSuffix)
                conditions = hasWonAllRaceEventsInOneSitting(id, meta["aSpecAllEvents"], forbiddenCarIds, meta["nitrousAllowed"])

                if (raceAmount == 1) {
                    description = format("Win the {0} event in A-Spec mode and earn atleast {1} A-Spec points.{2}{3}", meta["name"], meta["aSpecAllEvents"], nitrousSuffix, descriptionSuffix)
                    conditions = hasWonRaceEvent(id, 0, meta["aSpecAllEvents"], forbiddenCarIds, meta["nitrousAllowed"])
                }

                array_push(achievements, {
                    "title": meta["name"],
                    "description": description,
                    "points": meta["points"],
                    "trigger": conditions
                })
            } else {
                description = format("Win all events of {0} in A-Spec mode in one sitting.", meta["name"])
                conditions = hasWonAllRaceEventsInOneSitting(id)

                if (raceAmount == 1) {
                    description = format("Win the {0} event in A-Spec mode.", meta["name"])
                    conditions = hasWonRaceEvent(id)
                }

                array_push(achievements, {
                    "title": meta["name"],
                    "description": description,
                    "points": meta["points"],
                    "trigger": conditions
                })
            }

            if (length(meta["carIdAnyEvent"]) > 0) {
                if (id == "de_mercedes_arrow") { // exception: you're allowed to win either de_mercedes_arrow or de_mercedes_sl in SL 300
                    array_push(achievements, {
                        "title": format("{0} - Car Challenge", meta["name"]),
                        "description": format(
                            "Win any {0} or {1} event while driving Mercedes-Benz 300 SL Coupe '54, which you can win from SL Challenge.",
                            eventMeta["de_mercedes_arrow"]["name"],
                            eventMeta["de_mercedes_sl"]["name"]
                        ),
                        "points": meta["pointsChallenge"],
                        "trigger": (
                            hasWonRaceEvent("de_mercedes_arrow", -1, 0, [], true, requiredCarIds = [CAR_ID_MERCEDES_SL_300]) ||
                            hasWonRaceEvent("de_mercedes_sl", -1, 0, [], true, requiredCarIds = [CAR_ID_MERCEDES_SL_300])
                        )
                    })
                } else if (id != "de_mercedes_sl" && meta["aSpecAnyEvent"] == 0) { // the condition is to prevent the challenge above from being defined again
                    array_push(achievements, {
                        "title": format("{0} - Car Challenge", meta["name"]),
                        "description": format("Win any {0} event while driving {1}", meta["name"], meta["carIdAnyEvent"][1]),
                        "points": meta["pointsChallenge"],
                        "trigger": hasWonRaceEvent(id, -1, 0, [], true, requiredCarIds = [meta["carIdAnyEvent"][0]])
                    })
                }
            }
        } else if (meta["inOneSitting"] == false) {

            for i in range(0, raceAmount - 1) {
                aSpecAllEventsSuffix = ""
                aSpecAllEventsNitrousSuffix = nitrousSuffix
                nitrousAllowed = meta["nitrousAllowed"]
                if (meta["aSpecAllEvents"] > 0) {
                    aSpecAllEventsSuffix = format(" and earn atleast {0} A-Spec points", meta["aSpecAllEvents"])
                } else {
                    aSpecAllEventsNitrousSuffix = ""
                    nitrousAllowed = true
                }

                eventTrackId = meta["events"][i][0]

                array_push(achievements, {
                    "title": format("{0} - Race #{1}", meta["name"], i + 1),
                    "description": format(
                        "Win race #{0} of {5} on {1} in A-Spec mode{4}.{2}{3}",
                        i + 1,
                        trackIdToString[eventTrackId],
                        descriptionSuffix,
                        aSpecAllEventsNitrousSuffix,
                        aSpecAllEventsSuffix,
                        meta["name"]
                    ),
                    "points": (meta["points"] / raceAmount),
                    "trigger": hasWonRaceEvent(id, i, meta["aSpecAllEvents"], forbiddenCarIds, nitrousAllowed)
                })
            }
        }

        if (meta["aSpecAnyEvent"] > 0 && id != "eur1000mile") {
            if (length(meta["carIdAnyEvent"]) > 0) {
                array_push(achievements, {
                    "title": format("{0} - A-Spec Car Challenge", meta["name"]),
                    "description": format("Win any {0} event and earn atleast {1} A-Spec points while driving {2}", meta["name"], meta["aSpecAnyEvent"], meta["carIdAnyEvent"][1]),
                    "points": meta["pointsChallenge"],
                    "trigger": hasWonRaceEvent(id, -1, meta["aSpecAnyEvent"], [], meta["nitrousAllowed"], requiredCarIds = [meta["carIdAnyEvent"][0]])
                })
            } else {
                array_push(achievements, {
                    "title": format("{0} - A-Spec Challenge", meta["name"]),
                    "description": format("Earn {0} A-Spec points or more in any of the {1} events.{2}", meta["aSpecAnyEvent"], meta["name"], nitrousSuffix),
                    "points": meta["pointsChallenge"],
                    "trigger": hasWonRaceEvent(id, -1, meta["aSpecAnyEvent"], forbiddenCarIds, meta["nitrousAllowed"])
                })
            }
        }

        for ach in achievements {
            achievement(
                title = ach["title"],
                description = ach["description"],
                points = ach["points"],
                trigger = ach["trigger"]
            )
        }
    }
}

function makeLicenseGoldAchievement(
    title,
    description,
    points,
    licenseId
) {
    meta = licenseMeta[licenseId]

    achievement(
        title = title,
        description = description,
        points = points,
        trigger = hasFinishedLicenseTest(licenseId, requirement = LICENSE_GOLD)
    )

    title = format("License {0}-{1}: {2}", meta["license"], meta["index"], meta["name"])
    if (meta["isCoffee"] == true) {
        title = format("Coffee Break {0}: {1}", meta["license"], meta["name"])
    }

    leaderboard(
        title = title,
        description = "Fastest time to complete in msec",
        start = (
            hasFinishedLicenseTest(licenseId, requirement = LICENSE_FINISH) &&
            inGameLicenseFinishTimeInMsec != 359999999 && inGameLicenseFinishTimeInMsec > 0
        ),
        cancel = always_false(),
        submit = always_true(),
        value = inGameLicenseFinishTimeInMsec,
        lower_is_better = true,
        format = "VALUE"
    )
}

function defineLicenseEvents() {
    licenses = [
        [ "B",  5, "National B License" ],
        [ "A",  5, "National A License" ],
        [ "IB", 10, "International IB License" ],
        [ "IA", 10, "International IA License" ],
        [ "S",  25, "Superlicense" ],
    ]

    for x in licenses {
        licenseName = x[2]
        achievement(
            title = format("{0} Graduate", licenseName),
            description = format("Earn bronze reward or better in all {0} tests, or pass all tests in one sitting if you already have the license. Coffee break is not required.", licenseName),
            points = x[1],
            trigger = hasWonAllLicenses(x[0])
        )
    }

    // it's an unnecessary loop and if condition, but I needed visual order in RATools
    for x in licenses {
        for id in licenseMeta {
            meta = licenseMeta[id]
            if (meta["license"] == x[0] && meta["isCoffee"] == false) {
                makeLicenseGoldAchievement(
                    title = format("License {0}-{1} - Gold", meta["license"], meta["index"]),
                    description = format("Earn the gold reward in license test {0}-{1} - {2}", meta["license"], meta["index"], meta["name"]),
                    points = meta["points"],
                    licenseId = id
                )
            }
        }
    }

    coffeeNames = {
        "l0c0001": [ "B", "Caffè Latte", "Coffee Break" ],
        "l0c0002": [ "A", "Mocha", "Coffee Break" ],
        "l0c0003": [ "IB", "Flat White", "Coffee Broken" ],
        "l0c0004": [ "IA", "Cappuccino", "Coffee Break (the car)" ],
        "l0c0005": [ "S", "Americano", "Coffee Break (your day)" ],
    }
    for id in licenseMeta {
        meta = licenseMeta[id]
        if (meta["isCoffee"] == true) {
            makeLicenseGoldAchievement(
                title = coffeeNames[id][1],
                description = format("Earn the golden coffee in {1} for {0} License.", coffeeNames[id][0], coffeeNames[id][2]),
                points = meta["points"],
                licenseId = id
            )
        }
    }
}

function defineMissionEvents() {
    for id in missionMeta {
        meta = missionMeta[id]

        achievement(
            title = meta["name"],
            description = format("Complete mission #{0} - {1}", meta["index"], meta["nameFull"]),
            points = meta["points"],
            trigger = hasWonMissionEvent(id)
        )
    }
}

hudPtr = dword(pointerChain(0x621cb4, [0x84, 0xE420, 0x14]))
function defineSpeedAchievement(
    title,
    description,
    points,
    speedKPH,
    speedMPH
) {
    function dashboardBreachedSpeed(speed) {
        hudIsMini = dword(hudPtr + 0x60) == 0x6D345447
        hudMiniSpeed = word(hudPtr + 0x7A)
        hudDashSpeed = word(hudPtr + 0xA1A)

        return (
            ( hudIsMini && prev(hudMiniSpeed) < speed && hudMiniSpeed >= speed) ||
            (!hudIsMini && prev(hudDashSpeed) < speed && hudDashSpeed >= speed)
        )
    }

    notControlledByAI             = byte(pointerChain(0x621cb4, [0x9A8, 0x56A])) == 0
    notControlledByAIRollingStart = byte(pointerChain(0x621cb4, [0x9A8, 0x56B])) == 0

    hudIsActive = byte(hudPtr + 0x0) == 1

    achievement(
        title = title,
        description = description,
        points = points,
        trigger = (
            isInASpecMode() &&
            notControlledByAI &&
            notControlledByAIRollingStart &&

            hudIsActive && (
                (speedUnits == 0 && dashboardBreachedSpeed(speedKPH)) ||
                (speedUnits == 1 && dashboardBreachedSpeed(speedMPH))
            )
        )
    )
}

function defineCarChallenges() {
    for challenge in carChallenges {
        ok = false
        arcadeMode = false
        achTitle = challenge["name"]
        achDescription = ""
        achPoints = challenge["points"]

        conditions = [
            __ornext(any_of(challenge["carIds"], carId => inGamePlayerCarId == carId))
        ]

        if (length(challenge["trackIds"]) > 0) {
            array_push(conditions, __ornext(any_of(challenge["trackIds"], trackId => inGameTrackId == trackId)))
        }
        if (length(challenge["eventStringIds"]) > 0) {
            array_push(conditions, __ornext(any_of(challenge["eventStringIds"], function cb(eventStringId) {
                return any_of(eventMeta[eventStringId]["events"], eventPack => inGameEventId == eventPack[1])
            })))
        }

        if (challenge["colorId"] != -1) {
            array_push(conditions, inGamePlayerCarColorId == challenge["colorId"])
        }

        if (challenge["type"] == "aSpecHunt" || challenge["type"] == "aSpecHuntPrius" || challenge["type"] == "eventWin") {

            if (challenge["type"] == "eventWin") {
                if (challenge["raceIndex"] != -1) {
                    array_push(conditions, hasWonRaceEvent(
                        challenge["eventStringIds"][0],
                        raceIndex = challenge["raceIndex"],
                        aSpecRequirement = challenge["target"],
                        forbiddenCarIds = [],
                        nosAllowed = true,
                        requiredCarIds = challenge["carIds"]
                    ))
                } else {
                    array_push(conditions, any_of(challenge["eventStringIds"], eventStringId => hasWonRaceEvent(
                        eventStringId,
                        -1,
                        aSpecRequirement = challenge["target"],
                        forbiddenCarIds = [],
                        nosAllowed = true,
                        requiredCarIds = challenge["carIds"]
                    )))
                }
            } else {
                array_push(conditions, hasWonRaceInASpec(aSpecRequirement = challenge["target"]))
            }

            achDescription = format("Earn {0} A-Spec points or more in ", challenge["target"])
            if (length(challenge["fullDescription"]) > 0) {
                achDescription = challenge["fullDescription"]
            } else if (length(challenge["description"]) > 0) {
                achDescription = achDescription + challenge["description"] + "."
            } else {
                achDescription = achDescription + carIdToString[challenge["carIds"][0]] + "."
            }

            if (challenge["type"] == "aSpecHuntPrius") {
                array_push(conditions, (
                    gameFlag == GAME_FLAG_ARCADE_RACE ||
                    ((gtModePlayerGearboxId == 0xE28 || gtModePlayerGearboxId == 0xE29) && (gameFlag == GAME_FLAG_RACE_EVENT || gameFlag == GAME_FLAG_CHAMPIONSHIP))
                ))
            } else if (challenge["laps"] > 0) {
                array_push(conditions, gameFlag == GAME_FLAG_ARCADE_RACE && inGameLapsToGo >= challenge["laps"])
            } else if (challenge["type"] == "aSpecHunt") {
                array_push(
                    conditions,
                    __ornext(any_of([GAME_FLAG_ARCADE_RACE, GAME_FLAG_RACE_EVENT, GAME_FLAG_CHAMPIONSHIP], f => gameFlag == f))
                )
            }

            achievement(
                title = achTitle,
                description = achDescription,
                points = achPoints,
                trigger = all_of(conditions, c => c)
            )
        } else if (challenge["type"] == "arcadeTimeTrial" || challenge["type"] == "autoUnionTimeTrial") {
            if (challenge["gearbox"] == "manual") {
                array_push(conditions, arcadeTransmission == 1)
            }

            if (challenge["aid"] == "none") {
                array_push(conditions, arcadeDrivingAids == 0)
            }

            if (challenge["type"] == "arcadeTimeTrial") {
                array_push(conditions, (
                    gameFlag == GAME_FLAG_ARCADE_TIME_TRIAL &&
                    arcadeFrontTires == TIRES[challenge["tires"]] &&
                    arcadeRearTires == TIRES[challenge["tires"]] &&
                    arcadePowerAdjust == challenge["powerTune"] &&
                    arcadeWeightAdjust == 0 &&
                    arcadeTopSpeedAdjust == challenge["topSpeedTune"]
                ))
            } else if (challenge["type"] == "autoUnionTimeTrial") {
                array_push(conditions, (
                    gameFlag == GAME_FLAG_FREE_RUN &&
                    gtModePlayerTurbineId == 2333 &&
                    gtModePlayerFrontTiresId == 0xDE1B &&
                    gtModePlayerRearTiresId == 0xDE15 &&
                    playerCarWeightBallast == 0
                ))
            }

            startingConditions = (
                all_of(conditions, c => c) &&
                isInASpecMode() &&

                // HACK: new lap doesn't exactly reset this timer to 0, so give it some error margin
                prev(inGameCurrentLapTimeInMsecByHUD) > 0 &&
                prev(inGameCurrentLapTimeInMsecByHUD) <= 0x3F &&
                inGameCurrentLapTimeInMsecByHUD > 0x3F
            )

            resetConditions = (
                hasWentOut() ||
                !isInASpecMode()
            )

            achievement(
                title = achTitle,
                description = challenge["fullDescription"],
                points = achPoints,
                trigger = (
                    once(startingConditions) &&
                    never(
                        resetConditions ||
                        inGameCurrentLapForPlayer > challenge["target"]
                    ) &&
                    trigger_when(
                        hasCompletedALap() &&
                        inGameLastLapTimeInMsec <= challenge["target"]
                    )
                )
            )

            leaderboard(
                title = achTitle,
                description = "Fastest time in msec to complete this achievement",
                start = startingConditions,
                cancel = resetConditions,
                submit = hasCompletedALap(),
                value = inGameLastLapTimeInMsec,
                lower_is_better = true,
                format = "VALUE"
            )
        } else if (challenge["type"] == "oneLap") {
            achievement(
                title = achTitle,
                description = challenge["fullDescription"],
                points = achPoints,
                trigger = (
                    all_of(conditions, c => c) &&
                    isInASpecMode() &&
                    gameFlag == GAME_FLAG_ARCADE_TIME_TRIAL &&
                    hasCompletedALap()
                )
            )
        }
    }
}

achievement(
    title = "Bully",
    description = "Lap all of your opponents on any Sunday Cup event and finish first.",
    points = 5,
    trigger = (
        hasWonRaceEvent("am_sunday") &&

        all_of(range(1, 5), i => (tbyte(inGameCurrentLapForCarAddress(0)) - tbyte(inGameCurrentLapForCarAddress(i))) >= 2)
    )
)

achievement(
    title = "Hold Your Horses",
    description = "Overtake the Pace Car in any License test.",
    points = 2,
    trigger = (
        gameFlag == GAME_FLAG_LICENSE &&
        isInASpecMode() &&
        prev(inGamePlayerPositionByHUD) == 2 && inGamePlayerPositionByHUD == 1 &&
        inGameGridCarId(1) == 0x1ED // check for pace car presence, otherwise your own ghost may cause false trigger
    )
)

achievement(
    title = "Adverse Camber Reigns",
    description = "Win any Tuning Car Grand Prix event with all of your wheels camber tuned to 10 deg or more.",
    points = 5,
    trigger = (
        hasWonRaceEvent("pr_tuning", triggerFlag = true) &&
        playerCarFrontCamber >= 100 &&
        playerCarRearCamber >= 100
    )
)

achievement(
    title = "Underdog Racing",
    description = "Earn 200 A-Spec points in any race except for Speedster Trophy and 206 Cup. Family Cup and Arcade mode are allowed. Driving Dodge RAM, Chaparal 2J, or having nitrous is not allowed.",
    points = 25,
    trigger = (
        hasWonRaceInASpec(aSpecRequirement = 200)
        && inGamePlayerCarId != CAR_ID_DODGE_RAM
        && inGamePlayerCarId != CAR_ID_CHAPARAL_2J
        && (
            gameFlag == GAME_FLAG_ARCADE_RACE || (
            __ornext(any_of([GAME_FLAG_RACE_EVENT, GAME_FLAG_CHAMPIONSHIP], f => gameFlag == f))
            && all_of(["de_opel_speed", "fr_peugeot_206"], function cb(eventStringId) {
                return all_of(eventMeta[eventStringId]["events"], ev => inGameEventId != ev[1])
            })
            && gtModePlayerNOSId == -1
        ))
    )
)

defineSpeedAchievement(
    title = "Fast Made Mundane",
    description = "Drive fast enough and go above 300 km/h (186 mp/h).",
    points = 2, speedKPH = 300, speedMPH = 186
)
defineSpeedAchievement(
    title = "Serious Business Speed",
    description = "Drive an insanely fast car and send it above 400 km/h (249 mp/h).",
    points = 3, speedKPH = 400, speedMPH = 249
)
defineSpeedAchievement(
    title = "It's Time to Stop",
    description = "Devilishly tune an insanely fast car and send it extremely hard above 500 km/h (311 mp/h).",
    points = 5, speedKPH = 500, speedMPH = 311
)

achievement(
    title = "Bob the Driver",
    description = "Win any race in B-Spec mode.",
    points = 1,
    trigger = (
        any_of([GAME_FLAG_ARCADE_RACE, GAME_FLAG_CHAMPIONSHIP, GAME_FLAG_RACE_EVENT], f => gameFlag == f) &&
        inGameBSpecActive == 1 &&
        hasFinishedRace() &&
        inGameLapsToGo - inGameCurrentLapForPlayer == 0 &&
        all_of(range(1, 5), i => inGameLapsToGo - dword(inGameCurrentLapForCarAddress(i)) > 0)
    )
)

achievement(
    title = "Whoosh!",
    description = "Do a less than 8 seconds run on a Las Vegas Drag Strip while using manual transmission.",
    points = 5,
    trigger = (
        gameFlag == GAME_FLAG_POWER_AND_SPEED &&
        inGameEventId == 0xCEC &&
        inGameLastLapTimeInMsec < 8000 &&
        transmission == 0
    )
)

defineRaceEvents()
defineLicenseEvents()
defineMissionEvents()
defineCarChallenges()

// =============
// RICH PRESENCE
// =============

function defineRichPresence() {

    homeCarLookup = rich_presence_lookup("Car", gtModePlayerCarLabelId, carIdToString, fallback = "- -")
    carLookup = rich_presence_lookup("Car", inGamePlayerCarId, carIdToString)
    trackLookup = rich_presence_lookup("Track", inGameTrackId, trackIdToString)
    eventLookup = rich_presence_lookup("Event", inGameEventId, eventIdToString)

    isCoffeeBreak = dword(subEventStringAddress) == 0x3063306C
    licenseLetterLookup = rich_presence_lookup("LicenseLetter", dword(subEventStringAddress), {
        0x3062306C: "B",
        0x3061306C: "A",
        0x3062696C: "IB",
        0x3061696C: "IA",
        0x3073306C: "S"
    })

    licenseColorLookup = rich_presence_lookup("LicenseColor", dword(subEventStringAddress), {
        0x3062306C: "🟩",
        0x3061306C: "🟨",
        0x3062696C: "🟦",
        0x3061696C: "🟥",
        0x3073306C: "🟪"
    })

    function usernameChar(idx) {
        address = dword(0x622f4c) + 0x350

        return rich_presence_macro("ASCIIChar", byte(address + idx))
    }

    function defineHasLicenseLookup(license, emoji, region, whiteSpacePrefix = false) {
        bits = []
        for x in licenseMeta {
            meta = licenseMeta[x]
            if (meta["license"] == license && meta["isCoffee"] == false) {
                array_push(bits, meta["flags"][region])
            }
        }

        if (whiteSpacePrefix == true) {
            emoji = " " + emoji
        }

        return rich_presence_lookup(
            "License_" + license,
            sum_of(bits, x => bit0(x)),
            { 16: emoji }
        )
    }

    rich_presence_conditional_display(
        gameFlag == GAME_FLAG_ARCADE_RACE,

        "[🏁 Arcade Race] 📍 {0} 🚗 {1}",
        trackLookup,
        carLookup
    )

    rich_presence_conditional_display(
        gameFlag == GAME_FLAG_RACE_MEETING,

        "[🏁 Race Meeting] 📍 {0} 🚗 {1}",
        trackLookup,
        carLookup
    )

    rich_presence_conditional_display(
        gameFlag == GAME_FLAG_ARCADE_TIME_TRIAL,

        "[⏱ Arcade Time Trial] 📍 {0} 🚗 {1}",
        trackLookup,
        carLookup
    )

    rich_presence_conditional_display(
        gameFlag == GAME_FLAG_LICENSE && isCoffeeBreak,

        "[☕ {0}{1}{2}{3}{4}{5}{6}{7}{8}{9}] Coffee Break {12}{13} {10} 🚗 {11}",
        usernameChar(0), usernameChar(1), usernameChar(2), usernameChar(3), usernameChar(4),
        usernameChar(5), usernameChar(6), usernameChar(7), usernameChar(8), usernameChar(9),

        eventLookup,
        carLookup,
        rich_presence_macro("ASCIIChar", byte(subEventStringAddress + 0x5)),
        rich_presence_macro("ASCIIChar", byte(subEventStringAddress + 0x6))
    )

    rich_presence_conditional_display(
        gameFlag == GAME_FLAG_LICENSE,

        "[🔰 {0}{1}{2}{3}{4}{5}{6}{7}{8}{9}] {10} {11}-{12}{13} {14} 🚗 {15}",
        usernameChar(0), usernameChar(1), usernameChar(2), usernameChar(3), usernameChar(4),
        usernameChar(5), usernameChar(6), usernameChar(7), usernameChar(8), usernameChar(9),

        licenseColorLookup,
        licenseLetterLookup,

        rich_presence_macro("ASCIIChar", byte(subEventStringAddress + 0x5)),
        rich_presence_macro("ASCIIChar", byte(subEventStringAddress + 0x6)),

        eventLookup,
        carLookup
    )

    rich_presence_conditional_display(
        gameFlag == GAME_FLAG_MISSION,

        "[🎯 {0}] 🚗 {1}",
        eventLookup,
        carLookup
    )

    rich_presence_conditional_display(
        gameFlag == GAME_FLAG_FREE_RUN,

        "[⏱ Free Run] 📍 {0} 🚗 {1}",
        trackLookup,
        carLookup,
        eventLookup
    )

    rich_presence_conditional_display(
        gameFlag == GAME_FLAG_POWER_AND_SPEED,

        "[⏱ {1}] 🚗 {0}",
        carLookup,
        eventLookup
    )

    rich_presence_conditional_display(
        gameFlag == GAME_FLAG_PHOTO_DRIVE,

        "[📸 {0}] 🚗 {1}",
        trackLookup,
        carLookup
    )

    rich_presence_conditional_display(
        gameFlag == GAME_FLAG_PHOTO_SCENE,

        "[📸 {0}{1}{2}{3}{4}{5}{6}{7}{8}{9}] 🚗 {10}",

        usernameChar(0), usernameChar(1), usernameChar(2), usernameChar(3), usernameChar(4),
        usernameChar(5), usernameChar(6), usernameChar(7), usernameChar(8), usernameChar(9),

        carLookup
    )

    rich_presence_conditional_display(
        gameFlag == GAME_FLAG_RACE_EVENT || gameFlag == GAME_FLAG_CHAMPIONSHIP,

        "[🏁 {0}] 📍 {1} 🚗 {2}",
        eventLookup,
        trackLookup,
        carLookup
    )

    for region in ["pal", "ntsc"] {
        regionCondition = isRunningPAL
        if (region == "ntsc") {
            regionCondition = isRunningNTSC
        }

        rich_presence_conditional_display(
            regionCondition &&
            gameFlag == GAME_FLAG_MENUS &&
            matchString(menuProjectAddress, menuProjectStringConditions["gtmode"]),

            "[🏠 {0}{1}{2}{3}{4}{5}{6}{7}{8}{9}{12}{13}{14}{15}{16}] 🚗 {10} 📅 Day {11} | {17} km ",

            usernameChar(0), usernameChar(1), usernameChar(2), usernameChar(3), usernameChar(4),
            usernameChar(5), usernameChar(6), usernameChar(7), usernameChar(8), usernameChar(9),

            homeCarLookup,
            rich_presence_macro("Number", gtModeDateJulian - 2453461),

            defineHasLicenseLookup("B",  "🟩", region, whiteSpacePrefix = true),
            defineHasLicenseLookup("A",  "🟨", region),
            defineHasLicenseLookup("IB", "🟦", region),
            defineHasLicenseLookup("IA", "🟥", region),
            defineHasLicenseLookup("S",  "🟪", region),

            rich_presence_macro("Number", gtModeASpecMileage / 1000)
        )
    }

    rich_presence_display("Playing Gran Turismo 4")
}

// TODO ISSUE: If you define this rich presence with any trigger_when present,
// RATools will spend too much time processing the script
// defineRichPresence()