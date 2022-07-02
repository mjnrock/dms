import { v4 as uuid } from "uuid";
import fs from "fs";
import express from "express";
import https from "https";
import { WebSocketServer } from "ws";

import Message from "./lib/@relay/Message";

/**
 * DMS exports a Singleton instance by default
 */
import DMS from "./DMS";

/**
 * This holds general configuration for the server,
 * as well as the SSL certificate and key.
 */
const config = {
	port: 3001,
	ssl_key: `./ssl/kiszka.key`,
	ssl_cert: `./ssl/kiszka.crt`,
	key: null,	// assigned below
	cert: null,	// assigned below
};

/**
 * Assign the key and cert to the config object directly.
 */
config.key = fs.readFileSync(config.ssl_key);
config.cert = fs.readFileSync(config.ssl_cert);


const app = express();

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

const server = https.createServer({ key: config.key, cert: config.cert }, app);
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
			//TODO Formalize the handling here with a type router for a command bus			
			const msg = Message.FromJson(input);

			let [ op, table, json, where ] = msg.data;

			// * Request version
			// const results = await DMS.execute(`[Core].[spCRUD]`, {
			const results = await DMS.CRUD({
				Operation: [ DMS.Driver.VarChar(255), op ],
				Table: [ DMS.Driver.VarChar(255), table ],
				JSON: [ DMS.Driver.VarChar(4000), json ],
				Where: !!where ? [ DMS.Driver.NVarChar(DMS.Driver.MAX), where ] : false
			});

			// console.log(results.length ? "Results" : "No results");

			//* Query version
			// const results = await DMS.query(`EXEC [Core].[spCRUD] @Operation = '${ op }', @Table = '${ table }', @JSON = '${ json }'${ !!where ? `, @Where = '${ where }'` : "" }`);

			// console.log(results);

			//TODO Use the full Relay package here, rather than an ad-hoc tsc compiled version
			let obj;
			if(op === "read") {
				obj =  {
					data: results,
					emitter: client.uuid,
					type: `CRUD:${ op }`,
				};
			} else {
				obj =  {
					data: results[ 0 ].RowsAffected,
					emitter: client.uuid,
					type: `CRUD:${ op }`,
				};
			}

			client.send(Message.From(obj).toJson());
		} catch(e) {
			client.send(Message.From({
				data: void 0,
				emitter: client.uuid,
				type: `error`,
			}).toJson());
		}
	});
});


// let op = "read";
// const results = DMS.CRUD({
// 	Operation: [ DMS.Driver.VarChar(255), op ],
// 	Table: [ DMS.Driver.VarChar(255), "Domain" ],
// 	JSON: [ DMS.Driver.VarChar(4000), "*" ],
// 	// JSON: [ DMS.Driver.VarChar(4000), '{"Name":"TeSt"}' ],
// 	// Where: !!where ? [ DMS.Driver.NVarChar(DMS.Driver.MAX), where ] : false
// });

// results.then(results => {
// 	if(results.length) {
// 		if(op === "read") {
// 			console.log(results);
// 		} else {
// 			console.log(results[ 0 ].RowsAffected);
// 		}
// 	}
// });

server.listen(config.port, err => {
	if(err) {
		console.log("An error occured", err);
		process.exit();
	}
	console.log(`DMS Server is listening on port: ${ config.port }`);
});