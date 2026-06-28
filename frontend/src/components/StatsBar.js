import React from 'react';
import { useTask } from '../context/TaskContext';

export default function StatsBar() {
  const { stats, filters, setFilters, fetchTasks } = useTask();

  const handleStatusFilter = (status) => {
    const newFilters = { ...filters, status: filters.status === status ? '' : status };
    setFilters(newFilters);
    fetchTasks(newFilters);
  };

  const cards = [
    { label: 'Total', value: stats.total, key: '', color: 'var(--accent)' },
    { label: 'To Do', value: stats.todo, key: 'todo', color: 'var(--status-todo)' },
    { label: 'In Progress', value: stats.inProgress, key: 'in-progress', color: 'var(--status-progress)' },
    { label: 'Completed', value: stats.completed, key: 'completed', color: 'var(--status-done)' },
  ];

  return (
    <div className="stats-bar">
      {cards.map((c) => (
        <button
          key={c.key}
          className={`stat-card ${filters.status === c.key && c.key ? 'stat-card--active' : ''}`}
          onClick={() => c.key && handleStatusFilter(c.key)}
          style={{ '--card-color': c.color }}
          aria-pressed={filters.status === c.key}
        >
          <span className="stat-card__value">{c.value}</span>
          <span className="stat-card__label">{c.label}</span>
          <span className="stat-card__bar" />
        </button>
      ))}
    </div>
  );
}
