import type { SpaceIconTypes } from '@/types/Icons.types'
import type { Card } from '@/types/card.types'

export type SpaceType = {
  id: number
  title: string
  description?: string
  cards: Card[]
  icon?: SpaceIconTypes | React.ReactNode
  order: number
}
export type SpacesState = { spaces: SpaceType[] }
export type Action =
  | { type: 'loadSpaces'; state: SpacesState }
  | { type: 'changeSpace'; space: SpaceType }
  | { type: 'addSpace'; space: SpaceType }
  | { type: 'removeSpace'; id: number }
  | { type: 'addCard'; spaceId: number; card: Card }
  | { type: 'removeCard'; spaceId: number; cardId: number }
  | { type: 'editCard'; spaceId: number; cardId: number; card: Card }
