import { useState } from "react";
import { InputField, Button, Label } from "../components";
import { useNavigate } from "react-router-dom";

const adminAccount = { username: "123456", password: "sweeties" };

export default function AdminLogin() {
  const [account, setAccount] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    if (
      adminAccount.username === account.username &&
      adminAccount.password === account.password
    ) {
      navigate("/dashboard", { state: {} });
      localStorage.setItem("userRole", "admin");
    } else if (account.username === "" || account.password === "") {
      alert("username or password required");
    } else {
      alert("Invalid username or password");
    }
  }
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-1/4 flex justify-center animate-fade-in">
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <Label name="username">Admin ID number:</Label>
            <InputField
              type="text"
              value={account.username}
              onChange={(e) =>
                setAccount({ ...account, username: e.target.value })
              }
              typeName="admin"
            />
          </div>
          <div>
            <Label name="password">Admin password:</Label>
            <InputField
              type="password"
              value={account.password}
              onChange={(e) =>
                setAccount({ ...account, password: e.target.value })
              }
              typeName="admin"
            />
          </div>

          <Button type="submit" typeName="login">
            LOG IN
          </Button>
        </form>
      </div>
    </div>
  );
}
