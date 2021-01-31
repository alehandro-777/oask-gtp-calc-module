const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({
 _id :  Number,            // unique id
  name: { type: String, default: "Report Title"},
  full_name: { type: String, default: "...."},
  footer: { type: Number, default: 0},
  header: [],
  rows: [],
  security: { type: Number, default: 100},
  enabled: { type: Boolean, default: true},
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('reports', model); 