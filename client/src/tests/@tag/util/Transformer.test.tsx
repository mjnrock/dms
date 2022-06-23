import Tags from "./../../../lib/@tag/tags/package";
import Transformer from "./../../../lib/@tag/util/Transformer";

describe("Transformer", () => {
	const tag = new Tags.TagCompound("Container", [
		new Tags.TagCompound("SubContainer", [
			new Tags.TagBoolean("Boolean", true),
			new Tags.TagBoolean("Boolean2", false),
			new Tags.TagUint8("Uint8", 25),
		]),
	]);

	const toObj = Transformer.ToObject(tag);
	test("should be an pure object", () => {
		expect(Object.getPrototypeOf(toObj)).toBe(Object.prototype);
	});

	const fromObj = Transformer.FromObject(toObj);
	test("should reconstruct an object into a tag", () => {
		expect(fromObj).toBeInstanceOf(Tags.ATag);
		expect(fromObj).toBeInstanceOf(Tags.TagCompound);	//TEST
	});

	test("should serialize into a string", () => {
		const toStr = Transformer.ToString(fromObj as any);

		expect(typeof toStr).toBe("string");
		expect(toStr).toContain("25");						//TEST
	});

	test("should be an array of tags", () => {
		const flat = Transformer.FlattenTagStructure(fromObj as any);

		expect(Array.isArray(flat)).toBe(true);
		expect(flat.every(ele => ele instanceof Tags.ATag)).toBe(true);
	});

	test("should be a hierarchy array", () => {
		const toHier = Transformer.ToHierarchy(fromObj as any);

		expect(Array.isArray(toHier)).toBe(true);
		expect(toHier.every(([ id, pid ]: any) => typeof id === "number" && typeof (pid === "number" || id === null))).toBe(true);
	});

	test("should be a schema array", () => {
		const toSch = Transformer.ToSchema(fromObj as any);

		expect(Array.isArray(toSch)).toBe(true);
		expect(toSch.every((obj: any) => Object.getPrototypeOf(toObj) === Object.prototype)).toBe(true);
		expect(toSch.every((obj: any) => typeof obj.id === "number" && typeof (obj.pid === "number" || obj.id === null))).toBe(true);
	});
});