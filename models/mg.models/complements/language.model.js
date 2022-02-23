const mongoose = require('mongoose')

const LanguageSchema = mongoose.Schema({
    language: String,
    code: String
},{
    timestamps: true
})

module.exports = mongoose.model('Language',LanguageSchema)