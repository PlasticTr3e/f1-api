const request = require("supertest");
const app = require("../src/app");
const { PrismaClient } = require("../src/generated/prisma/client");

const prisma = new PrismaClient();

describe("Races API", () => {
    let createdRaceId;
    let fallbackCircuitId;

    beforeAll(async () => {
        const uniqueCircuitName = `Race Test Circuit ${Date.now()}`;
        const circuitLocation = "bandung";
        const circuitCountry = "kamboja";

        const tempCircuit = await prisma.circuit.create({
            data: {
                name: uniqueCircuitName,
                location: circuitLocation,
                country: circuitCountry,
            }
        });
        fallbackCircuitId = tempCircuit.id;
    });

    afterAll(async () => {
        if (createdRaceId) {
            await prisma.race.delete({
                where: { id: createdRaceId }
            });
        }

        if (fallbackCircuitId) {
            await prisma.circuit.delete({
                where: { id: fallbackCircuitId }
            });
        }
        await prisma.$disconnect();
    });

    it("POST /races should create a race with a circuit", async () => {
        const res = await request(app)
            .post("/races")
            .send({
                name: "Mandalika WEC Race",
                date: Date.now(),
                season: 2026,
                circuitId: fallbackCircuitId,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe("success");
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data.circuitId).toBe(fallbackCircuitId);
        createdRaceId = res.body.data.id;

    });

    it("GET /races should return list including circuit data", async () => {
        const res = await request(app).get("/races");

        expect(res.statusCode).toBe(200);
        expect((Array.isArray(res.body.data))).toBe(true);
        expect((res.body.data[0])).toHaveProperty("circuit");
    })
});
