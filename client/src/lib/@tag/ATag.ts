import { v4 as uuid } from "uuid";
import * as ReflectHelper from "./util/ReflectHelper";

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
};

export interface ITag {
	getType(): EnumTagType;
	setType(type: EnumTagType): void;

	getName(): string;
	setName(name: string): void;

	getValue(): any;
	setValue(value: any): boolean;
};

export type TagGroup = ATag[] | Set<ATag>;
export type Validator = (...args: any) => boolean;

export class ATag implements ITag {
	protected type: EnumTagType;
	protected name: string;
	protected value: any;

	constructor({
		type,
		name,
		value,
	}: {
		type: EnumTagType;
		name: string;
		value: any;
	}) {
		ReflectHelper.defineProperty(this, "id", {
			enumerable: false,
			configurable: false,
			writable: false,
			value: uuid(),
		});

		this.type = EnumTagType.GENERIC;
		this.name = this.id.toString();
		this.value = null;

		this.setType(type);
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
}

export default ATag;
