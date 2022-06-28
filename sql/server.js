import { v4 as uuid } from "uuid";
import fs from "fs";
import express from "express";
import https from "https";
import { WebSocketServer } from "ws";
import MSSQL from "mssql";

/**
 * DMS exports a Singleton instance by default
 */
import DMS from "./DMS";

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


	client.on("message", async input => {
		try {
			const data = JSON.parse(input);
			console.log(`Message received`, data);

			let [ op, table, json, where ] = data;
			json = JSON.stringify(json);

			// * Request version
			// const results = await DMS.execute(`[Core].[spCRUD]`, {
			const results = await DMS.execCRUD({
				Operation: [ MSSQL.VarChar(255), op ],
				Table: [ MSSQL.VarChar(255), table ],
				JSON: [ MSSQL.VarChar(4000), json ],
				Where: !!where ? [ MSSQL.NVarChar(MSSQL.MAX), where ] : false
			});

			console.log(results);

			//* Query version
			// const results = await DMS.query(`EXEC [Core].[spCRUD] @Operation = '${ op }', @Table = '${ table }', @JSON = '${ json }'${ !!where ? `, @Where = '${ where }'` : "" }`);

			// console.log(results);
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