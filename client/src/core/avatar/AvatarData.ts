import CoreEngine from '@/core/CoreEngine';
import PropPanel from '@/core/foundation/PropPanel';
import PropType from '@/core/foundation/PropType';
import ElemType from '@/core/foundation/ElemType';
import CurveData from '@/core/upgrade/CurveData';
import PromoteData from '@/core/upgrade/PromoteData';
import WeaponType from '@/core/weapon/WeaponType';
import SkillDepotData from '@/core/skill/SkillDepotData';
import AvatarImpl from './AvatarImpl';
import AvatarInfo from './AvatarInfo';


export default class AvatarData {
    id: number;

    icon: string;

    name: string;

    /**
     * 武器类型
     */
    weaponType: WeaponType;

    /**
     * 星级
     */
    rank: number;

    /**
     * 元素类型
     */
    elemType: ElemType;

    /**
     * 基础属性
     */
    baseProp: PropPanel;

    /**
     * 升级曲线
     */
    curves: Map<PropType, CurveData>;

    /**
     * 突破配置
     */
    promote: PromoteData;

    /**
     * 技能配置
     */
    skillDepot: SkillDepotData;

    /**
     * 武器实现
     */
    impl: AvatarImpl | undefined;

    constructor(data: any) {
        this.id = data.id;
        let icon = data.iconName.replace("UI_AvatarIcon_", "").toLowerCase()
        this.icon = `avatar/${icon}.png`;
        this.name = CoreEngine.getText(data.nameTextMapHash);
        this.weaponType = WeaponType.getByConfigName(data.weaponType);
        let quality = data.qualityType;
        if (quality == "QUALITY_PURPLE") {
            this.rank = 4;
        } else if (quality == "QUALITY_ORANGE" || quality == "QUALITY_ORANGE_SP") {
            this.rank = 5;
        } else {
            console.log(`Unknown avatar quality ${quality}`);
            this.rank = 0;
        }

        this.baseProp = new PropPanel(
            PropType.BaseHP.by(data.hpBase ?? 0),
            PropType.BaseATK.by(data.attackBase ?? 0),
            PropType.BaseDEF.by(data.defenseBase ?? 0),
            PropType.ChargeRate.by(data.chargeEfficiency ?? 0),
            PropType.CritRate.by(data.critical ?? 0),
            PropType.CritHurt.by(data.criticalHurt ?? 0),
        );

        this.curves = new Map();
        for (let item of data.propGrowCurves) {
            let propType = PropType.getByConfigName(item.type);
            let curveType = item.growCurve;
            this.curves.set(propType, CoreEngine.upgrade.curves.get(curveType)!);
        }

        this.promote = CoreEngine.upgrade.promotes.get(data.avatarPromoteId)!;
        this.elemType = ElemType.getByMatID(this.promote.avatarMatId);
        this.skillDepot = CoreEngine.skill.skillDepots.get(data.skillDepotId)!;
    }

    newInfo(): AvatarInfo {
        return new AvatarInfo(this.id);
    }

    getBasePanelAt(level: number, promoted: boolean) {
        let panel = this.baseProp.copy();
        for (let entry of this.curves.entries()) {
            let propType = entry[0];
            let curve = entry[1];
            panel.mulProp(propType.by(curve.getValue(level)));
        }
        panel.addPanel(this.promote.getAddPropAt(level, promoted));
        return panel;
    }

    toString(): string {
        return this.name;
    }
}