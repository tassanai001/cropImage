var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'IAMFFz', layout: 'partial/shared' });
});

module.exports = router;