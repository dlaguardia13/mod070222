import { Router } from 'express'
const router = Router()

import { getAllCountries } 
        from '../../controllers/general/gcm_country.controller'

router.get('/', getAllCountries)

export default router