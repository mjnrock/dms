import { EnumTagType } from "./ATag";
import TagNumber, { EnumNumberRange } from "./TagNumber";

export class TagInt8 extends TagNumber {
	constructor(name: string, value: number | null) {
		super(name, value);

		this.setSubType(EnumTagType.UINT8);
	}

	public setValue(value: number | null): boolean {
		if(value === null || value >= EnumNumberRange.INT8_MIN && value <= EnumNumberRange.INT8_MAX) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagInt8;