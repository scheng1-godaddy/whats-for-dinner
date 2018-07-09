const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    email: {type: String, unique: true},
    fname: String,
    lname: String,
    public: Boolean,
    img: String,
    favorites: [{
        date: Date,
        entryid: String
    }]
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema);