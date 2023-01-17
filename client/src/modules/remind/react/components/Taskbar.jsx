import { CogIcon, DocumentIcon, ListBulletIcon, PhotoIcon, PlusIcon, RectangleGroupIcon, TrashIcon } from "@heroicons/react/24/outline";

import { useState } from "react";

import Base64 from "../../../../util/Base64";

import { Item as SysItem } from "./../../systems/class/Item";
import { ItemGroup as SysItemGroup } from "./../../systems/class/ItemGroup";

import { Item as ItemJS } from "./../../lib/Item";
import { ItemGroup as ItemGroupJS } from "./../../lib/ItemGroup";
import { ItemChecklist as ItemChecklistJS } from "./../../lib/custom/ItemChecklist";
import { ItemImage as ItemImageJS } from "../../lib/custom/ItemImage";

import Components from "./../../components/package";

export function CommonTaskBarButtons({ item, onAction = () => { }, attr = {}, ...props } = {}) {
	const { showChecklist } = attr;

	return (
		<>
			{
				item.hasToken(`@remind:item-group`) ? (
					<button
						className={ `p-2 border border-solid rounded shadow-sm border-neutral-300 hover:bg-neutral-100 hover:shadow ${ item.shared.checklist ? `text-orange-200 border-orange-200` : `text-neutral-400` } ${ showChecklist ? `bg-orange-50 hover:bg-orange-100` : `` }` }
						onClick={ e => {
							let next = new ItemChecklistJS();

							SysItemGroup.addChild(item, next);

							onAction("checklist", item);
						} }>
						<ListBulletIcon className="w-4 h-4" />
					</button>
				) : null
			}

			<button
				className="p-2 border border-gray-300 border-solid rounded shadow-sm hover:bg-gray-50 hover:border-gray-400 hover:text-gray-400 hover:shadow"
				onClick={ e => {
					onAction("config", item);
				} }>
				<CogIcon className="w-4 h-4 text-gray-400" />
			</button>

			<button
				className="p-2 border border-solid rounded shadow-sm border-rose-300 hover:bg-rose-50 hover:border-rose-400 hover:text-rose-400 hover:shadow"
				onClick={ e => {
					SysItemGroup.removeChild(item.state.parent, item);

					onAction("delete", item);
				} }>
				<TrashIcon className="w-4 h-4 text-rose-400" />
			</button>
		</>
	);
};

export function ItemTaskBar({ item, onAction = () => { }, attr, ...props } = {}) {
	return (
		<div className="flex flex-row mt-2 space-x-2">
			<CommonTaskBarButtons item={ item } onAction={ onAction } attr={ attr } />
		</div>
	);
};
export function GroupItemTaskBar({ item, onAction = () => { }, attr, ...props } = {}) {
	const [ baseItem, setBaseItem ] = useState(item);

	return (
		<div className="flex flex-row mt-2 space-x-2">
			<button
				className="p-2 border border-solid rounded shadow-sm border-neutral-400 hover:bg-neutral-200 hover:shadow"
				onClick={ e => {
					let next = new ItemJS();

					SysItemGroup.addChild(baseItem, next);

					setBaseItem(baseItem);

					onAction("add-item", baseItem);
				} }>
				<PlusIcon className="w-4 h-4 text-neutral-800" />
			</button>

			<button
				className="p-2 border border-blue-200 border-solid rounded shadow-sm hover:bg-blue-100 hover:shadow"
				onClick={ e => {
					let next = new ItemJS();

					SysItem.addComponent(next, `markdown`, Components.Markdown);
					SysItem.addComponent(next, `status`, Components.Status);

					SysItemGroup.addChild(baseItem, next);

					setBaseItem(baseItem);

					onAction("add-item", baseItem);
				} }>
				<DocumentIcon className="w-4 h-4 text-blue-400" />
			</button>

			<button
				className="p-2 border border-green-200 border-solid rounded shadow-sm hover:bg-green-100 hover:shadow"
				onClick={ e => {
					let next = new ItemGroupJS();

					SysItemGroup.addChild(baseItem, next);

					setBaseItem(baseItem);

					onAction("add-group", baseItem);
				} }>
				<RectangleGroupIcon className="w-4 h-4 text-green-400" />
			</button>

			<label
				htmlFor={ item.id }
				className="p-2 border border-solid rounded shadow-sm cursor-pointer border-violet-200 hover:bg-violet-100 hover:shadow"
			>
				<input
					className="hidden"
					type="file"
					id={ item.id }
					accept="image/*"
					onChange={ e => {
						Base64.DecodeFile(e.target.files[ 0 ]).then((canvas) => {
							let next = new ItemImageJS({
								shared: {
									image: {
										canvas: canvas,
									},
								},
							});

							SysItemGroup.addChild(baseItem, next);

							setBaseItem(baseItem);

							onAction("add-group", baseItem);

							e.target.value = null;
						});
					} }
				/>
				<PhotoIcon className="w-4 h-4 text-violet-400" />
			</label>

			<CommonTaskBarButtons item={ item } onAction={ onAction } attr={ attr } />
		</div>
	);
};

export function TaskBar({ item, ...props }) {
	if(item.hasToken(`@remind:item-group`)) {
		return <GroupItemTaskBar item={ item } { ...props } />;
	}

	return <ItemTaskBar item={ item } { ...props } />;
};

export default TaskBar;