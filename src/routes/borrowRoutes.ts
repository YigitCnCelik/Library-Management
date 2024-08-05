// src/routes/borrowRoutes.ts
import { Router } from 'express';
import { borrowBook, returnBook } from '../controllers/borrowController';

const router = Router();

router.post('/borrow', borrowBook);
router.post('/return', returnBook);

export default router;