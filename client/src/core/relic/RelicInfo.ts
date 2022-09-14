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
    subProp1 = PropType.Unknown.by(0);
    subProp2 = PropType.Unknown.by(0);
    subProp3 = PropType.Unknown.by(0);
    subProp4 = PropType.Unknown.by(0);

    equippedAvatar?: number
    id?: number
    modifyTime?: number


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

    static fromServer(json: any): RelicInfo {
        let relic = new RelicInfo(json.setId, json.slotIndex, json.rank);
        relic.level = json.level;
        relic.mainPropTypeId = json.mainPropTypeId;
        relic.subProp1.typeId = json.subProp1TypeId;
        relic.subProp1.value = json.subProp1Value;
        relic.subProp2.typeId = json.subProp2TypeId;
        relic.subProp2.value = json.subProp2Value;
        relic.subProp3.typeId = json.subProp3TypeId;
        relic.subProp3.value = json.subProp3Value;
        relic.subProp4.typeId = json.subProp4TypeId;
        relic.subProp4.value = json.subProp4Value;
        relic.equippedAvatar = json.equippedAvatar;
        relic.id = json.id;
        relic.modifyTime = json.modifyTime;
        return relic;
    }

    toServer(): any {
        let json: any = {};
        json.setId = this.setId;
        json.rank = this.rank;
        json.slotIndex = this.slotIndex;
        json.level = this.level;
        json.mainPropTypeId = this.mainPropTypeId;
        json.subProp1TypeId = this.subProp1.typeId;
        json.subProp1Value = this.subProp1.value;
        json.subProp2TypeId = this.subProp2.typeId;
        json.subProp2Value = this.subProp2.value;
        json.subProp3TypeId = this.subProp3.typeId;
        json.subProp3Value = this.subProp3.value;
        json.subProp4TypeId = this.subProp4.typeId;
        json.subProp4Value = this.subProp4.value;
        if (this.equippedAvatar) {
            json.equippedAvatar = this.equippedAvatar;
        }
        return json;
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
        if (this.subProp1.type.isValid) {
            panel.addProp(this.rankData.getSubProp(this.subProp1.type, this.subProp1.value));
        }
        if (this.subProp2.type.isValid) {
            panel.addProp(this.rankData.getSubProp(this.subProp2.type, this.subProp2.value));
        }
        if (this.subProp3.type.isValid) {
            panel.addProp(this.rankData.getSubProp(this.subProp3.type, this.subProp3.value));
        }
        if (this.subProp4.type.isValid) {
            panel.addProp(this.rankData.getSubProp(this.subProp4.type, this.subProp4.value));
        }
        return panel;
    }

    setSubProp(index: number, type: PropType, value: number) {
        this[`subProp${index}`] = type.by(value);
    }
}