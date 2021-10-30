const ErrorMessageHandlerClass = require("./ErrorMessageHandlerClass");

// error handling in dev mode
function dispatchErrorDevelopment(error, req, res) {
   if (req.originalUrl.startsWith('/api')) {
      return res.status(error.statusCode).json({
         status: error.status,
         error: error,
         message: error.message,
         stack: error.stack,
      });
   }
};

// error handling in prod mode
function dispatchErrorDevelopment(error, req, res) {

};

// handling duplicate input in mongoDB
function handleMongoDBDuplicate(err) {
   return new ErrorMessageHandlerClass(err, 400);
};

module.exports = (err, req, res, next) => {
   // console.log(err); //"1" if a req fails itll come here on next,
   console.log("2"); // we get the standard error message
   // the next two lines check if statusCode and status exist, if they dont't, we will populate the err obj with 500 and error
   err.statusCode = err.statusCode || 500;
   err.status = err.status || "error";
   // console.log("3");
   // console.log(err); // this err obj will now include the statusCode and the status if it didnt exist

   let error = { ...err }; //we use the spread operator to create our error object from err
   //console.log("4")
   //console.log(error) // this will give us the error objec we got from spreader
   error.message = err.message; // we set our error object's message key value to that of err object
   //console.log("5")
   // console.log(error.message) // we check and get our error message that comes from err.message
   //console.log("6")
   //console.log(error) //now when we console.log our error object, itll include status code, status and error

   // if error.code is either of the below (the duplicate error code numbers from mongo)
   if(error.code === 11000 || error.code === 11001){
      error = handleMongoDBDuplicate(error); //we use our class function from above and our error object now changes
   }
   //console.log("7")
   //console.log(error)

   if (process.env.NODE_ENV === "development") {
      dispatchErrorDevelopment(error, req, res);
   } else {
      dispatchErrorProduction(error, req, res);
   }
};