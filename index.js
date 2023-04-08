const express = require("express");
const products = require("./products.json");
const categories = require("./categories.json");
const app = express();

app.get("/products", (req, res) => {
  console.log(req, "req");
  res.send(products);
});

app.get("/categories", (req, res) => {
  console.log(req, "req");
  res.send(categories);
});

app.listen(process.env.PORT || 3000);
