import { Router } from 'express'
const router = Router()

import { getAllStates } 
        from '../../controllers/general/gcm_state.controller'

router.get('/:country_id', getAllStates)

export default router