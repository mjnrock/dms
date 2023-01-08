import { useContext, useState, useEffect } from "react";

import { useNodeEvent } from "../useNodeEvent";

import { Checklist as SysChecklist } from "../../systems/Checklist";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import ChecklistItem from "../../components/templates/ChecklistItem";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export function Checklist({ item, ...rest } = {}) {
	const { emitter } = useNodeEvent("update", item);
	const [ showCompleted, setShowCompleted ] = useState(true);

	if(!emitter) {
		return null;
	}

	let checklist = [ ...emitter.shared.checklist.list.values() ];

	return (
		<div className={ `flex flex-col p-2 mt-2 ml-4 border border-l-[3px] border-solid border-neutral-200 rounded shadow-sm hover:shadow` }>
			<div className={ `text-xl italic text-center p-2 mt-2 mb-1` }>{ emitter.shared.checklist.title }</div>
			{
				checklist.filter(v => showCompleted ? true : !v.complete).sort((a, b) => a.order - b.order).map((checklistItem, index) => {
					return (
						<div key={ checklistItem.id } className={ `inline-flex p-2 mt-2 mb-0 rounded border border-solid border-neutral-200 shadow-sm hover:shadow` }>
							<div
								className={ `w-6 h-6 cursor-pointer border border-solid rounded border-black ${ checklistItem.complete ? `bg-green-300` : `bg-neutral-100` }` }
								onClick={ e => {
									SysChecklist.toggleChecklistItem(emitter, checklistItem);
								} }
								onContextMenu={ e => {
									e.preventDefault();

									SysChecklist.removeChecklistItem(emitter, checklistItem);
								} }
							/>
							<ReactMarkdown children={ checklistItem.content } className={ `pl-4` } />
						</div>
					);
				})
			}
			<div className={ `` }>
				<input
					className={ `w-full p-2 border border-solid rounded border-neutral-100 shadow mt-2` }
					type="text"
					value={ emitter.content }
					placeholder="Add an item..."
					onKeyUp={ e => {
						if(e.key === "Enter") {
							if(e.target.value.trim().length) {
								SysChecklist.addChecklistItem(emitter, new ChecklistItem({ content: e.target.value }));
							}

							e.target.value = ``;
						} else if(e.key === "Escape") {
							e.target.value = ``;
						}
					} }
				/>

				<button
					className="p-2 mt-2 border border-solid rounded shadow-sm border-neutral-300 hover:bg-blue-200 hover:shadow"
					onClick={ e => {
						setShowCompleted(!showCompleted);
					} }>
					{
						showCompleted ? (
							<EyeIcon className={ `w-4 h-4` } />
						) : (
							<EyeSlashIcon className={ `w-4 h-4` } />
						)
					}
				</button>
			</div>
		</div>
	);
};

export default Checklist;