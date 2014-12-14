var http = require("http");
var https = require("https");

/**
 * postJSON:  REST post request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.postJSON = function (options, dataString, onResult) {
    var req = http.request(options, function (res) {
        res.setEncoding('utf-8');
        var responseString = '';
        res.on('data', function (data) {
            responseString += data;
        });
        res.on('end', function () {
            var resultObject = JSON.parse(responseString);
            onResult(res.statusCode, resultObject);
        });
    });
    req.on('error', function (e) {
        console.log('HTTP Post error: ' + err.message);
    });
    req.write(dataString);
    req.end();
};