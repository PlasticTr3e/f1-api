const request = require("supertest");
const app = require("../src/app");
const { PrismaClient } = require("../src/generated/prisma/client");

const prisma = new PrismaClient();

describe("Drivers API", () => {
    let createdDriverId;
    let fallbackTeamId;
    let uniqueDriverNumber = Math.floor(Math.random() * 900) + 100; // random 3 digit number

    beforeAll(async () => {
        const uniqueTeamName = `Driver Test Team ${Date.now()}`;
        const tempTeam = await prisma.team.create({
            data: { name: uniqueTeamName }
        });
        fallbackTeamId = tempTeam.id;
    });

    afterAll(async () => {
        if (createdDriverId) {
            try { await prisma.driver.delete({ where: { id: createdDriverId } }); } catch (e) { }
        }
        if (fallbackTeamId) {
            try { await prisma.team.delete({ where: { id: fallbackTeamId } }); } catch (e) { }
        }
        await prisma.$disconnect();
    });

    it("POST /drivers should create a driver with a team", async () => {
        const res = await request(app)
            .post("/drivers")
            .send({
                firstName: "Lando",
                lastName: "Norris",
                raceNumber: uniqueDriverNumber,
                nationality: "British",
                teamId: fallbackTeamId
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe("success");
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data.raceNumber).toBe(uniqueDriverNumber);
        expect(res.body.data.teamId).toBe(fallbackTeamId);
        createdDriverId = res.body.data.id;
    });

    it("GET /drivers should return list including team data", async () => {
        const res = await request(app).get("/drivers");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data[0]).toHaveProperty("team");
    });
});