const mongoose = require('mongoose')

const CancellationPolicyProductSchema = mongoose.Schema({
    title: String,
    description: String,
    moreInfo: String,
    noDays: Number,
    percentDiscount: Number,
    order: Number,
    productType: Number,
    languageCode: String,
    translation: String
},{
    timestamps: true
})

module.exports = mongoose.model('cancellationPolicyProduct',CancellationPolicyProductSchema,'cancellationPolicyProduct')