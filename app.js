const express = require("express");
const logger = require("morgan");
const cors = require("cors"); //cors foregoes the blocking

const app = express();

const userRouter = require("./routes/user/userRouter");

app.use(cors());
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // <--- this parses the incoming data

// this is where the app will use whatever url address we create with user router
app.use("/api/users", userRouter);

module.exports = app;