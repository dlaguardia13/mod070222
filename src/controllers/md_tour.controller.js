import { translateArray } from "../controllers/general/translator.controller" 
const { Op } = require("sequelize");
const Md_tour = require("../../models").tb_tt_to_md_tour
const AddressesTour = require('../../models').tb_tt_to_address_tour
const GcmState = require('../../models').tb_gcm_state
const GcmCity = require('../../models').tb_gcm_city
const MdTrTour = require('../../models').tb_tt_to_tr_tour

export async function createTour(req, res) {
    let { tb_bp_md_business_profile_id, tb_gcm_status_status_id,name, title, description,
          capacity,flexible_schedules,language_code,enabled,removed } = req.body
    let tr
    let fLanguage
    try {
            if (language_code == "en") {
                tr = await translateArray([name, title, description], language_code, 'en-es')
                fLanguage = "es"
            } else if(language_code == "es"){ 
                tr = await translateArray([name, title, description], language_code, 'es-en')
                fLanguage = "en" 
            }
        //--
        let mgBody = {name: name, nTitle: {original: title, translation: [{languageCode: fLanguage, translation: tr.translations[1].translation}]}, 
            nDescription: {original: description, translation: [{languageCode: fLanguage, translation: tr.translations[2].translation}]} }
            //console.log(mgBody)
        //--    
        let newTour = await Md_tour.create({
            tb_bp_md_business_profile_id, 
            tb_gcm_status_status_id,
            name, 
            title, 
            description,
            capacity,
            flexible_schedules,
            language_code,
            enabled,
            removed,
            mg_tour_body: mgBody
        },{
            fields: [ 'tb_bp_md_business_profile_id', 'tb_gcm_status_status_id','slug','name', 'title', 'description',
            'capacity', 'flexible_schedules','language_code', 'enabled', 'removed','mg_tour_body'] 
        })
            let newTrTour = await MdTrTour.create({
                tb_tt_to_md_tour_tour_id: newTour.tour_id,
                language_code: fLanguage,
                title: tr.translations[1].translation,
                description: tr.translations[2].translation,
                enabled,
                removed
            }, { fields: ['tb_tt_to_md_tour_tour_id', 'language_code', 'title', 'description' , 'enabled', 'removed'] 
        })
            if (newTour && newTrTour) { res.json({msg: 'Hecho!'}) }

    } catch (error) { res.json({ msg: error.message }) }
}

export async function getAllTours(req, res) {
    let { search, offset, limit } = req.query
    let { language } = req.query
    try {
        if(!search){search = "%"}
        if(!offset && !limit){offset = 0,limit = 10}

        let AllTours = await Md_tour.findAndCountAll({
            where: { name: { [Op.like]: `${search}` } },
            attributes: ['tour_id','name','title','description','language_code'],
            include: [ {model: AddressesTour, as: 'tb_tt_to_address_tour', attributes: ['real_address'], include: [
                {model: GcmState ,as: 'tb_gcm_state', attributes: ['state']},
                {model: GcmCity ,as: 'tb_gcm_city', attributes: ['city']}
            ]}, {model: MdTrTour,as: 'tb_tt_to_tr_tour', attributes:['title','description','language_code']}],
            limit: limit,
            offset: offset
        })
        //--
        AllTours.rows = AllTours.rows.map(e => {
                e = e.toJSON()
                if((e.language_code == language) || (!language)){
                    delete e.tb_tt_to_tr_tour
                }else{
                    e.title = e.tb_tt_to_tr_tour.title
                    e.description = e.tb_tt_to_tr_tour.description
                    e.language_code = e.tb_tt_to_tr_tour.language_code
                    delete e.tb_tt_to_tr_tour
                }
                return e
        })
        //--
        if (AllTours) { res.json(AllTours) } 
    } catch (error) { res.json({ msg: error.message }) }
}

export async function getOneTour(req, res) {
    const { tour_id } = req.params
    let { language } = req.query
    try {
        let oneTour = await Md_tour.findOne({
            where: { tour_id },
            attributes: ['tour_id','name','title','description','language_code','mg_tour_id','mg_tour_body'],
            include: [ {model: AddressesTour, as: 'tb_tt_to_address_tour', attributes: ['real_address'], include: [
                {model: GcmState ,as: 'tb_gcm_state', attributes: ['state']},
                {model: GcmCity ,as: 'tb_gcm_city', attributes: ['city']}
            ]}, {model: MdTrTour,as: 'tb_tt_to_tr_tour', attributes:['title','description','language_code']}]
        })
        //--
        oneTour = oneTour.toJSON()
        if((oneTour.language_code == language) || (!language)){
            delete oneTour.tb_tt_to_tr_tour;
        }else{
            oneTour.title = oneTour.tb_tt_to_tr_tour.title
            oneTour.description = oneTour.tb_tt_to_tr_tour.description
            oneTour.language_code = oneTour.tb_tt_to_tr_tour.language_code
            delete oneTour.tb_tt_to_tr_tour
        }                   
        //--    
        if (oneTour) { res.json(oneTour) }
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}

export async function updateOneTour(req, res) {
    const { name, title, description, mg_tour_body } = req.body
    const { tour_id } = req.params

    try {
        const upTour = await Md_tour.findOne({
            where: {
                tour_id
            },
            attributes: ['tour_id', 'name', 'title', 'description','mg_tour_body']
        })
        if (upTour) {
            upTour.update({
                name,
                title,
                description,
                mg_tour_body
            })
        }
        res.json({
            msg: 'Registro Actualizado!'
        })
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}

export async function deleteOneTour(req, res) {
    const { tour_id } = req.params
    try {
        const desOneTour = await Md_tour.destroy({
            where: {
                tour_id
            }
        })
        res.json({
            msg: 'Registro Eliminado!'
        })
    } catch (error) {
        res.json({
            msg: error
        })
    }
}