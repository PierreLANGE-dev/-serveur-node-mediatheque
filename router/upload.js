var express = require("express"),
  router = express.Router();

const multer = require("multer");

const upload = multer({
  dest: __dirname + "/images",
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      cb(new Error("Please upload an image."));
    }
    cb(undefined, true);
  },
});

router.post(
  "/upload",
  upload.single("photo"),
  (req, res) => {
    if (req.file) {
      res.json(req.file);
    } else throw "error";
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
