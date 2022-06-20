import ATag, { EnumTagType } from "./ATag";

/**
 * BigInt is throwing some shit here and idgaf, so Object is used instead of Enum
 */
export const EnumNumberRange = {
	INT8_MIN: -127,
	INT8_MAX: 127,
	UINT8_MIN: 0,
	UINT8_MAX: 255,

	INT16_MIN: -32767,
	INT16_MAX: 32767,
	UINT16_MIN: 0,
	UINT16_MAX: 65535,

	INT32_MIN: -2147483647,
	INT32_MAX: 2147483647,
	UINT32_MIN: 0,
	UINT32_MAX: 4294967295,

	INT64_MIN: -9007199254740991, //  Number.MIN_SAFE_INTEGER (-1 + 2^53)
	INT64_MAX: 9007199254740991, //  Number.MAX_SAFE_INTEGER (-1 + 2^53)
	UINT64_MIN: 0,
	UINT64_MAX: 18446744073709551615n,
};

export class TagNumber extends ATag {
	constructor(name: string, value: number) {
		super({
			type: EnumTagType.NUMBER,
			name: name,
			value: value,
		});
	}

	public setValue(value: number): boolean {
		this.value = value;

		return true;
	}
}

export default TagNumber;
