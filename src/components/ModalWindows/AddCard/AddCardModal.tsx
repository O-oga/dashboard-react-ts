import { createPortal } from 'react-dom';
import './AddCardModal.css';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { createEntitysStateList } from '../../../modules/loader';
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator';
import type { EntityTypes } from '../../../types/space.types';
import { ENTITY_TYPES } from '../../../types/space.types';
import Sensor from '../../SpaceCards/Devices/Sensor/Sensor';
import type { CardIconTypes } from '../../../types/Icons.types';
import { getIconButtons } from '../../Icons';
import EntityOfTab from './EntityOfTab/EntityOfTab';
import CardCreation from './CardCreation/CardCreation';

function AddCardModal(props: any) {
    const { isModalOpen, closeModal } = props;
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [loadedEntitys, setLoadedEntitys] = useState<Record<string, string>>({});
    const [tabs, setTabs] = useState<EntityTypes[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<EntityTypes>();
    const [selectedTab, setSelectedTab] = useState<EntityTypes>();
    const [selectedIcon, setSelectedIcon] = useState<CardIconTypes>('SensorIcon');
    
    const [tabsEntitys, setTabsEntitys] = useState<Record<EntityTypes, string[]>>({} as Record<EntityTypes, string[]>);
    

    const getExistingTypes = (entitys: Record<string, string>) => {
        const allowedTypesSet = new Set(ENTITY_TYPES);
        return Object.keys(entitys)
            .map(key => {
                const dotIndex = key.indexOf('.');
                return dotIndex !== -1 ? key.substring(0, dotIndex) : key;
            })
            .filter((type, index, self) => self.indexOf(type) === index)
            .filter((type) => allowedTypesSet.has(type as typeof ENTITY_TYPES[number])) // Only allowed types from Entity type
            .sort();
    }

    const createTabsEntitys = (entitys: Record<string, string>) => {
        const entitysByTypes = {} as Record<EntityTypes, string[]>;
        tabs.map((tab: EntityTypes) => {
            entitysByTypes[tab] = [];
        });
        Object.keys(entitys).map((entity: string) => {
            const type = entity.split('.')[0];
            if (entitysByTypes[type as EntityTypes]) {
                entitysByTypes[type as EntityTypes].push(entity);
            }
        });
        return entitysByTypes;
    }

    


    useEffect(() => {
        setTabs(getExistingTypes(loadedEntitys) as EntityTypes[]);
        setTabsEntitys(createTabsEntitys(loadedEntitys));
        setSelectedTab(tabs[0]);
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
                    <>
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
                                        selectedTab && <EntityOfTab key={selectedTab} entities={tabsEntitys[selectedTab]} />
                                    }
                                </section>
                            </section>
                            <section className='right-container'>
                               <CardCreation 
                               entity={selectedEntity} 
                               selectedTab={selectedTab} 
                               selectedIcon={selectedIcon}
                               setSelectedIcon={setSelectedIcon}/>
                            </section>
                        </main>
                        <footer className='footer-container'>
                            <form className='add-card-form footer-container' onSubmit={(e) => { e.preventDefault(); }}>
                                <div className='add-card-input-container'>
                                    <input
                                        className='form-input'
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
                    </>
                )}
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
}

export default AddCardModal;