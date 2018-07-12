/*---------------------------------------------------
Dependencies
---------------------------------------------------*/
const express = require('express');
const sessionsRouter = express.Router();
const Users = require('../models/users.js');
const bcrypt = require('bcrypt');

/*---------------------------------------------------
Route for new session (login)
---------------------------------------------------*/
sessionsRouter.get('/new', (req, res) => {
    res.render('./sessions/new.ejs', {
        currentUser: req.session.currentUser
    });
})

/*---------------------------------------------------
Route to delete session (logout)
---------------------------------------------------*/
sessionsRouter.delete('/', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

/*---------------------------------------------------
Route to create new session
---------------------------------------------------*/
sessionsRouter.post('/', (req, res) => {
    console.log(req.body.username);
    Users.findOne({ username: req.body.username }, (err, foundUser) => {
        if (foundUser) {
            if (bcrypt.compareSync(req.body.password, foundUser.password)) {
                req.session.currentUser = foundUser;
                res.redirect('/users/'+foundUser.username);
            } else {
                res.send('wrong password');
            }
        } else {
            res.send('Wrong username')
        }
    });
})

// Export Session router
module.exports = sessionsRouter;