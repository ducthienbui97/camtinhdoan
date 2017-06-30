/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// var mysql = require('mysql');
// var db = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'toilanvd',
//   password : 'camtinhdoan',
//   database : 'camtinhdoan'
// });
// db.connect();
// // Can use db.end() to disconnect database

var http = __webpack_require__(5);
var fs = __webpack_require__(4);
var path = __webpack_require__(7);
var express = __webpack_require__(3);
var morgan = __webpack_require__(6);
var bodyParser = __webpack_require__(2);
var exec = __webpack_require__(0).exec;
var execFile = __webpack_require__(0).execFile;
var assert = __webpack_require__(1);
var async = __webpack_require__(13);
var phantom = __webpack_require__(14);

var coccoc_url = "http://coccoc.com/search#query=%C4%91o%C3%A0n+thanh+ni%C3%AAn";
var search_depth = 1;
var accept_website = ['doanthanhnien.vn', 'tapchicongsan.org.vn', 'tinhdoan.quangbinh.gov.vn', 'chogao.edu.vn', 'vungtau.baria-vungtau.gov.vn', 'hpu.edu.vn'];

function typeOf(obj) {
	return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
}

function getDateTime(callback) {

	var date = new Date();

	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;

	var min = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	var sec = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;

	var year = date.getFullYear();

	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;

	var day = date.getDate();
	day = (day < 10 ? "0" : "") + day;

	callback(day + "/" + month + "/" + year + " - " + hour + ":" + min + ":" + sec);
}

var generate = {
	random_string: function random_string(limit, callback) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < limit; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}callback(text);
	},
	random_number: function random_number(limit, callback) {
		callback(Math.floor(Math.random() * limit));
	}
};

function get_page(url, callback) {
	phantom.create().then(function (ph) {
		ph.createPage().then(function (page) {
			page.open(url).then(function (status) {
				if (status == 'success') {
					page.property('content').then(function (content) {
						page.close().then(function () {
							callback(content);
							ph.exit();
						});
					});
				} else {
					page.close().then(function () {
						callback('nothing');
						ph.exit();
					});
				}
			});
		});
	});
}

function check_accept_website(link) {
	for (var i = 0; i < accept_website.length; i++) {
		if (link.indexOf(accept_website[i]) > -1) return true;
	}
	return false;
}

function check_valid_line(line) {
	var minimum_words = 6;

	var words = line.split(' ');

	var vietnamese_words = 0;
	for (var i = 0; i < words.length; i++) {
		for (var j = 0; j < words[i].length; j++) {
			if (encodeURIComponent(words[i][j]).length > 3) {
				vietnamese_words++;
				break;
			} else if (!(words[i][j] >= 'a' && words[i][j] <= 'z' || words[i][j] >= 'A' && words[i][j] <= 'Z')) break;else if (j == words[i].length - 1) vietnamese_words++;
		}
	}
	if (vietnamese_words < minimum_words || 9 * vietnamese_words < 4 * words.length) return false;
	// console.log(vietnamese_words+"///////"+words.length+" : "+line);

	return true;
}

function check_valid_startend_line(line) {
	var minimum_words = 21;

	var words = line.split(' ');

	var vietnamese_words = 0;
	for (var i = 0; i < words.length; i++) {
		for (var j = 0; j < words[i].length; j++) {
			if (encodeURIComponent(words[i][j]).length > 3) {
				vietnamese_words++;
				break;
			} else if (!(words[i][j] >= 'a' && words[i][j] <= 'z' || words[i][j] >= 'A' && words[i][j] <= 'Z')) break;else if (j == words[i].length - 1) vietnamese_words++;
		}
	}
	if (vietnamese_words < minimum_words || 5 * vietnamese_words < 4 * words.length) return false;
	// console.log(vietnamese_words+"///////"+words.length+" : "+line);

	return true;
}

function check_valid_tag(word) {
	var valid_tag = ['span', '/span', 'p', '/p', 'div', '/div', 'em', '/em', 'b', '/b', 'sup', '/sup'];

	for (var i = 0; i < valid_tag.length; i++) {
		if (word.substr(0, valid_tag[i].length) == valid_tag[i]) return true;
	}return false;
}

function extract_information(content_page, keyword, question, callback) {
	var article = "";

	var redundant_tag = ['<i>', '</i>', '<em>', '</em>', '<strong>', '</strong>', '<u>', '</u>', '<b>', '</b>'];
	var new_content_page, content;
	for (var i = 0; i < redundant_tag.length; i++) {
		new_content_page = '';
		content = content_page.split(redundant_tag[i]);
		for (var j = 0; j < content.length; j++) {
			if (j > 0) new_content_page += ' ';
			new_content_page += content[j];
		}
		content_page = new_content_page;
	}

	content_page = content_page.split('<');content = [];
	for (var i = 0; i < content_page.length; i++) {
		if (content_page[i].substr(content_page[i].length - 1) != '>' && content_page[i].substr(0, 3) != 'img') {
			content.push(content_page[i]);
		}
	}

	var draft = "";
	var start_article = false,
	    short_paragraph = 0,
	    short_paragraph_length = 140,
	    short_paragraph_limit = 7;
	for (var i = 0; i < content.length; i++) {
		if (content[i].split('>').length > 1 && //check_valid_tag(content[i].split('>')[0]) && 
		check_valid_line(content[i].split('>')[1])) {
			if (content[i].split('>')[1].indexOf(keyword) > -1 && check_valid_startend_line(content[i].split('>')[1])) start_article = true;
			if (start_article) {
				draft += "<p>";
				draft += content[i].split('>')[1];
				draft += "</p>\n";
			}

			if (content[i].split('>')[1].length <= short_paragraph_length && content[i].split('>')[1].indexOf(keyword) == -1) short_paragraph++;else short_paragraph = 0;
			if (short_paragraph > short_paragraph_limit) draft = "";

			if (content[i].split('>')[1].indexOf(keyword) > -1 && check_valid_startend_line(content[i].split('>')[1])) {
				article += draft;
				draft = "";
			}
		} else if (content[i].split('>').length == 1 && check_valid_line(content[i])) {
			if (content[i].indexOf(keyword) > -1 && check_valid_startend_line(content[i])) start_article = true;
			if (start_article) {
				draft += "<p>";
				draft += content[i];
				draft += "</p>\n";
			}

			if (content[i].length <= short_paragraph_length && content[i].indexOf(keyword) == -1) short_paragraph++;else short_paragraph = 0;
			if (short_paragraph > short_paragraph_limit) draft = "";

			if (content[i].indexOf(keyword) > -1 && check_valid_startend_line(content[i])) {
				article += draft;
				draft = "";
			}
		}
	}

	var appearance = 0,
	    num_of_words = keyword.split(' ').length,
	    limit = 7;
	for (var i = 0; i < article.length; i++) {
		if (article.substr(i, keyword.length) == keyword) appearance++;
	}if (appearance * num_of_words < limit) callback("", -1);else {
		appearance = 0;
		for (var i = 0; i < article.length; i++) {
			if (article.substr(i, 'thanh niên'.length) == 'thanh niên' || article.substr(i, 'Đoàn'.length) == 'Đoàn') appearance++;
		}if (appearance < 6) callback("", -1);else {
			var words = question.split(' ');
			appearance = 0;
			for (var i = 0; i < words.length; i++) {
				var seq = '';
				for (var j = i; j < Math.min(i + 4, words.length); j++) {
					if (j > i) seq += ' ';
					seq += words[j];

					if (j > i) {
						var have = false;
						for (var k = 0; k < article.length; k++) {
							if (article.substr(k, seq.length) == seq) {
								have = true;
								break;
							}
						}
						if (!have || j == Math.min(i + 4, words.length) - 1) {
							if (!have) appearance += j - i;else appearance += j - i + 1;
							break;
						}
					}
				}
			}
			callback(article, appearance);
		}
	}
}

function find_by_keyword(question, keyword, wlen, callback) {
	// console.log(keyword);
	var words = keyword.split(' ');
	var url = coccoc_url;
	for (var i = 0; i < words.length; i++) {
		url += '+';
		for (var j = 0; j < words[i].length; j++) {
			url += encodeURIComponent(words[i][j]);
		}
	}

	var link_per_page = 10,
	    link_cnt = 0;
	var optimum_content = "nothing",
	    appearance = -1;
	for (var depth = 1; depth <= search_depth; depth++) {
		var new_url = depth > 1 ? url + '&page=' + depth : url;
		get_page(new_url, function (search_page) {
			var search_page_lines = search_page.split('\n');
			var search_link_identifier = '<a data-element-type="title" data-click-type="External" class="log-click" target="_blank" href="http';
			// console.log(search_page);
			for (var i = 0; i < search_page_lines.length; i++) {
				if (search_page_lines[i].indexOf(search_link_identifier) > -1) {
					var content_link = search_page_lines[i].split('href="')[1].split('"')[0];
					// console.log(content_link);
					if (check_accept_website(content_link)) {
						console.log(content_link);
						get_page(content_link, function (content_page) {
							extract_information(content_page, keyword, question, function (article, appear) {
								if (appear > appearance || appear == appearance && article.length > optimum_content.length) {
									optimum_content = article;
									appearance = appear;
								}
								//
								link_cnt++;
								if (link_cnt == link_per_page * search_depth) callback(optimum_content, keyword, wlen, appearance);
							});
						});
						// break;
					} else {
						link_cnt++;
						if (link_cnt == link_per_page * search_depth) callback(optimum_content, keyword, wlen, appearance);
					}
				}
				// else if(i == search_page_lines.length-1 && depth==search_depth+1) callback(optimum_content,keyword,wlen,appearance);
			}
		});
	}
}

function remove_common_words(line, callback) {
	var remove_character = ['"', "'", ',', '.', '?', '!', '(', ')', '&', '-', '+', ':', ';', '<', '>'];
	var words, new_line;
	for (var i = 0; i < remove_character.length; i++) {
		words = line.split(remove_character[i]);
		new_line = '';
		for (var j = 0; j < words.length; j++) {
			new_line += words[j];
		}line = new_line;
	}

	words = line.split(' ');new_line = '';
	for (var i = 0; i < words.length; i++) {
		if (words[i] != '') {
			if (new_line != '') new_line += ' ';
			new_line += words[i];
		}
	}line = new_line;

	var remove_words = ['Đoàn', 'đoàn', 'ĐOÀN', 'TNCS', 'tncs', 'thanh', 'niên', 'Thanh', 'Niên', 'THANH', 'NIÊN', 'Hồ', 'HỒ', 'hồ', 'Chí', 'CHÍ', 'chí', 'Minh', 'MINH', 'minh'];
	for (var i = 0; i < remove_words.length; i++) {
		words = line.split(' ');
		new_line = '';
		for (var j = 0; j < words.length; j++) {
			if (words[j] != remove_words[i]) {
				if (new_line != '') new_line += ' ';
				new_line += words[j];
			}
		}line = new_line;
	}

	callback(line);
}

exports.answer = function (question, callback) {
	if (question == '') callback('nothing');else {
		remove_common_words(question, function (new_question) {
			console.log(new_question);
			var words = new_question.split(' ');
			var result = [],
			    word_len = -1,
			    appearance = -1;
			var cnt = 0,
			    optimum_content = "nothing";

			var timer = 0;
			for (var i = 0; i < words.length; i++) {
				for (var j = i + 1; j < Math.min(words.length, i + 4); j++) {
					timer++;
				}
			}

			console.log(timer + ' *** ');

			for (var i = 0; i < words.length; i++) {
				var sub_question = "";
				for (var j = i; j < Math.min(i + 4, words.length); j++) {
					if (j > i) sub_question += ' ';
					sub_question += words[j];
					if (j > i) {
						find_by_keyword(new_question, sub_question, j - i + 1, function (answer_by_keyword, sub_ques, wlen, appear) {
							console.log('******    ' + sub_ques + '    ******');
							// if((wlen>word_len && answer_by_keyword!="nothing") || 
							// 	(wlen==word_len && optimum_content.length < answer_by_keyword.length)){
							if (answer_by_keyword != "nothing" && (appearance < appear || appearance == appear && word_len * optimum_content.length < wlen * answer_by_keyword.length)) {
								optimum_content = answer_by_keyword;
								word_len = wlen;
								appearance = appear;
							}
							if (answer_by_keyword != "nothing") {
								result.push(answer_by_keyword);
								// console.log(answer_by_keyword);
								console.log('++++++    ' + sub_ques + '    ++++++  ' + appearance);
							}

							cnt++;
							if (cnt == timer) {
								console.log("result = " + result.length);
								callback(optimum_content);
							}
						});
					}
				}
			}
		});
	}
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("casper");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("utils");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var http = __webpack_require__(5);
var fs = __webpack_require__(4);
var path = __webpack_require__(7);
var express = __webpack_require__(3);
var morgan = __webpack_require__(6);
var bodyParser = __webpack_require__(2);
var exec = __webpack_require__(0).exec;
var assert = __webpack_require__(1);
var app = express();
var cookieParser = __webpack_require__(10);

var port = process.env.YOUR_PORT || process.env.PORT || 8888;

var admin_password = "???";

var action = __webpack_require__(8);

var extensions = ['.html', '.css', '.js', '.jpg', '.png', '.mp3', '.mp4', '.ico', '.txt', '.pdf', '.zip'];

var forbid = ['/server.js', '/action.js', '/mysql_queries.txt'];

function check_invalid_input(req, res, next) {
	if (req.url.indexOf('"') > -1 || req.url.indexOf("'") > -1) res.end("Request contains invalid character!");else next();
}

app.use(check_invalid_input);
app.use(morgan('dev')); // to print action to console in a pretty form
app.use(bodyParser());
app.use(bodyParser.json()); // if request body has json data, 
// then convert it to a simpler form to use in javascript

app.use(cookieParser()); // secret key
app.use(express.static('./src/public'));

app.get('*', function (req, res) {
	res.sendFile('index.html', { root: './src/public' });
});

app.post('/ask', function (req, res) {
	console.log(req.body);
	action.answer(req.body.question, function (answer) {
		res.send(answer);
		//res.end('<!DOCTYPE html>\n<html>\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n</head>\n<body>\n'+answer+'</body>\n</html>\n');
	});
});

app.get('/ask1', function (req, res) {
	var Scraper = function Scraper(url) {
		var casper = __webpack_require__(9).create();
		var currentPage = 1;
		var links = [];

		var getLinks = function getLinks() {
			var rows = document.querySelectorAll('h3 a');
			links = [];

			for (var i = 0, e; e = rows[i]; i++) {
				console.log(i);
				var link = {};
				link['title'] = e.innerText;
				link['url'] = e.getAttribute('href');
				links.push(link);
			}
			return links;
		};

		var terminate = function terminate() {
			return this.echo("Terminating...").exit();
		};

		var getSelectedPage = function getSelectedPage() {
			var p = document.querySelector('a.active.no-log');
			return parseInt(p.textContent);
		};

		var processPage = function processPage() {
			links = this.evaluate(getLinks);
			__webpack_require__(11).dump(links);

			if (currentPage >= 5 || !this.exists('h3 a')) {
				return terminate.call(casper);
			}

			currentPage++;

			this.thenClick('.next').then(function () {
				this.waitFor(function () {
					return currentPage === this.evaluate(getSelectedPage);
				}, processPage, terminate);
			});
		};

		casper.start(url);
		casper.waitForSelector('h3 a', processPage);
		casper.run();
	};

	s = new Scraper("https://coccoc.com/search#query=bai+thu+hoach+cam+tinh+doan");
	console.log(s);
	res.end(s);
});

app.listen(port, function () {
	console.log('Server running at port ' + port);
}); // start the server and print the status to the console

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("async");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("phantom");

/***/ })
/******/ ]);