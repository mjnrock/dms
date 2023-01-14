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

export function CommonTaskBarButtons({ item, onAction = () => { }, ...props } = {}) {
	return (
		<>
			<button
				className="p-2 border border-solid rounded shadow-sm border-neutral-300 hover:bg-neutral-100 hover:shadow"
				onClick={ e => {
					SysChecklist.attachChecklist(item);

					onAction("checklist", item);
				} }>
				<ListBulletIcon className="w-4 h-4 text-neutral-400" />
			</button>

			<button
				className="p-2 ml-2 border border-solid rounded shadow-sm border-neutral-300 hover:bg-neutral-100 hover:shadow"
				onClick={ e => {
					SysItemGroup.removeChild(item.state.parent, item);

					onAction("delete", item);
				} }>
				<TrashIcon className="w-4 h-4 text-neutral-400" />
			</button>
		</>
	);
};

export function ItemTaskBar({ item, onAction = () => { }, ...props } = {}) {
	return (
		<div className="flex flex-row mt-2">
			<CommonTaskBarButtons item={ item } onAction={ onAction } />
		</div>
	);
};
export function GroupItemTaskBar({ item, onAction = () => { }, ...props } = {}) {
	const [ baseItem, setBaseItem ] = useState(item);

	return (
		<div className="flex flex-row mt-2">
			<button
				className="p-2 border border-blue-200 border-solid rounded shadow-sm hover:bg-blue-100 hover:shadow"
				onClick={ e => {
					let next = new ItemJS();

					SysItemGroup.addChild(baseItem, next);

					setBaseItem(baseItem);

					onAction("add-item", baseItem);
				} }>
				<PlusIcon className="w-4 h-4 text-blue-400" />
			</button>

			<button
				className="p-2 ml-2 border border-green-200 border-solid rounded shadow-sm hover:bg-green-100 hover:shadow"
				onClick={ e => {
					let next = new ItemGroupJS();

					SysItemGroup.addChild(baseItem, next);

					setBaseItem(baseItem);

					onAction("add-group", baseItem);
				} }>
				<RectangleGroupIcon className="w-4 h-4 text-green-400" />
			</button>

			<div className={ `ml-2` } />

			<CommonTaskBarButtons item={ item } onAction={ onAction } />
		</div>
	);
};

export function Item({ item, x, y, ...rest }) {
	const { } = useNodeEvent("update", item);
	const [ showChecklist, setShowChecklist ] = useState(false);

	//IDEA: Ideate around how to best do this
	let classNames = ``;
	if(x != null && y != null) {
		classNames = `absolute`;
	}

	function onAction(action, item) {
		if(action === "checklist") {
			setShowChecklist(!showChecklist);
		}
	}

	if(item instanceof ItemGroupJS) {
		return (
			<Wrapper className={ classNames } { ...rest } x={ x } y={ y }>
				<div className={ `mt-2 pt-0 text-neutral-600 p-2 rounded border border-l-4 bg-neutral-50 hover:bg-emerald-50 border-solid border-neutral-200 shadow-lg hover:border-emerald-200 hover:shadow w-full` } { ...rest }>
					<MarkdownEditor item={ item } type={ "title" } />
					{
						item.state.children.map((child, index) => {
							return (
								<div key={ index }>
									<Item item={ child } />
								</div>
							)
						})
					}
					{
						(item.shared.checklist && showChecklist) ? (
							<ChecklistJSX item={ item } />
						) : null
					}
					<GroupItemTaskBar item={ item } onAction={ onAction } />
				</div>
			</Wrapper>
		);
	}

	return (
		<Wrapper className={ classNames } { ...rest }>
			<div className={ `mt-2 p-2 text-neutral-600 rounded border border-l-4 border-solid border-neutral-300 shadow-lg hover:bg-sky-50 hover:border-sky-300 w-full` } { ...rest }>
				<div className="flex flex-row">
					<div className={ `` }>
						<StatusDropdown
							item={ item }
							callback={ (etype, status) => {
								if(etype === "select") {
									SysStatus.setCurrent(item, status);
								}
							} }
						/>
					</div>
					<MarkdownEditor item={ item } type={ "content" } />
				</div>
				{
					(item.shared.checklist && showChecklist) ? (
						<ChecklistJSX item={ item } />
					) : null
				}
				<ItemTaskBar item={ item } onAction={ onAction } />
			</div>
		</Wrapper>
	);
};

export default Item;