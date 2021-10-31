const express = require("express");
const logger = require("morgan");
const cors = require("cors"); //cors foregoes the blocking
const rateLimit = require("express-rate-limit"); // this will be used to limit wrong password input

const app = express();

const ErrorMessageHandlerClass = require("./routes/utils/ErrorMessageHandlerClass.js");
const errorController = require("./routes/utils/errorController");
const userRouter = require("./routes/user/userRouter");

app.use(cors());

// to differentiate between production mode (what client sees) and developer mode with errors
if(process.env.NODE_ENV === "development") {
   app.use(logger("dev"));
};

// set a password incorrect limit and timer
const limiter = rateLimit({
   max: 5, //number of attempts
   windowMs: 60 * 60 * 1000, //length of time (in this case one hour)
   message: "Too many requests from this IP, please try again or contact support @ xxx-xxx-xxxx"
});

app.use("/api", limiter);

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
app.use(errorController); //for handling dev & prod errors

module.exports = app;