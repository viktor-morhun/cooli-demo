const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory store
const tasks = [
  { id: 1, title: "Deploy to Coolify", completed: false },
  { id: 2, title: "Set up CI/CD", completed: false },
  { id: 3, title: "Add monitoring", completed: false },
];
let nextId = 4;

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Get all tasks
app.get("/api/tasks", (_req, res) => {
  res.json(tasks);
});

// Create a task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const task = { id: nextId++, title: title.trim(), completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Toggle task completion
app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.completed = !task.completed;
  res.json(task);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const idx = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Task not found" });
  tasks.splice(idx, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
