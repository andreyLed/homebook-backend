const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/bookkeepingDB');
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to DB!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
});

const Schema = mongoose.Schema;

// Schemas
const operation = new Schema(
  {
    type: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: String, required: true },
    date: { type: Date, required: true },
    comment: { type: String, required: true },
    payment_method: { type: String, required: true }
  },
  { versionKey: false }
);

const Categories = new Schema({
  name: { type: String, required: true }
});

const Accounts = new Schema({
  name: { type: String, required: true }
});


// validation
// Article.path('title').validate(function (v) {
//     return v.length > 5 && v.length < 70;
// });

const OperationModel = mongoose.model('operation', operation);
const CategoriesModel = mongoose.model('Categories', Categories);
const AccountsModel = mongoose.model('Accounts', Accounts);


module.exports.OperationModel = OperationModel;
module.exports.CategoriesModel = CategoriesModel;
module.exports.AccountsModel = AccountsModel;
