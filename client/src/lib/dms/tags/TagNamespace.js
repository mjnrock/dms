import { Tag } from "./Tag.js";
import { TagGroup } from "./TagGroup.js";

export class TagNamespace extends TagGroup {

	constructor (namespace, members, { reducers = [], ...rest } = {}) {
		super(members, {
			...rest
		});

		this.dtype = Tag.Type.NAMESPACE;
		this.alias = namespace;

		this.addReducer(TagNamespace.Encoder);
		this.addReducers(...reducers);
	}

	get namespace() {
		return this.alias;
	}
	set namespace(namespace) {
		this.alias = namespace;
	}
}

export default TagNamespace;