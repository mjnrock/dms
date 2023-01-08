import { useContext, useState, useEffect } from "react";

import { useNodeEvent } from "../useNodeEvent";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export const StatusColor = {
	[ `Not Started` ]: `red-500`,
	[ `In Progress` ]: `yellow-500`,
	[ `Complete` ]: `green-500`,
};

export function StatusDropdown({ item, callback, ...rest } = {}) {
	const [ isOpen, setIsOpen ] = useState(false);

	let { complete, current, options } = item.shared.status;

	return (
		<div className={ `whitespace-nowrap cursor-pointer` } { ...rest }>
			<div
				className={ `flex flex-row p-2 text-center font-bold` }
				onClick={ e => {
					setIsOpen(!isOpen);
				} }
			>
				<div className="w-full my-auto">
					<div className={ `w-3 h-3 p-1 rounded-full bg-${ StatusColor[ current ] }` } />
				</div>
				<ChevronDownIcon className={ `ml-1 w-3 h-3 my-auto` } />
			</div>
			{
				isOpen ? (
					<div className={ `flex flex-col rounded-b border border-solid border-neutral-200 shadow-sm` }>
						{
							options.map((option, index) => {
								return (
									<div
										key={ option }
										className={ `p-2 hover:bg-neutral-100 flex flex-row ${ current === option ? `bg-neutral-200` : `` }` }
										onClick={ e => {
											callback(option);
											setIsOpen(false);
										} }
									>
										<div className={ `w-2 h-2 p-1 rounded-full bg-${ StatusColor[ option ] } my-auto` } />
										<div className={ `ml-2` }>{ option }</div>
									</div>
								);
							})
						}
					</div>
				) : null
			}
		</div>
	);
};

export default StatusDropdown;