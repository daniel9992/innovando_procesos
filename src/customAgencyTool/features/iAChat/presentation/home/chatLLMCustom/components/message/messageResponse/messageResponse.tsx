// // components/message/MessageResponse.tsx

// import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
// import { MyFlex, MyText } from '@src/customAgencyTool/components/ui';
// import { useMemo, useState, type FC } from 'react';
// import { formatResponse, type FormatOptions } from './formatters';
// import { MetricsDisplay, type ResponseMetrics } from './metrics';
// import { ResponseText } from './responseText';

// interface MessageResponseProps {
//     /**
//      * The response text to display
//      */
//     response: string;

//     /**
//      * Whether the response is loading
//      */
//     isLoading?: boolean;

//     /**
//      * Custom loading component
//      */
//     loadingComponent?: React.ReactNode;

//     /**
//      * Custom loading text
//      */
//     loadingText?: string;

//     /**
//      * Custom class name for the container
//      */
//     className?: string;

//     /**
//      * Custom style for the response text
//      */
//     responseStyle?: React.CSSProperties;

//     /**
//      * Custom prefix for the response
//      */
//     prefix?: string;

//     /**
//      * Whether to show the border
//      */
//     showBorder?: boolean;

//     /**
//      * Border configuration
//      */
//     borderConfig?: {
//         color?: string;
//         width?: number;
//         style?: 'solid' | 'dashed' | 'dotted';
//         position?: 'left' | 'right' | 'top' | 'bottom';
//     };

//     /**
//      * Animation configuration
//      */
//     animation?: {
//         enabled: boolean;
//         duration?: number;
//         type?: 'fade' | 'slide' | 'scale';
//     };

//     /**
//      * Error state configuration
//      */
//     error?: {
//         hasError: boolean;
//         message?: string;
//     };
// }

// const defaultBorderConfig = {
//     color: 'blue',
//     width: 2,
//     style: 'solid' as const,
//     position: 'left' as const
// };

// const defaultAnimation = {
//     enabled: true,
//     duration: 300,
//     type: 'fade' as const
// };

// export const MessageResponse: FC<MessageResponseProps> = ({
//     response,
//     isLoading = false,
//     loadingComponent,
//     loadingText = 'Cargando...',
//     className,
//     responseStyle,
//     prefix = 'This is the response: ',
//     showBorder = true,
//     borderConfig = defaultBorderConfig,
//     animation = defaultAnimation,
//     error
// }) => {
//     const getBorderStyle = () => {
//         if (!showBorder) return {};

//         const { color, width, style, position } = {
//             ...defaultBorderConfig,
//             ...borderConfig
//         };
//         const borderProperty = `border${
//             position.charAt(0).toUpperCase() + position.slice(1)
//         }`;

//         return {
//             [borderProperty]: `${width}px ${style} ${color}`
//         };
//     };

//     const getAnimationStyle = () => {
//         if (!animation.enabled) return {};

//         const { type, duration } = animation;
//         return {
//             animation: `${type}-in ${duration}ms ease-out`
//         };
//     };

//     if (isLoading) {
//         return loadingComponent || <LoadingWithText text={loadingText} />;
//     }

//     if (error?.hasError) {
//         return (
//             <ErrorResponse
//                 message={
//                     error.message ||
//                     'An error occurred while generating the response'
//                 }
//             />
//         );
//     }

//     return (
//         <ResponseContainer
//             className={className}
//             style={{
//                 ...getBorderStyle(),
//                 ...getAnimationStyle(),
//                 ...responseStyle
//             }}
//         >
//             <ResponseText prefix={prefix} response={response} />
//         </ResponseContainer>
//     );
// };

// interface ResponseContainerProps {
//     children: React.ReactNode;
//     className?: string;
//     style?: React.CSSProperties;
// }

// const ResponseContainer: FC<ResponseContainerProps> = ({
//     children,
//     className,
//     style
// }) => (
//     <MyFlex
//         direction="column"
//         py={2}
//         px={2}
//         mb={2}
//         className={className}
//         style={style}
//     >
//         {children}
//     </MyFlex>
// );

// interface ErrorResponseProps {
//     message: string;
// }

// const ErrorResponse: FC<ErrorResponseProps> = ({ message }) => (
//     <MyText color="red.500" py={2} px={2}>
//         <strong>Error: </strong>
//         {message}
//     </MyText>
// );

// // Hook personalizado para manejar el estado de la respuesta
// export const useMessageResponse = (initialResponse: string = '') => {
//     const [response, setResponse] = useState(initialResponse);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<{ hasError: boolean; message?: string }>(
//         {
//             hasError: false
//         }
//     );

//     const updateResponse = (newResponse: string) => {
//         setResponse(newResponse);
//         setError({ hasError: false });
//     };

//     const startLoading = () => {
//         setIsLoading(true);
//         setError({ hasError: false });
//     };

//     const stopLoading = () => {
//         setIsLoading(false);
//     };

//     const setErrorState = (message?: string) => {
//         setError({
//             hasError: true,
//             message
//         });
//         setIsLoading(false);
//     };

//     const reset = () => {
//         setResponse('');
//         setIsLoading(false);
//         setError({ hasError: false });
//     };

//     return {
//         response,
//         isLoading,
//         error,
//         updateResponse,
//         startLoading,
//         stopLoading,
//         setErrorState,
//         reset
//     };
// };

// // Componente para respuestas con formato enriquecido (opcional)
// interface RichResponseProps extends MessageResponseProps {
//     formatOptions?: FormatOptions;
//     showMetrics?: boolean;
//     showDetailedMetrics?: boolean;
// }

// export const RichMessageResponse: FC<RichResponseProps> = ({
//     response,
//     formatOptions = {
//         code: true,
//         links: true,
//         markdown: true,
//         tables: true,
//         images: true,
//         latex: false,
//         syntax: {
//             theme: 'github',
//             language: 'auto'
//         }
//     },
//     showMetrics = true,
//     showDetailedMetrics = false,
//     ...props
// }) => {
//     const [metrics, setMetrics] = useState<ResponseMetrics>({
//         characters: 0,
//         words: 0,
//         responseTime: 0,
//         codeBlocks: 0,
//         tables: 0,
//         images: 0,
//         timestamp: new Date()
//     });

//     const formattedResponse = useMemo(() => {
//         const startTime = performance.now();
//         const formattedResponse = formatResponse(response, formatOptions);
//         const endTime = performance.now();

//         setMetrics({
//             characters: response.length,
//             words: response.split(/\s+/).length,
//             responseTime: Math.round(endTime - startTime),
//             codeBlocks: (response.match(/```/g) || []).length / 2,
//             tables: (response.match(/\|/g) || []).length,
//             images: (response.match(/!\[.*?\]\(.*?\)/g) || []).length,
//             timestamp: new Date()
//         });

//         return formattedResponse;
//     }, [response, formatOptions]);

//     return (
//         <MyFlex direction="column" gap={2}>
//             <MessageResponse {...props} response={formattedResponse} />
//             {showMetrics && (
//                 <MetricsDisplay
//                     metrics={metrics}
//                     showDetailed={showDetailedMetrics}
//                 />
//             )}
//         </MyFlex>
//     );
// };

// export type {
//     ErrorResponseProps,
//     MessageResponseProps,
//     ResponseContainerProps,
//     RichResponseProps
// };

// export default MessageResponse;
