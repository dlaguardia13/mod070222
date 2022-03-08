const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CitySchema = new Schema({
    city: String,
    postalCode: Number
},{
    timestamps: true
})

module.exports = mongoose.model('city',CitySchema,'city')