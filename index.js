var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var rando = require('randomstring');

function friendlyTimestamp() {
  var time = (new Date() + "").split(" ");
  time.splice(5);
  var t = "";
  for(var i = 0; i < time.length; i++) {
    t = t + time[i] + " ";
  }
  return t.trim();
}

app.use(bodyParser.json({limit: '2mb'}));
app.use(function(req, res, next) {
	if(req.headers['cf-connecting-ip']) {
    req._ip = req.headers['cf-connecting-ip'];
  }else {
    req._ip = req.ip;
  }

	console.log("[" + friendlyTimestamp() + "] " + req.path + " " + req.method + " " + req._ip);
	next();
});
app.set('view engine', 'jade');

app.post('/report', function(req, res) {
	var name = rando.generate(6);
	var dat = req.body;
	dat.ip = req._ip;
	fs.writeFile("reports/" + name + ".json", JSON.stringify(req.body, null, 4));
	res.send({url: "http://rdb.shdwlf.com/" + name});
});

app.get('/:id', function(req, res){
	if(fs.existsSync('./reports/' + req.params.id + ".json")) {
		res.render('report', {data: require('./reports/' + req.params.id + ".json")});
	}else {
		res.status(404).send("That report was not found.");
	}
});

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/contact', function(req, res) {
	res.render('contact');
});

app.listen(8001, function() {
	console.log("Listening on port 8001");
});
