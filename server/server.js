import { Create } from "./mssql/Schema";

import { Tag } from "./lib/dms/tags/Tag";
import { TagString } from "./lib/dms/tags/TagString";
import { TagBoolean } from "./lib/dms/tags/TagBoolean";
import { TagCharacter } from "./lib/dms/tags/TagCharacter";
import { TagArray } from "./lib/dms/tags/TagArray";
import { TagInt8 } from "./lib/dms/tags/TagInt8";
import { TagUint8 } from "./lib/dms/tags/TagUint8";
import { TagGroup } from "./lib/dms/tags/TagGroup";
import { TagNamespace } from "./lib/dms/tags/TagNamespace";
import { TagSchema } from "./lib/dms/tags/TagSchema";

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
const tagStr = new TagString("meow", {
	alias: "strang",
	tags: [ "cat", "dog" ],
});
const tagChar = new TagCharacter("A", {
	alias: "chor",
	tags: [ "cat" ],
});
const tagBool = new TagBoolean(false, {
	alias: "boolz",
	tags: [ "wut" ],
});
const tagInt8 = new TagInt8(69, {
	alias: "nambs",
	tags: [ "$$$", "cat" ],
});
const tagUint8 = new TagUint8(230, {
	alias: "nambs22",
	tags: [ "$$$", "cat" ],
});
// const tagGroup = new TagGroup([ tagInt8, tagUint8 ], {
const tagGroup = new TagGroup([ tagStr, tagBool, tagInt8, tagUint8 ], {
	alias: "GrOuP"
});
// const tagArr = new TagArray([ tagStr, tagBool, tagGroup ], {
// 	alias: "ARrAy"
// });

let baseTag = new TagSchema([
	tagChar,
	// tagArr,
	tagGroup,
]);

const app = express();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.get("/", (req, res) => {
	console.info(req.body);
	// const { searchType, data, onPremiseOnly } = req.body;

	Create({ tag: baseTag });

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