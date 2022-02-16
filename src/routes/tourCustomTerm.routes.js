import { Router } from 'express'
const router = Router()

import {  addInfoTourCustomT ,getInfoTourCustomT } from '../controllers/tourCustomTerm.controller'
 
router.get('/:tour_id', getInfoTourCustomT)
router.put('/:tour_id', addInfoTourCustomT)

export default router