import { Router } from 'express'
const router = Router()

import { getAllCities } 
        from '../controllers/gcm_city.controller'

router.get('/:state_id', getAllCities)

export default router
