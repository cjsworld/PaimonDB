import AvatarInfo from "@/core/avatar/AvatarInfo"
import SkillOption from "@/core/foundation/SkillOption";
import MonsterInfo from "@/core/monster/MonsterInfo";
import PropPanel from "./PropPanel"
import PropType from "./PropType"
import DamageType from './DamageType';

export default class CalcContext {
    avatar!: AvatarInfo;

    monster!: MonsterInfo;

    skillOption!: SkillOption;


    minePanel!: PropPanel;

    targetPanel!: PropPanel;

    skillRate!: number;

    reactionRate!: number;


    calcDamage(): number {
        this.minePanel = this.avatar.getTotalPanel();
        //Trace.WriteLine(MinePanel);

        this.targetPanel = this.monster.props.copy();

        this.skillOption.prepare(this); //技能初始化
        this.avatar.relic.apply(this); //圣遗物效果
        if (this.avatar.weapon && this.avatar.weapon!.data.impl) {
            this.avatar.weapon!.data.impl!.apply(this); //武器效果
        }
        this.skillOption.apply(this); //技能效果

        //基础乘区（攻击力）
        var damage = this.minePanel.totalATK();

        //倍率区
        damage *= this.skillRate;

        //增伤区
        var addHurt = this.minePanel.get(PropType.AddHurt);
        addHurt += this.minePanel.get(this.skillOption.skillElemType.addHurtType);
        damage *= 1 + addHurt;

        //暴击乘区
        damage *= 1 + this.minePanel.get(PropType.CritHurt);

        //反应区
        if (this.reactionRate > 0) {
            var elemMastery = this.minePanel.get(PropType.ElemMastery);
            var r = 2.78 * elemMastery / (elemMastery + 1400);
            damage *= this.reactionRate * (1 + r);
        }

        //防御区
        let mineDEF = 500 * (1 + 0.01 * this.avatar.level); // 90 -> 1.899999976158142;
        let targetDEF = 500 * (1 + 0.01 * this.monster.level); // 88 -> 1.8799999952316284;
        damage *= mineDEF / (mineDEF + (1 - this.minePanel.get(PropType.IngoreDEF)) * (1 - this.targetPanel.get(PropType.PercentSubDEF)) * targetDEF);

        //抗性区
        var subHurt = this.targetPanel.get(this.skillOption.skillElemType.subHurtType);
        if (subHurt < 0) {
            damage *= 1 - subHurt / 2;
        } else if (subHurt <= 0.75) {
            damage *= 1 - subHurt;
        } else {
            damage *= 1 / (1 + 4 * subHurt);
        }

        return damage;
    }
}