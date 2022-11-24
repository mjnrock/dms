import Tag from "../tags/Tag";
import { TagArray } from "../tags/TagArray";
import { TagString } from "../tags/TagString";

export class FormControl extends TagArray {
	static EnumFormControlType = {
		INPUT: "input",
		SECTION: "section",
	};

	constructor (type, value = [], { config = {}, ...rest } = {}) {
		super(value, {
			...rest
		});

		this.$form = {
			type,
			config,
		};

		this.events.add("change", (value) => {
			if(value instanceof Tag) {
				this.state = [ value ];
			} else if(typeof value === "string") {
				this.state = [
					new TagString(value),
				];
			} else if(Array.isArray(value)) {
				this.state = value;
			}
		});
	}
};

export default FormControl;