import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FieldInput from '@/components/FieldInput';
import Seo from '@/components/Seo';
import { getFormById } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

const emailRe = /\S+@\S+\.\S+/;

const helpers = {
  age: (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const diff = Date.now() - d.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  },
  num: (x) => {
    const n = Number(x);
    return isNaN(n) ? 0 : n;
  }
};

const getKey = (f) => (f.name || f.id);

const validateField = (field, value) => {
  const v = value ?? '';
  const str = typeof v === 'string' ? v : String(v);
  const rules = field.validation || {};
  if ((field.required || rules.notEmpty) && (str.trim() === '' || v === false)) return 'This field is required';
  if (rules.minLength && str.length < rules.minLength) return `Minimum length is ${rules.minLength}`;
  if (rules.maxLength && str.length > rules.maxLength) return `Maximum length is ${rules.maxLength}`;
  if (rules.email && !emailRe.test(str)) return 'Please enter a valid email';
  if (rules.passwordRule && !(str.length >= 8 && /\d/.test(str))) return 'Password must be 8+ chars and contain a number';
  return '';
};

const computeDerived = (fields, values) => {
  const map = {};
  fields.forEach((f) => { map[getKey(f)] = values[getKey(f)]; map[f.id] = values[getKey(f)]; });
  fields.forEach((f) => {
    if (f.derived?.enabled && f.derived?.formula) {
      try {
        const fn = new Function('values','helpers', `return (${f.derived.formula});`);
        const result = fn(map, helpers);
        values[getKey(f)] = result;
      } catch (e) {
        // ignore errors, keep old value
      }
    }
  });
  return { ...values };
};

const Preview = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const fromState = (location.state && location.state.schema) ? location.state.schema : null;
  const fromStorage = id ? (getFormById(id)?.schema || null) : null;

  const schema = useMemo(() => fromState || fromStorage || { fields: [] }, [fromState, fromStorage]);
  const fields = schema.fields || [];

  const initialValues = useMemo(() => {
    const v = {};
    fields.forEach((f) => { v[getKey(f)] = f.defaultValue ?? (f.type === 'checkbox' ? false : ''); });
    return computeDerived(fields, v);
  }, [fields]);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setValue = (key, val) => {
    const next = { ...values, [key]: val };
    setValues(computeDerived(fields, next));
  };

  const onSubmit = () => {
    // validate all
    const e = {};
    fields.forEach((f) => {
      const err = validateField(f, values[getKey(f)]);
      if (err) e[getKey(f)] = err;
    });
    setErrors(e);
    if (Object.keys(e).length === 0) {
      toast({ title: 'Looks good!', description: 'All validations passed.' });
    } else {
      toast({ title: 'Please fix errors', description: 'Some fields have problems.' });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Seo title="Preview Form | Form Builder" description="Try the form with full validations and derived fields." canonical={window.location.href} />
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Form Preview</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/create')}>Back to Builder</Button>
        </div>
      </header>

      {fields.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No form loaded</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Build a form first on the Create page.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((f) => (
              <div key={f.id} className="space-y-2">
                <FieldInput
                  field={f}
                  value={values[getKey(f)]}
                  onChange={(val) => {
                    if (f.derived?.enabled) return; // read-only
                    setValue(getKey(f), val);
                  }}
                  error={errors[getKey(f)]}
                />
              </div>
            ))}
            <div className="pt-2">
              <Button onClick={onSubmit}>Submit</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Preview;
