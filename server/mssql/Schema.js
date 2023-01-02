import { EnumTagType } from "./../../client/src/lib/tags/Tag";
import Serializer from "./../../client/src/lib/controllers/Serializer";

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

export async function Create({ tag }) {
	if(tag.type === EnumTagType.GROUP) {
		try {
			SQL.connect(sqlConfig).then(async (pool) => {
				//TODO: Make this a single transaction to allow full rollbacks
				// const tx = new SQL.Transaction(pool);
				// await tx.begin();

				let tagHierarchy = Serializer.ToHierarchy(tag);
				let fields = tagHierarchy.map(([ id, pid, alias, type, state, path ]) => {
					return `INSERT INTO [Node].Tag (UUID, ParentUUID, EnumTagTypeID, Alias, [Value], Opts) `
						+ `VALUES ('${ id.toUpperCase() }', ${ pid ? `'${ pid }'` : 'NULL' }, [Node].GetEnumTagType('${ type }', 2, 0), '${ alias }', NULL, NULL);`;
				});

				// console.log(fields.join("\r\n"))
				await pool.request().query(fields.join(""));

				let schemaId = await pool.request()
					.input(`UUID`, SQL.VarChar(255), tag.id)
					.input(`NamespaceID`, SQL.Int, null)
					.execute(`[Node].InsertSchema`)
					.then(result => {
						if(result && result.recordset && result.recordset.length > 0) {
							return result.recordset[ 0 ].SchemaID;
						}

						return null;
					});

				await pool.request()
					.input(`TagUUID`, SQL.VarChar(255), tag.id)
					.execute(`[Node].CreateSchemaTable`);
			});
		} catch(err) { }
	}
};