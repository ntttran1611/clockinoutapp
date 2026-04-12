export default function Button({ type, onClick, typeName, children }) {
  function getClassName() {
    if (typeName === "login") {
      return "bg-mocha w-full text-center py-2 text-white font-medium shadow-bold cursor-pointer font-vietnam";
    }
    if (typeName === "icon-primary") {
      return "bg-mocha rounded-2xl text-center p-2 text-white cursor-pointer text-sm";
    }
    if (typeName === "icon-secondary") {
      return "bg-secondary-bg rounded-2xl text-center p-2text-black cursor-pointer text-sm";
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
