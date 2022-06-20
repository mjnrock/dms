import ATag, { EnumTagType } from "./ATag";

export class TagString extends ATag {
	constructor(name: string, value: string) {
		super({
			type: EnumTagType.STRING,
			name: name,
			value: value,
		});
	}

	public setValue(value: string): void {
		this.value = value;
	}

	public length(): number {
		return this.value.length;
	}
}

export default TagString;