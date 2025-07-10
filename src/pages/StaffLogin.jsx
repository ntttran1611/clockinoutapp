import { useState } from "react";
import {
  InputField,
  Select,
  Button,
  SelectLog,
  SelectDropdown,
  SelectOption,
} from "../components";
import { useNavigate } from "react-router-dom";
import { getStaff } from "../data/Staff.js";
import { regexNumber } from "../lib/regex.js";
import { ErrorModal } from "../components/Modal.jsx";

//Any code outside a component will run globally (before React components render)
//console.log("I'm working from the staffLogin");

export default function StaffLogin() {
  localStorage.removeItem("staff");
  localStorage.removeItem("branch");

  const [staffId, setStaffId] = useState("");
  const [loginError, setLoginError] = useState("");
  const [branch, setBranch] = useState("Hobart CBD Salon");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (staffId !== "" && regexNumber.test(staffId)) {
      //get the staff member with matching id
      getStaff(staffId).then((data) => {
        if (!data) {
          setLoginError("No ID number found");
          document.getElementById("staffLoginAlert").showModal();
        } else {
          localStorage.setItem("branch", branch);
          localStorage.setItem("staff", data.id);
          navigate("/dashboard", { state: {} });
        }
      });
    } else {
      setLoginError("Invalid ID number");
      document.getElementById("staffLoginAlert").showModal();
    }
  }

  function handleSelectValueChange(value) {
    setBranch(value);
  }

  return (
    <>
      <ErrorModal heading="Error" content={loginError} id="staffLoginAlert" />{" "}
      <div className="flex items-center justify-center h-full">
        <div className="w-1/3 flex justify-center animate-fade-in">
          <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
            <Select
              onChange={(value) => handleSelectValueChange(value)}
              value={
                localStorage.getItem("branchValue")
                  ? localStorage.getItem("branchValue")
                  : "Hobart CBD Salon"
              }
              display={
                localStorage.getItem("branchName")
                  ? localStorage.getItem("branchName")
                  : "Hobart CBD Salon"
              }
            >
              <SelectLog />
              <SelectDropdown>
                <SelectOption value="Hobart CBD Salon">
                  Hobart CBD Salon
                </SelectOption>
                <SelectOption value="Kingston Salon">
                  Kingston Salon
                </SelectOption>
                <SelectOption value="New Town Salon">
                  New Town Salon
                </SelectOption>
              </SelectDropdown>
            </Select>
            <InputField
              type="text"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              placeHolder="Enter your ID number..."
              typeName="login"
            />
            <Button type="submit" typeName="login">
              LOG IN
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
