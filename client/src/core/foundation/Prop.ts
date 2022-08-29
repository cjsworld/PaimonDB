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
        let value;
        if (this.type.isPercent) {
            value = this.value * 100;
        } else {
            value = this.value;
        }
        if (value % 1 != 0) {
            return value.toFixed(1);
        } else {
            return value;
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