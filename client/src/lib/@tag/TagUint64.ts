import { EnumTagType } from "./ATag";
import TagNumber, { EnumNumberRange } from "./TagNumber";

export class TagUint64 extends TagNumber {
	constructor(name: string, value: number | null) {
		super(name, value);

		this.setSubType(EnumTagType.INT64);
	}

	public setValue(value: number | null): boolean {
		if(value === null || value >= EnumNumberRange.UINT64_MIN && value <= EnumNumberRange.UINT64_MAX) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagUint64;