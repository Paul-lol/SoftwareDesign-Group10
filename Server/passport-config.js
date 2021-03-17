const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserbyUsername, getUserById){
    const authenticateUser = async (inputUsername, inputPassword, done) => {
        const user = getUserbyUsername(inputUsername)
        if (user == null) {
            return done(null, false, { message: 'User does not exist' })
        }

        try {
           if (await bcrypt.compare(inputPassword, user.inputPassword)) {
                return done(null, user)
           } else {
               return done(null, false, { message: 'Password incorrect' })
           }
        } catch (e) {
                return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'username'}, 
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize