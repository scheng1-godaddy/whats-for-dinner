/*---------------------------------------------------
Dependencies
---------------------------------------------------*/
const express = require('express');
const usersRouter = express.Router();
const Users = require('../models/users.js');
const Entries = require('../models/entries.js');
const bcrypt = require('bcrypt');


/*---------------------------------------------------
Route for new user form
---------------------------------------------------*/
usersRouter.get('/new/', (req, res) => {
    res.render('./users/new.ejs')
});

/*---------------------------------------------------
Create route for new user
---------------------------------------------------*/
usersRouter.post('/', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    Users.create(req.body, (err, data) => {
        // res.redirect('/users/'+req.body.username)
        req.session.currentUser = req.body;
        res.redirect('/');
    })
})

/*---------------------------------------------------
Route for user show page
---------------------------------------------------*/
usersRouter.get('/:username', (req, res) => {
    Users.findOne({ username: req.params.username }, (err, result) => {
        let userEntries = [];
        let owner = false;
        if (err) {
            res.send('Error retrieving user')
        } else {
            // Grab the entries for this user
            Entries.find({ owner: result._id}, (entryErr, entryResult) => {
                if (entryErr) {
                    console.log('Error finding entries for user', result.username, entryErr);
                } else {
                    userEntries = entryResult;
                    console.log(userEntries);
                    if (req.session.currentUser) {
                        // Check if current user is accessing their own page
                        if (req.session.currentUser.username === req.params.username) {
                            // If accessing own page, set owner flag
                            owner = true;
                        }
                    }
                    res.render('./users/index.ejs', {
                        currentUser: req.session.currentUser,
                        userEntries: userEntries,
                        owner: owner
                    })
                }
            })
        }
    })
});

// Export the user route
module.exports = usersRouter;