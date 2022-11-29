export const ChildFinder = {
	/**
	 * Returns a list of children, selected by their respective index.
	 */
	getByIndex: (parent, ...indices) => {
		if(indices.length === 1) {
			return parent.state[ indices ];
		}
		
		return indices.map(index => {
			if(parent.state[ index ]) {
				return parent.state[ index ];
			}

			return false;
		});
	},
	/**
	 * A generic property searcher, that returns a either a list of children.  If @value is passed,
	 * then the child will only be selected if it's property matches the value; otherwise, a child
	 * will be return if it has a truthy value for the property.
	 */
	getByProp: (parent, key, value) => {
		if(value !== void 0) {
			return parent.state.filter(child => child[ key ] === value);
		}

		return parent.state.filter(child => child[ key ] !== void 0);
	},
	/**
	 * Returns the first child whose `alias` matches the passed value.
	 */
	getByAlias: (parent, alias) => {
		return parent.state.find(child => child.alias === alias);
	},
	/**
	 * Returns the first child whose `id`` matches the passed value.
	 */
	getById: (parent, id) => {
		return parent.state.find(child => child.id === id);
	},
	/**
	 * Returns a list of chidlren who contain *any* of the passed tags (`OR` search).
	 * If you pass `true` as the first @tags argument, it will use an `AND` search instead.
	 */
	getByTag: (parent, ...tags) => {
		if(tags[ 0 ] === true) {
			let [ , ...rest ] = tags;

			return parent.state.filter(child => {
				if(rest.every(t => child.tags.has(t))) {
					return true;
				}
	
				return false;
			});
		}

		return parent.state.filter(child => {
			if(tags.some(t => child.tags.has(t))) {
				return true;
			}

			return false;
		});
	},
};

export default ChildFinder;