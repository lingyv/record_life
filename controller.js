'use strict';

let Koa = require('koa');
let app = new Koa();
const router = require('koa-router')();
let event = require('./service/event');

// time
app.use(function *(next){
  let start = new Date;
  yield next;
  let ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});

// logger
app.use(function *(next){
  let start = new Date;
  yield next;
  let ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

//记录事件接口,请求格式 --> http://localhost:3000/event?e=阅读《SICP》&d=2hr
router.get('/event', async (ctx, next) => {
    let param = ctx.query.e || ':';
    let [e,d] = param.split(':');
    ctx.response.type = 'application/json';
    ctx.response.body = {
        event: e,
        duration: d
    }
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
