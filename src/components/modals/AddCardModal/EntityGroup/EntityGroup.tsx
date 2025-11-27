import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@/hooks/useDisclosure'
import './EntityGroup.css'
import { useScrollIntoView } from '@/hooks/useScrollIntoView'
import type { EntityTypes } from '@/types/card.types'

interface EntityGroupProps {
  groupName: string
  entities: EntityTypes[]
  setSelectedEntity: (entity: EntityTypes) => void
}

function EntityGroup({
  groupName,
  entities,
  setSelectedEntity,
}: EntityGroupProps) {
  const { t } = useTranslation()
  const { ref, scrollIntoView } = useScrollIntoView<HTMLDivElement>()
  const { isOpen, toggle } = useDisclosure(false, {})

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        requestAnimationFrame(() => {
          scrollIntoView()
        })
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen, scrollIntoView])

  const getEntityGroupName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  }

  const convertEntityInfo = (entity: EntityTypes) => {
    const info = entity.split('.').pop()!.split('_').slice(1).join(' ')
    return info ? info : entity.split('.').pop()
  }

  return (
    <div className="entity-group">
      <button
        className="entity-group-header"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={`entity-group-content-${groupName}`}
      >
        <span className="entity-group-name">
          {getEntityGroupName(groupName)}
        </span>
        <span className="entity-group-count">
          {entities.length} {t('addCard.entities')}
        </span>
        <span
          className={`entity-group-chevron ${isOpen ? 'entity-group-chevron-open' : ''}`}
          aria-hidden="true"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        className={`entity-group-content ${isOpen ? 'entity-group-content-open' : ''}`}
        id={`entity-group-content-${groupName}`}
        aria-hidden={!isOpen}
      >
        <div className="entity-group-content-inner" ref={ref}>
          <section
            className={`entity-of-tab-item-container ${isOpen ? 'entity-of-tab-item-container-open' : ''}`}
          >
            {entities.map((entity: EntityTypes) => {
              return (
                <article
                  key={entity}
                  className="entity-of-tab-item"
                  onClick={() => setSelectedEntity(entity)}
                >
                  <span className="entity-of-tab-item-info">
                    {convertEntityInfo(entity)}
                  </span>
                </article>
              )
            })}
          </section>
        </div>
      </div>
    </div>
  )
}

export default EntityGroup
