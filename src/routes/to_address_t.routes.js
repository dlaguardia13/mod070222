import { Router } from 'express'
const router = Router()

import { createAddress ,getAllAddresses } 
        from '../controllers/to_address_t.controller'

router.put('/:tour_id', createAddress)        
router.get('/:tour_id', getAllAddresses)

export default router