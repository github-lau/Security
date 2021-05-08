//jshint esversion:6

//--- L3 Security Setup ---//
// L3 security setup includes further secures by hashing with md5
// npm package to install: md5

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express();

console.log("weak password hash: " + md5("123456"));
console.log("strong password hash: " + md5("sdkfjalskdf3453jsdslk4"));

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
    password: md5(req.body.password)
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
  const password = md5(req.body.password);

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
