const mongoose = require('mongoose')
const slugHero = require('mongoose-slug-hero')

const MultimediaGallerySchema = mongoose.Schema({
    name: String,
    description: String,
    urlPhoto: String,
    key: String,
    version: {
        type: Number,
        default: 1
    }
},{
    timestamps: true
})

MultimediaGallerySchema.plugin(slugHero, {doc: 'MultimediaGallery', field: 'name'})

module.exports = mongoose.model('MultimediaGallery',MultimediaGallerySchema)