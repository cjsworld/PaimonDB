import CoreEngine from '@/core/CoreEngine';
import CoreEngineModule from '@/core/CoreEngineModule';
import PropType from '@/core/foundation/PropType';
import RelicRankData from '@/core/relic/RelicRankData';
import RelicSetData from '@/core/relic/RelicSetData';
import RelicSlotType from '@/core/relic/RelicSlotType';
import RelicInfo from "@/core/relic/RelicInfo";

export default class RelicModule implements CoreEngineModule {
    public ranks = new Map<number, RelicRankData>();
    public sets = new Map<number, RelicSetData>();

    public list = new Array<RelicInfo>()

    async init() {
        let config = await CoreEngine.readJsonResource("ReliquaryMainPropExcelConfigData");
        for (let item of config) {
            let depotId = item.propDepotId ?? 0;
            let slot = RelicSlotType.getByMainDepotId(depotId);
            if (!slot) {
                continue;
            }
            let propType = PropType.getByConfigName(item.propType);
            if (propType.id.indexOf("SubHurt") >= 0) {
                continue; //目前没有抗性主词条
            }
            if (slot.index >= 2) {
                //沙漏，杯子，头 出的攻击、防御、生命都是百分比
                if (propType == PropType.HP || propType == PropType.ATK || propType == PropType.DEF) {
                    continue;
                }
            }
            slot.mainPropTypes.push(propType);
        }

        config = await CoreEngine.readJsonResource("ReliquaryLevelExcelConfigData");
        for (let item of config) {
            let rank = item.rank ?? 0;
            if (rank < 4) {
                continue; //不考虑4星以下圣遗物
            }
            let rankData = this.ranks.get(rank);
            if (!rankData) {
                rankData = new RelicRankData(rank);
                this.ranks.set(rank, rankData);
            }
            rankData.addMainPropData(item);
        }

        config = await CoreEngine.readJsonResource("ReliquaryAffixExcelConfigData");
        for (let item of config) {
            let depotId = item.depotId ?? 0;
            if (depotId != 501 && depotId != 401) {
                continue; //不考虑4星以下圣遗物
            }
            let rank = Math.round(depotId / 100);
            let rankData = this.ranks.get(rank);
            if (!rankData) {
                rankData = new RelicRankData(rank);
                this.ranks.set(rank, rankData);
            }
            rankData.addSubPropData(item);
        }

        let dict = new Map<number, any>();
        config = await CoreEngine.readJsonResource("ReliquaryExcelConfigData");
        for (let item of config) {
            dict.set(item.id, item);
        }

        config = await CoreEngine.readJsonResource("ReliquarySetExcelConfigData");
        let skipId = [10010, 10011, 10013, 15004, 15012];
        for (let item of config) {
            if (!item.EquipAffixId) {
                continue;
            }
            if (skipId.indexOf(item.setId) >= 0) {
                continue; //过滤掉一些可能没实装的套装，以及低于4星的套装
            }
            let set = new RelicSetData(item, dict);
            this.sets.set(set.id, set);
        }

        config = await CoreEngine.readJsonResource("ReliquaryCodexExcelConfigData");
        for (let item of config) {
            let set = this.sets.get(item.suitId);
            if (set) {
                set.allRanks.push(item.level);
            }
        }
    }

    async onUserChange(uid: number) {
        let key = `user.${uid}.relic.list`;
        let cache = localStorage.getItem(key);
        let list;
        if (cache) {
            list = JSON.parse(cache);
        } else {
            list = [];
        }
        this.list = list.map((it) => RelicInfo.fromServer(it));
        let lastModify = 0;
        for (let relic of this.list) {
            if (relic.modifyTime && lastModify < relic.modifyTime) {
                lastModify = relic.modifyTime;
            }
        }

        list = await CoreEngine.reqApi("relic/getList", {lastModify: lastModify});
        if (!(list instanceof Array)) return;
        if (list.length == 0) {
            return;
        }
        this.list = list.map((it) => RelicInfo.fromServer(it));
        localStorage.setItem(key, JSON.stringify(list));
    }

    getRelicOptions(): RelicSetData[] {
        let list = new Array<RelicSetData>();
        for (let it of this.sets.values()) {
            list.push(it);
        }
        return list;
    }
}