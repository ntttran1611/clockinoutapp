export function TimeInput({ label, id, defaultValue, onChange }) {
  return (
    <input
      id={id}
      type="time"
      defaultValue={defaultValue}
      onChange={onChange}
      className="input focus:outline-none border-mocha-30 focus:border-mocha-30 px-8"
    />
  );
}
