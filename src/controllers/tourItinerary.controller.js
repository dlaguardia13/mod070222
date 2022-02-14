const ToMdTour = require('../../models').tb_tt_to_md_tour
const ToItinerary = require('../../models').tb_tt_to_itinerary
const ToActivity = require('../../models').tb_tt_to_activity

export async function addInfoTourItinerary(req, res) {
    const { tour_id } = req.params
    const { product_type, language_code, flexible_schedules, duration_type, time_duration,
        flexible_itinerary } = req.body

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

            /*let iiFlexibleItineraries = await Promise.all(iFlexibleItineraries.start_times_flexible.map( async (iiFlexibleItineraries) => {
                let newFlexibleItineraries = await ToItinerary.create({
                    tb_tt_to_md_tour_tour_id: tour_id, no_day: iFlexibleItineraries.no_day,
                    enabled: iFlexibleItineraries.enabled, removed: iFlexibleItineraries.removed,
                    start_times_flexible: iiFlexibleItineraries 
                },
                    { fields: ['tb_tt_to_md_tour_tour_id', 'no_day', 'enabled', 'removed', 'start_times_flexible'] })

                    let iActivities = await Promise.all(iFlexibleItineraries.activity.map(async (iActivities) => {
                        let newActivity = await ToActivity.create({
                            tb_tt_to_it_itinerary_id: newFlexibleItineraries.itinerary_id,
                            language_code, description: iActivities.description, start_time: iActivities.start_time,
                            enabled: iActivities.enabled, removed: iActivities.removed  
                        }, {fields: ['tb_tt_to_it_itinerary_id','language_code','description','start_time','enabled','removed']})
                        return newActivity
                    }))

                    return newFlexibleItineraries
            }))*/
            let newFlexibleItineraries = await ToItinerary.create({
                tb_tt_to_md_tour_tour_id: tour_id, no_day: iFlexibleItineraries.no_day,
                enabled: iFlexibleItineraries.enabled, removed: iFlexibleItineraries.removed,
                start_times_flexible: iFlexibleItineraries.start_times_flexible 
            },
                { fields: ['tb_tt_to_md_tour_tour_id', 'no_day', 'enabled', 'removed', 'start_times_flexible'] })

            let iActivities = await Promise.all(iFlexibleItineraries.activity.map(async (iActivities) => {
                let newActivity = await ToActivity.create({
                    tb_tt_to_it_itinerary_id: newFlexibleItineraries.itinerary_id,
                    language_code, description: iActivities.description, start_time: iActivities.start_time,
                    enabled: iActivities.enabled, removed: iActivities.removed  
                }, {fields: ['tb_tt_to_it_itinerary_id','language_code','description','start_time','enabled','removed']})
                return newActivity
            }))
            return newFlexibleItineraries
        }))
        if (iFlexibleItineraries && upToMdTour) {
            res.json({
                msg: "REGISTRO INGRESADO CON EXITO!"
            })
        }
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}


export async function getInfoTourItinerary(req, res) {
    const { tour_id } = req.params
    try {
        let getToMdTour = await ToMdTour.findByPk(tour_id, {
            attributes: ['tour_id', 'flexible_schedules', 'duration_type', 'time_duration']
        })
        let getToItinerary = await ToItinerary.findAll({
            attributes: [['itinerary_id', '_id'], 'no_day', 'start_times_flexible'],
            where: { tb_tt_to_md_tour_tour_id: tour_id }, include: { model: ToActivity, as: 'tb_tt_to_activity', attributes: [['activity_id', '_id'], 'description','start_time'] }
        })

        res.json({
            getToMdTour,
            tb_tt_to_activity: getToItinerary
        })
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}