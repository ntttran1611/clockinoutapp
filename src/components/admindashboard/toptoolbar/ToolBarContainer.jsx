export default function ToolBarContainer({ children }) {
  return (
    <div className="bg-tool-bar p-5 flex items-center justify-between w-full rounded-lg">
      {children}
    </div>
  );
}
