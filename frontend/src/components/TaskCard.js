import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { format, isPast, isToday } from 'date-fns';

const PRIORITY_LABELS = { low: 'Low', medium: 'Med', high: 'High' };
const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskCard({ task, onEdit }) {
  const { updateTaskStatus, deleteTask } = useTask();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);

  const handleStatusChange = async (e) => {
    setStatusChanging(true);
    try {
      await updateTaskStatus(task._id, e.target.value);
    } finally {
      setStatusChanging(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    await deleteTask(task._id);
  };

  const dueDateStr = task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : null;
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed' && !isToday(new Date(task.dueDate));
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  return (
    <article
      className={`task-card task-card--${task.status} task-card--priority-${task.priority} ${task.status === 'completed' ? 'task-card--done' : ''}`}
      aria-label={`Task: ${task.title}`}
    >
      <div className="task-card__header">
        <div className="task-card__badges">
          <span className={`badge badge--priority badge--${task.priority}`} aria-label={`Priority: ${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className={`badge badge--status badge--${task.status}`}>
            {STATUS_OPTIONS.find((s) => s.value === task.status)?.label}
          </span>
        </div>
        <div className="task-card__actions">
          <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit task" title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            className={`icon-btn icon-btn--danger ${confirmDelete ? 'icon-btn--confirm' : ''}`}
            onClick={handleDelete}
            aria-label={confirmDelete ? 'Confirm delete' : 'Delete task'}
            title={confirmDelete ? 'Click again to confirm' : 'Delete'}
          >
            {confirmDelete ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <h3 className="task-card__title">{task.title}</h3>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      {task.tags && task.tags.length > 0 && (
        <div className="task-card__tags">
          {task.tags.map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="task-card__footer">
        {dueDateStr && (
          <span
            className={`due-date ${isOverdue ? 'due-date--overdue' : ''} ${isDueToday ? 'due-date--today' : ''}`}
            aria-label={`Due: ${dueDateStr}${isOverdue ? ' (overdue)' : ''}${isDueToday ? ' (today)' : ''}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {isOverdue && '⚠ '}
            {isDueToday ? 'Due today' : dueDateStr}
          </span>
        )}

        <select
          className={`status-select status-select--${task.status}`}
          value={task.status}
          onChange={handleStatusChange}
          disabled={statusChanging}
          aria-label="Change status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </article>
  );
}
