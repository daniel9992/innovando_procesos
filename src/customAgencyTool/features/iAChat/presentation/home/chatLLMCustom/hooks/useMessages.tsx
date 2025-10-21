// import type { ConversationFile } from 'reachat';
// import { useState, useCallback } from 'react';

// interface Message {
//     id: string;
//     content: string;
//     files?: ConversationFile[];
//     timestamp: Date;
//     type: 'question' | 'response';
// }

// interface MessagesState {
//     messages: Message[];
//     isLoading: boolean;
//     error: Error | null;
// }

// export const useMessages = (sessionId?: string) => {
//     const [state, setState] = useState<MessagesState>({
//         messages: [],
//         isLoading: false,
//         error: null
//     });

//     const sendMessage = useCallback(
//         async (content: string, files?: File[]) => {
//             if (!sessionId) return;

//             setState((prev) => ({ ...prev, isLoading: true }));
//             try {
//                 // Aquí iría la lógica de envío del mensaje
//                 const newMessage: Message = {
//                     id: Date.now().toString(),
//                     content,
//                     files: files?.map((f) => ({ name: f.name, type: f.type })),
//                     timestamp: new Date(),
//                     type: 'question'
//                 };

//                 setState((prev) => ({
//                     ...prev,
//                     messages: [...prev.messages, newMessage],
//                     isLoading: false
//                 }));
//             } catch (error) {
//                 setState((prev) => ({
//                     ...prev,
//                     error: error as Error,
//                     isLoading: false
//                 }));
//             }
//         },
//         [sessionId]
//     );

//     return {
//         ...state,
//         sendMessage
//     };
// };
