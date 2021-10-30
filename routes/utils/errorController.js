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
   console.log(err); //"1"
   console.log("2");
   err.statusCode = err.statusCode || 500;
   err.status = err.status || "error";
   console.log("3");
   console.log(err);

   let error = { ...err };
   console.log("4")
   console.log(error)
   error.message = err.message;
   console.log("5")
   console.log(error.message)
   console.log("6")
   console.log(error)

   if(error.code === 11000 || error.code === 11001){
      error = handleMongoDBDuplicate(error);
   }
   console.log("7")
   console.log(error)

   if (process.env.NODE_ENV === "development") {
      dispatchErrorDevelopment(error, req, res);
   } else {
      dispatchErrorProduction(error, req, res);
   }
};