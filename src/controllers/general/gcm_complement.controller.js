const Gcm_Complement = require("../../../models").tb_gcm_complement
const Gcm_Tr_Complement = require("../../../models").tb_gcm_tr_complement

export async function getCoplementsByType(req, res){
    const { complement_type } = req.params
    const { language } = req.query
    try {
        let complemets = await Gcm_Complement.findAll({ where: { complement_type },
            attributes: ['complement_id','name','language_code'],
            include: { model: Gcm_Tr_Complement, as: 'tb_gcm_tr_complement', attributes: ['translation','language_code']}
        })

    
        if (language == "es") {
            complemets = complemets.map(e => {
                e = e.toJSON()
                delete e.tb_gcm_tr_complement
                return e
            })
        }else if(language == "en"){
            complemets = complemets.map(e => {
                e = e.toJSON()
                e.name = e.tb_gcm_tr_complement.translation
                e.language_code = e.tb_gcm_tr_complement.language_code
                delete e.tb_gcm_tr_complement
                return e
            })
        }

        if (complemets) {
            res.json(complemets)
        }
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
}