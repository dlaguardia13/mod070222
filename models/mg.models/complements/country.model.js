const mongoose = require('mongoose')
const Objectid = mongoose.Schema.Types.ObjectId
const Schema = mongoose.Schema

const CountrySchema = new Schema({
    coutry: String,
    state: [{ type: Objectid, default: null }],
    countryCode: String
},{
    timestamps: true
})

CountrySchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('country',CountrySchema,'country')