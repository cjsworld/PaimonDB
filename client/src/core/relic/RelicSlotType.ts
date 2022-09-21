import PropType from '@/core/foundation/PropType';

/**
 * 圣遗物槽位类型
 */
export default class RelicSlotType {
    static All: RelicSlotType[] = [];

    static Flower = new RelicSlotType("Flower", "生之花", "花",0, 4000);
    static Leather = new RelicSlotType("Leather", "死之羽", "羽",1, 2000);
    static Sand = new RelicSlotType("Sand", "时之沙", "沙",2, 1000);
    static Cup = new RelicSlotType("Cup", "空之杯", "杯",3, 5000);
    static Cap = new RelicSlotType("Cap", "理之冠", "冠",4, 3000);

    static getByIndex(index: number): RelicSlotType {
        let t = RelicSlotType.All.find(e => e.index == index);
        if (t == null) {
            throw new Error(`Unknown relic index: ${index}`);
        }
        return t;
    }

    static getByMainDepotId(mainDepotId: number): RelicSlotType | undefined {
        return RelicSlotType.All.find(e => e.mainDepotId == mainDepotId);
    }

    id: string;
    name: string;
    shortName: string;

    /**
     * 序号
     */
    index: number;


    /**
     * 主属性词条集合id
     */
    mainDepotId: number;

    mainPropTypes = new Array<PropType>();

    get icon(): string {
        return `/relic/0_${this.index}.png`;
    }

    private constructor(id: string, name: string, shortName: string, index: number, mainDepotId: number) {
        RelicSlotType.All.push(this);
        this.id = id;
        this.name = name;
        this.shortName = shortName;
        this.index = index;
        this.mainDepotId = mainDepotId;
    }

    toString(): string {
        return this.name;
    }
}