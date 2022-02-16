const ToMdTour = require('../../models').tb_tt_to_md_tour
const ToCustomTerm = require('../../models').tb_tt_to_custom_term

export async function addInfoTourCustomT(req, res){
    const { tour_id } = req.params
    const { custom_term } = req.body
    try {
        let opToCustomTerm = await ToCustomTerm.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })

        let Ict = await Promise.all(custom_term.map(async (ct) => {
            opToCustomTerm = await ToCustomTerm.create({
                tb_tt_to_md_tour_tour_id: tour_id, custom_term: ct.custom_term, language_code: ct.language_code, product_type: ct.product_type
            },
                { fields: ['tb_tt_to_md_tour_tour_id', 'custom_term', 'language_code', 'product_type'] })
            return opToCustomTerm
        }))
        if (opToCustomTerm) { res.json({ msg: 'Informacion agregada con exito' }) }

    } catch (error) {
        res.json({ msg: error.message })
    }
}

export async function getInfoTourCustomT(req, res){
    const { tour_id } = req.params
    try {
        let allCT = await ToMdTour.findByPk(tour_id, {
            attributes: ['tour_id'],
            include: { model: ToCustomTerm, as: 'tb_tt_to_custom_term', attributes: [['custom_term_id', '_id'], 'custom_term', 'language_code','product_type'] }
        })

        if (allCT) { res.json(allCT)}

    } catch (error) {
        res.json({ msg: error.message })
    }
}