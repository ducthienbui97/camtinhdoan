var http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var assert = require('assert');
var app = express();
var cookieParser = require('cookie-parser');

var hostname = "localhost";
var port = 8888;

var admin_password = "camtinhdoan";

var action = require('./action.js');

var extensions = ['.html', '.css', '.js', '.jpg', '.png', '.mp3', '.mp4', '.ico', '.txt', '.pdf', '.zip'];

var forbid = ['/server.js', '/action.js', '/mysql_queries.txt'];

function check_invalid_input(req,res,next){
	if(req.url.indexOf('"')>-1 || req.url.indexOf("'")>-1) res.end("Request contains invalid character!");
	else next();
}

app.use(check_invalid_input);

app.use(morgan('dev')); // to print action to console in a pretty form

app.use(bodyParser());
app.use(bodyParser.json()); // if request body has json data, 
// then convert it to a simpler form to use in javascript

app.use(cookieParser()); // secret key

function givefile(req,res,fileUrl){
	var filePath = path.resolve('.'+fileUrl);
	var fileExt = path.extname(filePath);

	fs.exists(filePath, function(exists){
		if(extensions.indexOf(fileExt)==-1) res.redirect("/");
		else if(!exists) res.redirect("/");
		else if(forbid.indexOf(fileUrl)!=-1) res.redirect("/");
		else fs.createReadStream(filePath).pipe(res);
	});
}

app.get('/', function(req,res){
	givefile(req,res,'/index.html');
});

app.post('/ask', function(req,res){
	action.answer(req.body.question,function(answer){
		console.log(req.body.question);
		res.end(answer);
	});
});

app.get('/*', function(req,res){
	givefile(req,res,req.url);
});

app.listen(port, hostname, function(){
	console.log('Server running at http://' + hostname + ':' + port + '/');
}); // start the server and print the status to the console
