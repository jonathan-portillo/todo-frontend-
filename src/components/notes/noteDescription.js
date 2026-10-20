import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
  createNewNote,
  updateNotes,
  getNotes,
} from "../../actions/todoActions";
import ChecklistEditor from "./checklisteditor";
import {
  emptyItem,
  parseChecklist,
  serializeChecklist,
} from "../../utils/checklist";

const SAVE_DELAY = 500;

// The checklist for one task card. Saves automatically as you type and check items off.
const NoteDescription = ({
  id,
  allUserNotes,
  getNotes,
  createNewNote,
  updateNotes,
}) => {
  const note = allUserNotes.find((n) => n.todo_title_id === id);
  const [items, setItems] = useState([emptyItem()]);
  const hydrated = useRef(false);
  const dirty = useRef(false);
  const creating = useRef(null);
  const latest = useRef({});
  latest.current = { items, note };

  useEffect(() => {
    getNotes(id);
  }, [id, getNotes]);

  useEffect(() => {
    if (!hydrated.current && note) {
      setItems(parseChecklist(note.todo_list));
      hydrated.current = true;
    }
  }, [note]);

  const persist = async () => {
    dirty.current = false;
    const { items, note } = latest.current;
    const text = serializeChecklist(items);

    if (note) {
      updateNotes(note.id, { todo_list: text });
    } else if (creating.current) {
      // a create is already in flight; update that note once it exists
      const created = await creating.current;
      if (created) updateNotes(created.id, { todo_list: text });
    } else if (text) {
      creating.current = createNewNote(id, { todo_list: text });
      hydrated.current = true;
      await creating.current;
      creating.current = null;
    }
  };

  useEffect(() => {
    if (!dirty.current) return;
    const timer = setTimeout(persist, SAVE_DELAY);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // save anything still pending when the card goes away
  useEffect(
    () => () => {
      if (dirty.current) persist();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleChange = (next) => {
    dirty.current = true;
    setItems(next);
  };

  return <ChecklistEditor items={items} onChange={handleChange} />;
};

const mapStateToProps = (state) => ({
  allUserNotes: state.allUserNotes,
});

export default connect(mapStateToProps, {
  createNewNote,
  updateNotes,
  getNotes,
})(NoteDescription);
