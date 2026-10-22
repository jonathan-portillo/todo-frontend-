import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppHeader from "../dashboard/appheader";
import AppFooter from "../dashboard/appfooter";
import TrashView from "../task/trashview";
import ThemeToggle from "../standardcomps/themetoggle";
import AccountForms from "./accountforms";
import { useUsername } from "../../utils/username";
import "../dashboard/dashboard.css";

const Settings = () => {
  const { hash } = useLocation();
  const username = useUsername();

  // /settings#trash lands on the trash section
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView();
  }, [hash]);

  return (
    <div className="dash">
      <AppHeader />
      <main className="dash-main">
        <h1 className="dash-heading">Settings</h1>
        <div className="dash-divider" aria-hidden="true" />

        <section className="dash-section" id="account">
          <h2>Account</h2>
          <div className="dash-setting">
            <span>Signed in as</span>
            <strong>{username || "unknown"}</strong>
          </div>
          <div className="dash-setting">
            <span>Theme</span>
            <ThemeToggle />
          </div>
          <AccountForms />
        </section>

        <section className="dash-section" id="trash">
          <h2>Trash</h2>
          <p className="dash-section-note">
            Deleted lists stay here until you remove them for good.
          </p>
          <TrashView />
        </section>
      </main>
      <AppFooter />
    </div>
  );
};

export default Settings;
