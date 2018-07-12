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
const Entries = require('./models/entries.js');

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
// Entries
const entriesController = require('./controllers/entries.js');
app.use('/entries', entriesController);

/*---------------------------------------------------
Base route
---------------------------------------------------*/

app.get('/', (req, res) => {
  // Get the latest entries
  Entries.find({}).sort({ date: -1 }).limit(3).exec((err, result) => {
    if (!err && result) {
      res.render('index.ejs', {
        currentUser: req.session.currentUser,
        userEntries: result
      })
    }
  })
})

/*---------------------------------------------------
Seed routes
---------------------------------------------------*/
const User = require('./models/users.js');
const Entry = require('./models/entries.js');
const userSeed = require('./models/userseed.js');
const entrySeed = require('./models/entryseed.js')

// Seed for Users
app.get('/seedusers', (req, res) => {
  // encrypt all the passwords
  userSeed.forEach((user) => {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  })
  // Enter into database
  User.create(userSeed, (err, createdUsers) => {
    console.log(createdUsers);
    res.redirect('/');
  })
})

// Seed for Entries
app.get('/seedentries', (req, res) => {
  // Get the userID for owner property
  entrySeed.forEach((entry) => {
    User.find({username: entry.owner}, (err, result) => {
      if (result) {
        console.log('user ID for ' + entry.owner + ' is', result[0]._id);
        entry.owner = result[0]._id;
        // Enter into database
        Entry.create(entry, (err, createdEntry) => {
        console.log(createdEntry);
        })
      }
    })
  })
  setTimeout(() => {
    res.redirect('/')
  }, 2000)
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
