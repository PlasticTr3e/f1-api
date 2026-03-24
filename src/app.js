const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const teamsRouter = require("./routes/teams.routes")
const driversRouter = require("./routes/drivers.routes")
const racesRouter = require("./routes/races.routes");
const resultsRouter = require("./routes/results.routes");
const circuitsRouter = require("./routes/circuits.routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/teams", teamsRouter)
app.use("/drivers", driversRouter)
app.use("/races", racesRouter);
app.use("/results", resultsRouter);
app.use("/circuits", circuitsRouter);

app.get("/health", (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "API is running",
        data: {
            service: "f1-race-weekend-tracker"
        }
    });
});

app.use((req, res) => {
    return res.status(404).json({
        status: "error",
        message: "Route not found",
        errors:[{
            field: "path",
            message: req.originalUrl
        }]
    });
});

module.exports = app;