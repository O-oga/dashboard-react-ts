import { createPortal } from 'react-dom';
import './AddCardModal.css';
import { useTranslation } from 'react-i18next';
import { createContext, useEffect, useState } from 'react';
import { createEntitysStateList } from '../../../modules/loader';
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator';
import type { CardCreationData, EntityTypes } from '../../../types/card.types';
import { ENTITY_TYPES } from '../../../types/card.types';
import type { CardIconTypes, IconComponent } from '../../../types/Icons.types';
import EntityOfTab from './EntityOfTab/EntityOfTab';
import CardCreation from './CardCreation/CardCreation';
import type { CardSizeTypes } from '../../../types/card.types';


export const CardCreationDataContext = createContext<CardCreationData | null>(null);

function AddCardModal(props: any) {
    const { isModalOpen, closeModal } = props;
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [loadedEntitys, setLoadedEntitys] = useState<Record<string, string>>({});

    const [title, setTitle] = useState('');
    const [tabs, setTabs] = useState<EntityTypes[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<EntityTypes>();
    const [selectedTab, setSelectedTab] = useState<EntityTypes>();
    const [selectedIcon, setSelectedIcon] = useState<CardIconTypes>('SensorIcon');
    const [selectedSize, setSelectedSize] = useState<CardSizeTypes>('small');
    const [tabsEntitys, setTabsEntitys] = useState<Record<EntityTypes, string[]>>({} as Record<EntityTypes, string[]>);
    

    const getExistingTypes = (entitys: Record<string, string>) => {
        const allowedTypesSet = new Set(ENTITY_TYPES);
        return Object.keys(entitys)
            .map(key => {
                return key.split('.')[0];
            })
            .filter((type, index, self) => self.indexOf(type) === index)
            .filter((type) => allowedTypesSet.has(type as typeof ENTITY_TYPES[number])) //types from EntityTypes
            .sort();
    }

    const createTabsEntitys = (entitys: Record<string, string>) => {
        const entitysByTypes = {} as Record<EntityTypes, string[]>;
        const allowedTypesSet = new Set(ENTITY_TYPES);
        
        Object.keys(entitys).forEach((entity: string) => {
            const type = entity.split('.')[0];
            if (allowedTypesSet.has(type as typeof ENTITY_TYPES[number])) {
                const entityType = type as EntityTypes;
                if (!entitysByTypes[entityType]) {
                    entitysByTypes[entityType] = [];
                }
                entitysByTypes[entityType].push(entity);
            }
        });
        
        return entitysByTypes;
    }  

    useEffect(() => {
        const newTabs = getExistingTypes(loadedEntitys) as EntityTypes[];
        setTabs(newTabs);
        setTabsEntitys(createTabsEntitys(loadedEntitys));
        if (newTabs.length > 0) {
            setSelectedTab(newTabs[0]);
        }
    }, [loadedEntitys]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };
        if (isModalOpen) {
            document.addEventListener('keydown', handleEscape);
        }
    }, [isModalOpen, closeModal]);

    useEffect(() => {
        if (isModalOpen) {
            setIsLoading(true);
            createEntitysStateList()
                .then((data: any) => {
                    setLoadedEntitys(data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Failed to load entity state list:', error);
                    setIsLoading(false);
                });
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    if (!isModalOpen) return null;

    const modalContent = (
        <div className="add-card-modal-overlay" onClick={closeModal}>
            <div className="add-card-modal" onClick={(e) => e.stopPropagation()}>
                {isLoading && <LoadingIndicator />}
                {!isLoading && (
                    <CardCreationDataContext.Provider
                        value={{
                            entity: selectedEntity || '',
                            tab: selectedTab as EntityTypes,
                            icon: selectedIcon,
                            title: title,
                            size: selectedSize,
                            type: selectedTab as EntityTypes,
                            setSelectedIcon: (icon: IconComponent) => setSelectedIcon(icon as CardIconTypes),
                            setSize: (size: CardSizeTypes) => setSelectedSize(size as CardSizeTypes),
                        }}
                    >
                        <main className='add-card-content-container'>
                            <section className='left-container'>
                                <nav className='add-card-tabs' aria-label={t('addCard.entityTypeNavigation')}>
                                    {
                                        tabs.length > 0 && tabs.map((tab) => (
                                            <button key={tab} className='button-text tab-button' onClick={() => setSelectedTab(tab)}>{tab}</button>
                                        ))
                                    }
                                </nav>
                                <section className='entity-selection-window' aria-label={t('addCard.entitySelection')}>
                                    {
                                        selectedTab && tabsEntitys[selectedTab] && (
                                            <EntityOfTab 
                                                key={selectedTab} 
                                                entities={tabsEntitys[selectedTab] || []} 
                                                setSelectedEntity={setSelectedEntity} 
                                            />
                                        )
                                    }
                                </section>
                            </section>
                            <section className='right-container'>
                                <CardCreation />
                            </section>
                        </main>
                        <footer className='footer-container'>
                            <form className='add-card-form footer-container' onSubmit={(e) => { e.preventDefault(); }}>
                                <div className='add-card-input-container'>
                                    <input
                                        className='form-input'
                                        onChange={(e) => setTitle(e.target.value)}
                                        type="text"
                                        placeholder={t('addCard.cardNamePlaceholder')}
                                        aria-label={t('addCard.cardNamePlaceholder')}
                                    />
                                </div>
                                <div className='add-card-buttons-container'>
                                    <button type="submit" className='add-card-create-button button-text'>{t('addCard.create')}</button>
                                    <button type="button" className='add-card-cancel-button button-cancel' onClick={closeModal}>{t('addCard.cancel')}</button>
                                </div>
                            </form>
                        </footer>
                    </CardCreationDataContext.Provider>
                )}
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
}

export default AddCardModal;