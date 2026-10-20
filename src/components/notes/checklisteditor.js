import React, { useRef, useLayoutEffect } from "react";
import { emptyItem, ensureOne } from "../../utils/checklist";

const Item = ({
  item,
  onText,
  onToggle,
  onRemove,
  onBlur,
  onKeyDown,
  inputRef,
  placeholder,
}) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [item.text]);

  return (
    <div className={`dash-item ${item.done ? "done" : ""}`}>
      <input
        type="checkbox"
        className="dash-check"
        checked={item.done}
        onChange={onToggle}
        aria-label="mark complete"
      />
      <textarea
        rows={1}
        ref={(el) => {
          ref.current = el;
          inputRef(el);
        }}
        className="dash-item-text"
        placeholder={placeholder}
        value={item.text}
        onChange={(e) => onText(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
      {item.text !== "" && (
        <button
          type="button"
          className="dash-item-remove"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onRemove}
          aria-label="delete item"
          title="Delete item"
        >
          ×
        </button>
      )}
    </div>
  );
};

const ChecklistEditor = ({ items, onChange, autoFocus }) => {
  const refs = useRef([]);
  const focusIndex = useRef(autoFocus ? 0 : null);

  useLayoutEffect(() => {
    if (focusIndex.current !== null) {
      refs.current[focusIndex.current]?.focus();
      focusIndex.current = null;
    }
  });

  const update = (i, patch) =>
    onChange(
      items.map((item, idx) => (idx === i ? { ...item, ...patch } : item))
    );

  const remove = (i) =>
    onChange(ensureOne(items.filter((_, idx) => idx !== i)));

  const addAfter = (i) => {
    const next = [...items];
    next.splice(i + 1, 0, emptyItem());
    focusIndex.current = i + 1;
    onChange(next);
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!items[i].text.trim()) return;
      const next = items[i + 1];
      if (next && next.text === "") refs.current[i + 1]?.focus();
      else addAfter(i);
    } else if (e.key === "Backspace" && items[i].text === "" && items.length > 1) {
      e.preventDefault();
      focusIndex.current = Math.max(i - 1, 0);
      remove(i);
    }
  };

  return (
    <div className="dash-list">
      {items.map((item, i) => (
        <Item
          key={i}
          item={item}
          placeholder=""
          inputRef={(el) => (refs.current[i] = el)}
          onText={(text) => update(i, { text })}
          onToggle={() => update(i, { done: !item.done })}
          onRemove={() => remove(i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onBlur={() => {
            if (items[i].text === "" && items.length > 1) remove(i);
          }}
        />
      ))}
    </div>
  );
};

export default ChecklistEditor;
