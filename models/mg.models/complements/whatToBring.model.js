const mongoose = require('mongoose')

const WhatToBringSchema = mongoose.Schema({
    title: String,
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

module.exports = mongoose.model('WhatToBring',WhatToBringSchema)