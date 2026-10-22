import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { connect } from "react-redux";
import Textfield from "@mui/material/TextField";
import AuthLayout from "./authlayout";
import { resetPassword } from "../../actions/todoActions";

const MIN_PASSWORD = 8;

const ResetPassword = ({ resetPassword }) => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [done, setDone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < MIN_PASSWORD) {
      return setError({
        field: "newPassword",
        message: `Use at least ${MIN_PASSWORD} characters.`,
      });
    }
    if (password !== confirm) {
      return setError({ field: "confirm", message: "Passwords don't match." });
    }
    setSubmitting(true);
    const result = await resetPassword(token, password);
    setSubmitting(false);
    if (result.ok) setDone(result.message);
    else setError(result);
  };

  if (!token) {
    return (
      <AuthLayout title="Reset your password" subtitle="">
        <p className="auth-error" role="alert">
          This link is missing its code. Use the link from your email, or ask for
          a new one.
        </p>
        <p className="auth-switch">
          <Link to="/forgot-password">Send a new link</Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Choose a new password" subtitle="Pick something you'll remember.">
      {done ? (
        <>
          <p className="dash-success" role="status">
            {done}
          </p>
          <p className="auth-switch">
            <Link to="/login">Sign in</Link>
          </p>
        </>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <Textfield
            label="New password"
            type="password"
            fullWidth
            autoComplete="new-password"
            error={error?.field === "newPassword"}
            helperText={error?.field === "newPassword" ? error.message : ""}
            value={password}
            onChange={(e) => {
              setError(null);
              setPassword(e.target.value);
            }}
          />
          <Textfield
            label="Confirm new password"
            type="password"
            fullWidth
            autoComplete="new-password"
            error={error?.field === "confirm"}
            helperText={error?.field === "confirm" ? error.message : ""}
            value={confirm}
            onChange={(e) => {
              setError(null);
              setConfirm(e.target.value);
            }}
          />
          {error?.field === "form" && (
            <p className="auth-error" role="alert">
              {error.message}{" "}
              <Link to="/forgot-password">Send a new link</Link>
            </p>
          )}
          <button
            className="auth-submit"
            type="submit"
            disabled={!password || !confirm || submitting}
          >
            {submitting ? "Saving..." : "Update password"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default connect(null, { resetPassword })(ResetPassword);
