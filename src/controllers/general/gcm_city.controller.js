const City = require('../../../models').tb_gcm_city

export async function getAllCities(req, res) {
    const { state_id } = req.params
    try {
        const allCities = await City.findAll({
            attributes: ['city_id','city'],
            where: {
                tb_gcm_state_state_id: state_id
            }
        })

        if (allCities) {
            res.json({
                data: allCities
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