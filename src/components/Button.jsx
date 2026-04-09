export default function Button({ type, onClick, typeName, children }) {
  function getClassName() {
    if (typeName === "login") {
      return "bg-mocha w-full text-center py-2 rounded-lg text-white font-medium shadow-bold cursor-pointer font-vietnam";
    }
    if (typeName === "icon-primary") {
      return "bg-mocha text-center p-2 rounded-2xl text-white cursor-pointer text-sm";
    }
    if (typeName === "icon-secondary") {
      return "bg-secondary-bg text-center p-2 rounded-2xl text-black cursor-pointer text-sm";
    }
  }
  let className = getClassName();
  return (
    <button
      type={type}
      onClick={onClick ? onClick : null}
      className={className}
    >
      {children}
    </button>
  );
}
