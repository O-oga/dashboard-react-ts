import { CardIconButtons } from '@/components/ui/icons'
import Sensor from '@/components/features/cards/devices/Sensor/Sensor'
import Switch from '@/components/features/cards/devices/Switch/Switch'
import Button from '@/components/features/cards/devices/Button/Button'
import './CardCreation.css'
import { t } from 'i18next'
import { memo, useContext } from 'react'
import { CardCreationDataContext } from './AddCardModal'
import CardSizeSelection from './CardSizeSelection'
import Camera from '@/components/features/cards/devices/Camera/Camera'
import Weather from '@/components/features/cards/widgets/Weather/Weather'

function CardCreation() {
  const cardCreationData = useContext(CardCreationDataContext)
  if (!cardCreationData) {
    return null
  }
  const { tab, setSelectedIcon } = cardCreationData

 

  switch (tab) {
    case 'sensor': {
      return (
        <>
          <section className="card-preview-window">
            <Sensor></Sensor>
          </section>
          <CardSizeSelection />
          <section
            className="icon-selection-window"
            aria-label={t('addCard.iconSelection')}
          >
            <CardIconButtons setIcon={setSelectedIcon} />
          </section>
        </>
      )
    }
    case 'switch': {
      return (
        <>
          <section className="card-preview-window">
            <Switch></Switch>
          </section>
          <CardSizeSelection />
          <section
            className="icon-selection-window"
            aria-label={t('addCard.iconSelection')}
          >
            <CardIconButtons setIcon={setSelectedIcon} />
          </section>
        </>
      )
    }
    case 'button': {
      return (
        <>
          <section className="card-preview-window">
            <Button></Button>
          </section>
          <CardSizeSelection />
          <section
            className="icon-selection-window"
            aria-label={t('addCard.iconSelection')}
          >
            <CardIconButtons setIcon={setSelectedIcon} />
          </section>
        </>
      )
    }
    case 'weather': {
      return (
        <>
          <section className="card-preview-window">
            <Weather></Weather>
          </section>
          <CardSizeSelection />
        </>
      )
    }
    case 'camera': {
      return (
        <>
          <section className="card-preview-window">
            <Camera></Camera>
          </section>
          <CardSizeSelection />
        </>
      )
    }
    default: {
      return null
    }
  }
}

export default memo(CardCreation)
