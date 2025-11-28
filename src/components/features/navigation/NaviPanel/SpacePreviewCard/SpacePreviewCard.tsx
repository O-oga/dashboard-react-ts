import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { SpaceIconTypes } from '@/types/Icons.types'
import { SpacesIcons } from '@/components/ui/icons'
import './SpacePreviewCard.css'
import { memo } from 'react'

interface SpacePreviewCardProps {
  previewChangeRef?: React.MutableRefObject<((space: {
    name: string
    description: string
    icon: SpaceIconTypes
  }) => void) | null>
}

function SpacePreviewCard({
  previewChangeRef,
}: SpacePreviewCardProps) {
  const { t } = useTranslation()
  const [iconKey, setIconKey] = useState<SpaceIconTypes>('HomeIcon')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  // Register callback in ref
  useEffect(() => {
    if (previewChangeRef) {
      previewChangeRef.current = (space: {
        name: string
        description: string
        icon: SpaceIconTypes
      }) => {
        setIconKey(space.icon as SpaceIconTypes)
        setTitle(space.name)
        setDescription(space.description)
      }
    }
    return () => {
      if (previewChangeRef) {
        previewChangeRef.current = null
      }
    }
  }, [previewChangeRef])


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
