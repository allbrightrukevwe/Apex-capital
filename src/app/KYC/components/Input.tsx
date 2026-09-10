interface InputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}

export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}: InputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-dark-600 dark:text-light-200"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="input-field"
      />
    </div>
  );
}