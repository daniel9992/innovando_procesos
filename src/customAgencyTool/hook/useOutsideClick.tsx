import { type RefObject, useEffect, useRef } from 'react';

interface UseOutsideClickOptions {
    ref:
        | RefObject<HTMLElement | null>
        | RefObject<HTMLElement>[]
        | RefObject<HTMLDivElement | null>
        | RefObject<HTMLDivElement>[];
    handler: (event: MouseEvent | TouchEvent) => void;
    enabled?: boolean;
    mouseEvent?: 'mousedown' | 'mouseup' | 'click';
    touchEvent?: 'touchstart' | 'touchend';
    excludeRefs?: RefObject<HTMLElement>[];
    detectKeys?: boolean;
}

export const useOutsideClick = ({
    ref,
    handler,
    enabled = true,
    mouseEvent = 'mousedown',
    touchEvent = 'touchstart',
    excludeRefs = [],
    detectKeys = true
}: UseOutsideClickOptions) => {
    const savedHandler = useRef(handler);
    const refs = Array.isArray(ref) ? ref : [ref];

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        if (!enabled) return;

        const handleClick = (event: MouseEvent | TouchEvent) => {
            // Verificar si el click fue dentro de alguno de los refs excluidos
            const isClickInside = excludeRefs.some((excludeRef) =>
                excludeRef.current?.contains(event.target as Node)
            );

            if (isClickInside) return;

            // Verificar si el click fue fuera de todos los refs principales
            const isOutside = refs.every(
                (refItem) =>
                    !refItem.current?.contains(event.target as Node)
            );

            if (isOutside) {
                savedHandler.current(event);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (detectKeys && event.key === 'Escape') {
                savedHandler.current(event as unknown as MouseEvent);
            }
        };

        document.addEventListener(mouseEvent, handleClick);
        document.addEventListener(touchEvent, handleClick);
        if (detectKeys) {
            document.addEventListener('keyup', handleKeyUp);
        }

        return () => {
            document.removeEventListener(mouseEvent, handleClick);
            document.removeEventListener(touchEvent, handleClick);
            if (detectKeys) {
                document.removeEventListener('keyup', handleKeyUp);
            }
        };
    }, [refs, enabled, mouseEvent, touchEvent, excludeRefs, detectKeys]);
};
