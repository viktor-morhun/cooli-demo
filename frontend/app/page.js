"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    fetchHealth();
  }, []);

  async function fetchTasks() {
    try {
      const res = await fetch(`${API}/api/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch {
      console.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }

  async function fetchHealth() {
    try {
      const res = await fetch(`${API}/api/health`);
      const data = await res.json();
      setHealth(data);
    } catch {
      setHealth(null);
    }
  }

  async function addTask(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const res = await fetch(`${API}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    if (res.ok) {
      const task = await res.json();
      setTasks((prev) => [...prev, task]);
      setNewTitle("");
    }
  }

  async function toggleTask(id) {
    const res = await fetch(`${API}/api/tasks/${id}`, { method: "PATCH" });
    if (res.ok) {
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  }

  async function deleteTask(id) {
    const res = await fetch(`${API}/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  }

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Cooli Demo</h1>
            <p className={styles.subtitle}>Task Manager &middot; deployed with Coolify</p>
          </div>
          <div className={styles.statusBadge} data-ok={health?.status === "ok"}>
            <span className={styles.dot} />
            {health?.status === "ok" ? "API Online" : "API Offline"}
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{tasks.length}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{completedCount}</span>
            <span className={styles.statLabel}>Done</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{tasks.length - completedCount}</span>
            <span className={styles.statLabel}>Remaining</span>
          </div>
        </div>

        {/* Add form */}
        <form className={styles.form} onSubmit={addTask}>
          <input
            className={styles.input}
            type="text"
            placeholder="Add a new task."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button className={styles.addBtn} type="submit">
            Add
          </button>
        </form>

        {/* Task list */}
        <ul className={styles.list}>
          {loading ? (
            <li className={styles.empty}>Loading...</li>
          ) : tasks.length === 0 ? (
            <li className={styles.empty}>No tasks yet. Add one above!</li>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className={styles.item} data-done={task.completed}>
                <button
                  className={styles.checkbox}
                  data-checked={task.completed}
                  onClick={() => toggleTask(task.id)}
                  aria-label="Toggle task"
                >
                  {task.completed && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <span className={styles.taskTitle}>{task.title}</span>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteTask(task.id)}
                  aria-label="Delete task"
                >
                  &times;
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
