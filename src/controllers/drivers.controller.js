const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();

const success = (res, statusCode, message, data) => res.status(statusCode).json({ status: "success", message, data });
const error = (res, statusCode, message, errors) => res.status(statusCode).json({ status: "error", message, errors });

exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await prisma.driver.findMany({
            orderBy: { raceNumber: 'asc' },
            include: { team: true }
        });
        return success(res, 200, "Drivers retrieved", drivers);
    } catch (err) {
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};

exports.getDriverById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return error(res, 400, "Invalid ID", [{ field: "id", message: "ID must be a number" }]);

        const driver = await prisma.driver.findUnique({
            where: { id },
            include: { team: true }
        });

        if (!driver) return error(res, 404, "Driver not found", [{ field: "id", message: "No driver with this id" }]);
        return success(res, 200, "Driver retrieved", driver);
    } catch (err) {
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};

exports.createDriver = async (req, res) => {
    try {
        const { firstName, lastName, raceNumber, nationality, teamId } = req.body;
        if (!firstName || !lastName || !raceNumber) {
            return error(res, 400, "Validation failed", [
                { field: "firstName, lastName, raceNumber", message: "These fields are required" }
            ]);
        }

        const newDriver = await prisma.driver.create({
            data: {
                firstName,
                lastName,
                raceNumber: Number(raceNumber),
                nationality,
                teamId: teamId ? Number(teamId) : null
            }
        });

        return success(res, 201, "Driver created", newDriver);
    } catch (err) {
        if (err.code === 'P2002') return error(res, 409, "Conflict", [{ field: "raceNumber", message: "Race number already exists" }]);
        if (err.code === 'P2003') return error(res, 400, "Invalid Team", [{ field: "teamId", message: "Team does not exist" }]);
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};

exports.updateDriver = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return error(res, 400, "Invalid ID", [{ field: "id", message: "ID must be a number" }]);

        const { firstName, lastName, raceNumber, nationality, teamId } = req.body;

        const driverExists = await prisma.driver.findUnique({ where: { id } });
        if (!driverExists) return error(res, 404, "Driver not found", [{ field: "id", message: "No driver with this id" }]);

        const updatedDriver = await prisma.driver.update({
            where: { id },
            data: {
                firstName,
                lastName,
                raceNumber: raceNumber ? Number(raceNumber) : undefined,
                nationality,
                teamId: teamId !== undefined ? Number(teamId) : undefined
            }
        });

        return success(res, 200, "Driver updated", updatedDriver);
    } catch (err) {
        if (err.code === 'P2002') return error(res, 409, "Conflict", [{ field: "raceNumber", message: "Race number already exists" }]);
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};

exports.deleteDriver = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return error(res, 400, "Invalid ID", [{ field: "id", message: "ID must be a number" }]);

        const driverExists = await prisma.driver.findUnique({ where: { id } });
        if (!driverExists) return error(res, 404, "Driver not found", [{ field: "id", message: "No driver with this id" }]);

        const deletedDriver = await prisma.driver.delete({ where: { id } });
        return success(res, 200, "Driver deleted", deletedDriver);
    } catch (err) {
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};