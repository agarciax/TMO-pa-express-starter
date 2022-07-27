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
  let length = books.books.length
  let newID;
  if(books.books[length - 1] === undefined){
    newID = 1;
  } else {
    newID = books.books[length - 1].id + 1
  }

  return newID
}

app.post("/api/books", (req, res) => {
  let newID = GenerateNewID()
  let buffer = {"id": newID, "author": req.body.author, "title": req.body.title, "yearPublished": req.body.yearPublished};
  books.books.push(buffer);

  fs.writeFile("output.json", JSON.stringify(books), err => {
    if(err) throw err;

    console.log("Done writing");
  })

  res.status(201).send(buffer);
  readExistingBooks()
})
app.get("/api/books", (req, res) => {
  let copy = books;
  copy.books.sort(function (a, b) {
    return a.title.localeCompare(b.name);
  })
  res.send(copy);
})

app.delete("/api/books", (req, res) => {
  let buffer = '{"books": []}';
  fs.writeFile("output.json", buffer, err => {
    if(err) throw err;

    console.log("Done deleting all books");
  })
  res.status(204).send();
  readExistingBooks()
})

module.exports = app;
