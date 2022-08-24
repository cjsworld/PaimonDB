import RelicSetData from './RelicSetData';
import RelicSlotType from './RelicSlotType';

export default class RelicSlotData {
    set: RelicSetData;

    type: RelicSlotType;

    name: string;

    desc: string;

    constructor(set: RelicSetData, type: RelicSlotType, name: string, desc: string) {
        this.set = set;
        this.type = type;
        this.name = name;
        this.desc = desc;
    }

    toString(): string {
        return this.name;
    }
}