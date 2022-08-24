import AffixSetData from '@/core/affix/AffixSetData';
import AffixData from '@/core/affix/AffixData';
import CoreEngine from '../CoreEngine';
import RelicSlotData from './RelicSlotData';
import RelicSlotType from './RelicSlotType';
import RelicInfo from './RelicInfo';

/**
 * 圣遗物套装配置数据
 */
export default class RelicSetData {
    id: number;

    name: string;

    /**
     * 套装效果需要的件数（比如2件套，4件套）
     */
    setNeedNum: number[];

    /**
     * 套装效果组
     * <br/>
     * 2件套->效果等级0，4件套->效果等级1
     */
    affixSet: AffixSetData;

    /**
     * 套装各槽位配置数据
     */
    slots: Map<RelicSlotType, RelicSlotData>;

    /**
     * 套装可能出现的星级
     */
    allRanks = new Array<number>();

    constructor(data: any, relicDict: Map<number, any>) {
        this.id = data.setId;
        this.affixSet = CoreEngine.affix.affixs.get(data.EquipAffixId)!;
        this.name = this.affixSet.levels.get(0)!.name;
        this.setNeedNum = data.setNeedNum;
        this.slots = new Map();
        for (let it of data.containsList) {
            let relic = relicDict.get(it);
            let mainDepotId = relic.mainPropDepotId;
            let slotType = RelicSlotType.getByMainDepotId(mainDepotId);
            if (!slotType) {
                continue;
            }
            let name = CoreEngine.getText(relic.nameTextMapHash);
            let desc = CoreEngine.getText(relic.descTextMapHash);
            this.slots.set(slotType, new RelicSlotData(this, slotType, name, desc));
        }
    }

    newInfo(slot: RelicSlotType, rank: number): RelicInfo {
        var data = this.slots.get(slot)!;
        return new RelicInfo(data, rank);
    }

    toString(): string {
        return this.name;
    }
}