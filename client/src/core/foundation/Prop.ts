import PropType from "./PropType";

/**
 * 属性数据
 */
export default class Prop {
    type: PropType;
    value: number;

    constructor(type: PropType, value: number) {
        this.type = type;
        this.value = value;
    }

    get typeId(): string {
        return this.type.id;
    }

    set typeId(value: string) {
        this.type = PropType.getById(value);
    }

    get displayValue(): number {
        if (this.type.isPercent) {
            return this.value * 100;
        } else {
            return this.value;
        }
    }

    set displayValue(value: number) {
        if (this.type.isPercent) {
            this.value = value / 100;
        } else {
            this.value = value;
        }
    }

    toString(): string {
        return `${this.type}: ${this.value}`;
    }
}