var express = require("express"),
    router = express.Router(),
    fs = require("fs");

const multer = require("multer");

var path = require("path");

const upload = multer({
    dest: __dirname + "/imgsProgBarres",
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
            res.send(req.file);
            fs.rename(
                __dirname + "/imgsProgBarres/" + req.file.filename,
                __dirname + "/imgsProgBarres/" + req.file.originalname,
                function(err) {
                    if (err) console.log("ERROR: " + err);
                }
            );
            console.log("reception image ok :" + req.file.originalname);
        } else throw "error";
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

router.get("/imageprogbarres/:name", function(req, res, next) {
    var options = {
        root: path.join(__dirname, "images"),
        dotfiles: "deny",
        headers: {
            "x-timestamp": Date.now(),
            "x-sent": true,
        },
    };

    var fileName = req.params.name;
    res.sendFile(fileName, options, function(err) {
        if (err) {
            next(err);
        } else {
            console.log("Sent:", fileName);
        }
    });
});
module.exports = router;