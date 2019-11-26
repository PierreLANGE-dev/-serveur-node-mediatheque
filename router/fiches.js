var express = require("express"),
  router = express.Router(),
  fs = require("fs");

var path = require("path");

var pathData = path.resolve(__dirname, "..", "DATAS/DATA.json");

router.get("/listFiches", function(req, res) {
  fs.readFile(pathData, "utf8", function(err, data) {
    if (err) return res.end("Erreur dans le chargement des donnees");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  });
});

//update FICHE
router.put("/updateFiches", function(req, res) {
  var arr = [];
  for (var index in req.body) {
    arr.push(req.body[index]);
  }
  var jsonData = JSON.stringify(arr);

  fs.writeFile(pathData, jsonData, function(err) {
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

router.get("/tpl", function(req, res) {
  res.sendFile(path.resolve(__dirname + "/DATAS/tpl.html"));
  console.log("Chargement du template");
});

router.get("/genre/:id", function(req, res) {
  var sql =
    "select  idgenres from `genres` where `genre` = " +
    connection.escape(req.params.id);
  var id;
  connection.query(sql, function(err, rows, fields) {
    connection.end();
    if (!err) res.json(rows);
    else console.log("Error while performing Query.");
  });
});

router.put("/saveFiches/:fiches", function(req, res) {
  fs.readFileSync(pathData, "utf8", function(err, data) {
    data = JSON.parse(data);

    var fiches = req.params.fiches;

    fs.writeFileSync(__dirname + "/DATAS/DATA.json", fiches, "UTF-8");

    console.log("liste des fiches Sauvegardée");

    res.end(data);
  });
});

module.exports = router;
