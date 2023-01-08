import { useContext, useState, useEffect } from "react";

import { useNodeEvent } from "../useNodeEvent";

import { Checklist as SysChecklist } from "../../systems/Checklist";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import ChecklistItem from "../../components/templates/ChecklistItem";
import { CheckCircleIcon, CheckIcon, EyeIcon, EyeSlashIcon, XCircleIcon } from "@heroicons/react/24/outline";

export function Checklist({ item, ...rest } = {}) {
	const { emitter } = useNodeEvent("update", item);
	const [ showCompleted, setShowCompleted ] = useState(true);

	if(!emitter) {
		return null;
	}

	let checklist = [ ...emitter.shared.checklist.list.values() ];

	return (
		<div className={ `flex flex-col p-2 mt-2 ml-2 border border-l-2 border-solid border-neutral-200 rounded shadow-sm hover:shadow` }>
			<div className={ `text-xl italic text-center p-2 mt-2 mb-1` }>{ emitter.shared.checklist.title }</div>
			{
				checklist.filter(v => showCompleted ? true : !v.complete).sort((a, b) => a.order - b.order).map((checklistItem, index) => {
					return (
						<div key={ checklistItem.id } className={ `inline-flex p-2 mt-2 mb-0 rounded border border-solid border-neutral-200 shadow-sm hover:shadow` }>
							<div
								className={ `p-2 rounded-full cursor-pointer ${ checklistItem.complete ? `text-emerald-400 hover:text-rose-300 hover:bg-rose-50` : `text-neutral-400 hover:text-emerald-300 hover:bg-emerald-50` }` }
								onClick={ e => {
									if(e.ctrlKey || e.metaKey) {
										SysChecklist.removeChecklistItem(emitter, checklistItem);
									} else {
										SysChecklist.toggleChecklistItem(emitter, checklistItem);
									}
								} }
							>
								{
									checklistItem.complete ? (
										<div className={ `w-5 h-5 border-2 border-solid hover:border-rose-400 hover:bg-rose-300 border-emerald-400 bg-emerald-300 rounded-full` } />
									) : (
										<div className={ `w-5 h-5 border-2 border-solid border-neutral-400 hover:bg-emerald-100 rounded-full` } />
									)
								}
							</div>
							<ReactMarkdown children={ checklistItem.content } className={ `pl-4 my-auto` } />
						</div>
					);
				})
			}
			<div className={ `` }>
				<input
					className={ `w-full p-2 border border-solid rounded border-neutral-100 shadow mt-2 focus:outline-neutral-300` }
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

				<div className={ `flex flew-row` }>
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

					<div className={ `font-mono my-auto text-neutral-500 text-[10px] ml-2 pt-1` }>{ showCompleted ? checklist.length : checklist.filter(v => !v.complete).length } / { checklist.length }</div>
				</div>
			</div>
		</div>
	);
};

export default Checklist;