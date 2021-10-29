const {
   checkIsEmpty,
   checkIsAlpha,
   checkIsAlphanumeric,
   checkIsEmail,
   checkIsStrongPassword,
} = require("../../utils/authMethods");

// check empty form
function checkIsUndefined(req, res, next) {
   // this is checking length of all the keys in req.body
   // i.e. req.body.username.length, etc...
   if (Object.keys(req.body).length === 0) {
      return res.status(500).json({ message: "Please fill out the form !"});
   } else {
      // REF: http://expressjs.com/en/5x/api.html#res.locals
      let errorObj = {};
      res.locals.errorObj = errorObj;
      next();
   };
};

function checkIsEmptyFunc(req, res, next) {
   // let errorObj = {};
   // REF: http://expressjs.com/en/5x/api.html#res.locals
   const { errorObj } =res.locals;
   for (let key in req.body) {
      if(checkIsEmpty(req.body[key])) {
         errorObj[key] = `${key} cannot be empty`;
      }
   };

   next();
};

function checkIsAlphaFunc(req, res, next) {
    // let errorObj = {};
   // REF: http://expressjs.com/en/5x/api.html#res.locals
   const { errorObj } =res.locals;

   for (key in req.body) {
      if (key === "firstName" || key === "lastName"){
         if(!checkIsAlpha(req.body[key])) {
            errorObj[`${key}Format`] = `${key} can only have characters`;
         };
      };
   };

   next();
};

function checkIsAlphanumericFunc(req, res, next) {
    // let errorObj = {};
   // REF: http://expressjs.com/en/5x/api.html#res.locals
   const { errorObj } =res.locals;

   if(!checkIsAlphanumeric(req.body.username)) {
      errorObj.usernameFormat = "Only use letters and numbers for username";
   };

   next();
};

function checkIsEmailFunc(req, res, next) {
   // let errorObj = {};
   // REF: http://expressjs.com/en/5x/api.html#res.locals
   const { errorObj } =res.locals;

   if(!checkIsEmail(req.body.email)){
      errorObj.wrongEmailFormat = "Please enter a valid email";
   };

   next();
};

function checkIsStrongPasswordFunc(req, res, next) {
   // let errorObj = {};
   // REF: http://expressjs.com/en/5x/api.html#res.locals
   const { errorObj } =res.locals;

   if(!checkIsStrongPassword(req.body.password)) {
      errorObj.weakPassword = "password must include 1 lowercase, 1 uppercase, 1 special character, a number and a length of 8"
   };

   next();
};

module.exports = {
   checkIsUndefined,
   checkIsEmptyFunc,
   checkIsAlphaFunc,
   checkIsAlphanumericFunc,
   checkIsEmailFunc,
   checkIsStrongPasswordFunc,
};

/* this file could hold all the original fileNameFunc.js files we made instead of having individual files */

