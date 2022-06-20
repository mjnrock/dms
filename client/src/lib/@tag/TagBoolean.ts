import ATag, { EnumTagType } from "./ATag";

export class TagBoolean extends ATag {
	constructor(name: string, value: boolean | null) {
		super({
			type: EnumTagType.BOOLEAN,
			name: name,
			value: value,
		});
	}

	public setValue(value: boolean | null): boolean {
		this.value = value;

		return true;
	}

	public toggle(): void {
		this.value = !this.value;
	}
}

export default TagBoolean;
