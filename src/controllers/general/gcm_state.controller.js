const State = require('../../../models').tb_gcm_state


export async function getAllStates(req, res) {
    const { country_id } = req.params
    try {
        const allStates = await State.findAll({
            attributes: ['state_id', 'state'],
            where: {
                tb_gcm_country_country_id: country_id
            }
        })

        if (allStates) {
            res.json({
                data: allStates
            })
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