import { v4 as uuid } from "uuid";
import fs from "fs";
import express from "express";
import https from "https";
import { WebSocketServer } from "ws";
import MSSQL from "mssql";

const config = {
	port: 3001,
	ssl_key: `./ssl/kiszka.key`,
	ssl_cert: `./ssl/kiszka.crt`,
};

const app = express();

const key = fs.readFileSync(config.ssl_key);
const cert = fs.readFileSync(config.ssl_cert);

/**
 * This is a newer way to do the work commonly seen with `bodyParser`
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept",
	);

	return next();
});

//?	Test:	https://kiszka.com:3001/
app.get("/", function (req, res, next) {
	const query = `SELECT * FROM Core.vwDomain`;
	new MSSQL.ConnectionPool({
		user: `dms_api`,
		password: `dms_api`,
		server: `localhost`,
		database: `DMS`,
		port: 1433,
		trustServerCertificate: true,	/* 	This is needed for localhost (self-signed cert) testing */
		encrypt: true
	}).connect().then(pool => {
		return pool.request().query(query);
	}).then(result => {
		let rows = result.recordset;

		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).json(rows);
		MSSQL.close();
	}).catch(err => {
		res.status(500).send({ message: `${ err }` });
		MSSQL.close();
	});
});

const server = https.createServer({ key, cert }, app);

const wss = new WebSocketServer({ server });
wss.on("connection", client => {
	console.log("Client connected");

	client.uuid = uuid();
	client.send(JSON.stringify({
		uuid: client.uuid,
	}));

	client.on("close", input => {
		console.log("Client disconnected");
	})

	client.on("message", input => {
		try {
			const data = JSON.parse(input);
			console.log(`Message received`, data);
		} catch(e) { }
	});
});

server.listen(config.port, err => {
	if(err) {
		console.log("An error occured", err);
		process.exit();
	}
	console.log(`DMS Server is listening on port: ${ config.port }`);
});