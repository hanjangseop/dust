var Dust = require('../model/dust'),
    Moment = require('moment');

module.exports = {
  all: function *(next) {
    if('GET' != this.method) return yield next;
    this.body = yield Dust.find().limit(30).sort({date:1});
  },
  add: function *(next) {
    if('GET' != this.method) return yield next;
    var dust = new Dust({
      date: new Moment(),
      dustvalue: this.params.data
    });
    yield dust.save();
    this.body = 'dust density:' + this.params.data;
  }
}
