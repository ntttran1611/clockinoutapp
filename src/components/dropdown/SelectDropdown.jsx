import { useSelect } from "../../context/SelectContext";
export default function SelectDropdown({ children }) {
  const { isOpen } = useSelect(); //the Select context

  return (
    <ul
      className={`overflow-y-auto transition-all duration-500 ease-in-out absolute shadow bg-white w-full
        mt-1 font-vietnam text-text-primary text-base font-light text-center ${
          isOpen ? "max-h-20" : "max-h-0"
        }`}
    >
      {children}
    </ul>
  );
}
