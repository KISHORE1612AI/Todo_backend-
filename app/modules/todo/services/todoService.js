import Todo from '../models/todoModel.js';

const getAllTodos = async (filters = {}) => {
  const query = {};

  if (filters.completed !== undefined) {
    query.completed = filters.completed === 'true';
  }

  if (filters.priority) {
    query.priority = filters.priority;
  }

  return await Todo.find(query).sort({ createdAt: -1 });
};

const getTodoById = async (id) => {
  return await Todo.findById(id);
};

const createTodo = async (data) => {
  const todo = new Todo(data);
  return await todo.save();
};

const updateTodo = async (id, data) => {
  return await Todo.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const toggleComplete = async (id) => {
  const todo = await Todo.findById(id);
  if (!todo) return null;
  todo.completed = !todo.completed;
  return await todo.save();
};

const deleteTodo = async (id) => {
  return await Todo.findByIdAndDelete(id);
};

export default {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleComplete,
  deleteTodo,
};