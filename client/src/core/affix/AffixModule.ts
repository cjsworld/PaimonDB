import CoreEngine from '../CoreEngine';
import CoreEngineModule from '../CoreEngineModule';
import AffixSetData from './AffixSetData';

export default class AffixModule implements CoreEngineModule {
    public affixs: Map<number, AffixSetData> = new Map();

    async init(): Promise<void> {
        let config = await CoreEngine.readJsonResource("EquipAffixExcelConfigData");
        for (let item of config) {
            let id = item.id!;
            let set = this.affixs.get(id);
            if (!set) {
                set = new AffixSetData(id);
                this.affixs.set(id, set);
            }
            set.addAffix(item);
        }
    }
}