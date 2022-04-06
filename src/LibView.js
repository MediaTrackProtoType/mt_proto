import * as React from "react";
import { Grid } from "@mui/material";
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


const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [books, setBooks] = useState([]);
  //logout user
  function logout() {
    localStorage.removeItem("token");
    navigate("/Login");
  }

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
      .then((data) => setBooks(data))
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
    //alert("SEND ITEM TO DATABASE\n" + JSON.stringify(bookData));
    alert(info.title + " deleted");
    //console.log(username);      
  };

  return (
    <div className="main">
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
            <h2>Welcome: {JSON.stringify(username)}</h2>
            <p> - </p>
            <button>
              <div onClick={logout}>Logout</div>
            </button>
          </div>
        </div>
        <h2>Media Book List</h2>
        <div className="App">
        <Grid item style={{ border: "0.2px solid grey" }}>
            
            {/*<ListView />*/}
            {books.map((book) => (
              <ListItem key={book.title} component="div">
                <ListItemIcon>
                  {
                    <img
                      src={book.imageLinks[0].smallThumbnail}
                      width="40"
                      height="60"
                    ></img>
                  }
                </ListItemIcon>
                <ListItemButton>
                  <ListItemText
                    primary={`${book.title}`}
                    onClick={() => {
                      alert(`Detail view for ${book.title}`);
                    }}
                  />
                </ListItemButton>
                <Button variant="contained" color="error" size="small" onClick={() => handleClick(book)}>Delete
                </Button>
              </ListItem>
            ))}
        </Grid>
        </div>
        <Grid item>
          <p></p>
          <Button1 />
        </Grid>
        <Grid item>
          <p></p>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;