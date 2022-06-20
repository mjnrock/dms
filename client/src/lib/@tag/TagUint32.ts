import { EnumTagType } from "./ATag";
import TagNumber, { EnumNumberRange } from "./TagNumber";

export class TagUint32 extends TagNumber {
	constructor(name: string, value: number | null) {
		super(name, value);

		this.setType(EnumTagType.INT32);
	}

	public setValue(value: number | null): boolean {
		if(value === null || value >= EnumNumberRange.UINT32_MIN && value <= EnumNumberRange.UINT32_MAX) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagUint32;