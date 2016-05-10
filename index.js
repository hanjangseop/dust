var app = require('koa')(),
    router = require('koa-router')(),
    mongoose = require('mongoose'),
    render = require('koa-ejs'),
    dust = require('./controller/dust'),
    request = require('co-request'),
    Moment = require('moment'),
    less = require('koa-less'),
    serve = require('koa-static'),
    path = require('path'),
    cors = require('koa-cors');

mongoose.connect("mongodb://localhost:27017/dust");
var db = mongoose.connection;
db.on('error', function(e) {
  console.error(e);
});
db.once('open', function() {
  console.log('connected to DB');
});

router.get('/data/:data', dust.add);
router.get('/all', dust.all);
router.get('/avg', dust.avg);
router.get('/', function *(next) {
  var res = yield request({
    method: 'GET',
    uri: 'http://localhost:4000/all'
  });
  yield this.render('home', {
    data: JSON.parse(res.body),
    Moment: Moment
  });
});

render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'layout',
  viewExt: 'ejs',
  cache: false,
  debug: true
});

app
  .use(function* logger(next){
    var start = new Date;
    yield next;
    var used = new Date - start;
    console.log('%s %s %s %sms',
      this.method,
      this.originalUrl,
      this.status, used);
  })
  .use(less(path.join(__dirname, 'public')))
  .use(serve(path.join(__dirname, 'public')))
  .use(cors({'origin': true}))
  .use(router.routes());

app.listen(4000);
console.log('the app listens on port 4000');
