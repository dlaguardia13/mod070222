const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
    category: String,
    type: Number,
    language_code: String.apply,
    translations: 
    [{
        languageCode: String,
        translation: String
    }]
},{
    timestamps: true
})

module.exports = mongoose.model('Category',StatusSchema)