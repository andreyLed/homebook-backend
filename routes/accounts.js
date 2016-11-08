const express = require('express');

const router = express.Router();
const AccountsModel = require('../libs/mongoose').AccountsModel;

router.get('/', (req, res) =>
  AccountsModel.find((err, operations) => {
    if (!err) {
      return res.send(operations);
    }
    res.statusCode = 500;
    return res.send({ error: 'Server error' });
  })
);

module.exports = router;
