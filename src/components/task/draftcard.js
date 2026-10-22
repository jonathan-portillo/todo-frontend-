import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ChecklistEditor from "../notes/checklisteditor";
import { emptyItem, serializeChecklist } from "../../utils/checklist";
import { TINTS, saveTint } from "../../utils/tints";
import { createNewTask, createNewNote } from "../../actions/todoActions";

const DraftCard = ({
  createNewTask,
  createNewNote,
  onDone,
  position,
  bounds,
  boardId,
  stacked,
  onSize,
}) => {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([emptyItem()]);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef(null);
  const [pos, setPos] = useState(position); // where the card sits; draggable
  const [dragging, setDragging] = useState(false);
  const start = useRef(null);

  // bring the new card into view
  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(() =>
      onSize(Math.round(cardRef.current.offsetHeight))
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [tint, setTint] = useState(
    () => TINTS[Math.floor(Math.random() * TINTS.length)]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = serializeChecklist(items);
    if ((!title.trim() && !text) || saving) return;
    setSaving(true);

    // the backend requires a title, so untitled lists get a default one
    const created = await createNewTask({
      todo_title: title.trim() || "Untitled",
      pos_x: pos.x,
      pos_y: pos.y,
      board_id: boardId,
    });
    if (created && text) {
      await createNewNote(created.id, { todo_list: text });
    }
    if (created) saveTint(created.id, tint);
    onDone();
  };

  // drag the card by its header or grip, like a saved card
  const handlePointerDown = (e) => {
    if (stacked || e.button !== 0 || !e.target.closest(".dash-card-head")) return;
    if (e.target.closest("button, input, textarea")) return;
    start.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y };
    cardRef.current.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (e) => {
    const s = start.current;
    if (!s) return;
    setPos({
      x: Math.min(Math.max(s.x + e.clientX - s.px, bounds.minX), bounds.maxX),
      y: Math.max(0, s.y + e.clientY - s.py),
    });
  };

  const handlePointerUp = () => {
    start.current = null;
    setDragging(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onDone();
  };

  return (
    <form
      ref={cardRef}
      className={`dash-card dash-card-draft ${dragging ? "dragging" : ""}`}
      style={
        stacked
          ? { "--tint": tint }
          : { "--tint": tint, left: pos.x, top: pos.y }
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
    >
      <div className="dash-card-head">
        <DragIndicatorIcon className="dash-grip" fontSize="small" />
        <input
          className="dash-title-input"
          placeholder="Your task"
          maxLength={128}
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="dash-swatches">
          {TINTS.map((t) => (
            <button
              type="button"
              key={t}
              className={`dash-swatch ${t === tint ? "active" : ""}`}
              style={{ background: t }}
              onClick={() => setTint(t)}
              aria-label="pick card color"
            />
          ))}
        </div>
      </div>
      <div className="dash-card-body">
        <ChecklistEditor items={items} onChange={setItems} />
        <div className="dash-draft-actions">
        <button
          type="button"
          className="dash-btn dash-btn-outline"
          onClick={onDone}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="dash-btn dash-btn-primary"
          disabled={(!title.trim() && !serializeChecklist(items)) || saving}
        >
          Add list
        </button>
        </div>
      </div>
    </form>
  );
};

export default connect(null, { createNewTask, createNewNote })(DraftCard);
