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
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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

function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

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

exports.answer = function(question,callback){
	if(words == '') callback('nothing');
	else{
		var words = question.split(' ');

		var url = "http://coccoc.com/search#query=";
		for(var i=0;i<words.length;i++){
			if(i>0) url += '+';
			for(var j=0;j<words[i].length;j++) url += encodeURIComponent(words[i][j]);
		}

		get_page(url,function(search_page){
			var search_page_lines = search_page.split('\n');
			var search_link_identifier = '<a data-element-type="title" data-click-type="External" class="log-click" target="_blank" href="http';
			for(var i=0;i<search_page_lines.length;i++){
				if(search_page_lines[i].indexOf(search_link_identifier)>-1){
					get_page(search_page_lines[i].split('href="')[1].split('"')[0],function(content_page){
						callback(content_page);
					});
					break;
				}
			}
		})
	}
}