var mongoose = require('mongoose');
// var log         = require('./log')(module);

mongoose.connect('mongodb://localhost/bookkeepingDB');
var db = mongoose.connection;

db.on('error', function (err) {
    // log.error('connection error:', err.message);
});
db.once('open', function callback() {
    // log.info("Connected to DB!");
    console.log('Connected to DB!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
});

var Schema = mongoose.Schema;

// Schemas
var operation = new Schema(
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

var Categories = new Schema({
    name: { type: String, required: true }
})

var Accounts = new Schema({
    name: { type: String, required: true }
})


// validation
// Article.path('title').validate(function (v) {
//     return v.length > 5 && v.length < 70;
// });

var OperationModel = mongoose.model('operation', operation);
var CategoriesModel = mongoose.model('Categories', Categories);
var AccountsModel = mongoose.model('Accounts', Accounts);


module.exports.OperationModel = OperationModel;
module.exports.CategoriesModel = CategoriesModel;
module.exports.AccountsModel = AccountsModel;
