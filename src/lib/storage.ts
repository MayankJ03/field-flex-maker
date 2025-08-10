const STORAGE_KEY = 'upliance_forms';

const read = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (forms) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
};

const uid = () => 'form_' + Math.random().toString(36).slice(2) + Date.now().toString(36);

export const listForms = () => read();

export const getFormById = (id) => read().find((f) => f.id === id) || null;

export const saveNewForm = ({ name, schema }) => {
  const forms = read();
  const form = { id: uid(), name, schema, createdAt: new Date().toISOString() };
  forms.unshift(form);
  write(forms);
  return form;
};

export const deleteForm = (id) => {
  const forms = read().filter((f) => f.id !== id);
  write(forms);
};
