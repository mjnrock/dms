export type ReducerModel = {
	uuid: string;
	parent: string;
	domain: string;
	fn: string;
	// hof?: boolean;	/* If TRUE, this Reducer returns another function, instead of a state object */
};
