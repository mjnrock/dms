import ATag, { EnumTagType } from "../../../lib/@tag/tags/ATag";

describe("ATag", () => {
	const tag = new ATag({
		type: EnumTagType.ANY,
		name: "test",
		value: null,
	});

	test("should be 'any'", () => {
		expect(tag.getType()).toBe(EnumTagType.ANY);
	});
	test("should have a name", () => {
		expect(tag.getName()).toBe("test");
	});
});