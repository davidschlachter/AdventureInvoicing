'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
export const ExpenseSchema = new Schema({
  date: Date,
  description: String,
  amount: Number
});
 
//export our module to use in server.js
module.exports = mongoose.model('Expense', ExpenseSchema);