import { Cog6ToothIcon, ListBulletIcon, LockClosedIcon, LockOpenIcon, PencilIcon, PlusIcon, RectangleGroupIcon, TrashIcon } from "@heroicons/react/24/outline";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useState, useEffect, useRef } from "react";
import { useNodeEvent } from "./../useNodeEvent";

import { Status as SysStatus } from "../../systems/Status";
import { Item as SysItem } from "../../systems/Item";
import { ItemGroup as SysItemGroup } from "./../../systems/class/ItemGroup";
import { Checklist as SysChecklist } from "./../../systems/Checklist";

import { Item as ItemJS } from "./../../lib/Item";
import { ItemGroup as ItemGroupJS } from "./../../lib/ItemGroup";
import { ItemCollection as ItemCollectionJS } from "./../../lib/ItemCollection";
import { Node as NodeJS } from "../../lib/Node";

import { Checklist as ChecklistJSX } from "./Checklist";
import { MarkdownEditor } from "./MarkdownEditor";
import { StatusDropdown } from "./StatusDropdown";

const Wrapper = ({ className, x, y, children, ...rest }) => {
	return (
		<div className={ className + ` bg-white min-w-[350px]` } style={ { top: y, left: x } } { ...rest }>
			<div className={ `` }>
				{ children }
			</div>
		</div>
	);
};

export function Item({ item, x, y, ...rest }) {
	const [ baseItem, setBaseItem ] = useState(item);

	// const { emitter, prop, current, previous } = useNodeEvent("update", baseItem);
	const { } = useNodeEvent("update", baseItem);

	let classNames = ``;
	if(x != null && y != null) {
		classNames = `absolute`;
		// classNames = `absolute p-4`;
	}

	if(baseItem instanceof ItemGroupJS) {
		return (
			<Wrapper className={ classNames } { ...rest } x={ x } y={ y }>
				<div className={ `mt-2 pt-0 p-2 rounded border border-solid border-neutral-200 shadow-sm hover:shadow w-full` } { ...rest }>
					<MarkdownEditor item={ baseItem } type={ "title" } />
					{
						baseItem.state.children.map((child, index) => {
							return (
								<div key={ index }>
									<Item item={ child } />
								</div>
							)
						})
					}
					{
						baseItem.shared.checklist ? (
							<ChecklistJSX item={ baseItem } />
						) : null
					}
					<div className="flex flex-row mt-2">
						<button
							className="p-2 border border-blue-200 border-solid rounded shadow-sm hover:bg-blue-100 hover:shadow"
							onClick={ e => {
								let next = new ItemJS();

								SysItemGroup.addChild(baseItem, next);

								setBaseItem(baseItem);
							} }>
							<PlusIcon className="w-4 h-4 text-blue-400" />
						</button>

						<button
							className="p-2 ml-2 border border-green-200 border-solid rounded shadow-sm hover:bg-green-100 hover:shadow"
							onClick={ e => {
								let next = new ItemGroupJS();

								SysItemGroup.addChild(baseItem, next);

								setBaseItem(baseItem);
							} }>
							<RectangleGroupIcon className="w-4 h-4 text-green-400" />
						</button>

						<button
							className="p-2 ml-2 border border-solid rounded shadow-sm border-neutral-300 hover:bg-neutral-100 hover:shadow"
							onClick={ e => {
								SysChecklist.attachChecklist(baseItem);
							} }>
							<ListBulletIcon className="w-4 h-4 text-neutral-400" />
						</button>
					</div>
				</div>
			</Wrapper>
		);
	}

	return (
		<Wrapper className={ classNames } { ...rest }>
			<div className={ `mt-2 p-2 rounded border border-solid border-neutral-200 shadow-sm hover:shadow w-full` } { ...rest }>
				<div className="flex flex-row">
					<div className={ `` }>
						<StatusDropdown
							item={ baseItem }
							callback={ (etype, status) => {
								if(etype === "select") {
									SysStatus.setCurrent(baseItem, status);
								}
							} }
						/>
					</div>
					<MarkdownEditor item={ baseItem } type={ "content" } />
				</div>
				{
					baseItem.shared.checklist ? (
						<ChecklistJSX item={ baseItem } />
					) : (
						<div className="flex flex-row mt-2">
							<button
								className="p-2 border border-solid rounded shadow-sm border-neutral-300 hover:bg-neutral-100 hover:shadow"
								onClick={ e => {
									SysChecklist.attachChecklist(baseItem);
								} }>
								<ListBulletIcon className="w-4 h-4 text-neutral-400" />
							</button>
						</div>
					)
				}
			</div>
		</Wrapper>
	);
};

export default Item;