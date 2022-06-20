import { EnumTagType } from "./ATag";
import TagNumber, { EnumNumberRange } from "./TagNumber";

export class TagUint64 extends TagNumber {
	constructor(name: string, value: number) {
		super(name, value);

		this.setType(EnumTagType.INT64);
	}

	public setValue(value: number): boolean {
		if(value >= EnumNumberRange.UINT64_MIN && value <= EnumNumberRange.UINT64_MAX) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagUint64;