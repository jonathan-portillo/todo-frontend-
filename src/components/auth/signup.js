import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser, handle_change_signup } from "../../actions/todoActions";
import { connect } from "react-redux";
import Textfield from "@mui/material/TextField";
import AuthLayout from "./authlayout";
import * as yup from "yup";

const SignUp = (props) => {
  const [disable, setDisable] = useState(true);
  const [error, setError] = useState(null); // { message, field }
  const [submitting, setSubmitting] = useState(false);

  let navigate = useNavigate();

  const formSchema = yup.object().shape({
    username: yup.string().required("Username is a required field."),
    password: yup.string().required("Password is a required field."),
  });

  useEffect(() => {
    formSchema.isValid(props.signUpForm).then((valid) => {
      setDisable(!valid);
    });
  }, [props.signUpForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await props.createUser(props.signUpForm);
    setSubmitting(false);

    if (result.ok) navigate("/tasknotes");
    else setError(result);
  };

  // clear the message as soon as the user starts fixing it
  const handleChange = (e) => {
    setError(null);
    props.handle_change_signup(e);
  };

  return (
    <AuthLayout title="Create your account" subtitle="Get started in seconds.">
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
          value={props.signUpForm.username}
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
          value={props.signUpForm.password}
          onChange={handleChange}
        />
        <Textfield
          id="email"
          label="Email (optional)"
          fullWidth
          variant="outlined"
          type="email"
          name="email"
          autoComplete="email"
          error={error?.field === "email"}
          helperText={
            error?.field === "email"
              ? error.message
              : "Lets you reset your password if you forget it."
          }
          value={props.signUpForm.email}
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
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p className="auth-switch">
        Already a user? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

const mapStateToProps = (state) => {
  return {
    signUpForm: state.signUpForm,
  };
};

export default connect(mapStateToProps, {
  createUser,
  handle_change_signup,
})(SignUp);
