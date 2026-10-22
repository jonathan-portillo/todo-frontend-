import { axiosWithAuth } from "../utils/axiosWithAuth";
import { notifyAuthChange } from "../utils/username";

export const ADD_NEW_USER = "ADD_NEW_USER";
export const ADD_NEW_USER_SUCCESS = "ADD_NEW_USER_SUCCESS";
export const ADD_NEW_USER_FAIL = "ADD_NEW_USER_FAIL";

export const HANDLE_CHANGE_SIGNUP = "HANDLE_CHANGE_SIGNUP";
export const HANDLE_CHANGE_LOGIN = "HANDLE_CHANGE_LOGIN";
export const HANDLE_CHANGE_NEW_TASK = "HANDLE_CHANGE_NEW_TASK";
export const HANDLE_CHANGE_NOTE_DESCRIPTION = "HANDLE_CHANGE_NOTE_DESCRIPTION";

export const SET_LOGGED_IN = "SET_LOGGED_IN";

export const LOGIN = "LOGIN";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";

export const LOG_OUT = "LOG_OUT";

export const NEW_TASK = "NEW_TASK";
export const NEW_TASK_SUCCESS = "NEW_TASK_SUCCESS";
export const NEW_TASK_FAIL = "NEW_TASK_FAIL";

export const NEW_NOTE_DESCRIPTION = "NEW_NOTE_DESCRIPTION";
export const NEW_NOTE_DESCRIPTION_SUCCESS = "NEW_NOTE_DESCRIPTION_SUCCESS";
export const NEW_NOTE_DESCRIPTION_FAIL = "NEW_NOTE_DESCRIPTION_FAIL";

export const DELETE_TASK = "DELETE_TASK";
export const DELETE_TASK_SUCCESS = "DELETE_TASK_SUCCESS";
export const DELETE_TASK_FAIL = "DELETE_TASK_FAIL";

export const FETCH_TRASH_SUCCESS = "FETCH_TRASH_SUCCESS";
export const RESTORE_TASK_SUCCESS = "RESTORE_TASK_SUCCESS";
export const DELETE_FOREVER_SUCCESS = "DELETE_FOREVER_SUCCESS";

export const SET_POSITION = "SET_POSITION";

export const FETCH_BOARDS_SUCCESS = "FETCH_BOARDS_SUCCESS";
export const ADD_BOARD_SUCCESS = "ADD_BOARD_SUCCESS";
export const RENAME_BOARD_SUCCESS = "RENAME_BOARD_SUCCESS";
export const DELETE_BOARD_SUCCESS = "DELETE_BOARD_SUCCESS";
export const SET_ACTIVE_BOARD = "SET_ACTIVE_BOARD";
export const MOVE_TASK_SUCCESS = "MOVE_TASK_SUCCESS";
export const SET_SIZE = "SET_SIZE";

export const FETCH_TASKS = "FETCH_TASKS";
export const FETCH_TASKS_SUCCESS = "FETCH_TASKS_SUCCESS";
export const FETCH_TASKS_FAIL = "FETCH_TASKS_FAIL";

export const FETCH_NOTES = "FETCH_NOTES";
export const FETCH_NOTES_SUCCESS = "FETCH_NOTES_SUCCESS";
export const FETCH_NOTES_FAIL = "FETCH_NOTES_FAIL";

export const UPDATE_TASK = "UPDATE_TASK";
export const UPDATE_TASK_SUCCESS = "UPDATE_TASK_SUCCESS";
export const UPDATE_TASK_FAIL = "UPDATE_TASK_FAIL";

export const UPDATE_NOTE = "UPDATE_NOTE";
export const UPDATE_NOTE_SUCCESS = "UPDATE_NOTE_SUCCESS";
export const UPDATE_NOTE_FAIL = "UPDATE_NOTE_FAUL";

export const SET_EDIT = "SET_EDIT";
export const SET_EDITED_TITLE = "SET_EDITED_TITLE";

export const SET_EDIT_NOTE = "SET_EDIT_NOTE";
export const SET_EDITED_NOTE = "SET_EDITED_NOTE";

export const SET_ENABLE_DELETE = "SET_ENABLE_DELETE";
export const ENABLE_DELETE_SUCCESS = "ENABLE_DELETE_SUCCESS";
export const ENABLE_DELETE_FAIL = "ENABLE_DELETE_FAIL";

export const ENABLE_ANY_TITLE_EDITING = "ENABLE_ANY_TITLE_EDITING";
export const DISABLE_ANY_TITLE_EDITING = "DISABLE_ANY_TITLE_EDITING";

// Turn a failed auth request into { ok: false, message, field } for the forms.
const authError = (err, fallback) => {
  if (!err.response) {
    return {
      ok: false,
      field: "form",
      message: "Can't reach the server. Please try again in a moment.",
    };
  }
  const data = err.response.data || {};
  return { ok: false, field: data.field || "form", message: data.message || fallback };
};

//SIGN UP
export const createUser = (newUser) => (dispatch) => {
  dispatch({ type: ADD_NEW_USER });
  return axiosWithAuth()
    .post("/auth/register", newUser)
    .then((res) => {
      dispatch({
        type: ADD_NEW_USER_SUCCESS,
        payload: res.data,
      });
      localStorage.setItem("id", res.data.id);
      localStorage.setItem("token", res.data.token);
      return { ok: true };
    })
    .catch((err) => {
      const error = authError(err, "Sign up failed. Please try again.");
      dispatch({ type: ADD_NEW_USER_FAIL, payload: error.message });
      return error;
    });
};

//LOGIN
export const logUserIn = (cred) => (dispatch) => {
  dispatch({ type: LOGIN });
  return axiosWithAuth()
    .post("/auth/login", cred)
    .then((res) => {
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.id);
      return { ok: true };
    })
    .catch((err) => {
      const error = authError(err, "Sign in failed. Please try again.");
      dispatch({ type: LOGIN_FAIL, payload: error.message });
      return error;
    });
};

//ACCOUNT SETTINGS

export const changeUsername = (newUsername, password) => () =>
  axiosWithAuth()
    .put("/auth/username", { newUsername, password })
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      notifyAuthChange();
      return { ok: true };
    })
    .catch((err) => authError(err, "Couldn't change your username."));

export const changePassword = (currentPassword, newPassword) => () =>
  axiosWithAuth()
    .put("/auth/password", { currentPassword, newPassword })
    .then(() => ({ ok: true }))
    .catch((err) => authError(err, "Couldn't change your password."));

//EMAIL + PASSWORD RESET

export const requestPasswordReset = (identifier) => () =>
  axiosWithAuth()
    .post("/auth/forgot-password", { identifier })
    .then((res) => ({ ok: true, message: res.data.message }))
    .catch((err) => authError(err, "Couldn't send the reset link."));

export const resetPassword = (token, newPassword) => () =>
  axiosWithAuth()
    .post("/auth/reset-password", { token, newPassword })
    .then((res) => ({ ok: true, message: res.data.message }))
    .catch((err) => authError(err, "Couldn't reset your password."));

export const verifyEmail = (token) => () =>
  axiosWithAuth()
    .post("/auth/verify-email", { token })
    .then((res) => ({ ok: true, email: res.data.email }))
    .catch((err) => authError(err, "Couldn't confirm your email."));

export const fetchAccount = () => () =>
  axiosWithAuth()
    .get("/auth/me")
    .then((res) => ({ ok: true, ...res.data }))
    .catch((err) => authError(err, "Couldn't load your account."));

export const addEmail = (email, password) => () =>
  axiosWithAuth()
    .put("/auth/email", { email, password })
    .then((res) => ({ ok: true, message: res.data.message }))
    .catch((err) => authError(err, "Couldn't add that email."));

export const removeEmail = (password) => () =>
  axiosWithAuth()
    .delete("/auth/email", { data: { password } })
    .then(() => ({ ok: true }))
    .catch((err) => authError(err, "Couldn't remove your email."));

//APP CHECKS IF LOGGED IN EVEN ON REFRESH

export const setLoggedIn = (isLoggedIn) => {
  return {
    type: SET_LOGGED_IN,
    payload: isLoggedIn,
  };
};

//LOGOUT
export const logout = () => (dispatch) => {
  dispatch({ type: LOG_OUT });
  localStorage.removeItem("token");
  localStorage.removeItem("id");
};

//Create a new task

export const createNewTask = (task) => (dispatch) => {
  dispatch({ type: NEW_TASK });
  return axiosWithAuth()
    .post(`/title/user/${localStorage.getItem("id")}`, task)
    .then((res) => {
      dispatch({
        type: NEW_TASK_SUCCESS,
        payload: { ...res.data },
      });
      return res.data;
    })
    .catch((err) => {
      dispatch({
        type: NEW_TASK_FAIL,
        payload: "Not sending title please help please",
      });
    });
};

//BOARDS (the tabs)
export const getBoards = () => (dispatch) => {
  return axiosWithAuth()
    .get(`/boards/user/${localStorage.getItem("id")}`)
    .then((res) => {
      dispatch({ type: FETCH_BOARDS_SUCCESS, payload: res.data });
    })
    .catch(() => {});
};

export const setActiveBoard = (id) => {
  localStorage.setItem("activeBoard", String(id));
  return { type: SET_ACTIVE_BOARD, payload: id };
};

export const createBoard = (name) => (dispatch) => {
  return axiosWithAuth()
    .post(`/boards/user/${localStorage.getItem("id")}`, { name })
    .then((res) => {
      dispatch({ type: ADD_BOARD_SUCCESS, payload: res.data });
      localStorage.setItem("activeBoard", String(res.data.id));
      return res.data;
    })
    .catch(() => {});
};

export const renameBoard = (id, name) => (dispatch) => {
  dispatch({ type: RENAME_BOARD_SUCCESS, payload: { id, name } });
  return axiosWithAuth()
    .put(`/boards/${id}`, { name })
    .catch(() => {});
};

export const deleteBoard = (id) => (dispatch) => {
  return axiosWithAuth()
    .delete(`/boards/${id}`)
    .then(() => {
      dispatch({ type: DELETE_BOARD_SUCCESS, payload: { id } });
    })
    .catch(() => {});
};

//SAVE HOW BIG A CARD IS
export const saveSize = (id, width, height) => (dispatch) => {
  const w = Math.round(width);
  const h = Math.round(height);
  dispatch({ type: SET_SIZE, payload: { id, width: w, height: h } });
  return axiosWithAuth()
    .put(`/title/${id}/size`, { width: w, height: h })
    .catch(() => {});
};

//MOVE A LIST TO ANOTHER TAB
export const moveTask = (id, boardId) => (dispatch) => {
  dispatch({ type: MOVE_TASK_SUCCESS, payload: { id, board_id: boardId } });
  return axiosWithAuth()
    .put(`/title/${id}/board`, { board_id: boardId })
    .catch(() => {});
};

//SAVE WHERE A CARD SITS ON THE CANVAS
export const savePosition = (id, x, y) => (dispatch) => {
  const pos_x = Math.round(x);
  const pos_y = Math.max(0, Math.round(y));
  dispatch({ type: SET_POSITION, payload: { id, pos_x, pos_y } });
  return axiosWithAuth()
    .put(`/title/${id}/position`, { pos_x, pos_y })
    .catch(() => {});
};

//UPDATE TASK TITLE w/ TASK TITLE ID

export const updateTask = (id, task) => (dispatch) => {
  dispatch({ type: UPDATE_TASK });
  axiosWithAuth()
    .put(`/title/${id}`, task)
    .then((res) => {
      dispatch({
        type: UPDATE_TASK_SUCCESS,
        payload: { id, updatedTask: task.todo_title }, // Send the updated task title
      });
    })
    .catch((err) => {
      dispatch({
        type: UPDATE_TASK_FAIL,
        payload: "Well you're stuck with the title you made, try again",
      });
    });
};

//DELETE A TASK (moves it to the trash)

export const deleteTask = (titleId) => (dispatch) => {
  dispatch({ type: DELETE_TASK });
  return axiosWithAuth()
    .delete(`/title/${titleId}`)
    .then((res) => {
      dispatch({ type: DELETE_TASK_SUCCESS, payload: { taskId: titleId } });
    })
    .catch((err) => {
      dispatch({ type: DELETE_TASK_FAIL, payload: err.response.data });
    });
};

//GET THE TRASHED TASKS
export const getTrash = () => (dispatch) => {
  return axiosWithAuth()
    .get(`title/user/${localStorage.getItem("id")}/trash`)
    .then((res) => {
      dispatch({ type: FETCH_TRASH_SUCCESS, payload: res.data });
    })
    .catch(() => {});
};

//RESTORE A TASK FROM THE TRASH
export const restoreTask = (titleId) => (dispatch) => {
  return axiosWithAuth()
    .put(`/title/${titleId}/restore`)
    .then((res) => {
      dispatch({ type: RESTORE_TASK_SUCCESS, payload: res.data });
    })
    .catch(() => {});
};

//DELETE A TASK FOREVER
export const deleteForever = (titleId) => (dispatch) => {
  return axiosWithAuth()
    .delete(`/title/${titleId}/permanent`)
    .then(() => {
      dispatch({ type: DELETE_FOREVER_SUCCESS, payload: { taskId: titleId } });
    })
    .catch(() => {});
};

//GET A LIST OF USER TASKS
export const getTasks = (task) => (dispatch) => {
  dispatch({ type: FETCH_TASKS });
  axiosWithAuth()
    .get(`title/user/${localStorage.getItem("id")}`, task)
    .then((res) => {
      dispatch({ type: FETCH_TASKS_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      dispatch({
        type: FETCH_TASKS_FAIL,
        payload: "Why cant we seeeeeeeeeee our stuffffffffff",
      });
    });
};

//CREATE A NOTE ATTACHED TO TASK
export const createNewNote = (id, notes) => (dispatch) => {
  dispatch({ type: NEW_NOTE_DESCRIPTION });
  return axiosWithAuth()
    .post(`/todoList/${id}/title`, notes)
    .then((res) => {
      dispatch({
        type: NEW_NOTE_DESCRIPTION_SUCCESS,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      dispatch({
        type: NEW_NOTE_DESCRIPTION_FAIL,
        payload: "Couldnt create the note try again",
      });
    });
};

//UPDATE NOTE USING NOTE_ID

export const updateNotes = (id, notes) => (dispatch) => {
  dispatch({ type: UPDATE_NOTE });
  axiosWithAuth()
    .put(`/todoList/${id}`, notes)
    .then((res) => {
      dispatch({
        type: UPDATE_NOTE_SUCCESS,
        payload: { noteId: id, updatedNote: notes.todo_list },
      });
    })
    .catch((err) => {
      dispatch({
        type: UPDATE_NOTE_FAIL,
        payload:
          "Couldn't update note, you did something wrong, get it together",
      });
    });
};

//RETIEVE THE NOTES FROM THE TASK
export const getNotes = (id, notes) => (dispatch) => {
  dispatch({ type: FETCH_NOTES });
  axiosWithAuth()
    .get(`/todoList/${id}/title`, notes)
    .then((res) => {
      dispatch({ type: FETCH_NOTES_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      dispatch({
        type: FETCH_NOTES_FAIL,
        payload: "OOOOOOOOOOOFFFF",
      });
    });
};

//TO SHOW THAT OUR COMPONENT IS BEING EDITED,
export const setEditing = (taskId, isEditing) => {
  return {
    type: SET_EDIT,
    payload: { taskId, isEditing },
  };
};

//TO EDIT OUR TITLE
export const editTitle = (title) => {
  return {
    type: SET_EDITED_TITLE,
    payload: title,
  };
};

//TO SHOW THAT OUR COMPONENT IS BEING EDITED
export const setEditingNote = (notesId, isEditingNote) => {
  return {
    type: SET_EDIT_NOTE,
    payload: { notesId, isEditingNote },
  };
};

//EDIT OUR NOTE
export const editNote = ({ setNoteId, note }) => {
  return {
    type: SET_EDITED_NOTE,
    payload: { setNoteId, note }, // Use setNoteId instead of id
  };
};

//EDIT NOTE?

export const editNoteDescription = (editedNote) => {
  return {
    type: HANDLE_CHANGE_NOTE_DESCRIPTION,
    payload: editedNote,
  };
};

//CHECK IF A TITLE IS BEING EDITED
export const enableAnyTitleEditing = () => {
  return {
    type: ENABLE_ANY_TITLE_EDITING,
  };
};

export const disableAnyTitleEditing = () => {
  return {
    type: DISABLE_ANY_TITLE_EDITING,
  };
};

//ENABLE DELETE
export const setEnableDelete = (isEnabled) => ({
  type: SET_ENABLE_DELETE,
  payload: isEnabled,
});

//OUR HANDLE_CHANGES
export const handle_change_login = (e) => (dispatch) => {
  dispatch({ type: HANDLE_CHANGE_LOGIN, payload: e });
};

export const handle_change_signup = (e) => (dispatch) => {
  dispatch({ type: HANDLE_CHANGE_SIGNUP, payload: e });
};

export const handle_change_newtask = (e) => (dispatch) => {
  dispatch({ type: HANDLE_CHANGE_NEW_TASK, payload: e });
};

export const handle_change_note_description = (e) => (dispatch) => {
  dispatch({ type: HANDLE_CHANGE_NOTE_DESCRIPTION, payload: e });
};
