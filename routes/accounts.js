var express = require('express');
var router = express.Router();
var AccountsModel = require('../libs/mongoose').AccountsModel;

router.get('/', function (req, res, next) {
    return AccountsModel.find(function (err, operations) {
        if (!err) {
            return res.send(operations);
        } else {
            res.statusCode = 500;
            return res.send({ error: 'Server error' });
        }
    });
});

module.exports = router;
