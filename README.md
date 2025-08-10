# Dynamic Form Builder (React)

A clean React implementation of a dynamic form builder assignment for upliance.ai.

- Create forms with fields, validations, and derived fields
- Live preview of the form behavior
- Persist schemas in localStorage
- No backend, plain React + Vite + Tailwind UI

## Features
- Field types: text, number, textarea, select, radio, checkbox, date
- Validations: required/not empty, min/max length, email, password rule (8+ & number)
- Derived fields: choose parents and write a simple JS formula, with helpers: `age(date)`, `num(x)`
- Reorder and delete fields
- Save schema with a name and creation date
- Pages: `/create`, `/preview`, `/preview/:id`, `/myforms`

## Running locally
```bash
npm i
npm run dev
```
Open http://localhost:8080

## Build
```bash
npm run build
npm run preview
```

## Notes
- All data persists in `localStorage` only (schema/config only; no user input storage)
- Code is plain React (no TypeScript types) for readability
- UI components use Tailwind/shadcn for a simple, consistent design
