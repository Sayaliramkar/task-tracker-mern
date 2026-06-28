const express = require('express');
const router = express.Router();
const { body, query, param, validationResult } = require('express-validator');
const Task = require('../models/Task');

// Validation middleware
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const taskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Invalid date format'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
];

// GET /api/tasks - Get all tasks with filtering, sorting, searching
router.get(
  '/',
  [
    query('status').optional().isIn(['todo', 'in-progress', 'completed']),
    query('priority').optional().isIn(['low', 'medium', 'high']),
    query('sort').optional().isIn(['createdAt', '-createdAt', 'dueDate', '-dueDate', 'title', '-title', 'priority', '-priority']),
    query('search').optional().trim(),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { status, priority, sort = '-createdAt', search } = req.query;

      const filter = {};
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ];
      }

      const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      const sortObj = { [sortField]: sortOrder };

      const tasks = await Task.find(filter).sort(sortObj);

      // Stats
      const stats = {
        total: await Task.countDocuments(),
        todo: await Task.countDocuments({ status: 'todo' }),
        inProgress: await Task.countDocuments({ status: 'in-progress' }),
        completed: await Task.countDocuments({ status: 'completed' }),
      };

      res.json({ success: true, count: tasks.length, stats, data: tasks });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  }
);

// GET /api/tasks/:id - Get single task
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task ID')],
  handleValidation,
  async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      res.json({ success: true, data: task });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  }
);

// POST /api/tasks - Create task
router.post('/', taskValidation, handleValidation, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = await Task.create({ title, description, status, priority, dueDate: dueDate || null, tags: tags || [] });
    res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// PUT /api/tasks/:id - Update task
router.put(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task ID'), ...taskValidation],
  handleValidation,
  async (req, res) => {
    try {
      const { title, description, status, priority, dueDate, tags } = req.body;
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { title, description, status, priority, dueDate: dueDate || null, tags: tags || [] },
        { new: true, runValidators: true }
      );
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      res.json({ success: true, message: 'Task updated successfully', data: task });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  }
);

// PATCH /api/tasks/:id/status - Quick status update
router.patch(
  '/:id/status',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('status').isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      res.json({ success: true, message: 'Status updated', data: task });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  }
);

// DELETE /api/tasks/:id - Delete task
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task ID')],
  handleValidation,
  async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  }
);

// DELETE /api/tasks - Delete all completed tasks
router.delete('/', async (req, res) => {
  try {
    const result = await Task.deleteMany({ status: 'completed' });
    res.json({ success: true, message: `${result.deletedCount} completed tasks deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
