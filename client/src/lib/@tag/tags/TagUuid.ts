import { v4 as uuid, validate } from "uuid";
import { EnumTagType } from "./ATag";
import TagString from "./TagString";

export class TagUuid extends TagString {
	static GenerateUUID(): string {
		return uuid();
	};

	constructor(name: string, value?: string) {
		super(name, value || uuid());

		this.setLogicalType(EnumTagType.UUID);
	}

	public setValue(value: string): boolean {
		if (validate(value)) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagUuid;
