export default function DateTimeInput({ label, id }) {
  return (
    <section className="flex flex-col gap-2">
      <label className="text-base text-text-primary" htmlFor={id} name={id}>
        {label}
      </label>
      <input
        id={id}
        type="date"
        className="input focus:outline-none border-mocha-30 focus:border-mocha-30"
      />
    </section>
  );
}
