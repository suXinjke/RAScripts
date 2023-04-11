// Gran Turismo 4 Prologue
// #ID = 3050

// ====================
//  CONSTANTS AND META
// ====================

carNames = {
    0x1D: "Suzuki ALTO WORKS SUZUKI SPORTS LIMITED(J) `97",
    0x21: "Suzuki Cappuccino `92",
    0x38: "Subaru IMPREZA Rally Car (GD Type-II) `03",
    0x3A: "Subaru IMPREZA WRX STi `02",
    0x3E: "Mitsubishi LANCER Evolution VIII `03",
    0x42: "Daihatsu Mira TR-XX AVANZATO R(J) `97",
    0x44: "Honda NSX Type S Zero(J) `97",
    0x4A: "Nissan SKYLINE GT-R Vspec II(R32) `94",
    0x4E: "Nissan SILVIA K's AERO (S14) `96",
    0x59: "Toyota PRIUS Hatchback Toyota Hybrid Synergy Drive `03",
    0x76: "Subaru LEGACY Touring Wagon 2.0GT SpecB(J) `03",
    0x77: "Subaru LEGACY B4 2.0GT SpecB(J) `03",
    0x78: "Subaru IMPREZA SEDAN WRX STi Version VI (GC,J) `99",
    0x79: "Subaru IMPREZA Rally Car (GC) `99",
    0x7D: "Subaru LEGACY Sports Tourer 3.0R `03",
    0x7E: "Subaru LEGACY Saloon 3.0R `03",
    0x81: "Honda HSC (37th Tokyo Motor Show Concept Car) `03",
    0x84: "Honda ODYSSEY L Type(J) `03",
    0x89: "Honda BEAT(J) `91",
    0x8A: "Honda TAKATA DOME NSX (JGTC#18) `03",
    0x91: "Daihatsu Copen Active Top(J) `02",
    0x94: "Honda Spoon Fit Race Car `03",
    0x95: "Mazda KUSABI `03",
    0x98: "Mitsubishi LANCER Evolution VIII MR(J) `03",
    0x9B: "Mitsubishi i `03",
    0x9F: "Nissan SKYLINE Coupe 350GT (V35,J) `03",
    0xA1: "Nissan XANAVI NISMO GT-R (JGTC#23) `03",
    0xA2: "Subaru CUSCO SUBARU ADVAN IMPREZA (JGTC#77) `03",
    0xA3: "Suzuki CONCEPT-S2 `03",
    0xA6: "Toyota bB Z 1.5 X Version 2WD(J) `00",
    0xA8: "Toyota ist 1.5S 2WD(J) `02",
    0xA9: "Toyota WOODONE TOM'S SUPRA (JGTC#36) `03",
    0xB2: "Volkswagen Lupo GTI Cup Car `03",
    0xC1: "Toyota CELICA SS-II Tuning Car (ZZT231) `03",
    0xC3: "Toyota CELICA GT-FOUR Rally Car `95",
    0xC6: "Mitsubishi COLT `02",
    0xCA: "Lotus Elise Sport 190 `98",
    0xCB: "Honda INTEGRA Type R 98 spec(J) `98",
    0xCC: "Honda CIVIC Type R (EK,J) `98",
    0xCD: "Mazda RX-7(J) `02",
    0xCE: "Mazda RX-8 `03",
    0xCF: "Toyota MR2 GT-S (SW20,J) `97",
    0xD0: "Dodge Viper GTS `99",
    0xD1: "Mercedes-Benz SL55 AMG `02",
    0xD2: "Nissan SKYLINE GT-R Vspec II Nur(R34) `02",
    0xD3: "Mitsubishi LANCER Evolution V `98",
    0xD4: "Ford GT `02",
    0xD5: "Honda Spoon CIVIC Type R (EK) `99",
    0xD6: "Honda Spoon S2000 Race Car `00",
    0xD7: "Nissan Fairlady Z Z-tune (Z33,J) `03",
    0xD8: "BMW McLaren F1 GTR FINA (Long Version) `97",
    0xD9: "Ford Focus Rally Car `99",
    0xDA: "Lancia Delta HF Integrale Rally Car `92",
    0xDB: "Toyota Motor Triathlon Race Car",
    0xDF: "Mitsubishi LANCER Evolution IV Rally Car `97",
    0xF9: "BMW Concept M5",
    0x111: "Honda JAZZ `01",
    0x112: "Honda S2000 `03",
    0x113: "Mazda 2 `03",
    0x114: "Mazda MX-5 `89",
    0x115: "Nissan MICRA 12c 5door (K12) `03",
    0x116: "Nissan 350Z Roadster `03",
    0x117: "Nissan 240ZG `71",
    0x118: "Toyota YARIS 1.5 16v VVT-i `00"
}

trackNames = {
    0x6B757374: "Tsukuba Circuit",
    0x7977656E: "New York",
    0x6E617267: "Grand Canyon",
    0x63736966: "Fuji Speedway",
    0x69737361: "Italian Street Course"
}

licenseNames = {
    0x31303030: "Learning the Basics of Steering 1",
    0x32303030: "Learning the Basics of Steering 2",
    0x33303030: "Braking for Beginners",
    0x34303030: "Knowing Cornering Speed Limits",
    0x35303030: "Learning the Basics of Steering 3",
    0x36303030: "Basics of Driving on a Dirt Surface 1",
    0x37303030: "Memorising the Course 1",
    0x38303030: "Basic Cornering",
    0x39303030: "Racing Line Through an S-Bend 1",
    0x30313030: "Basics of Driving on a Dirt Surface 2",
    0x37333030: "Coffee Break 1",
    0x31313030: "High Speed Braking",
    0x32313030: "Racing Line Through an S-Bend 2",
    0x33313030: "Memorising the Course 2",
    0x34313030: "Special Cornering Techniques",
    0x35313030: "Taking 90deg Corners on a Street Course",
    0x36313030: "High Speed Braking and Cornering",
    0x38333030: "Coffee Break 2",
    0x37313030: "Mid/High Speed Driving on a Dirt Surface",
    0x38313030: "Strategies for Difficult Corners",
    0x39313030: "Tackling a Beginner’s Course",
    0x30323030: "Memorising the Course 3",
    0x31323030: "Strategies for Tackling S-Bends",
    0x32323030: "Strategies for Tackling a Street Course",
    0x33323030: "Accelerating With High-Powered Cars",
    0x39333030: "Coffee Break 3",
    0x34323030: "Vehicle Control on a Dirt Surface",
    0x35323030: "High-Speed Cone Slalom",
    0x36323030: "Basics of Overtaking 1",
    0x37323030: "Basics of Overtaking 2",
    0x38323030: "Basics of Overtaking 3",
    0x39323030: "Racing Practice 1",
    0x30343030: "Coffee Break 4",
    0x30333030: "Racing Practice 2",
    0x31333030: "Racing Practice 3",
    0x32333030: "Racing Practice 4",
    0x33333030: "Racing Practice 5",
    0x34333030: "Racing Practice 6",
    0x35333030: "Racing Practice 7",
    0x36333030: "Fuel Conserving Time Trial",
    0x36343030: "Coffee Break 5",
    0x31343030: "Tsukuba Circuit Time Trial",
    0x32343030: "Fuji International Speedway Time Trial",
    0x33343030: "New York Street Course Time Trial",
    0x34343030: "Grand Canyon Rally Time Trial",
    0x35343030: "Italian Street Course Time Trial"
}

licenseNames = {
    0x31303030: "Learning the Basics of Steering 1",
    0x32303030: "Learning the Basics of Steering 2",
    0x33303030: "Braking for Beginners",
    0x34303030: "Knowing Cornering Speed Limits",
    0x35303030: "Learning the Basics of Steering 3",
    0x36303030: "Basics of Driving on a Dirt Surface 1",
    0x37303030: "Memorising the Course 1",
    0x38303030: "Basic Cornering",
    0x39303030: "Racing Line Through an S-Bend 1",
    0x30313030: "Basics of Driving on a Dirt Surface 2",
    0x37333030: "Coffee Break 1",
    0x31313030: "High Speed Braking",
    0x32313030: "Racing Line Through an S-Bend 2",
    0x33313030: "Memorising the Course 2",
    0x34313030: "Special Cornering Techniques",
    0x35313030: "Taking 90deg Corners on a Street Course",
    0x36313030: "High Speed Braking and Cornering",
    0x38333030: "Coffee Break 2",
    0x37313030: "Mid/High Speed Driving on a Dirt Surface",
    0x38313030: "Strategies for Difficult Corners",
    0x39313030: "Tackling a Beginner’s Course",
    0x30323030: "Memorising the Course 3",
    0x31323030: "Strategies for Tackling S-Bends",
    0x32323030: "Strategies for Tackling a Street Course",
    0x33323030: "Accelerating With High-Powered Cars",
    0x39333030: "Coffee Break 3",
    0x34323030: "Vehicle Control on a Dirt Surface",
    0x35323030: "High-Speed Cone Slalom",
    0x36323030: "Basics of Overtaking 1",
    0x37323030: "Basics of Overtaking 2",
    0x38323030: "Basics of Overtaking 3",
    0x39323030: "Racing Practice 1",
    0x30343030: "Coffee Break 4",
    0x30333030: "Racing Practice 2",
    0x31333030: "Racing Practice 3",
    0x32333030: "Racing Practice 4",
    0x33333030: "Racing Practice 5",
    0x34333030: "Racing Practice 6",
    0x35333030: "Racing Practice 7",
    0x36333030: "Fuel Conserving Time Trial",
    0x36343030: "Coffee Break 5",
    0x31343030: "Tsukuba Circuit Time Trial",
    0x32343030: "Fuji International Speedway Time Trial",
    0x33343030: "New York Street Course Time Trial",
    0x34343030: "Grand Canyon Rally Time Trial",
    0x35343030: "Italian Street Course Time Trial"
}

licenseMeta = {
    "l0p0001": {
        "description": "Your first experience of circuit racing on a Beginner's course",
        "points": 1,
        "pointsGold": 2,
        "rewardRequirement": 109000,
        "rewardRequirementFormatted": "1'49.000",
        "licenseId32Bit": 0x31303030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0002": {
        "description": "Cone-slalom practice on the Fuji International Speedway",
        "points": 1,
        "pointsGold": 1,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x32303030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0003": {
        "description": "Bring your car to a halt in the stopping zone",
        "points": 1,
        "pointsGold": 1,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x33303030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0004": {
        "description": "How to balance car speed and steering techniques",
        "points": 1,
        "pointsGold": 1,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x34303030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0005": {
        "description": "Learn the 'out-in-out' cornering technique",
        "points": 2,
        "pointsGold": 3,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x35303030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0006": {
        "description": "Experience the dynamics of driving on a dirt surface",
        "points": 2,
        "pointsGold": 5,
        "rewardRequirement": 155000,
        "rewardRequirementFormatted": "2'35.000",
        "licenseId32Bit": 0x36303030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0007": {
        "description": "The intricacies of driving on Tsukuba race circuit",
        "points": 3,
        "pointsGold": 5,
        "rewardRequirement": 178000,
        "rewardRequirementFormatted": "2'58.000",
        "licenseId32Bit": 0x37303030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0008": {
        "description": "Practice the 2nd hairpin corner of the Tsukuba circuit",
        "points": 1,
        "pointsGold": 3,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x38303030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0009": {
        "description": "Try a straight racing line through consecutive bends",
        "points": 1,
        "pointsGold": 2,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x39303030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0010": {
        "description": "Learn the subtleties of drifting your car through corners",
        "points": 3,
        "pointsGold": 5,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x30313030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0037": {
        "description": "Knock over all cones in a figure-of-eight pattern",
        "points": 1,
        "pointsGold": 3,
        "rewardRequirement": 30000,
        "rewardRequirementFormatted": "0'30.000",
        "licenseId32Bit": 0x37333030,
        "goldAchievementName": "Caffè Latte",
        "goldCoffeeblurp": "Wasn't that easy?",
        "goldForLeaderboardRequired": false
    },
    "l0p0011": {
        "description": "Advanced braking with a high-powered car",
        "points": 1,
        "pointsGold": 2,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x31313030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0012": {
        "description": "Master the challenge of Fuji Speedway's B Corner",
        "points": 2,
        "pointsGold": 5,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x32313030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0013": {
        "description": "Face the challenge of the tricky New York course",
        "points": 5,
        "pointsGold": 10,
        "rewardRequirement": 205000,
        "rewardRequirementFormatted": "3'25.000",
        "licenseId32Bit": 0x33313030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0014": {
        "description": "Practice taking a hairpin corner on the New York course",
        "points": 2,
        "pointsGold": 3,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x34313030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0015": {
        "description": "Learn how to tackle these 90deg bends at high speed",
        "points": 2,
        "pointsGold": 5,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x35313030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0016": {
        "description": "How to handle Corner 1 of Fuji International Speedway",
        "points": 1,
        "pointsGold": 3,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x36313030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0038": {
        "description": "Knock over all cones in a random pattern",
        "points": 2,
        "pointsGold": 5,
        "rewardRequirement": 60000,
        "rewardRequirementFormatted": "1'00.000",
        "licenseId32Bit": 0x38333030,
        "goldAchievementName": "Mocha",
        "goldCoffeeblurp": "Was that fun?",
        "goldForLeaderboardRequired": false
    },
    "l0p0017": {
        "description": "Practice your drifting techniques at high speed",
        "points": 3,
        "pointsGold": 5,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x37313030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0018": {
        "description": "Learn how to find the clipping points on blind bends",
        "points": 3,
        "pointsGold": 5,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x38313030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0019": {
        "description": "Learn the correct rhythm of steering on a Beginner's course",
        "points": 2,
        "pointsGold": 5,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x39313030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0020": {
        "description": "Complexities of racing through narrow town streets",
        "points": 5,
        "pointsGold": 10,
        "rewardRequirement": 255000,
        "rewardRequirementFormatted": "4'15.000",
        "licenseId32Bit": 0x30323030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0021": {
        "description": "Tackle these tricky bends on the New York course",
        "points": 3,
        "pointsGold": 5,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x31323030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0022": {
        "description": "Blind cornering combined with inclines and declines",
        "points": 2,
        "pointsGold": 3,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x32323030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0023": {
        "description": "Learn control of acceleration without Traction Control",
        "points": 1,
        "pointsGold": 1,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x33323030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0039": {
        "description": "Knock over all cones aligned to the marked course",
        "points": 2,
        "pointsGold": 5,
        "rewardRequirement": 65000,
        "rewardRequirementFormatted": "1'05.000",
        "licenseId32Bit": 0x39333030,
        "goldAchievementName": "Flat White",
        "goldCoffeeblurp": "Enjoyable, right?",
        "goldForLeaderboardRequired": false
    },
    "l0p0024": {
        "description": "Practice rapid changes of direction at speed",
        "points": 2,
        "pointsGold": 3,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x34323030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0025": {
        "description": "Advanced vehicle control using steering and acceleration",
        "points": 3,
        "pointsGold": 5,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x35323030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0026": {
        "description": "Overtaking on the inside of a bend",
        "points": 2,
        "pointsGold": 2,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x36323030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0027": {
        "description": "Overtaking on a bend using the outside racing line",
        "points": 2,
        "pointsGold": 3,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x37323030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0028": {
        "description": "Overtaking using your opponent's slipstream",
        "points": 2,
        "pointsGold": 2,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x38323030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0029": {
        "description": "Racing practice using the Nissan 350Z",
        "points": 5,
        "pointsGold": 10,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x39323030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0040": {
        "description": "Knock over all cones whilst following the racing line",
        "points": 1,
        "pointsGold": 3,
        "rewardRequirement": 45000,
        "rewardRequirementFormatted": "0'45.000",
        "licenseId32Bit": 0x30343030,
        "goldAchievementName": "Cappuccino",
        "goldCoffeeblurp": "Was that nice?",
        "goldForLeaderboardRequired": false
    },
    "l0p0030": {
        "description": "Racing with a tuned front-wheel drive, front-engined car",
        "points": 3,
        "pointsGold": 5,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x30333030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0031": {
        "description": "Race with a tuned rear-wheel drive, front-engined car",
        "points": 3,
        "pointsGold": 5,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x31333030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0032": {
        "description": "Overtake 3 rival cars on the Tsukuba Circuit",
        "points": 5,
        "pointsGold": 10,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x32333030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": true
    },
    "l0p0033": {
        "description": "Overtake 3 rival cars on the Fuji International Speedway",
        "points": 5,
        "pointsGold": 10,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x33333030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": true
    },
    "l0p0034": {
        "description": "Overtake 3 rival cars on the New York course",
        "points": 5,
        "pointsGold": 10,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x34333030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": true
    },
    "l0p0035": {
        "description": "Get to the pole position using the BMW McLaren F1 GTR",
        "points": 5,
        "pointsGold": 10,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x35333030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": true
    },
    "l0p0036": {
        "description": "Use as little petrol as possible using the Prius hybrid car",
        "points": 5,
        "pointsGold": 10,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x36333030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0046": {
        "description": "Carefully manoeuvre your car through the cones",
        "points": 2,
        "pointsGold": 5,
        "rewardRequirement": 60000,
        "rewardRequirementFormatted": "1'00.000",
        "licenseId32Bit": 0x36343030,
        "goldAchievementName": "Americano",
        "goldCoffeeblurp": "Did you like it?",
        "goldForLeaderboardRequired": false
    },
    "l0p0041": {
        "description": "Remember the two tricky hairpins on the Tsukuba Circuit",
        "points": 5,
        "pointsGold": 10,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x31343030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0042": {
        "description": "High-speed racing at the Fuji International Speedway",
        "points": 5,
        "pointsGold": 10,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x32343030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0043": {
        "description": "Long straights and 90deg corners on the NY city course",
        "points": 5,
        "pointsGold": 10,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x33343030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0044": {
        "description": "Fine control of your car on a twisting dirt course",
        "points": 5,
        "pointsGold": 10,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x34343030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    },
    "l0p0045": {
        "description": "Skill and fine control through narrow town streets",
        "points": 5,
        "pointsGold": 10,
        "rewardRequirement": 4,
        "rewardRequirementFormatted": "",
        "licenseId32Bit": 0x35343030,
        "goldAchievementName": "",
        "goldCoffeeblurp": "",
        "goldForLeaderboardRequired": false
    }
}

GOLD = 2
SILVER = 3
BRONZE = 4

l0p = 0x70306C

tsuk = 0x6B757374
newy = 0x7977656E
gran = 0x6E617267
fisc = 0x63736966
assi = 0x69737361

raceTracks = [tsuk, newy, fisc]

TYRE_RACING = 0
TYRE_ROAD = 1
TYRE_SPORTS = 2
TYRE_NORMAL = 3

ARCADE_EASY = 0
ARCADE_HARD = 1
ARCADE_PRO  = 2

ARCADE_2_LAPS = 0
ARCADE_3_LAPS = 1
ARCADE_5_LAPS = 2

// ========
//  LOOKUP
// ========
arcadeDifficulty = dword(0x9388b0)
arcadeLaps = arcadeDifficulty
arcadeDrivingAids = dword(0x917a50)
arcadeTractionControl = dword(0x9388ac)
arcadeTyres = dword(0x917a54)
arcadeOpponents = dword(0x9388b4)
arcadeTrackStringId = dword(0x917944)
arcadePlayerCarColorIndex = dword(0x917a48)
arcadeTimeInMsec = dword(dword(dword(0x5acb70) + 0x404) + 0x364)
arcadeRaceInGamePointer = dword(dword(0x5acb70) + 0x3804)

licenseIdStringAddress = 0x917984
licenseState = dword(0x9c1aa0)
licenseTimeInMsec = dword(0x9c2518)

playerCarId = dword(0x9c23b0)

// =======
//   AUX
// =======

function isInLicense(licenseId) {
    return (
        tbyte(licenseIdStringAddress) == l0p &&
        dword(licenseIdStringAddress + 3) == licenseId
    )
}

function hasFinishedTheLicense(licenseId) {
    return (
        isInLicense(licenseId) &&

        prev(licenseState) == -2 &&
        licenseState <= BRONZE
    )
}

function hasFinishedArcadeRace() {
    flag = dword(arcadeRaceInGamePointer + 0x0)

    return prev(flag) == 0 && flag == 1 && dword(licenseIdStringAddress) != 0x3070306C
}

function hasFinishedArcadeRaceFirst() {
    racePosition = dword(dword(dword(0x5acb70) + 0x404) + 0x268)

    return (
        arcadeOpponents == 1 &&
        racePosition == 1 &&
        hasFinishedArcadeRace()
    )
}

function hasWonTheLicense(licenseId, rewardRequirement) {
    requirementCondition = licenseState >= GOLD && licenseState <= rewardRequirement
    if (rewardRequirement > BRONZE) {
        requirementCondition = licenseState <= BRONZE

        requirementCondition = requirementCondition && licenseTimeInMsec <= rewardRequirement
    }

    return (
        isInLicense(licenseId) &&

        prev(licenseState) == -2 && requirementCondition
    )
}

function hasWentOut() {
    return any_of([
        [ 0x159, 0x221, 0x2E9 ],
        [ 0x159, 0x221, 0x3B1 ],
        [ 0x159, 0x2E9, 0x3B1 ],
        [ 0x221, 0x2E9, 0x3B1 ],
    ], tires => all_of(tires, function cb(tire) {
        return byte(dword(0x9c23a8) + tire) > 0
    }))
}

function hasCrashed() {
    collisionMaybe = word(dword(0x9c23a8) + 0x5AC)
    penaltyTimer = word(dword(0x9c23a8) + 0x5AE)

    return (
        (prev(collisionMaybe) == 0 && collisionMaybe > 0) ||
        (prev(penaltyTimer) == 0 && penaltyTimer > 0)
    )
}

function hasCutFuji() {
    posX = float(dword(0x9c23a8) + 0x70)
    posY = float(dword(0x9c23a8) + 0x74)

    return (
        380.0 <= posX && posX <= 420 &&
        -98.0 <= posY && posY <= -92.0
    ) || (
        -777.0 <= posX && posX <= -770.0 &&
        21.0 <= posY && posY <= 23.0
    )
}

// ==============
//  ACHIEVEMENTS
// ==============

for licenseId in licenseMeta {
    licenseName = licenseNames[licenseMeta[licenseId]["licenseId32Bit"]]
    rewardRequirement = licenseMeta[licenseId]["rewardRequirement"]

    passedDescription = licenseMeta[licenseId]["description"]
    if (rewardRequirement > BRONZE) {
        passedDescription = format("{0}. Beat the time of {1}", licenseMeta[licenseId]["description"], licenseMeta[licenseId]["rewardRequirementFormatted"])
    }

    achievement(
        title = format("Passed - {0}", licenseName),
        description = passedDescription,
        points = licenseMeta[licenseId]["points"],
        trigger = hasWonTheLicense(
            licenseId = licenseMeta[licenseId]["licenseId32Bit"],
            rewardRequirement = licenseMeta[licenseId]["rewardRequirement"]
        )
    )

    goldTitle = format("Gold - {0}", licenseName)
    goldDescription = "Earn the Gold reward"
    if (length(licenseMeta[licenseId]["goldAchievementName"]) > 0) {
        goldTitle = licenseMeta[licenseId]["goldAchievementName"]
        goldDescription = format("Earn the Gold reward in {0}", licenseName)
    }
    if (length(licenseMeta[licenseId]["goldCoffeeblurp"]) > 0) {
        goldDescription = format("Earned the Golden Coffee for {0}. {1}", licenseName, licenseMeta[licenseId]["goldCoffeeblurp"])
    }

    achievement(
        title = goldTitle,
        description = goldDescription,
        points = licenseMeta[licenseId]["pointsGold"],
        trigger = hasWonTheLicense(
            licenseId = licenseMeta[licenseId]["licenseId32Bit"],
            rewardRequirement = GOLD
        )
    )

    leaderboardStartCondition = hasFinishedTheLicense(licenseMeta[licenseId]["licenseId32Bit"])
    leaderboardDescription = "Fastest time to complete in msec"
    if (licenseMeta[licenseId]["goldForLeaderboardRequired"] == true) {
        leaderboardStartCondition = hasWonTheLicense(licenseMeta[licenseId]["licenseId32Bit"], GOLD)
        leaderboardDescription = "Fastest time to finish 1st in msec"
    }


    leaderboard(
        title = licenseName,
        description = leaderboardDescription,
        start = (
            leaderboardStartCondition &&
            licenseTimeInMsec != 359999999 &&
            licenseTimeInMsec > 0
        ),
        cancel = byte(licenseIdStringAddress) == 0,
        submit = always_true(),
        value = licenseTimeInMsec,
        lower_is_better = true,
        format = "VALUE"
    )
}

function achievementWinArcadeRace(
    title,
    description,
    points,
    carIds,
    trackIds,
    minDifficulty = -1,
    expectedTires = -1,
    expectedColor = -1
) {

    additionalConditions = []
    if (minDifficulty != -1) {
        array_push(additionalConditions, arcadeDifficulty >= minDifficulty)
    }

    if (expectedTires != -1) {
        array_push(additionalConditions, arcadeTyres == expectedTires)
    }

    if (expectedColor != -1) {
        array_push(additionalConditions, arcadePlayerCarColorIndex == expectedColor)
    }

    achievement(
        title,
        description,
        points,
        trigger = (
            hasFinishedArcadeRaceFirst() &&
            any_of(trackIds, id => arcadeTrackStringId == id) &&
            any_of(carIds, id => playerCarId == id) &&
            all_of(additionalConditions, c => c)
        )
    )
}

function achievementWinArcadeTimeTrial(
    title,
    description,
    leaderboardDescription,
    points,
    carId,
    trackId,
    expectedTime = 0
) {

    additionalResetConditions = []
    if (trackId == tsuk || trackId == fisc) {
        array_push(additionalResetConditions, hasWentOut())
    }

    if (trackId == fisc) {
        array_push(additionalResetConditions, hasCutFuji())
    }

    if (trackId == assi || trackId == newy) {
        array_push(additionalResetConditions, hasCrashed())
    }

    // HACK: MR-2: no TCS and Driving Aids
    additionalStartConditions = []
    if (carId == 0xCF) {
        array_push(additionalStartConditions, arcadeTractionControl == 0)
        array_push(additionalStartConditions, arcadeDrivingAids == 0)
    }

    if (trackId != assi) {
      array_push(additionalStartConditions, arcadeOpponents == 0)
    }

    startConditions = (
        arcadeRaceInGamePointer != 0 &&
        prev(arcadeTimeInMsec) == 0 && arcadeTimeInMsec > 0 &&
        arcadeTrackStringId == trackId &&
        playerCarId == carId &&
        arcadeLaps == ARCADE_2_LAPS &&
        arcadeTyres == TYRE_NORMAL &&
        all_of(additionalStartConditions, c => c)
    )

    achievement(
        title,
        description,
        points,
        trigger = (
            once(startConditions) &&
            never(
                arcadeTimeInMsec == 0 ||
                arcadeTimeInMsec > expectedTime ||
                arcadeRaceInGamePointer == 0
            ) &&
            trigger_when(hasFinishedArcadeRace()) &&
            any_of(additionalResetConditions, c => never(c))
        )
    )

    leaderboard(
        title,
        description = leaderboardDescription,
        start = startConditions,
        cancel = (
            any_of(additionalResetConditions, c => c) ||
            arcadeTimeInMsec == 0 ||
            arcadeTimeInMsec == -1 ||
            arcadeRaceInGamePointer == 0
        ),
        submit = hasFinishedArcadeRace(),
        value = arcadeTimeInMsec,
        lower_is_better = true,
        format = "VALUE"
    )
}

achievementWinArcadeRace(
    title = "240ZG Race",
    description = "Win any race in Arcade mode while driving Nissan 240ZG `71",
    points = 2,
    carIds = [0x117],
    trackIds = raceTracks
)

achievementWinArcadeRace(
    title = "Silvia / Integra Race",
    description = "Win any race in Arcade mode while driving Nissan SILVIA K's AERO (S14) `96 or Honda INTEGRA Type R 98 spec(J) `98",
    points = 2,
    carIds = [0x4E, 0xCB],
    trackIds = raceTracks
)

achievementWinArcadeRace(
    title = "Skyline Race",
    description = "Win any race in Arcade mode while driving any of Nissan Skyline road cars with NORMAL tyres",
    points = 2,
    carIds = [0x9F, 0xD2, 0x4A],
    trackIds = raceTracks,
    expectedTires = TYRE_NORMAL
)

achievementWinArcadeRace(
    title = "Legacy Race",
    description = "Win any race in Arcade mode while driving any of Subaru Legacy cars",
    points = 2,
    carIds = [0x76, 0x77, 0x7D, 0x7E],
    trackIds = raceTracks
)

achievementWinArcadeRace(
    title = "Rally Car Race",
    description = "Win New York race in Arcade mode on PRO difficulty while driving any of rally cars",
    points = 5,
    carIds = [0xDF, 0xC3, 0xD9, 0x79, 0x38, 0xDA],
    trackIds = [newy],
    minDifficulty = ARCADE_PRO
)

achievementWinArcadeRace(
    title = "JGTC Race",
    description = "Win Fuji Speedway race in Arcade mode on PRO difficulty while driving any of JGTC cars (except Cusco Impreza)",
    points = 5,
    carIds = [0x8A, 0xA1, 0xA9],
    trackIds = [fisc],
    minDifficulty = ARCADE_PRO
)

achievementWinArcadeRace(
    title = "Cappucino / Beat Race",
    description = "Win Tsukuba Circuit race in Arcade mode on PRO difficulty while driving Honda BEAT(J) `91 or Suzuki Cappuccino `92 with NORMAL tyres",
    points = 5,
    carIds = [0x89, 0x21],
    trackIds = [tsuk],
    minDifficulty = ARCADE_PRO,
    expectedTires = TYRE_NORMAL
)

achievementWinArcadeRace(
    title = "MX5 Race",
    description = "Win Tsukuba Circuit race in Arcade mode on PRO difficulty while driving Mazda MX-5 `89 with SPORTS tyres",
    points = 5,
    carIds = [0x114],
    trackIds = [tsuk],
    minDifficulty = ARCADE_PRO,
    expectedTires = TYRE_SPORTS
)

achievementWinArcadeRace(
    title = "Civic Race",
    description = "Win any race in Arcade mode on HARD difficulty or higher while driving any of Honda Civic cars with NORMAL tyres",
    points = 3,
    carIds = [0xCC, 0xD5],
    trackIds = raceTracks,
    minDifficulty = ARCADE_HARD,
    expectedTires = TYRE_NORMAL
)

achievementWinArcadeRace(
    title = "RX-7 / RX-8 Race",
    description = "Win any race in Arcade mode on HARD difficulty or higher while driving Mazda RX-7(J) `02 or Mazda RX-8 `03 with NORMAL tyres",
    points = 3,
    carIds = [0xCD, 0xCE],
    trackIds = raceTracks,
    minDifficulty = ARCADE_HARD,
    expectedTires = TYRE_NORMAL
)

achievementWinArcadeRace(
    title = "NSX Race",
    description = "Win any race in Arcade mode on HARD difficulty or higher while driving Honda NSX Type S Zero(J) `97 with NORMAL tyres",
    points = 3,
    carIds = [0x44],
    trackIds = raceTracks,
    minDifficulty = ARCADE_HARD,
    expectedTires = TYRE_NORMAL
)

achievementWinArcadeRace(
    title = "G T  P R O L O G U E",
    description = "Win New York race in Arcade mode on HARD difficulty or higher while driving DANDELION YELLOW MITSUBISHI LANCER EVOLUTION V `98 with NORMAL tyres",
    points = 3,
    carIds = [0xD3],
    trackIds = [newy],
    minDifficulty = ARCADE_HARD,
    expectedTires = TYRE_NORMAL,
    expectedColor = 0
)

achievementWinArcadeRace(
    title = "S2000 Race",
    description = "Win any race in Arcade mode while driving Honda S2000 `03",
    points = 2,
    carIds = [0x112],
    trackIds = raceTracks
)

achievementWinArcadeRace(
    title = "Toyota Motor Triathlon Race",
    description = "Win New York race in Arcade mode while driving Toyota Motor Triathlon Race Car with NORMAL tyres, the car you can get for golding Green lessons",
    points = 2,
    carIds = [0xDB],
    trackIds = [newy]
)

achievementWinArcadeRace(
    title = "BMW M5 Concept Race",
    description = "Win New York race in Arcade mode while driving BMW Concept M5 with NORMAL tyres, the car you can get for golding Orange lessons",
    points = 2,
    carIds = [0xF9],
    trackIds = [newy]
)

achievementWinArcadeRace(
    title = "Mitsubishi i Race",
    description = "Win Tsukuba Circuit race in Arcade mode while driving Mitsubishi i `03 with NORMAL tyres, the car you can get for golding Blue lessons",
    points = 2,
    carIds = [0x9B],
    trackIds = [tsuk]
)

achievementWinArcadeRace(
    title = "Suzuki Concept Race",
    description = "Win Tsukuba Circuit race in Arcade mode while driving Suzuki CONCEPT-S2 `03 with NORMAL tyres, the car you can get for golding Red lessons",
    points = 2,
    carIds = [0xA3],
    trackIds = [tsuk]
)

achievementWinArcadeTimeTrial(
    title = "Viper Time Trial",
    description = "Beat the time of 3'38.000 in New York Arcade mode Time trial, EASY difficulty, while driving Dodge Viper GTS `99 with NORMAL tyres, do not crash hard",
    leaderboardDescription = "New York / EASY / NORMAL Tyres",
    points = 5,
    carId = 0xD0,
    trackId = newy,
    expectedTime = 218000
)

achievementWinArcadeTimeTrial(
    title = "Elise Time Trial",
    description = "Beat the time of 2'14.000 on Tsukuba Circuit Arcade mode Time trial, EASY difficulty, while driving Lotus Elise Sport 190 `98 with NORMAL tyres, do not cut or go out",
    leaderboardDescription = "Tsukuba Circuit / EASY / NORMAL Tyres",
    points = 5,
    carId = 0xCA,
    trackId = tsuk,
    expectedTime = 134000
)

achievementWinArcadeTimeTrial(
    title = "HSC Time Trial",
    description = "Beat the time of 3'18.500 on Fuji Speedway Arcade mode Time trial, EASY difficulty, while driving Honda HSC (37th Tokyo Motor Show Concept Car) `03 with NORMAL tyres, the car you can get for golding Purple lessons, do not cut or go out",
    leaderboardDescription = "Fuji Speedway / EASY / NORMAL Tyres",
    points = 5,
    carId = 0x81,
    trackId = fisc,
    expectedTime = 198500
)

achievementWinArcadeTimeTrial(
    title = "MR-2 Time Trial",
    description = "Beat the time of 3'49.000 on Italian Street Course Arcade mode Time trial, EASY difficulty, while driving Toyota MR2 GT-S (SW20,J) `97 with NORMAL tyres, NO Driving Aids and NO traction control, do not crash hard",
    leaderboardDescription = "Italian Street Course / EASY / NORMAL Tyres",
    points = 5,
    carId = 0xCF,
    trackId = assi,
    expectedTime = 229000
)

// =============
// RICH PRESENCE
// =============

licenseLookup = rich_presence_lookup("License", dword(licenseIdStringAddress + 3), licenseNames)
carLookup = rich_presence_lookup("Car", playerCarId, carNames)
trackLookup = rich_presence_lookup("Track", arcadeTrackStringId, trackNames)

rich_presence_conditional_display(
    tbyte(licenseIdStringAddress) == 0x70306C,
    "🔰 Driving School - {0} | 🚗 {1}",
    licenseLookup,
    carLookup
)

rich_presence_conditional_display(
    dword(0x4f34a0) != 0 && arcadeTrackStringId != gran && arcadeTrackStringId != assi && arcadeOpponents == 1,
    "🏁 Arcade Race - {0} | 📍 {1} | 🚗 {2}",
    rich_presence_lookup("RaceDifficulty", arcadeLaps, {
        0: "EASY",
        1: "HARD",
        2: "PRO"
    }),
    trackLookup,
    carLookup
)

rich_presence_conditional_display(
    dword(0x4f34a0) != 0 && (arcadeOpponents == 0 || arcadeTrackStringId == gran || arcadeTrackStringId == assi),
    "⏱ Arcade Time Trial - {0} | 📍 {1} | 🚗 {2}",
    rich_presence_lookup("TimeTrialLaps", arcadeLaps, {
        0: "2 Laps",
        1: "3 Laps",
        2: "5 Laps"
    }),
    trackLookup,
    carLookup
)

rich_presence_display("In menus of Gran Turismo 4: Prologue")