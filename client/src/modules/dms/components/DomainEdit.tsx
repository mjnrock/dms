import { useState, useEffect } from "react";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
// import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";

function Label({ text }: any) {
	return (
		<span className="w-2/12 mr-4 font-bold text-gray-500">{ text }:</span>
	);
}

export function DomainEdit({ visible = true, onHide, data, onEdit, parentOptions }: { visible: boolean, onHide: Function, data: any, onEdit: Function, parentOptions: Array<any> }) {
	const [ parentDomainID, setParentDomainID ] = useState<any>(data.ParentDomainID || false);
	const [ name, setName ] = useState(data.Name);
	const [ modParentOptions, setModParentOptions ] = useState([]);
	// const [ isActive, setIsActive ] = useState(!data.DeactivatedDateTimeUTC);

	useEffect(() => {
		const label = (id: any, value: any) => `${ id }: ${ value }`;

		let nextParentOptions: any = parentOptions.reduce((acc: any, [ id, value ]: any) => {
			if (id !== data.DomainID) {
				acc.push(label(id, value));
			}
	
			return acc;
		}, []);
		nextParentOptions.unshift("None");

		setModParentOptions(nextParentOptions);

		if(data.ParentDomainID) {
			for(let parents of parentOptions) {
				const [ id, value ] = parents;

				if(data.ParentDomainID == id) {
					setParentDomainID(label(id, value));
					break;
				}
			}
		}
	}, [ parentOptions ]);

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
					{/* <InputText className="w-10/12 text-gray-900" value={ parentDomainID } onChange={ (e) => setParentDomainID(e.target.value) } /> */}

					<Dropdown className="w-10/12 text-gray-900" value={ parentDomainID } options={ modParentOptions } onChange={ (e) => setParentDomainID(e.target.value) } placeholder="Select a Parent" />
				</div>

				<div className="flex w-full mt-3">
					<Label text="Name" />
					<InputText className="w-10/12 text-gray-900" value={ name } onChange={ (e) => setName(e.target.value) } />
				</div>

				<div className="flex w-full mt-3 p-input-filled">
					<Label text="UUID" />
					<InputText className="w-10/12 text-gray-900" value={ data.UUID } disabled />
				</div>

				{/* <div className="flex w-full mt-3">
					<Label text="Is Active" />
					<InputSwitch className="w-10/12 text-gray-900" checked={ isActive } onChange={ (e) => setIsActive(e.value) } />
				</div> */}

				<div className="flex w-full mt-6">
					<Button className="w-full p-button-success p-button-outlined" label="Save" onClick={ (e) => {
						const obj: any = {};

						if(parentDomainID === "None") {
							obj[ `ParentDomainID` ] = "null";
						} else if(parentDomainID) {
							const [ id ] = parentDomainID.split(": ");

							obj[ `ParentDomainID` ] = +id;
						}

						if(name !== data.Name) {
							obj[ `Name` ] = name;
						}

						/**
						 * Only invoke an update if something has changed.
						 */
						if(Object.keys(obj).length > 0) {
							onEdit(data.DomainID, obj);
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

export default DomainEdit;