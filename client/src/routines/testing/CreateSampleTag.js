import { Tag } from "./../../lib/tags/Tag";
import { TagBoolean } from "./../../lib/tags/TagBoolean";
import { TagCharacter } from "./../../lib/tags/TagCharacter";
import { TagString } from "./../../lib/tags/TagString";
import { TagUint8 } from "./../../lib/tags/TagUint8";
import { TagInt8 } from "./../../lib/tags/TagInt8";
import { TagArray } from "./../../lib/tags/TagArray";
import { TagObject } from "./../../lib/tags/TagObject";

import { TagGroup } from "./../../lib/tags/meta/TagGroup";

export const CreateSampleTag = () => {
	const tagBool = new TagBoolean(true, {
		alias: "Example Tag",
	});

	const tagChar = new TagCharacter("A", {
		alias: "Example Tag Character",
	});

	const tagString = new TagString("Hello World", {
		alias: "Example Tag String",
	});

	const tagUint8 = new TagUint8(255, {
		alias: "Example Tag Uint8",
	});

	const tagInt8 = new TagInt8(-128, {
		alias: "Example Tag Int8",
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
		tagUint8,
		tagInt8,
		tagArray,
		tagObject,
	], {
		alias: "Example Tag Group",
	});
};

export default CreateSampleTag;