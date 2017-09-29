'use strict';

var Koa = require('koa');
var app = new Koa();

const router = require('koa-router')();

// time
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});

// logger
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

router.get('/event', async (ctx, next) => {
    var event = ctx.query.e || '';
    var duration = ctx.query.d || '';
    ctx.response.body = `<h1>Hello, ${event} --> ${duration}!</h1>`;

});

router.get('/', async (ctx, next) => {
    ctx.response.body = '<h1>Hello World!</h1>';
});

app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');