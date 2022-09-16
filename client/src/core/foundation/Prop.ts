import PropType from "./PropType";

/**
 * 属性数据
 */
export default class Prop {
    typeId: string;
    value: number;

    constructor(type: PropType, value: number) {
        this.typeId = type.id;
        this.value = value;
    }

    get type(): PropType {
        return PropType.getById(this.typeId);
    }

    set type(type: PropType) {
        this.typeId = type.id;
    }

    get displayValue(): number {
        let value;
        if (this.type.isPercent) {
            value = this.value * 100;
        } else {
            value = this.value;
        }
        if (value % 1 != 0) {
            return parseFloat(value.toFixed(1));
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
        let type = this.type;
        return `${type}: ${this.displayValue}${type.isPercent ? "%" : ""}`;
    }

    get displayString(): string {
        return this.toString()
    }
}