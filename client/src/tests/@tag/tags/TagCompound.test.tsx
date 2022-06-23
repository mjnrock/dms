import TagBoolean from "./../../../lib/@tag/tags/TagBoolean";
import TagCompound from "./../../../lib/@tag/tags/TagCompound";
import TagString from "./../../../lib/@tag/tags/TagString";

describe("TagCompound", () => {
	const tag = new TagCompound("a", [
		new TagCompound("a.a", [
			new TagString("a.a.a", "cats"),
			new TagString("a.a.b", "stac"),
		]),
		new TagBoolean("a.b", true),
	]);

	test("should have a name", () => {
		tag.setName("test");

		expect(tag.getName()).toBe("test");
	});
	test("should have iterable children", () => {
		expect(tag.getValue()[ Symbol.iterator ]).toBeDefined();
		expect(typeof tag.getValue() !== "string").toBe(true);
	});
});
