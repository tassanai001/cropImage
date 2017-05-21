var CG = require('./CG');
var DB = require('./DB');

var singleton = function singleton() {

    var sampleModel = {};

    CG.getMongoCon(function (conn) {
        sampleModel = conn.model('findnamedb', DB.sampleSchema);
    });

    this.sampleModel = sampleModel;
};

singleton.instance = null;
singleton.getInstance = function(){
    if(this.instance === null){
        this.instance = new singleton();
    }
    return this.instance;
};

module.exports = singleton.getInstance();