import type { Card } from "./card.types";
import type { Space } from "./space.types";

export type ClickContextTypes =
    | 'navi-bar-card'
    | 'space'
    | 'space-card'

export type ContextMenuProps = {
    x: number;
    y: number;
    handleRemoveCard?: () => void;
    handleEditCard?: () => void;
    handleAddCard?: () => void;
    handleRemoveSpace?: () => void;
    handleAddSpace?: () => void;
    handleChangeSpace?: () => void;
    contextType: ClickContextTypes;
    visible: boolean;
}

export type MenuState = {
    position: { x: number, y: number };
    clickedItem: ClickedItem | null;
    visible: boolean;
}

export type ClickedItem = {
    type: 'space-card';
    spaceId: number;
    cardId: number;
    card: Card;
} | {
    type: 'space' | 'navi-bar-card';
    spaceId: number | null;
    space: Space;
} | null;