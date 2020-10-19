var express = require("express"),
  router = express.Router(),
  fs = require("fs");

var path = require("path");

var pathData = path.resolve(__dirname, "..", "DATAS/Emplacements.json");

//charge Emplacements
router.get("/listEmplacements", function(req, res) {
  fs.readFile(pathData, "utf8", function(err, data) {
    console.log("Chargement de la liste des Emplacements");

    res.end(data);
  });
});

//update Emplacements
router.put("/updateEmplacements", function(req, res) {
  // convert object to array

  var arr = [];
  for (var index in req.body) {
    arr.push(req.body[index]);
  }

  var jsonData = JSON.stringify(arr, null, 2);

  var normalPath = path.normalize(pathData);

  fs.writeFile(normalPath, jsonData, function(err, data) {
    console.log("sauvegarde de la liste des Emplacements ok");
    if (err) return res.end("Erreur dans le chargement des donnees");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  });

  console.log("update de la liste des Emplacements ok");
});

module.exports = router;
