import { createContext } from "react";
import { useContext } from "react";

export const SelectContext = createContext();

export function useSelect() {
  const context = useContext(SelectContext);
  if (!context)
    //the children i.e. dropdown or option must be in the Provider to get the context,
    //if the context is out of the provider, we cannot get the context
    throw new Error("Select components must be used within <Select>");
  return context;
}
