/*---------------------------------------------------
Dependencies
---------------------------------------------------*/
const express = require('express');
const entriesRouter = express.Router();
const Users = require('../models/users.js');
const Entries = require('../models/entries.js');

/*---------------------------------------------------
Route (GET) for new entry form
---------------------------------------------------*/
entriesRouter.get('/new', (req, res) => {
    if (req.session.currentUser) {
        res.render('./entries/new.ejs', {
            currentUser: req.session.currentUser
        });
    } else {
        res.send('You must login to create an entry')
    }
})

/*---------------------------------------------------
Route (POST) to create new entry
---------------------------------------------------*/
entriesRouter.post('/', (req, res) => {
    if (req.session.currentUser) {
        req.body.img = req.body.img.filter(Boolean);
        req.body.owner = req.session.currentUser._id
        Entries.create(req.body, (err, data) => {
            if (err) {
                res.send('Error creating entry: ' + err)
            } else {
                res.redirect('/users/' + req.session.currentUser.username);
            }
        })
    } else {
        res.send('You must login to create an entry');
    }
})

/*---------------------------------------------------
Route (GET) to show entry detail page
---------------------------------------------------*/
entriesRouter.get('/:entryId', (req, res) => {
    let currentUser = null;
    if (req.session.currentUser) {
        currentUser = req.session.currentUser;
    } 
    Entries.findById(req.params.entryId, (err, result) => {
        res.render('./entries/show.ejs', {
            currentUser: req.session.currentUser,
            currentEntry: result
        });
    })
})

// Export entries router
module.exports = entriesRouter;