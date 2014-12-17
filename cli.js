var client = require('./client.js')

var trntStr = process.argv[2]
var authStr = process.argv[3]
var hostStr = process.argv[4] || "http://localhost:6880"
if (!trntStr || !authStr || !/:/.test(authStr) || !hostStr || !/:/.test(hostStr)) {
	console.log(
		'Usage:\n' +
		'  node client.js trnt auth [host]\n' +
		'trnt can be one of the following:\n' +
		'  [magnet uri]\n' +
		'  [info hash]\n' +
		'  [http(s) path to torrent file]\n' +
		'auth must be formatted like:\n' +
		'  [username]:[password]\n' +
		'host must be formatted like:\n' +
		'  [url]:[port]'
	)
	quit('\nIncorrect usage', 1)
}

var userPass = authStr.split(':')

client(trntStr, hostStr, userPass[0], userPass[1])
