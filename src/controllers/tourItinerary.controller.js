import { translateArray } from "../controllers/general/translator.controller"
const ToMdTour = require('../../models').tb_tt_to_md_tour
const ToItinerary = require('../../models').tb_tt_to_itinerary
const ToActivity = require('../../models').tb_tt_to_activity
const ToTrActivity = require('../../models').tb_tt_to_tr_activity

export async function addInfoTourItinerary(req, res) {
    const { tour_id } = req.params
    const { product_type, language_code, flexible_schedules, duration_type, time_duration,
        flexible_itinerary } = req.body
    let fLanguage 
    let activity_ = [] 
    let startTimes = []

    try {
        //PART1
        const upToMdTour = await ToMdTour.findByPk(tour_id, {
            attributes: ['tour_id', 'product_type', 'language_code', 'flexible_schedules', 'duration_type', 'time_duration']
        })
        if (upToMdTour) {
            upToMdTour.update({ product_type, language_code, flexible_schedules, duration_type, time_duration })
        }
        //PART 2
        //Cleaning tables
        const DeToItinerary = await ToItinerary.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })

        let iFlexibleItineraries = await Promise.all(flexible_itinerary.map(async (iFlexibleItineraries) => {
            let newFlexibleItineraries = await ToItinerary.create({
                tb_tt_to_md_tour_tour_id: tour_id, no_day: iFlexibleItineraries.no_day,
                enabled: iFlexibleItineraries.enabled, removed: iFlexibleItineraries.removed,
                start_times_flexible: iFlexibleItineraries.start_times_flexible 
            },
                { fields: ['tb_tt_to_md_tour_tour_id', 'no_day', 'enabled', 'removed', 'start_times_flexible'] })

            await Promise.all(iFlexibleItineraries.start_times_flexible.map( async (ee) =>{ startTimes.push(ee) }))

            await Promise.all(iFlexibleItineraries.activity.map(async (iActivities) => {
                let newActivity = await ToActivity.create({
                    tb_tt_to_it_itinerary_id: newFlexibleItineraries.itinerary_id,
                    language_code, description: iActivities.description, start_time: iActivities.start_time,
                    enabled: iActivities.enabled, removed: iActivities.removed  
                }, {fields: ['tb_tt_to_it_itinerary_id','language_code','description','start_time','enabled','removed']})

                let trAct
                if (language_code == "en") {
                    trAct = await translateArray(iActivities.description, language_code, 'en-es')
                    fLanguage = "es"
                } else if(language_code == "es"){ 
                    trAct = await translateArray(iActivities.description, language_code, 'es-en') 
                    fLanguage = "en" 
                }
                let newActivityTr = await ToTrActivity.create({ tb_tt_to_activity_activity_id: newActivity.activity_id, 
                    language_code: fLanguage, translation: trAct.translations[0].translation,enabled: iActivities.enabled, removed: iActivities.removed },
                    { fields: ['tb_tt_to_activity_activity_id', 'language_code','translation','enabled','removed'] })

                //  MONGO STRUCTURE
                activity_.push({
                    startTime: iActivities.start_time,
                    description: fLanguage == 'en' ? trAct.translations[0].translation:iActivities.description,
                    translations: [{
                        translation: fLanguage == 'en' ? iActivities.description:trAct.translations[0].translation,
                        languageCode: fLanguage == 'en' ? fLanguage:language_code
                    }]
                })
     
                return newActivity,newActivityTr
            }))
            return newFlexibleItineraries
        }))
        if (iFlexibleItineraries && upToMdTour) {
            let mgTour = await ToMdTour.findOne({ where: { tour_id }, attributes: ['tour_id','mg_tour_body'] })
            if (mgTour) {
                let addInfo = mgTour.toJSON().mg_tour_body
                addInfo.durationType = duration_type
                addInfo.timeDuration = time_duration
                addInfo.flexibleSchedules = flexible_schedules
                addInfo.startTimes = startTimes
                addInfo.itineraryTour = [{ activity: activity_ }]

                mgTour.update({ mg_tour_body: addInfo })

                res.json({ msg: "Información Agregada!" })
            }
        }
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}


export async function getInfoTourItinerary(req, res) {
    const { tour_id } = req.params
    const { language } = req.query
    try {
        let getToMdTour = await ToMdTour.findByPk(tour_id, {
            attributes: ['tour_id', 'flexible_schedules', 'duration_type', 'time_duration']
        })
        let getToItinerary = await ToItinerary.findAll({
            attributes: [['itinerary_id', '_id'], 'no_day', 'start_times_flexible'],
            where: { tb_tt_to_md_tour_tour_id: tour_id }, include: { model: ToActivity, as: 'tb_tt_to_activity', attributes: [['activity_id', '_id'], 'description','language_code','start_time'],
            include: {model: ToTrActivity,as: 'tb_tt_to_tr_activity', attributes: ['translation','language_code']} }
        })
        //--
        getToItinerary = getToItinerary.map(e => {
            e = e.toJSON()
                e.tb_tt_to_activity.map(eac =>{
                    if ((eac.language_code == language) || (!language)) {
                        delete eac.tb_tt_to_tr_activity
                    }else{
                        eac.description = eac.tb_tt_to_tr_activity[0].translation
                        eac.language_code = eac.tb_tt_to_tr_activity[0].language_code
                        delete eac.tb_tt_to_tr_activity
                    }
                    return eac
                })
            return e
        })
        //--
        getToMdTour = getToMdTour.toJSON()
        getToMdTour.tb_tt_to_itinerary = getToItinerary 
        res.json(getToMdTour)

    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}