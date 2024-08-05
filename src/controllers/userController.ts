// src/controllers/userController.ts
import { Request, Response } from 'express';
import User from '../models/user';
import Borrow from '../models/borrow';
import Joi from 'joi';

export const listUsers = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByPk(id, {
    include: [{ model: Borrow, include: ['Book'] }]
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const schema = Joi.object({ name: Joi.string().required() });
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const user = await User.create(value);
  res.status(201).json(user);
};
