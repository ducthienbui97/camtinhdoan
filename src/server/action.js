// var mysql = require('mysql');
// var db = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'toilanvd',
//   password : 'camtinhdoan',
//   database : 'camtinhdoan'
// });
// db.connect();
// // Can use db.end() to disconnect database

var http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var execFile = require('child_process').execFile;
var assert = require('assert');
var async = require('async');
var phantom = require('phantom');

var coccoc_url = "http://coccoc.com/search#query=%C4%91o%C3%A0n+thanh+ni%C3%AAn";
var search_depth = 1;
var accept_website = ['doanthanhnien.vn','tapchicongsan.org.vn','tinhdoan.quangbinh.gov.vn',
					'chogao.edu.vn', 'vungtau.baria-vungtau.gov.vn', 'hpu.edu.vn', 'wikipedia.org'];

function typeOf (obj) {
	return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
}

function getDateTime(callback) {

	    var date = new Date();

	    var hour = date.getHours();
	    hour = (hour < 10 ? "0" : "") + hour;

	    var min  = date.getMinutes();
	    min = (min < 10 ? "0" : "") + min;

	    var sec  = date.getSeconds();
	    sec = (sec < 10 ? "0" : "") + sec;

	    var year = date.getFullYear();

	    var month = date.getMonth() + 1;
	    month = (month < 10 ? "0" : "") + month;

	    var day  = date.getDate();
	    day = (day < 10 ? "0" : "") + day;

	    callback( day + "/" + month + "/" + year + " - " + hour + ":" + min + ":" + sec );
}

var generate = {
	random_string: function(limit,callback){
		var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < limit; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    callback(text);
	},
	random_number: function(limit,callback){
		callback(Math.floor(Math.random() * limit));
	}
};

function get_page(url,callback){
	phantom.create().then(function(ph) {
	  	ph.createPage().then(function(page) {
		    page.open(url).then(function(status) {
				if(status == 'success'){
					page.property('content').then(function(content) {
						page.close().then(function(){
							callback(content);
							ph.exit();
						});
					});
				}
				else{
					page.close().then(function(){
						callback('nothing');
						ph.exit();
					});
				}
		    });
	  	});
	});
}

function check_accept_website(link){
	for(var i=0;i<accept_website.length;i++){
		if(link.indexOf(accept_website[i])>-1) return true;
	}
	return false;
}

function check_valid_line(line){
	var minimum_words = 6;

	var words = line.split(' ');
	
	var vietnamese_words = 0;
	for(var i=0;i<words.length;i++){
		for(var j=0;j<words[i].length;j++){
			if(encodeURIComponent(words[i][j]).length>3){
				vietnamese_words++;
				break;
			}
			else if(!((words[i][j]>='a' && words[i][j]<='z')||
					(words[i][j]>='A' && words[i][j]<='Z'))) break;
			else if(j==words[i].length-1) vietnamese_words++;
		}
	}
	if(vietnamese_words < minimum_words || 9*vietnamese_words < 4*words.length) return false;
	// console.log(vietnamese_words+"///////"+words.length+" : "+line);

	return true;
}

function check_valid_startend_line(line){
	var minimum_words = 21;

	var words = line.split(' ');
	
	var vietnamese_words = 0;
	for(var i=0;i<words.length;i++){
		for(var j=0;j<words[i].length;j++){
			if(encodeURIComponent(words[i][j]).length>3){
				vietnamese_words++;
				break;
			}
			else if(!((words[i][j]>='a' && words[i][j]<='z')||
					(words[i][j]>='A' && words[i][j]<='Z'))) break;
			else if(j==words[i].length-1) vietnamese_words++;
		}
	}
	if(vietnamese_words < minimum_words || 5*vietnamese_words < 4*words.length) return false;
	// console.log(vietnamese_words+"///////"+words.length+" : "+line);

	return true;
}

function check_valid_tag(word){
	var valid_tag = ['span', '/span', 'p', '/p', 'div', '/div', 
					'em', '/em', 'b', '/b', 'sup', '/sup'];

	for(var i=0;i<valid_tag.length;i++)
		if(word.substr(0,valid_tag[i].length)==valid_tag[i]) return true;
	
	return false;
}

function extract_information(content_page,keyword,question,callback){
	var article = "";

	var redundant_tag = ['<i>','</i>','<em>','</em>','<strong>','</strong>','<u>','</u>','<b>','</b>'];
	var new_content_page, content;
	for(var i=0;i<redundant_tag.length;i++){
		new_content_page = '';
		content = content_page.split(redundant_tag[i]);
		for(var j=0;j<content.length;j++){
			if(j>0) new_content_page += ' ';
			new_content_page += content[j];
		}
		content_page = new_content_page;
	}

	content_page = content_page.split('<'); content = [];
	for(var i=0;i<content_page.length;i++){
		if(content_page[i].substr(content_page[i].length-1)!='>' &&
			content_page[i].substr(0,3)!='img'){
			content.push(content_page[i]);
		}
	}

	var draft = "";
	var start_article = false, short_paragraph = 0, short_paragraph_length = 140, short_paragraph_limit = 7;
	for(var i=0;i<content.length;i++){
		if(content[i].split('>').length>1 && //check_valid_tag(content[i].split('>')[0]) && 
			check_valid_line(content[i].split('>')[1])){
			if(content[i].split('>')[1].indexOf(keyword)>-1 && 
				check_valid_startend_line(content[i].split('>')[1])) start_article = true;
			if(start_article){
				draft += "<p>";
				draft += content[i].split('>')[1];
				draft += "</p>";
			}

			if(content[i].split('>')[1].length <= short_paragraph_length && 
				content[i].split('>')[1].indexOf(keyword)==-1) short_paragraph++;
			else short_paragraph = 0;
			if(short_paragraph > short_paragraph_limit) draft = "";

			if(content[i].split('>')[1].indexOf(keyword)>-1 && 
				check_valid_startend_line(content[i].split('>')[1])){
				article += draft;
				draft = "";
			}
		}
		else if(content[i].split('>').length==1 && check_valid_line(content[i])){
			if(content[i].indexOf(keyword)>-1 && 
				check_valid_startend_line(content[i])) start_article = true;
			if(start_article){
				draft += "<p>";
				draft += content[i];
				draft += "</p>";
			}

			if(content[i].length <= short_paragraph_length && 
				content[i].indexOf(keyword)==-1) short_paragraph++;
			else short_paragraph = 0;
			if(short_paragraph > short_paragraph_limit) draft = "";
			
			if(content[i].indexOf(keyword)>-1 &&
				check_valid_startend_line(content[i])){
				article += draft;
				draft = "";
			}
		}
	}

	var appearance = 0, num_of_words = keyword.split(' ').length, limit = 5;
	for(var i=0;i<article.length;i++) if(article.substr(i,keyword.length) == keyword) appearance++;
	if(appearance*num_of_words < limit) callback("",-1,-1);
	else{
		var keyword_appearance = appearance;
		appearance = 0;
		for(var i=0;i<article.length;i++) 
			if(article.substr(i,'thanh niên'.length) == 'thanh niên' ||
				article.substr(i,'Đoàn'.length) == 'Đoàn') appearance++;
		if(appearance < 6) callback("",-1,-1);
		else{
			var words = question.split(' ');
			appearance = 0;
			for(var i=0;i<words.length;i++){
				var seq = '';
				for(var j=i;j<Math.min(i+4,words.length);j++){
					if(j>i) seq += ' ';
					seq += words[j];

					if(j>i){
						var have = false;
						for(var k=0;k<article.length;k++){
							if(article.substr(k,seq.length) == seq){
								have = true;
								break;
							}
						}
						if(!have || j==Math.min(i+4,words.length)-1){
							if(!have) appearance += (j-i);
							else appearance += (j-i+1);
							break;
						}
					}
				}
			}
			callback(article,appearance,keyword_appearance);
		}
	}
}

function find_by_keyword(question,keyword,wlen,callback){
	// console.log(keyword);
	var words = keyword.split(' ');
	var url = coccoc_url;
	for(var i=0;i<words.length;i++){
		url += '+';
		for(var j=0;j<words[i].length;j++) url += encodeURIComponent(words[i][j]);
	}
	
	var keyword_false = false;
	var link_per_page = 10, link_cnt = 0;
	var optimum_content = "nothing", appearance = -1;
	for(var depth=1;depth<=search_depth;depth++){
		var new_url = (depth > 1) ? (url+'&page='+depth) : url;
		get_page(new_url,function(search_page){
			var search_page_lines = search_page.split('\n');
			var search_link_identifier = '<a data-element-type="title" data-click-type="External" class="log-click" target="_blank" href="http';
			for(var i=0;i<search_page_lines.length;i++){
				if(search_page_lines[i].indexOf(search_link_identifier)>-1){
					var content_link = search_page_lines[i].split('href="')[1].split('"')[0];
					if(!keyword_false && check_accept_website(content_link)){
						console.log(content_link);
						get_page(content_link,function(content_page){
							extract_information(content_page,keyword,question,function(article,appear,keyword_appearance){
								if(appear > appearance || 
									(appear == appearance && article.length > optimum_content.length)){
									optimum_content = article;
									appearance = appear;
								}
								else if(keyword_appearance <= 0) keyword_false = true;
								//
								link_cnt++;
								if(link_cnt == link_per_page*search_depth) 
									callback(optimum_content,keyword,wlen,appearance);
							});
						});
						// break;
					}
					else{
						link_cnt++;
						if(link_cnt == link_per_page*search_depth) callback(optimum_content,keyword,wlen,appearance);
					}
				}
				// else if(i == search_page_lines.length-1 && depth==search_depth+1) callback(optimum_content,keyword,wlen,appearance);
			}
		});
	}
}

function remove_common_words(line,callback){
	var remove_character = ['"',"'",',','.','?','!','(',')','&','-','+',':',';','<','>'];
	var words, new_line;
	for(var i=0;i<remove_character.length;i++){
		words = line.split(remove_character[i]);
		new_line = '';
		for(var j=0;j<words.length;j++) new_line += words[j];
		line = new_line;
	}

	words = line.split(' '); new_line = '';
	for(var i=0;i<words.length;i++) 
		if(words[i]!=''){
			if(new_line!='') new_line += ' ';
			new_line += words[i];
		}
	line = new_line;

	var remove_words = ['Đoàn','đoàn','ĐOÀN','TNCS','tncs','thanh','niên','Thanh','Niên','THANH','NIÊN',
						'Hồ','HỒ','hồ','Chí','CHÍ','chí','Minh','MINH','minh'];
	for(var i=0;i<remove_words.length;i++){
		words = line.split(' ');
		new_line = '';
		for(var j=0;j<words.length;j++)
			if(words[j]!=remove_words[i]){
				if(new_line!='') new_line += ' ';
				new_line += words[j];
			}
		line = new_line;
	}

	callback(line);
}

function mutate(content,callback){
	callback(content);
}

function mix_two_paragraph(result,callback){
	var first_para = result[1].split('</p><p>');
	var second_para = result[0].split('</p><p>');
	var content = '';
	content += first_para[0]+'</p>';
	for(var i=1;i<second_para.length-1;i++) content += '<p>'+second_para[i]+'</p>';
	content += '<p>'+first_para[first_para.length-1];
	callback(content);
}

function mix_three_paragraph(result,callback){
	var first_para = result[1].split('</p><p>');
	var second_para = result[0].split('</p><p>');
	var third_para = result[2].split('</p><p>');
	var content = '';
	content += first_para[0]+'</p>';
	for(var i=1;i<second_para.length-1;i++) content += '<p>'+second_para[i]+'</p>';
	content += '<p>'+third_para[third_para.length-1];
	callback(content);
}

exports.answer = function(question,callback){
	if(question == '') callback('nothing');
	else{
		remove_common_words(question,function(new_question){
			console.log(new_question);
			var words = new_question.split(' ');
			var result = [], word_len = -1, appearance = -1;
			var cnt = 0, optimum_content = "nothing";

			var timer = 0;
			for(var i=0;i<words.length;i++){
				for(var j=i+1;j<Math.min(words.length,i+4);j++){
					timer++;
				}
			}

			for(var i=0;i<words.length;i++){
				var sub_question = "";
				for(var j=i;j<Math.min(i+4,words.length);j++){
					if(j>i) sub_question += ' ';
					sub_question += words[j];
					if(j>i){
						find_by_keyword(new_question,sub_question,j-i+1,function(answer_by_keyword,sub_ques,wlen,appear){
							console.log('******    '+sub_ques+'    ******');
							// if((wlen>word_len && answer_by_keyword!="nothing") || 
							// 	(wlen==word_len && optimum_content.length < answer_by_keyword.length)){
							if(answer_by_keyword != "nothing" && (appearance < appear || 
								(appearance == appear &&
								word_len*optimum_content.length < wlen*answer_by_keyword.length))){
								optimum_content = answer_by_keyword;
								word_len = wlen;
								appearance = appear;
							}
							if(answer_by_keyword != "nothing"){
								result.push(answer_by_keyword);
								// console.log(answer_by_keyword);
								console.log('++++++    '+sub_ques+'    ++++++  '+appearance);
							}

							cnt++;
							if(cnt == timer){
								console.log("result = "+result.length);
								if(result.length == 0){
									callback(optimum_content);
								}
								else if(result.length == 1){
									mutate(optimum_content,function(final_answer){
										callback(final_answer);
									});
								}
								else if(result.length == 2){
									for(var i=0;i<result.length;i++){
										if(result[i] == optimum_content){
											var temp = result[i];
											result[i] = result[0];
											result[0] = temp;
											break;
										}
									}
									mix_two_paragraph(result,function(content){
										mutate(content,function(final_answer){
											callback(final_answer);
										});
									});
								}
								else{
									for(var i=0;i<result.length;i++){
										if(result[i] == optimum_content){
											var temp = result[i];
											result[i] = result[0];
											result[0] = temp;
											break;
										}
									}
									mix_three_paragraph(result,function(content){
										mutate(content,function(final_answer){
											callback(final_answer);
										});
									});
								}
							}
						});
					}
				}
			}
		});
	}
}

exports.merge = function(first_para,second_para,callback){
	
	var first_para = first_para.split('\n');
	var result = '';
	console.log(first_para.length);
	for(var i=0;i<first_para.length;i++){
		result += "<p>"+first_para[i]+" bla bla bla</p>\n";
	}

	callback(result);
}