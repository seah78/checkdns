var http = require('http');
var fs = require('fs');
const dns = require('dns');
var whois = require('node-whois');
var chalk  = require('chalk');




// Chargement du fichier index.html 
var server = http.createServer(function(req, res) {

    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);

    });

});


// Chargement de socket.io

var io = require('socket.io').listen(server);


// Quand un client se connecte

io.sockets.on('connection', function (socket) {
    socket.on('message', function (message) {
	    
	    
		//CHAMP MX  
		dns.resolveMx(message, function(err, rec) {
			socket.emit('updateMX', rec);
		});
		
		//CHAMP CNAME 
		dns.resolveCname(message, function(err, rec) {
			socket.emit('updateCname', rec);
		});
		
		//CHAMP NS
		dns.resolveNs(message, function(err,rec){
			socket.emit('updateNS', rec);
			});
			
		//CHAMP TXT
		dns.resolveTxt(message, function(err,rec){
			socket.emit('updateTXT', rec);
			console.log(rec);});
			
		//CHAMP SOA
		dns.resolveSoa(message, function(err,rec){
			socket.emit('updateSOA', rec);
			console.log(rec);});
			
	 //CHAMP A	
	  dns.lookup(message, function onLookup(err, addresses, family) {
		socket.emit('updateA', addresses);
		  dns.reverse(addresses, function (err,hostname){
			  socket.emit('updateR', hostname);
			  });
	});
        whois.lookup(message, function(err, data) {
                data=data.replace(/\n/g, "<br>");
		//data=data.replace(/registrar/gi, "<div class=\"animated infinite flash\"> Registrar  </div>");
    			socket.emit('updateWhois', data);
		})
    }); 

});





server.listen(80);