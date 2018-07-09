const mongoose = require('mongoose');
const entrySchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    flavors: [String],
    public: Boolean,
    img: [String],
    owner: String,
    messages: [{
        date: Date,
        message: String,
        author: String
    }]
}, {timestamps: true})

module.exports = mongoose.model('Entry', entrySchema);