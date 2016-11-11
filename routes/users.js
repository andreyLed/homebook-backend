const express = require('express');

const router = express.Router();
const AccountsModel = require('../libs/mongoose').AccountsModel;
const CategoriesModel = require('../libs/mongoose').CategoriesModel;
const OperationModel = require('../libs/mongoose').OperationModel;


router.get('/', (req, res) => {
  const userData = {};

  return AccountsModel.find((err, accounts) => {
    if (!err) {
      userData.accounts = accounts;
    }
  }).then(() =>
    CategoriesModel.find((err, categories) => {
      if (!err) {
        userData.categories = categories;
      }
    })
    ).then(() => {
      if (req.query.operations === 'true') {
        OperationModel.find((err, operations) => {
          if (!err) {
            userData.operations = operations;
            res.send(userData);
          }
        });
      } else {
        OperationModel.aggregate([
          {
            $group: {
              _id: '$account',
              amount: { $sum: '$amount' }
            }
          }
        ], (err, operations) => {
          if (!err) {
            userData.balance = operations;
            res.send(userData);
          }
        });
      }
    }).catch(() => {
      res.statusCode = 500;
      res.send({ error: 'Server error' });
    });
});


router.get('/operations', (req, res) => {
  if (req.query.type === '0' || req.query.type === '1') {
    const type = ['доход', 'расход'];
    return OperationModel.find({ type: type[req.query.type] }, (err, operations) => {
      if (!err) {
        return res.send(operations);
      }
      res.statusCode = 500;
      return res.send({ error: 'Server error' });
    });
  } else if (typeof req.query.from !== 'undefined' || typeof req.query.to !== 'undefined') {
    const dateFilter = {};
    if (req.query.from !== 'undefined') {
      dateFilter.$gte = req.query.from;
    }
    if (req.query.to !== 'undefined') {
      dateFilter.$lt = req.query.to;
    }

    return OperationModel.find({ date: dateFilter }, (err, operations) => {
      if (!err) {
        return res.send(operations);
      }
      res.statusCode = 500;
      return res.send({ error: 'Server error' });
    });
  }
  return OperationModel.find((err, operations) => {
    if (!err) {
      return res.send(operations);
    }
    res.statusCode = 500;
    return res.send({ error: 'Server error' });
  });
});

router.get('/operations/:id', (req, res) => {
  OperationModel.findById(req.params.id, (err, article) => {
    if (!article) {
      res.statusCode = 404;
      return res.send({ error: 'Not found' });
    }
    if (!err) {
      return res.send(article);
    }
    res.statusCode = 500;
    return res.send({ error: 'Server error' });
  });
});

router.post('/operations', (req, res) => {
  const operation = new OperationModel({
    type: req.body.type,
    category: req.body.category,
    amount: req.body.amount,
    date: req.body.date,
    comment: req.body.comment,
    account: req.body.account
  });

  operation.save((err) => {
    if (!err) {
      return res.send({ status: 'OK', article: operation });
    }
    if (err.name === 'ValidationError') {
      res.statusCode = 400;
      res.send({ error: 'Validation error' });
    } else {
      res.statusCode = 500;
      res.send({ error: 'Server error' });
    }
  });
});

router.put('/operations/:id', (req, res) =>
  OperationModel.findById(req.params.id, (err, operation) => {
    if (!operation) {
      res.statusCode = 404;
      return res.send({ error: 'Not found' });
    }
    operation.type = req.body.type;
    operation.category = req.body.category;
    operation.amount = req.body.amount;
    operation.date = req.body.date;
    operation.comment = req.body.comment;
    operation.account = req.body.account;

    return operation.save((saveErr) => {
      if (!saveErr) {
        return res.send(operation);
      }
      if (saveErr.name === 'ValidationError') {
        res.statusCode = 400;
        res.send({ error: 'Validation error' });
      } else {
        res.statusCode = 500;
        res.send({ error: 'Server error' });
      }
    });
  })
);

router.delete('/operations/:id', (req, res) =>
  OperationModel.findById(req.params.id, (err, article) => {
    if (!article) {
      res.statusCode = 404;
      return res.send({ error: 'Not found' });
    }
    return article.remove((removeErr) => {
      if (!removeErr) {
        return res.send({ status: 'OK' });
      }
      res.statusCode = 500;
      return res.send({ error: 'Server error' });
    });
  })
);

module.exports = router;
