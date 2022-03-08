const mongoose = require('mongoose')

const AptToSchema = mongoose.Schema({
    aptTo: String,
    type: Number,
    languageCode: String,
    translations: [
        {
            languageCode: String,
            translation: String
        }
    ]
},{
    timestamps: true
})

module.exports = mongoose.model('aptTo',AptToSchema,'aptTo')