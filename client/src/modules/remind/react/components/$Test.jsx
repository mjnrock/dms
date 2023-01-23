import { useContext, useState, useEffect } from "react";

import { useNodeEvent } from "../useNodeEvent";

export function Test({ item, ...rest } = {}) {
	return (
		<div { ...rest }>
			{ (item || {}).id }
		</div>
	)
};

export default Test;