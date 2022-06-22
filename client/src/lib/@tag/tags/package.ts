import _ATag, { EnumTagType } from "./ATag";
import _TagBoolean from "./TagBoolean";
import _TagCharacter from "./TagCharacter";
import _TagCompound from "./TagCompound";
import _TagInt8 from "./TagInt8";
import _TagInt16 from "./TagInt16";
import _TagInt32 from "./TagInt32";
import _TagInt64 from "./TagInt64";
import _TagList from "./TagList";
import _TagNumber from "./TagNumber";
import _TagString from "./TagString";
import _TagUint8 from "./TagUint8";
import _TagUint16 from "./TagUint16";
import _TagUint32 from "./TagUint32";
import _TagUint64 from "./TagUint64";
import _TagUuid from "./TagUuid";

export namespace Tags {
	export type ATag = _ATag;
	export type TagBoolean = _TagBoolean;
	export type TagCharacter = _TagCharacter;
	export type TagCompound = _TagCompound;
	export type TagInt8 = _TagInt8;
	export type TagInt16 = _TagInt16;
	export type TagInt32 = _TagInt32;
	export type TagInt64 = _TagInt64;
	export type TagList = _TagList;
	export type TagNumber = _TagNumber;
	export type TagString = _TagString;
	export type TagUint8 = _TagUint8;
	export type TagUint16 = _TagUint16;
	export type TagUint32 = _TagUint32;
	export type TagUint64 = _TagUint64;
	export type TagUuid = _TagUuid;
	
	export const ATag = _ATag;
	export const TagBoolean = _TagBoolean;
	export const TagCharacter = _TagCharacter;
	export const TagCompound = _TagCompound;
	export const TagInt8 = _TagInt8;
	export const TagInt16 = _TagInt16;
	export const TagInt32 = _TagInt32;
	export const TagInt64 = _TagInt64;
	export const TagList = _TagList;
	export const TagNumber = _TagNumber;
	export const TagString = _TagString;
	export const TagUint8 = _TagUint8;
	export const TagUint16 = _TagUint16;
	export const TagUint32 = _TagUint32;
	export const TagUint64 = _TagUint64;
	export const TagUuid = _TagUuid;

	export function ClassLookup(obj: Tags.ATag | object) {
		const type = obj instanceof ATag ? obj.getType() : obj.type;
		const logicalType = obj instanceof ATag ? obj.getLogicalType() : obj.logicalType;

		switch(type) {
			case EnumTagType.BOOLEAN:
				return TagBoolean;
			case EnumTagType.CHARACTER:
				return TagCharacter;
			case EnumTagType.COMPOUND:
				return TagCompound;
			case EnumTagType.LIST:
				return TagList;
			case EnumTagType.NUMBER:
				switch(logicalType) {
					case EnumTagType.NUMBER:
						return TagNumber;
					case EnumTagType.UINT8:
						return TagUint8;
					case EnumTagType.UINT16:
						return TagUint16;
					case EnumTagType.UINT32:
						return TagUint32;
					case EnumTagType.UINT64:
						return TagUint64;
					case EnumTagType.INT8:
						return TagInt8;
					case EnumTagType.INT16:
						return TagInt16;
					case EnumTagType.INT32:
						return TagInt32;
					case EnumTagType.INT64:
						return TagInt64;
					default:
						return TagNumber;
				}
			case EnumTagType.STRING:
				switch(logicalType) {
					case EnumTagType.STRING:
						return TagString;
					case EnumTagType.UUID:
						return TagUuid;
					default:
						return TagString;
				}
		}

		return false;
	};

	export function Create(obj: Tags.ATag | object) {
		const clazz = ClassLookup(obj);
		if(clazz) {
			const tag = new clazz();

			tag.setName(obj.name);
			tag.setType(obj.type);
			tag.setLogicalType(obj.logicalType);
			tag.setValue(obj.value);

			return tag;
		}

		return false;
	}
};

export default Tags;