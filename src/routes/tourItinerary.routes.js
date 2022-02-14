import { Router } from 'express'
const router = Router()

import {  addInfoTourItinerary,getInfoTourItinerary } from '../controllers/tourItinerary.controller'
 
router.get('/:tour_id', getInfoTourItinerary)
router.put('/:tour_id', addInfoTourItinerary)

export default router