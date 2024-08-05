// src/controllers/bookController.ts
import { Request, Response } from 'express';
import Book from '../models/book';
import Joi from 'joi';

export const listBooks = async (req: Request, res: Response) => {
  const books = await Book.findAll();
  res.json(books);
};

export const getBook = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const book = await Book.findByPk(bookId);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
};

export const createBook = async (req: Request, res: Response) => {
  const schema = Joi.object({ name: Joi.string().required() });
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const book = await Book.create(value);
  res.status(201).json(book);
};
