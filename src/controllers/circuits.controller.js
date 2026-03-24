const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();

const success = (res, statusCode, message, data) => res.status(statusCode).json({ status: "success", message, data });
const error = (res, statusCode, message, errors) => res.status(statusCode).json({ status: "error", message, errors });

exports.getAllCircuits = async (req, res) => {
    try {
        const circuits = await prisma.circuit.findMany({ orderBy: { id: 'asc' } });
        return success(res, 200, "Circuits retrieved", circuits);
    } catch (err) {
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};

exports.getCircuitById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return error(res, 400, "Invalid ID", [{ field: "id", message: "ID must be a number" }]);

        const circuit = await prisma.circuit.findUnique({
            where: { id },
            include: { races: true }
        });

        if (!circuit) return error(res, 404, "Circuit not found", [{ field: "id", message: "No circuit with this id" }]);
        return success(res, 200, "Circuit retrieved", circuit);
    } catch (err) {
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};

exports.createCircuit = async (req, res) => {
    try {
        const { name, location, country, lenghKm } = req.body;

        if (!name || !location || !country) {
            return error(res, 400, "Validation failed", [{ field: "name, location, country", message: "These fields are required" }]);
        }

        const newCircuit = await prisma.circuit.create({
            data: {
                name,
                location,
                country,
                lenghKm: lenghKm ? Number(lenghKm) : null
            }
        });

        return success(res, 201, "Circuit created", newCircuit);
    } catch (err) {
        if (err.code === 'P2002') return error(res, 409, "Conflict", [{ field: "name", message: "Circuit name already exists" }]);
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};

exports.updateCircuit = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return error(res, 400, "Invalid ID", [{ field: "id", message: "ID must be a number" }]);

        const { name, location, country, lenghKm } = req.body;

        const circuitExists = await prisma.circuit.findUnique({ where: { id } });
        if (!circuitExists) return error(res, 404, "Circuit not found", [{ field: "id", message: "No circuit with this id" }]);

        const updatedCircuit = await prisma.circuit.update({
            where: { id },
            data: {
                name,
                location,
                country,
                lenghKm: lenghKm ? Number(lenghKm) : undefined
            }
        });

        return success(res, 200, "Circuit updated", updatedCircuit);
    } catch (err) {
        if (err.code === 'P2002') return error(res, 409, "Conflict", [{ field: "name", message: "Circuit name already exists" }]);
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};

exports.deleteCircuit = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return error(res, 400, "Invalid ID", [{ field: "id", message: "ID must be a number" }]);

        const circuitExists = await prisma.circuit.findUnique({ where: { id } });
        if (!circuitExists) return error(res, 404, "Circuit not found", [{ field: "id", message: "No circuit with this id" }]);

        const deletedCircuit = await prisma.circuit.delete({ where: { id } });
        return success(res, 200, "Circuit deleted", deletedCircuit);
    } catch (err) {
        if (err.code === 'P2003') return error(res, 409, "Conflict", [{ field: "id", message: "Cannot delete circuit because it has associated races" }]);
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};