export function Checkbox({ label, name, isChecked, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="checkbox checkbox-xs border-almond bg-almond-40 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
      />
      <label className="label text-sm">{label}</label>
    </div>
  );
}
