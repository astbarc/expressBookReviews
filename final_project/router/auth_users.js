const express = require('express');
const jwt = require('jsonwebtoken');
//const { reset } = require('nodemon');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let currentUsername = "";

const doesExist = (username)=>{
  const existedUser = users.find(user => user.username === username);
  return (existedUser) ? true : false
}

const isValid = (username, password)=>{ 
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//review
regd_users.post("/auth/review", (req,res) => {
  res.send("Welcome to the secret review page!");
});

// Update/modify review
regd_users.put("/auth/review/:isbn", (req,res) => {
  const isbn = req.params.isbn;
  const new_review = req.query.review;

  // Find the book by isbn, then add the review 
  let filtered_book = books.filter((book) => book.isbn == isbn);
  filtered_book[0]["reviews"][currentUsername] = new_review;
  res.send("The review for the book with ISBN: " + (isbn) + " has been added/updated.");
});

// Delete review
regd_users.delete("/auth/review/:isbn", (req,res) => {
  const isbn = req.params.isbn;

  // Find the book by isbn, then add the reivew 
  let filtered_book = books.filter((book) => book.isbn == isbn);
  delete filtered_book[0]["reviews"][currentUsername];
  res.send("Reviews for the ISBN: " + (isbn) + " posted by the user " + (currentUsername) + " deleted.");
});

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;
    if (authenticatedUser(username, password)) {
    //   // Give access token to the user
    //   let accessToken = jwt.sign({
    //     username : username,
    //     password : password
    //   }, 'access', { expiresIn: 60 * 60 });

    //   req.session.authorization = {
    //     accessToken
    // }

 
    currentUsername = username;
    let accessToken = jwt.sign({
            data: username,
        }, 'access', { expiresIn: 60 * 60 });

        // Set the access token and username in the session
        req.session.authorization = {
            accessToken: accessToken,
        };
    return res.status(200).send("User successfully logged in\n");
    }
    res.status(401).send("Username or Password doesn't correspond to those ones registered");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.doesExist = doesExist;
module.exports.users = users;