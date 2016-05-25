var mongoose = require('mongoose');
require('mongoose-moment')(mongoose);

var schema = mongoose.Schema({
  date: 'Moment',
  ad_id: String,
  dustvalue: Number
}, {collection: 'dust'});

module.exports = mongoose.model('dust', schema);
