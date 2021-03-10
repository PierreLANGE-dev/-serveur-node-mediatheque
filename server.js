var express = require("express"),
  fichesRouter = require("./router/fiches"),
  emplacementsRouter = require("./router/emplacements"),
  cvRouter = require("./router/cv"),
  uploadRouter = require("./router/upload"),
  uploadRouterImgCV = require("./router/uploadImgCv"),
  app = express();

var cors = require("cors");
var bodyParser = require("body-parser");

app.use(cors()); // Ne jamais enlever les limits
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(__dirname));
app.use("/", fichesRouter);
app.use("/", emplacementsRouter);
app.use("/", cvRouter);
app.use("/", uploadRouter);
app.use("/", uploadRouterImgCV);

var port = process.env.PORT || 8083; // local tu définis ton port toi même // sur heroku

app
  .listen(port, function () {
    process.stdout.write("\033c");
    console.log("Server express ecoute sur le port %s", port);
  })
  .on("error", function (e) {
    console.error(e.message);
  });
