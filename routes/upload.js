let express = require("express");
let router = express.Router();
let path = require("path");
let fs = require("fs");
let gm = require("gm");
let formidable = require("formidable");

router.post("/", (req, res) => {
    uploadImage(req, "upload", (cb) => {
        res.send(cb);
    });
});

router.post("/getCropp", (req, res) => {
    uploadImage(req, "getcrop", (cb) => {
        console.log("From uploadImage ", cb);
        res.send(cb);
    });
});

let uploadImage = (req, status, callback) => {
    let uploadPath = path.join(__dirname.replace("routes", "public"), "/uploads");
    let form = new formidable.IncomingForm();
    let fileName = "";
    let fileNameAdd = "";
    form.multiples = true;
    form.uploadDir = uploadPath;
    chkExistsfile(form.uploadDir, () => {
        form.on("file", (field, file) => {
            fileName = Number(new Date) + ".png";
            file.name = fileName.toString();
            fileNameAdd = file.name;
            fs.rename(file.path, path.join(form.uploadDir, file.name));
        });
        form.on("error", (err) => {
            console.log("An error has occured: \n" + err);
            callback(err);
        });
        form.on("end", () => {
            getCroppImage(status, uploadPath, fileNameAdd, fileName, (cb) => {
                callback(cb);
            });
        })
        form.parse(req);
    });
};

let getCroppImage = (status, uploadPath, fileNameAdd, fileName, callback) => {
    if (status === "getcrop") {
        let realPath = uploadPath + "\\" + fileNameAdd;
        let expectPath = uploadPath + "\\testmerge.png";
        getSizeRealImage(realPath, (size) => {
            getSizeExpectImage(expectPath, size, (cb) => {
                gm(realPath).append(expectPath, true)
                    .write(realPath.replace(".png", "") + "testmerge.png",
                    (err) => {
                        fileName = fileNameAdd.replace(".png", "") + "testmerge.png";
                        if (err) {
                            console.log("image conversion error! \n", err);
                            callback(err);
                        } else {
                            callback(fileName);
                        }
                    });
            });
        });
    } else {
        callback(fileName);
    }
};

let getSizeRealImage = (path, callback) => {
    gm(path).size(function (err, size) {
        if (err) {
            callback(null);
        } else {
            callback(size);
        }
    });
};

let getSizeExpectImage = (path, size, callback) => {
    gm(path).resize(Number(size.width), Number(size.height), "!")
        .write(path, function (err) {
            if (err) {
                console.log('Error Resize: ', err);
                callback(null);
            } else {
                console.log('image converted.');
                callback(true);
            }
        });
}

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
};

let createFile = (path, callback) => {
    fs.mkdir(path, (err) => {
        if (err) {
            callback("error");
        } else {
            callback("done");
        }
    });
};

module.exports = router;