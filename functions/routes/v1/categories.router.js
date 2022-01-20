var express = require("express");
var router = express.Router();

const routes = (db) => {
  router.get("/categories/", (req, res) => {
    db.collection("categories")
      .get()
      .then((qs) => {
        let docs = [];
        qs.forEach((qds) => {
          docs.push({ ...qds.data(), id: qds.id });
        });
        res.send(docs);
      });
  });

  router.get("/categories/:id", (req, res) => {
    db.collection("categories")
      .doc(req.params.id)
      .get()
      .then((categorie) => {
        if (!categorie.exists) {
          return res.send("No doc for '"+req.params.id+"' ID");
        } else {
          res.send({ ...categorie.data(), id: categorie.id });
        }
      });
  });

  return router;
};

module.exports = routes;
