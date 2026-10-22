import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/privateroute";
import LoggedIn from "./utils/isloggedin";
import Landing from "./components/standardcomps/landing";
import SignUp from "./components/auth/signup";
import About from "./components/standardcomps/about";
import Dashboard from "./components/dashboard/dashboard";
import Settings from "./components/settings/settings";
import LoginPage from "./components/auth/loginpage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/tasknotes"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <LoggedIn>
              <Landing />
            </LoggedIn>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
