const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

mongoose.connect('mongodb://localhost:27017/moneyTrackerDB', { useNewUrlParser: true, useUnifiedTopology: true });

const transactionSchema = new mongoose.Schema({
    amount: Number,
    description: String,
    type: String
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    Transaction.find({}, (err, transactions) => {
        let balance = 0;
        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                balance += transaction.amount;
            } else {
                balance -= transaction.amount;
            }
        });
        res.render('index', { transactions, balance });
    });
});

app.post('/addTransaction', (req, res) => {
    const { amount, description, type } = req.body;

    const newTransaction = new Transaction({
        amount,
        description,
        type
    });

    newTransaction.save((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});