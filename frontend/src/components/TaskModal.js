import React, { useEffect, useRef } from 'react';
import { useTask } from '../context/TaskContext';
import { useTaskForm } from '../hooks/useTaskForm';

export default function TaskModal({ task, onClose }) {
  const { createTask, updateTask, notify } = useTask();
  const { form, errors, touched, handleChange, handleBlur, getPayload, validateAll, reset } = useTaskForm(task);
  const titleRef = useRef();
  const isEdit = !!task;

  useEffect(() => {
    titleRef.current?.focus();
    const handleKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    const payload = getPayload();
    try {
      if (isEdit) {
        await updateTask(task._id, payload);
      } else {
        await createTask(payload);
        reset();
      }
      onClose();
    } catch (err) {
      notify(err.message || 'Failed to save task', 'error');
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        <div className="modal__header">
          <h2 id="modal-title">{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form className="task-form" onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${errors.title && touched.title ? 'form-group--error' : ''}`}>
            <label htmlFor="title">Title <span aria-hidden>*</span></label>
            <input
              ref={titleRef}
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="What needs to be done?"
              aria-required="true"
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && touched.title && (
              <span id="title-error" className="form-error" role="alert">{errors.title}</span>
            )}
          </div>

          <div className={`form-group ${errors.description && touched.description ? 'form-group--error' : ''}`}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Add more details..."
              rows={3}
            />
            <span className="char-count">{form.description.length}/500</span>
            {errors.description && touched.description && (
              <span className="form-error" role="alert">{errors.description}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 10)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={form.tags}
                onChange={handleChange}
                placeholder="design, urgent, backend"
              />
              <span className="form-hint">Comma separated</span>
            </div>
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary">
              {isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
