import type { IconComponent } from '@/types/Icons.types'

export const ENTITY_TYPES = [
  'switch',
  'sensor',
  'weather',
  'camera',
  'button',
] as const

export type EntityTypes = (typeof ENTITY_TYPES)[number]

export type CardSizeTypes = 'small' | 'medium' | 'large' | 'extra-large'

export type CardDataTypes = {
  name: string
  value: string | number | boolean | null
}

export type Card = {
  id: number
  title: string
  entity: string
  state: string
  card_data: CardDataTypes[]
  icon: IconComponent
  size: CardSizeTypes
  type: EntityTypes
}

export type CardCreationData = {
  title: string
  entity: string
  size: CardSizeTypes
  type: EntityTypes
  icon: IconComponent
  setSelectedIcon: (icon: IconComponent) => void
  tab: EntityTypes
  setSize: (size: CardSizeTypes) => void
}
