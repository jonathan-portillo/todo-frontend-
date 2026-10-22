import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Textfield from "@mui/material/TextField";
import {
  fetchAccount,
  addEmail,
  removeEmail,
} from "../../actions/todoActions";

// Add or remove the address used for password resets.
const EmailSettings = ({ fetchAccount, addEmail, removeEmail }) => {
  const [current, setCurrent] = useState(undefined); // undefined = still loading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAccount().then((r) => setCurrent(r.ok ? r.email : null));
  }, [fetchAccount]);

  const reset = () => {
    setError(null);
    setMessage("");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    reset();
    setSaving(true);
    const result = await addEmail(email.trim(), password);
    setSaving(false);
    if (result.ok) {
      setMessage(result.message);
      setEmail("");
      setPassword("");
    } else {
      setError(result);
    }
  };

  const handleRemove = async () => {
    reset();
    if (!password) {
      return setError({ field: "password", message: "Enter your password to remove it." });
    }
    setSaving(true);
    const result = await removeEmail(password);
    setSaving(false);
    if (result.ok) {
      setCurrent(null);
      setPassword("");
    } else {
      setError(result);
    }
  };

  return (
    <form className="auth-form dash-account-form" onSubmit={handleAdd}>
      <h3>Email</h3>
      <p className="dash-section-note">
        {current === undefined
          ? "Loading..."
          : current
          ? `Password resets go to ${current}.`
          : "No email yet. Add one so you can reset your password if you forget it."}
      </p>
      <Textfield
        label={current ? "New email" : "Email"}
        type="email"
        size="small"
        fullWidth
        autoComplete="email"
        value={email}
        onChange={(e) => {
          reset();
          setEmail(e.target.value);
        }}
        error={error?.field === "email"}
        helperText={error?.field === "email" ? error.message : ""}
      />
      <Textfield
        label="Current password"
        type="password"
        size="small"
        fullWidth
        autoComplete="current-password"
        value={password}
        onChange={(e) => {
          reset();
          setPassword(e.target.value);
        }}
        error={error?.field === "password"}
        helperText={error?.field === "password" ? error.message : ""}
      />
      {error?.field === "form" && (
        <p className="auth-error" role="alert">
          {error.message}
        </p>
      )}
      {message && (
        <p className="dash-success" role="status">
          {message}
        </p>
      )}
      <button
        className="auth-submit"
        type="submit"
        disabled={!email.trim() || !password || saving}
      >
        {saving ? "Saving..." : current ? "Change email" : "Add email"}
      </button>
      {current && (
        <button
          type="button"
          className="dash-link"
          onClick={handleRemove}
          disabled={saving}
        >
          Remove email
        </button>
      )}
    </form>
  );
};

export default connect(null, { fetchAccount, addEmail, removeEmail })(
  EmailSettings
);
