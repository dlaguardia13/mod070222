import { matchObjects } from '../controllers/general/otherFunctions.controller'
const YouWillSee = require('../../models').tb_tt_to_you_will_see
const CmWhat = require('../../models').tb_tt_to_as_tour_cm_whant
const Md_tour = require("../../models").tb_tt_to_md_tour 
const GcmComplement = require("../../models").tb_gcm_complement
const Gcm_Tr_Complement = require("../../models").tb_gcm_tr_complement 
const TrYouWillSee = require("../../models").tb_tt_to_tr_you_will_see

export async function addInfoTour(req, res){
    const { tour_id } = req.params
    const { tb_gcm_complement_complement_id, you_will_see, additional_information, language_code, enabled, removed} = req.body
    try {
        //--PART 1
        const tourwhattD = await CmWhat.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })
        let whats = await Promise.all(tb_gcm_complement_complement_id.map(async (whats) => {
            let newWhat = await CmWhat.create({ tb_tt_to_md_tour_tour_id: tour_id, tb_gcm_complement_complement_id: whats, enabled, removed },
                { fields: ['tb_tt_to_md_tour_tour_id', 'tb_gcm_complement_complement_id', 'enabled', 'removed'] })
            return newWhat
        })) 
        //--PART 2 and 3: Additional_info: 2 will_see: 1
        const tourwillSeeD = await YouWillSee.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })
        let additionalInfo = await Promise.all(additional_information.map(async (additionalInfo) => {
            let newInfo = await YouWillSee.create({ tb_tt_to_md_tour_tour_id: tour_id, you_will_see: additionalInfo, enabled, removed, language_code, info_type: 2 },
                { fields: ['tb_tt_to_md_tour_tour_id', 'you_will_see', 'enabled', 'removed', 'language_code', 'info_type'] })
            return newInfo
        }))
        let willSee = await Promise.all(you_will_see.map(async (willSee) => {
            let newWilSee = await YouWillSee.create({ tb_tt_to_md_tour_tour_id: tour_id, you_will_see: willSee, enabled, removed, language_code, info_type: 1 },
                { fields: ['tb_tt_to_md_tour_tour_id', 'you_will_see', 'enabled', 'removed', 'language_code', 'info_type'] })
            return newWilSee
        }))
        if (whats && additionalInfo && willSee) {
            res.json({
                msg: "Informacion agregada"
            })
        }
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
} 

export async function getInfoTour(req, res){
    const { tour_id } = req.params
    const { language } = req.query
    try {
        let allWhatWillSee = await Md_tour.findByPk(tour_id, { attributes: ['tour_id'] })
        //--
        let cm_what = await CmWhat.findAll({
            where: { tb_tt_to_md_tour_tour_id: tour_id }, attributes: [['tb_gcm_complement_complement_id','_id']],
            include: {model: GcmComplement, as: 'tb_gcm_complement', attributes: ['name','language_code'], 
            include: {model: Gcm_Tr_Complement,as: 'tb_gcm_tr_complement',attributes: ['translation','language_code']}}
        })
        let you_will = await YouWillSee.findAll({
            where: { tb_tt_to_md_tour_tour_id: tour_id }, attributes: [['you_will_see_id','_id'],'you_will_see'],
            include: {model: TrYouWillSee, as: 'tb_tt_to_tr_you_will_see', attributes: ['translation','language_code']}
        })
        //--
        if ((language == "es") || (!language)) {
            cm_what = cm_what.map(e => {
                e = e.toJSON()
                e.name = e.tb_gcm_complement.name
                e.language_code = e.tb_gcm_complement.language_code
                delete e.tb_gcm_complement.tb_gcm_tr_complement
                delete e.tb_gcm_complement
                return e
            })
            you_will = you_will.map(e => {
                e = e.toJSON()
                delete e.tb_tt_to_tr_you_will_see
                return e
            })
        } else if(language == "en")
        {
            cm_what = cm_what.map(e => {
                e = e.toJSON()
                e.name = e.tb_gcm_complement.tb_gcm_tr_complement.translation
                e.language_code = e.tb_gcm_complement.tb_gcm_tr_complement.language_code
                delete e.tb_gcm_complement.tb_gcm_tr_complement
                delete e.tb_gcm_complement
                return e
            })
            you_will = you_will.map(e => {
                e = e.toJSON()
                e.you_will_see = e.tb_tt_to_tr_you_will_see.translation
                e.language_code = e.tb_tt_to_tr_you_will_see.language_code
                delete e.tb_tt_to_tr_you_will_see
                return e
            })
        }
        //Get all languages from gcm_languages
        let AllCm = await GcmComplement.findAll({ where: { complement_type: 8 },attributes: [['complement_id','_id'],'name','complement_type'] })

        AllCm = AllCm.map(complementT8 =>{
            complementT8 = complementT8.toJSON()
            complementT8.assigned = false
            return complementT8 
        })

        allWhatWillSee = allWhatWillSee.toJSON()
        allWhatWillSee.tb_tt_to_as_tour_cm_whant = cm_what
        allWhatWillSee.tb_tt_to_you_will_see = you_will
        allWhatWillSee.tb_tt_to_as_tour_cm_whant = matchObjects(allWhatWillSee.tb_tt_to_as_tour_cm_whant,AllCm)

        if (allWhatWillSee) { res.json(allWhatWillSee) }else{ res.json({msg: "Error: no existe ese registro" }) }
    } catch (error) {
        res.json({ msg: error.msg })
    }
}