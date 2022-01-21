var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");
const { FieldValue } = require("firebase-admin").firestore;

const routes = (db) => {
  //GET sur le path /movies, affiche toutes les données de la collection "movies"
  router.get("/movies/", (req, res) => {
    db.collection("movies")
      .get()
      .then((qs) => {
        let docs = [];
        qs.forEach((qds) => {
          docs.push({ ...qds.data(), id: qds.id });
        });
        res.send(docs);
      })
      .catch(() => res.status(400).send("Error to find document"));
  });

  //GET Affiche le film dont l'ID est passé après le path /movies/:id
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
      })
      .catch(() => res.status(400).send("Error, be sure to add a correct ID"));
  });

  //POST Poster un nouveau film, conditions etc.
  router.post(
    "/movies/",

    body("description").isString().notEmpty().exists(),
    body("img").isURL(),
    body("video").isURL(),
    body("author").isString().notEmpty().exists(),
    body("name").isString().notEmpty().exists(),
    body("categories_id").isString().notEmpty().exists(),

    (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const img = req.body.img || "";
      const video = req.body.video || "";

      args = {
        author: req.body["author"],
        description: req.body["description"],
        img: req.body["img"],
        name: req.body["name"],
        video: req.body["video"],
        categories_id: req.body["categories_id"],
      };

      // const categorie = req.body.categorie_id || "";
      let newObject = { ...args, likes: 0 };

      db.collection("categories")
        .doc(req.body.categories_id)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            res.status(400).send("Bad categorie ID");
          } else {
            db.collection("movies")
              .add(newObject)
              .then((doc) => res.status(201).send({ ...newObject, id: doc.id }))
              .catch((error) => res.status(400).send(error));
          }
        });
    }
  );

  //PATCH Update le film avec l'iD en option dans le path
  router.patch(
    "/movies/:id",

    body("description").isString().optional(),
    body("img").isURL().optional(),
    body("video").isURL().optional(),
    body("author").isString().optional(),
    body("name").isString().optional(),
    body("categories_id").isString().optional(),

    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      args = {
        ...req.body,
      };

      db.collection("movies")
        .doc(req.params.id)
        .update(args)
        .then(() =>
          db
            .collection("movies")
            .doc(req.params.id)
            .get()
            .then((doc) => res.status(201).send({ ...doc.data(), id: doc.id }))
        )
        .catch(() =>
          res
            .status(400)
            .send("Error, be sure to add a correct ID and correct entry")
        );
    }
  );

  //PATCH Ajoute un like
  router.patch("/movies/:id/like", (req, res) => {
    db.collection("movies")
      .doc(req.params.id)
      .update({ likes: FieldValue.increment(1) })
      .then((doc) =>
        db
          .collection("movies")
          .doc(req.params.id)
          .get()
          .then((doc) => res.status(202).send(doc.data()))
      )
      .catch(() => res.status(400).send("Error, be sure to add a correct ID"));
  });

  //DELETE Movie
  router.delete("/movies/:id", (req, res) => {
    db.collection("movies")
      .doc(req.params.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          db.collection("movies")
            .doc(req.params.id)
            .delete()
            .then(res.status(200).send("good delete my friend"));
        } else {
          res.status(404).send("No movie for this ID");
        }
      });
  });

  return router;
};

module.exports = routes;
