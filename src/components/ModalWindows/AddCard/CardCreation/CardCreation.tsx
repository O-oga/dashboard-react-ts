import { getIconButtons } from '../../../Icons';
import Sensor from '../../../SpaceCards/Devices/Sensor/Sensor';
import Switch from '../../../SpaceCards/Devices/Switch/Switch';
import Button from '../../../SpaceCards/Devices/Button/Button';
import './CardCreation.css';
import { t } from 'i18next';

function CardCreation(props: any) {
    const { entity, selectedTab, selectedIcon, setSelectedIcon } = props;

    switch (selectedTab) {
        case 'sensor': {
            return <>
                <section className='card-preview-window'>
                    <Sensor entity={entity} icon={selectedIcon}></Sensor>
                </section>
                <section className='icon-selection-window' aria-label={t('addCard.iconSelection')}>
                    {getIconButtons(setSelectedIcon)}
                </section>
            </>
        }
        case 'switch': {
            return <>
                <section className='card-preview-window'>
                    <Switch entity={entity} icon={selectedIcon}></Switch>
                </section>
                <section className='icon-selection-window' aria-label={t('addCard.iconSelection')}>
                    {getIconButtons(setSelectedIcon)}
                </section>
            </>
        }
        case 'button': {
            return <>
                <section className='card-preview-window'>
                    <Button entity={entity} icon={selectedIcon}></Button>
                </section>
                <section className='icon-selection-window' aria-label={t('addCard.iconSelection')}>
                    {getIconButtons(setSelectedIcon)}
                </section>
            </>
        }
        default: {
            return null;
        }
    }

}

export default CardCreation;