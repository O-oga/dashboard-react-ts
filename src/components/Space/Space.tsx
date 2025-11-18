import { useTranslation } from 'react-i18next';
import Sensor from '../SpaceCards/Devices/Sensor/Sensor';
import Switch from '../SpaceCards/Devices/Switch/Switch';
import './Space.css';
import { useSpaces } from '../../contexts/SpacesContext';
import { useDisclosure } from '../../hooks/useDisclosure';
import AddCardModal from '../ModalWindows/AddCard/AddCardModal';
import { UIIcons } from '../Icons';

const AddIconComponent = UIIcons['AddIcon'];

function Space(props: any) {
    const { createdCards, spaceId } = props;
    const { t } = useTranslation();
    const { spaces } = useSpaces();
    const { isOpen: isModalOpen, open: openModal, close: closeModal } = useDisclosure(false, { 
        onOpen: () => { console.log('onOpen') }, 
        onClose: () => { console.log('onClose') } 
    });

    const getCardComponent = (card: any) => {
        switch (card.type) {
            case 'switch': {
                return <Switch title={[card.title]} entity={[card.entity]} img={[card.img]}></Switch>
            }
            case 'sensor': {
                return <Sensor title={[card.title]} entity={[card.entity]} img={[card.img]}></Sensor>
            }
        }
    }



    const currentSpace = spaces.find(space => space.id === spaceId);

    return (
        <div className="space">
            {currentSpace?.cards.length === 0 &&
                <div className='container'>
                        {createdCards.map((card: any) => getCardComponent(card))}

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
            {isModalOpen && <AddCardModal isModalOpen={isModalOpen} closeModal={closeModal} />}
        </div >
    );
}

export default Space;