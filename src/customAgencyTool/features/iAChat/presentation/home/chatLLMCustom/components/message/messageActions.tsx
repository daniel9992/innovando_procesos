// // components/message/MessageActions.tsx

// import { MyButton, MyFlex } from '@src/customAgencyTool/components/ui';
// import { useNotificationAdapter } from '@src/customAgencyTool/context/toastAppNotification/useNotificationAdapter';
// import { cn } from 'reablocks';
// import { ChatContext } from 'reachat';
// import { type FC, useContext, useState } from 'react';
// import { FaCopy, FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
// import { SlRefresh } from 'react-icons/sl';

// interface MessageActionButton {
//     icon: React.ReactNode;
//     label: string;
//     onClick: () => void;
//     className?: string;
//     show?: boolean;
// }

// interface MessageActionsProps {
//     /**
//      * The question text to be copied
//      */
//     question: string;

//     /**
//      * The response text to be copied
//      */
//     response: string;

//     /**
//      * Custom copy icon
//      */
//     copyIcon?: React.ReactNode;

//     /**
//      * Custom thumbs up icon
//      */
//     thumbsUpIcon?: React.ReactNode;

//     /**
//      * Custom thumbs down icon
//      */
//     thumbsDownIcon?: React.ReactNode;

//     /**
//      * Custom refresh icon
//      */
//     refreshIcon?: React.ReactNode;

//     /**
//      * Callback when copy button is clicked
//      */
//     onCopy?: () => void;

//     /**
//      * Callback when upvote button is clicked
//      */
//     onUpvote?: () => void;

//     /**
//      * Callback when downvote button is clicked
//      */
//     onDownvote?: () => void;

//     /**
//      * Callback when refresh button is clicked
//      */
//     onRefresh?: () => void;

//     /**
//      * Custom class name for the container
//      */
//     className?: string;

//     /**
//      * Whether to show the copy button
//      */
//     showCopy?: boolean;

//     /**
//      * Whether to show the voting buttons
//      */
//     showVoting?: boolean;

//     /**
//      * Whether to show the refresh button
//      */
//     showRefresh?: boolean;
// }

// export const useClipboard = () => {
//     const { sendNotification } = useNotificationAdapter();

//     const copyToClipboard = async (text: string, successMessage?: string) => {
//         try {
//             await navigator.clipboard.writeText(text);
//             sendNotification({
//                 title: 'Texto copiado',
//                 message:
//                     successMessage || 'El texto se ha copiado al portapapeles',
//                 status: 'info',
//                 position: 'top-right'
//             });
//             return true;
//         } catch (error) {
//             console.error('Error copying to clipboard:', error);
//             sendNotification({
//                 title: 'Error',
//                 message: 'No se pudo copiar el texto',
//                 status: 'error',
//                 position: 'top-right'
//             });
//             return false;
//         }
//     };

//     return { copyToClipboard };
// };

// export const MessageActions: FC<MessageActionsProps> = ({
//     question,
//     response,
//     copyIcon = <FaCopy />,
//     thumbsUpIcon = <FaRegThumbsUp />,
//     thumbsDownIcon = <FaRegThumbsDown />,
//     refreshIcon = <SlRefresh />,
//     onCopy,
//     onUpvote,
//     onDownvote,
//     onRefresh,
//     className,
//     showCopy = true,
//     showVoting = true,
//     showRefresh = true
// }) => {
//     const { theme } = useContext(ChatContext);
//     const { copyToClipboard } = useClipboard();

//     const handleCopy = async () => {
//         if (onCopy) {
//             onCopy();
//         } else {
//             await copyToClipboard(`${question}\n${response}`);
//         }
//     };

//     const actions: MessageActionButton[] = [
//         {
//             icon: copyIcon,
//             label: 'Copy question and response',
//             onClick: handleCopy,
//             className: theme?.messages?.message?.footer?.copy,
//             show: showCopy
//         },
//         {
//             icon: thumbsUpIcon,
//             label: 'Upvote',
//             onClick: onUpvote || (() => {}),
//             className: theme?.messages?.message?.footer?.upvote,
//             show: showVoting
//         },
//         {
//             icon: thumbsDownIcon,
//             label: 'Downvote',
//             onClick: onDownvote || (() => {}),
//             className: theme?.messages?.message?.footer?.downvote,
//             show: showVoting
//         },
//         {
//             icon: refreshIcon,
//             label: 'Refresh',
//             onClick: onRefresh || (() => {}),
//             className: theme?.messages?.message?.footer?.refresh,
//             show: showRefresh
//         }
//     ];

//     const visibleActions = actions.filter((action) => action.show);

//     if (!visibleActions.length) return null;

//     return (
//         <MyFlex
//             direction="row"
//             gap={2}
//             className={cn(theme?.messages?.message?.footer?.base, className)}
//         >
//             {visibleActions.map((action, index) => (
//                 <ActionButton key={`message-action-${index}`} {...action} />
//             ))}
//         </MyFlex>
//     );
// };

// const ActionButton: FC<MessageActionButton> = ({
//     icon,
//     label,
//     onClick,
//     className
// }) => (
//     <MyButton
//         variant="ghost"
//         aria-label={label}
//         className={cn(className)}
//         onClick={onClick}
//     >
//         {icon}
//     </MyButton>
// );

// // Hook para manejar las acciones del mensaje (opcional)
// export const useMessageActions = (options: {
//     onCopy?: () => void;
//     onUpvote?: () => void;
//     onDownvote?: () => void;
//     onRefresh?: () => void;
// }) => {
//     const [votes, setVotes] = useState({ up: 0, down: 0 });
//     const [hasCopied, setHasCopied] = useState(false);
//     const [refreshCount, setRefreshCount] = useState(0);

//     const handleUpvote = () => {
//         setVotes((prev) => ({ ...prev, up: prev.up + 1 }));
//         options.onUpvote?.();
//     };

//     const handleDownvote = () => {
//         setVotes((prev) => ({ ...prev, down: prev.down + 1 }));
//         options.onDownvote?.();
//     };

//     const handleCopy = () => {
//         setHasCopied(true);
//         options.onCopy?.();
//     };

//     const handleRefresh = () => {
//         setRefreshCount((prev) => prev + 1);
//         options.onRefresh?.();
//     };

//     return {
//         votes,
//         hasCopied,
//         refreshCount,
//         handleUpvote,
//         handleDownvote,
//         handleCopy,
//         handleRefresh
//     };
// };

// export default MessageActions;
