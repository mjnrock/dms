import { Registry } from "../Registry";
import { Entity } from "./Entity";
import { System } from "./System";

/**
 * TODO: This has NOT been tested since System has been refactored.
 */
export class Manager extends System {
	constructor ({ entities = [], reducers = {}, id, tags } = {}) {
		super({ reducers, id, tags });

		this.entities = new Registry(entities, {
			encoder: Registry.Encoders.InstanceOf(Entity),
			classifiers: [
				Registry.Classifiers.InstanceOf(true),
				Registry.Classifiers.Tagging(),
			],
		});
	}

	dispatch(event, ...args) {
		return super.dispatch(event, this.entities.values, ...args);
	}
};

export default Manager;