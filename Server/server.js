if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require("path")

const uri = "mongodb+srv://dbUser:group10SD@sdproject.ebxx7.mongodb.net/database1?retryWrites=true&w=majority"
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

const userSchema = new mongoose.Schema({ 
    full_name: { type: String, required: true }, 
    street1: { type: String, required: true },
    street2: String,
    city: { type: String, required: true }, 
    zip: { type: Number, required: true },
    state: { type: String, required: true },
    username: { type: String, required: true }
});
const userInfoSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    new_user: { type: Boolean, default: true},
});
const fuelQuoteSchema = new mongoose.Schema({
    gallons: { type: Number, required: true },
    delivery_address: { type: String, required: true},
    delivery_date: { type: Date, required: true },
    price_per: { type: Number, required: true },
    total: { type: Number, required: true },
    username: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
const FuelQuote = mongoose.model("FuelQuote", fuelQuoteSchema);

const UserInfo = require('./models/UserInfo')
const initializePassport = require('./passport-config') 
const { join } = require('path')
const { truncateSync } = require('fs')

initializePassport(
    passport, 
    inputUsername => dbUsers.find(user => user.inputUsername === inputUsername),
    id => users.find(user => user.id === id)
)

let userInfo = {
    full_name: '', 
    street1: '', 
    street2: 'N/A',
    state: '',
    city: '', 
    zip: ''
};
app.use(express.static('public'));
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));
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

app.get('/', checkAuthenticated, async (req, res) => {
    const filter = { username: req.user.username }
    if(req.user.new_user){
        const update = { new_user: false }
        await UserInfo.findOneAndUpdate(filter, update)
        res.redirect('/editProfile')
    }
    else{
        await User.find(filter).then(async (info) => {
            console.log("info");
            console.log(info);
            userInfo = { 
                full_name: info[0].full_name,
                street1: info[0].street1,
                street2: info[0].street2,
                state: info[0].state,
                city: info[0].city,
                zip: info[0].zip
            };
        })
        res.render('index.ejs', {name: req.user.username});
    }
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
    state: userInfo.state,
    city: userInfo.city,
    zip: userInfo.zip});
})

const users = []
app.post('/register', checknotAuthenticated, async (req, res) => {
    try{
      const hashedPassword = await bcrypt.hash(req.body.inputPassword, 10 )
      users.push({
          id: Date.now().toString(),
          inputUsername: req.body.inputUsername,
          inputPassword: hashedPassword
      })
    await UserInfo.find({ username: req.body.inputUsername }).then((users) =>{
        if (users.length > 0){
            // console.log(users.length);
            //users.splice(0, users.length);
            res.redirect('/register');
        } else{
            const userInfo = new UserInfo ({
                username: req.body.inputUsername,
                password: hashedPassword,
                new_user: true
            })
            userInfo.save();
            console.log(userInfo);
            res.redirect('/login')
        }
    })
    } catch{
      res.redirect('/register')
    }
})


app.get('/editProfile', checkAuthenticated, (req, res) => {
    res.render('editProfile.ejs');
})

app.post('/editProfile', checkAuthenticated, async (req,res) => {
    //console.log(req.body);
    userInfo = req.body;
    const filter = { username: req.user.username };
    const user = await User.updateOne(filter, {
        full_name: userInfo.full_name, 
        street1 : userInfo.street1, 
        street2 : userInfo.street2, 
        state: userInfo.state,
        city: userInfo.city, 
        zip: userInfo.zip,
        username: req.user.username
    }, { upsert: true });
    await User.find(filter).then(async (info) => {
        //console.log("info");
        //console.log(info);
        userInfo = { 
            full_name: info[0].full_name,
            street1: info[0].street1,
            street2: info[0].street2,
            state: info[0].state,
            city: info[0].city,
            zip: info[0].zip
        };
    })
    //console.log(userInfo);
    res.redirect('/profile');
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

const hist = []
// Gets fuel quote history
app.get('/api/history', (req, res) => res.json(hist));

app.get('/history', checkAuthenticated, async (req, res) => {
    const filter = { username: req.user.username }
    await FuelQuote.find(filter).then((quotes) =>{
        var i = 0;
        for (i = 0; i < quotes.length; i++){
            hist.push({
                gallons: quotes[i].gallons,
                d_address: quotes[i].delivery_address,
                d_date: quotes[i].delivery_date,
                price_per: quotes[i].price_per,
                total: quotes[i].total
            });
        }
        console.log(hist);
    })


    res.render('history.ejs', {hist: hist});
    hist.splice(0, hist.length);
})
app.get('/fuel_quote', checkAuthenticated, (req, res) => {

    res.render('fuel_quote.ejs', {user:userInfo, location_f: req.user.first_time});
})



function Fuel_quote(gallons, d_address, d_date, price_per) { 
    this.gallons = gallons; 
    this.d_address = d_address;
    this.d_date = d_date;
    this.price_per = price_per;
    this.total = gallons * price_per;
}

app.post('/fuel_quote', checkAuthenticated, async (req,res) => {
    //console.log(req.user.username);
    const filter = { username: req.user.username }
    if(req.user.first_time){
        const update = { first_time: false }
        await UserInfo.findOneAndUpdate(filter, update)
    }
    let fuel = new Fuel_quote(req.body.gallons_requested,
        req.body.delivery_address,
        req.body.delivery_date,
        req.body.price_per_gallon, 
        req.body.total_due);
    console.log(req.body.price_per_gallon)
    const fuelQuote = new FuelQuote({
        gallons: fuel.gallons,
        delivery_address: fuel.d_address,
        delivery_date: fuel.d_date,
        price_per: fuel.price_per,
        total: fuel.total,
        username: req.user.username
    })
    await fuelQuote.save();
    res.redirect('/history');
})


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next() }
    res.redirect('/login')
}

function checknotAuthenticated(req, res, next){
    if (req.isAuthenticated()) { return res.redirect('/') }
    next()
}

const PORT = process.env.PORT || 3000;
module.exports = {
    checkAuth: function(){
        return checkAuthenticated;
    },
    checkHist: function(){
        return hist;
    },
    checkUsername: function(){
        return users.inputUsername;
    },
    checkPassword: function(){
        return users.inputPassword;
    },
    user: function() {
        return userInfo;
    },
    
    fuel_quote: function() {
        return Fuel_quote;
    },
    server: app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}
