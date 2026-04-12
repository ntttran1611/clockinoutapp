import { useSelect } from "../../context/SelectContext";
import { FaAngleDown } from "react-icons/fa6";
export default function SelectLog() {
  const { toggle, displayed } = useSelect(); //the select context
  return (
    <div
      onClick={toggle}
      className="bg-bar shadow-lg px-4 py-3 font-vietnam text-text-primary text-base font-light flex items-center gap-1 justify-center cursor-pointer"
    >
      {displayed || "Select an option"}
      <FaAngleDown />
    </div>
  );
}
