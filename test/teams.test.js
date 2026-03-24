const request = require("supertest");
const app = require("../src/app");
const teamsController = require("../src/controllers/teams.controller");
const { PrismaClient } = require("../src/generated/prisma/client")

const prisma = new PrismaClient();

describe("Teams API", () => {
    let createdId;
    let uniqueTeamName = `Test Team ${Date.now()}`;

    beforeAll(async () => {
        await prisma.team.deleteMany({
            where: { name: { startsWith: "Test Team" } }
        });
    });

    afterAll(async () => {
        if (createdId) {
            try {
                await prisma.team.delete({ where: { id: createdId } });
            } catch (e) {
            }
        }
        await prisma.$disconnect();
    });

    it("GET /teams should return list", async () => {
        const res = await request(app).get("/teams");
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("success");
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("POST /teams should validate required name", async () => {
        const res = await request(app).post("/teams").send({ base: "Maranello" });
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe("error");
    });

    it("POST /teams should create team", async () => {
        const res = await request(app)
            .post("/teams")
            .send({ name: uniqueTeamName, base: "Test Base", principal: "Test Principal" });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe("success");
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data.name).toBe(uniqueTeamName);
        createdId = res.body.data.id;
    });

    it("POST /teams should fail on duplicate name", async () => {
        const res = await request(app)
            .post("/teams")
            .send({ name: uniqueTeamName });

        expect(res.statusCode).toBe(409);
        expect(res.body.status).toBe("error");
    });

    it("GET /teams/:id should return one team", async () => {
        const res = await request(app).get("/teams/" + createdId);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body.data.id).toBe(createdId);
    });

    it("GET /teams/:id should return 404 for unknown id", async () => {
        const res = await request(app).get("/teams/999999");
        expect(res.statusCode).toBe(404);
        expect(res.body.status).toBe("error");
    });

    it("PUT /teams/:id should update team", async () => {
        const updatedName = `${uniqueTeamName} Updated`;
        const res = await request(app)
            .put("/teams/" + createdId)
            .send({ name: updatedName, base: "New Base", principal: "New Principal" });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.name).toBe(updatedName);
        expect(res.body.data.base).toBe("New Base");
    });

    it("PUT /teams/:id should validate missing name", async () => {
        const res = await request(app)
            .put("/teams/" + createdId)
            .send({ base: "Maranello" });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe("error");
    });

    it("DELETE /teams/:id should delete team", async () => {
        const res = await request(app).delete("/teams/" + createdId);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("success");
    });
});