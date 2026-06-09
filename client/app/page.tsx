"use client";
import { useEffect, useState } from "react";

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

const API = "http://localhost:3001/api/todos";

const priorityColor: Record<string, string> = {
  high: "#fee2e2",
  medium: "#fef9c3",
  low: "#dcfce7",
};

const priorityText: Record<string, string> = {
  high: "#dc2626",
  medium: "#ca8a04",
  low: "#16a34a",
};

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      if (data.success) setTodos(data.data);
      else setError("Failed to load todos");
    } catch {
      setError("Cannot connect to backend. Make sure it is running on port 3001.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!title.trim()) { setFormError("Title is required"); return; }
    setAdding(true);
    setFormError("");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority }),
      });
      const data = await res.json();
      if (data.success) {
        setTodos((prev) => [data.data, ...prev]);
        setTitle("");
        setDescription("");
        setPriority("medium");
      } else {
        setFormError(data.message);
      }
    } catch {
      setFormError("Failed to add todo");
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await fetch(`${API}/${id}/complete`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) setTodos((prev) => prev.map((t) => t._id === id ? data.data : t));
    } catch { alert("Failed to update"); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch { alert("Failed to delete"); }
  };

  const filtered = todos.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const pending = todos.filter((t) => !t.completed).length;
  const completed = todos.filter((t) => t.completed).length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", paddingTop: "40px", paddingBottom: "40px" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 16px" }}>

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#111827", margin: 0 }}>
            Todo App
          </h1>
          <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>
            {pending} pending · {completed} completed
          </p>
        </div>

        {/* Form */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "20px", marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "12px" }}>
            Add New Todo
          </p>
          {formError && (
            <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "12px", padding: "8px 12px", borderRadius: "6px", marginBottom: "10px" }}>
              {formError}
            </div>
          )}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "8px 12px", fontSize: "14px", marginBottom: "8px", boxSizing: "border-box", outline: "none" }}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "8px 12px", fontSize: "14px", marginBottom: "8px", boxSizing: "border-box", outline: "none" }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "8px 12px", fontSize: "13px", color: "#374151", outline: "none", cursor: "pointer" }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={handleAdd}
              disabled={adding}
              style={{ flex: 1, backgroundColor: adding ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "14px", cursor: "pointer", fontWeight: 500 }}
            >
              {adding ? "Adding..." : "Add Todo"}
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "4px", backgroundColor: "#e5e7eb", padding: "4px", borderRadius: "8px", width: "fit-content", marginBottom: "16px" }}>
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px",
                fontSize: "12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: filter === f ? 600 : 400,
                backgroundColor: filter === f ? "#fff" : "transparent",
                color: filter === f ? "#111827" : "#6b7280",
                textTransform: "capitalize",
                boxShadow: filter === f ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "13px", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: "14px" }}>
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af", fontSize: "14px" }}>
            No todos yet. Add one above.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filtered.map((todo) => (
              <div
                key={todo._id}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  opacity: todo.completed ? 0.6 : 1,
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo._id)}
                  style={{ marginTop: "3px", cursor: "pointer", accentColor: "#2563eb", width: "15px", height: "15px" }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: todo.completed ? "#9ca3af" : "#111827",
                    textDecoration: todo.completed ? "line-through" : "none",
                    margin: 0,
                  }}>
                    {todo.title}
                  </p>
                  {todo.description && (
                    <p style={{ fontSize: "12px", color: "#9ca3af", margin: "3px 0 0 0" }}>
                      {todo.description}
                    </p>
                  )}
                  <span style={{
                    display: "inline-block",
                    marginTop: "6px",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "20px",
                    backgroundColor: priorityColor[todo.priority],
                    color: priorityText[todo.priority],
                  }}>
                    {todo.priority}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(todo._id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", fontSize: "16px", padding: "0", lineHeight: 1 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}