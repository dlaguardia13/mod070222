const Gcm_Complement = require("../../../models").tb_gcm_complement

export async function getCoplementsByType(req, res){
    const { complement_type } = req.params
    try {
        const complemets = await Gcm_Complement.findAll({
            where: {
                complement_type
            },
            attributes: ['complement_id','name']
        })
        if (complemets) {
            res.json({
                complemets
            })
        }
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}