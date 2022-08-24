import CoreEngine from '@/core/CoreEngine';
import PropPanel from '@/core/foundation/PropPanel';
import PropType from '@/core/foundation/PropType';

/**
 * 命座配置数据
 */
export default class TalentData {
    id: number;
    
    name: string;
    
    desc: string;
    
    /**
     * 增加属性
     */
    addProps: PropPanel;
    
    openConfig: string;
    
    params: number[];
    
    constructor(data: any) {
        this.id = data.talentId;
        this.name = CoreEngine.getText(data.nameTextMapHash);
        this.desc = CoreEngine.getText(data.descTextMapHash);
        
        this.addProps = new PropPanel();
        for (let item of data.addProps) {
            if (!item.propType) {
                continue;
            }
            let type = PropType.getByConfigName(item.propType);
            let value = data.value ?? 0;
            this.addProps.addProp(type.by(value));
        }
        
        this.openConfig = data.openConfig;
        this.params = data.paramList;
    }
}