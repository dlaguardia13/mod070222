const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Objectid = mongoose.Schema.Types.ObjectId
const slugHero = require('mongoose-slug-hero')
//  MONGO
import country from '../mg.models/complements/country.model'
import state from '../mg.models/complements/state.model'
import city from '../mg.models/complements/city.model'
import category from '../mg.models/category.model'
import difficult from '../mg.models/complements/difficult.model'
import aptTo from '../mg.models/complements/aptTo.model'
import language from '../mg.models/complements/language.model'
import whatToBring from '../mg.models/complements/whatToBring.model'
import generalInformation from '../mg.models/generalInformation.model'
import cancellationPolicyProduct from '../mg.models/cancellationPolicy.model'
import includedInPrice from '../mg.models/complements/includedInPrice.model'

const TourSchema = new Schema({
    //  Step 1
    status: { type: Objectid, ref: 'status', autopopulate: true },
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
        country: { type: Objectid, default: null/*, ref: country , autopopulate: {select: '_id'}*/ },
        state:   { type: Objectid, default: null/*, ref: state , autopopulate: {select: 'state'}*/ },
        city:    { type: Objectid, default: null/*, ref: city , autopopulate: {select: 'city'}*/ },
        realAddress: { type: String, default: null },
        latitude: { type: Number, default: null },
        length: { type: Number, default: null }
    },
    // Step 3
    capacity: { type: Number, default: null },
    beforeBooking: { type: Number, default: null },
    category: { type: Objectid, default: null, /*ref: category ,autopopulate: {select: 'category'}*/ },
    difficultyLevel: { type: Objectid, default: null/*, ref: difficult ,autopopulate: {select: 'name'}*/ },
    aptTo: { type: Objectid, default: null, /*ref: aptTo ,autopopulate: {select: 'aptTo'}*/},
    language: [{ type: Objectid, default: null/*, ref: language , autopopulate: true*/ }],
    //  Step 4
    whatToBring: [{ type: Objectid, default: null/*, ref: whatToBring ,autopopulate: true*/  }],
    nYouWillSee: [{ 
            original: { type: String, default: null },
            translations: { type: Array, default: null } 
        }],
    additionalInformation: [{ type: Objectid, default: null/*, ref: generalInformation ,autopopulate: true {select: ['name','languageCode','translations']}*/}],
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
                translations: { type: Array,  default: null }
            }]
    }],    
    // Step 8
    cancellationPolicy: [{ type: Objectid, default: null/*, ref: cancellationPolicyProduct ,autopopulate: true */}],
    customCancellationPolicy: [{
        cancellationPolicy: { type: Objectid, default: null/*, ref: cancellationPolicyProduct*/ },
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
    includedInPrice: [{ type: Objectid, default: null/*, ref: includedInPrice ,autopopulate: true*/ }],
    //  Step 10
    customTerms: [{
        original: { type: String, default: null },
        translations: { type: Array, default: null }
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
    slug: String,
    pgProfile: { type: String } 
},{
    timestamps: true,
    usePushEach: true
});

TourSchema.plugin(slugHero, {doc: 'Tour', field: 'name'})
TourSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('tour', TourSchema, 'tour');