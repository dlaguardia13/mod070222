import { statement_timeout } from "pg/lib/defaults"

const Country = require("../../models").tb_gcm_country
const State = require("../../models").tb_gcm_state

export async function getAllCountries(req, res){
    try {
        const Allcountries = await Country.findAll({
            attributes: ['country'],
            include: {
                model: State, as: 'tb_gcm_state',
                attributes: ['state']
            }
        })

        if (Allcountries) {
            res.json({
                data: Allcountries
            })
        }else{
            res.json({
                data: null
            })
        }
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}