import './AddSpaceModal.css';
import type { ModalProps } from '../../../types/modalProps.types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import type { SpaceIconTypes } from '../../../types/Icons.types';
import { SpacesIcons } from '../../Icons';



const AddSpaceModal = ({ isOpen, onClose, onspacePreviewChange }: ModalProps & { onspacePreviewChange?: (space: { name: string; description: string; icon: SpaceIconTypes }) => void }) => {
    const { t } = useTranslation();
    const [newSpaceName, setNewSpaceName] = useState<string>('');
    const [newSpaceDescription, setNewSpaceDescription] = useState<string>('');
    const [selectedIcon, setSelectedIcon] = useState<SpaceIconTypes>('HomeIcon');


    // Update preview when space data changes

    useEffect(() => {
        onspacePreviewChange?.({
            name: newSpaceName,
            description: newSpaceDescription,
            icon: selectedIcon
        });
    }, [newSpaceName, newSpaceDescription, selectedIcon, onspacePreviewChange]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            onspacePreviewChange?.({
                name: '',
                description: '',
                icon: 'HomeIcon' as SpaceIconTypes
            });
        }
    }, [isOpen, onspacePreviewChange]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const modalContent = (
        <div className="add-space-modal-overlay" onClick={onClose}>
            <div className="add-space-modal" onClick={(e) => e.stopPropagation()}>
                <div className='icon-container'>
                    {
                        Object.entries(SpacesIcons).map(([icon, Icon]) => (
                            <div className='icon-button' key={icon} onClick={() => setSelectedIcon(icon as SpaceIconTypes)}>
                                <Icon size={35} color="white"/>
                            </div>
                        ))
                    }

                </div>
                <div className='add-space-input-container'>
                    <input
                        className='add-space-input'
                        value={newSpaceName}
                        onChange={(e) => setNewSpaceName(e.target.value)}
                        type="text" placeholder={t('addSpace.spaceNamePlaceholder')}
                    />
                    <input
                        className='add-space-input'
                        value={newSpaceDescription}
                        onChange={(e) => setNewSpaceDescription(e.target.value)}
                        type="text"
                        placeholder={t('addSpace.spaceDescriptionPlaceholder')} />
                </div>
                <div className='add-space-button-container'>
                    <button className='button-add'>{t('addSpace.addSpace')}</button>
                    <button className='button-cancel' onClick={onClose}>{t('addSpace.cancel')}</button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

export default AddSpaceModal;
