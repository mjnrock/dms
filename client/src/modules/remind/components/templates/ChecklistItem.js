import Identity from "../../lib/Identity";

export function originate(input) {
	if(typeof input === "boolean") {
		return !!input;
	} else if(typeof input === "number") {
		return parseInt(input);
	} else if(typeof input === "string") {
		return input.toString();
	} else if(Array.isArray(input)) {
		return [ ...input ];
	} else if(typeof input === "object") {
		return { ...input };
	} else {
		return input;
	}
};

// export function ChecklistItem({
// 	complete = false,
// 	content = ``,
// 	order = -1,
// } = {}) {
// 	return {
// 		complete: originate(complete),
// 		content: originate(content),
// 		order: originate(order),
// 	};
// };

export class ChecklistItem extends Identity {
	constructor ({
		complete = false,
		content = ``,
		order = -1,
		...identityArgs
	} = {}) {
		super({ ...identityArgs });

		this.complete = originate(complete);
		this.content = originate(content);
		this.order = originate(order);
	}
};

export default ChecklistItem;