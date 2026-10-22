import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { logout } from "../../actions/todoActions";
import { useUsername } from "../../utils/username";

// The username in the header corner, with a small menu under it.
const UserMenu = ({ logout }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const username = useUsername();

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dash-user" ref={ref}>
      <button
        className="dash-user-btn"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <PersonOutlineIcon fontSize="small" />
        <span className="dash-user-name">{username || "Account"}</span>
        <ExpandMoreIcon fontSize="small" />
      </button>
      {open && (
        <div className="dash-menu" role="menu">
          <button role="menuitem" onClick={() => go("/tasknotes")}>
            Your tasks
          </button>
          <button role="menuitem" onClick={() => go("/settings#trash")}>
            Trash
          </button>
          <button role="menuitem" onClick={() => go("/settings")}>
            Settings
          </button>
          <button role="menuitem" className="danger" onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default connect(null, { logout })(UserMenu);
