import { Chair2Icon, HomeIcon, LightbulbIcon, MonitorIcon, PlugCircleIcon, SmartHomeIcon, WidgetIcon, Widget4Icon } from '../../Icons';
import './AddSpace.css';
import type { ModalProps } from '../../../types/space.types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import type { ComponentType } from 'react';

type IconComponent = ComponentType<{ size?: number; color?: string; className?: string }>;

const AddSpaceModal = ({ isOpen, onClose, onSpaceChange }: ModalProps & { onSpaceChange?: (space: { name: string; description: string; icon: IconComponent | null }) => void }) => {
    const { t } = useTranslation();
    const [newSpaceName, setNewSpaceName] = useState('');
    const [newSpaceDescription, setNewSpaceDescription] = useState('');
    const [selectedIcon, setSelectedIcon] = useState<IconComponent | null>(null);

    // Update preview when space data changes
    useEffect(() => {
        if (onSpaceChange) {
            onSpaceChange({
                name: newSpaceName,
                description: newSpaceDescription,
                icon: selectedIcon
            });
        }
    }, [newSpaceName, newSpaceDescription, selectedIcon, onSpaceChange]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setNewSpaceName('');
            setNewSpaceDescription('');
            setSelectedIcon(null);
        }
    }, [isOpen]);
    
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
                    <HomeIcon size={35} color="white" />
                    <LightbulbIcon size={35} color="white" />
                    <MonitorIcon size={35} color="white" />
                    <PlugCircleIcon size={35} color="white" />
                    <SmartHomeIcon size={35} color="white" />
                    <WidgetIcon size={35} color="white" />
                    <Widget4Icon size={35} color="white" />
                    <Chair2Icon size={35} color="white" />
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
