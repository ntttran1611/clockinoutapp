export function FormTimeInput({ label, defaultValue, onChange }) {
  return (
    <label className="input focus:outline-none border-mocha-30 focus:border-mocha-30">
      <span className="label">{label}</span>
      <input type="time" onChange={onChange} id={label} defaultValue={defaultValue}/>
    </label>
  );
}
