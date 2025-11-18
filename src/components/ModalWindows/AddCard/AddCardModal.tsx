import { createPortal } from 'react-dom';
import './AddCardModal.css';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { createEntitysStateList } from '../../../modules/loader';
import LoadingIndicator from '../../LoadingIndicator/LoadingIndicator';
import type { EntityTypes } from '../../../types/space.types';
import { ENTITY_TYPES } from '../../../types/space.types';
import Sensor from '../../SpaceCards/Devices/Sensor/Sensor';

function AddCardModal(props: any) {
    const { isModalOpen, closeModal } = props;
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [loadedEntitys, setLoadedEntitys] = useState<Record<string, string>>({});
    const [selectedEntity, setSelectedEntity] = useState<EntityTypes>();
    const [tabs, setTabs] = useState<EntityTypes[]>([]);

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

    useEffect(() => {
        setTabs(getExistingTypes(loadedEntitys) as EntityTypes[]);

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
            createEntitysStateList().then((data: any) => {
                setLoadedEntitys(data);
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
                        <div className='selection-window'>
                            <div className='add-card-tabs'>
                                {
                                    tabs.length > 0 && tabs.map((tab) => (
                                        <button key={tab} className='button-text tab-button'>{tab}</button>
                                    ))
                                }
                            </div>
                            <div className='add-card-entity-container'>

                           <Sensor title={['Sensor']} entity={['sensor.sensor']} img={['sensor.img']}></Sensor>
                           <Sensor title={['Sensor']} entity={['sensor.sensor']} img={['sensor.img']}></Sensor>
                           <Sensor title={['Sensor']} entity={['sensor.sensor']} img={['sensor.img']}></Sensor>
                           <Sensor title={['Sensor']} entity={['sensor.sensor']} img={['sensor.img']}></Sensor>

                            </div>
                        </div>
                        <div className='add-card-input-container'>
                            <input className='add-card-input' type="text" placeholder={t('addCard.cardNamePlaceholder')} />
                        </div>
                        <div className='add-card-buttons-container'>
                            <button className='add-card-create-button'>t{t('addCard.create')}</button>
                            <button className='add-card-cancel-button' onClick={closeModal}>{t('addCard.cancel')}</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
}

export default AddCardModal;