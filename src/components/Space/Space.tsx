import { useTranslation } from 'react-i18next';
import Sensor from '@/components/SpaceCards/Devices/Sensor/Sensor';
import Switch from '@/components/SpaceCards/Devices/Switch/Switch';
import './Space.css';
import { useSpaces } from '@/contexts/SpacesContext';
import { useDisclosure } from '@/hooks/useDisclosure';
import AddCardModal from '@/components/ModalWindows/AddCard/AddCardModal';
import { UIIcons } from '@/components/Icons';
import { useMemo } from 'react';
import type { Card } from '@/types/card.types';
import type { CardIconTypes } from '@/types/Icons.types';
import ButtonDevice from '@/components/SpaceCards/Devices/Button/ButtonDevice';

const AddIconComponent = UIIcons['AddIcon'];

function Space() {
    const { t } = useTranslation();
    const { spaces, currentSpaceId } = useSpaces();
    const { isOpen: isModalOpen, open: openModal, close: closeModal } = useDisclosure(false, { 
        onOpen: () => { console.log('onOpen') }, 
        onClose: () => { console.log('onClose') } 
    });

    // Memoize current space to avoid unnecessary recalculations
    const currentSpace = useMemo(() => {
        if (currentSpaceId === null) return null;
        return spaces.find(space => space.id === currentSpaceId) || null;
    }, [spaces, currentSpaceId]);

    // Memoize cards array to prevent re-renders when other spaces change
    const cards = useMemo(() => {
        return currentSpace?.cards || [];
    }, [currentSpace?.cards]);

    const getCardComponent = (card: Card) => {
        switch (card.type) {
            case 'switch': {
                return <Switch 
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    entity={card.entity}
                    icon={card.icon as CardIconTypes}
                    size={card.size}
                />
            }
            case 'sensor': {
                return <Sensor 
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    entity={card.entity}
                    icon={card.icon as CardIconTypes}
                    size={card.size}
                />
            }
            case 'button': {
                return <ButtonDevice 
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    entity={card.entity}
                    icon={card.icon as CardIconTypes}
                    size={card.size}
                />
            }
            default: {
                return null;
            }
        }
    }
    return (
        <div className="space">
            {currentSpace && currentSpace.cards.length >= 0 &&
                <div className='container'>

                    {cards.map((card: Card) => getCardComponent(card))}

                    <button 
                    className="add-card-button button-svg button-svg-large button-svg-dark" 
                    type="button" 
                    onClick={openModal}
                    aria-label={t('app.pinNewCard')}>
                        <AddIconComponent size={48} color="white" />
                        <div className="name-on-card">{t('app.pinNewCard')}</div>
                    </button>
                </div>
            }
            {isModalOpen && currentSpaceId !== null && <AddCardModal 
            isModalOpen={isModalOpen} 
            closeModal={closeModal} 
            spaceId={currentSpaceId} 
            />}
        </div >
    );
}

export default Space;