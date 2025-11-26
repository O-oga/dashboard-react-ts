import './NaviPanelCard.css'
import { SpacesIcons, UIIcons } from '@/components/Icons'
import type { SpaceIconTypes } from '@/types/Icons.types'
import { useSpaces } from '@/contexts/SpacesContext'
import { useCallback } from 'react'
import type { Space } from '@/types/space.types'

interface NaviPanelCardProps {
  space: Space
  isChangable: boolean
  onSpaceSelect: (spaceId: string) => void
}

const NaviPanelCard = ({
  space,
  isChangable,
  onSpaceSelect,
}: NaviPanelCardProps) => {
  const IconComponent = SpacesIcons[space.icon as SpaceIconTypes]
  const SettingsIconComponent = UIIcons['SettingsIcon']
  const TrashIconComponent = UIIcons['TrashIcon']
  const { removeSpace, changeSpace } = useSpaces()
  const handleSpaceSelect = useCallback(
    (space: Space) => {
      onSpaceSelect(space.id)
    },
    [onSpaceSelect]
  )

  return (
    <div className="navi-panel-card-container">
      <button
        className="navi-panel-card button-svg button-svg-large button-svg-dark"
        onClick={() => handleSpaceSelect(space)}
        aria-label={space.description}
      >
        <IconComponent size={60} color="white" />
        <div className="space-card-title">{space.title}</div>
      </button>
      {isChangable && (
        <div className="change-buttons-container">
          <button
            className="change-space-button button-svg button-svg-small button-svg-dark"
            onClick={() => changeSpace({ ...space, cards: space.cards })}
          >
            <SettingsIconComponent size={24} color="white" />
          </button>
          <button
            className="delete-space-button button-svg button-svg-small button-svg-error"
            onClick={() => removeSpace(space.id)}
          >
            <TrashIconComponent size={24} color="white" />
          </button>
        </div>
      )}
    </div>
  )
}

export default NaviPanelCard
