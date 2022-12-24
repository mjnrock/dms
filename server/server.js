const express = require("express");
const cors = require("cors");
const https = require("https");
const http = require("http");
const fs = require("fs");
const port = 3001;

let key = fs.readFileSync(__dirname + "/certs/kiszka.key");
let cert = fs.readFileSync(__dirname + "/certs/kiszka.crt");
let options = {
	key: key,
	cert: cert
};

app = express();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.get("/", (req, res) => {
	console.info(req.body);
	// const { searchType, data, onPremiseOnly } = req.body;

	res.json({
		"status": "ok",
		"message": "success",
		"data": [
			1,
			2,
			3,
			4,
			5,
		],
	});
});

let isSSL = false,
	server;
if(isSSL) {
	server = https.createServer(options, app);
} else {
	server = http.createServer(options, app);
}

server.listen(port, () => {
	console.log(`HTTP${ isSSL ? `S` : `` } Server running on PORT=${ port }`);
});