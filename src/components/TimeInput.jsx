export function TimeInput({ label, id, value, onChange }) {
  return (
    <input
      id={id}
      type="time"
      value={value}
      onChange={onChange}
      className="input focus:outline-none border-mocha-30 focus:border-mocha-30 px-8"
    />
  );
}
