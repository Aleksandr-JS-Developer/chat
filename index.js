const PORT = 8080;
console.log( `\nserver, port: ${PORT}\n` );

const express = require('express');
const app = express();
const server = require('http').createServer( app );
      server.listen( PORT );
const io = require('socket.io').listen( server );

const connections = [];
const chat = [];

app.get('/', function( req, res ){
    res.sendFile( __dirname + '/index.html' );
});

io.sockets.on('connection', socket =>{
    connections.push( socket );
    console.log( `users (connected): ${connections.length}\n` );

    io.sockets.emit( 'con', chat );

    socket.on( 'disconnect', data =>{
        connections.splice( connections.indexOf( socket ), 1 );
        console.log( `users (disconnected): ${connections.length}\n` );
    });

    socket.on( 'send_mess', data => {
        chat.push( { msg: data.mess, author: data.author } );
        io.sockets.emit( 'add_mess', { msg: data.mess, author: data.author } );
    });
});