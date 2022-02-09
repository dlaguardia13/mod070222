import { rows } from "pg/lib/defaults"

const Md_tour = require("../../models").tb_tt_to_md_tour

export async function createTour(req, res) {
    const { tb_bp_md_business_profile_id, tb_gcm_status_status_id,name, title, description,capacity,flexible_schedules,enabled,removed }
        = req.body
    try {
        let newTour = await Md_tour.create({
            tb_bp_md_business_profile_id, 
            tb_gcm_status_status_id,
            name, 
            title, 
            description,
            capacity,
            flexible_schedules,
            enabled,
            removed
        },
            {
                fields: [ 'tb_bp_md_business_profile_id', 'tb_gcm_status_status_id','name', 'title', 'description',
                'capacity', 'flexible_schedules', 'enabled', 'removed']
            })
        if (newTour) {
            res.json({
                msg: 'Registro Creado!',
                dataview: newTour
            })
        }
    } catch (error) {
        res.json({
            msg: error
        })
    }
}

export async function getAllTours(req, res) {
    try {
        const AllTours = await Md_tour.findAndCountAll({
            attributes: ['name', 'title', 'description','slug']
        })
        if (AllTours) {
            res.json({
                data: AllTours
            })
        }
    } catch (error) {
        res.json({
            msg: error
        })
    }
}
export async function getOneTour(req, res) {
    const { tour_id } = req.params
    try {
        let oneTour = await Md_tour.findOne({
            where: {
                tour_id
            },
            attributes: ['name', 'title', 'description']
        })
        if (oneTour) {
            res.json({
                data: oneTour
            })
        }else{
            res.json({
                data: "El registro no existe"
            })
        }
    } catch (error) {
        res.json({
            msg: error
        })
    }
}

export async function updateOneTour(req, res) {
    const { name, title, description } = req.body
    const { tour_id } = req.params

    try {
        const upTour = await Md_tour.findOne({
            where: {
                tour_id
            },
            attributes: ['tour_id', 'name', 'title', 'description']
        })
        if (upTour) {
            upTour.update({
                name,
                title,
                description
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