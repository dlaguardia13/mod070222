import { Router } from 'express'
const router = Router()

import { getCategories,addInfoTour,getIngfoTour,getLanguages } from '../controllers/tourAdditional.controller'
import { getCoplementsByType } from '../controllers/general/gcm_complement.controller'
   
router.get('/categories/', getCategories)
router.get('/complements/:complement_type',getCoplementsByType)
router.get('/languages/',getLanguages)
router.get('/:tour_id', getIngfoTour)
router.put('/:tour_id', addInfoTour)

export default router