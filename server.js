var express = require('express');
var app = express();

function getClientIp(req) {
  var ipAddress;
  // The request may be forwarded from local web server.
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // If request was not forwarded
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
}

function getLanguage(req){
	return req.headers['accept-language'].split(',')[0];
	// return accepts(req).languages();
}

function getSoftware(req){
	//REGEX Explanation
	// 	\( : match an opening parentheses
	// ( : begin capturing group
	// [^)]+: match one or more non ) characters
	// ) : end capturing group
	// \) : match closing parentheses
	var regExp = /\(([^)]+)\)/;
	var matches = regExp.exec(req.headers['user-agent']);
	return matches[1];
}

app.get('/', function(req, res){
	var obj = {
		ipaddress: getClientIp(req),
		language: getLanguage(req),
		software: getSoftware(req)
	};
	res.writeHead(200, {"Content-Type": "application/json"});
	res.json(obj);
});

app.listen(8080);