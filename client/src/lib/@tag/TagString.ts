import ATag, { EnumTagType } from "./ATag";

export class TagString extends ATag {
	constructor(name: string, value: string | null) {
		super({
			type: EnumTagType.STRING,
			name: name,
			value: value,
		});
	}

	public setValue(value: string | null): boolean {
		this.value = value;

		return true;
	}

	public length(): number {
		return this.value.length;
	}
}

export default TagString;
