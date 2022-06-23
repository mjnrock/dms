import TagCharacter from "./../../../lib/@tag/tags/TagCharacter";

describe("TagCharacter", () => {
	const tag = new TagCharacter("test", "a");

	test("should have a name", () => {
		expect(tag.getName()).toBe("test");
	});
	test("should have char value", () => {
		expect(tag.getValue()).toBe("a");
	});
	test("should truncate a string value", () => {
		tag.setValue("abcde");
		
		expect(tag.getValue().length).toBe(1);
	});
});