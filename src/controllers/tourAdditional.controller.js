import { matchObjects } from '../controllers/general/otherFunctions.controller'
const Md_tour = require("../../models").tb_tt_to_md_tour
const Tour_category = require("../../models").tb_tt_to_as_tour_category
const Tour_difficult = require("../../models").tb_tt_to_as_tour_cm_difficult
const Tour_suit_to = require("../../models").tb_tt_to_as_tour_cm_suit_to
const Tour_language = require("../../models").tb_tt_to_as_tour_language
const Gcm_category = require("../../models").tb_gcm_category
const Gcm_language = require("../../models").tb_gcm_language
const Gcm_Complement = require("../../models").tb_gcm_complement
const Gcm_Tr_Complement = require("../../models").tb_gcm_tr_complement

export async function addInfoTour(req, res) {
    const { tour_id } = req.params
    const { capacity, before_booking,tb_gcm_cm_complement_id_difficult,tb_gcm_cm_complement_id_suit_to, tb_gcm_category_category_id,tb_gcm_language_language_id,enabled, removed } = req.body
    try {
        //CAPACITY & BOOKING
        const upTour = await Md_tour.findOne({ where: { tour_id }, attributes: ['tour_id', 'capacity', 'before_booking'] })
        if (upTour) { upTour.update({ capacity, before_booking }) }
        
        //Cleaning tables
        const tourDifficultD = await Tour_difficult.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })
        const tourSuitToD = await Tour_suit_to.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })
        const tourCategoryD = await Tour_category.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })
        const tourLanguageD = await Tour_language.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })
        //Creating
        let newDifficult = await Tour_difficult.create({ tb_tt_to_md_tour_tour_id: tour_id, tb_gcm_cm_complement_id: tb_gcm_cm_complement_id_difficult, enabled, removed },
            { fields: ['tb_tt_to_md_tour_tour_id', 'tb_gcm_cm_complement_id', 'enabled', 'removed'] })
        let newSuitTo = await Tour_suit_to.create({ tb_tt_to_md_tour_tour_id: tour_id, tb_gcm_cm_complement_id: tb_gcm_cm_complement_id_suit_to, enabled, removed },
            { fields: ['tb_tt_to_md_tour_tour_id', 'tb_gcm_cm_complement_id', 'enabled', 'removed'] })
        let newCategory = await Tour_category.create({ tb_tt_to_md_tour_tour_id: tour_id, tb_gcm_category_category_id, enabled, removed },
            { fields: ['tb_tt_to_md_tour_tour_id', 'tb_gcm_category_category_id', 'enabled', 'removed'] })
        let languages = await Promise.all(tb_gcm_language_language_id.map(async (languages) => {
            let newLanguage = await Tour_language.create({ tb_tt_to_md_tour_tour_id: tour_id, tb_gcm_language_language_id: languages, enabled, removed },
                { fields: ['tb_tt_to_md_tour_tour_id', 'tb_gcm_language_language_id', 'enabled', 'removed'] })
            return newLanguage
        }))    

        if (newDifficult && newSuitTo && newCategory && languages) { res.json({msg: "Informacion Agregada al Tour" }) }

    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}

export async function getIngfoTour(req, res) {
    const { tour_id } = req.params
    const { language } = req.query
    try {
        let allAdditional = await Md_tour.findByPk(tour_id, {
            attributes: ['tour_id','capacity','before_booking']
            ,
            include: [
                {model: Tour_category, as: 'tb_tt_to_as_tour_category', attributes: [['tb_gcm_category_category_id','_id']] },
                {model: Tour_language, as: 'tb_tt_to_as_tour_language', attributes: [['tb_gcm_language_language_id','_id']]}
            ]
        })
        //---
        let suit_to = await Tour_suit_to.findAll({ where: {tb_tt_to_md_tour_tour_id: tour_id},
            attributes: [['tb_gcm_cm_complement_id','_id']], include: { model: Gcm_Complement, as: 'tb_gcm_complement', attributes: ['name','language_code'], 
                include: {model: Gcm_Tr_Complement,as: 'tb_gcm_tr_complement', attributes: ['translation', 'language_code']}} })
        let to_difficult = await Tour_difficult.findAll({ where: {tb_tt_to_md_tour_tour_id: tour_id},
            attributes: [['tb_gcm_cm_complement_id','_id']], include: { model: Gcm_Complement, as: 'tb_gcm_complement', attributes: ['name', 'language_code'], 
                include: {model: Gcm_Tr_Complement,as: 'tb_gcm_tr_complement', attributes: ['translation','language_code']}} })
        //Get all languages from gcm_languages
        let AllLanguages = await Gcm_language.findAll({ attributes: [['language_id','_id'],'language','code'] })

        AllLanguages = AllLanguages.map(languages =>{
            languages = languages.toJSON()
            languages.assigned = false
            return languages 
        })
        //--
            if ((language == "es") || (!language)) {
                suit_to = suit_to.map(e => {
                    e = e.toJSON()
                    delete e.tb_gcm_complement.tb_gcm_tr_complement
                    return e
                })
                to_difficult = to_difficult.map(e => {
                    e = e.toJSON()
                    delete e.tb_gcm_complement.tb_gcm_tr_complement
                    return e
                })
            } else if(language == "en")
            {
                to_difficult = to_difficult.map(e => {
                    e = e.toJSON()
                    e.name = e.tb_gcm_complement.tb_gcm_tr_complement.translation
                    e.language_code = e.tb_gcm_complement.tb_gcm_tr_complement.language_code
                    delete e.tb_gcm_complement.tb_gcm_tr_complement
                    delete e.tb_gcm_complement
                    return e
                })
                suit_to = suit_to.map(e => {
                    e = e.toJSON()
                    e.name = e.tb_gcm_complement.tb_gcm_tr_complement.translation
                    e.language_code = e.tb_gcm_complement.tb_gcm_tr_complement.language_code
                    delete e.tb_gcm_complement.tb_gcm_tr_complement
                    delete e.tb_gcm_complement
                    return e
                })
            }
        //--
        allAdditional = allAdditional.toJSON()
        allAdditional.tb_tt_to_as_tour_cm_suit_to = suit_to
        allAdditional.tb_tt_to_as_tour_cm_difficult = to_difficult
        allAdditional.tb_tt_to_as_tour_language = matchObjects(AllLanguages,allAdditional.tb_tt_to_as_tour_language)
        
        res.json(allAdditional)
    } catch (error) {
        res.json({
            msg: error
        })
    }
}

export async function getCategories(req, res){
    try {
        const categories = await Gcm_category.findAll({
            attributes: ['category_id','category']
        })    
        if (categories) {
            res.json({
                categories
            })
        }
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}

export async function getLanguages(req, res){
    try {
        const languages = await Gcm_language.findAll({
            attributes: ['language_id','language']
        })
        if (languages) {
            res.json({
                languages
            })
        }
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}