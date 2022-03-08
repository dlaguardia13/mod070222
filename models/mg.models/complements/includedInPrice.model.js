const mongoose = require('mongoose')

const IncludedInPriceSchema = mongoose.Schema({
    description: String,
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

module.exports = mongoose.model('includedInPrice',IncludedInPriceSchema,'includedInPrice')