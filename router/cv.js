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

  var jsonData = JSON.stringify(arr, null, 2);

  var normalPath = path.normalize(pathData);

  fs.writeFile(normalPath, jsonData, function (err, data) {
    console.log("sauvegarde du cv ok");
    if (err) return res.end("Erreur dans le chargement des données");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  });
});

module.exports = router;
