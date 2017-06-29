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

var port = process.env.YOUR_PORT || process.env.PORT || 8888;

var admin_password = "???";

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
app.use(express.static('./src/public'));

app.get('*', function(req,res){
	res.sendFile('index.html',{root:'./src/public'});
});

app.post('/ask', function(req,res){
	console.log(req.body);
	action.answer(req.body.question,function(answer){
		res.send(answer);
		//res.end('<!DOCTYPE html>\n<html>\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n</head>\n<body>\n'+answer+'</body>\n</html>\n');
	});
});

app.get('/ask1', function(req,res){
	var Scraper = function(url) {
	    var casper = require('casper').create();
	    var currentPage = 1;
	    var links = [];

	    var getLinks = function() {
	        var rows = document.querySelectorAll('h3 a');
	        links = [];

	        for (var i = 0, e; e = rows[i]; i ++) {
	            console.log(i);
	            var link = {};
	            link['title'] = e.innerText;
	            link['url'] = e.getAttribute('href');
	            links.push(link);
	        }
	        return links;
	    };

	    var terminate = function() {
	        return this.echo("Terminating...").exit();
	    }

	    var getSelectedPage = function() {
	        var p = document.querySelector('a.active.no-log');
	        return parseInt(p.textContent);
	    }

	    var processPage = function() {
	        links = this.evaluate(getLinks);
	        require('utils').dump(links);

	        if (currentPage >= 5 || !this.exists('h3 a')) {
	            return terminate.call(casper);
	        }

	        currentPage ++;
	        
	        this.thenClick('.next').then(function() {
	            this.waitFor(function() {
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


app.listen(port, function(){
	console.log('Server running at port ' + port);
}); // start the server and print the status to the console
