'use strict';

let path = require('path');
var fs = require("fs") ;

/**
 * 保存事件记录
 * @return undefined
 */
function saveEvent(event) {
	// let event = {event:"阅读《SICP》", duration:"2hr"};
	event.now = Date.now();
	saveEventFile(event, timeZoneDate(8));
}

/**
 * 保存事件记录到文件中,文件存放位置: ~/record/yyyy/mm/, 如 ~/record/2017/07/
 * @param  {[type]} newEvent 新的事件
 * @param  {[type]} now      时间
 * @return
 */
function saveEventFile(newEvent, now) {
	let homePath = process.env.HOME;	//根据环境变量获取 home path
	let fileName = 'event_' + now.year + now.month + now.date + '.json';	//文件名
	let dirPath = path.join(homePath, 'record', now.year, now.month);	//文件夹路径
	let filePath = path.join(dirPath, fileName);	//文件路径
	if (fs.existsSync(filePath)) {
		readAndWrit(filePath, newEvent);	//读取文件并写入
	} else {
		createAndWrit(dirPath, newEvent, filePath, now);	//创建文件并写入
	}
}

/**
 * 追加写入
 * @param  {[type]} filePath 文件路径
 * @param  {[type]} newEvent 新事件
 * @return
 */
function readAndWrit(filePath, newEvent) {
	fs.readFile(filePath, 'utf-8', (err, data) => {
	    if (err) {	//记录错误信息
	        console.log(err);
	        console.log(JSON.stringify(newEvent));
	    } else {	//读取旧记录,添加新纪录,写回文件
	        let record = JSON.parse(data);
	        record.record.push(newEvent);
	        fs.writeFile(filePath, JSON.stringify(record), (err) => {	//写入文件
			    if (err) {
			        console.log(err);
			    }
			});
    	}
	});
}

/**
 * 创建文件并写入
 * @param  {[type]} dirPath  目录地址
 * @param  {[type]} newEvent 新事件
 * @param  {[type]} filePath 文件地址
 * @param  {[type]} now      现在时间
 * @return
 */
function createAndWrit(dirPath, newEvent, filePath, now) {
	mkdirDir(dirPath, (err) => {	//创建目录
		if (err) {
			console.log(err);
			console.log(JSON.stringify(newEvent));
		} else {
			let record = {
				date:now.year + '-' + now.month + '-' + now.date,
				record:[newEvent]
			}
	        fs.writeFile(filePath, JSON.stringify(record), (err) => {
			    if (err) {
			        console.log(err);
			    }
			});
		}
	})
}

/**
 * 递归创建目录
 * @param  {[type]}   dirname  目录地址
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function mkdirDir(dirPath, callback) {
    fs.exists(dirPath, (exists) => {
        if (exists) {
            callback();
        } else {
            mkdirDir(path.dirname(dirPath), () => {
                fs.mkdir(dirPath, callback);
            });
        }
    });
}


/**
 * 获取第 i 个时区的当前年月日字符串
 * @param  {number} i [时区] 东 正, 西负
 * @return [当前年月日] {year: "2017", month: "07", date: "07"}
 */
function timeZoneDate(i){
	if (typeof i !== 'number') return;
	let date = new Date(Date.now() + 3600000 * i);
	let month = date.getUTCMonth() + 1;
	return {year: date.getUTCFullYear().toString(),
		month: month < 10 ? '0' + month.toString() : month.toString(),
		date: date.getUTCDate().toString()};
}

module.exports = {saveEvent: saveEvent};