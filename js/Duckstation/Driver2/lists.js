export const pursuits = /** @type {const} */ ([
    [0x46, 10, 'Chicago'],
    [0x4e, 5, 'Havana'],
    [0x56, 10, 'Las Vegas'],
    [0x5e, 10, 'Rio'],
])

export const getaways = /** @type {const} */ ([
    [0x66, 'Chicago - Downtown'],
    [0x67, 'Chicago - Wrigleyville'],
    [0x6e, 'Havana - Necropolis de Colo'],
    [0x6f, 'Havana - Capitolo'],
    [0x76, 'Las Vegas - Downtown'],
    [0x77, 'Las Vegas - Upper Strip'],
    [0x7e, 'Rio - Centro'],
    [0x7f, 'Rio - Copacabana', 'damageOk'],
])

export const gateRaces = /** @type {const} */ ([
    [0x86, 'Chicago - Greektown'],
    [0x87, 'Chicago - Grant Park'],
    [0x8e, 'Havana - Necropolis de Colon'],
    [0x8f, 'Havana - Old Havana'],
    [0x96, 'Las Vegas - Lakeside'],
    [0x97, 'Las Vegas - Mid Strip'],
    [0x9e, 'Rio - Copacabana'],
    [0x9f, 'Rio - Santa Tereza'],
])

export const trailblzers = /** @type {const} */ ([
    [0x104, 'Chicago - Grant Park'],
    [0x105, 'Chicago - Downtown'],
    [0x10c, 'Havana - Old Havana'],
    [0x10d, 'Havana - Vedado'],
    [0x114, 'Las Vegas - Downtown'],
    [0x115, 'Las Vegas - Upper Strip'],
    [0x11c, 'Rio - Leblon'],
    [0x11d, 'Rio - Praca da Bandeira'],
])

export const checkpointRaces = /** @type {const} */ ([
    [0xc4, '01:29.00', 10, 'Chicago - Downtown'],
    [0xc5, '00:59.50', 5, 'Chicago - Meigs Field'],
    [0xcc, '00:58.20', 10, 'Havana - The Docks'],
    [0xcd, '01:57.00', 5, 'Havana - Old Havana'],
    [0xd4, '01:17.77', 5, 'Las Vegas - North Vegas'],
    [0xd5, '01:09.99', 5, 'Las Vegas - Lakeside'],
    [0xdc, '01:46.50', 5, 'Rio - Lagoa Rodrigo de Freitas'],
    [0xdd, '01:28.00', 5, 'Rio - Praca da Bandeira'],
])

export const survivalRaces = /** @type {const} */ ([
    [0x124, 25, 'Chicago'],
    [0x12c, 30, 'Havana'],
    [0x134, 30, 'Las Vegas', 'no-leaderboard'],
    [0x13c, 30, 'Rio', 'no-leaderboard'],
])

export const secretRaces = /** @type {const} */ ([
    [[0x1e0, 0x1e1], '01:30.00', 10, 'Secret Mountain Pass', 'lapTime'],
    [[0x1e2, 0x1e3], '02:15.00', 5, 'Secret Race Track'],
])

export const secretCars = /** @type {const} */ ([
    [
        [0x32, 0x33],
        [ 0x1194, 0x11301000, 0x31 ],
        'Chicago Secret Car',
        'Chicago',
        'Take a Drive and get inside secret car in Chicago Stadium',
        {
            title: 'Cannonball Chicago',
            description: 'After getting inside the secret car in Chicago Stadium, deliver it to the Airport, near the aircraft. No tail',
            coords: {
                top: 0xFFF9ED1B,
                bottom: 0xFFF97300,
                left: 0x1E4A6,
                right: 0x1F7BF
            }
        }
    ],
    [
        [0x34, 0x35],
        [ 0x1000, 0xaf01000, 0x21 ],
        'Havana Secret Car',
        'Havana',
        'Take a Drive and get inside secret car in Havana Underground Parking',
        {
            title: 'Mini Delivery',
            description: 'After getting inside the secret car in Havana underground parking, deliver it to South-Eastern Docks. No tail',
            coords: {
                top: 0xFFFAF4F6,
                bottom: 0xFFFA7200,
                left: 0x51C00,
                right: 0x55E00
            }
        }
    ],
    [
        [0x36, 0x37],
        [ 0x1000, 0x10001000, 0xFF82002B, 0x0D ],
        'Las Vegas Secret Truck',
        'LasVegas',
        'Take a Drive and get inside secret truck in Las Vegas',
        {
            title: 'Cannonball Las Vegas',
            description: 'After getting inside the secret truck in Las Vegas, deliver it to Ruins north-west of Ghost Town, near the Train Tunnel. No tail',
            coords: {
                top: 0xD9500,
                bottom: 0xD7B00,
                left: 0xFFFF1000,
                right: 0xFFFF2300
            }
        }
    ],
    [
        [0x38, 0x39],
        [ 0x0B54, 0x0ED81000, 0x47 ],
        'Rio Secret Truck',
        'Rio',
        'Take a Drive and get inside the secret truck in Rio. What are you gonna do with it?'
    ],
])