// // components/message/MessageQuestion.tsx

// import {
//     MyButton,
//     MyFlex,
//     MyText,
//     MyTextArea
// } from '@src/customAgencyTool/components/ui';
// import { type ConversationFile } from 'reachat';
// import { type FC, useState } from 'react';
// import FileList from '../file/fileList';

// interface MessageQuestionProps {
//     /**
//      * The question text to display
//      */
//     question: string;

//     /**
//      * Array of files attached to the question
//      */
//     files?: ConversationFile[];

//     /**
//      * Custom class name for the container
//      */
//     className?: string;

//     /**
//      * Custom style for the question text
//      */
//     questionStyle?: React.CSSProperties;

//     /**
//      * Custom prefix for the question
//      */
//     prefix?: string;

//     /**
//      * Whether to show the files section
//      */
//     showFiles?: boolean;

//     /**
//      * Callback when a file is clicked
//      */
//     onFileClick?: (file: ConversationFile) => void;

//     /**
//      * Whether files can be deleted
//      */
//     filesAreDeletable?: boolean;

//     /**
//      * Callback when a file is deleted
//      */
//     onFileDelete?: (fileIndex: number) => void;

//     /**
//      *  onClick event for the question
//      */
//     onClick?: () => void;

//     /**
//      * Animation configuration
//      */
//     animation?: {
//         enabled: boolean;
//         duration?: number;
//         type?: 'fade' | 'slide' | 'scale';
//     };
// }

// export const defaultAnimation = {
//     fade: {
//         _open: {
//             animation: 'fade-in 300ms ease-out'
//         },
//         _closed: {
//             animation: 'fadeOut 300ms ease-in'
//         }
//     },
//     slide: {
//         _open: {
//             animation: 'slide-in 300ms ease-out'
//         },
//         _closed: {
//             animation: 'slideOut 300ms ease-in'
//         }
//     },
//     scale: {
//         _open: {
//             animation: 'scale-in 300ms ease-out'
//         },
//         _closed: {
//             animation: 'scaleOut 300ms ease-in'
//         }
//     }
// };

// export const MessageQuestion: FC<MessageQuestionProps> = ({
//     question,
//     files,
//     className,
//     questionStyle,
//     prefix = 'This is my question: ',
//     showFiles = true,
//     onFileClick,
//     filesAreDeletable = false,
//     onFileDelete,
//     animation = { enabled: true, type: 'fade', duration: 300 }
// }) => {
//     const getAnimationStyle = () => {
//         if (!animation.enabled) return {};

//         const animationType = animation.type || 'fade';
//         const duration = animation.duration || 300;

//         return {
//             _open: {
//                 animation: `${animationType}-in ${duration}ms ease-out`
//             },
//             _closed: {
//                 animation: `${animationType}Out ${duration}ms ease-in`
//             }
//         };
//     };

//     return (
//         <MyFlex
//             direction={'column'}
//             gap={2}
//             p={0}
//             className={className}
//             {...getAnimationStyle()}
//         >
//             <QuestionText
//                 prefix={prefix}
//                 question={question}
//                 style={questionStyle}
//             />

//             {showFiles && files && files.length > 0 && (
//                 <FileList
//                     files={files}
//                     onFileClick={onFileClick}
//                     onDeleteFile={onFileDelete}
//                     isDeletable={filesAreDeletable}
//                     isClickable={!!onFileClick}
//                 />
//             )}
//         </MyFlex>
//     );
// };

// interface QuestionTextProps {
//     prefix: string;
//     question: string;
//     style?: React.CSSProperties;
// }

// const QuestionText: FC<QuestionTextProps> = ({ prefix, question, style }) => (
//     <MyText fontWeight={'semibold'} style={style}>
//         <span style={{ color: '#1361ce' }}>{prefix}</span>
//         {question}
//     </MyText>
// );

// // Hook personalizado para manejar el estado de la pregunta
// export const useMessageQuestion = (initialQuestion: string = '') => {
//     const [question, setQuestion] = useState(initialQuestion);
//     const [files, setFiles] = useState<ConversationFile[]>([]);
//     const [isEditing, setIsEditing] = useState(false);

//     const updateQuestion = (newQuestion: string) => {
//         setQuestion(newQuestion);
//     };

//     const addFiles = (newFiles: ConversationFile[]) => {
//         setFiles((prev) => [...prev, ...newFiles]);
//     };

//     const removeFile = (index: number) => {
//         setFiles((prev) => prev.filter((_, i) => i !== index));
//     };

//     const clearFiles = () => {
//         setFiles([]);
//     };

//     const toggleEdit = () => {
//         setIsEditing((prev) => !prev);
//     };

//     return {
//         question,
//         files,
//         isEditing,
//         updateQuestion,
//         addFiles,
//         removeFile,
//         clearFiles,
//         toggleEdit
//     };
// };

// // Componente editable de la pregunta (opcional)
// interface EditableQuestionProps extends MessageQuestionProps {
//     onQuestionChange: (newQuestion: string) => void;
//     onCancel: () => void;
//     onSave: () => void;
// }

// export const EditableMessageQuestion: FC<EditableQuestionProps> = ({
//     question,
//     onQuestionChange,
//     onCancel,
//     onSave,
//     ...props
// }) => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [editedQuestion, setEditedQuestion] = useState(question);

//     const handleSave = () => {
//         onQuestionChange(editedQuestion);
//         setIsEditing(false);
//         onSave();
//     };

//     const handleCancel = () => {
//         setEditedQuestion(question);
//         setIsEditing(false);
//         onCancel();
//     };

//     if (isEditing) {
//         return (
//             <MyFlex direction="column" gap={2}>
//                 <MyTextArea
//                     value={editedQuestion}
//                     onChange={(e) => setEditedQuestion(e.target.value)}
//                     autoFocus
//                 />
//                 <MyFlex direction="row" gap={2}>
//                     <MyButton onClick={handleSave}>Save</MyButton>
//                     <MyButton onClick={handleCancel} variant="ghost">
//                         Cancel
//                     </MyButton>
//                 </MyFlex>
//             </MyFlex>
//         );
//     }

//     return (
//         <MessageQuestion
//             {...props}
//             question={question}
//             questionStyle={{ cursor: 'pointer' }}
//             onClick={() => setIsEditing(true)}
//         />
//     );
// };

// export type { EditableQuestionProps, MessageQuestionProps, QuestionTextProps };

// export default MessageQuestion;
