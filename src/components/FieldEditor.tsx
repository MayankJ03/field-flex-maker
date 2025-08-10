import { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
];

const FieldEditor = ({ field, allFields, onChange, onDelete, onMoveUp, onMoveDown, index, total }) => {
  const id = field.id;

  const parentCandidates = useMemo(() => allFields.filter(f => f.id !== id), [allFields, id]);
  const selectedParents = new Set(field.derived?.parents || []);

  const update = (patch) => onChange({ ...field, ...patch });
  const updateNested = (key, patch) => onChange({ ...field, [key]: { ...(field[key] || {}), ...patch } });

  const optionsCsv = (field.options || []).join(', ');

  return (
    <Card className="border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Field {index + 1}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onMoveUp} disabled={index === 0}>Up</Button>
            <Button variant="secondary" size="sm" onClick={onMoveDown} disabled={index === total - 1}>Down</Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>Delete</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={field.type} onValueChange={(v) => update({ type: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Label</Label>
            <Input value={field.label || ''} onChange={(e) => update({ label: e.target.value })} placeholder="e.g., Email" />
          </div>
          <div className="space-y-2">
            <Label>Name (unique key)</Label>
            <Input value={field.name || ''} onChange={(e) => update({ name: e.target.value })} placeholder="e.g., email" />
          </div>
          <div className="flex items-center justify-between pt-6">
            <div className="space-y-0.5">
              <Label>Required</Label>
            </div>
            <Switch checked={!!field.required} onCheckedChange={(v) => update({ required: !!v })} />
          </div>
        </div>

        {(field.type === 'select' || field.type === 'radio') && (
          <div className="space-y-2">
            <Label>Options (comma separated)</Label>
            <Input value={optionsCsv} onChange={(e) => update({ options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="Option A, Option B" />
          </div>
        )}

        {field.type === 'checkbox' && (
          <div className="space-y-2">
            <Label>Checkbox Label</Label>
            <Input value={field.checkboxLabel || ''} onChange={(e) => update({ checkboxLabel: e.target.value })} placeholder="I accept terms" />
          </div>
        )}

        <div className="space-y-2">
          <Label>Default value</Label>
          {field.type === 'checkbox' ? (
            <div className="flex items-center gap-2">
              <Checkbox checked={!!field.defaultValue} onCheckedChange={(v) => update({ defaultValue: !!v })} />
              <span className="text-sm">Checked by default</span>
            </div>
          ) : field.type === 'textarea' ? (
            <Textarea value={field.defaultValue ?? ''} onChange={(e) => update({ defaultValue: e.target.value })} />
          ) : (
            <Input value={field.defaultValue ?? ''} onChange={(e) => update({ defaultValue: e.target.value })} />
          )}
        </div>

        <Separator />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Not empty</Label>
            </div>
            <Switch checked={!!field.validation?.notEmpty} onCheckedChange={(v) => updateNested('validation', { notEmpty: !!v })} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email format</Label>
            </div>
            <Switch checked={!!field.validation?.email} onCheckedChange={(v) => updateNested('validation', { email: !!v })} />
          </div>
          <div className="space-y-2">
            <Label>Min length</Label>
            <Input type="number" value={field.validation?.minLength ?? ''} onChange={(e) => updateNested('validation', { minLength: e.target.value ? Number(e.target.value) : undefined })} />
          </div>
          <div className="space-y-2">
            <Label>Max length</Label>
            <Input type="number" value={field.validation?.maxLength ?? ''} onChange={(e) => updateNested('validation', { maxLength: e.target.value ? Number(e.target.value) : undefined })} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Password rule (8+ chars & number)</Label>
            </div>
            <Switch checked={!!field.validation?.passwordRule} onCheckedChange={(v) => updateNested('validation', { passwordRule: !!v })} />
          </div>
        </div>

        <Separator />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Derived field</Label>
            <Switch checked={!!field.derived?.enabled} onCheckedChange={(v) => updateNested('derived', { enabled: !!v })} />
          </div>

          {field.derived?.enabled && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Parent fields</Label>
                <div className="grid md:grid-cols-2 gap-2">
                  {parentCandidates.map((pf) => (
                    <label key={pf.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedParents.has(pf.id)}
                        onCheckedChange={(v) => {
                          const next = new Set(selectedParents);
                          v ? next.add(pf.id) : next.delete(pf.id);
                          updateNested('derived', { parents: Array.from(next) });
                        }}
                      />
                      <span className="text-sm">{pf.label || pf.name || pf.id}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Formula</Label>
                <Textarea
                  value={field.derived?.formula || ''}
                  onChange={(e) => updateNested('derived', { formula: e.target.value })}
                  placeholder="Use JavaScript expression. Example: helpers.age(values.dob)"
                />
                <p className="text-sm text-muted-foreground">You can reference parent values via values.<strong>name</strong> or values.<strong>id</strong>. Helpers: age(date), num(x).</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldEditor;
