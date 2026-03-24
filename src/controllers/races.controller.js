const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();

const success = (res, statusCode, message, data) => res.status(statusCode).json({ status: "success", message, data });
const error = (res, statusCode, message, errors) => res.status(statusCode).json({ status: "error", message, errors });

exports.getAllRaces = async (req, res) => {
    try {
        const races = await prisma.race.findMany({
            orderBy: { date: 'asc' },
            include: { circuit: true }
        });
        return success(res, 200, "Races retrieved", races);
    } catch (err) {
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};

exports.getRaceById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return error(res, 400, "Invalid ID", [{ field: "id", message: "ID must be a number" }]);

        const race = await prisma.race.findUnique({
            where: { id },
            include: {
                circuit: true,
                results: {
                    include: { driver: true },
                    orderBy: { position: 'asc' }
                }
            }
        });

        if (!race) return error(res, 404, "Race not found", [{ field: "id", message: "No race with this id" }]);
        return success(res, 200, "Race retrieved", race);
    } catch (err) {
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};

exports.createRace = async (req, res) => {
    try {
        const { name, date, season, circuitId } = req.body;
        if (!name || !date || !season || !circuitId) {
            return error(res, 400, "Validation failed", [{ field: "name, date, season, circuitId", message: "Missing required fields" }]);
        }

        const newRace = await prisma.race.create({
            data: {
                name,
                date: new Date(date),
                season: Number(season),
                circuitId: Number(circuitId)
            }
        });

        return success(res, 201, "Race created", newRace);
    } catch (err) {
        if (err.code === 'P2002') return error(res, 409, "Conflict", [{ field: "name_season", message: "This race already exists for this season" }]);
        if (err.code === 'P2003') return error(res, 400, "Invalid Circuit", [{ field: "circuitId", message: "Circuit does not exist" }]);
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};