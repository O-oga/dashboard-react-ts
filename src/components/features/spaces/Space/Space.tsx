import { useTranslation } from 'react-i18next'
import Sensor from '@/components/features/cards/devices/Sensor/Sensor'
import Switch from '@/components/features/cards/devices/Switch/Switch'
import './Space.css'
import { useSpaces } from '@/contexts/SpacesContext'
import { useDisclosure } from '@/hooks/useDisclosure'
import AddCardModal from '@/components/modals/AddCardModal/AddCardModal'
import { UIIcons } from '@/components/ui/icons'
import { useEffect, useMemo } from 'react'
import type { Card } from '@/types/card.types'
import type { CardIconTypes } from '@/types/Icons.types'
import Button from '@/components/features/cards/devices/Button/Button'
import type { SpaceType } from '@/types/space.types'
import type { ClickedItem } from '@/types/clickContext.types'
import { useContextMenuContext } from '@/contexts/ContextMenuContext'

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

  const { openContextMenu, setOnOpenAddCardModal } = useContextMenuContext();
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

  // Register modal callbacks with context menu
  useEffect(() => {
    setOnOpenAddCardModal(openModal);
    
    return () => {
      setOnOpenAddCardModal(null);
    };
  }, [openModal, setOnOpenAddCardModal]);

  const handleOpenSpaceContextMenu = (e: React.MouseEvent) => {
    if (currentSpaceId && currentSpace) {
      openContextMenu(e, {
        type: 'space',
        spaceId: currentSpaceId,
        space: currentSpace as SpaceType,
      } as ClickedItem, 'space');
    }
  }

  const getCardComponent = (card: Card) => {
    const handleCardContextMenu = (e: React.MouseEvent) => {
      if (currentSpaceId && currentSpace) {
        openContextMenu(e, {
          type: 'space-card',
          spaceId: currentSpaceId,
          cardId: card.id,
          card: card,
        } as ClickedItem, 'space-card');
      }
    };

    switch (card.type) {
      case 'switch': {
        return (
          <div key={card.id} onContextMenu={handleCardContextMenu}>
            <Switch
              id={card.id}
              title={card.title}
              entity={card.entity}
              icon={card.icon as CardIconTypes}
              size={card.size}
            />
          </div>
        )
      }
      case 'sensor': {
        return (
          <div key={card.id} onContextMenu={handleCardContextMenu}>
            <Sensor
              id={card.id}
              title={card.title}
              entity={card.entity}
              icon={card.icon as CardIconTypes}
              size={card.size}
            />
          </div>
        )
      }
      case 'button': {
        return (
          <div key={card.id} onContextMenu={handleCardContextMenu}>
            <Button
              id={card.id}
              title={card.title}
              entity={card.entity}
              icon={card.icon as CardIconTypes}
              size={card.size}
            />
          </div>
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
    </div>
  )
}

export default Space
