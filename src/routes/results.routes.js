const express = require("express");
const router = express.Router();
const resultsController = require("../controllers/results.controller");

router.get("/race/:raceId", resultsController.getRaceResults);
router.post("/", resultsController.addRaceResult);

module.exports = router;