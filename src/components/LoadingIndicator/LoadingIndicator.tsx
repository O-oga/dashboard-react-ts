import './LoadingIndicator.css';

import {t} from 'i18next';
import { UIIcons } from '@/components/Icons';

const SpinnerIconComponent = UIIcons['SpinnerIcon'];

function LoadingIndicator() {
    return (
        <div className='loading-indicator'>
            <SpinnerIconComponent className='loading-indicator-spinner' size={60} color="white" />
            <div className='loading-indicator-text'>{t('loading')}</div>
        </div>
    );
}

export default LoadingIndicator;