import TagCharacter from "../../lib/@tag/TagCharacter";

describe("TagCharacter", () => {
	const tag = new TagCharacter("test", "a");

	test("should have a name", () => {
		expect(tag.name).toBe("test");
	});
	test("should have char value", () => {
		expect(tag.getValue()).toBe("a");
	});
	test("should truncate a string value", () => {
		tag.setValue("abcde");
		
		expect(tag.getValue().length).toBe(1);
	});
});