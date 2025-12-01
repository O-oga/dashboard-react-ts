import { useMemo, useState } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { SpaceIconTypes } from '@/types/Icons.types'
import { SpacesIcons } from '@/components/ui/icons'
import './SpacePreviewCard.css'
import { memo } from 'react'
import { useAddSpaceModal } from '@/contexts/AddSpaceModalContext'

function SpacePreviewCard() {
  const { t } = useTranslation()
  const { spacePreview } = useAddSpaceModal()

  const [iconKey, setIconKey] = useState<SpaceIconTypes>(spacePreview?.icon ?? 'HomeIcon')
  const [title, setTitle] = useState<string>(spacePreview?.name ?? '')
  const [description, setDescription] = useState<string>(spacePreview?.description ?? '')

  useEffect(() => {
    setIconKey(spacePreview?.icon ?? 'HomeIcon')
    setTitle(spacePreview?.name ?? '')
    setDescription(spacePreview?.description ?? '')
  }, [spacePreview])

  const spaceIcon = useMemo(() => {
    const Icon = iconKey && SpacesIcons[iconKey as SpaceIconTypes]
    return iconKey && <Icon size={55} color="white" />
  }, [iconKey])

  return (
    <button
      className="space-preview-card navi-panel-button button-svg button-svg-large button-svg-dark"
      type="button"
      aria-label={description || t('naviPanel.createNewSpace')}
    >
      <div className="space-card-icon">
        {spaceIcon}
      </div>
      <div className="space-card-title">{title || t('naviPanel.anyName')}</div>
    </button>
  )
}

export default memo(SpacePreviewCard)
