/*---------------------------------------------------
Dependencies
---------------------------------------------------*/
const express = require('express');
const sessionsRouter = express.Router();
const Users = require('../models/users.js');
const bcrypt = require('bcrypt');

/*---------------------------------------------------
Route for new session
---------------------------------------------------*/
sessionsRouter.get('/new', (req, res) => {
    res.render('./sessions/new.ejs');
})

/*---------------------------------------------------
Route to delete session
---------------------------------------------------*/
sessionsRouter.delete('/', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

/*---------------------------------------------------
Dependencies
---------------------------------------------------*/
sessionsRouter.post('/', (req, res) => {
    console.log(req.body.username);
    Users.findOne({ username: req.body.username }, (err, foundUser) => {
        if (bcrypt.compareSync(req.body.password, foundUser.password)) {
            req.session.currentUser = foundUser;
            res.redirect('/users');
        } else {
            res.send('wrong password');
        }
    });
})

// Export Session router
module.exports = sessionsRouter;