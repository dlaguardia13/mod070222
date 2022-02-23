const Objectid = mongoose.Schema.Types.ObjectId
const mongoose = require('mongoose')

const CountrySchema = mongoose.Schema({
    coutry: String,
    state: [{ type: Objectid, default: null }],
    countryCode: String
},{
    timestamps: true
})

module.exports = mongoose.model('Country',CountrySchema)