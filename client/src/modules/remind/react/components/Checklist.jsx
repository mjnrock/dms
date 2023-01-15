import { useContext, useState, useEffect } from "react";

import { useNodeEvent } from "../useNodeEvent";

import { Checklist as SysChecklist } from "../../systems/Checklist";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import ComponentChecklistItem from "../../components/templates/ChecklistItem";
import { CheckIcon, EyeIcon, EyeSlashIcon, MinusIcon } from "@heroicons/react/24/outline";

export function ChecklistItem({ item, checklistItem, ...rest } = {}) {
	return (
		<div key={ checklistItem.id } className={ `inline-flex p-2 mt-2 mb-0 rounded border border-l-2 border-solid ${ checklistItem.complete ? `border-emerald-200` : `border-neutral-200` } shadow-sm hover:shadow` }>
			<div
				className={ `p-2 rounded-full cursor-pointer ${ checklistItem.complete ? `text-emerald-400 hover:text-rose-300 hover:bg-rose-50` : `text-neutral-400 hover:text-emerald-300 hover:bg-emerald-50` }` }
				onClick={ e => {
					if(e.ctrlKey || e.metaKey) {
						SysChecklist.removeChecklistItem(item, checklistItem);
					} else {
						SysChecklist.toggleChecklistItem(item, checklistItem);
					}
				} }
			>
				{
					checklistItem.complete ? (
						<CheckIcon className={ `w-5 h-5` } />
					) : (
						<MinusIcon className={ `w-5 h-5` } />
					)
				}
			</div>
			<ReactMarkdown children={ checklistItem.content } className={ `pl-4 my-auto` } />
		</div>
	);
}

export function Checklist({ item, ...rest } = {}) {
	const { emitter } = useNodeEvent("update", item);
	const [ showCompleted, setShowCompleted ] = useState(true);

	if(!emitter) {
		return null;
	}

	let checklist = [ ...emitter.shared.checklist.list.values() ];

	return (
		<div className={ `flex flex-col p-2 mt-2 ml-1 border border-l-2 border-solid border-neutral-200 rounded shadow-sm hover:shadow` }>
			<ReactMarkdown className={ `text-xl text-center p-2 mt-2 mb-1` }>{ emitter.shared.checklist.title }</ReactMarkdown>
			{
				checklist.filter(v => showCompleted ? true : !v.complete).sort((a, b) => a.order - b.order).map((checklistItem, index) => (
					<ChecklistItem key={ checklistItem.id } item={ item } checklistItem={ checklistItem } />
				))
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
								SysChecklist.addChecklistItem(emitter, new ComponentChecklistItem({ content: e.target.value }));
							}

							e.target.value = ``;
						} else if(e.key === "Escape") {
							e.target.value = ``;
						}
					} }
				/>

				<div className={ `flex flew-row` }>
					<button
						className={ `p-2 mt-2 border border-solid rounded shadow-sm ${ showCompleted ? `border-emerald-200 bg-emerald-50` : `border-neutral-200 bg-neutral-50` } hover:bg-neutral-100 hover:shadow text-neutral-300` }
						onClick={ e => {
							setShowCompleted(!showCompleted);
						} }>
						{
							showCompleted ? (
								<EyeIcon className={ `w-4 h-4 text-emerald-200` } />
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