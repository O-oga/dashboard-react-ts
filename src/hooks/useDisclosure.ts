import { useCallback, useEffect, useState } from "react";


export const useDisclosure = (initialState: boolean = false, {onOpen, onClose}: {onOpen?: () => void, onClose?: () => void}) => {
    const [isOpen, setIsOpen] = useState<boolean>(initialState);

    useEffect(() => {
        setIsOpen(initialState);
    }, [initialState]);

    const open = useCallback(() => {
        setIsOpen(true);
        if (typeof onOpen === 'function') {
            onOpen();
        }
    }, [onOpen]);

    const close = useCallback(() => {
        setIsOpen(false);
        if (typeof onClose === 'function') {
            onClose();
        }
    }, [onClose]);

    const toggle = useCallback(() => {
        isOpen ? close() : open();
    }, [isOpen, close, open]);

    return { isOpen, open, close, toggle};
}