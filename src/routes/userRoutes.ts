// src/routes/userRoutes.ts
import { Router } from 'express';
import { listUsers, getUser, createUser } from '../controllers/userController';

const router = Router();

router.get('/', listUsers);
router.get('/:id', getUser);
router.post('/', createUser);

export default router;
