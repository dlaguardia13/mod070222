import { Router } from 'express'
const router = Router()

import {createTour, getAllTours,
        getOneTour,updateOneTour,deleteOneTour} 
        from '../controllers/md_tour.controller'

router.post('/',createTour)
router.get('/', getAllTours)
router.get('/:tour_id',getOneTour)
router.put('/:tour_id', updateOneTour)
router.delete('/:tour_id', deleteOneTour)

export default router