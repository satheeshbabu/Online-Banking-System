const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

var final;

// Register
router.post('/register', (req, res, next) => {
  genAccNum();
  let newUser = new User({
    name: req.body.name,
    accnumber: '12345678',
     address:{
      street: req.body.street,
      area:req.body.area,
      county:req.body.county,
      country:req.body.country
    },
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    balance: 0
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:err});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

function genAccNum(){
  var first = Math.floor((Math.random() * 9999) + 1000);
  var second = Math.floor((Math.random() * 9999) + 1000);
  var final = first.toString + second.toString;
};

//Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found', User: user});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});
router.get('/dashboard', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

router.post('/transferTo', (req, res, next) => {
    
});

router.post('/lodge', (req, res, next) => {
    
});
module.exports=router;
