import CalcContext from "@/core/foundation/CalcContext";
import DamageType from "@/core/foundation/DamageType";
import ElemType from "@/core/foundation/ElemType";
import SkillOption from "@/core/foundation/SkillOption";
import SkillType from "@/core/skill/SkillType";
import AvatarImpl from "../AvatarImpl";

export default new class AvatarGanyu extends AvatarImpl {
    constructor() {
        super(10000037)
    }

    getSkillOptions(): SkillOption[] {
        return [
            new GanyuSkillAZ_2(),
            new GanyuSkillAZ_AOE()
        ]
    }
}

class GanyuSkillAZ_2 extends SkillOption {
    id = 0;
    desc = "重击-蓄力第二段";
    skillElemType = ElemType.Ice;
    damageType = DamageType.AZ;

    prepare(ctx: CalcContext) {
    }

    apply(ctx: CalcContext) {
        ctx.skillRate = ctx.avatar.getSkillProudData(SkillType.A).params[8];
    }
}

class GanyuSkillAZ_AOE extends SkillOption {
    id = 1;
    desc = "重击-蓄力范围伤害";
    skillElemType = ElemType.Ice;
    damageType = DamageType.AZ;

    prepare(ctx: CalcContext) {
    }

    apply(ctx: CalcContext) {
        ctx.skillRate = ctx.avatar.getSkillProudData(SkillType.A).params[9];
    }
}