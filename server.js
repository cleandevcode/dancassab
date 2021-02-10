//Install express server
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const app = express();
// Serve only the static files form the dist directory
app.use(express.static(__dirname + "/dist"));

app.get("/articles", (req, res) => {
  fetch(
    "https://dancassab-intl.myshopify.com/admin/api/2020-07/articles.json?",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          "YjBjYTM2YjU3MmU0OWY1NzJjNmUwODE0MDNlYjg5YmU6NGQ4NTNiZWY4Yzk3ZjUzNGQyZDZiMWI4MjQxOWEzMTE=",
      },
    }
  )
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      return res.send(data);
    });
});

app.get("/articlesById", (req, res) => {
  const articleID = req.query.articleID;
  fetch(
    `https://dancassab-intl.myshopify.com/admin/api/2020-07/articles/${articleID}.json?`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          "YjBjYTM2YjU3MmU0OWY1NzJjNmUwODE0MDNlYjg5YmU6NGQ4NTNiZWY4Yzk3ZjUzNGQyZDZiMWI4MjQxOWEzMTE=",
      },
    }
  )
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      return res.send(data);
    });
});

app.get("/varients", (req, res) => {
  const productID = req.query.productID;
  fetch(
    `https://dancassab-intl.myshopify.com/admin/api/2020-10/products/${productID}.json`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          "YjBjYTM2YjU3MmU0OWY1NzJjNmUwODE0MDNlYjg5YmU6NGQ4NTNiZWY4Yzk3ZjUzNGQyZDZiMWI4MjQxOWEzMTE=",
      },
    }
  )
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      return res.send(data);
    });
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8081, () =>
  console.log("Listening on port 8081...")
);
