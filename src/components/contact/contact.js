import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Textfield from "@mui/material/TextField";
import ThemeToggle from "../standardcomps/themetoggle";
import "../auth/auth.css";
import "./contact.css";

const EMAIL = "jonport93@gmail.com";
const LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jonathanportillo93/" },
  { label: "GitHub", href: "https://github.com/jonathan-portillo" },
  {
    label: "Source for this app",
    href: "https://github.com/jonathan-portillo/todo-frontend-",
  },
];

const Contact = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // opens the visitor's own email app with the message filled in
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = `Task Note${name.trim() ? ` - message from ${name.trim()}` : ""}`;
    const body = `${message.trim()}${name.trim() ? `\n\n${name.trim()}` : ""}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  // for visitors without an email app set up
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // clipboard blocked: the address is on screen to copy by hand
    }
  };

  return (
    <div className="auth">
      <header className="auth-header">
        <button className="auth-brand" onClick={() => navigate("/")}>
          Task Note
        </button>
        <ThemeToggle />
      </header>
      <main className="auth-main">
        <div className="auth-card contact-card">
          <h1>Contact</h1>
          <p className="auth-sub">
            Feedback, bugs or just saying hi. I'd like to hear it.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <Textfield
              label="Your name (optional)"
              fullWidth
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Textfield
              label="Message"
              fullWidth
              multiline
              minRows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="auth-submit"
              type="submit"
              disabled={!message.trim()}
            >
              Send as email
            </button>
            <p className="contact-note">
              This opens your email app with the message ready to send.
            </p>
          </form>

          <div className="contact-direct">
            <span>{EMAIL}</span>
            <button type="button" onClick={handleCopy}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="contact-links">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
