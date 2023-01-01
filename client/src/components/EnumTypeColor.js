import { EnumTagType } from "../lib/tags/Tag";

export const EnumTypeColor = new Map([
	[ EnumTagType.ANY, [ "gray", 200 ] ],
	[ EnumTagType.BOOLEAN, [ "purple", 200 ] ],
	[ EnumTagType.INT8, [ "blue", 200 ] ],
	[ EnumTagType.INT16, [ "blue", 300 ] ],
	[ EnumTagType.INT32, [ "blue", 400 ] ],
	[ EnumTagType.UINT8, [ "teal", 200 ] ],
	[ EnumTagType.UINT16, [ "teal", 300 ] ],
	[ EnumTagType.UINT32, [ "teal", 400 ] ],
	[ EnumTagType.FLOAT32, [ "teal", 400 ] ],
	[ EnumTagType.CHARACTER, [ "orange", 200 ] ],
	[ EnumTagType.STRING, [ "red", 200 ] ],
	[ EnumTagType.ARRAY, [ "gray", 200 ] ],
	[ EnumTagType.OBJECT, [ "gray", 200 ] ],
	[ EnumTagType.FUNCTION, [ "gray", 200 ] ],
	[ EnumTagType.GROUP, [ "gray", 200 ] ],
	[ EnumTagType.NAMESPACE, [ "gray", 200 ] ],
	[ EnumTagType.SCHEMA, [ "gray", 200 ] ],
]);

export function TypeColor(type) {
	let color = EnumTypeColor.get(type);

	if(color) {
		return color;
	}

	return [ "gray", 200 ];
}

export default EnumTypeColor;