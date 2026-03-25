const express = require("express");
const router = express.Router();
const racesController = require("../controllers/races.controller");

router.get("/", racesController.getAllRaces);
router.get("/:id", racesController.getRaceById);
router.post("/", racesController.createRace);

module.exports = router;