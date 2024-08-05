import { Router } from 'express';
import { borrowBook, returnBook } from '../controllers/borrowController';

const router = Router();

// Kitap ödünç alma isteği
router.post('/:userId/borrow/:bookId', borrowBook);

// Kitap iade etme isteği
router.post('/:userId/return/:bookId', returnBook);

export default router;
