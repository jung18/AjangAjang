import React from "react";
import "./login.css";
import Logo from "../../assets/logos/logo.png"; 
import { LoginButtons } from "./components/LoginButtons";

const Login = () => {
  return (
    <div className="div-wrapper">
      <img className="prj-logo" alt="logo" src={Logo} />
      <LoginButtons />
    </div>
  );
};

export default Login;
