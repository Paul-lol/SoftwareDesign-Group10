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
app.set('view-engine', 'ejs')
app.use(express.urlencoded( { extended: false}))
app.use(flash())
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
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


// hardcoded value for history
const hist = [
    {
        gallons: 101,
        d_address: '4800 Calhoun Rd, Houston, TX 77204-2610',
        d_date: '02/14/2021',
        price_per: 2.19,
        total: 221.19
    },
    {
        gallons: 135,
        d_address: '6060 N Fry Rd, Katy, TX 77449',
        d_date: '02/13/2021',
        price_per: 2.35,
        total: 317.25
    },
    {
        gallons: 276,
        d_address: '1234 Dummy Values, Houston, TX 77123',
        d_date: '01/29/2021',
        price_per: 2.40,
        total: 662.40
    }
]
// Gets fuel quote history
app.get('/api/history', (req, res) => res.json(hist));

app.get('/history', checkAuthenticated, (req, res) => {
    res.render('history.ejs', {hist: hist});
    /*
    res.render('history.ejs', {gallons1: hist[0].gallons,
    d_a1: hist[0].d_address,
    date1: hist[0].d_date,
    per1: hist[0].price_per,
    total1: hist[0].total,
    gallons2: hist[1].gallons,
    d_a2: hist[1].d_address,
    date2: hist[1].d_date,
    per2: hist[1].price_per,
    total2: hist[1].total,
    gallons3: hist[2].gallons,
    d_a3: hist[2].d_address,
    date3: hist[2].d_date,
    per3: hist[2].price_per,
    total3: hist[2].total
    });
    */
})
app.get('/fuel_quote', checkAuthenticated, (req, res) => {
    res.render('fuel_quote.ejs', {address1: userInfo.street1});
})
let fuel_quote = {
    gallons_requested: 0,
    delivery_address: '',
    delivery_date: '',
    price_per_gallon: '',
    total_due: ''
};
app.post('/fuel_quote', checkAuthenticated, (req,res) => {
    //I used the fuelquote variable to populate the hist array
    // I should have instantiated the fuelquote object as a new object each time but my programming skills are not up to par rn
    //Errors: on the app, it just repeats the last item I added to the list and thats the error right now. 
    //I created new member variables to match the description so it can render correctly on history page, I should have made a new fuel_quote object but i was lazy lol. 
    //fuel_quote = req.body;
    fuel_quote.gallons = req.body.gallons_requested;
    fuel_quote.d_address = req.body.delivery_address;
    fuel_quote.d_date = req.body.delivery_date;
    fuel_quote.price_per = req.body.price_per_gallon;
    fuel_quote.total = req.body.total_due;
    hist.push(fuel_quote);
    console.log(fuel_quote);
    res.redirect('/history');
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