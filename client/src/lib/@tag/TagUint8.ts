import { EnumTagType } from "./ATag";
import TagNumber, { EnumNumberRange } from "./TagNumber";

export class TagUint8 extends TagNumber {
	constructor(name: string, value: number) {
		super(name, value);

		this.setType(EnumTagType.INT8);
	}

	public setValue(value: number): boolean {
		if(value >= EnumNumberRange.UINT8_MIN && value <= EnumNumberRange.UINT8_MAX) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagUint8;