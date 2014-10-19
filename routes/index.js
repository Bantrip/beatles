
/*
 * GET home page.
 */
 
var bProxy = process.argv.splice(2) == '-p',
    fs = require('fs'),
    http = require('http');

exports.proxy = function (req, res, next) {
    var url = req.url,
        data = '';

    var opt = {
        host: '192.168.217.85',
        port: '8080',
        method: req.method,
        path: url
    }
    // console.log(url);

    if (bProxy) {
        var reqst = http.request(opt, function(result) {
          result.setEncoding('utf8');
          result.on('data', function (chunk) {
            data += chunk;
          });
          result.on('end', function () {
            res.send(JSON.parse(data));
          });
        });
        reqst.on('error', function(e) {
          res.send(e.message)
        });
        reqst.end();
    } else {
        url = url.split('?')[0];
        fs.readFile('.' + url, function(err, data) {
            data = JSON.parse(data);
            res.send(data);
        });
    }
    
};
