import { useCallback, useContext } from 'react'
import { CardCreationDataContext } from './AddCardModal'
import { t } from 'i18next'
import './CardSizeSelection.css'

function CardSizeSelection() {
  const cardCreationData = useContext(CardCreationDataContext)

  if (!cardCreationData) {
    return null
  }

  const { setSize } = cardCreationData

  const setSmallSize = useCallback(() => {
    setSize('small')
  }, [setSize])

  const setMediumSize = useCallback(() => {
    setSize('medium')
  }, [setSize])

  const setLargeSize = useCallback(() => {
    setSize('large')
  }, [setSize])

  return (
    <section className="card-size-selection">
      <button
        onClick={setSmallSize}
        className="size-small button-svg button-svg-dark"
      >
        <label htmlFor="size-small">{t('addCard.size.small')}</label>
      </button>
      <button
        onClick={setMediumSize}
        className="size-medium button-svg button-svg-dark"
      >
        <label htmlFor="size-medium">{t('addCard.size.medium')}</label>
      </button>
      <button
        onClick={setLargeSize}
        className="size-large button-svg button-svg-dark"
      >
        <label htmlFor="size-large">{t('addCard.size.large')}</label>
      </button>
    </section>
  )
}

export default CardSizeSelection
