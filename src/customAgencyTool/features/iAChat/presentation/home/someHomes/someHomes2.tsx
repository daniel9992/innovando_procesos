import {
    MyButton,
    MyFlex,
    MyInputText
} from '@src/customAgencyTool/components/ui';
import { model } from '@src/customAgencyTool/core/services/firebase.server';
import { useEffect, useMemo, useState } from 'react';
import type {
    ChatHistory,
    StreamResponse
} from '../../../domain/chatGenerate.model';
import { ChatStreamManager } from '../../../infrastructure/chatGenerativeModel/chatStreamManager';
import { contentGeneratorStreamManager } from '../../../infrastructure/compositionRoot';

export const ContentGeneratorStreamManagerTest = () => {
    const chatManager = contentGeneratorStreamManager;

    const [response, setResponse] = useState<string>('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [status, setStatus] = useState<string>('idle');
    const [streamResponse, setStreamResponse] = useState<StreamResponse>();

    const [prompt, setPrompt] = useState<string>('');

    useEffect(() => {
        const subscription = chatManager.getStream().subscribe({
            next: (streamResponse) => {
                setStreamResponse(streamResponse);
                setResponse((prev) => prev + streamResponse.text);
                setIsStreaming(!streamResponse.isComplete);
                setStatus(streamResponse.status || 'idle');
                if (streamResponse.error) {
                    console.error('streamResponse.error', streamResponse.error);
                    setError(streamResponse.error);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [chatManager]);

    useEffect(() => {
        if (!streamResponse) {
            return;
        }

        if (streamResponse.isComplete) {
            console.log('streamResponse', streamResponse);
        }
    }, [streamResponse]);

    const handleOnSearch = async () => {
        try {
            // TODO: con este metodo se puede pasar un arreglo de partes
            // TODO: para que tenga contexto el modelo
            // ? se requiere al menos uno con todo el contexto
            await chatManager.startStream({
                prompt
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleOnRefresh = async (prompt: string) => {
        try {
            await chatManager.startStream({ prompt });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Home</h2>

            <MyFlex bg={'bg.muted'} direction={'column'} gap={3}>
                <MyInputText
                    placeholder={'Escribe tu pregunta'}
                    value={prompt}
                    onChange={(e) => {
                        setPrompt(e.target.value);
                    }}
                />

                <MyFlex>
                    <MyButton leftIcon={'Chatbot'} onClick={handleOnSearch}>
                        Buscar
                    </MyButton>
                    <MyButton
                        leftIcon={'Reset'}
                        onClick={() => {
                            setPrompt('');
                        }}
                    >
                        Borrar Prompt
                    </MyButton>
                </MyFlex>
                <MyFlex>
                    <MyButton
                        leftIcon={'Reset'}
                        onClick={() => {
                            handleOnRefresh(prompt);
                        }}
                    >
                        Refresh
                    </MyButton>
                    <MyButton
                        leftIcon={'Stop'}
                        onClick={() => {
                            chatManager.stopStream();
                        }}
                    >
                        Stop
                    </MyButton>

                    <MyButton
                        leftIcon={'TRASH'}
                        onClick={() => {
                            setResponse('');
                        }}
                    >
                        Borrar Result
                    </MyButton>
                </MyFlex>
            </MyFlex>

            <p>Is streaming: {isStreaming ? 'true' : 'false'}</p>
            <p>Status: {status}</p>
            <p>Error: {error?.message}</p>
            <div>
                <p>History:</p>
                <pre>{JSON.stringify(chatManager.getHistory(), null, 2)}</pre>
            </div>
            <p>Response: {response}</p>
        </div>
    );
};

export const ChatStreamManagerTest = () => {
    const chatManager = useMemo(() => {
        const savedHistory: ChatHistory = [
            {
                role: 'user',
                parts: [{ text: 'Enséñame a cocinar Gallo Pinto.' }]
            },
            {
                role: 'model',
                parts: [
                    { text: '¡Claro! Primero necesitas arroz y frijoles...' }
                ]
            }
        ];
        return new ChatStreamManager(model, savedHistory);
    }, []);

    const [response, setResponse] = useState<string>('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [status, setStatus] = useState<string>('idle');
    const [streamResponse, setStreamResponse] = useState<StreamResponse>();

    const [prompt, setPrompt] = useState<string>('');

    useEffect(() => {
        const subscription = chatManager.getStream().subscribe({
            next: (streamResponse) => {
                setStreamResponse(streamResponse);
                setResponse((prev) => prev + streamResponse.text);
                setIsStreaming(!streamResponse.isComplete);
                setStatus(streamResponse.status || 'idle');
                if (streamResponse.error) {
                    console.error('streamResponse.error', streamResponse.error);
                    setError(streamResponse.error);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [chatManager]);

    useEffect(() => {
        if (!streamResponse) {
            return;
        }

        if (streamResponse.isComplete) {
            console.log('streamResponse', streamResponse);
        }
    }, [streamResponse]);

    const handleOnSearch = async () => {
        try {
            await chatManager.startStream({ prompt });
        } catch (error) {
            console.error(error);
        }
    };

    const handleOnRefresh = async (prompt: string) => {
        try {
            await chatManager.startStream({ prompt });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Home</h2>

            <MyFlex bg={'bg.muted'} direction={'column'} gap={3}>
                <MyInputText
                    placeholder={'Escribe tu pregunta'}
                    value={prompt}
                    onChange={(e) => {
                        setPrompt(e.target.value);
                    }}
                />

                <MyFlex>
                    <MyButton leftIcon={'Chatbot'} onClick={handleOnSearch}>
                        Buscar
                    </MyButton>
                    <MyButton
                        leftIcon={'Reset'}
                        onClick={() => {
                            setPrompt('');
                        }}
                    >
                        Borrar Prompt
                    </MyButton>
                </MyFlex>
                <MyFlex>
                    <MyButton
                        leftIcon={'Reset'}
                        onClick={() => {
                            handleOnRefresh(prompt);
                        }}
                    >
                        Refresh
                    </MyButton>
                    <MyButton
                        leftIcon={'Stop'}
                        onClick={() => {
                            chatManager.stopStream();
                        }}
                    >
                        Stop
                    </MyButton>

                    <MyButton
                        leftIcon={'TRASH'}
                        onClick={() => {
                            setResponse('');
                        }}
                    >
                        Borrar Result
                    </MyButton>
                </MyFlex>
            </MyFlex>

            <p>Is streaming: {isStreaming ? 'true' : 'false'}</p>
            <p>Status: {status}</p>
            <p>Error: {error?.message}</p>
            <div>
                <p>History:</p>
                <pre>{JSON.stringify(chatManager.getHistory(), null, 2)}</pre>
            </div>
            <p>Response: {response}</p>
        </div>
    );
};
