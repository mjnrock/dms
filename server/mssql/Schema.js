import { EnumTagType } from "../../client/src/lib/dms/tags/Tag";

const SQL = require("mssql");
const sqlConfig = {
	user: `dms_api`,
	password: `dms_api`,
	database: `DMS`,
	server: `localhost`,
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000
	},
	options: {
		encrypt: true, // for azure
		trustServerCertificate: true // change to true for local dev / self-signed certs
	},
};

export async function Create({ tag, parent }) {
	if(tag.dtype === EnumTagType.SCHEMA) {
		try {
			// make sure that any items are correctly URL encoded in the connection string
			SQL.connect(sqlConfig).then((pool) => {
				// const result = await sql.query`SELECT * FROM [Node].EnumTagType`;

				let opts = {};

				let sql = `INSERT INTO [Node].Tag (UUID, ParentUUID, EnumTagTypeID, [Value], Opts)
				VALUES ('${ tag.id.toUpperCase() }', NULL, [Node].GetEnumTagType('${ tag.dtype }', 1, 0), NULL, '${ JSON.stringify(opts) }');`;

				//TODO: Recurse through all child tags and insert them to prevent FK errors
				//NOTE: This will FAIL with FK constraint error until this is fixed

				sql += `INSERT INTO [Node].[Schema] (Alias, TagUUID, NamespaceID) OUTPUT INSERTED.*
				VALUES ('${ tag.alias.toUpperCase() }', '${ tag.id.toUpperCase() }', NULL);`;

				let request = pool.request();
				request.query(sql).then(result => {
					if(result && result.recordset && result.recordset.length > 0) {
						sql = `INSERT INTO [Node].Field (SchemaID, EnumTagSQLTypeID, TagUUID) VALUES `;

						let schemaId = result.recordset[ 0 ].SchemaID;
						if(schemaId) {
							let fields = tag.state.map((t) => {
								return `(${ schemaId }, 1, '${ t.id }')`;	//FIXME: Insert the correct EnumTagSQLTypeID
							});
							sql += fields.join(",") + ";";
						}

						let request = pool.request();
						request.query(sql).then(result => {
							console.log(result);
						});
					}
				});

				// sql += `INSERT INTO [Node].Field (SchemaID, EnumTagSQLTypeID, TagUUID) VALUES `;
				// let fields = tag.state.map((t) => {
				// 	return `(1, 1, '${ t.id }')`;	//FIXME: Insert the correct values
				// });
				// sql += fields.join(",") + ";";

				// console.log(sql)

				// let request = pool.request();
				// request.query(sql).then(result => {
				// 	console.log(result);
				// });
			});

			// return result;
		} catch(err) {
			// ... error checks
		}
	}
};