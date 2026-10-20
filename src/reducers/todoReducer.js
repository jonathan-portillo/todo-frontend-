import {
  ADD_NEW_USER,
  ADD_NEW_USER_SUCCESS,
  ADD_NEW_USER_FAIL,
  HANDLE_CHANGE_SIGNUP,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SET_LOGGED_IN,
  LOG_OUT,
  HANDLE_CHANGE_LOGIN,
  NEW_TASK,
  HANDLE_CHANGE_NEW_TASK,
  NEW_TASK_SUCCESS,
  FETCH_TASKS,
  FETCH_TASKS_SUCCESS,
  DELETE_TASK,
  DELETE_TASK_SUCCESS,
  HANDLE_CHANGE_NOTE_DESCRIPTION,
  NEW_NOTE_DESCRIPTION,
  NEW_NOTE_DESCRIPTION_SUCCESS,
  FETCH_NOTES,
  FETCH_NOTES_SUCCESS,
  UPDATE_NOTE,
  UPDATE_NOTE_SUCCESS,
  UPDATE_NOTE_FAIL,
  UPDATE_TASK,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAIL,
  SET_EDIT,
  SET_EDITED_TITLE,
  SET_EDIT_NOTE,
  SET_EDITED_NOTE,
  SET_ENABLE_DELETE,
  ENABLE_DELETE_SUCCESS,
  ENABLE_DELETE_FAIL,
  ENABLE_ANY_TITLE_EDITING,
  DISABLE_ANY_TITLE_EDITING,
  FETCH_TRASH_SUCCESS,
  RESTORE_TASK_SUCCESS,
  DELETE_FOREVER_SUCCESS,
  SET_POSITION,
  FETCH_BOARDS_SUCCESS,
  ADD_BOARD_SUCCESS,
  RENAME_BOARD_SUCCESS,
  DELETE_BOARD_SUCCESS,
  SET_ACTIVE_BOARD,
  MOVE_TASK_SUCCESS,
} from "../actions/todoActions";

const initialState = {
  signUpForm: {
    username: "",
    password: "",
  },
  loginForm: {
    username: "",
    password: "",
  },
  isLoggedIn: false,
  newTask: {
    todo_title: "",
  },
  allTasks: [],
  trashTasks: [],
  boards: [],
  activeBoard: null,
  newNoteDescription: {
    todo_list: "",
  },
  allUserNotes: [],
  editedTitle: "",
  editedNotes: {},
  isEditing: false, //title
  isEditingNote: false, //note
  isAnytitleEditing: false,
  noteEditingState: {}, // Object to track editing state per note
  enableDelete: false, //enable option to delete notes.
};

export const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NEW_USER:
      return state;
    case ADD_NEW_USER_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
      };
    case ADD_NEW_USER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
      };

    case LOGIN:
      return state;
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
      };
    case LOG_OUT:
      return initialState;
    case SET_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: action.payload,
      };

    case NEW_TASK: {
      return {
        ...state,
        newTask: {
          todo_title: "",
        },
      };
    }
    case NEW_TASK_SUCCESS:
      const newTask = { ...action.payload, isEditing: false };
      return {
        ...state,
        allTasks: [...state.allTasks, newTask],
      };

    case FETCH_TASKS:
      return state;

    case FETCH_TASKS_SUCCESS:
      return {
        ...state,
        allTasks: action.payload,
      };

    case SET_EDIT:
      const { taskId, isEditing } = action.payload;
      return {
        ...state,
        isEditing: {
          ...state.isEditing,
          [taskId]: isEditing,
        },
      };
    case SET_EDITED_TITLE:
      return {
        ...state,
        editedTitle: action.payload,
      };
    case SET_EDIT_NOTE:
      const { notesId, isEditingNote } = action.payload;
      return {
        ...state,
        noteEditingState: {
          ...state.noteEditingState,
          [notesId]: isEditingNote,
        },
      };

    case SET_EDITED_NOTE:
      const { setNoteId, note } = action.payload;
      return {
        ...state,
        editedNotes: {
          ...state.editedNotes,
          [setNoteId]: note,
        },
      };
    case DELETE_TASK:
      return state;

    case NEW_NOTE_DESCRIPTION:
      return {
        ...state,
        newNoteDescription: {
          todo_list: "",
        },
      };

    case NEW_NOTE_DESCRIPTION_SUCCESS:
      return {
        ...state,
        allUserNotes: [...state.allUserNotes, action.payload],
      };

    case FETCH_NOTES:
      return state;

    case FETCH_NOTES_SUCCESS:
      const newNotes = action.payload.filter(
        (newNote) => !state.allUserNotes.some((note) => note.id === newNote.id)
      );

      return {
        ...state,
        allUserNotes: [...state.allUserNotes, ...newNotes],
      };
    case FETCH_BOARDS_SUCCESS: {
      const saved = Number(localStorage.getItem("activeBoard"));
      const active = action.payload.some((b) => b.id === saved)
        ? saved
        : action.payload[0]?.id ?? null;
      return { ...state, boards: action.payload, activeBoard: active };
    }
    case ADD_BOARD_SUCCESS:
      return {
        ...state,
        boards: [...state.boards, action.payload],
        activeBoard: action.payload.id,
      };
    case RENAME_BOARD_SUCCESS:
      return {
        ...state,
        boards: state.boards.map((b) =>
          b.id === action.payload.id ? { ...b, name: action.payload.name } : b
        ),
      };
    case DELETE_BOARD_SUCCESS: {
      const boards = state.boards.filter((b) => b.id !== action.payload.id);
      return {
        ...state,
        boards,
        allTasks: state.allTasks.filter((t) => t.board_id !== action.payload.id),
        activeBoard:
          state.activeBoard === action.payload.id
            ? boards[0]?.id ?? null
            : state.activeBoard,
      };
    }
    case MOVE_TASK_SUCCESS:
      return {
        ...state,
        allTasks: state.allTasks.map((t) =>
          t.id === action.payload.id
            ? { ...t, board_id: action.payload.board_id, pos_x: null, pos_y: null }
            : t
        ),
      };
    case SET_ACTIVE_BOARD:
      return { ...state, activeBoard: action.payload };
    case SET_POSITION:
      return {
        ...state,
        allTasks: state.allTasks.map((t) =>
          t.id === action.payload.id
            ? { ...t, pos_x: action.payload.pos_x, pos_y: action.payload.pos_y }
            : t
        ),
      };
    case FETCH_TRASH_SUCCESS:
      return { ...state, trashTasks: action.payload };
    case RESTORE_TASK_SUCCESS:
      return {
        ...state,
        trashTasks: state.trashTasks.filter((t) => t.id !== action.payload.id),
        allTasks: [
          ...state.allTasks.filter((t) => t.id !== action.payload.id),
          action.payload,
        ].sort((a, b) => a.id - b.id),
      };
    case DELETE_FOREVER_SUCCESS:
      return {
        ...state,
        trashTasks: state.trashTasks.filter(
          (t) => t.id !== action.payload.taskId
        ),
      };
    case DELETE_TASK_SUCCESS:
      const deletedTaskId = action.payload.taskId;
      return {
        ...state,
        allTasks: state.allTasks.filter((task) => task.id !== deletedTaskId),
      };

    case HANDLE_CHANGE_SIGNUP:
      return {
        ...state,
        signUpForm: {
          ...state.signUpForm,
          [action.payload.target.name]: action.payload.target.value,
        },
      };

    case HANDLE_CHANGE_LOGIN:
      return {
        ...state,
        loginForm: {
          ...state.loginForm,
          [action.payload.target.name]: action.payload.target.value,
        },
      };

    case HANDLE_CHANGE_NEW_TASK:
      return {
        ...state,
        newTask: {
          ...state.newTask,
          [action.payload.target.name]: action.payload.target.value,
        },
      };

    case HANDLE_CHANGE_NOTE_DESCRIPTION:
      return {
        ...state,
        newNoteDescription: action.payload,
      };
    case UPDATE_NOTE:
      return state;
    case UPDATE_NOTE_SUCCESS:
      const { noteId, updatedNote } = action.payload;
      const updatedAllUserNotes = state.allUserNotes.map((note) =>
        note.id === noteId ? { ...note, todo_list: updatedNote } : note
      );

      return {
        ...state,
        allUserNotes: updatedAllUserNotes,
      };
    case UPDATE_NOTE_FAIL:
      return {
        state,
      };
    case UPDATE_TASK:
      return state;
    case UPDATE_TASK_SUCCESS:
      const { id, updatedTask } = action.payload;
      return {
        ...state,
        allTasks: state.allTasks.map((task) =>
          task.id === id ? { ...task, todo_title: updatedTask } : task
        ),
      };

    case UPDATE_TASK_FAIL:
      return {
        state,
      };
    case SET_ENABLE_DELETE:
      return {
        ...state,
        enableDelete: action.payload,
      };
    case ENABLE_DELETE_SUCCESS:
      return {
        state,
      };
    case ENABLE_DELETE_FAIL:
      return {
        state,
      };
    case ENABLE_ANY_TITLE_EDITING:
      return {
        ...state,
        isAnytitleEditing: true,
      };
    case DISABLE_ANY_TITLE_EDITING:
      return {
        ...state,
        isAnytitleEditing: false,
      };

    default:
      return state;
  }
};
