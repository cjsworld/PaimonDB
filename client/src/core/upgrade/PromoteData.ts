import PropPanel from '@/core/foundation/PropPanel';
import PromoteLevelData from './PromoteLevelData';

/**
 * 突破配置数据
 */
export default class PromoteData {
    /**
     * 突破配置id
     */
    id: number;

    /**
     * 人物突破材料id
     */
    avatarMatId: number | undefined;

    /**
     * 突破等级数据
     */
    levels: Array<PromoteLevelData> = [];

    constructor(id: number) {
        this.id = id;
    }

    addLevel(data: any) {
        let level = new PromoteLevelData(data);
        this.levels.push(level);
        if (data.avatarPromoteId && level.level == 1) {
            this.avatarMatId = data.costItems[0].id;
        }
    }

    getAddPropAt(level: number, promoted: boolean): PropPanel {
        for (let i = 0; i < this.levels.length; i++) {
            let data = this.levels[i];
            if (level < data.unlockMaxLevel) {
                return data.addProps;
            } else if (level == data.unlockMaxLevel && (i == this.levels.length - 1 || !promoted)) {
                return data.addProps;
            }
        }
        throw new Error("PromotedLevel error!");
    }
}