let express = require("express");
let router = express.Router();
let app = express();
let path = require("path");
let formidable = require("formidable");
let fs = require("fs");

let gm = require("gm");

router.post("/", (req, res) => {
    let uploadPath = path.join(__dirname.replace("routes", "public"), '/uploads');
    console.log("uploadPath: ", uploadPath);
    let form = new formidable.IncomingForm();
    let fileName = "";
    form.multiples = true;
    form.uploadDir = uploadPath;
    chkExistsfile(form.uploadDir, (bExist) => {
        form.on("file", function (field, file) {
            fileName = Number(new Date) + ".png";
            file.name = fileName.toString();
            fs.rename(file.path, path.join(form.uploadDir, file.name));
        });
        form.on("error", function (err) {
            console.log("An error has occured: \n" + err);
            // res.send(err);
        });
        form.on("end", function () {
            res.end(fileName);

            // gm(uploadPath + "\\1495964011421.png").append(uploadPath + "\\1495966519706.png", true).write(uploadPath + "\\test.png",
            //     function (err, stdout, stderr, command) {
            //         if (err) {
            //             console.log('image conversion error!');
            //             console.log(err);
            //             console.log(command);
            //         } else {
            //             console.log('image converted with command :');
            //             console.log(command);
            //         }
            //     })


        });
        form.parse(req);
    });
});

let chkExistsfile = (path, callback) => {
    fs.exists(path, (exists) => {
        if (!exists) {
            createFile(path, (cb) => {
                callback(cb);
            });
        } else {
            callback("done");
        }
    });
}

let createFile = (path, callback) => {
    fs.mkdir(path, (err) => {
        if (err) {
            callback("error");
        } else {
            callback("done");
        }
    });
}

module.exports = router;