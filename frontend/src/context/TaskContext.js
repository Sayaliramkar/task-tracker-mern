import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { taskAPI } from '../utils/api';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  stats: { total: 0, todo: 0, inProgress: 0, completed: 0 },
  loading: false,
  error: null,
  filters: { status: '', priority: '', sort: '-createdAt', search: '' },
  notifications: [],
};

let notifId = 0;

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload.tasks, stats: action.payload.stats, loading: false, error: null };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t._id === action.payload._id ? action.payload : t)),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t._id !== action.payload) };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, { id: ++notifId, ...action.payload }],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const notify = useCallback((message, type = 'success') => {
    const id = ++notifId;
    dispatch({ type: 'ADD_NOTIFICATION', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }), 3500);
  }, []);

  const fetchTasks = useCallback(async (filters = state.filters) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.sort) params.sort = filters.sort;
      if (filters.search) params.search = filters.search;
      const res = await taskAPI.getAll(params);
      dispatch({ type: 'SET_TASKS', payload: { tasks: res.data, stats: res.stats } });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      notify(err.message, 'error');
    }
  }, [state.filters, notify]);

  const createTask = useCallback(async (data) => {
    const res = await taskAPI.create(data);
    dispatch({ type: 'ADD_TASK', payload: res.data });
    notify('Task created successfully!');
    await fetchTasks();
    return res;
  }, [fetchTasks, notify]);

  const updateTask = useCallback(async (id, data) => {
    const res = await taskAPI.update(id, data);
    dispatch({ type: 'UPDATE_TASK', payload: res.data });
    notify('Task updated successfully!');
    await fetchTasks();
    return res;
  }, [fetchTasks, notify]);

  const updateTaskStatus = useCallback(async (id, status) => {
    const res = await taskAPI.updateStatus(id, status);
    dispatch({ type: 'UPDATE_TASK', payload: res.data });
    const labels = { todo: 'To Do', 'in-progress': 'In Progress', completed: 'Completed' };
    notify(`Moved to ${labels[status]}`);
    await fetchTasks();
  }, [fetchTasks, notify]);

  const deleteTask = useCallback(async (id) => {
    await taskAPI.delete(id);
    dispatch({ type: 'DELETE_TASK', payload: id });
    notify('Task deleted', 'info');
    await fetchTasks();
  }, [fetchTasks, notify]);

  const deleteCompleted = useCallback(async () => {
    await taskAPI.deleteCompleted();
    notify('Completed tasks cleared', 'info');
    await fetchTasks();
  }, [fetchTasks, notify]);

  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const dismissNotification = useCallback((id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  return (
    <TaskContext.Provider
      value={{
        ...state,
        fetchTasks,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        deleteCompleted,
        setFilters,
        notify,
        dismissNotification,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTask = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTask must be used within TaskProvider');
  return ctx;
};
