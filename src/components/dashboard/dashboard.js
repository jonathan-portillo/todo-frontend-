import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { logout, getBoards } from "../../actions/todoActions";
import ThemeToggle from "../standardcomps/themetoggle";
import BoardTabs from "./boardtabs";
import CurrentTasks from "../task/currenttask";
import TrashView from "../task/trashview";
import SideNav from "./sidenav";
import "./dashboard.css";

const Dashboard = (props) => {
  const navigate = useNavigate();
  const [drafting, setDrafting] = useState(false);
  const [inTrash, setInTrash] = useState(false);

  // load the tabs first, so lists know which tab they belong to
  useEffect(() => {
    props.getBoards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    props.logout();
    navigate("/");
  };

  return (
    <div className="dash">
      <header className="dash-header">
        <span className="dash-brand">Task Note</span>
        <div className="dash-header-tools">
          <ThemeToggle />
          <button className="dash-link" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-bar">
          <h1 className="dash-heading">{inTrash ? "Trash" : "Your tasks"}</h1>
          <div className="dash-header-actions">
            <SideNav
              drafting={drafting}
              onNew={() => setDrafting(true)}
              inTrash={inTrash}
              onToggleTrash={() => {
                setDrafting(false);
                setInTrash(!inTrash);
              }}
            />
          </div>
        </div>
        {!inTrash && (
          <BoardTabs onSwitch={() => setDrafting(false)} />
        )}
        <div className="dash-divider" aria-hidden="true" />
        <div className="dash-content">
          {!props.boardsReady ? null : inTrash ? (
            <TrashView />
          ) : (
            <CurrentTasks
              drafting={drafting}
              onDraftDone={() => setDrafting(false)}
            />
          )}
        </div>
      </main>

      <footer className="dash-footer">
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

const mapStateToProps = (state) => ({
  boardsReady: state.activeBoard !== null,
});

export default connect(mapStateToProps, { logout, getBoards })(Dashboard);
