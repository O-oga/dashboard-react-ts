import { useTranslation } from 'react-i18next';
import Sensor from '@/components/SpaceCards/Devices/Sensor/Sensor';
import Switch from '@/components/SpaceCards/Devices/Switch/Switch';
import './Space.css';
import { useSpaces } from '@/contexts/SpacesContext';
import { useDisclosure } from '@/hooks/useDisclosure';
import AddCardModal from '@/components/ModalWindows/AddCard/AddCardModal';
import { UIIcons } from '@/components/Icons';
import Button from '@/components/SpaceCards/Devices/Button/Button';

const AddIconComponent = UIIcons['AddIcon'];

function Space(props: any) {
    const { spaceId } = props;
    const { t } = useTranslation();
    const { spaces } = useSpaces();
    const { isOpen: isModalOpen, open: openModal, close: closeModal } = useDisclosure(false, { 
        onOpen: () => { console.log('onOpen') }, 
        onClose: () => { console.log('onClose') } 
    });

    const getCardComponent = (card: any) => {
        switch (card.type) {
            case 'switch': {
                console.log(card.id);
                return <Switch key={card.id}></Switch>
            }
            case 'sensor': {
                return <Sensor key={card.id}></Sensor>
            }
            case 'button': {
                console.log(card.id);
                return <Button key={card.id}></Button>
            }
            default: {
                return null;
            }
        }
    }



    const currentSpace = spaces.find(space => space.id === spaceId);

    return (
        <div className="space">
            {currentSpace && currentSpace.cards.length >= 0 &&
                <div className='container'>
                        {currentSpace.cards.map((card: any) => {
                            return getCardComponent(card)})}

                    <button 
                    className="card-svg button-svg button-svg-large button-svg-dark" 
                    type="button" 
                    onClick={openModal}
                    aria-label={t('app.pinNewCard')}>
                        <AddIconComponent size={48} color="white" />
                        <div className="name-on-card">{t('app.pinNewCard')}</div>
                    </button>
                </div>
            }
            {isModalOpen && <AddCardModal 
            isModalOpen={isModalOpen} 
            closeModal={closeModal} 
            spaceId={spaceId} 
            />}
        </div >
    );
}

export default Space;