const mongoose = require('mongoose')

const StatusSchema = mongoose.Schema({
    status: String,
    type: Number
},{
    timestamps: true
})

module.exports = mongoose.model('status',StatusSchema,'status')