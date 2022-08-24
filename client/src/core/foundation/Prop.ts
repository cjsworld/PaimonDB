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

    toString(): string {
        return `${this.type}: ${this.value}`;
    }
}