import { InvoiceSchema } from './Invoice';
import { ExpenseSchema } from './Expense';
import { PaymentSchema } from './Payment';

'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
var ClientSchema = new Schema({
  _id: Schema.ObjectId,
  name: String,
  emails: Array,
  currentBalance: Number,
  invoices: [InvoiceSchema],
  pendingExpenses: [ExpenseSchema],
  pendingPayments: [PaymentSchema]
});
 
//export our module to use in server.js
module.exports = mongoose.model('Client', ClientSchema);