"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { uname, password as pwd, modelname } from "../manageaccountadmin/user.json";
 
import "../Styles/LoginPage.css";
import useAppStore from "../store/useStore"; // Zustand store

export const Login = () => {
  const router = useRouter();
  const setLogin = useAppStore((state) => state.setLogin); // ✅ pull setLogin from store

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const goToDashBoard = () => {
    router.push("/manageaccountadmin/dashboard");
  };

  const submitLogin = (e) => {
    e.preventDefault();

    

    if (username === uname && password === pwd) {
      // ✅ Update Zustand store before navigation
      setLogin(modelname);
      goToDashBoard();
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className=" login-container">
      <div className="login-box">
        <h1 className="login-title">
          WORKSPACE LOGIN
        </h1>
        <h2 className="login-Subtitle">Login</h2>
        <form style={{ width: "300px" }} onSubmit={submitLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
