import { v4 as uuid, validate } from "uuid";

export class Identity {
	static Comparators = {
		/**
		 * Single-comparison evaluators
		 */
		IsUndefined(input: any) {
			return input === void 0;
		},
		IsNull(input: any) {
			return input === null;
		},
		IsDefined(input: any) {
			return input != null;
		},
		IsBoolean(input: any) {
			return typeof input === "boolean";
		},
		IsNumber(input: any) {
			return typeof input === "number";
		},
		IsNumeric(input: any) {
			return !isNaN(parseFloat(input));
		},
		IsString(input: any) {
			return typeof input === "string" || input instanceof String;
		},
		IsSymbol(input: any) {
			return typeof input === "symbol";
		},
		IsSet(input: any) {
			return input instanceof Set;
		},
		IsMap(input: any) {
			return input instanceof Map;
		},
		IsArray(input: any) {
			return Array.isArray(input);
		},
		IsObject(input: any) {
			return input != null && typeof input === "object";
		},
		IsStrictObject(input: any) {
			return Object.getPrototypeOf(input) === Object.prototype;
		},
		IsFunction(input: any) {
			return typeof input === "function";
		},
		IsDate(input: any) {
			return input instanceof Date;
		},
		IsRegExp(input: any) {
			return input instanceof RegExp;
		},
		IsPromise(input: any) {
			return input instanceof Promise;
		},
		IsIterable(input: any) {
			return input != null && typeof input[ Symbol.iterator ] === "function";
		},
		IsUUID(input: any) {
			return validate(input);
		},
		IsIdentity(input: any) {
			return input instanceof Identity;
		},
		IsHierarchy(input: any) {
			if(Identity.Comparators.IsArray(input)) {
				return input.every((row: any) => {
					return Identity.Comparators.IsArray(row) && row.length === 4	//NOTE: [ id, tags, data, children ]
						&& Identity.Comparators.IsNumeric(row[ 0 ])
						&& (Identity.Comparators.IsNumeric(row[ 1 ]) || Identity.Comparators.IsNull(row[ 1 ]));
				});
			}

			return false;
		},

		/**
		 * Complex comparators
		 */
		IsStringOrSymbol(input: any) {
			return Identity.Comparators.IsString(input) || Identity.Comparators.IsSymbol(input);
		},
		IsArrayOrSet(input: any) {
			return Identity.Comparators.IsArray(input) || Identity.Comparators.IsSet(input);
		},

		HasTag(input: any, tag: string) {
			return input.tags.has(tag);
		},
		HasTags(input: any, ...tags: string[]) {
			return tags.every(tag => input.tags.has(tag));
		},
	};

	public id: any;
	public tags: Set<string>;

	constructor ({ id, tags = [] }: { id?: string, tags?: string[] }) {
		this.id = Identity.Comparators.IsStringOrSymbol(id) ? id : uuid();
		this.tags = new Set(Identity.Comparators.IsArrayOrSet(tags) ? tags : []);
	}

	deconstructor() { }

	//#region Serialization
	toArray(includeId: boolean = true): Array<[ any, any ]> {
		const obj: any = {
			...this,
		};

		delete obj._hooks;
		if(includeId === false) {
			delete obj.id;
		}

		return Object.entries(obj).map(([ key, value ]) => {
			if(value instanceof Identity) {
				return [ key, value.toArray(includeId) ];
			}

			return [ key, value ];
		});
	}
	toObject(includeId: boolean = true): object {
		const obj: any = {
			...this,
		};

		delete obj._hooks;
		if(includeId === false) {
			delete obj.id;
		}

		return Object.entries(obj).reduce((a, [ key, value ]) => {
			if(value instanceof Identity) {
				return { [ key ]: value.toObject(includeId), ...a };
			}

			return { [ key ]: value, ...a };
		}, {});
	}
	toString(includeId: boolean = true): string {
		return JSON.stringify(this.toObject(includeId));
	}
	toJson(includeId: boolean = true): string {
		return this.toString(includeId);
	}
	toHierarchy(includeId: boolean = true, entries: any = Object.entries(this), pid: number = 0, table: any = []): Array<any> {
		let eid: number = pid + 1;
		const addRow = (id: number, pid: number | null, k: any, v: any) => {
			let newKey: any = k,
				newValue: any = v;


			if(typeof k === "symbol") {
				k = k.toString();
			} else if(!isNaN(newKey)) {
				newKey = +newKey;
			}

			if(typeof v === "symbol") {
				v = v.toString();
			} else if(typeof v === "boolean") {
				newValue = v;
			} else if(!isNaN(newValue)) {
				newValue = +newValue;
			}

			table.push([ id, pid, newKey, newValue ]);
		};

		if(pid === 0) {
			table.push([ 0, null, null, `$root` ]);
		}

		entries.forEach(([ key, value ]: [ any, any ]) => {
			if(includeId === false && key === "id") {
				//NOOP
			} else {
				let type: any = false,
					newValue = value;

				if(newValue instanceof Identity) {
					type = `$agency.${ newValue.constructor.name.toLowerCase() }`;
					newValue = Object.entries(newValue);
				} else if(Array.isArray(newValue)) {
					type = `$array`;
					newValue = Object.entries(newValue);
				} else if(newValue instanceof Set) {
					type = `$set`;
					newValue = Array.from(newValue.values()).map((v, i) => [ i, v ]);
				} else if(newValue instanceof Map) {
					type = `$map`;
					newValue = Array.from(newValue.entries());
				} else if(typeof newValue === "object") {
					type = `$object`;
					newValue = Object.entries(newValue);
				}

				if(type) {
					addRow(eid, pid, key, type);

					if(type.includes(`$agency`)) {
						[ eid, table ] = value.toHierarchy(includeId, newValue, eid, table);
					} else {
						[ eid, table ] = this.toHierarchy(includeId, newValue, eid, table);
					}
				} else {
					addRow(eid, pid, key, newValue);
					eid++;
				}
			}
		});

		if(pid !== 0) {
			return [
				eid,
				table
			];
		}

		return table;
		// return table.sort((a, b) => a[ 0 ] - b[ 0 ]);	// Sort by EID
		// return table.sort((a, b) => a[ 1 ] - b[ 1 ]);	// Sort by PID
	}
	to(format: string, ...args: any) {
		switch(format) {
			case "array":
				return this.toArray(...args);
			case "object":
				return this.toObject(...args);
			case "string":
				return this.toString(...args);
			case "json":
				return this.toJson(...args);
			case "hierarchy":
				return this.toHierarchy(...args);
			default:
				return false;
		}
	}
	//#endregion Serialization


	//#region Instantiation
	static Create(...args: any) {
		// @ts-ignore
		return new this(...args);
	}
	static Factory(qty = 1, args: any = [], each?: (i: number, obj: any) => void) {
		const instances = [];
		for(let i = 0; i < qty; i++) {
			/**
			 * Allow for a callback to be passed in to modify the arguments, so that
			 * the factory can create dynamic arguments for each iteration.
			 */
			let newArgs = typeof args === "function" ? args(i) : args;

			const instance = this.Create(...newArgs);
			instances.push(instance);

			/**
			 * Optionally perform work on the instance after it has been created.
			 */
			if(typeof each === "function") {
				each(i, instance);
			}
		}

		return instances;
	}
	//#endregion Instantiation
};

export default Identity;