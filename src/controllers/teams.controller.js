const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();

const success = (res, statusCode, message, data) => res.status(statusCode).json({ status: "success", message, data });
const error = (res, statusCode, message, errors) => res.status(statusCode).json({ status: "error", message, errors });

exports.getAllTeams = async (req, res) => {
    try {
        const teams = await prisma.team.findMany({ orderBy: { id: 'asc' } });
        return success(res, 200, "Teams retrieved", teams);
    } catch (err) {
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};

exports.getTeamById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return error(res, 400, "Invalid ID", [{ field: "id", message: "ID must be a number" }]);

        const team = await prisma.team.findUnique({ where: { id } });

        if (!team) return error(res, 404, "Team not found", [{ field: "id", message: "No team with this id" }]);
        return success(res, 200, "Team retrieved", team);
    } catch (err) {
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};

exports.createTeam = async (req, res) => {
    try {
        const { name, base, principal } = req.body;
        if (!name || String(name).trim() === "") {
            return error(res, 400, "Validation failed", [{ field: "name", message: "name is required" }]);
        }

        const newTeam = await prisma.team.create({
            data: { name, base, principal }
        });

        return success(res, 201, "Team created", newTeam);
    } catch (err) {
        if (err.code === 'P2002') return error(res, 409, "Conflict", [{ field: "name", message: "Team name already exists" }]);
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};

exports.updateTeam = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return error(res, 400, "Invalid ID", [{ field: "id", message: "ID must be a number" }]);

        const { name, base, principal } = req.body;
        if (!name || String(name).trim() === "") {
            return error(res, 400, "Validation failed", [{ field: "name", message: "name is required" }]);
        }

        const teamExists = await prisma.team.findUnique({ where: { id } });
        if (!teamExists) return error(res, 404, "Team not found", [{ field: "id", message: "No team with this id" }]);

        const updatedTeam = await prisma.team.update({
            where: { id },
            data: { name, base, principal }
        });

        return success(res, 200, "Team updated", updatedTeam);
    } catch (err) {
        if (err.code === 'P2002') return error(res, 409, "Conflict", [{ field: "name", message: "Team name already exists" }]);
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return error(res, 400, "Invalid ID", [{ field: "id", message: "ID must be a number" }]);

        const teamExists = await prisma.team.findUnique({ where: { id } });
        if (!teamExists) return error(res, 404, "Team not found", [{ field: "id", message: "No team with this id" }]);

        const deletedTeam = await prisma.team.delete({ where: { id } });
        return success(res, 200, "Team deleted", deletedTeam);
    } catch (err) {
        return error(res, 500, "Internal Server Error", [{ message: err.message }]);
    }
};