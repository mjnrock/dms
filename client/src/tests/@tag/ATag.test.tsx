import ATag, { EnumTagType } from "../../lib/@tag/ATag";

describe("ATag", () => {
	const tag = new ATag({
		type: EnumTagType.GENERIC,
		name: "test",
		value: null,
	});

	test("should be 'generic'", () => {
		expect(tag.type).toBe(EnumTagType.GENERIC);
	});
	test("should have a name", () => {
		expect(tag.name).toBe("test");
	});
});