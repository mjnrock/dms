import { TagArray } from "../tags/TagArray";

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

		console.log(this)
	}
};

export default FormControl;