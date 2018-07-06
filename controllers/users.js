const express = require('express');
const usersRouter = express.Router();
const Users = require('../models/users.js');
const bcrypt = require('bcrypt');

usersRouter.get('/', (req, res) => {
    res.send("This is a test")
})

usersRouter.get('/new/', (req, res) => {
    res.render('./users/new.ejs')
});

usersRouter.post('/', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    Users.create(req.body, (err, data) => {
        res.redirect('/')
    })
})

module.exports = usersRouter;