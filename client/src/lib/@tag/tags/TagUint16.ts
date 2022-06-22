import { EnumTagType } from "./ATag";
import TagNumber, { EnumNumberRange } from "./TagNumber";

export class TagUint16 extends TagNumber {
	constructor(name: string, value: number | null) {
		super(name, value);

		this.setLogicalType(EnumTagType.UINT16);
	}

	public setValue(value: number | null): boolean {
		if(value === null || value >= EnumNumberRange.UINT16_MIN && value <= EnumNumberRange.UINT16_MAX) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagUint16;