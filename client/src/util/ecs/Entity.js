import { validate } from "uuid";
import { Identity } from "../Identity";

/**
 * In general, any property that is not the result of inheritance is treated as a component.  "Components" are
 * properties that are added to an entity, and are intentionally vaguely defined, as they can be anything.  This
 * allows for some light infrastructure to be built around them, but also allows for a lot of flexibility.
 * 
 * Within an Entity descendant, the Components property is a map of component names to component generators.
 * These represent the default components for that Entity.  Additional components can be added to the Entity
 * by passing them to the @components parameter upon instantiation.  If default components exists, then can
 * be seeded with data by passing them to the @components parameter, as well.
 * 
 * NOTE: Any "root level" function will **always** be evaluated and the local result will be wrapped in an
 * array so that all arguments can be spread into the component generator; therefore, explicitly pass that
 * array to prevent function evaluation in those cases.
 */
export class Entity extends Identity {
	/**
	 * A unique name for the Entity/descendant (or type).
	 */
	static Alias = "entity";

	/**
	 * This is the default set of components for the Entity/descendant.
	 * 
	 * NOTE: When populated, instead of *attaching* @components directly, default components *will pass*
	 * @components function results (or the static payload when not a funciton) directly to the default
	 * component generators.
	 */
	static Components = {};

	constructor ({ alias, id, tags, $env, ...components } = {}) {
		super({ id, tags });

		/**
		 * A class-unique name for the Entity
		 */
		this.alias = alias || this.constructor.Alias;

		/**
		 * Register all of the components and seed them with data from @components
		 */
		this.register(components);
		this.register(this.constructor.Components, components);

		/**
		 * Optionally add the Entity to a provided environment
		 */
		if($env) {
			$env.entity.register(this);
		}
	}

	/**
	 * Clean up the Entity before GC
	 */
	deconstructor(cascade = false) {
		super.deconstructor();

		for(let key of Object.keys(this)) {
			const value = this[ key ];
			/**
			 * Optionally destroy any properties with a "deconstructor" method
			 */
			if(cascade) {
				/**
				 * If a .deconstructor() method exists, call it
				 */
				if(typeof this[ key ] === "object" && "deconstructor" in this[ key ]) {
					value.deconstructor(cascade);
				}
			}
		}

		this.unregister(...Object.keys(this));
	}

	register(comps, init = {}) {
		const nextComps = Array.isArray(comps) ? comps.map((a, i) => [ a.name || a.constructor.name, a ]) : Object.entries(comps);
		for(let [ name, comp ] of nextComps) {
			/**
			 * Do not register keys that contain reserved characters
			 */
			if(name[ 0 ] === "_" || name[ 0 ] === "$") {
				continue;
			}

			let largs = init[ name ];

			if(typeof largs === "function") {
				largs = largs(this);
			}

			if(!Array.isArray(largs)) {
				largs = [ largs ];
			}

			if(Identity.Comparators.IsClass(comp) && !Identity.Comparators.IsInstance(comp)) {
				this[ name ] = new comp(...largs);
			} else if(typeof comp === "function") {
				this[ name ] = comp(...largs);
			} else {
				this[ name ] = comp;
			}
		}
	}
	unregister(...keys) {
		for(let key of keys) {
			delete this[ key ];
		}
	}

	static From(obj = {}, { id = false } = {}) {
		let args;
		if(typeof obj === "string" || obj instanceof String) {
			args = JSON.parse(obj);
		} else {
			args = obj;
		}

		if(id === false) {
			delete args.id;
		} else if(validate(id)) {
			args.id = id;
		}

		return new this(args);
	}

	/**
	 * Factory method for creating new Entities.
	 * 
	 * NOTE: This will **always** evaluate the root-level functions
	 * within the @components parameter, so as not to create collisions.
	 */
	static Factory(qty = 1, { $each, ...components } = {}) {
		return new Array(qty).fill(0).map((v, j) => {
			const entity = new this({ ...components });

			if($each) {
				$each(entity, j);
			}

			return entity;
		});
	}
};

export default Entity;