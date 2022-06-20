import { EnumTagType } from "./ATag";
import TagNumber, { EnumNumberRange } from "./TagNumber";

export class TagInt8 extends TagNumber {
	constructor(name: string, value: number) {
		super(name, value);

		this.setType(EnumTagType.UINT8);
	}

	public setValue(value: number): boolean {
		if(value >= EnumNumberRange.INT8_MIN && value <= EnumNumberRange.INT8_MAX) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagInt8;