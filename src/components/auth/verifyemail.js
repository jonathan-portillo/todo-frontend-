import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { connect } from "react-redux";
import AuthLayout from "./authlayout";
import { verifyEmail } from "../../actions/todoActions";

// The link in the confirmation email lands here and confirms the address.
const VerifyEmail = ({ verifyEmail }) => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [result, setResult] = useState(null);
  const started = useRef(false); // the link can only be used once, so only try once

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!token) return setResult({ ok: false, message: "This link is missing its code." });
    verifyEmail(token).then(setResult);
  }, [token, verifyEmail]);

  return (
    <AuthLayout title="Confirm your email" subtitle="">
      {!result && <p className="auth-sub">Confirming...</p>}
      {result?.ok && (
        <p className="dash-success" role="status">
          {result.email} is confirmed. You can now use it to reset your password.
        </p>
      )}
      {result && !result.ok && (
        <p className="auth-error" role="alert">
          {result.message}
        </p>
      )}
      <p className="auth-switch">
        <Link to="/tasknotes">Go to Task Note</Link>
      </p>
    </AuthLayout>
  );
};

export default connect(null, { verifyEmail })(VerifyEmail);
