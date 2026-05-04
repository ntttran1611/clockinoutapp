export function SearchInput({ placeholder, onChange, value }) {
  return (
    <section className="flex flex-col gap-2 text-text-primary">
      <label htmlFor="searchInput" className="text-sm">
        Search
      </label>
      <label
        className="input focus:outline-none border-mocha-30 focus:border-mocha-30 px-10"
        htmlFor="searchInput"
      >
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          id="searchInput"
          type="search"
          required
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </label>
    </section>
  );
}
