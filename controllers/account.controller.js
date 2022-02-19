const bcrypt = require("bcryptjs")
const UserModel = require("../models/user.model")
const passport = require('passport');

const registerUser = (req, res, next) => {
  bcrypt.genSalt(10, function(saltError, salt){
    if(saltError){
      console.log(saltError);
      return;
    }
    bcrypt.hash(req.body.password, salt, function(err, hash){
      if(err){
        console.log(err);
        return;
      }

      const newUser = new UserModel({
        ...req.body,
        password: hash
      })
      newUser.save(function(err){
        if(err){
          console.log(err);
          return;
        }
        res.status(200).send();
      });
    })
  })
}

const loginUser = (req, res, next) => {
  passport.authenticate('local', {}, function(err, user) {
    if(!user || !req.isAuthenticated()){
      res.status(500).send();
      return;
    }
    req.user = user;
    res.status(200).send(user);
  })(req, res, next)
}

const logout = (req, res, next) => {
  console.log(req.user);
  req.logout();
  res.status(200).send();
}

module.exports = {
  registerUser,
  logout,
  loginUser
}