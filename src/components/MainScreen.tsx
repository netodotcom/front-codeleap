import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import FeedItem from "./FeedItem/FeedItem";
import { fetchFeedItems, postFeedItem, isTokenValid } from "../http/requests";

interface FeedItem {
  id: number;
  username: string;
  created_datetime: Date | string;
  title: string;
  content: string;
}

interface IUser {
  id: number;
  username: string;
  token: string;
}

function MainScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    async function get() {
      const newFeedItems = await fetchFeedItems(
        (currentPage - 1) * ITEMS_PER_PAGE
      );
      setFeedItems(newFeedItems.reverse());
    }
    get();

    const t = sessionStorage.getItem("token");
    if (t && user === null) {
      isTokenValid(t).then((response: any) => {
        const id = parseInt(sessionStorage.getItem("id")!);
        const username = sessionStorage.getItem("username")!;
        setUser({
          id,
          username,
          token: t,
        });
        setAuthenticated(response);
      });
    }
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };
  async function handleSubmit() {
    await postFeedItem(user!.username, title, content);
    const response = await fetchFeedItems();
    setFeedItems(response.reverse());
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    user && user!.username ? handleSubmit() : navigate("/");
  };

  const handleDelete = (index: number) => {
    const newFeedItems = [...feedItems];
    newFeedItems.splice(index, 1);
    setFeedItems(newFeedItems);
  };

  const handleEdit = (
    index: number,
    newTitle: string,
    newContent: string
  ): void => {
    const updatedFeedItems = [...feedItems];
    updatedFeedItems[index] = {
      ...feedItems[index],
      title: newTitle,
      content: newContent,
    };
    setFeedItems(updatedFeedItems);
  };

  const isFormValid = () => {
    return title === "" || content === "";
  };

  return (
    <div className="App">
      {authenticated ? (
        <>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                CodeLeap Network
              </Typography>
            </Toolbar>
          </AppBar>
          <Card sx={{ maxWidth: 1000, padding: "1rem" }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Hey {user?.username ?? ""}, What's in your mind?
              </Typography>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Title"
                  value={title}
                  onChange={handleTitleChange}
                  sx={{ marginBottom: "1rem" }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Content"
                  value={content}
                  onChange={handleContentChange}
                  multiline
                  rows={3}
                  sx={{ marginBottom: "1rem" }}
                />
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isFormValid()}
                >
                  Submit
                </Button>
              </form>
            </CardContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
  <Button
    variant="contained"
    size="small"
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
    sx={{ marginRight: "0.5rem" }}
    startIcon={<KeyboardArrowLeftIcon />}
  >
    Prev
  </Button>
  <Button
    variant="contained"
    size="small"
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={currentPage === Math.ceil(feedItems.length / ITEMS_PER_PAGE)}
    endIcon={<KeyboardArrowRightIcon />}
  >
    Next
  </Button>
</div>

          </Card>
        </>
      ) : (
        <p>Crie uma conta para publicar</p>
      )}
      <div className="feedItem">
        {feedItems.length > 0 ? (
          feedItems
            .slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE
            )
            .map((item, index) => (
              <FeedItem
                key={index}
                id={item.id}
                author={item.username}
                title={item.title}
                content={item.content}
                created_datetime={item.created_datetime.toString()}
                onDelete={() => handleDelete(index)}
                onEdit={(newTitle, newContent) =>
                  handleEdit(index, newTitle, newContent)
                }
              />
            ))
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress size={100} />
          </div>
        )}
      </div>
    </div>
  );
}

export default MainScreen;
