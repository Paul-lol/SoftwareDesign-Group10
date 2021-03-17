if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require("path")

const initializePassport = require('./passport-config')
const { join } = require('path')
initializePassport(
    passport, 
    inputUsername => users.find(user => user.inputUsername === inputUsername),
    id => users.find(user => user.id === id)
)

const users = []
let userInfo = {
    full_name: 'Raj Singh', 
    street1: '22400 Grand Cir Blvd Suite 206, Katy, TX 77449', 
    street2: 'N/A', 
    city: 'Houston', 
    zip: '77082'
};
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:true}));
app.set('view-engine', 'ejs')
app.use(express.urlencoded( { extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.inputUsername})
})

app.get('/login', checknotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checknotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checknotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.get('/profile', checkAuthenticated, (req,res) => {
    res.render('profile.ejs', {full_name: userInfo.full_name, 
    street1: userInfo.street1, 
    street2: userInfo.street2,
    city: userInfo.city,
    zip: userInfo.zip});
})

app.post('/register', checknotAuthenticated, async (req, res) => {
    try{
      const hashedPassword = await bcrypt.hash(req.body.inputPassword, 10 )
      users.push({
          id: Date.now().toString(),
          inputUsername: req.body.inputUsername,
          inputPassword: hashedPassword
      })
      res.redirect('/login')
    } catch{
      res.redirect('/register')
    }
})


app.get('/editProfile', checkAuthenticated, (req, res) => {
    res.render('editProfile.ejs');
})

app.post('/editProfile', checkAuthenticated, (req,res) => {
    userInfo = req.body;
    console.log(userInfo);
    res.redirect('/profile');
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}

function checknotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))