import React, { useState, useEffect } from 'react';
import { TaskProvider, useTask } from './context/TaskContext';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import NotificationStack from './components/NotificationStack';
import './App.css';

function AppContent() {
  const { fetchTasks, loading } = useTask();
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-inner">
          <div className="app__brand">
            <span className="brand-icon" aria-hidden>✦</span>
            <div>
              <h1 className="brand-name">TaskFlow</h1>
              <p className="brand-tagline">Stay focused, ship faster</p>
            </div>
          </div>
          <button
            className="btn btn--primary btn--create"
            onClick={() => setShowCreate(true)}
            aria-label="Create new task"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Task
          </button>
        </div>
      </header>

      <main className="app__main">
        <StatsBar />
        <FilterBar />
        {loading && <div className="loading-bar" role="progressbar" aria-label="Loading" />}
        <TaskList />
      </main>

      <footer className="app__footer">
        <p> React · Node.js · MongoDB</p>
      </footer>

      {showCreate && <TaskModal onClose={() => setShowCreate(false)} />}
      <NotificationStack />
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}
