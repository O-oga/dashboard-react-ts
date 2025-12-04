import './Sensor.css'
import { CardsIcons } from '@/components/ui/icons'
import type { CardIconTypes } from '@/types/Icons.types'
import { CardCreationDataContext } from '@/components/modals/AddCardModal/AddCardModal'
import { useContext, useEffect, memo } from 'react'
import { createGraphData } from '@/modules/graph'
import Graph from '@/components/features/reusable/Graph/Graph'

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
        <div
          key={id}
          className="sensor card-large button-svg-dark button-svg"
        >
          <div className="svg-icon-large-card">
            <IconComponent size={35} />
          </div>
          <div className="large-graph">
            <Graph data={[
              { time: new Date('2025-12-04T00:00:00Z'), value: 100 },
              { time: new Date('2025-12-04T01:00:00Z'), value: 200 },
              { time: new Date('2025-12-04T02:00:00Z'), value: 300 },
              { time: new Date('2025-12-04T03:00:00Z'), value: 400 },
              { time: new Date('2025-12-04T04:00:00Z'), value: 500 },
              { time: new Date('2025-12-04T05:00:00Z'), value: 600 },
              { time: new Date('2025-12-04T06:00:00Z'), value: 700 },
              { time: new Date('2025-12-04T07:00:00Z'), value: 800 },
              { time: new Date('2025-12-04T08:00:00Z'), value: 900 },
              { time: new Date('2025-12-04T09:00:00Z'), value: 1000 },
            ]} options={{
              // showGrid: false,
              // showTooltip: false,
              // showXAxis: false,
              // showYAxis: false,
              // xAxisLabel: 'Time',
              // yAxisLabel: 'Value',
              height: 120,
              barOptions: {
                fill: 'var(--button-text-color)',
                stroke: 'var(--button-text-color)',
                strokeWidth: 2,
                radius: [2, 2, 0, 0],
              },
            }} />
          </div>
          <div className="sensor-title">{displayTitle}</div>
        </div>
      )
    }
    case 'extra-large': {
      return (
        <div
          key={id}
          className="sensor card-extra-large button-svg-dark button-svg"
        >
          <div className="svg-icon-extra-large-card">
            <IconComponent size={35} />
          </div>
          <Graph data={[
            { time: new Date('2025-12-04T00:00:00Z'), value: 100 },
            { time: new Date('2025-12-04T01:00:00Z'), value: 200 },
            { time: new Date('2025-12-04T02:00:00Z'), value: 300 },
            { time: new Date('2025-12-04T03:00:00Z'), value: 400 },
            { time: new Date('2025-12-04T04:00:00Z'), value: 500 },
            { time: new Date('2025-12-04T05:00:00Z'), value: 600 },
            { time: new Date('2025-12-04T05:00:00Z'), value: 600 },
            { time: new Date('2025-12-04T05:00:00Z'), value: 600 },
            { time: new Date('2025-12-04T05:00:00Z'), value: 600 },
            { time: new Date('2025-12-04T06:00:00Z'), value: 700 },
            { time: new Date('2025-12-04T07:00:00Z'), value: 800 },
            { time: new Date('2025-12-04T08:00:00Z'), value: 900 },
            { time: new Date('2025-12-04T09:00:00Z'), value: 1000 },
          ]} options={{
            // showGrid: false,
            // showTooltip: false,
            // showXAxis: false,
            // showYAxis: false,
            // xAxisLabel: 'Time',
            // yAxisLabel: 'Value',
            height: 120,
            barOptions: {
              fill: 'var(--button-text-color)',
              stroke: 'var(--button-text-color)',
              strokeWidth: 2,
              radius: [2, 2, 0, 0],
            },
          }} />
          <div className="sensor-title">{displayTitle}</div>
        </div>
      )
    }
    default: {
      return null
    }
  }
}

export default memo(Sensor)
