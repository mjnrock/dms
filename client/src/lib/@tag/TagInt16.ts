import { EnumTagType } from "./ATag";
import TagNumber, { EnumNumberRange } from "./TagNumber";

export class TagInt16 extends TagNumber {
	constructor(name: string, value: number) {
		super(name, value);

		this.setType(EnumTagType.UINT16);
	}

	public setValue(value: number): boolean {
		if(value >= EnumNumberRange.INT16_MIN && value <= EnumNumberRange.INT16_MAX) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagInt16;