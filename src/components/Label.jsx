export default function Label({ children, name }) {
  return (
    <label
      className="font-vietnam font-regular text-sm text-text-primary"
      name={name}
    >
      {children}
    </label>
  );
}
