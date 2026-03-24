const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function main() {
    await prisma.$executeRawUnsafe(`
        TRUNCATE TABLE
            "RaceResult",
            "Race",
            "Circuit",
            "Driver",
            "Team"
        RESTART IDENTITY CASCADE;
    `);

    console.log("bersihin data");

    const teamsData = [
        {
            name: "Red Bull Racing",
            base: "Milton Keynes, United Kingdom",
            principal: "Christian Horner",
        },
        {
            name: "Mercedes-AMG Petronas F1 Team",
            base: "Brackley, United Kingdom",
            principal: "Toto Wolff",
        },
        {
            name: "Scuderia Ferrari",
            base: "Maranello, Italy",
            principal: "Frederic Vasseur",
        },
        {
            name: "McLaren F1 Team",
            base: "Woking, United Kingdom",
            principal: "Andrea Stella",
        },
        {
            name: "Aston Martin Aramco F1 Team",
            base: "Silverstone, United Kingdom",
            principal: "Mike Krack",
        },
        {
            name: "BWT Alpine F1 Team",
            base: "Enstone, United Kingdom",
            principal: "Bruno Famin",
        },
        {
            name: "Visa Cash App RB F1 Team",
            base: "Faenza, Italy",
            principal: "Laurent Mekies",
        },
        {
            name: "Stake F1 Team Kick Sauber",
            base: "Hinwil, Switzerland",
            principal: "Alessandro Alunni Bravi",
        },
        {
            name: "MoneyGram Haas F1 Team",
            base: "Kannapolis, United States",
            principal: "Ayao Komatsu",
        },
        {
            name: "Williams Racing",
            base: "Grove, United Kingdom",
            principal: "James Vowles",
        },
    ];

    const createdTeams = await Promise.all(
        teamsData.map((team) => prisma.team.create({ data: team }))
    );

    const teamByName = Object.fromEntries(
        createdTeams.map((team) => [team.name, team])
    );

    console.log("Teams seeded.");

    const driversData = [
        {
            firstName: "Max",
            lastName: "Verstappen",
            raceNumber: 1,
            nationality: "Dutch",
            teamName: "Red Bull Racing",
        },
        {
            firstName: "Sergio",
            lastName: "Perez",
            raceNumber: 11,
            nationality: "Mexican",
            teamName: "Red Bull Racing",
        },
        {
            firstName: "Lewis",
            lastName: "Hamilton",
            raceNumber: 44,
            nationality: "British",
            teamName: "Mercedes-AMG Petronas F1 Team",
        },
        {
            firstName: "George",
            lastName: "Russell",
            raceNumber: 63,
            nationality: "British",
            teamName: "Mercedes-AMG Petronas F1 Team",
        },
        {
            firstName: "Charles",
            lastName: "Leclerc",
            raceNumber: 16,
            nationality: "Monegasque",
            teamName: "Scuderia Ferrari",
        },
        {
            firstName: "Carlos",
            lastName: "Sainz",
            raceNumber: 55,
            nationality: "Spanish",
            teamName: "Scuderia Ferrari",
        },
        {
            firstName: "Lando",
            lastName: "Norris",
            raceNumber: 4,
            nationality: "British",
            teamName: "McLaren F1 Team",
        },
        {
            firstName: "Oscar",
            lastName: "Piastri",
            raceNumber: 81,
            nationality: "Australian",
            teamName: "McLaren F1 Team",
        },
        {
            firstName: "Fernando",
            lastName: "Alonso",
            raceNumber: 14,
            nationality: "Spanish",
            teamName: "Aston Martin Aramco F1 Team",
        },
        {
            firstName: "Lance",
            lastName: "Stroll",
            raceNumber: 18,
            nationality: "Canadian",
            teamName: "Aston Martin Aramco F1 Team",
        },
        {
            firstName: "Pierre",
            lastName: "Gasly",
            raceNumber: 10,
            nationality: "French",
            teamName: "BWT Alpine F1 Team",
        },
        {
            firstName: "Esteban",
            lastName: "Ocon",
            raceNumber: 31,
            nationality: "French",
            teamName: "BWT Alpine F1 Team",
        },
        {
            firstName: "Yuki",
            lastName: "Tsunoda",
            raceNumber: 22,
            nationality: "Japanese",
            teamName: "Visa Cash App RB F1 Team",
        },
        {
            firstName: "Daniel",
            lastName: "Ricciardo",
            raceNumber: 3,
            nationality: "Australian",
            teamName: "Visa Cash App RB F1 Team",
        },
        {
            firstName: "Valtteri",
            lastName: "Bottas",
            raceNumber: 77,
            nationality: "Finnish",
            teamName: "Stake F1 Team Kick Sauber",
        },
        {
            firstName: "Zhou",
            lastName: "Guanyu",
            raceNumber: 24,
            nationality: "Chinese",
            teamName: "Stake F1 Team Kick Sauber",
        },
        {
            firstName: "Kevin",
            lastName: "Magnussen",
            raceNumber: 20,
            nationality: "Danish",
            teamName: "MoneyGram Haas F1 Team",
        },
        {
            firstName: "Nico",
            lastName: "Hulkenberg",
            raceNumber: 27,
            nationality: "German",
            teamName: "MoneyGram Haas F1 Team",
        },
        {
            firstName: "Alexander",
            lastName: "Albon",
            raceNumber: 23,
            nationality: "Thai",
            teamName: "Williams Racing",
        },
        {
            firstName: "Logan",
            lastName: "Sargeant",
            raceNumber: 2,
            nationality: "American",
            teamName: "Williams Racing",
        },
    ];

    const createdDrivers = await Promise.all(
        driversData.map((driver) =>
            prisma.driver.create({
                data: {
                    firstName: driver.firstName,
                    lastName: driver.lastName,
                    raceNumber: driver.raceNumber,
                    nationality: driver.nationality,
                    teamId: teamByName[driver.teamName].id,
                },
            })
        )
    );

    const driverByLastName = Object.fromEntries(
        createdDrivers.map((driver) => [driver.lastName, driver])
    );

    console.log("Drivers seeded.");

    const circuitsData = [
        {
            name: "Bahrain International Circuit",
            location: "Sakhir",
            country: "Bahrain",
            lenghKm: 5.412,
        },
        {
            name: "Jeddah Corniche Circuit",
            location: "Jeddah",
            country: "Saudi Arabia",
            lenghKm: 6.174,
        },
        {
            name: "Albert Park Circuit",
            location: "Melbourne",
            country: "Australia",
            lenghKm: 5.278,
        },
        {
            name: "Suzuka International Racing Course",
            location: "Suzuka",
            country: "Japan",
            lenghKm: 5.807,
        },
        {
            name: "Autodromo Enzo e Dino Ferrari",
            location: "Imola",
            country: "Italy",
            lenghKm: 4.909,
        },
    ];

    const createdCircuits = await Promise.all(
        circuitsData.map((circuit) => prisma.circuit.create({ data: circuit }))
    );

    const circuitByName = Object.fromEntries(
        createdCircuits.map((circuit) => [circuit.name, circuit])
    );

    console.log("Circuits seeded.");

    const racesData = [
        {
            name: "Bahrain Grand Prix",
            date: new Date("2024-03-02T15:00:00Z"),
            season: 2024,
            circuitName: "Bahrain International Circuit",
        },
        {
            name: "Saudi Arabian Grand Prix",
            date: new Date("2024-03-09T17:00:00Z"),
            season: 2024,
            circuitName: "Jeddah Corniche Circuit",
        },
        {
            name: "Australian Grand Prix",
            date: new Date("2024-03-24T04:00:00Z"),
            season: 2024,
            circuitName: "Albert Park Circuit",
        },
        {
            name: "Japanese Grand Prix",
            date: new Date("2024-04-07T05:00:00Z"),
            season: 2024,
            circuitName: "Suzuka International Racing Course",
        },
        {
            name: "Emilia Romagna Grand Prix",
            date: new Date("2024-05-19T13:00:00Z"),
            season: 2024,
            circuitName: "Autodromo Enzo e Dino Ferrari",
        },
    ];

    const createdRaces = await Promise.all(
        racesData.map((race) =>
            prisma.race.create({
                data: {
                    name: race.name,
                    date: race.date,
                    season: race.season,
                    circuitId: circuitByName[race.circuitName].id,
                },
            })
        )
    );

    const raceByName = Object.fromEntries(
        createdRaces.map((race) => [race.name, race])
    );

    console.log("Races seeded.");

    await prisma.raceResult.createMany({
        data: [
            {
                raceId: raceByName["Bahrain Grand Prix"].id,
                driverId: driverByLastName["Verstappen"].id,
                position: 1,
                points: 26,
                fastestLap: true,
            },
            {
                raceId: raceByName["Bahrain Grand Prix"].id,
                driverId: driverByLastName["Perez"].id,
                position: 2,
                points: 18,
                fastestLap: false,
            },
            {
                raceId: raceByName["Bahrain Grand Prix"].id,
                driverId: driverByLastName["Leclerc"].id,
                position: 3,
                points: 15,
                fastestLap: false,
            },
            {
                raceId: raceByName["Saudi Arabian Grand Prix"].id,
                driverId: driverByLastName["Verstappen"].id,
                position: 1,
                points: 25,
                fastestLap: false,
            },
            {
                raceId: raceByName["Saudi Arabian Grand Prix"].id,
                driverId: driverByLastName["Leclerc"].id,
                position: 2,
                points: 19,
                fastestLap: true,
            },
            {
                raceId: raceByName["Australian Grand Prix"].id,
                driverId: driverByLastName["Sainz"].id,
                position: 1,
                points: 25,
                fastestLap: false,
            },
            {
                raceId: raceByName["Australian Grand Prix"].id,
                driverId: driverByLastName["Leclerc"].id,
                position: 2,
                points: 18,
                fastestLap: false,
            },
            {
                raceId: raceByName["Australian Grand Prix"].id,
                driverId: driverByLastName["Norris"].id,
                position: 3,
                points: 16,
                fastestLap: true,
            },
            {
                raceId: raceByName["Japanese Grand Prix"].id,
                driverId: driverByLastName["Verstappen"].id,
                position: 1,
                points: 26,
                fastestLap: true,
            },
            {
                raceId: raceByName["Japanese Grand Prix"].id,
                driverId: driverByLastName["Perez"].id,
                position: 2,
                points: 18,
                fastestLap: false,
            },
            {
                raceId: raceByName["Japanese Grand Prix"].id,
                driverId: driverByLastName["Sainz"].id,
                position: 3,
                points: 15,
                fastestLap: false,
            },
            {
                raceId: raceByName["Emilia Romagna Grand Prix"].id,
                driverId: driverByLastName["Verstappen"].id,
                position: 1,
                points: 25,
                fastestLap: false,
            },
            {
                raceId: raceByName["Emilia Romagna Grand Prix"].id,
                driverId: driverByLastName["Norris"].id,
                position: 2,
                points: 19,
                fastestLap: true,
            },
            {
                raceId: raceByName["Emilia Romagna Grand Prix"].id,
                driverId: driverByLastName["Leclerc"].id,
                position: 3,
                points: 15,
                fastestLap: false,
            },
        ],
    });

    console.log("Race Results seeded.");
    console.log("Seeding finished successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });