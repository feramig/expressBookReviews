const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const review = req.query.review;
    if(req.session.authorization){
        const username=req.session.authorization.username
        if(book.reviews[username]){
            books[isbn].reviews[username].review = review;
        }else{
            books[isbn].reviews[username] = {review}
        }      
        res.send(JSON.stringify(book))
    }else{
        res.send("User not logged in")
    }
});

// Delete a Book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if(req.session.authorization){
        const username=req.session.authorization.username
        if(book.reviews[username]){
            delete books[isbn].reviews[username];
        }else{
            res.send("Review by user "+username+" not found");
        }
        res.send(JSON.stringify(book))
    }else{
        res.send("User not logged in")
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
