import CoreEngine from "@/core/CoreEngine";
import CalcContext from "@/core/foundation/CalcContext";
import BuffOption from "@/core/foundation/BuffOption";
import WeaponData from "./WeaponData";

export default abstract class WeaponImpl {
    weaponId: number;
    weaponData: WeaponData;

    constructor(weaponId: number) {
        this.weaponId = weaponId;
        this.weaponData = CoreEngine.weapon.weapons.get(weaponId)!;
        this.weaponData.impl = this;
    }
    
    abstract getBuffOptions(): BuffOption[];
    
    abstract apply(ctx: CalcContext): void;
}