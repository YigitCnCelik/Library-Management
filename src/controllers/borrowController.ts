import { Request, Response } from 'express';
import { Borrow, Book } from '../models';
import User from '../models/user';
import Joi from 'joi';

export const borrowBook = async (req: Request, res: Response) => {
  const { userId, bookId } = req.params;

  // Check if userId and bookId are numbers
  if (isNaN(Number(userId)) || isNaN(Number(bookId))) {
    return res.status(400).json({ error: 'Invalid userId or bookId' });
  }

  // Check if user exists
  const user = await User.findByPk(Number(userId));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if book exists
  const book = await Book.findByPk(Number(bookId));
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // Check if the book is already borrowed
  const existingBorrow = await Borrow.findOne({ where: { bookId: Number(bookId), returned: false } });
  if (existingBorrow) {
    return res.status(400).json({ error: 'Book already borrowed' });
  }

  const borrow = await Borrow.create({ userId: Number(userId), bookId: Number(bookId) });
  res.status(201).json(borrow);
};

export const returnBook = async (req: Request, res: Response) => {
  const { userId, bookId } = req.params;

  const schema = Joi.object({
    score: Joi.number().min(1).max(10).required()
  });
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { score } = value;

  // Check if userId and bookId are numbers
  if (isNaN(Number(userId)) || isNaN(Number(bookId))) {
    return res.status(400).json({ error: 'Invalid userId or bookId' });
  }

  // Check if borrow record exists
  const borrow = await Borrow.findOne({ where: { userId: Number(userId), bookId: Number(bookId), returned: false } });
  if (!borrow) {
    return res.status(404).json({ error: 'Borrow record not found' });
  }

  // Mark the book as returned and save the score
  borrow.returned = true;
  borrow.score = score;
  await borrow.save();

  // Update the book's average score
  const book = await Book.findByPk(Number(bookId));
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const borrows = await Borrow.findAll({ where: { bookId: Number(bookId), returned: true } });
  const averageScore = borrows.reduce((sum, borrow) => sum + (borrow.score || 0), 0) / borrows.length;
  book.averageScore = averageScore;
  await book.save();

  res.status(200).json(borrow);
};
