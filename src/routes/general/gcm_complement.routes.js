import { Router } from 'express'
const router = Router()

import { getCoplementsByType } from '../../controllers/general/gcm_complement.controller'
   

router.get('/:complement_type',getCoplementsByType)

export default router