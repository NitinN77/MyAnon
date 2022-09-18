import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import './Register.css'

const Register = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPwd, setRegisterPwd] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const handleRegister = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/user/register", {
        email: registerEmail,
        password: registerPwd,
        username: registerUsername,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        window.location.reload();
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  };

  return (
    <div className="main">
      <form onSubmit={handleRegister} className="form">
        <h1>Register</h1>
        <label>Username </label>
        <input
          type="text"
          value={registerUsername}
          onChange={(e) => setRegisterUsername(e.target.value)}
        />
        <label>Email </label>
        <input
          type="email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
        />
        <label>Password </label>
        <input
          type="password"
          value={registerPwd}
          onChange={(e) => setRegisterPwd(e.target.value)}
        />
        <br /> <br /> <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
