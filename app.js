//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
})

// ------------------- register page ----------------
app.route("/register")

.get((req, res) => {
  res.render("register");
})

.post((req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  })
});

// ------------------- login page ------------------
app.route("/login")

.get((req, res) => {
  res.render("login");
})

.post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username}, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          // Correct user
          res.render("secrets");
        }
      }
    }
  });
})

// ------------------- logout page ------------------
app.get("/logout", (req, res) => {
  res.redirect("/");
});

// ----------------------------------------------------

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
