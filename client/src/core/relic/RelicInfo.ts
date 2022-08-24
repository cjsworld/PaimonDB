import PropPanel from "@/core/foundation/PropPanel";
import PropType from "@/core/foundation/PropType";
import Prop from "@/core/foundation/Prop";
import CoreEngine from "../CoreEngine";
import RelicRankData from "./RelicRankData";
import RelicSlotData from "./RelicSlotData";

/**
 * 圣遗物信息
 */
export default class RelicInfo {
    /**
     * 圣遗物槽位配置数据
     */
    slot: RelicSlotData;

    /**
     * 星级配置数据
     */
    rankData: RelicRankData;

    /**
     * 主属性类型
     */
    mainPropType: PropType;

    /**
     * 强化等级
     */
    level: number;

    /**
     * 副词条属性
     */
    subProp: PropPanel;

    constructor(slot: RelicSlotData, rank: number) {
        this.slot = slot;
        this.rankData = CoreEngine.relic.ranks.get(rank)!;
        this.mainPropType = slot.type.mainPropTypes[0];
        this.level = 20;
        this.subProp = new PropPanel();
    }

    getRank(): number {
        return this.rankData.rank;
    }

    /**
     * 根据等级获取当前主属性数值
     */
    getMainProp(): Prop {
        return this.rankData.getMainProp(this.mainPropType, this.level);
    }

    /**
     * 增加一个副词条，实际数值会根据配置猜测原始精确值
     */
    addSubProp(type: PropType, value: number) {
        this.subProp.addProp(this.rankData.getSubProp(type, value))
    }

    // addSubProp(prop: Prop) {

    // }
}