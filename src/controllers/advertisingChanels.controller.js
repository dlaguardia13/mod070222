import { matchObjects } from './general/otherFunctions.controller'
const ToMdTour = require('../../models').tb_tt_to_md_tour
const ToCmSn = require('../../models').tb_tt_to_as_tour_cm_sn //13
const ToCmSc = require('../../models').tb_tt_to_as_tour_cm_sc //14
const GcmComplement = require('../../models').tb_gcm_complement 

export async function addInfoTourAdvertisingC(req, res){
    const { tour_id } = req.params
    const { complement_sn, complement_sc } = req.body
    try {
        let opToCmSn = await ToCmSn.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })
        let opToCmSc = await ToCmSc.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })

        let Isn = await Promise.all(complement_sn.map(async (sn) => {
            opToCmSn = await ToCmSn.create({ tb_tt_to_md_tour_tour_id: tour_id, tb_gcm_cm_complement_id: sn },
                { fields: ['tb_tt_to_md_tour_tour_id', 'tb_gcm_cm_complement_id'] })
            return opToCmSn
        }))

        let Isc = await Promise.all(complement_sc.map(async (sc) => {
            opToCmSc = await ToCmSc.create({ tb_tt_to_md_tour_tour_id: tour_id, tb_gcm_cm_complement_id: sc },
                { fields: ['tb_tt_to_md_tour_tour_id', 'tb_gcm_cm_complement_id'] })
            return opToCmSc
        }))

        if (opToCmSn && opToCmSc) { res.json({ msg: 'Informacion agregada con exito' }) }
    } catch (error) {
        res.json({ msg: error.message })
    }
}

export async function getInfoTourAdvertisingC(req, res){
    const { tour_id } = req. params
    try {
        let allAdCh = await ToMdTour.findByPk(tour_id, {
            attributes: ['tour_id'],
            include: [{ model: ToCmSn, as: 'tb_tt_to_as_tour_cm_sn', attributes: [['tb_gcm_cm_complement_id', '_id']] },
            { model: ToCmSc , as: 'tb_tt_to_as_tour_cm_sc', attributes: [['tb_gcm_cm_complement_id','_id']]}]
        })
        
        let snItems = await GcmComplement.findAll({ where: { complement_type: 13 }, attributes: [['complement_id', '_id'],'name','language_code', 'complement_type'] })
        let scItems = await GcmComplement.findAll({ where: { complement_type: 14 }, attributes: [['complement_id', '_id'],'name','language_code', 'complement_type'] })

        snItems = snItems.map(complementType13 => {
            complementType13 = complementType13.toJSON()
            complementType13.assigned = false
            return complementType13
        })
        scItems = scItems.map(complementType14 => {
            complementType14 = complementType14.toJSON()
            complementType14.assigned = false
            return complementType14
        })

        allAdCh = allAdCh.toJSON()
        allAdCh.tb_tt_to_as_tour_cm_sn = matchObjects(snItems, allAdCh.tb_tt_to_as_tour_cm_sn)
        allAdCh.tb_tt_to_as_tour_cm_sc = matchObjects(scItems, allAdCh.tb_tt_to_as_tour_cm_sc)

        if (allAdCh) {res.json(allAdCh)} 
        else {res.json({ msg: "Error: no existe ese registro" })}

    } catch (error) {
        res.json({msg: error.message})
    }
}