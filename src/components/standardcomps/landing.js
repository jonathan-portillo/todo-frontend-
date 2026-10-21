import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import ThemeToggle from "./themetoggle";
import "./landing.css";

// Sample cards that look like the ones inside the app. The checkboxes work.
const features = [
  {
    title: "Tasks",
    tint: "#e4defd",
    items: [
      { text: "Plan the week", done: true },
      { text: "Capture what needs doing", done: false },
      { text: "Check it off", done: false },
    ],
  },
  {
    title: "Notes",
    tint: "#d7f0e4",
    items: [
      { text: "Keep thoughts with your work", done: false },
      { text: "Jot an idea down", done: true },
      { text: "Edit anytime", done: false },
    ],
  },
  {
    title: "Focus",
    tint: "#fde6c8",
    items: [
      { text: "A clean, simple space", done: true },
      { text: "Nothing in your way", done: false },
      { text: "Get it done", done: false },
    ],
  },
];

const FeatureCard = ({ title, tint, items }) => {
  const [list, setList] = useState(items);
  const toggle = (i) =>
    setList((l) => l.map((it, idx) => (idx === i ? { ...it, done: !it.done } : it)));

  return (
    <div className="lp-card" style={{ "--tint": tint }}>
      <div className="lp-card-head">{title}</div>
      <div className="lp-card-body">
        {list.map((item, i) => (
          <label className={`lp-item ${item.done ? "done" : ""}`} key={item.text}>
            <input
              type="checkbox"
              className="lp-check"
              checked={item.done}
              onChange={() => toggle(i)}
            />
            <span>{item.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const HEADLINE = ["Empower your ", "productivity"];
const TYPE_MS = 65;

// Types the headline out one letter at a time. Letters that haven't been typed yet are
// laid out but invisible, so every letter lands in its final spot and nothing shifts.
const TypedHeadline = () => {
  const total = HEADLINE.join("").length;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [count, setCount] = useState(reduced ? total : 0);

  useEffect(() => {
    if (count >= total) return;
    const timer = setTimeout(() => setCount((c) => c + 1), TYPE_MS);
    return () => clearTimeout(timer);
  }, [count, total]);

  const done = count >= total;
  let used = 0;
  const parts = HEADLINE.map((text) => {
    const shown = Math.max(0, Math.min(text.length, count - used));
    used += text.length;
    return { shown: text.slice(0, shown), rest: text.slice(shown), text };
  });
  // the caret sits right after the last typed letter
  const caretIn = parts.findIndex((p) => p.rest.length > 0);

  return (
    <h1 className="lp-title" aria-label={HEADLINE.join("")}>
      <span aria-hidden="true">
        {parts.map((p, i) => (
          <span key={i} className={i === 1 ? "lp-accent" : undefined}>
            {p.shown}
            {(caretIn === i || (done && i === parts.length - 1)) && (
              <i className={`lp-caret ${done ? "done" : ""}`} />
            )}
            <span className="lp-untyped">{p.rest}</span>
          </span>
        ))}
      </span>
    </h1>
  );
};

const Landing = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (props.isLoggedIn) {
      navigate("/tasknotes");
    }
  }, [props.isLoggedIn, navigate]);

  return (
    <div className="lp">
      <header className="lp-header">
        <span className="lp-brand">Task Note</span>
        <div className="lp-header-tools">
          <ThemeToggle />
          <button className="lp-link" onClick={() => navigate("/login")}>
            Sign in
          </button>
        </div>
      </header>

      <main className="lp-hero">
        <TypedHeadline />
        <p className="lp-sub">
          Tasks and notes in one simple place. Plan your day and get it done.
        </p>
        <div className="lp-cta">
          <button
            className="lp-btn lp-btn-primary"
            onClick={() => navigate("/signup")}
          >
            Get started
          </button>
          <button
            className="lp-btn lp-btn-outline"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      </main>

      <section className="lp-features">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </section>

      <footer className="lp-footer">
        <a
          href="https://github.com/jonathan-portillo/todo-frontend-"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/jonathanportillo93/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a href="mailto:jonport93@gmail.com">Contact</a>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => ({ isLoggedIn: state.isLoggedIn });

export default connect(mapStateToProps)(Landing);
