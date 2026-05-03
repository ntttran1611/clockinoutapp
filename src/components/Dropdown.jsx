export function Dropdown({ label, onSelect, list }) {
  const options = list.map((item) => {
    const labels = {
      "Staff Member": `${item.firstName} ${item.lastName}`,
    };
    return {
      id: item.id,
      name: labels[label] || "Unknown",
    };
  });

  return (
    <section className="flex flex-col gap-2 text-text-primary justify-end">
      <label htmlFor={label} name={label} className="text-sm">
        {label}
      </label>
      <div id={label} className="dropdown dropdown-hover">
        <div tabIndex={0} role="button" className="btn m-1">
          {label}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm max-h-40 overflow-y-auto"
        >
          {options.map((option) => {
            return (
              <li key={option.id} onClick={() => onSelect(option.id)}>
                <a>{option.name}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
