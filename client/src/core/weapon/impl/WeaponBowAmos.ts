import CalcContext from "@/core/foundation/CalcContext";
import DamageType from "@/core/foundation/DamageType";
import PropType from "@/core/foundation/PropType";
import BuffOption from "@/core/foundation/BuffOption";
import AffixData from "@/core/affix/AffixData";
import WeaponImpl from "../WeaponImpl";
import WeaponData from "../WeaponData";

export default new class WeaponBowAmos extends WeaponImpl {
    constructor() {
        super(15502);
    }
    
    getBuffOptions(): BuffOption[] {
        return [
            new WeaponBowAmosBuff(this.weaponData, 1),
            new WeaponBowAmosBuff(this.weaponData, 2),
            new WeaponBowAmosBuff(this.weaponData, 3),
            new WeaponBowAmosBuff(this.weaponData, 4),
            new WeaponBowAmosBuff(this.weaponData, 5),
        ];
    }

    apply(ctx: CalcContext) {
        let affix = ctx.avatar.weapon!.getAffix()!;
        if (ctx.skillOption.damageType == DamageType.A || ctx.skillOption.damageType == DamageType.AZ) {
            ctx.minePanel.addProp(PropType.AddHurt.by(affix.params[0])); //普通攻击和重击造成的伤害提升{0}%
            ctx.minePanel.addProp(PropType.AddHurt.by(affix.params[1] * 5)); //TODO 箭矢发射后每经过0.1秒，伤害还会提升{1}%。至多提升5次
        }
    }
}

class WeaponBowAmosBuff extends BuffOption {
    weapon: WeaponData;
    
    level: number;
    
    name: string;
    
    affix: AffixData
    
    constructor(weapon: WeaponData, level: number) {
        super();
        this.weapon = weapon;
        this.level = level;
        this.affix = weapon.affix!.levels.get(level - 1)!;
        this.name = `箭矢发射后经过${0.1 * level}秒，伤害提升 ${Math.round(this.affix.params[1] * 100)}%`;
    }
}