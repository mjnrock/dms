import { EnumTagType } from "./ATag";
import TagNumber, { EnumNumberRange } from "./TagNumber";

export class TagInt64 extends TagNumber {
	constructor(name: string, value: number | null) {
		super(name, value);

		this.setLogicalType(EnumTagType.INT64);
	}

	public setValue(value: number | null): boolean {
		if(value === null || value >= EnumNumberRange.INT64_MIN && value <= EnumNumberRange.INT64_MAX) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagInt64;