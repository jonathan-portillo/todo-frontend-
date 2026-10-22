import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  getTasks,
  deleteTask,
  restoreTask,
  savePosition,
  moveTask,
  saveSize,
} from "../../actions/todoActions";
import { connect } from "react-redux";
import NoteDescription from "../notes/noteDescription";
import TaskTitle from "./tasktitle";
import DraftCard from "./draftcard";
import { getTint } from "../../utils/tints";
import { useNarrow } from "../../utils/usenarrow";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  CARD_W,
  DEFAULT_H,
  computeLayout,
  findFreeSpot,
} from "../../utils/canvas";

const UNDO_MS = 6000;
const WINDOW_EDGE = 8; // px kept clear at the window edges
const MIN_W = 240;
const MAX_W = 1200;
const MIN_H = 120;
const DRAG_THRESHOLD = 4; // px before a press counts as a drag

// The other tab under the pointer, if any. Dropping a card on a tab moves it there.
const tabUnder = (x, y, currentBoard) => {
  const el = document
    .elementsFromPoint(x, y)
    .map((e) => e.closest(".dash-tab[data-board-id]"))
    .find(Boolean);
  if (!el || Number(el.dataset.boardId) === currentBoard) return null;
  return el;
};

const clearDropTargets = () =>
  document
    .querySelectorAll(".dash-tab.drop-target")
    .forEach((el) => el.classList.remove("drop-target"));

const readOrder = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch (e) {
    return [];
  }
};

const TaskCard = ({
  task,
  x,
  y,
  bounds,
  stacked,
  activeBoard,
  raised,
  onDelete,
  onDrop,
  onMoveToBoard,
  onResize,
  onRaise,
  onSize,
  onReorder,
}) => {
  const key = `collapsed_${task.id}`;
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(key) === "1"
  );
  const [drag, setDrag] = useState(null); // { x, y } while being dragged
  const [resizing, setResizing] = useState(null); // { w, h } while being resized
  const resizeStart = useRef(null);
  const cardRef = useRef(null);
  const start = useRef(null);
  const moved = useRef(false);
  const [lift, setLift] = useState(null); // vertical offset while reordering on a phone
  const liftStart = useRef(null);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(key, next ? "1" : "0");
  };

  useLayoutEffect(() => {
    const el = cardRef.current;
    const observer = new ResizeObserver(() =>
      onSize(task.id, Math.round(el.offsetHeight))
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

  const handlePointerDown = (e) => {
    if (stacked || e.button !== 0) return;
    if (!e.target.closest(".dash-card-head")) return;
    if (e.target.closest("button, input, textarea")) return;
    onRaise(task.id);
    start.current = { px: e.clientX, py: e.clientY, x, y };
    moved.current = false;
    cardRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const s = start.current;
    if (!s) return;
    const dx = e.clientX - s.px;
    const dy = e.clientY - s.py;
    if (!moved.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    moved.current = true;
    clearDropTargets();
    tabUnder(e.clientX, e.clientY, activeBoard)?.classList.add("drop-target");
    setDrag({
      x: Math.min(Math.max(s.x + dx, bounds.minX), bounds.maxX),
      y: Math.max(0, s.y + dy),
    });
  };

  const handlePointerUp = (e) => {
    if (!start.current) return;
    start.current = null;
    clearDropTargets();
    if (moved.current && drag) {
      const tab = tabUnder(e.clientX, e.clientY, activeBoard);
      if (tab) onMoveToBoard(task.id, Number(tab.dataset.boardId));
      else onDrop(task.id, drag.x, drag.y);
    }
    setDrag(null);
  };

  // phone layout: drag the grip up or down to change the order
  const handleLiftDown = (e) => {
    onRaise(task.id);
    liftStart.current = e.pageY;
    e.currentTarget.setPointerCapture(e.pointerId);
    setLift(0);
  };

  const handleLiftMove = (e) => {
    if (liftStart.current == null) return;
    // scroll the page when the finger nears the top or bottom edge
    if (e.clientY < 70) window.scrollBy(0, -12);
    else if (e.clientY > window.innerHeight - 70) window.scrollBy(0, 12);
    setLift(e.pageY - liftStart.current);
  };

  const handleLiftUp = () => {
    if (liftStart.current == null) return;
    liftStart.current = null;
    const rect = cardRef.current.getBoundingClientRect();
    onReorder(task.id, rect.top + rect.height / 2);
    setLift(null);
  };

  // drag the bottom-right corner to resize
  const handleResizeDown = (e) => {
    if (stacked || e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    onRaise(task.id);
    const rect = cardRef.current.getBoundingClientRect();
    resizeStart.current = { px: e.clientX, py: e.clientY, w: rect.width, h: rect.height };
    e.currentTarget.setPointerCapture(e.pointerId);
    setResizing({ w: rect.width, h: rect.height });
  };

  const handleResizeMove = (e) => {
    const s = resizeStart.current;
    if (!s) return;
    // keep the card inside the window on the right
    const maxW = Math.min(MAX_W, bounds.maxX + CARD_W - (drag ? drag.x : x));
    setResizing({
      w: Math.min(Math.max(s.w + e.clientX - s.px, MIN_W), Math.max(MIN_W, maxW)),
      h: Math.max(s.h + e.clientY - s.py, MIN_H),
    });
  };

  const handleResizeUp = () => {
    if (!resizeStart.current) return;
    resizeStart.current = null;
    if (resizing) onResize(task.id, resizing.w, resizing.h);
    setResizing(null);
  };

  // a drag that started on the title shouldn't also expand/collapse it
  const handleClickCapture = (e) => {
    if (moved.current) {
      e.preventDefault();
      e.stopPropagation();
      moved.current = false;
    }
  };

  return (
    <div
      ref={cardRef}
      data-task-id={task.id}
      className={`dash-card ${collapsed ? "collapsed" : ""} ${
        drag || lift !== null ? "dragging" : ""
      }`}
      style={
        stacked
          ? {
              "--tint": getTint(task.id),
              transform: lift !== null ? `translateY(${lift}px)` : undefined,
            }
          : {
              "--tint": getTint(task.id),
              left: drag ? drag.x : x,
              top: drag ? drag.y : y,
              zIndex: raised ? 5 : undefined,
              width: resizing ? resizing.w : task.width || undefined,
              minHeight: collapsed
                ? undefined
                : resizing
                ? resizing.h
                : task.height || undefined,
            }
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClickCapture={handleClickCapture}
    >
      <TaskTitle
        task={task}
        id={task.id}
        collapsed={collapsed}
        onDelete={onDelete}
        onToggleCollapse={toggle}
        grip={
          stacked ? (
            <span
              className="dash-reorder"
              role="button"
              aria-label="drag to reorder"
              onPointerDown={handleLiftDown}
              onPointerMove={handleLiftMove}
              onPointerUp={handleLiftUp}
              onPointerCancel={handleLiftUp}
            >
              <DragIndicatorIcon fontSize="small" />
            </span>
          ) : null
        }
      />
      {!collapsed && (
        <div className="dash-card-body">
          <NoteDescription id={task.id} title={task.todo_title} />
        </div>
      )}
      {!collapsed && !stacked && (
        <div
          className="dash-resize"
          title="Drag to resize"
          onPointerDown={handleResizeDown}
          onPointerMove={handleResizeMove}
          onPointerUp={handleResizeUp}
          onPointerCancel={handleResizeUp}
        />
      )}
    </div>
  );
};

const CurrentTasks = (props) => {
  const { deleteTask, restoreTask, savePosition, moveTask, saveSize, activeBoard } =
    props;
  // only the lists on the current tab
  const allTasks = props.allTasks.filter(
    (t) => (t.board_id ?? props.firstBoard) === activeBoard
  );
  const stacked = useNarrow();
  const [lastDeleted, setLastDeleted] = useState(null);
  const [sizes, setSizes] = useState({});
  const [canvasW, setCanvasW] = useState(0);
  const [bounds, setBounds] = useState({ minX: 0, maxX: 0 });
  const [draftPos, setDraftPos] = useState(null);
  const [raisedId, setRaisedId] = useState(null); // last card touched stays on top
  const orderKey = `order_board_${activeBoard}`;
  const [savedOrder, setSavedOrder] = useState(() => readOrder(orderKey));
  useEffect(() => setSavedOrder(readOrder(orderKey)), [orderKey]);
  const timer = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    props.getTasks();
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const el = canvasRef.current;
    const update = () => {
      setCanvasW(el.clientWidth);
      // cards may go anywhere inside the window, not only inside the dashboard column
      const left = el.getBoundingClientRect().left;
      const viewW = document.documentElement.clientWidth;
      setBounds({
        minX: Math.round(WINDOW_EDGE - left),
        maxX: Math.round(viewW - left - CARD_W - WINDOW_EDGE),
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const handleSize = useCallback((id, h) => {
    setSizes((prev) => (prev[id] === h ? prev : { ...prev, [id]: h }));
  }, []);

  const layout = computeLayout(allTasks, sizes, canvasW, bounds);
  // on a phone the cards stack in the order they read on the desktop board,
  // unless the user has reordered them (that order is kept on this device)
  const readingOrder = [...allTasks].sort(
    (a, b) => layout[a.id].y - layout[b.id].y || layout[a.id].x - layout[b.id].x
  );
  const rank = (t) => {
    const i = savedOrder.indexOf(t.id);
    return i === -1 ? Infinity : i;
  };
  const ordered = stacked
    ? [...readingOrder].sort((a, b) => rank(a) - rank(b)) // stable: new cards keep their place at the end
    : allTasks;

  const handleReorder = (id, centerY) => {
    const others = ordered.filter((t) => t.id !== id);
    const above = others.filter((t) => {
      const el = document.querySelector(`[data-task-id="${t.id}"]`);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2 < centerY;
    }).length;
    const moving = ordered.find((t) => t.id === id);
    others.splice(above, 0, moving);
    const next = others.map((t) => t.id);
    setSavedOrder(next);
    try {
      localStorage.setItem(orderKey, JSON.stringify(next));
    } catch (e) {
      // storage unavailable: the order just lasts for this visit
    }
  };

  // when a new card is started, put it in the first free spot
  const layoutRef = useRef();
  layoutRef.current = { layout, allTasks, sizes, canvasW };
  useEffect(() => {
    if (!props.drafting) {
      setDraftPos(null);
      return;
    }
    const { layout, allTasks, sizes, canvasW } = layoutRef.current;
    const rects = allTasks.map((t) => ({
      ...layout[t.id],
      w: CARD_W,
      h: sizes[t.id] || DEFAULT_H,
    }));
    setDraftPos(findFreeSpot(rects, DEFAULT_H, canvasW));
  }, [props.drafting]);

  // deleting moves the list to the trash; the toast offers a quick undo
  const handleDelete = (task) => {
    clearTimeout(timer.current);
    deleteTask(task.id);
    setLastDeleted(task);
    timer.current = setTimeout(() => setLastDeleted(null), UNDO_MS);
  };

  const handleUndo = () => {
    clearTimeout(timer.current);
    restoreTask(lastDeleted.id);
    setLastDeleted(null);
  };

  const handleDrop = (id, x, y) => {
    // the first time a card is moved, lock in where the others are too
    allTasks.forEach((t) => {
      if (t.id !== id && !layout[t.id].pinned) {
        savePosition(t.id, layout[t.id].x, layout[t.id].y);
      }
    });
    savePosition(id, x, y);
  };

  const bottom = Math.max(
    0,
    ...allTasks.map((t) => layout[t.id].y + (sizes[t.id] || DEFAULT_H)),
    draftPos ? draftPos.y + (sizes.draft || DEFAULT_H) : 0
  );

  return (
    <>
      {allTasks.length === 0 && !props.drafting && (
        <p className="dash-empty">No tasks yet. Add your first one!</p>
      )}
      <div
        className={`dash-canvas ${stacked ? "stacked" : ""}`}
        ref={canvasRef}
        style={stacked ? undefined : { height: bottom + 40 }}
      >
        {props.drafting && stacked && (
          <DraftCard
            onDone={props.onDraftDone}
            position={{ x: 0, y: 0 }}
            bounds={bounds}
            stacked
            boardId={activeBoard}
            onSize={(h) => handleSize("draft", h)}
          />
        )}
        {ordered.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            x={layout[task.id].x}
            y={layout[task.id].y}
            bounds={bounds}
            stacked={stacked}
            activeBoard={activeBoard}
            onMoveToBoard={moveTask}
            onResize={saveSize}
            onDelete={handleDelete}
            onDrop={handleDrop}
            raised={raisedId === task.id}
            onRaise={setRaisedId}
            onSize={handleSize}
            onReorder={handleReorder}
          />
        ))}
        {props.drafting && !stacked && draftPos && (
          <DraftCard
            onDone={props.onDraftDone}
            position={draftPos}
            bounds={bounds}
            boardId={activeBoard}
            onSize={(h) => handleSize("draft", h)}
          />
        )}
      </div>
      {lastDeleted && (
        <div className="dash-toast" role="status">
          <span>Moved to trash</span>
          <button onClick={handleUndo}>Undo</button>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    allTasks: state.allTasks,
    activeBoard: state.activeBoard,
    firstBoard: state.boards[0]?.id,
  };
};

export default connect(mapStateToProps, {
  getTasks,
  deleteTask,
  restoreTask,
  savePosition,
  moveTask,
  saveSize,
})(CurrentTasks);
