export function Toggle({ label, isChecked, onToggle }) {
  return (
    <div className="flex items-center gap-2">
      <label className="label text-sm" htmlFor="toggle">
        {label}
      </label>
      <input
        id="toggle"
        type="checkbox"
        className="toggle border-almond bg-almond-40 checked:border-sky-mist-100 checked:bg-sky-mist-50 checked:text-sky-mist-80"
      />
    </div>
  );
}
