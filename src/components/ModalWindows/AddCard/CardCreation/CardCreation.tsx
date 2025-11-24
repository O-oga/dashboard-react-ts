import { getIconButtons } from '../../../Icons';
import Sensor from '../../../SpaceCards/Devices/Sensor/Sensor';
import Switch from '../../../SpaceCards/Devices/Switch/Switch';
import Button from '../../../SpaceCards/Devices/Button/Button';
import './CardCreation.css';
import { t } from 'i18next';
import { useContext, useMemo } from 'react';
import { CardCreationDataContext } from '../AddCardModal';
import CardSizeSelection from './CardSizeSelection/CardSizeSelection';
import Camera from '../../../SpaceCards/Devices/Camera/Camera';
import Weather from '../../../SpaceCards/Weather/Weather';

function CardCreation() {
    const cardCreationData = useContext(CardCreationDataContext);
    if (!cardCreationData) {
        return null;
    }
    const { tab, setSelectedIcon } = cardCreationData;

    const IconButtonComponent = useMemo(() => {
        return getIconButtons(setSelectedIcon);
    }, [setSelectedIcon]);

    switch (tab) {
        case 'sensor': {
            return <>
                <section className='card-preview-window'>
                    <Sensor></Sensor>
                </section>
                <CardSizeSelection />
                <section className='icon-selection-window' aria-label={t('addCard.iconSelection')}>
                    {IconButtonComponent}
                </section>
            </>
        }
        case 'switch': {
            return <>
                <section className='card-preview-window'>
                    <Switch ></Switch>
                </section>
                <CardSizeSelection />
                <section className='icon-selection-window' aria-label={t('addCard.iconSelection')}>
                    {IconButtonComponent}
                </section>
            </>
        }
        case 'button': {
            return <>
                <section className='card-preview-window'>
                    <Button></Button>
                </section>
                <CardSizeSelection />
                <section className='icon-selection-window' aria-label={t('addCard.iconSelection')}>
                    {IconButtonComponent}
                </section>
            </>
        }
        case 'weather': {
            return <>
                <section className='card-preview-window'>
                    <Weather></Weather>
                </section>
                <CardSizeSelection />
            </>
        }
        case 'camera': {
            return <>
                <section className='card-preview-window'>
                    <Camera></Camera>
                </section>
                <CardSizeSelection />
            </>
        }
        default: {
            return null;
        }
    }

}

export default CardCreation;