import type { SpaceIconTypes } from './Icons.types';

export const ENTITY_TYPES = ['switch', 'sensor', 'weather', 'camera', 'button'] as const;

export type EntityTypes = typeof ENTITY_TYPES[number];

export type Card = {
    id: number;
    title: string;
    entity: string;
    img: string;
    type: EntityTypes
}
export type Space = {
    id: number;
    title: string;
    description?: string;
    cards: Card[];
    icon?: SpaceIconTypes | React.ReactNode;
    order: number;
};
export type SpacesState = { spaces: Space[] };
export type Action =
    | { type: 'loadSpaces'; state: SpacesState }
    | { type: 'changeSpace'; space: Space }
    | { type: 'addSpace'; space: Space }
    | { type: 'removeSpace'; id: number }
    | { type: 'addCard'; spaceId: number; card: Card }
    | { type: 'removeCard'; spaceId: number; cardId: number }
