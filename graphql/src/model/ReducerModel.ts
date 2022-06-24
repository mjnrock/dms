export type ReducerModel = {
	uuid: string;
	parent: string;
	domain: string;
	fn: string;
	scope: [string];	/* A list of all variables required to be in scope (e.g. a Game object) */
	// hof?: boolean;	/* If TRUE, this Reducer returns another function, instead of a state object */
};
