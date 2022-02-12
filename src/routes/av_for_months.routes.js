import { Router } from 'express'
const router = Router()

import {  addInfoTourAvailability,getInfoTourAvailability } from '../controllers/av_for_months.controller'
 
router.get('/:tour_id', getInfoTourAvailability)
router.put('/:tour_id', addInfoTourAvailability)

export default router