import moment from 'moment';

import ioClient from 'socket.io-client'

var socket = null;
const msgs = [];
var nickname = lorem();
connectSocket();

function connectSocket() {
    socket = ioClient('http://localhost:3003');

    socket.emit('chat i-join', {nickname})

    socket.on('chat history', function (historyMsgs) {
        msgs.push(...historyMsgs)
    });

    socket.on('chat newMsg', function (msg) {
        // JIF
        if (nickname === msg.from) msgs[msgs.length - 1].processed = true;
        else msgs.push(msg);
    });

    socket.on('chat join', function ({who}) {
        var msg = createEmptyMsg(`${who} Just Joined`)
        msgs.push(msg);
    });

}

const getMsgs = () => {
    return msgs;
}

const send = (msg) => {
    msgs.push(msg);
    socket.emit('chat msg', msg);
}

function createEmptyMsg(txt = '') {
    return { txt, processed: false, from: nickname };
}

export default {
    getMsgs,
    send,
    nickname,
    createEmptyMsg
}



function lorem(size = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
