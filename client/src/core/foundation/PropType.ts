import Prop from './Prop';

/**
 * 属性类型
 */
export default class PropType {
    static Map = {};
    static get All(): PropType[] {
        return Object.values(PropType.Map);
    }

    static BaseHP = new PropType("BaseHP", "基础生命值", false, "FIGHT_PROP_BASE_HP");
    static PercentHP = new PropType("PercentHP", "生命值%", true, "FIGHT_PROP_HP_PERCENT");
    static HP = new PropType("HP", "生命值", false, "FIGHT_PROP_HP");

    static BaseATK = new PropType("BaseATK", "攻击力", false, "FIGHT_PROP_BASE_ATTACK");
    static PercentATK = new PropType("PercentATK", "攻击力%", true, "FIGHT_PROP_ATTACK_PERCENT");
    static ATK = new PropType("ATK", "攻击力", false, "FIGHT_PROP_ATTACK");

    static BaseDEF = new PropType("BaseDEF", "基础防御力", false, "FIGHT_PROP_BASE_DEFENSE");
    static PercentDEF = new PropType("PercentDEF", "防御力%", true, "FIGHT_PROP_DEFENSE_PERCENT");
    static DEF = new PropType("DEF", "防御力", false, "FIGHT_PROP_DEFENSE");

    static PercentSubDEF = new PropType("PercentSubDEF", "减少防御力", true, null);
    static IngoreDEF = new PropType("IngoreDEF", "无视防御力", true, null);

    static ElemMastery = new PropType("ElemMastery", "元素精通", false, "FIGHT_PROP_ELEMENT_MASTERY");

    static CritRate = new PropType("CritRate", "暴击率", true, "FIGHT_PROP_CRITICAL");
    static CritHurt = new PropType("CritHurt", "暴击伤害", true, "FIGHT_PROP_CRITICAL_HURT");

    static ChargeRate = new PropType("ChargeRate", "元素充能", true, "FIGHT_PROP_CHARGE_EFFICIENCY");

    static AddHurt = new PropType("AddHurt", "伤害加成", true, "FIGHT_PROP_ADD_HURT");
    static FireAddHurt = new PropType("FireAddHurt", "火元素伤害加成", true, "FIGHT_PROP_FIRE_ADD_HURT");
    static WaterAddHurt = new PropType("WaterAddHurt", "水元素伤害加成", true, "FIGHT_PROP_WATER_ADD_HURT");
    static WindAddHurt = new PropType("WindAddHurt", "风元素伤害加成", true, "FIGHT_PROP_WIND_ADD_HURT");
    static ElecAddHurt = new PropType("ElecAddHurt", "雷元素伤害加成", true, "FIGHT_PROP_ELEC_ADD_HURT");
    static GrassAddHurt = new PropType("GrassAddHurt", "草元素伤害加成", true, "FIGHT_PROP_GRASS_ADD_HURT");
    static IceAddHurt = new PropType("IceAddHurt", "冰元素伤害加成", true, "FIGHT_PROP_ICE_ADD_HURT");
    static RockAddHurt = new PropType("RockAddHurt", "岩元素伤害加成", true, "FIGHT_PROP_ROCK_ADD_HURT");
    static PhysicalAddHurt = new PropType("PhysicalAddHurt", "物理伤害加成", true, "FIGHT_PROP_PHYSICAL_ADD_HURT");


    static SubHurt = new PropType("SubHurt", "伤害减免", true, "FIGHT_PROP_SUB_HURT");
    static FireSubHurt = new PropType("FireSubHurt", "火元素抗性", true, "FIGHT_PROP_FIRE_SUB_HURT");
    static WaterSubHurt = new PropType("WaterSubHurt", "水元素抗性", true, "FIGHT_PROP_WATER_SUB_HURT");
    static WindSubHurt = new PropType("WindSubHurt", "风元素抗性", true, "FIGHT_PROP_WIND_SUB_HURT");
    static ElecSubHurt = new PropType("ElecSubHurt", "雷元素抗性", true, "FIGHT_PROP_ELEC_SUB_HURT");
    static GrassSubHurt = new PropType("GrassSubHurt", "草元素抗性", true, "FIGHT_PROP_GRASS_SUB_HURT");
    static IceSubHurt = new PropType("IceSubHurt", "冰元素抗性", true, "FIGHT_PROP_ICE_SUB_HURT");
    static RockSubHurt = new PropType("RockSubHurt", "岩元素抗性", true, "FIGHT_PROP_ROCK_SUB_HURT");
    static PhysicalSubHurt = new PropType("PhysicalSubHurt", "物理抗性", true, "FIGHT_PROP_PHYSICAL_SUB_HURT");

    static HealAdd = new PropType("HealAdd", "治疗加成", true, "FIGHT_PROP_HEAL_ADD");
    static HealedAdd = new PropType("HealedAdd", "受治疗加成", true, "FIGHT_PROP_HEALED_ADD");
    static ShieldUp = new PropType("ShieldUp", "护盾强效", true, "FIGHT_PROP_SHIELD_COST_MINUS_RATIO");

    static Unknown = new PropType("", "未知", false, null);


    id: string;
    name: string;
    isPercent: boolean;
    configName: string | null;

    static getById(id: string): PropType {
        let t = PropType.Map[id];
        if (t == null) {
            console.log(`Unknown prop type id: ${id}`);
            return PropType.Unknown;
        }
        return t;
    }

    static getByConfigName(configName: string): PropType {
        let t = PropType.All.find(e => e.configName == configName);
        if (t == null) {
            console.log(`Unknown prop type: ${configName}`);
            return PropType.Unknown;
        }
        return t;
    }

    private constructor(id: string, name: string, isPercent: boolean, configName: string | null) {
        PropType.Map[id] = this;
        this.id = id;
        this.name = name;
        this.isPercent = isPercent;
        this.configName = configName;
    }

    by(value: number): Prop {
        return new Prop(this, value);
    }

    toString(): string {
        return this.name;
    }
}