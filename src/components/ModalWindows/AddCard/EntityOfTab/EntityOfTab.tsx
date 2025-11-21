import { useMemo } from 'react';
import './EntityOfTab.css';
import EntityGroup from '../EntityGroup/EntityGroup';

function EntityOfTab(props: any) {
    const { entities, setSelectedEntity } = props;

    const groupEntities = useMemo(() => {
        let groupedEntities: Record<string, { name: string, entities: string[] }> = {};
        
        // Check if entities is an array and not empty
        if (!Array.isArray(entities) || entities.length === 0) {
            return groupedEntities;
        }
        
        entities.forEach((entity: string) => {
            // Validate entity format and safely parse
            if (!entity || typeof entity !== 'string') {
                console.warn('Invalid entity format:', entity);
                return;
            }
            
            const parts = entity.split('.');
            if (parts.length < 2) {
                console.warn('Entity does not contain domain separator:', entity);
                return;
            }
            
            const entityName = parts[1];
            if (!entityName) {
                console.warn('Entity name is empty:', entity);
                return;
            }
            
            // Extract group name (part before first underscore, or full name if no underscore)
            const name = entityName.split('_')[0] || entityName;
            
            if (!groupedEntities[name]) {
                groupedEntities[name] = {
                    name: name,
                    entities: [entity]
                };
            } else {
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