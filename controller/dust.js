var Dust = require('../model/dust'),
    Moment = require('moment')
    require('moment/locale/ko');

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
    var results = [];
    for(var i = -5; i <= 0; i++) {
      var result = yield aggregate([{
        $match: {
          date: {
            $gte: new Moment().add(i, 'hours').startOf('hour').valueOf(),
            $lte: new Moment().add(i, 'hours').endOf('hour').valueOf()
          }
        }
      }, {
        $group: {
          _id: new Moment().add(i, 'hours').startOf('hour').valueOf(),
          dustvalue: { $avg: "$dustvalue" }
        }
      }]);
      results.push(result);
    }
    this.body = results;
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
