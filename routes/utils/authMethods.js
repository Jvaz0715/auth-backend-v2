// this will carry utility functions to help code in userController.js
const {
   isEmpty,
   isStrongPassword,
   isAlpha,
   isAlphanumeric,
   isEmail,
} = require("validator");

// all the functions below are iterations of how they could be written from most robust(if statement) to least (one line of code)

function checkIsEmpty(target) {
   if (isEmpty(target)) {
      return true;
   } else {
      return false;
   }
};

const checkIsStrongPassword = (password) => {
   if(isStrongPassword(password)){
      return true;
   } else {
      return false;
   }
};

const checkIsAlpha = (name) => isAlpha(name) ? true : false;

const checkIsEmail = email => isEmail(email);

const checkIsAlphanumeric = username => isAlphanumeric(username);

module.exports = {
   checkIsEmpty,
   checkIsStrongPassword,
   checkIsAlpha,
   checkIsAlphanumeric,
   checkIsEmail,
}