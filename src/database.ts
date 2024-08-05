import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:', // Bellek içi veritabanı
  logging: false,
});

export default sequelize;
