import { Tag } from "./../../lib/tags/Tag";
import { TagBoolean } from "./../../lib/tags/TagBoolean";
import { TagCharacter } from "./../../lib/tags/TagCharacter";
import { TagString } from "./../../lib/tags/TagString";
import { TagInt8 } from "./../../lib/tags/TagInt8";
import { TagInt16 } from "./../../lib/tags/TagInt16";
import { TagInt32 } from "./../../lib/tags/TagInt32";
import { TagUint8 } from "./../../lib/tags/TagUint8";
import { TagUint16 } from "./../../lib/tags/TagUint16";
import { TagUint32 } from "./../../lib/tags/TagUint32";
import { TagFloat32 } from "./../../lib/tags/TagFloat32";
import { TagArray } from "./../../lib/tags/TagArray";
import { TagObject } from "./../../lib/tags/TagObject";

import { TagGroup } from "./../../lib/tags/meta/TagGroup";

export const CreateSampleTag = () => {
	const tagBool = new TagBoolean(1, {
		alias: "Example Tag",
	});

	const tagChar = new TagCharacter("Agdf34", {
		alias: "Example Tag Character",
	});

	const tagString = new TagString(1 + "Hello World", {
		alias: "Example Tag String",
	});

	const tagUint8 = new TagUint8(94651, {
		alias: "Example Tag Uint8",
	});

	const tagUint16 = new TagUint16(32168651681685, {
		alias: "Example Tag Uint16",
	});

	const tagUint32 = new TagUint32(5487465415148, {
		alias: "Example Tag Uint32",
	});

	const tagInt8 = new TagInt8(-89465315, {
		alias: "Example Tag Int8",
	});

	const tagInt16 = new TagInt16(543534534, {
		alias: "Example Tag Int16",
	});

	const tagInt32 = new TagInt32(12321514123, {
		alias: "Example Tag Int32",
	});

	const tagFloat = new TagFloat32(123.123, {
		alias: "Example Tag Float",
	});

	const tagArray = new TagArray([ 1, 2, 3 ], {
		alias: "Example Tag Array",
	});

	const tagObject = new TagObject({
		"key1": "value1",
		"key2": "value2",
		"key3": "value3",
	}, {
		alias: "Example Tag Object",
	});

	return new TagGroup([
		tagBool,
		tagChar,
		tagString,
		tagInt8,
		tagInt16,
		tagInt32,
		tagUint8,
		tagUint16,
		tagUint32,
		tagFloat,
		tagArray,
		tagObject,
	], {
		alias: "Example Tag Group",
	});
};

export default CreateSampleTag;