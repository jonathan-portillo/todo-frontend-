import React, { useState } from "react";
import { connect } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import {
  setActiveBoard,
  createBoard,
  renameBoard,
  deleteBoard,
} from "../../actions/todoActions";

const BoardTabs = ({
  boards,
  activeBoard,
  taskCounts,
  setActiveBoard,
  createBoard,
  renameBoard,
  deleteBoard,
  onSwitch,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  const startRename = (board) => {
    setEditingId(board.id);
    setDraft(board.name);
  };

  const finishRename = (board) => {
    const name = draft.trim();
    if (name && name !== board.name) renameBoard(board.id, name);
    setEditingId(null);
  };

  const handleAdd = async () => {
    const board = await createBoard("New tab");
    if (board) {
      onSwitch();
      startRename(board);
    }
  };

  const handleDelete = (board) => {
    const count = taskCounts[board.id] || 0;
    const detail = count
      ? ` Its ${count} list${count === 1 ? "" : "s"} will move to the Trash.`
      : "";
    if (window.confirm(`Delete the "${board.name}" tab?${detail}`)) {
      deleteBoard(board.id);
    }
  };

  return (
    <nav className="dash-tabs" aria-label="task tabs">
      {boards.map((board) => {
        const active = board.id === activeBoard;
        return (
          <div
            key={board.id}
            data-board-id={board.id}
            className={`dash-tab ${active ? "active" : ""}`}
          >
            {editingId === board.id ? (
              <input
                className="dash-tab-input"
                autoFocus
                onFocus={(e) => e.target.select()}
                maxLength={64}
                value={draft}
                size={Math.max(draft.length, 4)}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => finishRename(board)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.target.blur();
                  if (e.key === "Escape") setEditingId(null);
                }}
              />
            ) : (
              <button
                className="dash-tab-name"
                onClick={() => {
                  setActiveBoard(board.id);
                  onSwitch();
                }}
                onDoubleClick={() => startRename(board)}
              >
                {board.name}
              </button>
            )}
            {active && editingId !== board.id && (
              <span className="dash-tab-tools">
                <button
                  aria-label="rename tab"
                  title="Rename"
                  onClick={() => startRename(board)}
                >
                  <EditIcon style={{ fontSize: 14 }} />
                </button>
                {boards.length > 1 && (
                  <button
                    aria-label="delete tab"
                    title="Delete tab"
                    onClick={() => handleDelete(board)}
                  >
                    <CloseIcon style={{ fontSize: 15 }} />
                  </button>
                )}
              </span>
            )}
          </div>
        );
      })}
      <button className="dash-tab-add" onClick={handleAdd} aria-label="new tab" title="New tab">
        <AddIcon style={{ fontSize: 18 }} />
      </button>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  boards: state.boards,
  activeBoard: state.activeBoard,
  taskCounts: state.allTasks.reduce((acc, t) => {
    acc[t.board_id] = (acc[t.board_id] || 0) + 1;
    return acc;
  }, {}),
});

export default connect(mapStateToProps, {
  setActiveBoard,
  createBoard,
  renameBoard,
  deleteBoard,
})(BoardTabs);
