import { Router } from 'express'
const router = Router()

import {createTour, getAllTours,
        getOneTour,updateOneTour,deleteOneTour, publicInformation} 
        from '../controllers/md_tour.controller'
//      POSTGRES
router.post('/',createTour)
router.get('/', getAllTours)
router.get('/:tour_id',getOneTour)
router.put('/:tour_id', updateOneTour)
router.delete('/:tour_id', deleteOneTour)
//      MONGO
router.post('/:tour_id', publicInformation)

export default router