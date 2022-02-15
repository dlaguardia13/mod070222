import { Router } from 'express'
const router = Router()

import {  addInfoTourPriceType,getInfoTourPriceType } from '../controllers/tourPriceType.controller'
 
router.get('/:tour_id', getInfoTourPriceType)
router.put('/:tour_id', addInfoTourPriceType)

export default router