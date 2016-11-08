const express = require('express');

const router = express.Router();
const CategoriesModel = require('../libs/mongoose').CategoriesModel;

router.get('/', (req, res) =>
  CategoriesModel.find((err, categories) => {
    if (!err) {
      return res.send(categories);
    }
    res.statusCode = 500;
    return res.send({ error: 'Server error' });
  })
);

module.exports = router;
