import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

export default function TaskList() {
  const { tasks, loading, error, filters } = useTask();
  const [editTask, setEditTask] = useState(null);

  if (loading && tasks.length === 0) {
    return (
      <div className="task-list__state">
        <div className="spinner" aria-label="Loading tasks" />
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <div className="task-list__state task-list__state--error">
        <span className="state-icon">⚠</span>
        <p>{error}</p>
      </div>
    );
  }

  if (!loading && tasks.length === 0) {
    const hasFilters = filters.status || filters.priority || filters.search;
    return (
      <div className="task-list__state task-list__state--empty">
        <span className="state-icon">📋</span>
        <p className="state-title">{hasFilters ? 'No tasks match your filters' : 'No tasks yet'}</p>
        <p className="state-sub">{hasFilters ? 'Try adjusting your search or filters' : 'Create your first task to get started'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="task-list" role="list" aria-label="Tasks">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={setEditTask} />
        ))}
      </div>

      {editTask && (
        <TaskModal task={editTask} onClose={() => setEditTask(null)} />
      )}
    </>
  );
}
