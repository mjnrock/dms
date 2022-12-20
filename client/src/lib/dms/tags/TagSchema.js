import { Tag } from "./Tag.js";
import { TagGroup } from "./TagGroup.js";

/**
 * The TagSchema is similar to the TagNamespace, but is intended to explicitly
 * define a metastructure.  A TagNamespace is intended to be used to "instantiate"
 * a TagSchema, and its children should accordingly contain data in their state.
 */
export class TagSchema extends TagGroup {

	constructor (namespace, members, { reducers = [], ...rest } = {}) {
		super(members, {
			...rest
		});

		this.dtype = Tag.Type.SCHEMA;
		this.alias = namespace;

		this.addReducer(TagSchema.Encoder);
		this.addReducers(...reducers);
	}

	get namespace() {
		return this.alias;
	}
	set namespace(namespace) {
		this.alias = namespace;
	}
}

export default TagSchema;