const express = require("express");
const logger = require("morgan");
const cors = require("cors"); //cors foregoes the blocking

const app = express();

const ErrorMessageHandlerClass = require("./routes/utils/ErrorMessageHandlerClass.js");
const userRouter = require("./routes/user/userRouter");

app.use(cors());

// to differentiate between production mode (what client sees) and developer mode with errors
if(process.env.NODE_ENV === "development") {
   app.use(logger("dev"));
};

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // <--- this parses the incoming data

// this is where the app will use whatever url address we create with user router
app.use("/api/users", userRouter);

// catch all for everything that does not work in URL if it doesn't exist
// make sure to put it at the bottom!
app.all("*", function(req, res, next) {
   next(
      new ErrorMessageHandlerClass(
         `Cannot find ${req.originalUrl} on this server! Check your URL`, 
         404
      )
   );
});

module.exports = app;