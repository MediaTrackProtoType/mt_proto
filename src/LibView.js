import * as React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList } from "react-window";
import Button1 from "./Button1.js";
import Button from '@mui/material/Button';
import "./LibView.css";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Grid, Paper } from "@mui/material";

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';



import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Typography from '@mui/material/Typography';

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [books, setBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState({isbn: [],
    title: "",
    authors: [],
    language: "",
    pages: "",
    published: "",
    publisher: "",
    imageLinks: ""});

  //logout user
  function logout() {
    localStorage.removeItem("token");
    navigate("/Login");
  }

  function searchBooks(f){
    if(f.length > 0){
      const search = myBooks.filter(w => w.title.toLowerCase().includes(f.toLowerCase()));
      setBooks(search);
    }
    else{
      setBooks(myBooks);
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (b) => {
    setCurrentBook(b);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    fetch("/isUserAuth", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) =>
        data.isLoggedIn ? setUsername(data.username) : navigate("/Login")
      );

    fetch("/myLib", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setMyBooks(data);
      })
      .catch((error) => {
        if (error.response) {
          alert("Error encountered... Please Try Again");
        } else {
        }
      });
  }, [navigate]);

  const handleClick = (info) => {
    const bookData = {user: username, book:{
      isbn: info.industryIdentifiers,
      title: info.title,
      authors: info.authors,
      language: info.language,
      pages: info.pageCount,
      published: info.publishedDate,
      publisher: info.publisher,
      imageLinks: info.imageLinks
    }};
    fetch("/removeBook", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify(bookData),
    })
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((error) => {
        if (error.response) {
          alert("Error encountered... Please Try Again");
        }
      });
    //alert(info.title + " deleted");
    //console.log(username);      
  };

  const browntheme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: '#d39b74',
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#3c1e31',
      },
    },
  });

  const paperStyle= {padding: 10, height: 100, width: 200}


  return (
    <div className="main-black">
      {/* Using grid to position elements */}
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <div className="paddedtitle">
          <p></p>
          <div className="userInfo">
            {/*<h2>Welcome: {JSON.stringify(username)}</h2>*/}
            <Button 
              style={{
                backgroundColor: "#4D1137",
              }}
              variant="contained"
            >
              <div onClick={logout}>Logout</div>
            </Button>
          </div>
        </div>
        {/* <h1 className="whitetext">{username}'s Digital Library</h1> */}
        <h1 className="whitetext">My Digital Library</h1>
        <div className="App">
        <TextField
        sx={{ input: { color: 'white' } }}
        id="input-with-icon-textfield"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ color: 'white' }}/>
            </InputAdornment>
          ),
        }}
        variant="standard"
        style={{"textAlign":"center"}} 
        placeholder="filter..." name="filter" 
        onKeyUp={e => searchBooks(e.target.value)}
        />



        <ImageList sx={{ padding: 4, paddingTop: 0}} cols={7} rowHeight={250}>
            {/*<ListView />*/}
            {books.map((book) => (
              <Card key={book.title} component="div" sx={{ paddingTop: 1 }} >
                <CardMedia onClick={() => {
                      handleClickOpen(book);
                    }}>
                    <img
                      src={book.imageLinks[0].smallThumbnail}
                      width="180"
                      height="260"
                      loading="lazy"
                    ></img>

                </CardMedia>
                <CardContent>
                  <div className="padded">
                  <Button 
                    style={{
                      backgroundColor: "#37082A",
                    }}
                    variant="contained" size="small" onClick={() => handleClickOpen(book)}>View
                  </Button>
                  <IconButton aria-label="delete" size="large" onClick={() => handleClick(book)}>
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                  {/* <Button variant="contained" color="error" size="small" onClick={() => handleClick(book)}>Remove
                  </Button> */}
                  </div>
                <Typography gutterBottom variant="p" component="div" onClick={() => {
                      handleClickOpen(book);
                    }}>
                  {`${book.title}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" onClick={() => {
                      handleClickOpen(book);
                    }}>
                {`${book.authors}`}
                </Typography>
                
              </CardContent>
              </Card>
            ))}
        </ImageList>




        </div>
        <Grid item>
          <p></p>
          <Button1 />
        </Grid>
        <Grid item>
          <p></p>
        </Grid>
      </Grid>
      <div>

      {/*media detail dialog*/}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentBook.title}</DialogTitle>
          <DialogContent>
            {currentBook.isbn.map((n) => (
              <ListItem key={n.identifier} component="div">
                  <ListItemText
                    primary={`${n.type}: ${n.identifier}`}
                  />
              </ListItem>
            ))}
            {currentBook.authors.map((a) => (
              <ListItem key={a} component="div">
                  <ListItemText
                    primary={`Author: ${a}`}
                  />
              </ListItem>
            ))}

            <ListItem key={currentBook.published} component="div">
                <ListItemText
                  primary={`Published: ${currentBook.published}`}
                />
            </ListItem>

            <ListItem key={currentBook.pages} component="div">
                <ListItemText
                  primary={`Pages: ${currentBook.pages}`}
                />
            </ListItem>

            <ListItem key={currentBook.publisher} component="div">
                <ListItemText
                  primary={`Publisher: ${currentBook.publisher}`}
                />
            </ListItem>

          </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
    </div>
  );
};

export default Home;