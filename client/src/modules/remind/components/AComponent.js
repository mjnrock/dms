//TODO: Decide if you want to use this or not. It's a bit of a mess.
export const AComponent = {
	Attach: (Name, Create) => (node, { ...rest } = {}, { ...hooks } = {}) => {
		if(hooks.pre) {
			hooks.pre(node, { ...rest });
		}

		if(hooks.filter) {
			let result = hooks.filter(node, { ...rest });

			if(result === false) {
				return node;
			}
		}

		if(hooks.mutate) {
			[ node, rest ] = hooks.mutate(node, { ...rest });
		}

		node.shared[ Name ] = Create({ ...rest });

		if(hooks.post) {
			hooks.post(node, { ...rest });
		}

		return node;
	},
};

export default AComponent;