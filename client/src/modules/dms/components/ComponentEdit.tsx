import { useState } from "react";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
// import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";

function Label({ text }: any) {
	return (
		<span className="w-2/12 mr-4 font-bold text-gray-500">{ text }:</span>
	);
}

export function ComponentData({ data }: any) {
	const rowData = JSON.parse(data.Data);

	return (
		<div className="flex flex-wrap w-full">
			<span className="w-full mr-4 font-bold text-gray-500">Data:</span>
			<div className="w-full mt-3">
				{
					Object.entries(rowData).map(([ key, value ]: any) => (
						<div className="flex w-full gap-4 mt-3" key={ key }>
							<i className="pt-4 text-gray-400 pi pi-bars" />
							<InputText className="w-3/12" value={ key } />
							<InputText className="w-8/12" value={ value } />
							<Button className="w-1/12 p-button-secondary p-button-rounded p-button-text" icon="pi pi-ellipsis-h" />
						</div>
					))
				}
			</div>

			<div className="w-full mt-4">
				<Button className="w-1/5 h-10 p-button-secondary p-button-outlined p-button-raised" label="Add" icon="pi pi-plus" />
			</div>
		</div>
	);
}

export function ComponentEdit({ visible = true, onHide, data, onEdit }: { visible: boolean, onHide: Function, data: any, onEdit: Function }) {
	const [ name, setName ] = useState(data.Name);
	// const [ isActive, setIsActive ] = useState(!data.DeactivatedDateTimeUTC);

	const header = () => (
		<div>
			<i className="mr-4 text-gray-600 pi pi-pencil" style={ { fontSize: "1.25rem" } } />
			<span className="font-bold text-gray-600">Edit Row</span>
		</div>
	);

	return (
		<Dialog header={ header } visible={ visible } maximizable modal style={ { width: '50vw' } } onHide={ () => onHide() }>
			<div className="flex flex-wrap">
				<div className="flex w-full mt-3 p-input-filled">
					<Label text="ID" />
					<InputText className="w-10/12 text-gray-900" value={ data.ComponentID } disabled />
				</div>

				<div className="flex w-full mt-3">
					<Label text="Name" />
					<InputText className="w-10/12 text-gray-900" value={ name } onChange={ (e) => setName(e.target.value) } />
				</div>

				<ComponentData data={ data } />

				<div className="flex w-full mt-8 p-input-filled">
					<Label text="UUID" />
					<InputText className="w-10/12 text-gray-900" value={ data.UUID } disabled />
				</div>

				{/* <div className="flex w-full mt-3">
					<Label text="Is Active" />
					<InputSwitch className="w-10/12 text-gray-900" checked={ isActive } onChange={ (e) => setIsActive(e.value) } />
				</div> */}

				<div className="flex w-full mt-6">
					<Button className="w-full p-button-success p-button-raised" label="Save" onClick={ (e) => {
						const obj: any = {};

						if(name !== data.Name) {
							obj[ `Name` ] = name;
						}

						/**
						 * Only invoke an update if something has changed.
						 */
						if(Object.keys(obj).length > 0) {
							onEdit(data.ComponentID, obj);
							onHide();
						} else {
							onHide();
						}
					} } />
				</div>
			</div>
		</Dialog>
	);
};

export default ComponentEdit;