const express = require('express')
const app = express()
const session = require("express-session")
const path = require('path')
const router = require("./routes/userRouter")
const arouter = require("./routes/admnRouter")
const DBconnect = require('./config/DBconnect')
require('dotenv').config()
const hbs = require('hbs')
const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// app.use((req, res, next) => {
//   res.status(404).render('404 page')})

app.set("view engine", "hbs")
DBconnect() //database

app.use(function(req, res, next){
    if(!req.user)
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

hbs.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});
hbs.registerHelper('if_eq', function (a, b,opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

app.use(express.static(path.resolve(__dirname, 'public')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: true
}))


app.use('/', router)
app.use('/admin', arouter)



app.listen(2000, console.log(`Server listening on port http://localhost:2000`))