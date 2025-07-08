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
import Staff from "../data/Staff.js";
import { Clock } from "../data/Clock.js";

//db data
if (!localStorage.getItem("staffList"))
  localStorage.setItem("staffList", JSON.stringify(Staff));
if (!localStorage.getItem("clock"))
  localStorage.setItem("clock", JSON.stringify(Clock));

export default function StaffLogin() {
  const [staffId, setStaffId] = useState("");
  const [branch, setBranch] = useState("hobart");
  const tempStaffList = Staff;
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (staffId !== "") {
      let staff = tempStaffList.find((staff) => staff.id === staffId);
      console.log(staffId);
      if (staff) {
        navigate("/dashboard", { state: {} });
        localStorage.setItem("staffId", staffId);
        localStorage.setItem("userRole", "staff");
      } else {
        alert("No ID number found");
      }
    } else {
      alert("ID number required");
    }
  }

  function handleSelectValueChange(value, display) {
    setBranch(value), localStorage.setItem("branchValue", value);
    localStorage.setItem("branchName", display);
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-1/3 flex justify-center animate-fade-in">
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <Select
            onChange={(value, display) =>
              handleSelectValueChange(value, display)
            }
            value={
              localStorage.getItem("branchValue")
                ? localStorage.getItem("branchValue")
                : "hobart"
            }
            display={
              localStorage.getItem("branchName")
                ? localStorage.getItem("branchName")
                : "Hobart CBD Salon"
            }
          >
            <SelectLog />
            <SelectDropdown>
              <SelectOption value="hobart">Hobart CBD Salon</SelectOption>
              <SelectOption value="kingston">Kingston Salon</SelectOption>
              <SelectOption value="newtown">New Town Salon</SelectOption>
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
  );
}
