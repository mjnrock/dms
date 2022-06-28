import MSSQL from "mssql";

/**
 * A default configuration object for the DMS SQL Server localhost instance.
 * 
 * NOTE: A sql account is required and needs "datareader", "datawriter",
 * and "execute" (on spCRUD) permissions.
 */
export const Config = {
	user: `dms_api`,
	password: `dms_api`,
	server: `localhost`,
	database: `DMS`,
	port: 1433,
	trustServerCertificate: true,	/* 	This is needed for localhost (self-signed cert) testing */
	encrypt: true
};

/**
 * Create a singleton instance of the DMS class.  If needed, an instance can be
 * returned by passing << true >> to the constructor's @reassign parameter.
 * 
 * NOTE: When you explicate @reassign on a construction, the singleton instance (DMS.Instance)
 * will be reassigned to that instance.
 */
export class DMS {
	static Instance = new DMS(Config);

	/**
	 * Attach the driver to allow for ad-hoc manipulation and things like SQL type assignments
	 * in the parameters.
	 */
	static Driver = MSSQL;

	constructor (config, reassign = false) {
		if(DMS.Instance && reassign !== true) {
			return DMS.Instance;
		}

		this.connectionPool = new MSSQL.ConnectionPool(config);
		DMS.Instance = this;

		return this;
	}

	/**
	 * Assign an instance-level getter, as this class is normally used in
	 * a singleton capacity.
	 */
	get Driver() {
		return DMS.Driver;
	}

	/**
	 * Grab a connection from the pool
	 */
	async connect() {
		return await this.connectionPool.connect();
	}
	/**
	 * Disconnect from the pool
	 */
	async disconnect() {
		return await this.connectionPool.close();
	}

	/**
	 * Attach any provided input parameters to the request
	 */
	attach(request, params) {
		for(let [ param, input ] of Object.entries(params)) {
			if(input !== false) {
				const [ type, value ] = input;

				request.input(param, type, value);
			}
		}

		return request;
	}

	/**
	 * Execute a free-form SQL query
	 */
	async query(query) {
		const conn = await this.connect();
		const request = conn.request();

		const result = await request.query(query);
		const rows = result.recordset;

		this.Disconnect();

		return rows;
	}

	/**
	 * Execute a stored procedure
	 */
	async execute(sproc, params) {
		const conn = await this.connect();
		const request = conn.request();

		console.log(7777777)

		this.attach(request, params);

		const result = await request.execute(sproc);
		const rows = result.recordset;

		console.log(888888, result)

		this.disconnect();

		return rows;
	}

	/**
	 * Execute a CRUD operation using the CRUD stored procedure (see SQL files)
	 */
	async CRUD(params) {
		console.log(6666666)
		return await this.execute(`[Core].[spCRUD]`, params);
	}
};

/**
 * Explicitly export the DMS Singleton instance, for direct grabbing
 */
export const Singleton = DMS.Instance || new DMS(Config);

/**
 * Export the singleton as the default export, for convenience
 * 
 * NOTE: Select the class explicitly if the singleton is inappropriate,
 * or needs to be reassigned.
 */
export default Singleton;