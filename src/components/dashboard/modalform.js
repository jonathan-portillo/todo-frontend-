import React, { useState } from "react";
import Box from "@mui/material/Box";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import { createTheme, ThemeProvider } from "@mui/material";
import NewTask from "../task/newtask";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#DFD7BF",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#3F2305",
    },
  },
});

const ModalForm = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <IconButton color="primary" onClick={handleOpen}>
          <AddCircleIcon
            style={{ fontSize: 50 }}
            aria-label="create a new task"
          />
        </IconButton>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <NewTask handleClose={handleClose} />
          </Box>
        </Modal>
      </ThemeProvider>
    </div>
  );
};

export default ModalForm;
