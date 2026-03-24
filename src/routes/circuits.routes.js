const express = require("express");
const router = express.Router();
const circuitsController = require("../controllers/circuits.controller");

router.get("/", circuitsController.getAllCircuits);
router.get("/:id", circuitsController.getCircuitById);
router.post("/", circuitsController.createCircuit);
router.put("/:id", circuitsController.updateCircuit);
router.delete("/:id", circuitsController.deleteCircuit);

module.exports = router;