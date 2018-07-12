/*---------------------------------------------------
Dependencies
---------------------------------------------------*/
const express = require('express');
const usersRouter = express.Router();
const Users = require('../models/users.js');
const Entries = require('../models/entries.js');
const bcrypt = require('bcrypt');


/*---------------------------------------------------
Route (GET) for index
---------------------------------------------------*/
usersRouter.get('/', (req, res) => {
    // Get the latest entries
    Users.find({}).sort({ date: -1 }).exec((err, result) => {
        if (!err && result) {
            res.render('./users/index.ejs', {
                currentUser: req.session.currentUser,
                userEntries: result
            })
        }
    })
})

/*---------------------------------------------------
Route for new user form
---------------------------------------------------*/
usersRouter.get('/new/', (req, res) => {

    res.render('./users/new.ejs', {
        currentUser: req.session.currentUser
    })
});

/*---------------------------------------------------
Create route for new user
---------------------------------------------------*/
usersRouter.post('/', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    if (!req.body.img) {
        req.body.img = "http://via.placeholder.com/500x500";
    }
    Users.create(req.body, (err, data) => {
        if(!err && data) {
            req.session.currentUser = data;
            res.redirect('/');
        }
        
    })
})

/*---------------------------------------------------
Route for user edit page
---------------------------------------------------*/
usersRouter.get('/:username/edit', (req, res) => {
    // Check if the logged in user is the owner
    if (req.session.currentUser && (req.session.currentUser.username === req.params.username)) {
        Users.findOne({ username: req.params.username }, (err, result) => {
            if (err) {
                res.send('Error retrieving user')
            } else {
                res.render('./users/edit.ejs', {
                    currentUser: result
                })
            }
        })
    } else {
        res.redirect('/');
    }
})

/*---------------------------------------------------
Route for user update
---------------------------------------------------*/
usersRouter.put('/:username', (req, res) => {
    // Check if the logged in user is the owner
    if (req.session.currentUser.username === req.params.username) {
        Users.findByIdAndUpdate(req.session.currentUser._id, req.body, {new: true}, (err, result) => {
            console.log('Updated user: ', result);
            // Update the session
            req.session.currentUser = result;
            res.redirect('/users/'+result.username);
        })
    } else {
        res.redirect('/');
    }
})

/*---------------------------------------------------
Route for user delete
---------------------------------------------------*/
usersRouter.delete('/:username', (req, res) => {
    // Check if the logged in user is the owner
    if (req.session.currentUser && (req.session.currentUser.username === req.params.username)) {
        // Remove their entries first
        Entries.remove({owner: req.session.currentUser._id}, (err) => {
            console.log('error removing entries for user', err);
        })
        // Now delete user
        Users.findByIdAndRemove(req.session.currentUser._id, (err, result) => {
            if (err) {
                console.log();
            } else {
                console.log('Removed user: ', result);
                // Kill the session
                req.session.destroy(() => { })
                res.redirect('/')
            }
        })
    } else {
        res.redirect('/')
    }
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
            if (result) {
                Entries.find({ owner: result._id}, (entryErr, entryResult) => {
                    if (entryErr) {
                        console.log('Error finding entries for user', result.username, entryErr);
                    } else {
                        userEntries = entryResult;
                        if (req.session.currentUser) {
                            // Check if current user is accessing their own page
                            if (req.session.currentUser.username === req.params.username) {
                                // If accessing own page, set owner flag
                                owner = true;
                            }
                        }
                        res.render('./users/show.ejs', {
                            currentUser: req.session.currentUser,
                            user: result,
                            userEntries: userEntries,
                            owner: owner
                        })
                    }
                })
            } else {
                res.send('Could not find user')
            }
        }
    })
});

// Export the user route
module.exports = usersRouter;