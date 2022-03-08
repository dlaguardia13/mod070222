import { translateArray } from "../controllers/general/translator.controller"
const ToMdTour = require('../../models').tb_tt_to_md_tour
const ToCustomTerm = require('../../models').tb_tt_to_custom_term
const ToTrCustomTerm = require('../../models').tb_tt_to_tr_custom_term

export async function addInfoTourCustomT(req, res){
    const { tour_id } = req.params
    let { custom_term } = req.body
    let fLanguage
    let customTerms_ = []
    
    try {
        await ToCustomTerm.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })

        let Ict = await Promise.all(custom_term.map(async (ct) => {
            let opToCustomTerm = await ToCustomTerm.create({
                tb_tt_to_md_tour_tour_id: tour_id, custom_term: ct.custom_term, language_code: ct.language_code, product_type: ct.product_type
            },
                { fields: ['tb_tt_to_md_tour_tour_id', 'custom_term', 'language_code', 'product_type'] })
                let ctTr
                if (ct.language_code == "en") {
                    ctTr = await translateArray(ct.custom_term, ct.language_code, 'en-es')
                    fLanguage = "es"
                } else if(ct.language_code == "es"){ 
                    ctTr = await translateArray(ct.custom_term, ct.language_code, 'es-en') 
                    fLanguage = "en" 
                }
                let opToCustomTermTr = await ToTrCustomTerm.create({ tb_tt_ct_custom_term_id: opToCustomTerm.custom_term_id, 
                    language_code: fLanguage, translation: ctTr.translations[0].translation },
                    { fields: ['tb_tt_ct_custom_term_id', 'language_code','translation'] })
                
                    customTerms_.push({
                        original: fLanguage == 'en' ? ctTr.translations[0].translation:ct.custom_term,
                        translations: {
                            translation: fLanguage == 'en' ? ct.custom_term:ctTr.translations[0].translation,
                            languageCode: fLanguage == 'en' ? ct.language_code:fLanguage 
                        }
                    })    

            return opToCustomTerm, opToCustomTermTr
        }))
        if (Ict) { 
            //  MONGO'S QUERIES
            let mgTour = await ToMdTour.findOne({ where: { tour_id }, attributes: ['tour_id','mg_tour_body'] })
            if (mgTour) {
                let addInfo = mgTour.toJSON().mg_tour_body
                addInfo.customTerms = customTerms_
                mgTour.update({ mg_tour_body: addInfo })
                
                res.json({ msg: "Información Agregada!" })
            }}
    } catch (error) {
        res.json({ msg: error.message })
        res.status(500)
    }
}

export async function getInfoTourCustomT(req, res){
    const { tour_id } = req.params
    const { language } = req.query
    try {
        let allCT = await ToMdTour.findOne({
            where: { tour_id },
            attributes: ['tour_id']
            ,include: { model: ToCustomTerm, as: 'tb_tt_to_custom_term', attributes: [['custom_term_id', '_id'], 'custom_term', 'language_code','product_type'],
            include: {model:ToTrCustomTerm, as: 'tb_tt_to_tr_custom_term', attributes: ['translation','language_code']} }
        })
            allCT = allCT.toJSON()
            allCT.tb_tt_to_custom_term.map(ee => {
                if ((ee.language_code == language) || (!language)) {
                    delete ee.tb_tt_to_tr_custom_term    
                }else{
                    ee.custom_term = ee.tb_tt_to_tr_custom_term[0].translation
                    ee.language_code = ee.tb_tt_to_tr_custom_term[0].language_code
                    ee.product_type = ee.product_type
                    delete ee.tb_tt_to_tr_custom_term
                }
                return ee
            })
        if (allCT) { res.json(allCT)}

    } catch (error) {
        res.json({ msg: error.message })
    }
}