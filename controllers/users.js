const express = require('express');
const usersRouter = express.Router();
const Users = require('../models/users.js');
const bcrypt = require('bcrypt');

usersRouter.get('/new/', (req, res) => {
    if (req.session.currentUser) {
        res.render('./users/new.ejs');
    } else {
        res.redirect('/')
    }
});

usersRouter.post('/', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    Users.create(req.body, (err, data) => {
        res.redirect('/')
    })
})

module.exports = usersRouter;