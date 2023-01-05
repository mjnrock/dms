import { dispatch } from "./../ASystem";

export const ItemCollection = {
	register(emitter, ...items) {
		for(let item of items) {
			emitter.state.registry.set(item.id, item);
		}

		dispatch(emitter, "update", emitter.state.registry);

		return emitter;
	},
	unregister(emitter, ...items) {
		for(let item of items) {
			emitter.state.registry.delete(item.id);
		}

		dispatch(emitter, "update", emitter.state.registry);

		return emitter;
	},

	addFactory(emitter, name, factory) {
		emitter.state.factory[ name ] = factory;

		dispatch(emitter, "update", emitter.state.factory[ name ]);

		return emitter;
	},
	removeFactory(emitter, name) {
		delete emitter.state.factory[ name ];

		dispatch(emitter, "update", emitter.state.factory[ name ]);

		return emitter;
	},

	addSystem(emitter, name, system) {
		emitter.state.systems[ name ] = system;

		dispatch(emitter, "update", emitter.state.systems[ name ]);

		return emitter;
	},
	removeSystem(emitter, name) {
		delete emitter.state.systems[ name ];

		dispatch(emitter, "update", emitter.state.systems[ name ]);

		return emitter;
	},

	addComponent(emitter, name, component) {
		emitter.state.components[ name ] = component;

		dispatch(emitter, "update", emitter.state.components[ name ]);

		return emitter;
	},
	removeComponent(emitter, name) {
		delete emitter.state.components[ name ];

		dispatch(emitter, "update", emitter.state.components[ name ]);

		return emitter;
	},

	addJSX(emitter, name, jsx) {
		emitter.state.jsx[ name ] = jsx;

		dispatch(emitter, "update", emitter.state.jsx[ name ]);

		return emitter;
	},
	removeJSX(emitter, name) {
		delete emitter.state.jsx[ name ];

		dispatch(emitter, "update", emitter.state.jsx[ name ]);

		return emitter;
	},
};

export default ItemCollection;