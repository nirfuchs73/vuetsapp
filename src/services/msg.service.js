import moment from 'moment';

import ioClient from 'socket.io-client'

var socket = null;
const msgs = [];
var nickName = lorem();
connectSocket();

function connectSocket() {
    socket = ioClient('http://localhost:3003');
    socket.emit('chat joined', nickName);

    socket.on('chat history', function (historyMsgs) {
        msgs.push(...historyMsgs)
    });

    socket.on('chat newMsg', function (msg) {
        // JIF
        if (nickName === msg.from) msgs[msgs.length - 1].processed = true;
        else msgs.push(msg);
    });

    socket.on('chat newUser', nickName => {
        console.log('New User JOINED', nickName);
        var msg = createEmptyMsg(`${nickName} is connected`);
        msgs.push(msg);
    });

    socket.on('chat user disconnected', nickName => {
        console.log('User disconnected', nickName);
        var msg = createEmptyMsg(`${nickName} is disconnected`);
        msgs.push(msg);
    });
}

const getMsgs = () => {
    return msgs;
}

const send = (msg) => {
    msgs.push(msg);
    socket.emit('chat msgToSend', msg);
}

function createEmptyMsg(txt = '') {
    return { txt, processed: false, from: nickName };
}

function on(eventName, cb) {
    socket.on(eventName, cb)
}

function emit(eventName, data) {
    console.log(data)
    socket.emit(eventName, data)
}

export default {
    getMsgs,
    send,
    nickName,
    createEmptyMsg,
    on,
    emit
}



function lorem(size = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
