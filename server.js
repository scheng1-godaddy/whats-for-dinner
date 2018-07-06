/*---------------------------------------------------
Dependencies
---------------------------------------------------*/
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoUri =  process.env.MONGODB_URI || 'mongodb://localhost:27017/project2';
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');

/*---------------------------------------------------
Middleware
---------------------------------------------------*/
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(session({
  secret: "writingtpsreports", 
  resave: false,
  saveUninitialized: false
}));

/*---------------------------------------------------
Controllers
---------------------------------------------------*/
// Users 
const usersController = require('./controllers/users.js');
app.use('/users', usersController);
// Sessions
const sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);

/*---------------------------------------------------
Base route
---------------------------------------------------*/
app.get('/', (req, res) => {
  res.render('index.ejs', {
    currentUser: req.session.currentUser
  })
})

/*---------------------------------------------------
Listener
---------------------------------------------------*/
app.listen(port, () => {
  console.log('listening');
})

/*---------------------------------------------------
Mongo Connection
---------------------------------------------------*/
mongoose.connect(mongoUri);
mongoose.connection.on('open', () => {
  console.log('Connected to mongoose');
})
