const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const model = new Schema({ 
  report_id :  Number,            // report id
  doc: {},
  current_time: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('report_saves', model); 