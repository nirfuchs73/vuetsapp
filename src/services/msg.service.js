import moment from 'moment';

import ioClient from 'socket.io-client'


const connectSocket = () => {
    const socket = ioClient('http://localhost:3000');
    socket.on('msg received', function (strMsg) {
        var msg = JSON.parse(strMsg);
        // JIF
        if (nickName === msg.from) msgs[msgs.length - 1].processed = true;
        else msgs.push(msg);
    });

}


const msgs = [];
var nickName = lorem();
// connectSocket();


const getMsgs = () => {
    return msgs;
}

const send = (msg) => {

    msgs.push(msg);

    socket.emit('msg new', JSON.stringify(msg));

}



function lorem(size = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}




export default {
    getMsgs,
    send,
    nickName
}
