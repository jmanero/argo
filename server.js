var Express = require('express');
var Colors = require('colors');
var HTTP = require('http');
var URL = require('url');

var app = Express.createServer();
app.configure(function() {
	app.use(Express.methodOverride());
	app.use(Express.bodyParser());
	app.use(app.router);
	app.use(Express.static(__dirname + '/www'));
});

app.get('/fetch', function(req, res) {
	var remote = URL.parse(req.param('remote'));
	var data = '';
	var content;

	HTTP.get(remote, function(rres) {
		rres.on('data', function(rdata) {
			data += rdata.toString('utf8');
		});

		rres.on('end', function(rdata) {
			if (rdata)
				data += rdata.toString('utf8');

			content = JSON.parse(data);
			res.write(render(content));
			res.end();
		});

	});
});

app.get('/', function(req, res) {
	res.redirect('/index.html');

});

app.listen(9009, function() {
	console.log("Argo Server Listening on port 9009".green);

});

function render(object) {
	var body = '';

	if (Array.isArray(object)) {
		body += '[\r\n<ol>\r\n';

		for ( var i = 0; i < object.length; i++) {
			body += "<li>" + render(object[i]) + "</li>\r\n";
		}

		body += "</ol>\r\n]\r\n";
	} else if (typeof (object) == 'object') {
		body += '{\r\n<ul>\r\n';

		for ( var i in object) {
			body += "<li>" + i + " : " + render(object[i]) + "</li>\r\n";
		}

		body += "</ul>\r\n}\r\n";
	} else if (typeof (object) == 'function') {
		body += "[function() ...]";
	} else {
		body += object;
	}

	return body;
}
