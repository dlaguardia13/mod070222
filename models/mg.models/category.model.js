const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
    category: String,
    type: Number,
    languageCode: String,
    translations: 
    [{
        languageCode: String,
        translation: String
    }]
},{
    timestamps: true
})

module.exports = mongoose.model('category',CategorySchema,'category')