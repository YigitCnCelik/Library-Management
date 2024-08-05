// src/routes/bookRoutes.ts
import { Router } from 'express';
import { listBooks, getBook, createBook } from '../controllers/bookController';

const router = Router();

router.get('/', listBooks);
router.get('/:bookId', getBook);
router.post('/', createBook);

export default router;
