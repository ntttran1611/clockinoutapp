import { useState } from "react";
import { InputField, Button, Label } from "../components";
import { useNavigate } from "react-router-dom";
import { ErrorModal } from "../components";

const adminAccount = { username: "123456", password: "sweeties" };

export default function AdminLogin() {
  const [account, setAccount] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    if (true) {
      navigate("/admin", { state: {} });
      localStorage.setItem("userRole", "admin");
    } else if (account.username === "" || account.password === "") {
      setLoginError("Username or password required");
      document.getElementById("adminLoginAlert").showModal();
    } else {
      setLoginError("Invalid username or password");
      document.getElementById("adminLoginAlert").showModal();
    }
  }
  return (
    <>
      <ErrorModal heading="Error" content={loginError} id="adminLoginAlert" />
      <div className="flex items-center justify-center h-full">
        <div className="w-4/5 md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/3 flex justify-center animate-fade-in">
          <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <Label name="email">Email Address:</Label>
              <InputField
                type="text"
                value={account.email}
                onChange={(e) =>
                  setAccount({ ...account, email: e.target.value })
                }
                typeName="admin"
              />
            </div>
            <div>
              <Label name="password">Password:</Label>
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
    </>
  );
}
