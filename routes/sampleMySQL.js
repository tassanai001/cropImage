var express = require('express');
var router = express.Router();

var CG = require('../CG');

router.post('/addKeyword',function(req,res) {
    CG.poolMySQL.getConnection(function(err,connection){
        if(req.body.keywords) {
            if (err)
                res.send(err);
            else {
                connection.query('SELECT * FROM tbd_meshkeywords where keywords=?', [req.body.keywords], function (err, rows) {
                    if (err) {
                        res.send(err);
                        connection.release();
                    }
                    else {
                        if(rows.length==0){
                            var saveObject = {
                                keywords : req.body.keywords,
                                CreateDate  : new Date(),
                                LastUpdate : new Date()
                            };

                            var query = connection.query('INSERT INTO tbd_meshkeywords SET ?', saveObject, function(err, result) {
                                if(err){
                                    res.send("Error :" + err + ":::::"+ query.sql)
                                }
                                else {
                                    res.send(query.sql);
                                }
                            });

                        }else{
                            res.send("This keywords already exist");
                        }
                        connection.release();
                    }
                });
            }
        }else{
            res.send({message : "Please enter query keyword."});
        }
    });
});
module.exports = router;