const AddressesTour = require('../../models').tb_tt_to_address_tour
const Md_tour = require("../../models").tb_tt_to_md_tour
const State = require('../../models').tb_gcm_state
const Country = require("../../models").tb_gcm_country
const City = require('../../models').tb_gcm_city

export async function createAddress(req, res) {
    const { tour_id } = req.params
    const { tb_gcm_country_country_id,
        tb_gcm_state_state_id, tb_gcm_city_city_id, real_address, latitude, length, mg_body } = req.body
    try {
        let mgBodyAddress = {
            country: mg_body.mg_country,
            state: mg_body.mg_state,
            city: mg_body.mg_city,
            realAddress: real_address,
            latitude: latitude,
            length: length
        }
        //--
        let upTour = await Md_tour.findOne({
            where: {
                tour_id
            },
            attributes: ['tour_id','mg_tour_body']
        })
        if (upTour) {
            let addInfo = upTour.toJSON().mg_tour_body
            addInfo.placeOfDeparture = mgBodyAddress
            upTour.update({ mg_tour_body: addInfo })
        }
        //--
        const [ addressData, created] = await AddressesTour.findOrCreate({
            where: {
                tb_tt_to_md_tour_tour_id: tour_id
            },
            defaults: {
                tb_tt_to_md_tour_tour_id: tour_id,
                tb_gcm_country_country_id,
                tb_gcm_state_state_id, 
                tb_gcm_city_city_id, 
                real_address, 
                latitude, 
                length
            }
        })
        if(!created)
        {
            addressData.update({
                tb_gcm_country_country_id,
                tb_gcm_state_state_id, 
                tb_gcm_city_city_id, 
                real_address, 
                latitude, 
                length
            })
            res.json({
                msg: 'Registro Actualizado',
                data: addressData
            })
        }else{
            res.json({
                msg: 'Registro Creado!',
                data: addressData
            })
        }
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}

export async function getAllAddresses(req, res) {
    const { tour_id } = req.params
    try {
        const allAddresseses = await AddressesTour.findAll({
            attributes: ['real_address', 'latitude', 'length'],
            where: {
                tb_tt_to_md_tour_tour_id: tour_id
            },
            include: [{
                model: Country, as: 'tb_gcm_country',
                attributes: ['country']
            }, {
                model: State, as: 'tb_gcm_state',
                attributes: ['state']
            }, {
                model: City, as: 'tb_gcm_city',
                attributes: ['city']
            }]
        })

        if (allAddresseses) {
            res.json(allAddresseses)
        } else {
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