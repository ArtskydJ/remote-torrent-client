var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var SocketIoClient = require('socket.io-client')
var request = require('request')
var config = require('./config.json')

module.exports = function rtClient(trntStr, hostStr, user, pass) {
	if (arguments.length < 4) throw new Error('Not enough arguments to function rtClient')

	console.log(hostStr)
	var socket = new SocketIoClient(hostStr)

	socket.on('connect', function () {
		var sha1 = hash('sha1', pass)
		socket.emit('authenticate', user, sha1, function (success) {
			if (success) {
				socket.emit('download torrent', trntStr)
			}
		})
	})

	socket.on('file', save)
	socket.on('disconnect', quit.bind(null, 'Disconnected from server'))
	socket.on('msg', console.log)
	socket.on('quit', quit)

	function save(url, filename, next) {
		var src = request(hostStr + url)
		console.log('save', hostStr + url, filename)
		var dst = fs.createWriteStream(filename)
		src.pipe(dst)
		src.on('end', next)
	}
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
