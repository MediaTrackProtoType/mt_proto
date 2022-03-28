/* eslint-disable no-template-curly-in-string */
//import express
const express = require("express");
//create express router
const router = express.Router();
//import user routes
const userRoutes = require("../routes/userRoutes");
const User = require("../models/userModel");
const bodyParser = require("body-parser");
//const books = require("./data/books");
const dotenv = require("dotenv");

//connect to data base via db file
const connectDB = require("../config/db.js");
const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
//const { notFound, errorHandler } = require("../middlewares/errorMiddleware");

//create express object
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dotenv.config();

//call for active db connection
connectDB();

//receive json data format from user
app.use(express.json());

//API endpoint for serving data from backend to frontend

//listen for post data on this user register route
app.post("/Register", async (req, res) => {
  //const { first_name1, last_name1, username1, email1, password1 } = req.body;
  console.log(req.body);
  const first_name = req.body.first;
  const last_name = req.body.last;
  const username = req.body.user;
  const email = req.body.email1;
  const password = req.body.pass;
  //check if username or email is alrady used
  const takenUserName = await User.findOne({ username: req.body.user });
  const takenEmail = await User.findOne({ password: req.body.pass });
  if (takenUserName || takenEmail) {
    res.json({ message: "Username or email already in use" });
  } else {
    const user = new User({
      first_name,
      last_name,
      username,
      email,
      password,
    });
    user.save();
    res.json({ message: "User Created" });
  }
});

//listen for post data on this user login route
app.post("/Login", (req, res) => {
  console.log(req.body);
  const username = req.body.user;
  const password = req.body.pass;
  User.findOne({ username: req.body.user }).then((dbUser) => {
    if (!dbUser) {
      return res.json({
        messge: "Invalid Username or Password",
      });
    }
    bcrypt.compare(req.body.pass, dbUser.pass).then((isCorrect) => {
      if (isCorrect) {
        const payLoad = {
          id: dbUser._id,
          username: dbUser.username,
        };
        jwt.sign(
          payLoad,
          process.env.JWT_SECRET,
          { expiresIn: 86400 },
          (err, token) => {
            if (err) return res.json({ message: err });
            return res.json({
              message: "Success",
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res.json({
          message: "Invalid Username or Password",
        });
      }
    });
  });
});

app.get("/", (req, res) => {
  res.send("Book API is running");
});
//assigned port from env file
const PORT = process.env.PORT || 5000;

//create web server - listens for frontend browser request
app.listen(PORT, console.log("Server running on PORT", PORT));
module.exports = router;
