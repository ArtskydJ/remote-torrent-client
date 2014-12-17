var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var SocketIoClient = require('socket.io-client')
var ss = require('socket.io-stream')

module.exports = function rtClient(trntStr, hostStr, user, pass) {
	if (arguments.length < 4) throw new Error('Not enough arguments to function rtClient')

	var socket = new SocketIoClient(hostStr)

	socket.on('connect', function () {
		var sha1 = hash('sha1', pass)
		socket.emit('authenticate', user, sha1, function (success) {
			if (success) {
				socket.emit('download torrent', trntStr)
			}
		})
	})

	ss(socket).on('file', save)
	socket.on('disconnect', quit.bind(null, 'Disconnected from server'))
	socket.on('msg', console.log)
	socket.on('quit', quit)
}

function save(src, meta, next) {
	var dst = fs.createWriteStream(meta.path)
	src.pipe(dst)
	src.on('end', next)
}

function hash(type, str) {
	return crypto
		.createHash(type)
		.update(str)
		.digest('hex')
}

function quit(msg, code) {
	msg && console.log(msg)
	console.log('Shutting down')
	process.exit(code || 0)
}
