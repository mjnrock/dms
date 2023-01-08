import { useContext, useState, useEffect } from "react";

import { useNodeEvent } from "../useNodeEvent";

export function StatusDropdown({ item, callback, ...rest } = {}) {
	let { complete, options } = item.shared.status;

	return (
		<>
			<div>
				{ options.map((choice, index) => (
					<div
						key={ index }
						className={ `${ complete ? `bg-green-600` : `bg-red-600` }` }
						onClick={ e => {
							callback(item, choice);
						} }
					>
						{ choice }
					</div>
				)) }
			</div>
		</>
	);
};

export default StatusDropdown;