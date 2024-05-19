const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_authors = {};
  for(let book in books){
    if(books[book].author===author){
        filtered_authors = books[book];
    }
  }
  res.send(filtered_authors);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filtered_titles = {};
    for(let book in books){
        if(books[book].title===title){
            filtered_titles = books[book];
        }
    }
    res.send(filtered_titles);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let book = books[req.params.isbn];
  res.send(book.reviews);
});

module.exports.general = public_users;


const booksPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(JSON.stringify(books,null,4))
    },6000)});

booksPromise.then((successMessage) => {
    console.log("Books List " + successMessage)
})

const connectToURL = (url,operation)=>{
    const req = axios.get(url);
    req.then(resp => {
        let obtained_data = resp.data;
        console.log(operation + " Fulfilled");
        console.log(JSON.stringify(obtained_data,null,4));
    })
    .catch(err => {
        console.log("Rejected for url "+url)
        console.log(err.toString())
    });
}

//Call for ISBN details
connectToURL('https://feramcaa-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/2','By ISBN');
 //Call for Details by Author
connectToURL('https://feramcaa-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/Jane Austen', 'By Author');
//Call for Details by Title
connectToURL('https://feramcaa-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/The Epic Of Gilgamesh', 'By Title');