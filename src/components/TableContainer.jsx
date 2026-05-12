export function TableContainer({ children }) {
  return (
    <section className="flex-1 shadow-xl rounded-xl p-7 border border-mocha-30 flex flex-col gap-3">
      {children}
    </section>
  );
}
