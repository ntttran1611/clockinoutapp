import { useRef, useState, useEffect } from "react";
import { SelectContext } from "../../context/SelectContext";
export default function Select({ children, onChange, value, display }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const [displayed, setDisplayed] = useState(display);
  const selectRef = useRef(null); //reference to the whole Select

  const toggle = () => setIsOpen(!isOpen);

  function selectValue(value, display) {
    setSelected(value);
    setIsOpen(false);
    setDisplayed(display);
    onChange?.(value, display);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <SelectContext.Provider
      value={{ isOpen, toggle, selected, displayed, selectValue }}
    >
      <div ref={selectRef} className="relative inline-block">
        {children}
      </div>
    </SelectContext.Provider>
  );
}
