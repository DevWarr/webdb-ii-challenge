const express = require("express");
const helmet = require("helmet");
const carsRouter = require("./cars/carsRouter");
const errorHandler = require("./middleware/errorHandler")

// Basic Setup
const server = express();
server.use(helmet())
server.use(express.json())

// Routes
server.use("/api/cars", carsRouter);
server.get("/", (req, res) => res.send("Why, hello there!") )

// Error Handling
server.use("/", (req, res, next) => {
    const error = {
        status: 404,
        details: "It seems you've found an endpoint that doesn't exist o.o"
    }
    next(error);
})
server.use(errorHandler);

const port = process.env.PORT || 2019;
server.listen(port, () => console.log(`\n=== Live on Port ${port} ===\n`) )