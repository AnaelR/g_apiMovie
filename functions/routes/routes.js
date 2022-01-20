//Import des routes et dépendances
var express = require("express");
var moviesRouterV1 = require("./v1/movies.router");
var moviesCategoriesV1 = require("./v1/categories.router");
var router = express.Router();

const routes = (db) => {
  //Routes de la V1
  //Racine de l'api
  router.get("/v1/", (req, res) => {
    res.send("All routes");
  });
  //route vers Movies
  router.use("/v1/", moviesRouterV1(db));
  //route vers Categories
  router.use("/v1/", moviesCategoriesV1(db));

  return router;
};

module.exports = routes;
