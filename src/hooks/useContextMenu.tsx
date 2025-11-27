import { useSpaces } from "@/contexts/SpacesContext";
import type { ClickedItem, MenuState } from "@/types/clickContext.types";
import { useEffect, useState } from "react";


export const useContextMenu = (
    position: { x: number, y: number },
    initialStateVisible: boolean = false,
    clickedItem: ClickedItem | null = null,
    onOpenAddCardModal?: () => void,
    onOpenAddSpaceModal?: () => void
) => {

    const { x, y } = position;
    const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(initialStateVisible);
    const [menuState, setMenuState] = useState<MenuState>({ 
        position: { x, y }, 
        clickedItem: clickedItem,
        visible: initialStateVisible 
    });
    const {
        removeCard,
        removeSpace,
    } = useSpaces();

    useEffect(() => {
        setContextMenuVisible(initialStateVisible);
    }, [initialStateVisible]);

    useEffect(() => {
        setMenuState({ 
            position: { x, y }, 
            clickedItem: clickedItem,
            visible: initialStateVisible 
        });
    }, [x, y, clickedItem, initialStateVisible]);


    const handleRemoveCard = () => {
        if (menuState.clickedItem?.type === 'space-card') {
            removeCard(menuState.clickedItem.spaceId, menuState.clickedItem.cardId);
        }
    }

    const handleEditCard = () => {
        if (menuState.clickedItem?.type === 'space-card') {
            setContextMenuVisible(false);
            if (onOpenAddCardModal) {
                onOpenAddCardModal();
            }
        }
    }

    const handleAddCard = () => {
        setContextMenuVisible(false);
        if (onOpenAddCardModal) {
            onOpenAddCardModal();
        }
    }

    const handleRemoveSpace = () => {
        if (menuState.clickedItem?.type === 'space') {
            setContextMenuVisible(false);
            removeSpace(menuState.clickedItem?.spaceId as number);
        }
    }
    const handleAddSpace = () => {
        setContextMenuVisible(false);

        if (onOpenAddSpaceModal && menuState.clickedItem?.type === 'space') {
            onOpenAddSpaceModal();
        }
    }
    const handleChangeSpace = () => {
        setContextMenuVisible(false);

    }
    return {
        contextMenuVisible,
        setContextMenuVisible,
        menuState,
        setMenuState,
        handleRemoveCard,
        handleEditCard,
        handleAddCard,
        handleRemoveSpace,
        handleAddSpace,
        handleChangeSpace,
    }
}