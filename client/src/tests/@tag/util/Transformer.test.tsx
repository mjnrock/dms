import Transformer from "./../../../lib/@tag/util/Transformer";
import TagCompound from "./../../../lib/@tag/tags/TagCompound";
import TagBoolean from "../../../lib/@tag/tags/TagBoolean";

describe("Transformer", () => {
	const tag = new TagCompound("Container", [
		new TagCompound("SubContainer", [
			new TagBoolean("Boolean", true),
			new TagBoolean("Boolean2", false),
		]),
	]);

	test("should transform a tag", () => {
		expect(true).toBe(true);
	});

	// console.log(tag.getName());
	// console.log(Transformer.ToSchema(tag));
	// console.log(Transformer.FlattenTagStructure(tag));
	console.log(Transformer.ToHierarchy(tag));
});