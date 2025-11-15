import { createPortal } from 'react-dom';
import './AddCardModal.css';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

function AddCardModal(props : any) {
    const { isModalOpen, closeModal } = props;
    const { t } = useTranslation();

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
                <div className='add-card-input-container'>
                    <input className='add-card-input' type="text" placeholder={t('addCard.cardNamePlaceholder')} />
                </div>
                <div className='add-card-buttons-container'>
                    <button className='add-card-create-button'>t{t('addCard.create')}</button>
                    <button className='add-card-cancel-button' onClick={closeModal}>{t('addCard.cancel')}</button>
                </div>
            </div>
        </div>
    );
    return        createPortal(modalContent, document.body);
}

export default AddCardModal;