import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from 'react-router-dom';
import FieldEditor from '@/components/FieldEditor';
import Seo from '@/components/Seo';
import { toast } from '@/hooks/use-toast';
import { saveNewForm } from '@/lib/storage';

const newField = (type = 'text') => ({
  id: 'fld_' + Math.random().toString(36).slice(2),
  type,
  label: '',
  name: '',
  required: false,
  defaultValue: type === 'checkbox' ? false : '',
  options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined,
  validation: {},
  derived: { enabled: false, parents: [], formula: '' },
});

const Create = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState([newField('text')]);

  useEffect(() => {
    document.body.scrollTop = 0; document.documentElement.scrollTop = 0;
  }, []);

  const addField = (type) => setFields((prev) => [...prev, newField(type)]);

  const updateAt = (idx, next) => setFields((prev) => prev.map((f, i) => i === idx ? next : f));
  const removeAt = (idx) => setFields((prev) => prev.filter((_, i) => i !== idx));
  const moveUp = (idx) => setFields((prev) => idx === 0 ? prev : prev.map((f, i) => i === idx-1 ? prev[idx] : i === idx ? prev[idx-1] : f));
  const moveDown = (idx) => setFields((prev) => idx === prev.length-1 ? prev : prev.map((f, i) => i === idx+1 ? prev[idx] : i === idx ? prev[idx+1] : f));

  const onPreview = () => {
    navigate('/preview', { state: { schema: { fields } } });
  };

  const onSave = () => {
    const name = window.prompt('Enter a name for this form:');
    if (!name) return;
    const form = saveNewForm({ name, schema: { fields } });
    toast({ title: 'Form saved', description: `Saved as "${form.name}"` });
  };

  const fieldCount = fields.length;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Seo title="Create Form | Form Builder" description="Build a new dynamic form with fields, validations, and derived fields." canonical={window.location.href} />
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Form Builder</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onPreview}>Preview</Button>
          <Button onClick={onSave}>Save Form</Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Add fields</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {['text','number','textarea','select','radio','checkbox','date'].map((t) => (
            <Button key={t} variant="secondary" onClick={() => addField(t)}>{t}</Button>
          ))}
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-4">
        {fields.map((f, idx) => (
          <FieldEditor
            key={f.id}
            field={f}
            allFields={fields}
            index={idx}
            total={fieldCount}
            onChange={(next) => updateAt(idx, next)}
            onDelete={() => removeAt(idx)}
            onMoveUp={() => moveUp(idx)}
            onMoveDown={() => moveDown(idx)}
          />
        ))}
        {fields.length === 0 && (
          <p className="text-muted-foreground">No fields yet. Use the buttons above to add some.</p>
        )}
      </div>
    </div>
  );
};

export default Create;
