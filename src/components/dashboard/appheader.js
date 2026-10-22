import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../standardcomps/themetoggle";
import UserMenu from "./usermenu";

// Top bar shared by the board and the settings page.
const AppHeader = () => (
  <header className="dash-header">
    <Link to="/tasknotes" className="dash-brand">
      Task Note
    </Link>
    <div className="dash-header-tools">
      <ThemeToggle />
      <UserMenu />
    </div>
  </header>
);

export default AppHeader;
