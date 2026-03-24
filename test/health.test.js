const request = require("supertest");
const app = require("../src/app");

describe("GET /health", () => {
    it("Should return standardized success JSON", async () => {
        const res = await request(app).get("/health");
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("data");
    });
});