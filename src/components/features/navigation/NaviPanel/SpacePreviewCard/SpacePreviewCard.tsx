import { useTranslation } from 'react-i18next'
import type { SpaceIconTypes } from '@/types/Icons.types'
import { SpacesIcons } from '@/components/ui/icons'
import './SpacePreviewCard.css'

interface SpacePreviewCardProps {
  iconKey?: SpaceIconTypes
  title?: string
  description?: string
}

function SpacePreviewCard({
  iconKey,
  title,
  description,
}: SpacePreviewCardProps) {
  const { t } = useTranslation()

  const SpaceIcon = iconKey && SpacesIcons[iconKey as SpaceIconTypes]

  if (!SpaceIcon) {
    return null
  }

  return (
    <button
      className="space-preview-card navi-panel-button button-svg button-svg-large button-svg-dark"
      type="button"
      aria-label={description || t('naviPanel.createNewSpace')}
    >
      <div className="space-card-icon">
        <SpaceIcon size={55} color="white" />
      </div>
      <div className="space-card-title">{title || t('naviPanel.anyName')}</div>
    </button>
  )
}

export default SpacePreviewCard
