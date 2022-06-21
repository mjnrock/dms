import { v4 as uuid } from "uuid";

export enum EnumTagType {
	GENERIC = "generic",

	COMPOUND = "comp",
	LIST = "list",

	BOOLEAN = "bool",

	CHARACTER = "char",
	STRING = "string",
	UUID = "uuid",

	NUMBER = "number",
	UINT8 = "uint8",
	INT8 = "int8",
	UINT16 = "uint16",
	INT16 = "int16",
	UINT32 = "uint32",
	INT32 = "int32",
	UINT64 = "uint64",
	INT64 = "int64",
}

export interface ITag {
	getType(): EnumTagType;
	setType(type: EnumTagType): void;

	getName(): string;
	setName(name: string): void;

	getValue(): any;
	setValue(value: any): boolean;
}

export type TagGroup = ATag[] | Set<ATag>;
export type Validator = (...args: any) => boolean;

export class ATag implements ITag {
	public id: string = uuid();

	/**
	 * The discrete type of the Tag
	 */
	protected type: EnumTagType;

	/**
	 * The sub-type of the Tag (e.g. Int16)
	 */
	protected subType: EnumTagType | string | null = null;

	/**
	 * The unique name of the tag
	 */
	protected name: string;

	/**
	 * The actual value contained within the Tag
	 */
	protected value: any;

	constructor({
		type,
		subType = null,
		name,
		value,
	}: {
		type: EnumTagType;
		subType?: EnumTagType | string | null;
		name: string;
		value: any;
	}) {
		this.type = EnumTagType.GENERIC;
		this.subType = null;
		this.name = this.id.toString();
		this.value = null;

		this.setType(type);
		this.setSubType(subType);
		this.setName(name);
		this.setValue(value);
	}

	public isEmpty(): boolean {
		return this.value == null;
	}

	public getType(): EnumTagType {
		return this.type;
	}
	public setType(type: EnumTagType): void {
		this.type = type;
	}

	public getSubType(): EnumTagType | string | null {
		return this.subType;
	}
	public setSubType(subType: EnumTagType | string | null): void {
		this.subType = subType;
	}

	public getName(): string {
		return this.name;
	}
	public setName(name: string): void {
		this.name = name;
	}

	public getValue(): any {
		return this.value;
	}
	public setValue(value: any): boolean {
		this.value = value;

		return true;
	}
	public clearValue(): void {
		this.value = null;
	}

	public toObject(): object {
		return {
			type: this.type,
			name: this.name,
			value: this.value,
		};
	}
	public toString(): string {
		return JSON.stringify(this.toObject());
	}

	public copy(clone: boolean = false, empty: boolean = false): ATag {
		const tag = new (this.constructor as new () => this)();

		if(clone === true) {
			tag.id = this.id;
		}

		tag.setType(this.type);
		tag.setSubType(this.subType);
		tag.setName(this.name);

		if(empty !== true) {
			tag.setValue(this.value);
		}

		return tag;
	}
}

export default ATag;
