const express = require("express");
const fs = require("fs");
const path = require("path");
const { validateTodo } = require("../middleware/validate");

const router = express.Router();

const dataPath = path.join(__dirname, "../data/todos.json");

const readTodos = () => {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
};

const writeTodos = (todos) => {
  fs.writeFileSync(dataPath, JSON.stringify(todos, null, 2));
};

const generateId = () => {
  return Date.now().toString();
};

router.get("/", (req, res) => {
  try {
    const todos = readTodos();
    const { completed, priority } = req.query;

    let filtered = todos;

    if (completed !== undefined) {
      const isCompleted = completed === "true";
      filtered = filtered.filter((t) => t.completed === isCompleted);
    }

    if (priority) {
      filtered = filtered.filter((t) => t.priority === priority);
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch todos",
    });
  }
});

router.get("/:id", (req, res) => {
  try {
    const todos = readTodos();
    const todo = todos.find((t) => t.id === req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: `Todo with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch todo",
    });
  }
});

router.post("/", validateTodo, (req, res) => {
  try {
    const todos = readTodos();

    const newTodo = {
      id: generateId(),
      title: req.body.title.trim(),
      description: req.body.description?.trim() || "",
      completed: false,
      priority: req.body.priority || "medium",
      createdAt: new Date().toISOString(),
    };

    todos.push(newTodo);
    writeTodos(todos);

    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: newTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create todo",
    });
  }
});

router.put("/:id", validateTodo, (req, res) => {
  try {
    const todos = readTodos();
    const index = todos.findIndex((t) => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Todo with ID ${req.params.id} not found`,
      });
    }

    const updatedTodo = {
      ...todos[index],
      title: req.body.title.trim(),
      description: req.body.description?.trim() || todos[index].description,
      priority: req.body.priority || todos[index].priority,
      updatedAt: new Date().toISOString(),
    };

    todos[index] = updatedTodo;
    writeTodos(todos);

    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update todo",
    });
  }
});

router.patch("/:id/complete", (req, res) => {
  try {
    const todos = readTodos();
    const index = todos.findIndex((t) => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Todo with ID ${req.params.id} not found`,
      });
    }

    todos[index].completed = !todos[index].completed;
    todos[index].updatedAt = new Date().toISOString();

    writeTodos(todos);

    res.status(200).json({
      success: true,
      message: `Todo marked as ${todos[index].completed ? "completed" : "incomplete"}`,
      data: todos[index],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update todo status",
    });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const todos = readTodos();
    const index = todos.findIndex((t) => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Todo with ID ${req.params.id} not found`,
      });
    }

    const deleted = todos.splice(index, 1)[0];
    writeTodos(todos);

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete todo",
    });
  }
});

module.exports = router;