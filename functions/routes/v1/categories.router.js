var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");

const routes = (db) => {
  //GET sur le path /categories
  router.get("/categories/", (req, res) => {
    db.collection("categories")
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

  router.get("/categories/:id", (req, res) => {
    db.collection("categories")
      .doc(req.params.id)
      .get()
      .then((categorie) => {
        if (!categorie.exists) {
          return res.send("No doc for '" + req.params.id + "' ID");
        } else {
          res.send({ ...categorie.data(), id: categorie.id });
        }
      })
      .catch(() => res.status(404).send("Error, be sure to add a correct ID"));
  });

  router.post(
    "/categories/",

    body("name").isString().notEmpty().exists(),

    (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      args = {
        name: req.body["name"],
      };

      db.collection("categories")
        .add(args)
        .then((doc) => res.status(201).send({ ...args, id: doc.id }))
        .catch((error) => res.status(400).send(error));
    }
  );

  router.put(
    "/categories/:id",
    body("name").isString().notEmpty(),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const args = { name: req.body.name };

      db.collection("categories")
        .doc(req.params.id)
        .update(args)
        .then(() =>
          db
            .collection("categories")
            .doc(req.params.id)
            .get()
            .then((doc) => res.status(202).send({ ...doc.data(), id: doc.id }))
        )
        .catch(() =>
          res
            .status(400)
            .send("Error, be sure to add a correct ID and correct entry")
        );
    }
  );

  router.delete("/categories/:id", (req, res) => {
    db.collection("categories")
      .doc(req.params.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          db.collection("categories")
            .doc(req.params.id)
            .delete()
            .then(res.status(200).send("good delete"));
        } else {
          res.status(404).send("No categorie for this ID");
        }
      })
      .catch(res.status(400));
  });

  return router;
};

module.exports = routes;
