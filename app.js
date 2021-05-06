//jshint esversion:6

//--- L1 Security Setup ---//
// L1 security setup includes basic login/register authentication
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

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
const userSchema = {
  email: String,
  password: String
};
