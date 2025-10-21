// // components/session/SessionHeader/SessionHeader.tsx

// import { MyFlex, MyHeading, MyText } from '@src/customAgencyTool/components/ui';
// import { ShowDate } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
// import { ChatContext } from 'reachat';
// import { type FC, useContext, useState } from 'react';

// interface SessionHeaderProps {
//     /**
//      * Custom class name for the container
//      */
//     className?: string;

//     /**
//      * Date format for display
//      */
//     dateFormat?: string;

//     /**
//      * Locale for date formatting
//      */
//     locale?: string;

//     /**
//      * Whether to show the session date
//      */
//     showDate?: boolean;

//     /**
//      * Custom style variant
//      */
//     variant?: 'default' | 'compact' | 'expanded';

//     /**
//      * Whether to show session status
//      */
//     showStatus?: boolean;

//     /**
//      * Custom title formatter
//      */
//     titleFormatter?: (title: string) => string;

//     /**
//      * Animation configuration
//      */
//     animation?: {
//         enabled: boolean;
//         type?: 'fade' | 'slide';
//         duration?: number;
//     };
// }

// interface SessionStatus {
//     type: 'active' | 'archived' | 'pending';
//     label: string;
//     colorScheme: 'success' | 'info' | 'default';
// }

// const getSessionStatus = (date: Date): SessionStatus => {
//     const now = new Date();
//     const diffDays = Math.floor(
//         (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
//     );

//     if (diffDays < 1)
//         return {
//             type: 'active',
//             label: 'Active',
//             colorScheme: 'success'
//         };
//     if (diffDays < 7)
//         return {
//             type: 'pending',
//             label: 'Recent',
//             colorScheme: 'info'
//         };
//     return {
//         type: 'archived',
//         label: 'Archived',
//         colorScheme: 'default'
//     };
// };

// const variants = {
//     default: {
//         padding: 4,
//         titleSize: 'xl',
//         dateSize: 'sm'
//     },
//     compact: {
//         padding: 2,
//         titleSize: 'lg',
//         dateSize: 'xs'
//     },
//     expanded: {
//         padding: 6,
//         titleSize: '2xl',
//         dateSize: 'md'
//     }
// };

// export const SessionHeader: FC<SessionHeaderProps> = ({
//     dateFormat = 'D [de] MMMM [del] YYYY hh:mm:ss',
//     locale = 'es',
//     showDate = true,
//     variant = 'default',
//     showStatus = true,
//     titleFormatter = (title) => title,
//     animation = { enabled: true, type: 'fade', duration: 300 }
// }) => {
//     const { activeSession } = useContext(ChatContext);
//     const styles = variants[variant];

//     if (!activeSession) return null;

//     const status = getSessionStatus(activeSession.createdAt as Date);

//     const getAnimationStyle = () => {
//         if (!animation.enabled) return {};

//         return {
//             _open: {
//                 animation: `${animation.type}-in ${animation.duration}ms ease-out`
//             },
//             _closed: {
//                 animation: `${animation.type}Out ${animation.duration}ms ease-in`
//             }
//         };
//     };

//     return (
//         <MyFlex
//             direction="column"
//             gap={2}
//             p={styles.padding}
//             {...getAnimationStyle()}
//         >
//             <HeaderContent
//                 session={activeSession}
//                 styles={styles}
//                 showDate={showDate}
//                 showStatus={showStatus}
//                 dateFormat={dateFormat}
//                 locale={locale}
//                 titleFormatter={titleFormatter}
//             />
//         </MyFlex>
//     );
// };

// interface HeaderContentProps {
//     session: any; // Tipo específico de Session
//     styles: (typeof variants)['default'];
//     showDate: boolean;
//     showStatus: boolean;
//     dateFormat: string;
//     locale: string;
//     titleFormatter: (title: string) => string;
// }

// const HeaderContent: FC<HeaderContentProps> = ({
//     session,
//     styles,
//     showDate,
//     showStatus,
//     dateFormat,
//     locale,
//     titleFormatter
// }) => {
//     const status = getSessionStatus(session.createdAt as Date);

//     return (
//         <>
//             <MyFlex direction="row" justify="space-between" align="center">
//                 <MyHeading fontSize={styles.titleSize} fontWeight="semibold">
//                     {titleFormatter(session.title)}
//                 </MyHeading>

//                 {showStatus && (
//                     <MyText
//                         //colorScheme={status.colorScheme}

//                         fontSize={'0.8rem'}
//                     >
//                         {status.label}
//                     </MyText>
//                 )}
//             </MyFlex>

//             {showDate && (
//                 <MyText fontSize={styles.dateSize} color="gray.500">
//                     {ShowDate(session.createdAt as Date, dateFormat, locale)}
//                 </MyText>
//             )}
//         </>
//     );
// };

// // Componente editable del encabezado
// interface EditableSessionHeaderProps extends SessionHeaderProps {
//     onTitleChange: (newTitle: string) => void;
// }

// export const EditableSessionHeader: FC<EditableSessionHeaderProps> = ({
//     onTitleChange,
//     ...props
// }) => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [editableTitle, setEditableTitle] = useState(props.title || '');

//     const handleTitleChange = (newTitle: string) => {
//         setEditableTitle(newTitle);
//         onTitleChange(newTitle);
//         setIsEditing(false);
//     };

//     return (
//         <SessionHeader
//             {...props}
//             titleFormatter={(title) =>
//                 isEditing ? (
//                     <MyFlex direction="row" gap={2}>
//                         <MyInput
//                             value={editableTitle}
//                             onChange={(e) => setEditableTitle(e.target.value)}
//                             onBlur={() => handleTitleChange(editableTitle)}
//                             autoFocus
//                             size="sm"
//                         />
//                     </MyFlex>
//                 ) : (
//                     <MyFlex
//                         direction="row"
//                         gap={2}
//                         align="center"
//                         onClick={() => setIsEditing(true)}
//                         cursor="pointer"
//                     >
//                         <MyText>{title}</MyText>
//                         <MyIcon
//                             name="EDIT"
//                             size="sm"
//                             color="gray.400"
//                             _hover={{ color: 'gray.600' }}
//                         />
//                     </MyFlex>
//                 )
//             }
//         />
//     );
// };

// export default SessionHeader;
