const express = require("express");
const router = express.Router();
const {
   signup,
   login,
   getAllUsers,
   deleteUserById
} = require("./controller/userController");

const {
   checkIsUndefined,
   checkIsEmptyFunc,
   checkIsAlphaFunc,
   checkIsAlphanumericFunc,
   checkIsEmailFunc,
   checkIsStrongPasswordFunc,
} = require("./helpers/authMiddleware");

// to track users created, create getAllUsers GET
router.get("/get-all-users", getAllUsers);
router.delete("/delete-user-by-id/:id", deleteUserById);

// we use POST to sign up because a user will input data into a from that will provide the req.body
router.post(
   "/sign-up", 
   checkIsUndefined, 
   checkIsEmptyFunc,
   checkIsAlphaFunc,
   checkIsAlphanumericFunc,
   checkIsEmailFunc, 
   checkIsStrongPasswordFunc,
   signup
);

// we use POST for login, which will reuse some functions from signup
router.post(
   "/login",
   checkIsUndefined, 
   checkIsEmptyFunc,
   login
);

module.exports = router;