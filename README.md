# record_life
用于记录生活中的一些事情

记录:
- 每天做的事情及耗时
- 记录消费内容及金额(未开发)

node.js 开发,开放接口用于接收 http 请求,通过 http 请求把需要记录的内容写入到文件中, 每天一个文件, 文件名形如 event_20170707, 并且定时推送到 git 仓库.后续计划添加分析功能，生成日小结，周小结，月小结，季小结，年小结.

文件存放位置: ~/record/yyyy/mm/, 如 ~/record/2017/07/

记录事情及耗时的文件格式形如:
event_20170707.json:

{"date":"2017-07-07", "record":[
  {"event":"阅读《SICP》", "duration":"2hr"，"now":"1506477639382"}
]}

event请求格式:
http://localhost:3000/event?e=read:1hr
