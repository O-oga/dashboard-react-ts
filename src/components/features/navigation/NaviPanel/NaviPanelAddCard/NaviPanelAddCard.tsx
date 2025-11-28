import { useTranslation } from 'react-i18next'
import './NaviPanelAddCard.css'
import { memo } from 'react'
import { AddSpaceIcon } from '@/components/ui/icons/AddSpaceIcon'

interface NaviPanelAddCardProps {
  onOpenModal: () => void
}

function NaviPanelAddCard({ onOpenModal }: NaviPanelAddCardProps) {
  const { t } = useTranslation()

  return (
    <button
      className="navi-panel-button button-svg button-svg-large button-svg-dark"
      type="button"
      aria-label={t('naviPanel.createNewSpace')}
      onClick={onOpenModal}
    >
      <AddSpaceIcon className="card-svg" size={55} color="white" />
      <div className="space-card-title">{t('naviPanel.newSpace')}</div>
    </button>
  )
}

export default memo(NaviPanelAddCard)
