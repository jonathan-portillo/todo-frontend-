import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getBoards } from "../../actions/todoActions";
import AppHeader from "./appheader";
import AppFooter from "./appfooter";
import BoardTabs from "./boardtabs";
import CurrentTasks from "../task/currenttask";
import SideNav from "./sidenav";
import { getUsername } from "../../utils/username";
import "./dashboard.css";

const Dashboard = (props) => {
  const [drafting, setDrafting] = useState(false);
  const username = getUsername();

  // load the tabs first, so lists know which tab they belong to
  useEffect(() => {
    props.getBoards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dash">
      <AppHeader />

      <main className="dash-main">
        <div className="dash-bar">
          <div>
            <h1 className="dash-heading">
              {username ? `Welcome, ${username}` : "Welcome back"}
            </h1>
            <p className="dash-subheading">What should we work on today?</p>
          </div>
          <div className="dash-header-actions">
            <SideNav drafting={drafting} onNew={() => setDrafting(true)} />
          </div>
        </div>
        <BoardTabs onSwitch={() => setDrafting(false)} />
        <div className="dash-divider" aria-hidden="true" />
        <div className="dash-content">
          {props.boardsReady && (
            <CurrentTasks
              drafting={drafting}
              onDraftDone={() => setDrafting(false)}
            />
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  );
};

const mapStateToProps = (state) => ({
  boardsReady: state.activeBoard !== null,
});

export default connect(mapStateToProps, { getBoards })(Dashboard);
