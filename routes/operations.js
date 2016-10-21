var express = require('express');
var router = express.Router();
var OperationModel = require('../libs/mongoose').OperationModel;

router.get('/', function (req, res, next) {
    if (req.query.type == '0' || req.query.type == '1') {
        const type = ['доход', 'расход']
        return OperationModel.find({ type: type[req.query.type] }, function (err, operations) {
            if (!err) {
                return res.send(operations);
            } else {
                res.statusCode = 500;
                return res.send({ error: 'Server error' });
            }
        });
    } else if (typeof req.query.from !== 'undefined' || typeof req.query.to !== 'undefined') {
        var dateFilter = {};
        if(req.query.from !== 'undefined'){
            dateFilter["$gte"] = req.query.from;
        }
        if(req.query.to !== 'undefined'){
            dateFilter["$lt"] = req.query.to;
        }
        
        return OperationModel.find({"date": dateFilter}, function (err, operations) {
            if (!err) {
                return res.send(operations);
            } else {
                res.statusCode = 500;
                return res.send({ error: 'Server error' });
            }
        });
    } else {
        return OperationModel.find(function (err, operations) {
            if (!err) {
                return res.send(operations);
            } else {
                res.statusCode = 500;
                return res.send({ error: 'Server error' });
            }
        });
    }
});

router.get('/:id', function(req, res) {
    return OperationModel.findById(req.params.id, function (err, article) {
        if(!article) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send(article);
        } else {
            res.statusCode = 500;
            return res.send({ error: 'Server error' });
        }
    });
});


router.post('/', function (req, res) {
    var operation = new OperationModel({
        type: req.body.type,
        category: req.body.category,
        amount: req.body.amount,
        date: req.body.date,
        comment: req.body.comment,
        payment_method: req.body.payment_method

    })

    operation.save(function (err) {
        if (!err) {
            return res.send({ status: 'OK', article: operation });
        } else {
            console.log(err);
            if (err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
        }
    });
});


router.put('/:id', function (req, res){
    return OperationModel.findById(req.params.id, function (err, operation) {
        if(!operation) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        operation.type = req.body.type,
        operation.category = req.body.category,
        operation.amount = req.body.amount,
        operation.date = req.body.date,
        operation.comment = req.body.comment,
        operation.payment_method = req.body.payment_method
        
        return operation.save(function (err) {
            if (!err) {
                return res.send(operation);
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
            }
        });
    });
});


router.delete('/:id', function (req, res){
    return OperationModel.findById(req.params.id, function (err, article) {
        if(!article) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return article.remove(function (err) {
            if (!err) {
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                return res.send({ error: 'Server error' });
            }
        });
    });
});

module.exports = router;
