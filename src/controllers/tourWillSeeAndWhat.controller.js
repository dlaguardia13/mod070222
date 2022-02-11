const YouWillSee = require('../../models').tb_tt_to_you_will_see
const CmWhat = require('../../models').tb_tt_to_as_tour_cm_whant
const Md_tour = require("../../models").tb_tt_to_md_tour 
const GcmComplement = require("../../models").tb_gcm_complement 


export async function addInfoTour(req, res){
    const { tour_id } = req.params
    const { tb_gcm_complement_complement_id, you_will_see, additional_information, language_code, enabled, removed} = req.body
    try {
        //--PART 1
        const tourwhattD = await CmWhat.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })
        let whats = await Promise.all(tb_gcm_complement_complement_id.map(async (whats) => {
            let newWhat = await CmWhat.create({ tb_tt_to_md_tour_tour_id: tour_id, tb_gcm_complement_complement_id: whats, enabled, removed },
                { fields: ['tb_tt_to_md_tour_tour_id', 'tb_gcm_complement_complement_id', 'enabled', 'removed'] })
            return newWhat
        })) 
        //--PART 2 and 3: Additional_info: 2 will_see: 1
        const tourwillSeeD = await YouWillSee.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })
        let additionalInfo = await Promise.all(additional_information.map(async (additionalInfo) => {
            let newInfo = await YouWillSee.create({ tb_tt_to_md_tour_tour_id: tour_id, you_will_see: additionalInfo, enabled, removed, language_code, info_type: 2 },
                { fields: ['tb_tt_to_md_tour_tour_id', 'you_will_see', 'enabled', 'removed', 'language_code', 'info_type'] })
            return newInfo
        }))
        let willSee = await Promise.all(you_will_see.map(async (willSee) => {
            let newWilSee = await YouWillSee.create({ tb_tt_to_md_tour_tour_id: tour_id, you_will_see: willSee, enabled, removed, language_code, info_type: 1 },
                { fields: ['tb_tt_to_md_tour_tour_id', 'you_will_see', 'enabled', 'removed', 'language_code', 'info_type'] })
            return newWilSee
        }))
        if (whats && additionalInfo && willSee) {
            res.json({
                msg: "Informacion agregada"
            })
        }
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
} 

export async function getInfoTour(req, res){
    const { tour_id } = req.params
    try {
        let allWhatWillSee = await Md_tour.findByPk(tour_id, {
            attributes: ['tour_id'],
            include: [
                {model: YouWillSee, as: 'tb_tt_to_you_will_see', attributes: [['you_will_see_id','_id'],'you_will_see','info_type']},
                {model: CmWhat, as: 'tb_tt_to_as_tour_cm_whant', attributes: [['tb_gcm_complement_complement_id','_id']]},
            ]
        })
        //Get all languages from gcm_languages
        let AllCm = await GcmComplement.findAll({ where: { complement_type: 8 },attributes: [['complement_id','_id'],'name','complement_type'] })

        AllCm = AllCm.map(complementT8 =>{
            complementT8 = complementT8.toJSON()
            complementT8.assigned = false
            return complementT8 
        })

        allWhatWillSee = allWhatWillSee.toJSON()
        allWhatWillSee.tb_tt_to_as_tour_cm_whant = matchObjects(AllCm,allWhatWillSee.tb_tt_to_as_tour_cm_whant)

        if (allWhatWillSee) {
            res.json({
                allWhatWillSee
            })
        }else{
            res.json({
                msg: "Error: no existe ese registro"
            })
        }
    } catch (error) {
        res.json({
            msg: error.msg
        })
    }
}

//OTHER FUNCTIONS
function matchObjects(complements, assignedComplements) {
    let match = [];
    complements.map(complement => {
        let search = assignedComplements.find(assigned => assigned._id == complement._id);
        if (search) {
            complement.assigned = true;
        }
        match.push(complement);
    });
    return match;
}