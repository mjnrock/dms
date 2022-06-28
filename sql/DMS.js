import MSSQL from "mssql";

export class DMS {
	static Config = {
		CRUD: `[Core].[spCRUD]`,
	};	
	static TediousConfig = {
		user: `dms_api`,
		password: `dms_api`,
		server: `localhost`,
		database: `DMS`,
		port: 1433,
		trustServerCertificate: true,	/* 	This is needed for localhost (self-signed cert) testing */
		encrypt: true
	};
	static ConnectionPool = new MSSQL.ConnectionPool(this.TediousConfig);

	static async Connect() {
		return await this.ConnectionPool.connect();
	}
	static async Disconnect() {
		return await this.ConnectionPool.close();
	}

	static Attach(request, params) {
		for(let [ param, input ] of Object.entries(params)) {
			if(input !== false) {
				const [ type, value ] = input;

				request.input(param, type, value);
			}
		}

		return request;
	}

	static async Query(query) {
		const conn = await this.Connect();
		const request = conn.request();

		const result = await request.query(query);
		const rows = result.recordset;

		this.Disconnect();

		return rows;
	}

	static async Execute(sproc, params) {
		const conn = await this.Connect();
		const request = conn.request();

		this.Attach(request, params);

		const result = await request.execute(sproc);
		const rows = result.recordset;

		this.Disconnect();

		return rows;
	}

	static async ExecCRUD(params) {
		return await this.Execute(this.Config.CRUD, params);
	}
};

export default DMS;