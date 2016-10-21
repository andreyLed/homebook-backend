var express = require('express');
var router = express.Router();
var CategoriesModel = require('../libs/mongoose').CategoriesModel;

router.get('/', function (req, res) {
    return CategoriesModel.find(function (err, categories) {
        if (!err) {
            return res.send(categories);
        } else {
            res.statusCode = 500;
            return res.send({ error: 'Server error' });
        }
    });
});

module.exports = router;
