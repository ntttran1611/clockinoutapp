export default function DateTimeInput({ label, id, defaultValue, onChange }) {
  return (
    <section className="flex flex-col gap-2 text-text-primary">
      <label className="text-base" htmlFor={id} name={id}>
        {label}
      </label>
      <input
        id={id}
        type="date"
        defaultValue={defaultValue}
        onChange={onChange}
        className="input focus:outline-none border-mocha-30 focus:border-mocha-30 px-8"
      />
    </section>
  );
}
