const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../utils/jwtMiddleware");

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// to protect our twilio API, we pass the jwtMiddleware.js function as the second argument
router.post("/send-sms", jwtMiddleware,function(req, res){

   client.messages
      .create({
         body: req.body.message,
         from: process.env.TWILIO_NUMBER,
         to: `+1${req.body.to}`,
         // to: process.env.MY_PHONE_NUMBER, //if upgrade twilio, this will be req.body.toNumber which the user would then input when sending what wants to be sent
      })
      .then(message => res.json(message))
      .catch((error) =>res.json(error))
});

module.exports = router;