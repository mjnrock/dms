import { EnumTagType } from "../../client/src/lib/dms/tags/Tag";
import Serializer from "../../client/src/lib/dms/tags/controller/Serializer";

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
			SQL.connect(sqlConfig).then(async (pool) => {
				let tagHierarchy = Serializer.ToHierarchy(tag);
				let recurser = async (tag) => {
					let opts = {},
						sql = ``;

					let fields = tagHierarchy.map(([ id, pid, alias, dtype, state, path ]) => {
						return `INSERT INTO [Node].Tag (UUID, ParentUUID, EnumTagTypeID, Alias, [Value], Opts)
						VALUES ('${ id.toUpperCase() }', ${ pid ? `'${ pid }'` : 'NULL' }, [Node].GetEnumTagType('${ dtype }', 2, 0), '${ alias }', NULL, '${ JSON.stringify(opts) }');`;
					});
					sql += fields.join("");

					return await pool.query(sql);
				};

				await recurser(tag);

				let sql = `INSERT INTO [Node].[Schema] (Alias, TagUUID, NamespaceID) OUTPUT INSERTED.*
				VALUES ('${ tag.alias.toUpperCase() }', '${ tag.id.toUpperCase() }', NULL);`;

				let request = pool.request();
				request.query(sql).then(result => {
					if(result && result.recordset && result.recordset.length > 0) {
						sql = `INSERT INTO [Node].Field (SchemaID, EnumTagSQLTypeID, TagUUID) VALUES `;

						let schemaId = result.recordset[ 0 ].SchemaID;
						if(schemaId) {
							let fields = tagHierarchy.reduce((a, [ id, pid, alias, dtype, state, path ]) => {
								let row = `('${ schemaId }', [Node].GetEnumTagSQLType('${ dtype }', 4, 0), '${ id }')`;

								return [ ...a, row ];
							}, []);
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