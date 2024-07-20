const express = require('express');
let books = require("./booksdb.js");
let doesExist = require("./auth_users.js").doesExist;
let isValid = require("./auth_users.js").isValid;
const jwt = require('jsonwebtoken');
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;
  if (username && password) {
    // username validation
    if (doesExist(username)) { 
      return res.status(404).json({message: "Username already exists!"});   
    } else {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    }
  } 
  return res.status(404).json({message: "Unable to register user, both username and password must be filled!"});
});

// Get the user list available in the shop
// FOR TESTING ONLY 
public_users.get('/users',function (req, res) {
  res.send(JSON.stringify(users,null,4));
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn= req.params.isbn;
  let filtered_book = books.filter((book) => book.isbn == isbn);
  const booksString = JSON.stringify(filtered_book, null, 4);
  res.send(booksString);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_book = books.filter((book) => book.author == author);
  const booksString = JSON.stringify(filtered_book, null, 4) + "\n";
  res.send(booksString);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filtered_book = books.filter((book) => book.title == title);
  const booksString = JSON.stringify(filtered_book, null, 4) + "\n";
  res.send(booksString);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const enterted_isbn = req.params.isbn;
  let filtered_book = books.filter((book) => book.isbn == enterted_isbn);
  // const booksString = JSON.stringify(filtered_book["reviews"], null, 4);
  res.send(JSON.stringify(filtered_book[0]["reviews"].text))+ "\n";
});

module.exports.general = public_users;