const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

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