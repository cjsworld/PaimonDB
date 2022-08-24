export default class DamageType {
    static A = new DamageType("普通攻击");
    static AZ = new DamageType("重击");
    static E = new DamageType("元素战技");
    static Q = new DamageType("元素爆发");

    desc: string;

    private constructor(desc: string) {
        this.desc = desc;
    }

    toString(): string {
        return this.desc;
    }
}