import { Router } from 'express'
const router = Router()

import {  addInfoTourAdvertisingC ,getInfoTourAdvertisingC } from '../controllers/advertisingChanels.controller'
 
router.get('/:tour_id', getInfoTourAdvertisingC)
router.put('/:tour_id', addInfoTourAdvertisingC)

export default router