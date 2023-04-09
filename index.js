const express = require("express");
const productsJSON = require("./products.json");
const categoriesJSON = require("./categories.json");
const couponListJSON = require("./couponList.json");
const cors = require("cors");
const app = express();

app.use(cors());

function getProductsByCategoryId(products, categoryId) {
  return categoryId ? products.filter((item) => item.category.id === Number(categoryId)) : products;
}

function getProductsByPrice(products, price) {
  return price ? products.filter((item) => item.price === Number(price)) : products;
}

function getProductsByPriceRange({ products, price_min, price_max }) {
  const minValue = price_min ? Number(price_min) : Number.MIN_SAFE_INTEGER;
  const maxValue = price_min ? Number(price_max) : Number.MAX_SAFE_INTEGER;

  return products.filter((item) => item.price >= minValue && item.price <= maxValue);
}

function getProductsByTitle(products, title) {
  return title ? products.filter((item) => item.title.includes(title)) : products;
}

function getFilteredProductsByQuery(products, query) {
  const productsFilteredByCategoryId = getProductsByCategoryId(products, query.categoryId);
  const productsFilteredByPriceRange = getProductsByPriceRange({
    products: productsFilteredByCategoryId,
    price_min: query.price_min,
    price_max: query.price_max,
  });
  const productsFilteredByPrice = getProductsByPrice(productsFilteredByPriceRange, query.price);
  const productsFilteredByTitle = getProductsByTitle(productsFilteredByPrice, query.title);

  return productsFilteredByTitle;
}

function getSliceIndex(products, query) {
  const offset = query.offset ? Number(query.offset) : 0;
  const limit = query.limit ? Number(query.limit) : products.length;
  const endIndex = offset + limit > products.length ? products.length : offset + limit;

  return {
    startIndex: offset,
    endIndex,
  };
}

app.get("/products", (req, res) => {
  const filteredProducts = getFilteredProductsByQuery(productsJSON, req.query);
  const { startIndex, endIndex } = getSliceIndex(filteredProducts, req.query);
  const lastPage = endIndex === filteredProducts.length;

  res.send({ products: filteredProducts.slice(startIndex, endIndex), lastPage });
});

app.get("/products/:id", (req, res) => {
  const product = productsJSON.find(({ id }) => String(id) === req.params.id);
  if (product) {
    res.send(product);
    return;
  }

  res.status(404).send("not found");
});

app.get("/categories", (_, res) => {
  res.send(categoriesJSON);
});

app.get("/couponList", (_, res) => {
  res.send(couponListJSON);
});

app.listen(process.env.PORT || 3000);
