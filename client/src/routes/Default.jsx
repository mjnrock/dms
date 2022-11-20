import { TagBoolean } from "../lib/dms/tags/TagBoolean";
import { TagString } from "../lib/dms/tags/TagString";
import { TagInt8 } from "../lib/dms/tags/TagInt8";
import { TagUint8 } from "../lib/dms/tags/TagUint8";
import { TagGroup } from "../lib/dms/tags/TagGroup";

export function Default() {
	let tagBool = new TagBoolean(true, {
		alias: "boolz",
	});
	let tagStr = new TagString(123456, {
		alias: "strangs",
	});
	let tagInt8 = new TagInt8(-654, {
		alias: "signed",
	});
	let tagUint8 = new TagUint8(-5, {
		alias: "unsigned",
	});
	let tagGroup = new TagGroup([
		tagBool,
		tagStr,
		tagInt8,
		tagUint8,
	], {
		alias: "gr00pz",
	});

	console.log(tagBool.toObject(true))

	return (
		<div
			className="absolute-root"
		>
			<div>
				{ tagGroup.name }, {
					tagGroup.value.map((tag, i) => {
						return (
							<div key={ i }>
								{ tag.name }, { tag.value.toString() }
							</div>
						)
					})
				}
			</div>
		</div>
	);
};

export default Default;