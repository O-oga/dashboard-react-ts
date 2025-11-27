import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './PrivacyModal.css'
import type { ModalProps } from '@/types/modalProps.types'

const PrivacyModal = ({ isOpen, onClose }: ModalProps) => {
  const { t } = useTranslation()

  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div className="privacy-modal-overlay" onClick={onClose}>
      <div className="privacy-modal-content" onClick={e => e.stopPropagation()}>
        <div className="privacy-modal-header">
          <h2 className="privacy-modal-title">{t('privacy.title')}</h2>
          <button
            className="privacy-modal-close"
            onClick={onClose}
            aria-label={t('privacy.close')}
          >
            ×
          </button>
        </div>
        <div className="privacy-modal-body">
          <p className="privacy-modal-description">
            {t('privacy.description')}
          </p>
        </div>
        <div className="privacy-modal-footer">
          <button className="privacy-modal-button" onClick={onClose}>
            {t('privacy.close')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrivacyModal
