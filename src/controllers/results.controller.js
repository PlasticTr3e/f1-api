const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();

const success = (res, statusCode, message, data) => res.status(statusCode).json({ status: "success", message, data });
const error = (res, statusCode, message, errors) => res.status(statusCode).json({ status: "error", message, errors });

exports.addRaceResult = async (req, res) => {
    try {
        const { raceId, driverId, position, points, fastestLap } = req.body;

        if (!raceId || !driverId || position === undefined) {
            return error(res, 400, "Validation failed", [{ field: "raceId, driverId, position", message: "Missing required fields" }]);
        }

        const result = await prisma.raceResult.create({
            data: {
                raceId: Number(raceId),
                driverId: Number(driverId),
                position: Number(position),
                points: points ? Number(points) : 0,
                fastestLap: fastestLap || false
            }
        });

        return success(res, 201, "Race result recorded", result);
    } catch (err) {
        if (err.code === 'P2002') return error(res, 409, "Conflict", [{ field: "raceId_driverId", message: "Driver already has a result for this race" }]);
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};

exports.getRaceResults = async (req, res) => {
    try {
        const raceId = Number(req.params.raceId);

        const results = await prisma.raceResult.findMany({
            where: { raceId },
            include: { driver: { include: { team: true } } },
            orderBy: { position: 'asc' }
        });

        return success(res, 200, "Race results retrieved", results);
    } catch (err) {
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};