import CoreEngine from '../CoreEngine';
import CoreEngineModule from '../CoreEngineModule';
import CurveData from './CurveData';
import PromoteData from './PromoteData';


export default class UpgradeModule implements CoreEngineModule {
    public curves: Map<number, CurveData> = new Map();
    public promotes: Map<number, PromoteData> = new Map();

    async init(): Promise<void> {
        await this.readCurves("Avatar");
        await this.readCurves("Weapon");
        await this.readPromotes("Avatar");
        await this.readPromotes("Weapon");
    }

    async readCurves(name: string): Promise<void> {
        let config = await CoreEngine.readJsonResource(`${name}CurveExcelConfigData`);
        for (let item of config) {
            let level = item.level;
            for (let info of item.curveInfos) {
                let type = info.type;
                let value = info.value ?? 0;
                let curve = this.curves.get(type);
                if (!curve) {
                    curve = new CurveData(type);
                    this.curves.set(type, curve);
                }
                curve.addLevel(level, value);
            }
        }
    }

    async readPromotes(name: string): Promise<void> {
        let config = await CoreEngine.readJsonResource(`${name}PromoteExcelConfigData`);
        for (let item of config) {
            let id = item[`${name.toLowerCase()}PromoteId`];
            let promote = this.promotes.get(id);
            if (!promote) {
                promote = new PromoteData(id);
                this.promotes.set(id, promote);
            }
            promote.addLevel(item);
        }
    }
}