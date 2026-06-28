import { useState, useCallback } from 'react';

const initialForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  tags: '',
};

const validate = (form) => {
  const errors = {};
  if (!form.title.trim()) {
    errors.title = 'Title is required';
  } else if (form.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (form.title.trim().length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }
  if (form.description && form.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }
  return errors;
};

export function useTaskForm(initial = null) {
  const [form, setForm] = useState(
    initial
      ? {
          title: initial.title || '',
          description: initial.description || '',
          status: initial.status || 'todo',
          priority: initial.priority || 'medium',
          dueDate: initial.dueDate ? initial.dueDate.slice(0, 10) : '',
          tags: (initial.tags || []).join(', '),
        }
      : initialForm
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate({ ...form });
    setErrors((prev) => ({ ...prev, [name]: errs[name] || '' }));
  }, [form]);

  const getPayload = useCallback(() => ({
    title: form.title.trim(),
    description: form.description.trim(),
    status: form.status,
    priority: form.priority,
    dueDate: form.dueDate || null,
    tags: form.tags
      ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
  }), [form]);

  const validateAll = useCallback(() => {
    const errs = validate(form);
    setErrors(errs);
    setTouched({ title: true, description: true });
    return Object.keys(errs).length === 0;
  }, [form]);

  const reset = useCallback(() => {
    setForm(initialForm);
    setErrors({});
    setTouched({});
  }, []);

  return { form, errors, touched, handleChange, handleBlur, getPayload, validateAll, reset, setForm };
}
