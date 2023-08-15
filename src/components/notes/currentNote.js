import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  getNotes,
  updateNotes,
  setEditingNote,
  editNote,
} from "../../actions/todoActions";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";

const CurrentNote = (props) => {
  const {
    id,
    allUserNotes,
    getNotes,
    updateNotes,
    setEditingNote,
    editedNotes,
    editNote,
  } = props;

  useEffect(() => {
    getNotes(id);
  }, [id, getNotes]);

  const filteredNotes = allUserNotes.filter(
    (note) => note.todo_title_id === props.id
  );

  const handleEditClick = (noteId, noteContent) => {
    // Set the initial value of editedNote
    editNote({ setNoteId: noteId, note: noteContent });
    setEditingNote(noteId, true);
  };

  const handleSaveClick = (noteId) => {
    const updatedNote = editedNotes[noteId] || filteredNotes[0]?.todo_list;
    updateNotes(noteId, { todo_list: updatedNote });
    setEditingNote(noteId, false);
  };

  const handleInputChange = (e, noteId) => {
    const updatedNote = e.target.value;
    editNote({ setNoteId: noteId, note: updatedNote }); // Update the local state of editedNote
  };

  return (
    <div>
      {filteredNotes.map((note) => (
        <React.Fragment key={note.id}>
          {props.noteEditingState[note.id] ? (
            <>
              <input
                type="text"
                value={editedNotes[note.id] || ""}
                onChange={(e) => handleInputChange(e, note.id)}
              />
              <IconButton>
                <SaveIcon onClick={() => handleSaveClick(note.id)} />
              </IconButton>
              {/* <button onClick={() => handleSaveClick(note.id)}>Save</button> */}
            </>
          ) : (
            <>
              <div className="notesbox">
                <div className="note">
                  <p>{note.todo_list}</p>
                </div>
                <div className="editbuttonnote">
                  <IconButton>
                    <EditIcon
                      onClick={() => handleEditClick(note.id, note.todo_list)}
                    />
                  </IconButton>
                </div>
              </div>
            </>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    allUserNotes: state.allUserNotes,
    editedNotes: state.editedNotes,
    noteEditingState: state.noteEditingState,
  };
};

export default connect(mapStateToProps, {
  getNotes,
  updateNotes,
  setEditingNote,
  editNote,
})(CurrentNote);
