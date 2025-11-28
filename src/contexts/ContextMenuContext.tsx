import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { ClickedItem, ClickContextTypes } from '@/types/clickContext.types';
import { useSpaces } from './SpacesContext';

type ContextMenuState = {
    position: { x: number; y: number };
    clickedItem: ClickedItem | null;
    visible: boolean;
    contextType: ClickContextTypes;
    key: number;
};

type ContextMenuContextType = {
    openContextMenu: (
        e: React.MouseEvent,
        clickedItem: ClickedItem,
        contextType: ClickContextTypes
    ) => void;
    closeContextMenu: () => void;
    menuState: ContextMenuState | null;
    handleRemoveCard: () => void;
    handleEditCard: () => void;
    handleAddCard: () => void;
    handleRemoveSpace: () => void;
    handleAddSpace: () => void;
    handleChangeSpace: () => void;
    setOnOpenAddCardModal: (callback: (() => void) | null) => void;
    setOnOpenAddSpaceModal: (callback: (() => void) | null) => void;
};

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(undefined);

export const ContextMenuProvider = ({ children }: { children: ReactNode }) => {
    const [menuState, setMenuState] = useState<ContextMenuState | null>(null);
    const onOpenAddCardModalRef = useRef<(() => void) | null>(null);
    const onOpenAddSpaceModalRef = useRef<(() => void) | null>(null);

    const { removeCard, removeSpace } = useSpaces();

    const openContextMenu = useCallback((
        e: React.MouseEvent,
        clickedItem: ClickedItem,
        contextType: ClickContextTypes
    ) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuState({
            position: { x: e.clientX, y: e.clientY },
            clickedItem,
            visible: true,
            contextType,
            key: Date.now(),
        });
    }, []);

    const closeContextMenu = useCallback(() => {
        setMenuState((states) =>
            states ? {
                ...states,
                visible: false,
                key: Date.now(),
            } : null
        );
    }, []);

    const handleRemoveCard = useCallback(() => {
        closeContextMenu();
        if (menuState?.clickedItem?.type === 'space-card') {
            removeCard(menuState.clickedItem.spaceId, menuState.clickedItem.cardId);
        }
    }, [menuState, removeCard, closeContextMenu]);

    const handleEditCard = useCallback(() => {
        closeContextMenu();
        if (menuState?.clickedItem?.type === 'space-card' && onOpenAddCardModalRef.current) {
            onOpenAddCardModalRef.current();
        }
    }, [menuState, closeContextMenu]);

    const handleAddCard = useCallback(() => {
        closeContextMenu();
        if (onOpenAddCardModalRef.current) {
            onOpenAddCardModalRef.current();
        }
    }, [closeContextMenu]);

    const handleRemoveSpace = useCallback(() => {
        closeContextMenu();
        if (menuState?.clickedItem) {
            if (menuState.clickedItem.type === 'space' || menuState.clickedItem.type === 'navi-bar-card') {
                removeSpace(menuState.clickedItem.spaceId as number);
            }
        }
    }, [menuState, removeSpace, closeContextMenu]);

    const handleAddSpace = useCallback(() => {
        closeContextMenu();
        if (menuState?.clickedItem?.type === 'space' && onOpenAddSpaceModalRef.current) {
            onOpenAddSpaceModalRef.current();
        }
    }, [menuState, closeContextMenu]);

    const handleChangeSpace = useCallback(() => {
        closeContextMenu();
        // TODO: Implement change space functionality
    }, [closeContextMenu]);

    const setOnOpenAddCardModal = useCallback((callback: (() => void) | null) => {
        onOpenAddCardModalRef.current = callback;
    }, []);

    const setOnOpenAddSpaceModal = useCallback((callback: (() => void) | null) => {
        onOpenAddSpaceModalRef.current = callback;
    }, []);

    // Close context menu on click outside or Escape key
    useEffect(() => {
        if (!menuState?.visible) { return; }

        const handleClick = () => closeContextMenu();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeContextMenu();
            }
        };

        document.addEventListener('click', handleClick);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [menuState?.visible, closeContextMenu]);

    return (
        <ContextMenuContext.Provider
            value={{
                openContextMenu,
                closeContextMenu,
                menuState,
                handleRemoveCard,
                handleEditCard,
                handleAddCard,
                handleRemoveSpace,
                handleAddSpace,
                handleChangeSpace,
                setOnOpenAddCardModal,
                setOnOpenAddSpaceModal,
            }}
        >
            {children}
        </ContextMenuContext.Provider>
    );
};

export const useContextMenuContext = () => {
    const context = useContext(ContextMenuContext);
    if (context === undefined) {
        throw new Error('useContextMenuContext must be used within a ContextMenuProvider');
    }
    return context;
};

