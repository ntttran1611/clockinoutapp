import { formatID } from "../lib";

export function Select({ selectLabel, onChange, list, value }) {
  const options = list.map((item) => {
    const labels = {
      "Staff Member": `#${formatID(item.id)} - ${item.firstName} ${item.lastName}`,
    };
    return {
      id: item.id,
      name: labels[selectLabel] ? labels[selectLabel] : item.name,
    };
  });

  return list && list.length > 0 ? (
    <section className="flex flex-col gap-2 text-text-primary">
      <label htmlFor={selectLabel} name={selectLabel} className="text-sm">
        {selectLabel}
      </label>
      <select
        id={selectLabel}
        value={value || options[0]?.id || ""}
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
  ) : (
    <section className="flex flex-col gap-2 text-text-primary">
      <label htmlFor={selectLabel} name={selectLabel} className="text-base">
        {selectLabel}
      </label>
      <select
        id={selectLabel}
        defaultValue="No item found"
        className="select focus:outline-none border-mocha-30 focus:border-mocha-30 max-h-40 overflow-y-auto px-10"
      >
        <option>No item found</option>
      </select>
    </section>
  );
}
