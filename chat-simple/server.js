var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var historyMsgs = [];
var connectedSockets = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    connectedSockets.push(socket);

    socket.on('disconnect', function () {
        console.log('user disconnected');
        socket.broadcast.emit('chat user disconnected', socket.nickName);
        connectedSockets = connectedSockets.filter(s => s.nickName !== socket.nickName)
    });

    socket.on('chat joined', nickName => {
        socket.emit('chat historyMsgs', historyMsgs);
        socket.broadcast.emit('chat newUser', nickName);
        socket.nickName = nickName;
        console.log('connectedSockets', connectedSockets.length);
    });

    socket.on('chat msgToSend', (msg) => {

        if (msg.txt.startsWith('to:')) {
            var to = msg.txt.substring(3, msg.txt.indexOf(';'));
            console.log('Sending to', to);
            var targetSocket = connectedSockets.find(s => s.nickName === to);
            socket.emit('chat newMsg', msg);
            targetSocket.emit('chat newMsg', msg);
        } else {
            io.emit('chat newMsg', msg);
            historyMsgs.push(msg);
        }
        // console.log('sending msg: ' + msg, 'to:', connectedCount + 'users');
    });



});


http.listen(3003, function () {
    console.log('listening on *:3003');
});
