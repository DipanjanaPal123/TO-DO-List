import React, { useState, useEffect } from 'react';
import './TodoList.css';

function TodoList() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('myTasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  useEffect(() => {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed === '') {
      alert('Please enter a task.');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [...prev, newTask]);
    setInput('');
  };

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleToggle = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleFilter = (type) => {
    setFilter(type);
  };

  const filtered = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    return sortNewestFirst
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  return (
    <div className="todo-box">
      <h2>📝 To-Do List</h2>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleAdd}>Add Task</button>
      </div>

      <div className="controls">
        <select value={filter} onChange={(e) => handleFilter(e.target.value)}>
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
        <button onClick={() => setSortNewestFirst(!sortNewestFirst)}>
          Sort: {sortNewestFirst ? 'Newest' : 'Oldest'}
        </button>
      </div>

      <ul className="task-list">
        {sorted.map(task => (
          <li key={task.id} className={task.completed ? 'done' : ''}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggle(task.id)}
            />
            <span>{task.text}</span>
            <button className="delete-btn" onClick={() => handleDelete(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
