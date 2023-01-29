import { useContext, useState, useEffect } from "react";

import { useNodeEvent } from "../useNodeEvent";

export function Test({ item, ...rest } = {}) {
	let tokens = Array.from((item || {}).tokens || []);

	return (
		<div { ...rest }>
			{ tokens.join(",") }
		</div>
	)
};

export default Test;