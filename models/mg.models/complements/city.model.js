const Objectid = mongoose.Schema.Types.ObjectId
const mongoose = require('mongoose')

const CitySchema = mongoose.Schema({
    city: String,
    postalCode: Number
},{
    timestamps: true
})

module.exports = mongoose.model('City',CitySchema)