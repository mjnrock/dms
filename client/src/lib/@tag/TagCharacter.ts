import ATag, { EnumTagType } from "./ATag";

export class TagCharacter extends ATag {
	constructor(name: string, value: string) {
		super({
			type: EnumTagType.CHARACTER,
			name: name,
			value: value[0],
		});
	}

	public setValue(value: string): boolean {
		this.value = value[0];

		return true;
	}

	public toCharCode(): number {
		return this.value.charCodeAt(0);
	}
}

export default TagCharacter;
