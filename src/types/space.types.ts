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
    icon?: React.ReactNode;
    order?: number;
};
export type State = { spaces: Space[] };
export type Action =
    | { type: 'loadSpaces'; state: State }
    | { type: 'changeTitle'; id: number; title: string }
    | { type: 'changeOrder'; id: number; order: number }
    | { type: 'add'; space: Space }
    | { type: 'remove'; id: number };