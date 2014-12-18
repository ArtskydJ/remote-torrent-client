var url = require('url')
var client = require('./client.js')
var PORT = 8080

var trntStr = process.argv[2]
var authStr = process.argv[3]
var hostStr = process.argv[4]
if (!trntStr || !authStr || !/:/.test(authStr) || !hostStr) {
	if (trntStr === 'test') {
		trntStr = '890232ac9a6cef8dca73971f77d40b8c48d05549' //NOOBS_lite_v1_3_10
		authStr = 'test:lol'
		hostStr = 'http://localhost'
	} else {
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
		process.exit(0)
	}
}
var parsed = url.parse(hostStr)
if (!parsed.port) parsed.host += ':' + PORT
var formattedHost = url.format(parsed)

var userPass = authStr.split(':')

client(trntStr, formattedHost, userPass[0], userPass[1])
