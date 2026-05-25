import { useState } from "react";
import { InputField, Button, Label, ErrorModal } from "../components";
import { useNavigate } from "react-router-dom";
import { auth, getUserRole, signOut } from "../api";
import { useAuth } from "../context";

export default function AdminLogin() {
  const [account, setAccount] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // Add a loading state for the button
  
  async function handleSubmit(e) {
    e.preventDefault();
    if (account.email === "" || account.password === "") {
      setLoginError("Email or password required");
      document.getElementById("adminError").showModal();
      return;
    } else {
      setIsSubmitting(true);
      //Authenticate the account that users type in
      const session = await auth(account);
      if (session) {
        const userRole = await getUserRole(session.user.id);
        if(userRole === "admin"){
          navigate("/admin/clocks", { replace: true });}
        else {
          setLoginError("Your are not authorised to access the admin site")
          document.getElementById("adminError").showModal();
          await signOut();
        }
      } else {
        setLoginError("Invalid account or unverified email");
        document.getElementById("adminError").showModal();
        //throw new Error("Invalid session configuration.");
      }
    }
  }
  
  return (
    <>
      <ErrorModal heading="Error" content={loginError} id="adminError" />
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
