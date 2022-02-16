import { Router } from 'express'
const router = Router()

import {  addInfoTourCancellationP,getInfoTourCancellationP } from '../controllers/tourCancellationPolicy.controller'
 
router.get('/:tour_id', getInfoTourCancellationP)
router.put('/:tour_id', addInfoTourCancellationP)

export default router