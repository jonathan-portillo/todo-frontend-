import React from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const AuthLayout = ({ title, subtitle, children }) => {
  const navigate = useNavigate();

  return (
    <div className="auth">
      <header className="auth-header">
        <button className="auth-brand" onClick={() => navigate("/")}>
          Task Note
        </button>
      </header>
      <main className="auth-main">
        <div className="auth-card">
          <h1>{title}</h1>
          <p className="auth-sub">{subtitle}</p>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
