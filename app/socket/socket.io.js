var httpRequire = require('http');


module.exports.set = function(io) {
    io.on('connection', function(socket) {
        console.log('a user connected');
        
        socket.on('create:match', function(match) {
            if (matches[match] != undefined) {
                socket.emit('message', 'SERVER', 'Match name already exist');
                return;
            }
            matches[match] = {};
            matches[match].messages = [];
            matches[match].name = match;
            socket.match = match;
            socket.join(match);
            //send message to match admin
            socket.emit('message', 'SERVER', 'Berhasil membuat pertandingan ' + match);
            socket.emit('message', 'SERVER', 'Anda tergabung dalam pertandingan ' + match);
            var m = 'Pertandingan baru ' + match;
            socket.broadcast.to(match).emit('message', 'SERVER', m);
            matches[match].messages.push({
                sender: 'SERVER',
                message: m
            });
            io.emit('listmatch', matches);
        });

        socket.on('disconnect', function() {
            console.log('user disconnected');
        });
    });
};
