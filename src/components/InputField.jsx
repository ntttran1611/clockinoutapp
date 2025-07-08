export default function InputField({
  value,
  onChange,
  typeName,
  placeHolder,
  type,
}) {
  function getClassName() {
    if (typeName === "login") {
      return "bg-bar w-full py-15 rounded-xl text-center hover:outline-none focus:outline-none font-vietnam text-text-primary text-base font-light shadow-lg";
    }
    if (typeName == "admin") {
      return "bg-bar w-full py-3 mt-2 rounded-xl text-center hover:outline-none focus:outline-none font-vietnam text-text-primary text-base font-light shadow-lg";
    }
    if (typeName == "regular-input") {
      return "w-full p-1 rounded-sm border-text-secondary border hover:outline-none focus:outline-none font-vietnam text-text-primary text-base font-light text-sm";
    }
  }
  let className = getClassName();
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeHolder}
    />
  );
}
