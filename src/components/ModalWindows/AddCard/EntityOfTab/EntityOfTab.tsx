import { useMemo } from 'react';
import './EntityOfTab.css';
import EntityGroup from '../EntityGroup/EntityGroup';

function EntityOfTab(props: any) {
    const { entities, setSelectedEntity } = props;

    const groupEntities = useMemo(() => {
        let groupedEntities: Record<string, { name: string, entities: string[] }> = {};
        entities.map((entity: string) => {
            const name: string = entity.split('.')[1].split('_')[0];
            if (!groupedEntities[name]) {
                groupedEntities[name] = {
                    name: name,
                    entities: [entity]
                }
            } else{
                groupedEntities[name].entities.push(entity);
            }
            
        });
        console.log(groupedEntities);
        return groupedEntities;
    }, [entities]);

    return (
        <div className="entity-of-tab">
            {Object.entries(groupEntities).map(([name, groupData]) => {
                return (
                    <EntityGroup key={name} 
                    groupName={name} entities={groupData.entities}
                    setSelectedEntity={setSelectedEntity} />
                );
            })}
        </div>
    );
}

export default EntityOfTab;