import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStaff } from "../data";

export function useStaffInitialization() {
  const [tempStaff, setStaff] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("staff")) {
      navigate("/");
    } else {
      getStaff(localStorage.getItem("staff")).then((data) => {
        setStaff(data);
      });
    }
  }, [navigate]);

  return { tempStaff, setStaff };
}
