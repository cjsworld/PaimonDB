export default class SkillType {
    static All: SkillType[] = [];

    static A = new SkillType("A", "普通攻击", 0, 0,);
    static E = new SkillType("E", "元素战技", 1, 1,);
    static Q = new SkillType("Q", "元素爆发", 2, 5);
    static Shift = new SkillType("Shift", "冲刺", -1, 2);

    static getByTriggerID(triggerID: number): SkillType {
        var t = SkillType.All.find(e => e.triggerID == triggerID);
        if (t == null) {
            throw new Error(`Unknown skill trigger id: ${triggerID}`);
        }
        return t;
    }

    id: string;
    name: string;
    index: number;
    triggerID: number;

    private constructor(id: string, name: string, index: number, triggerID: number) {
        SkillType.All.push(this);
        this.id = id;
        this.name = name;
        this.index = index;
        this.triggerID = triggerID;
    }

    toString(): string {
        return this.name;
    }
}