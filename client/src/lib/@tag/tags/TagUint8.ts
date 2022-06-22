import { EnumTagType } from "./ATag";
import TagNumber, { EnumNumberRange } from "./TagNumber";

export class TagUint8 extends TagNumber {
	constructor(name: string, value: number | null) {
		super(name, value);

		this.setLogicalType(EnumTagType.UINT8);
	}

	public setValue(value: number | null): boolean {
		if(value === null || value >= EnumNumberRange.UINT8_MIN && value <= EnumNumberRange.UINT8_MAX) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagUint8;