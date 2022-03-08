const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Objectid = mongoose.Schema.Types.ObjectId

const StateSchema = new Schema({
    state: String,
    city: [{ type: Objectid, default: null }]
},{
    timestamps: true
})

StateSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('state',StateSchema,'state')