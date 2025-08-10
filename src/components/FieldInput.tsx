import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const FieldInput = ({ field, value, onChange, error }) => {
  const id = field.id;
  const label = field.label || field.name || id;
  const hint = field.hint;

  const common = {
    id,
    value: value ?? '',
    onChange: (e) => onChange(e.target.value),
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}{field.required ? ' *' : ''}</Label>

      {field.type === 'text' && (
        <Input {...common} placeholder={field.placeholder || ''} />
      )}

      {field.type === 'number' && (
        <Input id={id} type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder || ''} />
      )}

      {field.type === 'textarea' && (
        <Textarea id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder || ''} />
      )}

      {field.type === 'select' && (
        <Select value={(value === '' || value === undefined) ? undefined : value} onValueChange={(v) => onChange(v)}>
          <SelectTrigger id={id}>
            <SelectValue placeholder={field.placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent>
            {(field.options || []).map((opt, idx) => (
              <SelectItem key={idx} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.type === 'radio' && (
        <RadioGroup value={value ?? ''} onValueChange={(v) => onChange(v)}>
          {(field.options || []).map((opt, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <RadioGroupItem value={opt} id={`${id}-${idx}`} />
              <Label htmlFor={`${id}-${idx}`}>{opt}</Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {field.type === 'checkbox' && (
        <div className="flex items-center space-x-2">
          <Checkbox id={id} checked={!!value} onCheckedChange={(v) => onChange(!!v)} />
          <Label htmlFor={id}>{field.checkboxLabel || 'Check'}</Label>
        </div>
      )}

      {field.type === 'date' && (
        <Input id={id} type="date" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      )}

      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default FieldInput;
