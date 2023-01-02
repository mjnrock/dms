import { useState, useEffect } from "react";

export function Default() {
	const modules = [
		[ `/tags`, `Tags` ],
		[ `/remind`, `Remind` ]
	]
	return (
		<div>
			<h1>Select a Module</h1>

			<ul>
				{
					modules.map(([ uri, label ], index) => (
						<li key={ index }>
							<a href={ uri }>{ label }</a>
						</li>
					))
				}
			</ul>
		</div>
	);
};

export default Default;