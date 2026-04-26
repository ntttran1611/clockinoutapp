export default function Select({ selectLabel, onChange, list }) {
  if (!list || list.length === 0) {
    return;
  }

  const options = list.map((item) => {
    const labels = {
      "Staff Member": `${item.firstName} ${item.lastName}`,
    };
    return {
      id: item.id,
      name: labels[selectLabel] || "Unknown",
    };
  });

  return (
    <section className="flex flex-col gap-2 text-text-primary">
      <label className="text-base">{selectLabel}</label>
      <select
        defaultValue={options[0]?.id || ""}
        onChange={onChange}
        className="select focus:outline-none border-mocha-30 focus:border-mocha-30 max-h-40 overflow-y-auto px-10"
      >
        {options.map((option) => {
          return (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          );
        })}
      </select>
    </section>
  );
}
