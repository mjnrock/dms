import { Tag } from "./../../lib/tags/Tag";
import { TagBoolean } from "./../../lib/tags/TagBoolean";

export const CreateSampleTag = () => {
	const tagBool = new TagBoolean(true, {
		alias: "Example Tag",
	});

	return tagBool;
};

export default CreateSampleTag;