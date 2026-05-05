export function Checkbox({ label, name, isChecked, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="checkbox checkbox-sm border-almond bg-almond-40 checked:border-sky-mist-100 checked:bg-sky-mist-80 checked:text-white"
      />
      <label className="label text-sm">{label}</label>
    </div>
  );
}
