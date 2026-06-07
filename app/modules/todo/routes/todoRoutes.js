import express from 'express';
import todoController from '../controllers/todoController.js';

const router = express.Router();

router.get('/', todoController.getAll);
router.get('/:id', todoController.getOne);
router.post('/', todoController.create);
router.put('/:id', todoController.update);
router.patch('/:id/complete', todoController.toggleComplete);
router.delete('/:id', todoController.remove);

export default router;