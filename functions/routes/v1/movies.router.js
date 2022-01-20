var express = require("express");
var router = express.Router();

const routes = (db) => {
  router.get("/movies/", (req, res) => {
    db.collection("movies")
      .get()
      .then((qs) => {
        let docs = [];
        qs.forEach((qds) => {
          docs.push({ ...qds.data(), id: qds.id });
        });
        res.send(docs);
      });
  });

  router.get("/movies/:id", (req, res) => {
    db.collection("movies")
      .doc(req.params.id)
      .get()
      .then((movie) => {
        if (!movie.exists) {
          return res.send("No doc for '" + req.params.id + "' ID");
        } else {
          res.send({ ...movie.data(), id: movie.id });
        }
      });
  });

  router.post("/movies/", (req, res) => {
    if (
      req.body.description &&
      req.body.img &&
      req.body.video &&
      req.body.author &&
      req.body.name
    ) {
      db.collection("movies").doc().set(req.body);
      res.sendStatus(200);
    } else {
      res.sendStatus(403);
    }
  });

  return router;
};

module.exports = routes;
