import ATag, { EnumTagType } from "./ATag";

export class TagCharacter extends ATag {
	constructor(name: string, value: string | null) {
		super({
			type: EnumTagType.CHARACTER,
			name: name,
			value: typeof value === "string" ? value[0] : null,
		});
	}

	public setValue(value: string | null): boolean {
		this.value = typeof value === "string" ? value[0] : null;

		return true;
	}

	public toCharCode(): number {
		return this.value.charCodeAt(0);
	}
}

export default TagCharacter;
