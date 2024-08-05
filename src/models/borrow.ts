// src/models/borrow.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

interface BorrowAttributes {
  id: number;
  userId: number;
  bookId: number;
  score?: number;
  returned: boolean;
}

interface BorrowCreationAttributes extends Optional<BorrowAttributes, 'id' | 'score' | 'returned'> {}

class Borrow extends Model<BorrowAttributes, BorrowCreationAttributes> implements BorrowAttributes {
  public id!: number;
  public userId!: number;
  public bookId!: number;
  public score!: number;
  public returned!: boolean;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Borrow.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  bookId: { type: DataTypes.INTEGER, allowNull: false },
  score: { type: DataTypes.FLOAT, allowNull: true },
  returned: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { 
  sequelize, 
  modelName: 'Borrow' 
});

export default Borrow;
