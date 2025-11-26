import './AddSpaceModal.css'
import type { ModalProps } from '@/types/modalProps.types'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import type { SpaceIconTypes } from '@/types/Icons.types'
import { getSpaceIconButtons } from '@/components/Icons'
import { useSpaces } from '@/contexts/SpacesContext'
import type { Space } from '@/types/space.types'

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
  const [newSpaceName, setNewSpaceName] = useState<string>('')
  const [newSpaceDescription, setNewSpaceDescription] = useState<string>('')
  const [selectedIcon, setSelectedIcon] = useState<SpaceIconTypes>('HomeIcon')

  const onAddSpace = useCallback(
    (space: {
      id: number
      name: string
      description: string
      icon: SpaceIconTypes
      order: number
    }) => {
      const newSpace: Space = {
        id: space.id ?? Date.now(),
        title: space.name,
        description: space.description,
        icon: space.icon,
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
      name: newSpaceName,
      description: newSpaceDescription,
      icon: selectedIcon,
    })
  }, [newSpaceName, newSpaceDescription, selectedIcon, onspacePreviewChange])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNewSpaceName('')
      setNewSpaceDescription('')
      setSelectedIcon('HomeIcon')
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
          <div className="icons">{getSpaceIconButtons(setSelectedIcon)}</div>
        </section>
        <div className="add-space-input-container">
          <input
            className="add-space-input"
            value={newSpaceName}
            onChange={e => setNewSpaceName(e.target.value)}
            type="text"
            placeholder={t('addSpace.spaceNamePlaceholder')}
          />
          <input
            className="add-space-input"
            value={newSpaceDescription}
            onChange={e => setNewSpaceDescription(e.target.value)}
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
                name: newSpaceName,
                description: newSpaceDescription,
                icon: selectedIcon,
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

export default AddSpaceModal
