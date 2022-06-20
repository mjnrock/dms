import { EnumTagType } from "./ATag";
import TagNumber, { EnumNumberRange } from "./TagNumber";

export class TagInt32 extends TagNumber {
	constructor(name: string, value: number | null) {
		super(name, value);

		this.setType(EnumTagType.UINT32);
	}

	public setValue(value: number | null): boolean {
		if(value === null || value >= EnumNumberRange.INT32_MIN && value <= EnumNumberRange.INT32_MAX) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagInt32;