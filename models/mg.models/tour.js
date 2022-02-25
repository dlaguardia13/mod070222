const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Objectid = mongoose.Schema.Types.ObjectId
const slugHero = require('mongoose-slug-hero')

const TourSchema = new Schema({
    //  Step 1
    status: Objectid,
    doubleSchema: { type: Boolean, default: true },
    type: Number,
    name: String,
    nName: { original: String, translation: Array },
    title: String,
    nTitle: { original: String, translation: Array },
    description: String,
    nDescription: { original: String, translation: Array },
    //  Step 2
    placeOfDeparture: {
        country: { type: Objectid, default: null },
        state:   { type: Objectid, default: null },
        city:    { type: Objectid, default: null },
        realAddress: { type: String, default: null },
        latitude: { type: Number, default: null },
        length: { type: Number, default: null }
    },
    // Step 3
    capacity: { type: Number, default: null },
    beforeBooking: { type: Number, default: null },
    category: { type: Objectid, default: null },
    difficultyLevel: { type: Objectid, default: null },
    aptTo: { type: Objectid, default: null },
    language: [{ type: Objectid, default: null }],
    //  Step 4
    whatToBring: [{ type: Objectid, default: null }],
    nYouWillSee: [{ 
            original: { type: String, default: null },
            translation: { type: Array, default: null } 
        }],
    additionalInformation: [{
        name: { type: String, default: null },
        languageCode: String,
        translations: { translation: String, languageCode: String }
    }],
    //  Step 5
    mainPicture: { type: Objectid, default: null },
    multimediaGallery: [{ type: Objectid, default: null }],
    //  Step 6
    availableAllYear: { type: Boolean, default: false },
    availability: [
        {
            mountInitial: { type: Number, default: null},
            mountFinal: { type: Number, default: null},
            days: { type: Array, default: null},
            schedule: [{
                startTime: { type: String, default: null },
                endTime: { type: String, default: null }
            }]
        }
    ],
    //  Step 7
    durationType: { type: Number, default: null },
    timeDuration: { type: Number, default: null },
    flexibleSchedules: { type: Boolean, default: false },
    startTimes: { type: Array, default: null },
    itineraryTour: [{
        activity: [{
                startTime:   { type: String, default: null },
                description: { type: String, default: null },
                translation: { type: Array,  default: null }
            }]
    }],    
    // Step 8
    cancellationPolicy: [{ type: Objectid, default: null }],
    customCancellationPolicy: [{
        cancellationPolicy: { type: Objectid, default: null },
        noDays: { type: Number, default: null },
        percent: { type: Number, default: null}
    }],
    changesInReservation: { type: Boolean, default: false },
    //  Step 9
    typeOfTour: { type: Number, default: null },
    price: { type: Number, default: null },
    minOfPeople: { type: Number, default: null },
    privatePrice: {
        minPax: { type: Number, default: null },
        adult:  { type: Number, default: null },
        child:  { type: Number, default: null }
    },
    collectivePrice: {
        minPax: { type: Number, default: null },
        adult:  { type: Number, default: null },
        child:  { type: Number, default: null }
    },
    includedInPrice: [{ type: Objectid, default: null }],
    //  Step 10
    customTerms: [{
        original: { type: String, default: null },
        translation: { type: Array, default: null }
    }],
    //  Parks & Activities
    localPrices: {
        minPax: { type: Number, default: null },
        adult:  { type: Number, default: null },
        child:  { type: Number, default: null }
    },
    foreingPrices: {
        minPax: { type: Number, default: null },
        adult:  { type: Number, default: null },
        child:  { type: Number, default: null }
    },
    schedules: [{
        day: { type: Number, default: null },
        alwaysOpen: { type: Boolean, default: false },
        closed: { type: Boolean, default: false },
        openingTime: { type: String, default: null },
        closingTime: { type: String, default: null }
    }],
    //  Extra
    beforeBooking: { type: Number, default: null},
    schedule: { type: String, default: null },
    collective: { type: Boolean, default: null },
    //  Other Projects
    pgProfile: { type: String } 
},{
    timestamps: true,
    usePushEach: true
});

TourSchema.plugin(slugHero, {doc: 'Tour', field: 'name'})

module.exports = mongoose.model('Tour', TourSchema);