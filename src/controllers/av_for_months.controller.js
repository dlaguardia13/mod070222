const Md_tour = require("../../models").tb_tt_to_md_tour
const AvForMonths = require("../../models").tb_tt_to_av_for_months
const DaysAvPerMonth = require('../../models').tb_tt_to_days_av_per_month

export async function addInfoTourAvailability(req, res) {
    const { tour_id } = req.params
    const { available_all_year, months } = req.body 
    let availability_ = []
    try {
        //PART 1
        const upTour = await Md_tour.findOne({ where: { tour_id }, attributes: ['tour_id', 'available_all_year'] })
        if (upTour) { upTour.update({ available_all_year }) }
        //PART 2
        //Cleaning tables
        const DeAvForMonths = await AvForMonths.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })
        //Creating AV_FOR_MONTHS
        let Imonths = await Promise.all(months.map(async (Imonths) => {
            let newMonths = await AvForMonths.create({
                tb_tt_to_md_tour_tour_id: tour_id,
                initial_month: Imonths.initial_month, final_month: Imonths.final_month,
                enabled: Imonths.enabled, removed: Imonths.removed
            }, { fields: ['tb_tt_to_md_tour_tour_id', 'initial_month', 'final_month', 'enabled', 'removed'] })

            await Promise.all(Imonths.day.map(async (Idays) => {
                let newDays = await DaysAvPerMonth.create({ tb_tt_to_av_mo_av_months_id: newMonths.av_for_months_id, day: Idays },
                    { fields: ['tb_tt_to_av_mo_av_months_id', 'day'] })
                return newDays
            }))
            availability_.push({
                mountInitial: Imonths.initial_month,
                mountFinal: Imonths.final_month,
                days: Imonths.day,
                schedule: []   
            })
            return Imonths
        }))

        if (Imonths && upTour) {
            let mgTour = await Md_tour.findOne({ where: { tour_id }, attributes: ['tour_id','mg_tour_body'] })
            if (mgTour) {
                let addInfo = mgTour.toJSON().mg_tour_body
                addInfo.availableAllYear = available_all_year
                addInfo.availability = availability_
                mgTour.update({ mg_tour_body: addInfo })

                res.json({ msg: "Información agregada con exito" })
            }
        }
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}

export async function getInfoTourAvailability(req, res) {
    const { tour_id } = req.params
    try {
        let infoTourAvailability = await Md_tour.findByPk(tour_id, { attributes: ['tour_id', 'available_all_year'] })
        let extraInfo = await AvForMonths.findAll({
            attributes: [['av_for_months_id', '_id'], 'initial_month', 'final_month'],
            where: { tb_tt_to_md_tour_tour_id: tour_id }, include: { model: DaysAvPerMonth, as: 'tb_tt_to_days_av_per_month', attributes: [['days_av_per_month_id', '_id'], 'day'] }
        })

        infoTourAvailability = infoTourAvailability.toJSON()
        infoTourAvailability.tb_tt_to_av_for_months = extraInfo
        res.json(infoTourAvailability)
        
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}