// src/app.ts
import express from 'express';
import userRoutes from './routes/userRoutes';
import bookRoutes from './routes/bookRoutes';
import borrowRoutes from './routes/borrowRoutes';
import { errorHandler } from './middlewares/errorMiddleware';
import sequelize from './database';

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/users', borrowRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => console.log('Failed to sync database: ', err));
