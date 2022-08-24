import CoreEngine from '../CoreEngine';
import CoreEngineModule from '../CoreEngineModule';
import WeaponData from './WeaponData';
import WeaponType from './WeaponType';

export default class WeaponModule implements CoreEngineModule {
    public weapons: Map<number, WeaponData> = new Map();

    async init(): Promise<void> {
        let config = await CoreEngine.readJsonResource("WeaponExcelConfigData");
        let skipId = [15306, 14306, 13304, 12304];
        for (let item of config) {
            if (item.rankLevel < 3) {
                continue; //不考虑3星以下武器
            }
            if (!item.awakenCosts || item.awakenCosts.length == 0) {
                continue; //过滤掉一些可能没实装的武器
            }
            if (skipId.indexOf(item.id) >= 0) {
                continue; //过滤掉一些可能没实装的武器
            }
            let weapon = new WeaponData(item);
            
            this.weapons.set(weapon.id, weapon);
        }
        
        require("./impl/WeaponBowAmos");
    }
    
    getWeaponOptions(type: WeaponType): any[] {
        let list = new Array<WeaponData>();
        for (let it of this.weapons.values()) {
            if (it.weaponType == type) {
                list.push(it);
            }
        }
        list.sort((a, b) => {
            if (a.rank != b.rank) {
                //星级倒序
                return b.rank - a.rank;
            } else {
                //id正序
                return a.id - b.id;
            }
        })
        return list;
    }
}