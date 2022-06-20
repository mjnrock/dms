import TagNumber from "../../lib/@tag/TagNumber";

describe("TagNumber", () => {
	const tag = new TagNumber("test", 45.35);

	test("should have a name", () => {
		expect(tag.name).toBe("test");
	});
	test("should have number value", () => {
		expect(typeof tag.getValue() === "number").toBe(true);
	});
});