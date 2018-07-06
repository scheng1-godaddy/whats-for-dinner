const express = require('express');
const sessionsRouter = express.Router();
const Users = require('../models/users.js');
const bcrypt = require('bcrypt');

sessionsRouter.get('/new', (req, res) => {
    res.render('./sessions/new.ejs');
})

sessionsRouter.delete('/', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

sessionsRouter.post('/', (req, res) => {
    Users.findOne({ name: req.body.name }, (err, foundUser) => {
        if (bcrypt.compareSync(req.body.password, foundUser.password)) {
            req.session.currentUser = foundUser;
            res.redirect('/');
        } else {
            res.send('wrong password');
        }
    });
})

module.exports = sessionsRouter;