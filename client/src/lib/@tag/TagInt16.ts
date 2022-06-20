import { EnumTagType } from "./ATag";
import TagNumber, { EnumNumberRange } from "./TagNumber";

export class TagInt16 extends TagNumber {
	constructor(name: string, value: number | null) {
		super(name, value);

		this.setType(EnumTagType.UINT16);
	}

	public setValue(value: number | null): boolean {
		if(value === null || value >= EnumNumberRange.INT16_MIN && value <= EnumNumberRange.INT16_MAX) {
			this.value = value;

			return true;
		}

		return false;
	}
}

export default TagInt16;