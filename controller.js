'use strict';

var Koa = require('koa');
var app = new Koa();
const router = require('koa-router')();
var event = require('./service/event');

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

//记录事件接口,请求格式 --> http://localhost:3000/event?e=阅读《SICP》&d=2hr
router.get('/event', async (ctx, next) => {
    var e = ctx.query.e || '';
    var d = ctx.query.d || '';
    ctx.response.body = `<h1>Hello, ${e} --> ${d}!</h1>`;
    if (e !== '' && d !== '') {
        event.saveEvent({event : e, duration: d});
    }
});

//根路径应答
router.get('/', async (ctx, next) => {
    ctx.response.body = '<h1>Hello World!</h1>';
});

app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');