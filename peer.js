var net = require('net')
var jsonStream = require('duplex-json-stream')
var topology = require('fully-connected-topology');
var streamSet = require('stream-set')

var username = process.argv[2]
var me = process.argv[3]
var peers = process.argv.slice(4)

var activeSockets = streamSet()
var swarm = topology(me, peers)

swarm.on('connection', function(socket, id){
  socket = jsonStream(socket)
  activeSockets.add(socket)
  console.log("I am connected to...", id)
  console.log("active sockets: ", activeSockets.size)

  socket.on('close', function(){
    console.log("active sockets: ", activeSockets.size)
  })

  socket.on('data', function(data){
    console.log(data.username + "> " + data.message)
  })

  process.stdin.on('data', function(data){
    socket.write({ username: username, message: data.toString().trim() })
  })
})