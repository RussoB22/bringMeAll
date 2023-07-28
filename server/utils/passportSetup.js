const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcryptjs = require('bcryptjs');


module.exports = function (passport) {
  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    function (req, email, password, done) {
      User.findOne({ 'email': email })
        .then(user => {
          if (!user) {
            console.log('User Not Found with email ' + email);
            return done(null, false,
              req.flash('message', 'User Not found.'));
          }
          bcryptjs.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) {
                console.log('Invalid Password');
                return done(null, false,
                  req.flash('message', 'Invalid Password'));
              } else {
                user.save().then(() => {
                  console.log('Token saved!');
                }).catch((err) => {
                  console.error(err);
                });

                return done(null, user);
              }
            })
            .catch(err => {
              throw err;
            });
        })
        .catch(err => {
          return done(err);
        });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

};
