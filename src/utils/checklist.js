// A checklist is stored in the note text, one item per line:
//   [ ] open item
//   [x] finished item
export const emptyItem = () => ({ done: false, text: "" });

// A list always has at least one line to type on.
export const ensureOne = (items) => (items.length ? items : [emptyItem()]);

export const parseChecklist = (text = "") => {
  const items = text
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const match = line.match(/^\[( |x)\] ?(.*)$/);
      if (match) return { done: match[1] === "x", text: match[2] };
      return { done: false, text: line.replace(/^• /, "") };
    });
  return ensureOne(items);
};

export const serializeChecklist = (items) =>
  items
    .filter((item) => item.text.trim() !== "")
    .map((item) => `[${item.done ? "x" : " "}] ${item.text.trim()}`)
    .join("\n");
