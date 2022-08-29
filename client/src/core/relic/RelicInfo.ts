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
    subPropType1: string | undefined;
    subPropValue1: number = 0;

    subPropType2: string | undefined;
    subPropValue2: number = 0;

    subPropType3: string | undefined;
    subPropValue3: number = 0;

    subPropType4: string | undefined;
    subPropValue4: number = 0;


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
        this.mainPropTypeId = RelicSlotType.getByIndex(this.slotIndex).mainPropTypes[0].id;
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
        if (this.subPropType1) {
            panel.addProp(this.rankData.getSubProp(PropType.getById(this.subPropType1), this.subPropValue1));
        }
        if (this.subPropType2) {
            panel.addProp(this.rankData.getSubProp(PropType.getById(this.subPropType2), this.subPropValue2));
        }
        if (this.subPropType3) {
            panel.addProp(this.rankData.getSubProp(PropType.getById(this.subPropType3), this.subPropValue3));
        }
        if (this.subPropType4) {
            panel.addProp(this.rankData.getSubProp(PropType.getById(this.subPropType4), this.subPropValue4));
        }
        return panel;
    }

    setSubProp(index: number, type: PropType, value: number) {
        this[`subPropType${index}`] = type.id;
        this[`subPropValue${index}`] = value;
    }
}