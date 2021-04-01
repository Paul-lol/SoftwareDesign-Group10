const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const UserInfo = require('./models/UserInfo')

function initialize(passport, getUserbyUsername, getUserById){
    const authenticateUser = async (inputUsername, inputPassword, done) => {
        UserInfo.findOne({username: inputUsername})
        .then( user => {
        //console.log(user);
        if(user == null) {
            return done(null, false, { message: 'User does not exist' })
        }
        else if (bcrypt.compare(inputPassword, user.password)) {
            return done(null, user)
        } else {
            return done(null, false, { message: 'Password incorrect' })
        }
        })
        .catch (err => console.log(err));
    }
    passport.use(new LocalStrategy({ usernameField: 'username'}, 
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user._id))
    passport.deserializeUser((id, done) => {
        UserInfo.findById(id, function(err, user) {
        return done(err, user)
        })
    })
}

module.exports = initialize