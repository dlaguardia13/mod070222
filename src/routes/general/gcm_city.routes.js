import { Router } from 'express'
const router = Router()

import { getAllCities } 
        from '../../controllers/general/gcm_city.controller'

router.get('/:state_id', getAllCities)

export default router
