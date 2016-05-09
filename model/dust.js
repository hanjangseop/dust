var mongoose = require('mongoose');
require('mongoose-moment')(mongoose);

var schema = mongoose.Schema({
  date: 'Moment',
  dustvalue: Number
}, {collection: 'dust'});

module.exports = mongoose.model('dust', schema);
