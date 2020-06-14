var fs = require('fs');
var jwt = require('jsonwebtoken');
var privateKey = fs.readFileSync('cert/informal-repos-list.2020-06-14.private-key.pem');

var payload = {
    iat: Math.round(new Date().getTime()/1000),
    exp: Math.round(new Date().getTime()/1000) + (60 * 60 * 24),
    iss: 68614
  }

var token = jwt.sign(payload, privateKey, { algorithm: 'RS256'});


console.log(token)