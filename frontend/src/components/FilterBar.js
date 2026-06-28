import React, { useCallback, useRef } from 'react';
import { useTask } from '../context/TaskContext';

export default function FilterBar() {
  const { filters, setFilters, fetchTasks, deleteCompleted, stats } = useTask();
  const searchTimer = useRef(null);

  const handleChange = useCallback((key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    if (key === 'search') {
      clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => fetchTasks(updated), 350);
    } else {
      fetchTasks(updated);
    }
  }, [filters, setFilters, fetchTasks]);

  const clearAll = () => {
    const cleared = { status: '', priority: '', sort: '-createdAt', search: '' };
    setFilters(cleared);
    fetchTasks(cleared);
  };

  const hasFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search"
          className="search-input"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          aria-label="Search tasks"
        />
        {filters.search && (
          <button className="search-clear" onClick={() => handleChange('search', '')} aria-label="Clear search">×</button>
        )}
      </div>

      <div className="filter-bar__controls">
        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="filter-select"
          value={filters.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          className="filter-select"
          value={filters.sort}
          onChange={(e) => handleChange('sort', e.target.value)}
          aria-label="Sort tasks"
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="dueDate">Due Date ↑</option>
          <option value="-dueDate">Due Date ↓</option>
          <option value="title">Title A–Z</option>
          <option value="-title">Title Z–A</option>
          <option value="-priority">Priority High–Low</option>
        </select>

        {hasFilters && (
          <button className="btn btn--ghost btn--sm" onClick={clearAll}>
            Clear filters
          </button>
        )}

        {stats.completed > 0 && (
          <button
            className="btn btn--ghost btn--sm btn--danger"
            onClick={() => {
              if (window.confirm(`Delete all ${stats.completed} completed tasks?`)) {
                deleteCompleted();
              }
            }}
          >
            Clear done ({stats.completed})
          </button>
        )}
      </div>
    </div>
  );
}
