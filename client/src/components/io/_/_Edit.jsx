//TODO: Change the <input> `onChange` handler to instead update local state, and then in `onKeyUp` event, capture e.key === "Enter" to invoke the `onChange` prop.
export function Edit({ schema, onChange, namespace }) {
	if(namespace) {
		namespace = `${ namespace }.`;
	} else {
		namespace = "";
	}
	

	//TODO: Need a way to delete a key-value-pair from the schema entirely (and also display placeholders for new entries at the end of "groups")
	return (
		<div key={ namespace } className="flex flex-col w-full h-full ml-4">
			{
				Object.entries(schema).map(([ alias, type ]) => {
					let localNamespace = `${ namespace }${ alias }`;

					if(typeof type === "object") {
						return (
							<div key={ localNamespace } >
								<div className="flex flex-row w-full h-full">
									<div className="flex flex-col w-1/2 h-full">
										<input className="w-full h-full" type="text" placeholder="Alias" value={ alias } onChange={ e => onChange("alias", namespace, alias, e.target.value) } />
									</div>
									<div className="flex flex-col w-1/2 h-full">
										<input className="w-full h-full" type="text" placeholder="Type" value={ "group" } onChange={ e => onChange("type", namespace, alias, e.target.value) } />
									</div>
								</div>
								<Edit schema={ type } onChange={ onChange } namespace={ `${ localNamespace }` } />
							</div>
						);
					} else if(type === "group") {
						//TODO: Properly add an object to the @schema, and allow for the creation of children (i.e. editable placeholder)
						// Currently, it attempts to append a child to the string "group", instead of creating a nested object
						return null;
					} else {
						return (
							<div key={ localNamespace } className="flex flex-row w-full h-full">
								<div className="flex flex-col w-1/2 h-full">
									<input className="w-full h-full" type="text" placeholder="Alias" value={ alias } onChange={ e => onChange("alias", namespace, alias, e.target.value) } />
								</div>
								<div className="flex flex-col w-1/2 h-full">
									<input className="w-full h-full" type="text" placeholder="Type" value={ type } onChange={ e => onChange("type", namespace, alias, e.target.value) } />
								</div>
							</div>
						);
					}
				})
			}
		</div>
	);
};

export default Edit;