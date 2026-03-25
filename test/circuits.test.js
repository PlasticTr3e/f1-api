const request = require("supertest");
const app = require("../src/app");
const { PrismaClient } = require("../src/generated/prisma/client");

const prisma = new PrismaClient();

describe("Circuits API", () => {
    let createdCircuitId;

    afterAll(async () => {
        if (createdCircuitId) {
            await prisma.circuit.delete({ where: { id: createdCircuitId } });
        }
        await prisma.$disconnect();
    });

    it("POST /circuits should create a circuit", async () => {
        const res = await request(app)
            .post("/circuits")
            .send({
                name: "bagas",
                location: "bojong soang",
                country: "iran",
                lenghKm: 100,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe("success");
        expect(res.body.data).toHaveProperty("id");
        createdCircuitId = res.body.data.id;
    });

    it("Get /circuits should  return list the circuits", async () => {
        const res = await request(app).get("/circuits");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});