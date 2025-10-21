import { useCallback } from 'react';

interface ChatActions {
    onUpvote: (messageId: string) => void;
    onDownvote: (messageId: string) => void;
    onCopy: (content: string) => void;
    onRefresh: (messageId: string) => void;
}

export const useChatActions = (): ChatActions => {
    const handleUpvote = useCallback((messageId: string) => {
        // Implementar lógica de upvote
        console.log('Upvoted message:', messageId);
    }, []);

    const handleDownvote = useCallback((messageId: string) => {
        // Implementar lógica de downvote
        console.log('Downvoted message:', messageId);
    }, []);

    const handleCopy = useCallback((content: string) => {
        navigator.clipboard
            .writeText(content)
            .then(() => console.log('Content copied'))
            .catch((err) => console.error('Copy failed:', err));
    }, []);

    const handleRefresh = useCallback((messageId: string) => {
        // Implementar lógica de refresh
        console.log('Refreshing message:', messageId);
    }, []);

    return {
        onUpvote: handleUpvote,
        onDownvote: handleDownvote,
        onCopy: handleCopy,
        onRefresh: handleRefresh
    };
};
