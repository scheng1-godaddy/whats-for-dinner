const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    fname: String,
    lname: String,
    public: Boolean,
    img: String,
    entries: [String]
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema);