export enum EnumTagType {
	GENERIC = 'generic',
	COMPOUND = 'comp',
	BOOLEAN = 'bool',
	CHARACTER = 'char',
	STRING = 'string',
};

export interface ITag {
	type: EnumTagType,
	name: string,
	value: any,
};

export type TagGroup = ATag[] | Set<ATag>;

export class ATag implements ITag {
	type: EnumTagType;
	name: string;
	value: any;

	constructor({ type, name, value }: ITag) {
		this.type = type;
		this.name = name;
		this.value = value;
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
	public setValue(value: any): void {
		this.value = value;
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
};

export default ATag;