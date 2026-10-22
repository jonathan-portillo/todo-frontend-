import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Textfield from "@mui/material/TextField";
import { connect } from "react-redux";
import { handle_change_login, logUserIn } from "../../actions/todoActions";
import AuthLayout from "./authlayout";
import * as yup from "yup";

const Login = (props) => {
  const [disable, setDisable] = useState(true);
  const [error, setError] = useState(null); // { message, field }
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSubmitting(true);
    const result = await props.logUserIn(props.loginForm);
    setSubmitting(false);

    if (result.ok) navigate("/tasknotes");
    else setError(result);
  };

  // clear the message as soon as the user starts fixing it
  const handleChange = (e) => {
    setError(null);
    props.handle_change_login(e);
  };

  const formSchema = yup.object().shape({
    username: yup.string().required("Username is a required field."),
    password: yup.string().required("Password is a required field."),
  });

  useEffect(() => {
    formSchema.isValid(props.loginForm).then((valid) => {
      setDisable(!valid);
    });
  }, [props.loginForm]);

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account.">
      <form className="auth-form" onSubmit={handleSubmit}>
        <Textfield
          id="username"
          label="Username"
          fullWidth
          variant="outlined"
          type="text"
          name="username"
          error={error?.field === "username"}
          helperText={error?.field === "username" ? error.message : ""}
          value={props.loginForm.username}
          onChange={handleChange}
        />
        <Textfield
          id="password"
          label="Password"
          fullWidth
          variant="outlined"
          type="password"
          name="password"
          error={error?.field === "password"}
          helperText={error?.field === "password" ? error.message : ""}
          value={props.loginForm.password}
          onChange={handleChange}
        />
        {error?.field === "form" && (
          <p className="auth-error" role="alert">
            {error.message}
          </p>
        )}
        <button
          className="auth-submit"
          disabled={disable || submitting}
          type="submit"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="auth-switch">
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
      <p className="auth-switch">
        Not a user? <Link to="/signup">Sign up</Link>
      </p>
    </AuthLayout>
  );
};

const mapStateToProps = (state) => {
  return {
    loginForm: state.loginForm,
  };
};

export default connect(mapStateToProps, { logUserIn, handle_change_login })(
  Login
);
