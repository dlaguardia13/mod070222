import { matchObjects } from '../controllers/general/otherFunctions.controller'
const ToPriceType = require('../../models').tb_tt_to_price_type
const AsTourIp = require('../../models').tb_tt_to_as_tour_ip
const ToMdTour = require('../../models').tb_tt_to_md_tour
const GcmIP = require('../../models').tb_gcm_included_in_price
const GcmTrIP = require("../../models").tb_gcm_tr_included_in_price

export async function addInfoTourPriceType(req, res){
    const { tour_id } = req.params
    const { product_type, type_of_tour, price_private, price_collective, tb_tt_to_as_tour_ip, mg_body } = req.body
    let includedInPrice_ = []
    let price_
    let minOfPeople_
    let collectivePrice_ = { 
        minPax: null,
        adult: null,
        child: null
    }
    let privatePrice_ = { 
        minPax: null,
        adult: null,
        child: null
    }
    let localPrices_ = { 
        minPax: null,
        adult: null,
        child: null
    }
    let foreingPrices_ = { 
        minPax: null,
        adult: null,
        child: null
    }   
    try {
        //MD TOUR
        let upToMdTour = await ToMdTour.findByPk(tour_id,{ attributes: ['tour_id','product_type', 'type_of_tour'] })
        if (upToMdTour) { upToMdTour.update({ product_type, type_of_tour })}

        let BdToPriceType = await ToPriceType.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })
        let BdAsTourIp = await AsTourIp.destroy({ where: { tb_tt_to_md_tour_tour_id: tour_id }, force: true })
        //PRICE
        if (price_private) {
            await Promise.all(price_private.map(async (pp) => {
                if ((type_of_tour == 0) || (type_of_tour == 2)) {
                    BdToPriceType = await ToPriceType.create({ tb_tt_to_md_tour_tour_id: tour_id, price_type: 1, min_per: pp.min_per, child: pp.child, adult: pp.adult  },
                        { fields: ['tb_tt_to_md_tour_tour_id', 'price_type', 'min_per', 'child', 'adult'] })

                        // MG STRUCTURES
                        privatePrice_.minPax = pp.min_per
                        privatePrice_.adult = pp.adult
                        privatePrice_.child = pp.child
                        price_ = pp.adult
                        minOfPeople_ = pp.min_per

                    return BdToPriceType   
                }
            }))
        }
        if (price_collective) {
            await Promise.all(price_collective.map(async (pc) => {
                if ((type_of_tour == 1) || (type_of_tour == 2)) {
                    BdToPriceType = await ToPriceType.create({ tb_tt_to_md_tour_tour_id: tour_id, price_type: 2, min_per: pc.min_per, child: pc.child, adult: pc.adult  },
                        { fields: ['tb_tt_to_md_tour_tour_id', 'price_type', 'min_per', 'child', 'adult'] })
                        // MG STRUCTURES
                        collectivePrice_.minPax = pc.min_per
                        collectivePrice_.adult = pc.adult
                        collectivePrice_.child = pc.child
                        price_ = type_of_tour == 1 ? pc.adult:price_
                        minOfPeople_ = type_of_tour == 1 ? pc.min_per:minOfPeople_

                    return BdToPriceType   
                }
            }))
        }
        //ASIP
        await Promise.all(tb_tt_to_as_tour_ip.map(async (ip) => {
            BdAsTourIp = await AsTourIp.create({
                tb_tt_to_md_tour_tour_id: tour_id, tb_gcm_p_included_in_price_id: ip.tb_gcm_p_included_in_price_id, enabled: ip.enabled, removed: ip.removed},
                { fields: ['tb_tt_to_md_tour_tour_id', 'tb_gcm_p_included_in_price_id', 'enabled', 'removed'] })
            return BdAsTourIp
        }))
        
        if (BdAsTourIp && BdToPriceType && upToMdTour) { 
            //  MONGO'S QUERIES
            let mgTour = await ToMdTour.findOne({ where: { tour_id }, attributes: ['tour_id','mg_tour_body'] })
            await Promise.all(tb_tt_to_as_tour_ip.map(async (e) => {
                let ipIds = await GcmIP.findOne({where: {included_in_price_id: e.tb_gcm_p_included_in_price_id},
                attributes: ['mg_included_in_price_id']}) 
                includedInPrice_.push(ipIds.mg_included_in_price_id)
            }))
            
            if (mgTour) {
                let addInfo = mgTour.toJSON().mg_tour_body
                addInfo.typeOfTour = type_of_tour
                
                addInfo.price = price_
                addInfo.minOfPeople = minOfPeople_
                addInfo.privatePrice = privatePrice_
                addInfo.collectivePrice = collectivePrice_
                addInfo.localPrices = localPrices_
                addInfo.foreingPrices = foreingPrices_
                addInfo.includedInPrice = includedInPrice_
                mgTour.update({ mg_tour_body: addInfo })

                res.json({ msg: "Información agregada con exito" })
            }
        }
    } catch (error) {
        res.json({
            msg: error.message
        })
    }

}

export async function getInfoTourPriceType(req, res){
    const { tour_id } = req.params
    const { language } = req.query
    try {
        let allIncludedIp = await ToMdTour.findByPk(tour_id,{
            attributes: ['product_type', 'type_of_tour'],
            include: {model: ToPriceType, as: 'tb_tt_to_price_type', 
            attributes: [['to_price_id','_id'],'price_type','adult','child']}  
        })
        //--
        let included_ip = await AsTourIp.findAll({ 
            where: { tb_tt_to_md_tour_tour_id: tour_id }, attributes:[['tb_gcm_p_included_in_price_id', '_id']], 
            include: [{model: GcmIP, as:'tb_gcm_included_in_price', attributes: ['description','language_code']
            ,include: [{model: GcmTrIP,as:'tb_gcm_tr_included_in_price', attributes: [['translation','tr'],['language_code','lc']]}]
        }]})
        //--
        included_ip = included_ip.map(e => {
            e = e.toJSON()
            if ((e.tb_gcm_included_in_price.language_code == language) || (!language)) {
                e.description = e.tb_gcm_included_in_price.description
                e.language_code = e.tb_gcm_included_in_price.language_code
                delete e.tb_gcm_included_in_price.tb_gcm_tr_included_in_price
                delete e.tb_gcm_included_in_price
            } else {
                e.tb_gcm_included_in_price.tb_gcm_tr_included_in_price = e.tb_gcm_included_in_price.tb_gcm_tr_included_in_price.map(ee =>{
                    e.description = ee.tr
                    e.language_code = ee.lc
                    return ee
                })
                delete e.tb_gcm_included_in_price.tb_gcm_tr_included_in_price
                delete e.tb_gcm_included_in_price
            }
            return e
        })
        //--
        //Get all ip's items from gcm_ip
        let ipItems = await GcmIP.findAll({ where: { product_type: 11 },attributes: [['included_in_price_id','_id'],'description','language_code','product_type'] })

        ipItems = ipItems.map(productType11 =>{
            productType11 = productType11.toJSON()
            productType11.assigned = false
            return productType11 
        })

        allIncludedIp = allIncludedIp.toJSON()
        allIncludedIp.tb_tt_to_as_tour_ip = included_ip
        allIncludedIp.tb_tt_to_as_tour_ip = matchObjects(allIncludedIp.tb_tt_to_as_tour_ip,ipItems)

        if (allIncludedIp) {
            res.json(allIncludedIp)
        }else{ res.json({ msg: "Error: no existe ese registro" }) }
    } catch (error) { res.json({ msg: error.message }) }
}


