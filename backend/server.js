const http = require("http");
const { write, read } = require("./lib/fs");
const path = require("path");

const server = http.createServer((req, res) => {
  const route = req.url.split("/").filter((e) => e != "favicon.ico");
  
  const options = {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
  };

  if (req.method == "GET") {
    if (route[1] == "books" && route[2]) {
      const filterCategory = read(path.resolve("./model/books.json")).filter(
        (e) => e.categoryID == route[2]
      );

      if (!filterCategory.length) {
        res.writeHead(400, options);
        return res.end(JSON.stringify({ message: "Bad request" }));
      }

      return res.end(JSON.stringify(filterCategory));
    }

    if (route[1] == "books") {
      res.writeHead(200, options);
      return res.end(JSON.stringify(read(path.resolve("./model/books.json"))));
    }

    if (route[1] == "category") {
      res.writeHead(200, options);
      return res.end(
        JSON.stringify(read(path.resolve("./model/category.json")))
      );
    }
  }

  if (req.method == "POST" || req.method == "OPTIONS") {
    req.on("data", (chunk) => {
      console.log(chunk.toString());
      const { name, price, author, categoryID } = JSON.parse(chunk);

      const allBooks = read(path.resolve("./model/books.json"));
      allBooks.push({
        id: allBooks.length + 1,
        name,
        price,
        author,
        categoryID,
      });

      write(path.resolve("./model/books.json"), allBooks);
    });
    res.writeHead(200, options);

    return res.end("Write");
  }
});

server.listen(8000, () => {
  console.log("Worked");
});
