import ATag, { EnumTagType } from "../../lib/@tag/tags/ATag";

describe("ATag", () => {
	const tag = new ATag({
		type: EnumTagType.GENERIC,
		name: "test",
		value: null,
	});

	test("should be 'generic'", () => {
		expect(tag.getType()).toBe(EnumTagType.GENERIC);
	});
	test("should have a name", () => {
		expect(tag.getName()).toBe("test");
	});
});