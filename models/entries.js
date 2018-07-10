const mongoose = require('mongoose');
const entrySchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    flavors: [String],
    public: Boolean,
    img: [String],
    favorited: Number,
    owner: String,
    messages: [{
        date: Date,
        message: String,
        author: {id: String, name: String}
    }]
}, {timestamps: true})

module.exports = mongoose.model('Entry', entrySchema);