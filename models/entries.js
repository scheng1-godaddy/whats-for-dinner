const mongoose = require('mongoose');
const entrySchema = new mongoose.Schema({
    name: String,
    type: String,
    description: String,
    flavors: [String],
    public: Boolean,
    img: [String],
    userId: String
})

module.exports = mongoose.model('Entry', entrySchema);