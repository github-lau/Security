//jshint esversion:6

//--- L2 Security Setup ---//
// L2 security setup includes database encryption
// additional npm package to install: dotenv, mongoose-encryption.
// before requiring all packages, need to setup dotenv first:
require('dotenv').config(); // ensure the .env file is already created!

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();

// setting up ejs
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

// connecting mongoDB database using mongoose
mongoose.connect("mongodb://localhost:27017/userDB1", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// setting up mongoose schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);


app.get('/', function(req, res){
  res.render('home');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/register', function(req,res){
  res.render('register');
});

app.post('/register', function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});

app.post('/login', function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password){
          res.render('secrets');
        } else {
          res.redirect('/');
        }
      }
    }
  });
});

app.listen(3000, function(){
  console.log("Server started on port 3000...");
});
