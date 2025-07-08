export default function Label({ children, name }) {
  return (
    <label
      className="font-vietnam font-light text-sm m-1 text-text-primary"
      name={name}
    >
      {children}
    </label>
  );
}
