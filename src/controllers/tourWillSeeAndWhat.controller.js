import { matchObjects } from '../controllers/general/otherFunctions.controller'
import { translateArray } from "../controllers/general/translator.controller"
const YouWillSee = require('../../models').tb_tt_to_you_will_see
const CmWhat = require('../../models').tb_tt_to_as_tour_cm_whant
const Md_tour = require("../../models").tb_tt_to_md_tour 
const GcmComplement = require("../../models").tb_gcm_complement
const Gcm_Tr_Complement = require("../../models").tb_gcm_tr_complement 
const TrYouWillSee = require("../../models").tb_tt_to_tr_you_will_see

export async function addInfoTour(req, res){
    const { tour_id } = req.params
    let { tb_gcm_complement_complement_id, you_will_see, additional_information, language_code, enabled, removed, mg_body} = req.body
    let tr_1
    let tr_2
    let fLanguage = language_code

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

        let additionalInfo = await Promise.all(additional_information.map(async (e) => {
            let newInfo = await YouWillSee.create({ tb_tt_to_md_tour_tour_id: tour_id, you_will_see: e, enabled, removed, language_code, info_type: 2 },
                { fields: ['tb_tt_to_md_tour_tour_id', 'you_will_see', 'enabled', 'removed', 'language_code', 'info_type'] })
                
                if (language_code == "en") {
                    tr_2 = await translateArray(e, language_code, 'en-es')
                    fLanguage = "es"
                } else if(language_code == "es"){ 
                    tr_2 = await translateArray(e, language_code, 'es-en') 
                    fLanguage = "en" 
                }
                let newInfoTr = await TrYouWillSee.create({ tb_tt_to_you_will_see_you_will_see_id: newInfo.you_will_see_id, 
                    language_code: fLanguage, translation: tr_2.translations[0].translation, enabled, removed },
                    { fields: ['tb_tt_to_you_will_see_you_will_see_id', 'language_code','translation', 'enabled', 'removed'] })

            return newInfo,newInfoTr
        }))
        let willSee = await Promise.all(you_will_see.map(async (e) => {
            let newWilSee = await YouWillSee.create({ tb_tt_to_md_tour_tour_id: tour_id, you_will_see: e, enabled, removed, language_code, info_type: 1 },
                { fields: ['tb_tt_to_md_tour_tour_id', 'you_will_see', 'enabled', 'removed', 'language_code', 'info_type'] })

                if (language_code == "en") {
                    tr_1 = await translateArray(e, language_code, 'en-es')
                    fLanguage = "es"
                } else if(language_code == "es"){ 
                    tr_1 = await translateArray(e, language_code, 'es-en') 
                    fLanguage = "en" 
                }
                let newWilSeeTr = await TrYouWillSee.create({ tb_tt_to_you_will_see_you_will_see_id: newWilSee.you_will_see_id, 
                    language_code: fLanguage, translation: tr_1.translations[0].translation, enabled, removed },
                    { fields: ['tb_tt_to_you_will_see_you_will_see_id', 'language_code','translation', 'enabled', 'removed'] })

            return newWilSee, newWilSeeTr
        }))
        if (whats && additionalInfo && willSee) {
            //mg_tour_body
            let mgTour = await Md_tour.findOne({ where: { tour_id }, attributes: ['tour_id','mg_tour_body']})
                if (mgTour) {
                    let addInfo = mgTour.toJSON().mg_tour_body
                    addInfo.whatToBring = mg_body.whatToBring
                    addInfo.additionalInformation = mg_body.additionalInformation
                    addInfo.nYouWillSee = mg_body.nYouWillSee
                    mgTour.update({ mg_tour_body: addInfo })

                    res.json({ msg: "Informacion agregada" })
                }  
        }
        
    } catch (error) { res.json({ msg: error.message }) }
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

        let you_will_1 = await YouWillSee.findAll({ //Will See
            where: { tb_tt_to_md_tour_tour_id: tour_id, info_type: 1}, attributes: [['you_will_see_id','_id'],'you_will_see','language_code','info_type'],
            include: {model: TrYouWillSee, as: 'tb_tt_to_tr_you_will_see', attributes: ['translation','language_code']}
        })
        let you_will_2 = await YouWillSee.findAll({ //additional Info
            where: { tb_tt_to_md_tour_tour_id: tour_id, info_type: 2 }, attributes: [['you_will_see_id','_id'],'you_will_see','language_code','info_type'],
            include: {model: TrYouWillSee, as: 'tb_tt_to_tr_you_will_see', attributes: ['translation','language_code']}
        })
    
        cm_what = cm_what.map(e => {
            e = e.toJSON()
            if ((e.tb_gcm_complement.language_code == language) || (!language)) {
                e.name = e.tb_gcm_complement.name
                e.language_code = e.tb_gcm_complement.language_code
                delete e.tb_gcm_complement.tb_gcm_tr_complement
                delete e.tb_gcm_complement   
            }else{
                e.name = e.tb_gcm_complement.tb_gcm_tr_complement.translation
                e.language_code = e.tb_gcm_complement.tb_gcm_tr_complement.language_code
                delete e.tb_gcm_complement.tb_gcm_tr_complement
                delete e.tb_gcm_complement
            }
        return e
        })
        you_will_1 = you_will_1.map(e => {
            e = e.toJSON()
            if (e.language_code == language) {
                delete e.tb_tt_to_tr_you_will_see    
            }else{
                e.you_will_see = e.tb_tt_to_tr_you_will_see[0].translation
                e.language_code = e.tb_tt_to_tr_you_will_see[0].language_code
                e.info_type = e.info_type
                delete e.tb_tt_to_tr_you_will_see
            }
        return e
        })

        you_will_2 = you_will_2.map(e => {
            e = e.toJSON()
            if (e.language_code == language) {
                delete e.tb_tt_to_tr_you_will_see    
            }else{
                e.you_will_see = e.tb_tt_to_tr_you_will_see[0].translation
                e.language_code = e.tb_tt_to_tr_you_will_see[0].language_code
                e.info_type = e.info_type
                delete e.tb_tt_to_tr_you_will_see
            }
        return e
        })
        //Get all languages from gcm_languages
        let AllCm = await GcmComplement.findAll({ where: { complement_type: 8 },attributes: [['complement_id','_id'],'name','complement_type'] })

        AllCm = AllCm.map(complementT8 =>{
            complementT8 = complementT8.toJSON()
            complementT8.assigned = false
            return complementT8 
        })

        allWhatWillSee = allWhatWillSee.toJSON()
        allWhatWillSee.tb_tt_to_as_tour_cm_whant = cm_what
        allWhatWillSee.you_will_see = you_will_1
        allWhatWillSee.additional_info = you_will_2
        allWhatWillSee.tb_tt_to_as_tour_cm_whant = matchObjects(allWhatWillSee.tb_tt_to_as_tour_cm_whant,AllCm)

        if (allWhatWillSee) { res.json(allWhatWillSee) }else{ res.json({msg: "Error: no existe ese registro" }) }
    } catch (error) {
        res.json({ msg: error.msg }) }
}