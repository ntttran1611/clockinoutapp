export function ManagerLayout({ children, tabTitle }) {
  return (
    <section className="flex flex-col gap-5 p-10">
      <h2 className="text-mocha text-2xl font-semibold">{tabTitle}</h2>
      {children}
    </section>
  );
}
