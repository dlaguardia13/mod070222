const mongoose = require('mongoose')

const GeneralInformationSchema = mongoose.Schema({
    name: String,
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

module.exports = mongoose.model('GeneralInformation',GeneralInformationSchema)