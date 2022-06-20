import ATag, { EnumTagType } from "./ATag";

export class TagBoolean extends ATag {
	constructor(name: string, value: boolean) {
		super({
			type: EnumTagType.BOOLEAN,
			name: name,
			value: value,
		});
	}

	public setValue(value: boolean): void {
		this.value = value;
	}

	public toggle(): void {
		this.value = !this.value;
	}
}

export default TagBoolean;