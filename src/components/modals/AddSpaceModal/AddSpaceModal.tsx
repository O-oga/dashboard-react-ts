import './AddSpaceModal.css'
import type { ModalProps } from '@/types/modalProps.types'
import { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import type { SpaceIconTypes } from '@/types/Icons.types'
import { SpaceIconButtons } from '@/components/ui/icons'
import { useSpaces } from '@/contexts/SpacesContext'
import type { SpaceType } from '@/types/space.types'

const AddSpaceModal = ({
  isOpen,
  onClose,
  onspacePreviewChange,
}: ModalProps & {
  onspacePreviewChange?: (space: {
    name: string
    description: string
    icon: SpaceIconTypes
  }) => void
}) => {
  const { t } = useTranslation()
  const { addSpace, spaces } = useSpaces()

  const [spacePreview, setSpacePreview] = useState<{
    name: string
    description: string
    icon: SpaceIconTypes
  }>({
    name: '',
    description: '',
    icon: 'HomeIcon',
  })
  const onAddSpace = useCallback(
    (space: {
      id: number
      name: string
      description: string
      icon: SpaceIconTypes
      order: number
    }) => {
      const newSpace: SpaceType = {
        id: space.id ?? Date.now(),
        title: space.name,
        description: space.description,
        icon: space.icon as SpaceIconTypes,
        cards: [],
        order: space.order,
      }
      addSpace(newSpace)
      onClose()
    },
    [addSpace, onClose]
  )

  useEffect(() => {
    onspacePreviewChange?.({
      name: spacePreview.name,
      description: spacePreview.description,
      icon: spacePreview.icon,
    })
  }, [spacePreview, onspacePreviewChange])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      spacePreview.name = ''
      spacePreview.description = ''
      spacePreview.icon = 'HomeIcon'
    }
  }, [isOpen])

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


  const modalContent = (
    <div className="add-space-modal-overlay" onClick={onClose}>
      <div className="add-space-modal" onClick={e => e.stopPropagation()}>
        <section
          className="icon-container"
          aria-label={t('addSpace.iconSelection')}
        >
          <div className="icons">
            <SpaceIconButtons setIcon={icon => setSpacePreview({ ...spacePreview, icon })} />
          </div>
        </section>
        <div className="add-space-input-container">
          <input
            className="add-space-input"
            value={spacePreview.name}
            onChange={e => setSpacePreview({ ...spacePreview, name: e.target.value })}
            type="text"
            placeholder={t('addSpace.spaceNamePlaceholder')}
          />
          <input
            className="add-space-input"
            value={spacePreview.description}
            onChange={e => setSpacePreview({ ...spacePreview, description: e.target.value })}
            type="text"
            placeholder={t('addSpace.spaceDescriptionPlaceholder')}
          />
        </div>
        <div className="add-space-button-container">
          <button
            className="button-add"
            onClick={() =>
              onAddSpace({
                id: Date.now(),
                name: spacePreview.name,
                description: spacePreview.description,
                icon: spacePreview.icon,
                order:
                  spaces.length > 0 ? spaces[spaces.length - 1].order + 1 : 1,
              })
            }
          >
            {t('addSpace.addSpace')}
          </button>
          <button className="button-cancel" onClick={onClose}>
            {t('addSpace.cancel')}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default memo(AddSpaceModal)
