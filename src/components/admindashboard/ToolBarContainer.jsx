export function ToolBarContainer({ children }) {
  return (
    <div className="bg-tool-bar px-10 py-5 flex items-end gap-3 w-full rounded-lg shadow-xl">
      {children}
    </div>
  );
}
