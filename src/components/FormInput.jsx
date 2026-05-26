export function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  onBlur,
  disabled
}) {
  return (
    <label className="input focus:outline-none border-mocha-30 focus:border-mocha-30">
      <span className="label">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onBlur={onBlur}
        disabled={disabled}
      />
    </label>
  );
}
