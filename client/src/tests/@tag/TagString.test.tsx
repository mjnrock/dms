import TagString from "../../lib/@tag/TagString";

describe("TagString", () => {
	const tag = new TagString("test", "this is a string");

	test("should have a name", () => {
		expect(tag.name).toBe("test");
	});
	test("should have string value", () => {
		expect(typeof tag.getValue() === "string").toBe(true);
	});
	test("should have a > 0 length", () => {		
		expect(tag.length() > 0).toBe(true);
	});
});