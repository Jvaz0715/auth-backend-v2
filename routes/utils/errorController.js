const ErrorMessageHandlerClass = require("./ErrorMessageHandlerClass");

// error handling in dev mode --- for devs
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

// error handling in prod mode ---> clients
function dispatchErrorProduction(error, req, res) {
   if (req.originalUrl.startsWith('/api')) {
      if(error.isOperational) {
         return res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
         });
      }
      
      return res.status(error.statusCode).json({
         status: "Error",
         message: "Something went wrong. Please contact Support (number) or email (email)"
      })
   }
};

// handling duplicate input in mongoDB
// solution one using err.keyValue
function handleMongoDBDuplicate(err) {
   let errorMessageDuplicateKey = Object.keys(err.keyValue)[0];
   let errorMessageDuplicateValue = Object.values(err.keyValue)[0];
   
   // console.log(errorMessageDuplicateKey)
   // console.log(errorMessageDuplicateValue)
   let message = `${errorMessageDuplicateKey} - ${errorMessageDuplicateValue} is taken please choose another one`;
   // console.log(message)
   return new ErrorMessageHandlerClass(message, 400);
};

// solution two, parsing err.message if keyValue does not exist
// function handleMongoDBDuplicate(err) {
//    // an err.message may look like something below
//    // E11000 duplicate key error collection: auth-backend-v2.users index: username_1 dup key: { username: "Mscott123" }
//    // use REGEX to find the opening and closing brackets and only get back the key and its value at the end accounting for its white space
//    let errorMessage = err.message;
//    // regex below to find the index in message string of brackets
//    let openingBracketIndex = errorMessage.match(/{/).index;
//    let closingBracketIndex = errorMessage.match(/}/).index;
//    // below will slice and give us string within brackets but still includes whitespace, :, and quotes
//    let foundDuplicateValueString = errorMessage.slice(
//       openingBracketIndex + 1,
//       closingBracketIndex
//    );
//    //use regex to replace the : and quotes with whitespace
//    let newErrorString = foundDuplicateValueString.replace(/:|\"/g, "");
//    console.log(newErrorString)

//    // then we use trim to get rid of the whitespace
//    let trimmedNewErrorString = newErrorString.trim();
//    console.log(trimmedNewErrorString)

//    // we then split trimmedNewErrorString to get an array,
//    let errorStringArray = trimmedNewErrorString.split(" ");
//    console.log(errorStringArray)
//    let message = `${errorStringArray[0]} - ${errorStringArray[1]} is taken please choose another one`;
//    console.log(message)
//    return new ErrorMessageHandlerClass(message, 400);
//    // return new ErrorMessageHandlerClass("hardcode this here", 400);
// };

module.exports = (err, req, res, next) => {
   // console.log(err); //"1" if a req fails itll come here on next,
   // console.log("2"); // we get the standard error message
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
   // console.log(error) //now when we console.log our error object, itll include status code, status and error

   // if error.code is either of the below (the duplicate error code numbers from mongo)
   if(error.code === 11000 || error.code === 11001){
      error = handleMongoDBDuplicate(error); //we use our class function from above and our error object now changes
   }
   // console.log("7")
   // console.log(error)

   if (process.env.NODE_ENV === "development") {
      dispatchErrorDevelopment(error, req, res);
   } else {
      dispatchErrorProduction(error, req, res);
   }
};