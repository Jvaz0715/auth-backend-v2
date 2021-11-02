const jwt = require("jsonwebtoken");

async function checkJwtToken (req, res, next) {
   try {
      // we have to set headers for authorization
      
      if(req.headers && req.headers.authorization) {
         let jwtToken = req.headers.authorization.slice(7);
         let decodedJwt = jwt.verify(jwtToken, process.env.PRIVATE_JWT_KEY); //the private jwt key verifies its coming from us
         next(); //if token is good, we go to the next function which is the twilio function
      } else {
         throw{ message: "You do not have permission!", statusCode: 500 };
      }
   } catch(e) {
      return next(e); //thanks to errorController!
      // res.status(e.statusCode).json({message: e.message, error: e});
   }
};

module.exports = checkJwtToken;