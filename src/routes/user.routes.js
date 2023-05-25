import { Router } from 'express'
const router = Router();


import { findUsers, findUser, createUser, login, logout } from '../controllers/user.controller.js'

// Routes
router.post('/login/', login);
router.post('/', createUser);
router.get('/', findUsers);
router.get('/:userId', findUser);
router.put('/logout/:userId', logout);

export default router;