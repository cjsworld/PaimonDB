import PropPanel from '@/core/foundation/PropPanel';
import PropType from '@/core/foundation/PropType';
import CurveData from '@/core/upgrade/CurveData';
import PromoteData from '@/core/upgrade/PromoteData';
import AffixSetData from '@/core/affix/AffixSetData';
import WeaponType from './WeaponType';
import WeaponInfo from './WeaponInfo';
import WeaponImpl from './WeaponImpl';
import CoreEngine from '../CoreEngine';


export default class WeaponData {
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
     * 效果
     */
    affix: AffixSetData | undefined;

    /**
     * 武器实现
     */
    impl: WeaponImpl | undefined;

    constructor(data: any) {
        this.id = data.id;
        let icon = data.icon.replace("UI_EquipIcon_", "").toLowerCase();
        this.icon = `weapon/${icon}.png`;
        this.name = CoreEngine.getText(data.nameTextMapHash);
        this.weaponType = WeaponType.getByConfigName(data.weaponType);
        this.rank = data.rankLevel;

        this.baseProp = new PropPanel();
        this.curves = new Map();
        for (let item of data.weaponProp) {
            let propTypeStr = item.propType;
            if (!propTypeStr) {
                continue;
            }
            let propType = PropType.getByConfigName(propTypeStr);
            let value = item.initValue ?? 0;
            this.baseProp.addProp(propType.by(value));
            let curveType = item.type;
            this.curves.set(propType, CoreEngine.upgrade.curves.get(curveType)!);
        }

        this.promote = CoreEngine.upgrade.promotes.get(data.weaponPromoteId)!;
        let affixId: number | null = null;
        for (let id of data.skillAffix) {
            if (!id) {
                continue;
            }
            if (affixId) {
                throw new Error(`Weapon ${this.id} ${this.name} has more than one affix!`);
            } else {
                affixId = id;
            }
        }
        if (affixId) {
            this.affix = CoreEngine.affix.affixs.get(affixId)!;
        }
    }

    newInfo(): WeaponInfo {
        return new WeaponInfo(this.id);
    }

    getBasePanelAt(level: number, promoted: boolean) {
        let panel = this.baseProp.copy();
        for (let entry of this.curves.entries()) {
            panel.mulProp(entry[0].by(entry[1].getValue(level)));
        }
        panel.addPanel(this.promote.getAddPropAt(level, promoted));
        return panel;
    }

    toString(): string {
        return this.name;
    }
}