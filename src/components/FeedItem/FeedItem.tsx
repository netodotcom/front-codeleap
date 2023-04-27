import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  AppBar,
  Toolbar,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import store from "../../store/store";
import { IFeedItem } from "./IFeedItem";
import { editPost } from "../../http/requests";

function FeedItem({
  id,
  author,
  title,
  content,
  created_datetime,
  onDelete,
  onEdit,
}: IFeedItem) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);

  const [minutesAgo, setMinutesAgo] = useState(0);
  const [hoursAgo, setHoursAgo] = useState(0);

  useEffect(() => {
    const timestamp = Date.parse(created_datetime);
    const currentTimestamp = new Date().getTime();
    const timeDiff = currentTimestamp - timestamp;
    const minutes = Math.round(timeDiff / (1000 * 60));
    if (minutes >= 60) {
      setHoursAgo(Math.floor(minutes / 60));
      setMinutesAgo(0);
    } else {
      setMinutesAgo(minutes);
      setHoursAgo(0);
    }
  }, [created_datetime]);

  const handleEditDialogOpen = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleDeleteDialogOpen = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteClick = () => {
    handleDeleteDialogOpen();
  };

  const handleEditClick = () => {
    onEdit!(newTitle, newContent);
    editPost(id.toString(), newTitle, newContent);
    handleEditDialogClose();
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewContent(event.target.value);
  };

  return (
    <Card sx={{ maxWidth: 1000, marginTop: "1rem" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {author === sessionStorage.getItem("username") ? (
            <Box display="flex" justifyContent="flex-end">
              <Button
                onClick={handleDeleteClick}
                variant="contained"
                size="small"
                color="primary"
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                  "&.MuiButton-elevation": {
                    boxShadow: "none",
                  },
                }}
              >
                <DeleteIcon />
              </Button>
              <Button
                onClick={handleEditDialogOpen}
                variant="contained"
                size="small"
                color="primary"
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                  "&.MuiButton-elevation": {
                    boxShadow: "none",
                  },
                }}
              >
                <EditIcon />
              </Button>
            </Box>
          ) : null}
        </Toolbar>
      </AppBar>

      <CardContent>
        <div
          className="classHeader"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography color="text.secondary">@{author}</Typography>
          <Typography color="text.secondary">
            {hoursAgo > 0
              ? `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`
              : `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`}
          </Typography>
        </div>
        <div className="fds">
          <Typography sx={{ maxWidth: 600, marginTop: "2rem" }} variant="body2">
            {content}
          </Typography>
        </div>
      </CardContent>

      <CardActions>
        <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose}>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogContent>
            <form onSubmit={handleEditClick}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Title"
                value={newTitle}
                onChange={handleTitleChange}
                sx={{ marginBottom: "1rem" }}
              />
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Content"
                value={newContent}
                onChange={handleContentChange}
                multiline
                minRows={3}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              sx={{
                background: "white",
                color: "black",
                "&:hover": {
                  backgroundColor: "white",
                },
              }}
              onClick={handleEditDialogClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                background: "green",
                color: "white",
                "&:hover": { backgroundColor: "green" },
              }}
              onClick={handleEditClick}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this item?</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleDeleteDialogClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                onDelete!();
                handleDeleteDialogClose();
              }}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </CardActions>
    </Card>
  );
}

export default FeedItem;
