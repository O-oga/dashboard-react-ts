import type { SpaceIconTypes } from './Icons.types';

export type Card = {
    id: number;
    title: string;
    entity: string;
    img: string;
    type: 'switch' | 'sensor' | 'light' | 'media' | 'lock' | 'window';
}
export type Space = {
    id: number;
    title: string;
    description?: string;
    cards: Card[];
    icon?: SpaceIconTypes | React.ReactNode;
    order?: number;
};
export type State = { spaces: Space[] };
export type Action =
    | { type: 'loadSpaces'; state: State }
    | { type: 'changeSpace'; space: Space }
    | { type: 'addSpace'; space: Space }
    | { type: 'removeSpace'; id: number }
    | { type: 'addCard'; spaceId: number; card: Card }
    | { type: 'removeCard'; spaceId: number; cardId: number }
