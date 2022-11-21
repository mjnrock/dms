import { TagGroup } from "./../tags/TagGroup";

export class Form extends TagGroup {
	constructor (value = [], { ...rest } = {}) {
		super(value, {
			...rest
		});
	}
};

export default Form;