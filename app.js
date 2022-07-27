const express = require("express");
const app = express();
const fs = require("fs");

app.use(
    express.urlencoded({
      extended: true,
    })
);
app.use(express.json());

let books = {books: [{}]};
readExistingBooks();

function readExistingBooks(){
  fs.readFile("output.json", function (err, data){
    if(err) throw err;

    books = JSON.parse(data)
  })
}

app.get("/health", (req, res) => {
  res.status(200).send("Don't panic, Jesus us here.");
});

function GenerateNewID() {
  let length = books.length
  let newID;
  if(books[length - 1] === undefined){
    newID = 1;
  } else {
    newID = books[length - 1].id + 1
  }

  return newID
}

app.post("/api/books", (req, res) => {
  let newID = GenerateNewID()
  let buffer = {"id": newID, "author": req.body.author, "title": req.body.title, "yearPublished": req.body.yearPublished};
  books.push(buffer);
  console.log(books)

  fs.writeFile("output.json", JSON.stringify(books), err => {
    if(err) throw err;

    console.log("Done writing");
  })

  res.status(201).send(buffer);
  readExistingBooks()
})
app.get("/api/books", (req, res) => {
  res.send(books);
})

app.delete("/api/books", (req, res) => {
  fs.writeFile("output.json", "[]", err => {
    if(err) throw err;

    console.log("Done deleting all books");
  })
  res.status(204).send();
  readExistingBooks()
})

module.exports = app;
