import TagBoolean from "../../lib/@tag/TagBoolean";

describe("TagBoolean", () => {
	const tag = new TagBoolean("test", true);

	test("should have a name", () => {
		expect(tag.name).toBe("test");
	});
	test("should have boolean value", () => {
		expect(typeof tag.getValue() === "boolean").toBe(true);
	});
	test("can be toggled", () => {
		tag.setValue(true);

		tag.toggle();
		expect(tag.getValue()).toBe(false);
		
		tag.toggle();
		expect(tag.getValue()).toBe(true);
	});
});