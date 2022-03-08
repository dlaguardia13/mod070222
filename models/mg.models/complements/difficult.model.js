const mongoose = require('mongoose')

const DifficultSchema = mongoose.Schema({
    name: String,
    translations: [
        {
            languageCode: String,
            translation: String
        }
    ]
},{
    timestamps: true
})

module.exports = mongoose.model('difficult',DifficultSchema,'difficult')