var app = require('koa')(),
    router = require('koa-router')();

router.get('/:data', function *(next) {
  this.body = "dust density : " + this.params.data;
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
  .use(router.routes());

app.listen(4000);
console.log('the app listens on port 4000');
