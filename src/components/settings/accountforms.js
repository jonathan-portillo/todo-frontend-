import React, { useState } from "react";
import { connect } from "react-redux";
import Textfield from "@mui/material/TextField";
import { changeUsername, changePassword } from "../../actions/todoActions";
import EmailSettings from "./emailsettings";

const MIN_PASSWORD = 8;

// Small form with a status line; `onSubmit` returns { ok } or { field, message }.
const AccountForm = ({ title, fields, submitLabel, onSubmit, validate, success }) => {
  const empty = Object.fromEntries(fields.map((f) => [f.name, ""]));
  const [values, setValues] = useState(empty);
  const [error, setError] = useState(null); // { field, message }
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setError(null);
    setDone(false);
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validate?.(values);
    if (problem) return setError(problem);

    setSaving(true);
    const result = await onSubmit(values);
    setSaving(false);

    if (result.ok) {
      setValues(empty);
      setDone(true);
    } else {
      setError(result);
    }
  };

  const ready = fields.every((f) => values[f.name]);

  return (
    <form className="auth-form dash-account-form" onSubmit={handleSubmit}>
      <h3>{title}</h3>
      {fields.map((f) => (
        <Textfield
          key={f.name}
          name={f.name}
          label={f.label}
          type={f.type || "text"}
          autoComplete={f.autoComplete}
          size="small"
          fullWidth
          value={values[f.name]}
          onChange={handleChange}
          error={error?.field === f.name}
          helperText={error?.field === f.name ? error.message : ""}
        />
      ))}
      {error?.field === "form" && (
        <p className="auth-error" role="alert">
          {error.message}
        </p>
      )}
      {done && (
        <p className="dash-success" role="status">
          {success}
        </p>
      )}
      <button className="auth-submit" type="submit" disabled={!ready || saving}>
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

const AccountForms = ({ changeUsername, changePassword }) => (
  <div className="dash-account">
    <AccountForm
      title="Change username"
      submitLabel="Update username"
      success="Username updated."
      fields={[
        { name: "newUsername", label: "New username", autoComplete: "username" },
        {
          name: "password",
          label: "Current password",
          type: "password",
          autoComplete: "current-password",
        },
      ]}
      onSubmit={(v) => changeUsername(v.newUsername.trim(), v.password)}
    />
    <AccountForm
      title="Change password"
      submitLabel="Update password"
      success="Password updated."
      fields={[
        {
          name: "currentPassword",
          label: "Current password",
          type: "password",
          autoComplete: "current-password",
        },
        {
          name: "newPassword",
          label: "New password",
          type: "password",
          autoComplete: "new-password",
        },
        {
          name: "confirm",
          label: "Confirm new password",
          type: "password",
          autoComplete: "new-password",
        },
      ]}
      validate={(v) => {
        if (v.newPassword.length < MIN_PASSWORD) {
          return {
            field: "newPassword",
            message: `Use at least ${MIN_PASSWORD} characters.`,
          };
        }
        if (v.newPassword !== v.confirm) {
          return { field: "confirm", message: "Passwords don't match." };
        }
      }}
      onSubmit={(v) => changePassword(v.currentPassword, v.newPassword)}
    />
    <EmailSettings />
  </div>
);

export default connect(null, { changeUsername, changePassword })(AccountForms);
