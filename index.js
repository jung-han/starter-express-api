const express = require("express");
const products = require("./products.json");
const app = express();

app.get("/products", (req, res) => {
  res.send(products);
});

app.listen(process.env.PORT || 3000);
