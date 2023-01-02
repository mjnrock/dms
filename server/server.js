import { Create } from "./mssql/Schema";

import Builder from "./../client/src/lib/controllers/Builder";

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

const app = express();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.post("/", (req, res) => {
	try {
		console.log(req.body)
		const tag = Builder.FromAliasSchema(req.body);
		Create({ tag });

		res.json({
			"status": "ok",
			"message": "success",
		});
	} catch(e) {
		res.json({
			"status": "error",
			"message": e.message,
		});
	}
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