// src/controllers/borrowController.ts
import { Request, Response } from 'express';
import { Borrow, Book } from '../models';
import User from '../models/user';
import Joi from 'joi';

export const borrowBook = async (req: Request, res: Response) => {
  const schema = Joi.object({
    userId: Joi.number().required(),
    bookId: Joi.number().required()
  });
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { userId, bookId } = value;

  // Check if user exists
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if book exists
  const book = await Book.findByPk(bookId);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // Check if the book is already borrowed
  const existingBorrow = await Borrow.findOne({ where: { bookId, returned: false } });
  if (existingBorrow) {
    return res.status(400).json({ error: 'Book already borrowed' });
  }

  const borrow = await Borrow.create({ userId, bookId });
  res.status(201).json(borrow);
};

export const returnBook = async (req: Request, res: Response) => {
  const schema = Joi.object({
    userId: Joi.number().required(),
    bookId: Joi.number().required(),
    rating: Joi.number().min(1).max(5).required()
  });
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { userId, bookId, rating } = value;

  // Check if borrow record exists
  const borrow = await Borrow.findOne({ where: { userId, bookId, returned: false } });
  if (!borrow) {
    return res.status(404).json({ error: 'Borrow record not found' });
  }

  // Mark the book as returned and save the rating
  borrow.returned = true;
  borrow.rating = rating;
  await borrow.save();

  // Update the book's average rating
  const book = await Book.findByPk(bookId);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const borrows = await Borrow.findAll({ where: { bookId, returned: true } });
  const averageRating = borrows.reduce((sum, borrow) => sum + (borrow.rating || 0), 0) / borrows.length;
  book.averageRating = averageRating;
  await book.save();

  res.status(200).json(borrow);
};
