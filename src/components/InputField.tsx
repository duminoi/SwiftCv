interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  rows?: number;
  placeholder?: string;
}

export function InputField({ label, value, onChange, type = "text", rows, placeholder }: InputFieldProps) {
  return (
    <div className="relative">
      <label className="absolute -top-2 left-2 bg-white px-1 font-medium text-xs text-primary">
        {label}
      </label>
      {rows ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-lg border border-surface-border bg-transparent focus:border-primary focus:ring-2 focus:ring-primary-light/40 focus:outline-none text-sm text-on-surface resize-none transition-all duration-150"
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-lg border border-surface-border bg-transparent focus:border-primary focus:ring-2 focus:ring-primary-light/40 focus:outline-none text-sm text-on-surface transition-all duration-150"
        />
      )}
    </div>
  );
}
