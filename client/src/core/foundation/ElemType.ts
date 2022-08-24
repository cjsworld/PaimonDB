import PropType from './PropType';

export default class ElemType {
    static All: ElemType[] = [];

    static Fire = new ElemType("Fire", "火", 0, 104111, PropType.FireAddHurt, PropType.FireSubHurt);
    static Water = new ElemType("Water", "水", 1, 104121, PropType.WaterAddHurt, PropType.WaterSubHurt);
    static Wind = new ElemType("Wind", "风", 2, 104151, PropType.WindAddHurt, PropType.WindSubHurt);
    static Elec = new ElemType("Elec", "雷", 3, 104141, PropType.ElecAddHurt, PropType.ElecSubHurt);
    static Grass = new ElemType("Grass", "草", 4, 104131/*推测*/, PropType.GrassAddHurt, PropType.GrassSubHurt);
    static Ice = new ElemType("Ice", "冰", 5, 104161, PropType.IceAddHurt, PropType.IceSubHurt);
    static Rock = new ElemType("Rock", "岩", 6, 104171, PropType.RockAddHurt, PropType.RockSubHurt);
    static Physical = new ElemType("Physical", "物理", 7, null, PropType.PhysicalAddHurt, PropType.PhysicalSubHurt);


    static getByMatID(matID: number | undefined): ElemType {
        if (!matID) {
            return ElemType.Physical;
        }
        var t = ElemType.All.find(e => e.matId == matID);
        if (t == null) {
            return ElemType.Physical;
        }
        return t;
    }

    id: string;
    name: string;
    index: number;
    matId: number | null;


    addHurtType: PropType;
    subHurtType: PropType;

    private constructor(id: string, name: string, index: number, matId: number | null, addHurtType: PropType, subHurtType: PropType) {
        ElemType.All.push(this);
        this.id = id;
        this.name = name;
        this.index = index;
        this.matId = matId;
        this.addHurtType = addHurtType;
        this.subHurtType = subHurtType;
    }

    toString(): string {
        return this.name;
    }
}