import PropPanel from "@/core/foundation/PropPanel";
import PropType from "@/core/foundation/PropType";
import Prop from "@/core/foundation/Prop";
import CoreEngine from "../CoreEngine";
import RelicRankData from "./RelicRankData";
import RelicSlotData from "./RelicSlotData";
import RelicSlotType from "@/core/relic/RelicSlotType";
import RelicSetData from "@/core/relic/RelicSetData";

/**
 * 圣遗物信息
 */
export default class RelicInfo {
    /**
     * 套装id
     */
    setId: number;

    /**
     * 槽位
     */
    slotIndex: number;

    /**
     * 星级
     */
    rank: number;

    /**
     * 强化等级
     */
    level: number;

    /**
     * 主属性类型
     */
    mainPropType: PropType;

    /**
     * 副词条属性
     */
    subProp1 = new Prop(PropType.Unknown, 0);
    subProp2 = new Prop(PropType.Unknown, 0);
    subProp3 = new Prop(PropType.Unknown, 0);
    subProp4 = new Prop(PropType.Unknown, 0);


    /**
     * 圣遗物槽位配置数据
     */
    get setData(): RelicSetData {
        return CoreEngine.relic.sets.get(this.setId)!!;
    }

    /**
     * 圣遗物槽位配置数据
     */
    get slotData(): RelicSlotData {
        return this.setData.slots[this.slotIndex]!!;
    }


    /**
     * 星级配置数据
     */
    get rankData(): RelicRankData {
        return CoreEngine.relic.ranks.get(this.rank)!!;
    }

    /**
     * 图标
     */
    get icon(): string {
        return this.slotData.icon;
    }


    constructor(setId: number, slotIndex: number, rank: number) {
        this.setId = setId;
        this.slotIndex = slotIndex;
        this.rank = rank;
        this.mainPropType = RelicSlotType.getByIndex(this.slotIndex).mainPropTypes[0];
        this.level = 20;
    }

    /**
     * 根据等级获取当前主属性数值
     */
    getMainProp(): Prop {
        return this.rankData.getMainProp(this.mainPropType, this.level);
    }

    /**
     * 根据副属性词条数值，推测准确值
     */
    getSubProps(): PropPanel {
        let panel = new PropPanel();
        if (this.subProp1.type != PropType.Unknown) {
            panel.addProp(this.rankData.getSubProp(this.subProp1.type, this.subProp1.value));
        }
        if (this.subProp2.type != PropType.Unknown) {
            panel.addProp(this.rankData.getSubProp(this.subProp2.type, this.subProp2.value));
        }
        if (this.subProp3.type != PropType.Unknown) {
            panel.addProp(this.rankData.getSubProp(this.subProp3.type, this.subProp3.value));
        }
        if (this.subProp4.type != PropType.Unknown) {
            panel.addProp(this.rankData.getSubProp(this.subProp4.type, this.subProp4.value));
        }
        return panel;
    }
}