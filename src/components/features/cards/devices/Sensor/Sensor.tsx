import './Sensor.css'
import { CardsIcons } from '@/components/ui/icons'
import type { CardIconTypes } from '@/types/Icons.types'
import { CardCreationDataContext } from '@/components/modals/AddCardModal/AddCardModal'
import { useContext, useEffect, memo } from 'react'
import { createGraphData } from '@/modules/graph'

interface SensorProps {
  title?: string
  entity?: string
  icon?: CardIconTypes
  size?: 'small' | 'medium' | 'large'
  id?: number
}

function Sensor(props?: SensorProps) {
  const cardCreationData = useContext(CardCreationDataContext)

  // Use props if provided, otherwise fall back to context (for creation mode)
  const title = props?.title ?? cardCreationData?.title ?? ''
  const entity = props?.entity ?? cardCreationData?.entity ?? ''
  const icon = props?.icon ?? cardCreationData?.icon
  const size = props?.size ?? cardCreationData?.size ?? 'small'
  const id = props?.id ?? 0

  // If neither props nor context are available, return null
  if (!props && !cardCreationData) {
    return null
  }

  const IconComponent = icon
    ? CardsIcons[icon as CardIconTypes]
    : CardsIcons['SensorIcon']

  useEffect(() => {
    if (entity) {
      createGraphData({
        entity_ids: [entity],
        past_days: 1
      }).then((data) => {
        console.log('Graph data loaded:', data)
      }).catch((error) => {
        console.error('Error loading graph data:', error)
      })
    }
  }, [entity])

  const displayTitle =
    title || (entity ? entity.split('.')[1]?.split('_')[0] : '')

  switch (size) {
    case 'small': {
      return (
        <button
          key={id}
          className="sensor card-small button-svg-dark button-svg"
        >
          <div className="svg-icon">
            <IconComponent size={50} />
          </div>
          <div className="sensor-title">{displayTitle}</div>
        </button>
      )
    }
    case 'medium': {
      return (
        <button
          key={id}
          className="sensor card-medium button-svg-dark button-svg"
        >
          <div className="svg-icon">
            <IconComponent size={50} />
          </div>
          <div className="sensor-title">{displayTitle}</div>
        </button>
      )
    }
    case 'large': {
      return (
        <button
          key={id}
          className="sensor card-large button-svg-dark button-svg"
        >
          <div className="svg-icon">
            <IconComponent size={50} />
          </div>
          <div className="sensor-title">{displayTitle}</div>
        </button>
      )
    }
    case 'extra-large': {
      return (
        <button
          key={id}
          className="sensor card-extra-large button-svg-dark button-svg"
        >
          <div className="svg-icon">
            <IconComponent size={50} />
          </div>
          <div className="sensor-title">{displayTitle}</div>
        </button>
      )
    }
    default: {
      return null
    }
  }
}

export default memo(Sensor)
