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
    mainPropTypeId: string;

    /**
     * 副词条属性
     */
    subPropType1: string | undefined;
    subPropValue1: number | undefined;

    subPropType2: string | undefined;
    subPropValue2: number | undefined;

    subPropType3: string | undefined;
    subPropValue3: number | undefined;

    subPropType4: string | undefined;
    subPropValue4: number | undefined;


    /**
     * 主属性类型
     */
    get mainPropType(): PropType {
        return PropType.getById(this.mainPropTypeId);
    }

    set mainPropType(value: PropType) {
        this.mainPropTypeId = value.id;
    }


    /**
     * 副词条属性
     */
    subProp: PropPanel;


    /**
     * 圣遗物槽位配置数据
     */
    get set(): RelicSetData {
        return CoreEngine.relic.sets.get(this.setId)!!;
    }

    /**
     * 圣遗物槽位配置数据
     */
    get slot(): RelicSlotData {
        return this.set.slots[this.slotIndex]!!;
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
        return this.slot.icon;
    }


    constructor(setId: number, slotIndex: number, rank: number) {
        this.setId = setId;
        this.slotIndex = slotIndex;
        this.rank = rank;
        this.mainPropTypeId = RelicSlotType.getByIndex(this.slotIndex).mainPropTypes[0].id;
        this.level = 20;
        this.subProp = new PropPanel();
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