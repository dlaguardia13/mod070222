import { Router } from 'express'
const router = Router()

import { createAddress ,getAllAddresses } 
        from '../controllers/to_address_t.controller'

router.post('/:tour_id', createAddress)        
router.get('/:tour_id', getAllAddresses)

export default router