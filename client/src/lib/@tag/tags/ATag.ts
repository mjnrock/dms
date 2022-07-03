import { v4 as uuid } from "uuid";

export enum EnumTagType {
	ANY = "any",

	COMPOUND = "comp",
	LIST = "list",

	BOOLEAN = "bool",

	CHARACTER = "char",
	STRING = "string",
	UUID = "uuid",

	NUMBER = "number",
	INT8 = "int8",
	INT16 = "int16",
	INT32 = "int32",
	INT64 = "int64",
	UINT8 = "uint8",
	UINT16 = "uint16",
	UINT32 = "uint32",
	UINT64 = "uint64",

	FLOAT32 = "float32",
	FLOAT64 = "float64",

	DATE = "date",
	TIME = "time",
	DATETIME = "datetime",

	//? TBD:
	// OBJECT = "object",
	// ARRAY = "array",
	// MAP = "map",
	// SET = "set",

	// FUNCTION = "function",
	// CLASS = "class",
	// ENUM = "enum",
};

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
	protected logicalType: EnumTagType | string | null = null;

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
		logicalType = null,
		name,
		value,
	}: {
		type: EnumTagType;
		logicalType?: EnumTagType | string | null;
		name: string;
		value: any;
	}) {
		this.type = EnumTagType.ANY;
		this.logicalType = null;
		this.name = this.id.toString();
		this.value = null;

		this.setType(type);
		this.setLogicalType(logicalType || type);
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

	public getLogicalType(): EnumTagType | string | null {
		return this.logicalType;
	}
	public setLogicalType(logicalType: EnumTagType | string | null): void {
		this.logicalType = logicalType;
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
			logicalType: this.logicalType,
			name: this.name,
			value: this.value,
		};
	}
	public toString(): string {
		return JSON.stringify(this.toObject());
	}

	/**
	 * Copy the Tag, creating a new instance.
	 * @empty will clear .value when true, and @clone will copy .id
	 */
	public copy(empty: boolean = false, clone: boolean = false): ATag {
		const tag = new (this.constructor as new () => this)();

		if(clone === true) {
			tag.id = this.id;
		}

		tag.setType(this.type);
		tag.setLogicalType(this.logicalType);
		tag.setName(this.name);

		if(empty !== true) {
			tag.setValue(this.value);
		}

		return tag;
	}
}

export default ATag;
