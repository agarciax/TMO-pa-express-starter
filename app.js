const express = require("express");
const app = express();
const fs = require("fs");

app.use(
    express.urlencoded({
      extended: true,
    })
);

app.use(express.json());

var BookObj = function (bookObj){
  this.author = bookObj.author;
  this.title = bookObj.title;
  this.yearPublished = bookObj.yearPublished
}


let books = {books: [{}]};
readExistingBooks();

function readExistingBooks(){
  fs.readFile("output.json", function (err, data){
    if(err) throw err;

    books = JSON.parse(data)
    //books = data;
  })
}

//books = readExistingBooks();

//let data = require('./output.json')
//let elements = JSON.parse(data);
// let jsonData = '{"books":[{}]}'
// let jsonObj = JSON.parse(jsonData);
// let jsonContent = JSON.stringify(jsonObj);
// fs.writeFile("output.json", JSON.stringify(jsonContent), 'utf8', function (err) {
//   //console.log("JSON file has been saved")
// })

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).send("Don't panic, Jesus us here.");
});

function GenerateNewID() {
  //let length = Object.keys(JSON.parse(books)).length;
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
  //var newBookObj = new BookObj(req.body);
  //console.log(req.body);
  //console.log(newID)
  let buffer = {"id": newID, "author": req.body.author, "title": req.body.title, "yearPublished": req.body.yearPublished};
  //console.log(buffer);

  books.push(buffer);
  //books.books.push(buffer)
  console.log(books)

  fs.writeFile("output.json", JSON.stringify(books), err => {
    if(err) throw err;

    console.log("Done writing");
  })

  //fetch()
  //console.log(req.params.title);
  //let obj = req.params;
  res.status(201).send(buffer);
  readExistingBooks()
})
app.get("/api/books", (req, res) => {
  //books.push(req.params)
  //console.log(books)
  res.send(books);
})

app.delete("/api/books", (req, res) => {
  fs.writeFile("output.json", "[]", err => {
    if(err) throw err;

    console.log("Done deleting all records");
  })
  res.status(204).send();
  readExistingBooks()
})


module.exports = app;
