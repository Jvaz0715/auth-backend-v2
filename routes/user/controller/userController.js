const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User"); 

// for testing, create a get all users function
async function getAllUsers(req, res) {
   try {
      let foundAllUsers = await User.find({});
      res.json({message: "success", data: foundAllUsers})
   } catch(e){
      res.status(500).json({message: "error", error: e.message })
   }
};

// for deleting users
async function deleteUserById(req, res) {
   try {
      let deletedUser = await User.findByIdAndDelete(req.params.id);
      res.json({message: "success", data: deletedUser })
   } catch(e) {
      res.status(500).json({ message: "error", error: e.message })
   }
};``

// signup
async function signup(req, res, next) {
   const {
      username,
      email,
      password,
      firstName,
      lastName
   } = req.body; // <--- we would get this from form input by user
   
   // REF: http://expressjs.com/en/5x/api.html#res.locals
   const { errorObj } =res.locals;

   // last line of defense
   if(Object.keys(errorObj).length > 0) {
      return res.status(500).json({message: "failure", payload: errorObj })
   };

   try {

      let salt = await bcrypt.genSalt(12);
      let hashedPassword = await bcrypt.hash(password, salt); // <--- password comes from const above, salt from line above

      const createdUser = new User({
         firstName,
         lastName,
         email,
         password: hashedPassword,
         username,
      });

      // we created the user but still need to save it
      let savedUser = await createdUser.save(); // dont use this as users will have data exposed
      res.json({ message: "success"});

   } catch (e) {
      // res.status(500).json({message: "error", error: e })
      next(e); //we handle errors with the errorController
   }
};

// login
async function login(req, res, next) {
   const { email, password } = req.body;
   const { errorObj } = res.locals;

   if(Object.keys(errorObj).length >0) {
      return res.status(500).json({message: "failure", payload: errorObj})
   }

   try{
      // first we need to check if the user even exists
      // we use the .findOne method to look for a matching email
      // if a user is found, foundUser will be an object with the user information, and a encrypted password
      let foundUser = await User.findOne({email: email });
      
      // if no user is found, respond with 400 status code
      if (!foundUser) {
         res.status(400).json({ message: "failure", payload: "check your email and password"});
      } else {
         // if there is indeed a foundUser, we need to work on comparing the password using bcryptjs
         let comparedPassword = await bcrypt.compare(password, foundUser.password);
         // if passwords dont match send back message
         if (!comparedPassword) {
            res.status(400).json({ message: "failure", payload: "check your email and password"});
         } else {
            // jwt jsonwebtoken this token will keep us logged in on the front end
            // the fist argument is the object containing only the information you want to expose
            // the second argument is the secret key which should be cloaked in dotenv!
            // the third argument is an object with a expiresIn key and a time limit
            let jwtToken = jwt.sign(
               {
                  email: foundUser.email,
               },
               process.env.PRIVATE_JWT_KEY,
               {
                  expiresIn: "1d"
               }
            );


            // if they do match, send back success message
            res.json({message: "Successfully logged in!", payload: jwtToken});
         }
      }

   } catch(e) {
      // res.json({message: "error", error: e})
      next(e);
   }
};

module.exports = {
   signup,
   login,
   getAllUsers,
   deleteUserById,
}