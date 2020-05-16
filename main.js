const express = require('express');
var app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

app.use(express.static('public'));

var utenti = [];

io.sockets.on('connection', function(socket, message){

	socket.on('entra_in_chat', function(nickname){
		if(utenti.includes(nickname) == false) {
			utenti.push(nickname);
		}
		socket.emit('entrato_in_chat', utenti);
		socket.broadcast.emit('entrato_in_chat', utenti);
	});

	socket.on('nuovo_messaggio', function(message){
		console.log(">> nuovo messaggio: " + message);
		socket.emit('nuovi_messaggi', message);
		socket.broadcast.emit('nuovi_messaggi', message);
	});


	//	BANNERS TIMER
	var interval = setInterval(function(){ 
		var d = new Date();
		var day = d.getDay();
		var hr = d.getHours();
		
		var min = d.getMinutes();
		if (min < 10) 	    min = "0" + min;
		
		var sec = d.getSeconds();
		if (sec < 10) 	    sec = "0" + sec;
		
		var x = day + " " + hr + ":" + min + ":" + sec;	
		socket.emit('banner_call', x);
	}, 5000);


	socket.on('manda', function(data){
		socket.emit('torna', data);
		socket.broadcast.emit('torna', data);
	});

})

server.listen(8080);
