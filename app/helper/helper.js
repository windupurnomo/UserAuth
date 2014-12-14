var fs = require('fs');
var fileName = './data/basketball.zr';
var u = require("underscore");
var config = rootRequire('config');

exports.arrayProcessing = {
    findObjectByKey :  function(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                array[i].index = i;
                return array[i];
            }
        }
        return null;
    },

    queryData : function (array, key, value) {
        var result = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                result.push(array[i]);
            }
        }
        return result;
    },
};

exports.matchProcessor = {
    getMatch : function() {
        try{
            var str = fs.readFileSync(fileName);
            return str === undefined ? [] : JSON.parse(str);
        }catch(ex){
            return [];
        }
    },

    getMatchById : function(id) {
        var str = fs.readFileSync(fileName);
        var dbMatch = str === undefined ? [] : JSON.parse(str);
        var match = u.findWhere(dbMatch, {id: id});
        match.remaining = config.matchConfig.MATCH_DURATION;
        return match;
        //return findObjectByKey(dbMatch, 'id', id);
    },

    saveMatch : function(matchData) {
        var str = fs.readFileSync(fileName);
        var dbMatch = str === undefined ? [] : JSON.parse(str);
        //var obj = u.findWhere(dbMatch, {id: matchData.id});
        var obj = findObjectByKey(dbMatch, 'id', matchData.id);
        if (obj == null) {
            dbMatch.push(matchData);
        } else {
            dbMatch[obj.index] = matchData;
        }
        str = JSON.stringify(dbMatch);
        fs.writeFile(fileName, str, function(err) {
            if (err) console.log("Write file error: " + err);
            else console.log("Succeed write file...");
        });
    },

    sendToGMS: function (data) {
        var winner = 0;
        if (data.ao.score > data.aka.score) winner = data.ao.id;
        else data.aka.id;
        var obj = {
            "id_match_header": data.id,
            "aka_player": data.aka.id,
            "ao_palyer": data.ao.id,
            "aka_score": data.aka.score,
            "aka_c1": data.aka.c1,
            "aka_c2": data.aka.c2,
            "ao_score": data.ao.score,
            "ao_c1": data.ao.c1,
            "ao_c2": data.ao.c2,
            "winner": winner
        };
        var param = encodeURIComponent(JSON.stringify(obj));
        var headers = {
            'Content-Type': 'application/json',
            'Content-Length': param.length
        };
        var opt = {
            host: gmsHost,
            port: 80,
            path: '/vgms/index.php/api/karateapi/insertKarate/json/' + param,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        restGet.getJSON(opt, function(statusCode, result) {
            console.log('statuscode: ' + statusCode + '  result: ' + result);
        });
    }
};


var findObjectByKey = function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            array[i].index = i;
            return array[i];
        }
    }
    return null;
};