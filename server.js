// server.js

const express = require("express");
const todoRoutes = require("./routes/todos");

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Todo API is running",
    version: "1.0.0",
    endpoints: {
      getAllTodos: "GET /api/todos",
      getTodoById: "GET /api/todos/:id",
      createTodo: "POST /api/todos",
      updateTodo: "PUT /api/todos/:id",
      completeTodo: "PATCH /api/todos/:id/complete",
      deleteTodo: "DELETE /api/todos/:id",
    },
  });
});

// Routes
app.use("/api/todos", todoRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test it with Postman at http://localhost:${PORT}/api/todos`);
});