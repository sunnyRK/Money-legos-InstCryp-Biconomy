const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    transactionHash:{
        type: String,
        required: [true, 'transactionHash field is required']
    },
    from:{
        type: String,
        required: [true, 'token0 field is required']
    },
    to:{
        type: String,
        required: [true, 'token1 field is required']
    },
    value:{
        type: String,
        required: [true, 'pairAddress field is required']
    },
    tokenSymbol:{
        type: String,
        required: [true, 'amountIN field is required']
    }
});

const transaction = mongoose.model("InstCrypSchema",TransactionSchema);
module.exports = transaction;
