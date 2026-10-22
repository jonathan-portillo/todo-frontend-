import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Textfield from "@mui/material/TextField";
import AuthLayout from "./authlayout";
import { requestPasswordReset } from "../../actions/todoActions";

const ForgotPassword = ({ requestPasswordReset }) => {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState(null);
  const [sent, setSent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await requestPasswordReset(identifier.trim());
    setSubmitting(false);
    if (result.ok) setSent(result.message);
    else setError(result);
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your username or email and we'll send you a link."
    >
      {sent ? (
        <>
          <p className="dash-success" role="status">
            {sent}
          </p>
          <p className="auth-switch">
            Nothing yet? Check your spam folder. Accounts without a confirmed
            email can't be reset this way.
          </p>
        </>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <Textfield
            label="Username or email"
            fullWidth
            variant="outlined"
            name="identifier"
            autoComplete="username"
            error={error?.field === "identifier"}
            helperText={error?.field === "identifier" ? error.message : ""}
            value={identifier}
            onChange={(e) => {
              setError(null);
              setIdentifier(e.target.value);
            }}
          />
          {error && error.field !== "identifier" && (
            <p className="auth-error" role="alert">
              {error.message}
            </p>
          )}
          <button
            className="auth-submit"
            type="submit"
            disabled={!identifier.trim() || submitting}
          >
            {submitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
      <p className="auth-switch">
        <Link to="/login">Back to sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default connect(null, { requestPasswordReset })(ForgotPassword);
