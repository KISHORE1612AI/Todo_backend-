import express from 'express';
import todoRoutes from './app/modules/todo/routes/todoRoutes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Todo API is running',
    version: '2.0.0',
    database: 'MongoDB',
  });
});

app.use('/api/todos', todoRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

export default app;