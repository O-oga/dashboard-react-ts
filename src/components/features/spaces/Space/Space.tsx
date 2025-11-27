import { useTranslation } from 'react-i18next'
import Sensor from '@/components/features/cards/devices/Sensor/Sensor'
import Switch from '@/components/features/cards/devices/Switch/Switch'
import './Space.css'
import { useSpaces } from '@/contexts/SpacesContext'
import { useDisclosure } from '@/hooks/useDisclosure'
import AddCardModal from '@/components/modals/AddCardModal/AddCardModal'
import { UIIcons } from '@/components/ui/icons'
import { useMemo, useState } from 'react'
import type { Card } from '@/types/card.types'
import type { CardIconTypes } from '@/types/Icons.types'
import Button from '@/components/features/cards/devices/Button/Button'
import type { Space } from '@/types/space.types'
import type { ClickedItem } from '@/types/clickContext.types'
import ContextMenu from '@/components/ContextMenu/ContextMenu'
import { useContextMenu } from '@/hooks/useContextMenu'

const AddIconComponent = UIIcons['AddIcon']

function Space() {
  const { t } = useTranslation()
  const { spaces, currentSpaceId } = useSpaces()
  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useDisclosure(false, {
    onOpen: () => {
      console.log('onOpen')
    },
    onClose: () => {
      console.log('onClose')
    },
  })

  const [contextMenuState, setContextMenuState] = useState<{
    position: { x: number, y: number },
    clickedItem: ClickedItem | null,
    visible: boolean,
  } | null>(null)

  // Memoize current space to avoid unnecessary recalculations
  const currentSpace = useMemo(() => {
    if (currentSpaceId === null) {
      return null
    }
    return spaces.find(space => space.id === currentSpaceId) || null
  }, [spaces, currentSpaceId])

  // Memoize cards array to prevent re-renders when other spaces change
  const cards = useMemo(() => {
    return currentSpace?.cards || []
  }, [currentSpace?.cards])



  const handleOpenSpaceContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentSpaceId) {
      setContextMenuState({
        position: { x: e.clientX, y: e.clientY },
        clickedItem: {
          type: 'space',
          spaceId: currentSpaceId,
          space: currentSpace as Space,
        } as ClickedItem,
        visible: true,
      })
    }
  }

  // Хуки должны вызываться безусловно - всегда вызываем useContextMenu
  const {handleRemoveSpace, handleAddSpace, handleChangeSpace} = useContextMenu(
    contextMenuState 
      ? { x: contextMenuState.position.x, y: contextMenuState.position.y }
      : { x: 0, y: 0 }, // Значения по умолчанию
    contextMenuState?.visible ?? false,
    contextMenuState?.clickedItem ?? null,
    openModal,
    openModal,
  );

  const getCardComponent = (card: Card) => {
    switch (card.type) {
      case 'switch': {
        return (
          <Switch
            key={card.id}
            id={card.id}
            title={card.title}
            entity={card.entity}
            icon={card.icon as CardIconTypes}
            size={card.size}
          />
        )
      }
      case 'sensor': {
        return (
          <Sensor
            key={card.id}
            id={card.id}
            title={card.title}
            entity={card.entity}
            icon={card.icon as CardIconTypes}
            size={card.size}
          />
        )
      }
      case 'button': {
        return (
          <Button
            key={card.id}
            id={card.id}
            title={card.title}
            entity={card.entity}
            icon={card.icon as CardIconTypes}
            size={card.size}
          />
        )
      }
      default: {
        return null
      }
    }
  }
  return (
    <div 
    className="space"
    onContextMenu={handleOpenSpaceContextMenu}
    >
      {currentSpace && currentSpace.cards.length >= 0 && (
        <div className="container">
          {cards.map((card: Card) => getCardComponent(card))}

          <button
            className="add-card-button button-svg button-svg-large button-svg-dark"
            type="button"
            onClick={openModal}
            aria-label={t('app.pinNewCard')}
          >
            <AddIconComponent size={48} color="white" />
            <div className="name-on-card">{t('app.pinNewCard')}</div>
          </button>
        </div>
      )}
      {isModalOpen && currentSpaceId !== null && (
        <AddCardModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          spaceId={currentSpaceId}
        />
      )}
      {contextMenuState && contextMenuState.visible && (
        <ContextMenu
          x={contextMenuState.position.x}
          y={contextMenuState.position.y}
          contextType="space"
          visible={contextMenuState.visible}
          handleRemoveSpace={handleRemoveSpace}
          handleAddSpace={handleAddSpace}
          handleChangeSpace={handleChangeSpace}
        />
      )}
    </div>
  )
}

export default Space
