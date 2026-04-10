import { useSelect } from "../../context/SelectContext";

export default function SelectOption({ value, children }) {
  const { selectValue } = useSelect();
  return (
    <li
      onClick={() => selectValue(value, children)}
      className="px-4 py-2 cursor-pointer hover:bg-sky-mist-50 transition duration-150 hover:text-white"
    >
      {children}
    </li>
  );
}
