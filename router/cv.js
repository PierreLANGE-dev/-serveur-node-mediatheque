var express = require("express"),
  router = express.Router(),
  fs = require("fs");

var path = require("path");

var pathData = path.resolve(__dirname, "..", "DATAS/cv.json");

router.get("/dataCV", function (req, res) {
  fs.readFile(pathData, "utf8", function (err, data) {
    if (err) return res.end("Erreur dans le chargement des donnees");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  });
});

//update FICHE
router.put("/updateCV", function (req, res) {
  var arr = [];
  for (var index in req.body) {
    arr.push(req.body[index]);
  }
  var jsonData = JSON.stringify(arr);

  fs.writeFile(pathData, jsonData, function (err) {
    if (err) {
      console.log("problème lors de la mis à jour de la bdd json");
      return res
        .status(500)
        .end("problème lors de la mis à jour de la bdd json");
    }
    console.log("sauvegarde de la liste des fiches ok");
    res.end("update de la liste des fiches ok");
  });
});

module.exports = router;
