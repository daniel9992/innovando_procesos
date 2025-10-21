// import { type Session } from 'reachat';
// import { useCallback, useState } from 'react';

// interface ChatState {
//     sessions: Session[];
//     activeSessionId: string | undefined;
//     isLoading: boolean;
//     error: Error | null;
// }

// export const useChat = () => {
//     const [state, setState] = useState<ChatState>({
//         sessions: [],
//         activeSessionId: undefined,
//         isLoading: false,
//         error: null
//     });

//     const setActiveSession = useCallback((sessionId: string) => {
//         setState((prev) => ({ ...prev, activeSessionId: sessionId }));
//     }, []);

//     const createSession = useCallback(() => {
//         const newSession: Session = {
//             id: Date.now().toString(),
//             title: 'New Session',
//             createdAt: new Date(),
//             conversations: []
//         };

//         setState((prev) => ({
//             ...prev,
//             sessions: [...prev.sessions, newSession],
//             activeSessionId: newSession.id
//         }));

//         return newSession;
//     }, []);

//     const deleteSession = useCallback((sessionId: string) => {
//         setState((prev) => ({
//             ...prev,
//             sessions: prev.sessions.filter((s) => s.id !== sessionId),
//             activeSessionId:
//                 prev.activeSessionId === sessionId
//                     ? undefined
//                     : prev.activeSessionId
//         }));
//     }, []);

//     return {
//         ...state,
//         setActiveSession,
//         createSession,
//         deleteSession
//     };
// };
