import { matchObjects } from './general/otherFunctions.controller'
const ToMdTour = require('../../models').tb_tt_to_md_tour
const GcmCancellationP = require('../../models').tb_gcm_cancellation_policy
const AsCpTo = require('../../models').tb_tt_to_as_cp_to

export async function addInfoTourCancellationP(req, res) {
    const { tour_id } = req.params
    const { changes_in_reservation, cancellation_policy } = req.body
    try {
        //MD TOUR
        let upToMdTour = await ToMdTour.findByPk(tour_id, { attributes: ['tour_id', 'changes_in_reservation'] })
        if (upToMdTour) { upToMdTour.update({ changes_in_reservation }) }

        let opAsCpTo = await AsCpTo.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })
        //PART 2
        let Icp = await Promise.all(cancellation_policy.map(async (cp) => {
            opAsCpTo = await AsCpTo.create({
                tb_tt_to_md_tour_tour_id: tour_id, tb_gcm_cancellation_policy_id: cp._id, custom_percent: cp.custom_percent, custom_no_days: cp.custom_no_days
            },
                { fields: ['tb_tt_to_md_tour_tour_id', 'tb_gcm_cancellation_policy_id', 'custom_percent', 'custom_no_days'] })
            return opAsCpTo
        }))
        if (opAsCpTo) { res.json({ msg: 'Informacion agregada con exito' }) }

    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}

export async function getInfoTourCancellationP(req, res) {
    const { tour_id } = req.params
    try {
        let allCP = await ToMdTour.findByPk(tour_id, {
            attributes: ['changes_in_reservation'],
            include: { model: AsCpTo, as: 'tb_tt_to_as_cp_to', attributes: [['tb_gcm_cancellation_policy_id', '_id'], 'custom_no_days', 'custom_percent'] }
        })
        //Get all ip's items from gcm_ip
        let cpItems = await GcmCancellationP.findAll({ where: { product_type: 11 }, attributes: [['cancellation_policy_id', '_id'],'title','description', 'more_info','language_code','percent_discount','product_type'] })

        cpItems = cpItems.map(productType11 => {
            productType11 = productType11.toJSON()
            productType11.assigned = false
            return productType11
        })

        allCP = allCP.toJSON()
        allCP.tb_tt_to_as_cp_to = matchObjects(cpItems, allCP.tb_tt_to_as_cp_to)

        if (allCP) {
            res.json(allCP)
        } else {
            res.json({
                msg: "Error: no existe ese registro"
            })
        }
    } catch (error) {
        res.json({
            msg: error
        })
    }
} 