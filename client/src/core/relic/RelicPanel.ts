import PropPanel from "@/core/foundation/PropPanel";
import CalcContext from "@/core/foundation/CalcContext";
import AffixData from "@/core/affix/AffixData";
import RelicSlotType from "./RelicSlotType";
import RelicInfo from './RelicInfo';
import RelicSetData from "./RelicSetData";

/**
 * 圣遗物装备面板
 */
export default class RelicPanel {
    /**
     * 已装备的圣遗物
     */
    relics = new Map<RelicSlotType, RelicInfo>();

    /**
     * 装备圣遗物
     */
    putRelic(relic: RelicInfo) {
        this.relics.set(relic.slotData.type, relic);
    }

    /**
     * 获取当前已装备所有圣遗物的属性总和
     */
    getPanel(): PropPanel {
        let panel = new PropPanel();
        for (let relic of this.relics.values()) {
            panel.addProp(relic.mainProp);
            panel.addPanel(relic.getSubProps());
        }
        return panel;
    }

    /**
     * 获取当前的所有套装效果
     */
    getSetAffix(): AffixData[] {
        let list = new Array<AffixData>();
        let dict = new Map<RelicSetData, number>();
        for (let relic of this.relics.values()) {
            let set = relic.relicSetData;
            let c = dict.get(set) ?? 0;
            dict.set(set, ++c);
            for (let i = 0; i < set.setNeedNum.length; i++) {
                let num = set.setNeedNum[i]!;
                if (num == c) {
                    let data = set.affixSet.levels.get(i)!;
                    list.push(data);
                    break;
                } else if (num > c) {
                    break;
                }
            }
        }
        return list;
    }

    apply(ctx: CalcContext) {
        let list = this.getSetAffix();
        for (let affix of list) {
            ctx.minePanel.addPanel(affix.addProps);
        }
    }
}