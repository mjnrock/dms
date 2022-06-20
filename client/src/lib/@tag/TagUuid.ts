import { v4 as uuid, validate } from "uuid";
import ATag, { EnumTagType } from "./ATag";

export class TagUuid extends ATag {
	constructor(name: string, value?: string) {
		super({
			type: EnumTagType.UUID,
			name: name,
			value: value || uuid(),
		});
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
