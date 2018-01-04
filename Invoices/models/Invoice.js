import { ExpenseSchema } from './Expense';
import { PaymentSchema } from './Payment';

'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
export const InvoiceSchema = new Schema({
  date: { type: Date, default: Date.now },
  events: [{
    eventId: String,
    summary: String,
    startTime: Date,
    endTime: Date,
    rate: Number
  }],
  expenses: [ExpenseSchema],
  payments: [PaymentSchema]
});

//export our module to use in server.js
module.exports = mongoose.model('Invoice', InvoiceSchema);