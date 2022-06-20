import { EnumTagType } from "./ATag";
import TagNumber, { EnumNumberRange } from "./TagNumber";

export class TagUint16 extends TagNumber {
	constructor(name: string, value: number) {
		super(name, value);

		this.setType(EnumTagType.INT16);
	}

	public setValue(value: number): boolean {
		if(value >= EnumNumberRange.UINT16_MIN && value <= EnumNumberRange.UINT16_MAX) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagUint16;