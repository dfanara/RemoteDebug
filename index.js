var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var rando = require('randomstring');

app.use(bodyParser.json({limit: '2mb'}));
app.set('view engine', 'jade');

app.post('/report', function(req, res) {
	console.log('new request!');
	console.log(req.body.log.length);
	var name = rando.generate(6);
	console.log(name);
	fs.writeFile("reports/" + name + ".json", JSON.stringify(req.body, null, 4));
	res.send({url: "http://rdb.shdwlf.com/" + name});
});

app.get('/:id', function(req, res){
	res.render('report');
});

app.get('/', function(req, res) {
	console.log('index');
	res.send("wooho");
});

app.listen(8001, function() {
	console.log("Listening on port 8001");
});
