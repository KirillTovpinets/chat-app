const LocalStratagy = require('passport-local').Strategy;
const User = require('./models/user.model');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  passport.use(new LocalStratagy(
    { usernameField:"email" },
      function(email, password, done){
          User.findOne({ email }, function(err, user){
            if(err){
              console.log(err);
              return;
            }

            if(!user){
              return done(null, false, { message: 'User not found' })
            }

            bcrypt.compare(password, user.password, function(err, isMatch){
              console.log(isMatch);
              if(err){
                console.log(err);
                return;
              }
              if(!isMatch){
                return done(null, false, { message: 'Incorrect password'})
              }
              return done(null, user);
            })
      })
  }))

  passport.serializeUser(function(user, done){
    done(null, user);
  })

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    })
  })
}