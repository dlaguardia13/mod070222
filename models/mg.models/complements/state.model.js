const Objectid = mongoose.Schema.Types.ObjectId
const mongoose = require('mongoose')

const StateSchema = mongoose.Schema({
    state: String,
    city: [{ type: Objectid, default: null }]
},{
    timestamps: true
})

module.exports = mongoose.model('State',StateSchema)