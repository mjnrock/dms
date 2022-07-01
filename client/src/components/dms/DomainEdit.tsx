import { useState } from "react";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";

function Label({ text }: any) {
	return (
		<span className="w-2/12 mr-4 font-bold text-gray-500">{ text }:</span>
	);
}

export function DomainEdit({ visible = true, onHide, data }: { visible: boolean, onHide: Function, data: any }) {
	const [ parentDomainID, setParentDomainID ] = useState(data.ParentDomainID || "");
	const [ name, setName ] = useState(data.Name);
	const [ isActive, setIsActive ] = useState(!data.DeactivatedDateTimeUTC);

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
					<InputText className="w-10/12 text-gray-900" value={ data.DomainID } disabled />
				</div>
				<div className="flex w-full mt-3">
					<Label text="Parent" />
					<InputText className="w-10/12 text-gray-900" value={ parentDomainID } onChange={ (e) => setParentDomainID(e.target.value) } />
				</div>

				<div className="flex w-full mt-3">
					<Label text="Name" />
					<InputText className="w-10/12 text-gray-900" value={ name } onChange={ (e) => setName(e.target.value) } />
				</div>

				<div className="flex w-full mt-3 p-input-filled">
					<Label text="UUID" />
					<InputText className="w-10/12 text-gray-900" value={ data.UUID } disabled />
				</div>

				<div className="flex w-full mt-3">
					<Label text="Is Active" />
					<InputSwitch className="w-10/12 text-gray-900" checked={ isActive } onChange={ (e) => setIsActive(e.value) } />
				</div>
				
				<div className="flex w-full mt-6">
					<Button className="w-full p-button-outlined" label="Submit" />
				</div>
			</div>
		</Dialog>
	);
};

export default DomainEdit;