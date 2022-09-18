import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import './Login.css'
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  let navigate = useNavigate();
  const [loginPwd, setLoginPwd] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/user/login", {
        email: loginEmail,
        password: loginPwd,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        window.location.reload()
        navigate('/')
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  };

  return (
    <div className="main">
      <form onSubmit={handleLogin} className="form">
        <h1>Login</h1>
        <label>Email </label>
        <input
          type="email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <label>Password </label>
        <input
          type="password"
          value={loginPwd}
          onChange={(e) => setLoginPwd(e.target.value)}
        />
        <br /> <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
