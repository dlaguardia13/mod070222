import { Router } from 'express'
const router = Router();


import { buyCryptoCurrency, sellCryptoCurrency, exchangeCryptoCurrency, getOperationLogs, getHistoricalValue } from '../controllers/operation.controller.js'

// Routes
router.get('/logs/:type/:userId', getOperationLogs);
router.get('/historical/', getHistoricalValue);
router.put('/buy/:userId', buyCryptoCurrency);
router.put('/sell/:userId', sellCryptoCurrency);
router.put('/exchange/:userId', exchangeCryptoCurrency);

export default router;