import { Router } from 'express'
const router = Router()

import {  addInfoTour,getInfoTour } from '../controllers/tourWillSeeAndWhat.controller'
 
router.get('/:tour_id', getInfoTour)
router.put('/:tour_id', addInfoTour)

export default router