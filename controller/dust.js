var Dust = require('../model/dust'),
    Moment = require('moment')
    require('moment/locale/kr');

module.exports = {
  all: function *(next) {
    if('GET' != this.method) return yield next;
    this.body = yield Dust.find().limit(30).sort({date:-1});
  },
  add: function *(next) {
    if('GET' != this.method) return yield next;
    var dust = new Dust({
      date: new Moment(),
      dustvalue: this.params.data
    });
    yield dust.save();
    this.body = 'dust density:' + this.params.data;
  },
  avg: function *(next) {
    if('GET' != this.method) return yield next;
    var result = yield aggregate([{
      $match: {
        date: {
          $lt: new Moment().startOf('hour').valueOf(),
          $gt: new Moment().endOf('hour').valueOf()
        }
      },
      $group: {
        _id: null,
        date: new Moment().startOf('hour').valueOf(),
        dustvalue: { $avg: $dustvalue }
      }
    }]);
    this.body = result;
  }
}

function aggregate(arg) {
  return new Promise(function(resolve, reject) {
    Dust.aggregate(arg, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
