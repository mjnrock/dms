import { EnumTagType } from "./ATag";
import TagNumber, { EnumNumberRange } from "./TagNumber";

export class TagInt64 extends TagNumber {
	constructor(name: string, value: number) {
		super(name, value);

		this.setType(EnumTagType.UINT64);
	}

	public setValue(value: number): boolean {
		if(value >= EnumNumberRange.INT64_MIN && value <= EnumNumberRange.INT64_MAX) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagInt64;