import { useContext, useState, useEffect } from "react";

import { useNodeEvent } from "../useNodeEvent";

export function Test({ item, ...rest } = {}) {
	let tokens = Array.from((item || {}).tokens || []);

	return (
		<div { ...rest } className={ `p-4` + rest.className }>
			<div className="text-xl">{ item.id }</div>
			<br />
			<div className="text-xs">{ tokens.join(",") }</div>
		</div>
	)
};

export default Test;