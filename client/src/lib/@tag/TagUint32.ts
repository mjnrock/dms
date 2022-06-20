import { EnumTagType } from "./ATag";
import TagNumber, { EnumNumberRange } from "./TagNumber";

export class TagUint32 extends TagNumber {
	constructor(name: string, value: number) {
		super(name, value);

		this.setType(EnumTagType.INT32);
	}

	public setValue(value: number): boolean {
		if(value >= EnumNumberRange.UINT32_MIN && value <= EnumNumberRange.UINT32_MAX) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagUint32;