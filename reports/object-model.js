const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
 _id :  Number,            // unique id
  name: { type: String, default: ""},
  units: { type: String, default: ""},
  fn: { type: String, default: "...."},     //Fx
  args: { type: String, default: "...."},   //Fx args: like '0;1;2;3;4;5;6;7;8;9;10'
  format: { type: Number, default: 1},         //round to decimal places 
  security: { type: Number, default: 100},
  enabled: { type: Boolean, default: true},
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('objects', model); 